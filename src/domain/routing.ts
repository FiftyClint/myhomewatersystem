import type { Sql } from '../db/sql.ts';
import { slaMinutes, type MarketConfig } from './config.ts';
import { addBusinessMinutes } from './hours.ts';
import { enqueueStmt, exceptionStmt, getOpportunity } from './repo.ts';
import { transition } from './pipeline.ts';
import { nowIso, uuid } from '../util.ts';

export interface EligibleProvider { id: string; display_name: string; agreement_version: string | null }

// Hard gates. Any failure means the provider is skipped, never "probably fine".
export async function eligibleProviders(db: Sql, marketId: string, kind: 'dealer' | 'installer', now = new Date(),
  excludeReleasedFor: string | null = null): Promise<EligibleProvider[]> {
  const today = now.toISOString().slice(0, 10);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const { results } = await db.prepare(
    `SELECT p.id, p.display_name, p.agreement_version FROM providers p
     WHERE p.market_id = ? AND p.kind = ? AND p.status = 'active'
       AND p.agreement_version IS NOT NULL
       AND p.license_expires_on IS NOT NULL AND p.license_expires_on >= ?
       AND p.insurance_expires_on IS NOT NULL AND p.insurance_expires_on >= ?
       AND p.weekly_capacity > (
         SELECT COUNT(*) FROM assignments a
         WHERE a.provider_id = p.id AND a.assigned_at >= ? AND a.status <> 'released')
       -- A provider that already turned this job down is not offered it again.
       AND NOT EXISTS (SELECT 1 FROM assignments r WHERE r.provider_id = p.id AND r.opportunity_id = ? AND r.status = 'released')
     ORDER BY p.priority, p.id`,
  ).bind(marketId, kind, today, today, weekAgo, excludeReleasedFor).all<EligibleProvider>();
  return results;
}

export type RouteResult =
  | { ok: true; assignmentId: string; providerId: string }
  | { ok: false; reason: 'stale' | 'no_eligible_provider' | 'conflict' };

// Reserves one provider. The unique index on live assignments makes a second
// concurrent reservation fail inside the same transaction as the state change.
export async function route(db: Sql, market: MarketConfig, opportunityId: string, now = new Date()): Promise<RouteResult> {
  const opp = await getOpportunity(db, opportunityId);
  if (!opp) return { ok: false, reason: 'stale' };
  const role = market.business_mode === 'direct' ? 'installer' : 'dealer';
  const ready = role === 'dealer'
    ? ['qualified', 'capacity_hold'].includes(opp.state)
    : ['customer_accepted', 'capacity_hold'].includes(opp.state);
  if (!ready) return { ok: false, reason: 'stale' };

  const candidates = await eligibleProviders(db, market.id, role, now, opportunityId);
  const target = role === 'dealer' ? 'assignment_pending' : 'install_scheduled';
  if (candidates.length === 0) {
    if (opp.state !== 'capacity_hold') {
      await transition(db, market, {
        opportunityId, to: 'capacity_hold', actor: 'system', holdReason: 'no eligible provider',
        extra: () => [exceptionStmt(db, 'high', 'opportunity', opportunityId, 'no eligible provider')],
      });
    }
    return { ok: false, reason: 'no_eligible_provider' };
  }
  const provider = candidates[0]!;
  const assignmentId = uuid();
  const sla = addBusinessMinutes(now, slaMinutes(market), market.timezone, market.business_hours).toISOString();
  try {
    const res = await transition(db, market, {
      opportunityId, to: target, actor: role === 'dealer' ? 'system' : 'coordinator',
      reason: `assigned to ${provider.id}`,
      extra: (_o, tid) => [
        db.prepare(
          `INSERT INTO assignments (id, opportunity_id, provider_id, role, status, assigned_at, sla_due_at)
           SELECT ?, ?, ?, ?, 'offered', ?, ? WHERE EXISTS (SELECT 1 FROM state_transitions WHERE id = ?)`,
        ).bind(assignmentId, opportunityId, provider.id, role, nowIso(now), sla, tid),
        enqueueStmt(db, 'notify_provider', { assignment_id: assignmentId }, `notify:${assignmentId}`),
      ],
    });
    if (!res.ok) return { ok: false, reason: 'conflict' };
  } catch (e) {
    if (String(e).includes('UNIQUE')) return { ok: false, reason: 'conflict' };
    throw e;
  }
  return { ok: true, assignmentId, providerId: provider.id };
}
