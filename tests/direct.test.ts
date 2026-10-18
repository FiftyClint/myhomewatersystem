import { describe, expect, it } from 'vitest';
import { app, count, DIRECT_MARKET } from './helpers.ts';
import { transition } from '../src/domain/pipeline.ts';
import { makeLink } from '../src/dealer/links.ts';
import { providerPage } from '../src/dealer/page.ts';
import { internalApi } from '../src/internal/api.ts';
import { buildReport } from '../src/domain/report.ts';

const post = (path: string, body: unknown) => new Request(`https://x${path}`, { method: 'POST', body: JSON.stringify(body) });

describe('direct-sale market end to end (T20 included)', () => {
  it('runs inquiry to installer to collected cash, with refunds kept as history', async () => {
    const a = await app();
    const r = await a.submit({ zip: '00003', market: 'demo-direct' });
    if (r.status !== 'accepted') throw new Error(JSON.stringify(r));
    expect(r.recipient).toBe('My Home Water System');
    await a.drain();
    expect(await count(a.db, 'assignments')).toBe(0); // no installer until the customer accepts
    const m = DIRECT_MARKET();
    const step = (to: any, evidence?: string) => transition(a.db, m, { opportunityId: r.opportunityId, to, actor: 'coordinator', evidence });
    for (const [to, ev] of [['appointment_booked'], ['appointment_held', 'assessment notes #1'], ['quote_issued'], ['customer_accepted']] as const) {
      expect((await step(to, ev)).ok).toBe(true);
    }
    await a.drain();
    const asg = await a.db.prepare('SELECT * FROM assignments').first<{ id: string; provider_id: string; role: string }>();
    expect(asg).toMatchObject({ provider_id: 'installer-a', role: 'installer' });
    expect((await a.db.prepare('SELECT state FROM opportunities').first<{ state: string }>())!.state).toBe('install_scheduled');

    const t = await makeLink('test-secret', asg!.id, new Date('2027-01-01'));
    const accepted = await providerPage(a.ctx, t, 'POST', { action: 'accept', version: '5' });
    expect(accepted.body).toContain('Installed');
    // Installer cannot mark money collected.
    const tryCollect = await providerPage(a.ctx, t, 'POST', { action: 'state:collected', version: '5', evidence: 'x' });
    expect(tryCollect.body).toContain('could not be recorded');
    const inst = await providerPage(a.ctx, t, 'POST', { action: 'state:installed', version: '5', evidence: 'photos ref 22' });
    expect(inst.body).toContain('Recorded: Installed');

    const ledger = (body: unknown) => internalApi(a.ctx, post('/internal/ledger', body), '/internal/ledger', 'coordinator');
    expect((await ledger({ kind: 'customer_payment', amount_cents: 100000, billing_key: 'pay:1', market_id: 'demo-direct',
      opportunity_id: r.opportunityId, evidence: 'processor txn 1', received_at: '2026-10-21T00:00:00Z' })).status).toBe(201);
    expect((await ledger({ kind: 'customer_payment', amount_cents: 100000, billing_key: 'pay:1', market_id: 'demo-direct', evidence: 'dup' })).status).toBe(200);
    await ledger({ kind: 'installer_payout', amount_cents: 30000, billing_key: 'payout:1', market_id: 'demo-direct', evidence: 'check 101' });
    await ledger({ kind: 'equipment_cost', amount_cents: 40000, billing_key: 'equip:1', market_id: 'demo-direct', evidence: 'PO 77' });
    await ledger({ kind: 'customer_refund', amount_cents: 5000, billing_key: 'refund:1', market_id: 'demo-direct', evidence: 'refund 1' });
    expect((await ledger({ kind: 'dealer_fee', amount_cents: 1, billing_key: 'x', market_id: 'demo-direct', evidence: 'x' })).status).toBe(400);
    expect((await ledger({ kind: 'customer_payment', amount_cents: -5, billing_key: 'neg', market_id: 'demo-direct', evidence: 'x' })).status).toBe(400);
    expect((await step('collected', 'paid in full, txn 1')).ok).toBe(true);

    const rep = (await buildReport(a.db)).markets.find((x) => x.market_id === 'demo-direct')!;
    expect(rep.money_cents.contribution_collected).toBe(100000 - 5000 - 30000 - 40000);
    expect(rep.funnel.collected).toBe(1);
    expect(await count(a.db, 'ledger_entries')).toBe(4); // refund is a new row; nothing erased
  });

  it('dealer fees count as revenue only once received', async () => {
    const a = await app();
    await a.db.prepare(`INSERT INTO ledger_entries (id, billing_key, market_id, kind, amount_cents, direction, earned_at)
      VALUES ('l1', 'dealer_fee:v1:o1', 'demo-dealer', 'dealer_fee', 60000, 'in', '2026-10-20T00:00:00Z')`).run();
    let rep = (await buildReport(a.db)).markets.find((x) => x.market_id === 'demo-dealer')!;
    expect(rep.money_cents.dealer_fees_earned).toBe(60000);
    expect(rep.money_cents.contribution_collected).toBe(0);
    await internalApi(a.ctx, post('/internal/ledger/received', { billing_key: 'dealer_fee:v1:o1', evidence: 'ACH 55' }), '/internal/ledger/received', 'coordinator');
    rep = (await buildReport(a.db)).markets.find((x) => x.market_id === 'demo-dealer')!;
    expect(rep.money_cents.contribution_collected).toBe(60000);
  });
});
