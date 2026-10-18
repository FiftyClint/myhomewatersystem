import type { Sql } from '../db/sql.ts';

const FUNNEL = ['qualified', 'assignment_pending', 'dealer_accepted', 'appointment_booked', 'appointment_held',
  'quote_issued', 'customer_accepted', 'install_scheduled', 'installed', 'collected'] as const;

export interface MarketReport {
  market_id: string; business_mode: string;
  leads: number; funnel: Record<string, number>; holds: Record<string, number>;
  money_cents: {
    dealer_fees_earned: number; dealer_fees_collected: number; dealer_fee_credits: number;
    customer_payments: number; customer_refunds: number; installer_payouts: number; equipment_costs: number;
    campaign_spend: number; contribution_collected: number;
  };
}

// All numbers are computed from ledger rows. Counts are shown as counts; no rates at low volume.
export async function buildReport(db: Sql): Promise<{ generated_at: string; markets: MarketReport[];
  open_exceptions: Record<string, number>; stuck_jobs: Record<string, number> }> {
  const markets = (await db.prepare('SELECT id, business_mode FROM markets ORDER BY id').all<{ id: string; business_mode: string }>()).results;
  const out: MarketReport[] = [];
  for (const m of markets) {
    const leads = (await db.prepare('SELECT COUNT(*) AS n FROM opportunities WHERE market_id = ?').bind(m.id).first<{ n: number }>())!.n;
    const reached = (await db.prepare(
      `SELECT t.to_state AS s, COUNT(DISTINCT t.opportunity_id) AS n FROM state_transitions t
       JOIN opportunities o ON o.id = t.opportunity_id WHERE o.market_id = ? GROUP BY t.to_state`,
    ).bind(m.id).all<{ s: string; n: number }>()).results;
    const funnel: Record<string, number> = {};
    for (const s of FUNNEL) funnel[s] = reached.find((r) => r.s === s)?.n ?? 0;
    const holds = Object.fromEntries((await db.prepare(
      `SELECT state AS s, COUNT(*) AS n FROM opportunities WHERE market_id = ? AND state NOT IN (${FUNNEL.map(() => '?').join(',')}, 'closed') GROUP BY state`,
    ).bind(m.id, ...FUNNEL).all<{ s: string; n: number }>()).results.map((r) => [r.s, r.n]));
    const sum = async (kind: string, collectedOnly = false) => (await db.prepare(
      `SELECT COALESCE(SUM(amount_cents), 0) AS n FROM ledger_entries WHERE market_id = ? AND kind = ?${collectedOnly ? ' AND received_at IS NOT NULL' : ''}`,
    ).bind(m.id, kind).first<{ n: number }>())!.n;
    const money = {
      dealer_fees_earned: await sum('dealer_fee'), dealer_fees_collected: await sum('dealer_fee', true),
      dealer_fee_credits: await sum('dealer_fee_credit'), customer_payments: await sum('customer_payment', true),
      customer_refunds: await sum('customer_refund'), installer_payouts: await sum('installer_payout'),
      equipment_costs: await sum('equipment_cost'), campaign_spend: await sum('campaign_spend'), contribution_collected: 0,
    };
    // Cash basis. Money we were told about but have not received does not count.
    money.contribution_collected = m.business_mode === 'direct'
      ? money.customer_payments - money.customer_refunds - money.installer_payouts - money.equipment_costs - money.campaign_spend
      : money.dealer_fees_collected - money.dealer_fee_credits - money.campaign_spend;
    out.push({ market_id: m.id, business_mode: m.business_mode, leads, funnel, holds, money_cents: money });
  }
  const group = async (q: string) => Object.fromEntries((await db.prepare(q).all<{ k: string; n: number }>()).results.map((r) => [r.k, r.n]));
  return {
    generated_at: new Date().toISOString(), markets: out,
    open_exceptions: await group(`SELECT severity AS k, COUNT(*) AS n FROM exceptions WHERE status = 'open' GROUP BY severity`),
    stuck_jobs: await group(`SELECT status AS k, COUNT(*) AS n FROM jobs WHERE status IN ('dead','unknown_result') GROUP BY status`),
  };
}
