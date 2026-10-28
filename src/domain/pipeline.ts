import type { Sql, Stmt } from '../db/sql.ts';
import { freeLeadsPerDealer, type MarketConfig } from './config.ts';
import { canTransition, EVIDENCE_REQUIRED, type Actor, type State } from './states.ts';
import { enqueueStmt, getOpportunity, type OpportunityRow } from './repo.ts';
import { nowIso, uuid } from '../util.ts';

export interface TransitionInput {
  opportunityId: string;
  to: State;
  actor: Actor;
  reason?: string;
  evidence?: string;
  expectedVersion?: number; // optimistic lock; defaults to the version just read
  holdReason?: string;
  extra?: (opp: OpportunityRow, transitionId: string) => Stmt[];
}

export type TransitionResult =
  | { ok: true; opportunity: OpportunityRow; transitionId: string; feeAccrued: boolean }
  | { ok: false; error: 'not_found' | 'not_allowed' | 'evidence_required' | 'conflict'; detail?: string };

// Per-event dealer fee. Earned only from a recorded transition with evidence, never from an estimate.
// For exclusive_lead the evidence is the dealer's own acceptance through their signed link.
function feeStmts(db: Sql, market: MarketConfig, opp: OpportunityRow, to: State, transitionId: string, at: string): Stmt[] {
  if (market.business_mode !== 'dealer_partner' || !market.dealer_partner) return [];
  const { fee_trigger_state, fee_cents } = market.dealer_partner;
  if (!fee_trigger_state || fee_trigger_state !== to || fee_cents <= 0) return [];
  // Agreement version comes from the dealer that holds the accepted assignment.
  // Proof period: the dealer's first free_leads_per_dealer accepted leads are free (one indexed count).
  const free = freeLeadsPerDealer(market);
  return [db.prepare(
    `INSERT INTO ledger_entries (id, billing_key, opportunity_id, market_id, kind, amount_cents, direction,
       agreement_version, triggering_transition_id, earned_at, evidence)
     SELECT ?, 'dealer_fee:' || p.agreement_version || ':' || ?, ?, ?, 'dealer_fee', ?, 'in',
       p.agreement_version, ?, ?, t.evidence
     FROM assignments a JOIN providers p ON p.id = a.provider_id
     JOIN state_transitions t ON t.id = ?
     WHERE a.opportunity_id = ? AND a.role = 'dealer' AND a.status IN ('accepted','completed')
       AND p.agreement_version IS NOT NULL
       AND (SELECT COUNT(*) FROM assignments a2 WHERE a2.provider_id = a.provider_id AND a2.role = 'dealer'
            AND a2.status IN ('accepted','completed') AND a2.opportunity_id <> a.opportunity_id) >= ?
     ON CONFLICT(billing_key) DO NOTHING`,
  ).bind(uuid(), opp.id, opp.id, market.id, fee_cents, transitionId, at, transitionId, opp.id, free)];
}

// Dealer mode routes once qualified. Direct mode assigns an installer once the customer accepts.
export const needsRouting = (mode: OpportunityRow['business_mode'], to: State): boolean =>
  (mode === 'dealer_partner' && to === 'qualified') || (mode === 'direct' && to === 'customer_accepted');

export async function transition(db: Sql, market: MarketConfig, input: TransitionInput): Promise<TransitionResult> {
  const opp = await getOpportunity(db, input.opportunityId);
  if (!opp) return { ok: false, error: 'not_found' };
  const check = canTransition(opp.business_mode, opp.state, input.to, input.actor);
  if (!check.ok) return { ok: false, error: 'not_allowed', detail: check.reason };
  if (EVIDENCE_REQUIRED.includes(input.to) && !input.evidence?.trim()) {
    return { ok: false, error: 'evidence_required', detail: `${input.to} needs a checkable reference` };
  }
  const version = input.expectedVersion ?? opp.state_version;
  const at = nowIso();
  const tid = uuid();
  const extra = input.extra?.(opp, tid) ?? [];
  const fee = feeStmts(db, market, opp, input.to, tid, at);
  const stmts: Stmt[] = [
    db.prepare(
      `UPDATE opportunities SET state = ?, hold_reason = ?, state_version = state_version + 1, updated_at = ?
       WHERE id = ? AND state = ? AND state_version = ?`,
    ).bind(input.to, input.holdReason ?? null, at, opp.id, opp.state, version),
    // Only written if the update above won the race.
    db.prepare(
      `INSERT INTO state_transitions (id, opportunity_id, from_state, to_state, actor, reason, evidence, at)
       SELECT ?, ?, ?, ?, ?, ?, ?, ?
       WHERE EXISTS (SELECT 1 FROM opportunities WHERE id = ? AND state = ? AND state_version = ?)`,
    ).bind(tid, opp.id, opp.state, input.to, input.actor, input.reason ?? null, input.evidence ?? null, at,
      opp.id, input.to, version + 1),
    // Caller statements run before the fee, so a fee on dealer_accepted sees the accepted assignment.
    ...extra,
    ...fee,
    // Keep the CRM stage in step. One job per transition.
    enqueueStmt(db, 'crm_stage', { opportunity_id: opp.id }, `crm_stage:${tid}`),
    ...(needsRouting(opp.business_mode, input.to)
      ? [enqueueStmt(db, 'route_lead', { opportunity_id: opp.id }, `route:${tid}`)] : []),
  ];
  const results = await db.batch(stmts);
  if (results[0]!.meta.changes !== 1) {
    return { ok: false, error: 'conflict', detail: 'record changed since it was read' };
  }
  const feeAccrued = fee.length === 1 && (results[2 + extra.length]?.meta.changes ?? 0) === 1;
  const updated = (await getOpportunity(db, opp.id))!;
  return { ok: true, opportunity: updated, transitionId: tid, feeAccrued };
}
