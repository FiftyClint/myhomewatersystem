import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { app, count, POLICY } from './helpers.ts';
import { runTriage } from '../src/agents/run-triage.ts';
import { enforce, triageUserMessage, type ModelResult, type TriageInput, type TriageModel } from '../src/agents/triage.ts';
import { runEval, type EvalCase } from '../src/agents/eval.ts';
import { KeywordTriageModel } from '../src/agents/mock-model.ts';
import type { Policy } from '../src/domain/config.ts';

const ON: Policy = { ...POLICY, agents: { ...POLICY.agents, triage_enabled: true, monthly_cap_cents: 500 } };
const cases: EvalCase[] = readFileSync(new URL('../fixtures/evals/triage.jsonl', import.meta.url), 'utf8').trim().split('\n').map((l) => JSON.parse(l));

class Fixed implements TriageModel {
  name = 'claude-haiku-5-5';
  seen: TriageInput[] = [];
  constructor(public result: ModelResult) {}
  async triage(i: TriageInput) { this.seen.push(i); return this.result; }
}
const ok = (o: Partial<Extract<ModelResult, { ok: true }>['output']>): ModelResult => ({ ok: true, model: 'claude-haiku-5-5', inputTokens: 1000, outputTokens: 100,
  output: { category: 'hardness', flags: [], suggested_next_action: 'route_normally', confidence: 'high', summary_for_coordinator: 's', ...o } });

async function oppWithNote(note: string) {
  const a = await app();
  const r = await a.submit({ note });
  if (r.status !== 'accepted') throw new Error();
  return { a, id: r.opportunityId };
}

describe('triage executor', () => {
  it('sends no name, phone or email to the model', async () => {
    const { a, id } = await oppWithNote('Scale on faucets');
    const m = new Fixed(ok({}));
    await runTriage(a.db, ON, m, id);
    const msg = triageUserMessage(m.seen[0]!);
    expect(msg).not.toMatch(/Test|Person|555|example\.com/);
  });

  it('an emergency proposal raises a critical exception and never changes pipeline state', async () => {
    const { a, id } = await oppWithNote('leak on the floor');
    const before = await a.db.prepare('SELECT state, state_version FROM opportunities').first();
    await runTriage(a.db, ON, new Fixed(ok({ category: 'emergency', suggested_next_action: 'urgent_human_contact' })), id);
    expect(await count(a.db, 'exceptions', "severity = 'critical'")).toBe(1);
    expect(await a.db.prepare('SELECT state, state_version FROM opportunities').first()).toEqual(before);
  });

  it('the guard upgrades a model that missed a leak flag it set itself', () => {
    const out = enforce({ category: 'hardness', flags: ['mentions_leak_or_water_damage'], suggested_next_action: 'route_normally', confidence: 'high', summary_for_coordinator: 'x' });
    expect(out.suggested_next_action).toBe('urgent_human_contact');
  });

  it('T13: injection flag forces human review even if the model says route', () => {
    const out = enforce({ category: 'hardness', flags: ['instructions_in_text'], suggested_next_action: 'route_normally', confidence: 'high', summary_for_coordinator: 'x' });
    expect(out.suggested_next_action).toBe('human_review');
  });

  it('T16: model outage leaves the lead intact and creates a manual triage task', async () => {
    const { a, id } = await oppWithNote('Scale on faucets');
    await runTriage(a.db, ON, new Fixed({ ok: false, reason: 'unavailable', detail: 'API 529' }), id);
    expect(await count(a.db, 'exceptions', "reason LIKE 'manual triage needed%'")).toBe(1);
    expect(await count(a.db, 'opportunities')).toBe(1);
  });

  it('disabled by policy means no model call, manual task instead', async () => {
    const { a, id } = await oppWithNote('Scale on faucets');
    const m = new Fixed(ok({}));
    await runTriage(a.db, POLICY, m, id);
    expect(m.seen).toHaveLength(0);
    expect(await count(a.db, 'agent_runs', "status = 'not_configured'")).toBe(1);
  });

  it('stops calling the model once the monthly budget is used', async () => {
    const { a, id } = await oppWithNote('Scale on faucets');
    const tiny: Policy = { ...ON, agents: { ...ON.agents, monthly_cap_cents: 0 } };
    const m = new Fixed(ok({}));
    await runTriage(a.db, tiny, m, id);
    expect(m.seen).toHaveLength(0);
    expect(await count(a.db, 'agent_runs', "status = 'skipped_cap'")).toBe(1);
  });

  it('records model, prompt version, tokens and cost for every call', async () => {
    const { a, id } = await oppWithNote('Scale on faucets');
    await runTriage(a.db, ON, new Fixed(ok({})), id);
    const run = await a.db.prepare('SELECT model, prompt_version, input_tokens, cost_microcents FROM agent_runs').first<any>();
    // 1000 in x $0.10/M + 100 out x $0.50/M = $0.00015 = 0.015 cents = 15000 microcents
    expect(run).toEqual({ model: 'claude-haiku-5-5', prompt_version: 'triage-v1', input_tokens: 1000, cost_microcents: 15000 });
  });

  it('intake only queues triage when a note exists and the policy allows it', async () => {
    const a = await app();
    await a.submit({ note: 'scale' });
    expect(await count(a.db, 'jobs', "job_type = 'triage'")).toBe(0); // staging policy has triage off
  });
});

describe('eval harness', () => {
  it('has 40 cases including emergencies, health, injection and spam', () => {
    expect(cases).toHaveLength(40);
    expect(cases.filter((c) => c.expect.critical).length).toBe(14);
  });
  it('fails the keyword mock on critical cases (the gate has teeth)', async () => {
    const r = await runEval(new KeywordTriageModel(), cases);
    expect(r.passes_gate).toBe(false);
    expect(r.critical_failures.length).toBeGreaterThan(0);
  });
  it('passes a model that answers as expected', async () => {
    const byNote = new Map(cases.map((c) => [c.input.note, c]));
    const oracle: TriageModel = { name: 'oracle', async triage(i) {
      const c = byNote.get(i.note)!;
      return ok({ category: c.expect.categories?.[0] ?? 'unclear', flags: c.expect.must_flags as never, suggested_next_action: c.expect.actions[0]!, confidence: 'high' });
    } };
    const r = await runEval(oracle, cases);
    expect(r.critical_failures).toEqual([]);
    expect(r.passes_gate).toBe(true);
  });
});
