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

// Exclusive lead: the one dealer pays when it accepts the lead, not later in the sale.
function leadMarket(): MarketConfig {
  const m = structuredClone(DEALER_MARKET());
  m.dealer_partner = { ...m.dealer_partner!, commercial_model: 'exclusive_lead', fee_trigger_state: 'dealer_accepted', fee_cents: 9500 };
  return m;
}

async function setup() {
  const m = leadMarket();
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
