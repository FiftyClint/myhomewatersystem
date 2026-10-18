import type { AppContext } from './context.ts';
import { enqueueStmt, exceptionStmt } from '../domain/repo.ts';
import type { Stmt } from '../db/sql.ts';

// Scheduled checks. Each writes at most one open exception per issue.
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
    `SELECT o.id FROM opportunities o JOIN assignments a ON a.opportunity_id = o.id AND a.status = 'accepted'
     WHERE o.updated_at < ? AND o.state NOT IN ('collected','closed','declined','cancelled','no_response','disputed')`,
  ).bind(new Date(now.getTime() - 7 * 86400000).toISOString()).all<{ id: string }>();
  for (const r of stale.results) stmts.push(exceptionStmt(db, 'medium', 'opportunity', r.id, 'status update overdue', at));

  // W13 credentials: expired evidence already blocks routing in eligibleProviders(); this tells a person.
  const soon = new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 10);
  const today = at.slice(0, 10);
  const creds = await db.prepare(
    `SELECT id, license_expires_on AS lic, insurance_expires_on AS ins FROM providers WHERE status = 'active'`,
  ).all<{ id: string; lic: string | null; ins: string | null }>();
  for (const p of creds.results) {
    for (const [label, d] of [['license', p.lic], ['insurance', p.ins]] as const) {
      if (!d || d < today) stmts.push(exceptionStmt(db, 'high', 'provider', p.id, `${label} missing or expired: routing blocked`, at));
      else if (d <= soon) stmts.push(exceptionStmt(db, 'medium', 'provider', p.id, `${label} expires ${d}`, at));
    }
  }

  // Retry routing for capacity holds once an hour.
  const holds = await db.prepare(`SELECT id FROM opportunities WHERE state = 'capacity_hold'`).all<{ id: string }>();
  const hour = at.slice(0, 13);
  for (const r of holds.results) stmts.push(enqueueStmt(db, 'route_lead', { opportunity_id: r.id }, `route:retry:${r.id}:${hour}`, at));

  if (stmts.length) await db.batch(stmts);
  return stmts.length;
}
