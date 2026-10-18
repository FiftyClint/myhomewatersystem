import type { Sql } from '../db/sql.ts';
import type { Policy } from '../domain/config.ts';
import type { JobOutcome } from '../worker/jobs.ts';
import { exceptionStmt, getOpportunity } from '../domain/repo.ts';
import { enforce, TRIAGE_PROMPT_VERSION, type TriageModel } from './triage.ts';
import { costMicrocents } from './pricing.ts';
import { nowIso, uuid } from '../util.ts';

export async function monthSpendMicrocents(db: Sql, now: Date): Promise<number> {
  const start = `${now.toISOString().slice(0, 7)}-01T00:00:00.000Z`;
  return (await db.prepare('SELECT COALESCE(SUM(cost_microcents), 0) AS n FROM agent_runs WHERE created_at >= ?')
    .bind(start).first<{ n: number }>())!.n;
}

// Executor for the triage proposal. The only effects are internal: an audit row and, when warranted,
// an exception for the coordinator. Pipeline state is never changed here.
export async function runTriage(db: Sql, policy: Policy, model: TriageModel | undefined, opportunityId: string, now = new Date()): Promise<JobOutcome> {
  const opp = await getOpportunity(db, opportunityId);
  if (!opp) return { kind: 'fatal', error: 'opportunity missing' };
  const receipt = await db.prepare('SELECT payload_json FROM lead_receipts WHERE id = ?').bind(opp.receipt_id).first<{ payload_json: string }>();
  const form = JSON.parse(receipt?.payload_json ?? '{}');
  const note = String(form.note ?? '').trim();
  if (!note) return { kind: 'done' }; // nothing for a model to read; rules already handled the form
  const at = nowIso(now);
  const record = (status: string, extra: { model?: string; inTok?: number; outTok?: number; output?: unknown; action?: string } = {}) =>
    db.prepare(`INSERT INTO agent_runs (id, agent, opportunity_id, model, prompt_version, status, input_tokens, output_tokens,
        cost_microcents, output_json, applied_action, created_at) VALUES (?, 'triage', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
      .bind(uuid(), opp.id, extra.model ?? model?.name ?? 'none', TRIAGE_PROMPT_VERSION, status, extra.inTok ?? 0, extra.outTok ?? 0,
        costMicrocents(extra.model ?? '', extra.inTok ?? 0, extra.outTok ?? 0), extra.output ? JSON.stringify(extra.output) : null,
        extra.action ?? null, at);

  const manual = (reason: string, status: string) => db.batch([
    record(status),
    exceptionStmt(db, 'medium', 'opportunity', opp.id, `manual triage needed: ${reason}`, at),
  ]).then(() => ({ kind: 'done' as const }));

  if (!policy.agents.triage_enabled || !model) return manual('model not enabled', 'not_configured');
  const capMicro = policy.agents.monthly_cap_cents * 1_000_000;
  if ((await monthSpendMicrocents(db, now)) >= capMicro) return manual('monthly model budget reached', 'skipped_cap');

  const r = await model.triage({ concern: opp.concern, water_source: opp.water_source, timing: String(form.timing ?? ''), note });
  if (!r.ok) return manual(`model ${r.reason}`, r.reason);

  const out = enforce(r.output);
  const stmts = [record('ok', { model: r.model, inTok: r.inputTokens, outTok: r.outputTokens, output: out, action: out.suggested_next_action })];
  const why = out.summary_for_coordinator;
  if (out.suggested_next_action === 'urgent_human_contact') {
    stmts.push(exceptionStmt(db, 'critical', 'opportunity', opp.id, `possible urgent issue, give dealer urgent contact: ${why}`.slice(0, 300), at));
  } else if (out.suggested_next_action === 'human_review') {
    stmts.push(exceptionStmt(db, 'medium', 'opportunity', opp.id, `review note (${out.flags.join(', ') || 'low confidence'}): ${why}`.slice(0, 300), at));
  } else if (out.suggested_next_action === 'close_out_of_scope') {
    stmts.push(exceptionStmt(db, 'low', 'opportunity', opp.id, `model suggests out of scope, confirm before closing: ${why}`.slice(0, 300), at));
  }
  await db.batch(stmts);
  return { kind: 'done' };
}
