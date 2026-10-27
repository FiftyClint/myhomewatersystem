import type { AppContext } from './context.ts';
import { enqueueStmt, exceptionStmt } from '../domain/repo.ts';
import type { Stmt } from '../db/sql.ts';

// Scheduled checks. Each writes at most one open exception per issue. Every query here runs once a
// minute, so each must read through an index; tests/query-plans.test.ts fails on a full table scan.
export async function runChecks(ctx: AppContext): Promise<number> {
  const { db } = ctx;
  const now = ctx.now?.() ?? new Date();
  const at = now.toISOString();
  const stmts: Stmt[] = [];

  // W03 SLA: provider has not accepted in time.
  const late = await db.prepare(
    `SELECT id FROM assignments WHERE status = 'offered' AND sla_due_at IS NOT NULL AND sla_due_at < ?`,
  ).bind(at).all<{ id: string }>();
  for (const r of late.results) stmts.push(exceptionStmt(db, 'high', 'assignment', r.id, 'not accepted within SLA', at));

  // W07 outcome chase: accepted work with no status change in 7 days.
  const stale = await db.prepare(
    `SELECT o.id FROM assignments a CROSS JOIN opportunities o ON o.id = a.opportunity_id
     WHERE a.status = 'accepted' AND o.updated_at < ?
       AND o.state NOT IN ('collected','closed','declined','cancelled','no_response','disputed')`,
  ).bind(new Date(now.getTime() - 7 * 86400000).toISOString()).all<{ id: string }>();
  for (const r of stale.results) stmts.push(exceptionStmt(db, 'medium', 'opportunity', r.id, 'status update overdue', at));

  stmts.push(...credentialStmts(ctx, now));

  // Retry routing for capacity holds once an hour.
  const holds = await db.prepare(`SELECT id FROM opportunities WHERE state = 'capacity_hold'`).all<{ id: string }>();
  const hour = at.slice(0, 13);
  for (const r of holds.results) stmts.push(enqueueStmt(db, 'route_lead', { opportunity_id: r.id }, `route:retry:${r.id}:${hour}`, at));

  if (stmts.length) await db.batch(stmts);
  return stmts.length;
}

// True when a lead is in flight: a job to run, an offer or accepted job to watch, or a lead held for capacity.
// Each part is an index lookup, so with nothing in flight it finds no rows.
export async function hasLiveWork(db: AppContext['db']): Promise<boolean> {
  const r = await db.prepare(
    `SELECT EXISTS (SELECT 1 FROM jobs WHERE status IN ('queued','running'))
         OR EXISTS (SELECT 1 FROM assignments WHERE status IN ('offered','accepted'))
         OR EXISTS (SELECT 1 FROM opportunities WHERE state = 'capacity_hold') AS live`,
  ).first<{ live: number }>();
  return !!r?.live;
}

// W13 credentials: expired evidence already blocks routing in eligibleProviders(); this tells a person.
// Read from the deployed config, not the database, so the daily run reads no rows and writes only on an issue.
export function credentialStmts(ctx: AppContext, now: Date): Stmt[] {
  const at = now.toISOString();
  const today = at.slice(0, 10);
  const soon = new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 10);
  const out: Stmt[] = [];
  for (const m of ctx.markets) {
    for (const p of m.providers) {
      if (p.status !== 'active') continue;
      for (const [label, d] of [['license', p.license_expires_on], ['insurance', p.insurance_expires_on]] as const) {
        if (!d || d < today) out.push(exceptionStmt(ctx.db, 'high', 'provider', p.id, `${label} missing or expired: routing blocked`, at));
        else if (d <= soon) out.push(exceptionStmt(ctx.db, 'medium', 'provider', p.id, `${label} expires ${d}`, at));
      }
    }
  }
  return out;
}
