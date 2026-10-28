import { describe, expect, it } from 'vitest';
import { app, count, DEALER_MARKET, MARKETS } from './helpers.ts';
import { transition } from '../src/domain/pipeline.ts';
import { makeLink } from '../src/dealer/links.ts';
import { providerPage } from '../src/dealer/page.ts';
import { marketLaunchBlockers, type MarketConfig } from '../src/domain/config.ts';
import ev from '../config/markets/east-valley.json';
import lv from '../config/markets/las-vegas-valley.json';
import sa from '../config/markets/san-antonio-area.json';
import kc from '../config/markets/kansas-city.json';
import { PRODUCTION_MARKETS } from '../src/env.ts';

// Exclusive lead: the one dealer pays when it accepts the lead, not later in the sale.
function leadMarket(free_proof?: { ends_on: string | null }): MarketConfig {
  const m = structuredClone(DEALER_MARKET());
  m.dealer_partner = { ...m.dealer_partner!, commercial_model: 'exclusive_lead', fee_trigger_state: 'dealer_accepted', fee_cents: 9500, free_proof };
  return m;
}

async function setup(free_proof?: { ends_on: string | null }) {
  const m = leadMarket(free_proof);
  const a = await app({ markets: [m, ...MARKETS.filter((x) => x.id !== m.id)] });
  const r = await a.submit();
  if (r.status !== 'accepted') throw new Error('intake failed');
  await a.drain();
  const asg = (await a.db.prepare('SELECT id FROM assignments WHERE opportunity_id = ?').bind(r.opportunityId).first<{ id: string }>())!;
  const token = await makeLink('test-secret', asg.id, new Date('2027-01-01'));
  return { a, m, opp: r.opportunityId, token };
}

describe('exclusive lead fee', () => {
  it('earns $95 once when the dealer accepts, with the acceptance as evidence', async () => {
    const { a, m, opp, token } = await setup();
    expect(await count(a.db, 'ledger_entries')).toBe(0);
    await providerPage(a.ctx, token, 'POST', { action: 'accept', version: '1' });
    const fee = await a.db.prepare("SELECT amount_cents, agreement_version, evidence FROM ledger_entries WHERE kind = 'dealer_fee'").first<any>();
    expect(fee.amount_cents).toBe(9500);
    expect(fee.agreement_version).toBe('fixture-agreement-1');
    expect(fee.evidence).toMatch(/^accepted via dealer link/);
    // Later steps in the sale add nothing.
    await transition(a.db, m, { opportunityId: opp, to: 'appointment_booked', actor: 'dealer' });
    await transition(a.db, m, { opportunityId: opp, to: 'appointment_held', actor: 'dealer', evidence: 'cal-1' });
    expect(await count(a.db, 'ledger_entries', "kind = 'dealer_fee'")).toBe(1);
  });

  it('charges nothing when the dealer releases the lead instead of accepting', async () => {
    const { a, token } = await setup();
    await providerPage(a.ctx, token, 'POST', { action: 'release', version: '1' });
    expect(await count(a.db, 'ledger_entries')).toBe(0);
  });

  it('all four pilot markets carry the approved starting price and no fee blocker', () => {
    for (const raw of [ev, lv, sa, kc]) {
      const m = raw as unknown as MarketConfig;
      expect(m.dealer_partner).toMatchObject({ commercial_model: 'exclusive_lead', fee_trigger_state: 'dealer_accepted', fee_cents: 9500 });
      const blockers = marketLaunchBlockers(m);
      expect(blockers).not.toContain('dealer fee amount not set');
      expect(blockers).not.toContain('dealer fee model not agreed');
      expect(blockers).toContain('no launch approval recorded');
    }
  });
});

describe('free proof period (Clint, 2026-10-28)', () => {
  it('a dealer accepting during the proof period pays nothing', async () => {
    const { a, token } = await setup({ ends_on: null });
    const r = await providerPage(a.ctx, token, 'POST', { action: 'accept', version: '1' });
    expect(r.status).toBeLessThan(400);
    expect(await count(a.db, "assignments", "status = 'accepted'")).toBe(1);
    expect(await count(a.db, 'ledger_entries')).toBe(0);
  });

  it('the fee applies again once ends_on has passed', async () => {
    const { a, token } = await setup({ ends_on: '2020-01-01' });
    await providerPage(a.ctx, token, 'POST', { action: 'accept', version: '1' });
    expect(await count(a.db, 'ledger_entries', "kind = 'dealer_fee'")).toBe(1);
  });

  it('all eleven launch markets are in the proof period and need no price to launch', () => {
    const launch = ['east-valley', 'las-vegas-valley', 'san-antonio-area', 'kansas-city', 'chicago', 'los-angeles',
      'houston', 'philadelphia', 'phoenix', 'san-diego', 'indianapolis'];
    const inProof = PRODUCTION_MARKETS.filter((m) => m.dealer_partner?.free_proof).map((m) => m.id).sort();
    expect(inProof).toEqual([...launch].sort());
    for (const m of PRODUCTION_MARKETS.filter((x) => launch.includes(x.id))) {
      expect(m.dealer_partner!.free_proof!.ends_on, m.id).toBeNull();
      expect(marketLaunchBlockers(m).join(), m.id).not.toMatch(/fee/);
    }
  });

  it('a proof period that has ended brings the price blocker back for a city with no price', () => {
    const chi = PRODUCTION_MARKETS.find((m) => m.id === 'chicago')!;
    const ended = { ...chi, dealer_partner: { ...chi.dealer_partner!, free_proof: { ends_on: '2026-01-01' } } };
    expect(marketLaunchBlockers(ended, '2026-10-28')).toContain('dealer fee model not agreed');
  });
});
