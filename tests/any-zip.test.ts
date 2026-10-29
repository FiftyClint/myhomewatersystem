import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { app, form, sqliteDb } from './helpers.ts';
import { handleIntake } from '../src/intake/intake.ts';
import { NO_DEALER_ID } from '../src/domain/no-dealer.ts';
import { MockCrm } from '../src/adapters/crm-mock.ts';
import { MARKET_CONFIGS } from '../config/markets/index.ts';
import { marketLaunchBlockers } from '../src/domain/config.ts';

// Clint, 2026-10-29 ("Yes, yes" to "should the form take every ZIP?"): a ZIP no open market serves is stored
// and sent to the lead database marked no dealer assigned, and the thank-you promises no local company.
const STG = 'https://mhws-staging.example.workers.dev';
const PROD = 'https://www.myhomewatersystem.com';
const prod = { ENVIRONMENT: 'production', BASE_URL: PROD, LINK_SECRET: 't', SITE_DESIGN: 'b', DB: {} } as any;

async function post(env: any, fields: Record<string, string>, cookie = '') {
  const waits: Promise<unknown>[] = [];
  const body = new URLSearchParams({ request_id: crypto.randomUUID(), page: '/check', website: '', homeowner: 'yes', concern: 'drinking_water',
    water_source: 'municipal', first_name: 'Test', last_name: 'Nodealer', contact_method: 'email', email: 'nodealer-test@example.com',
    consent_service: 'yes', ...fields });
  const r = await worker.fetch(new Request(`${STG}/api/inquiry`, { method: 'POST', body, headers: { 'content-type': 'application/x-www-form-urlencoded', cookie } }),
    env, { waitUntil: (p: Promise<unknown>) => waits.push(p) } as any);
  await Promise.all(waits);
  return { status: r.status, text: await r.text(), id: body.get('request_id')! };
}

describe('the request form takes every ZIP', () => {
  it('intake stores an uncovered ZIP under no dealer assigned only when asked to', async () => {
    const a = await app();
    const deps = { db: a.db, markets: a.markets, policy: a.ctx.policy, hashPepper: 'p', requireLaunchable: false };
    const input = form({ zip: '99501', market: NO_DEALER_ID, consent_sms: 'yes' });
    expect(await handleIntake(input, deps)).toEqual({ status: 'out_of_area', zip: '99501' });
    const r = await handleIntake(input, { ...deps, anyZip: true });
    expect(r).toMatchObject({ status: 'accepted', state: 'out_of_area', noDealer: true, noDealerArea: true, recipient: 'My Home Water System' });
    const row = a.db.raw.prepare(`SELECT o.market_id, o.state, o.hold_reason,
      (SELECT group_concat(c.channel || ':' || c.named_parties) FROM consent_events c WHERE c.receipt_id = l.id) AS consent
      FROM lead_receipts l JOIN opportunities o ON o.receipt_id = l.id WHERE l.request_id = ?`).get(input.request_id!) as any;
    // Texts are off for no-dealer requests, so only the call consent is stored, naming us alone.
    expect(row).toEqual({ market_id: NO_DEALER_ID, state: 'out_of_area', hold_reason: 'no dealer assigned: no open market serves this ZIP', consent: 'phone:["My Home Water System"]' });
    // Nothing routes it; the CRM job names it.
    expect(a.db.raw.prepare("SELECT job_type AS kind FROM jobs WHERE payload_json LIKE ?").all(`%${(r as any).opportunityId}%`)).toEqual([{ kind: 'crm_sync' }]);
    await a.drain();
    const opp = [...a.crm.opportunities.values()][0]!;
    expect(opp.name).toBe('Test Person - hardness - 99501 - no dealer assigned');
    expect(opp.stage).toBe('On Hold');
    expect([...a.crm.contacts.values()][0]!.tags).toContain(`mhws-market-${NO_DEALER_ID}`);
  });

  it('a form that named a dealer is not consent for holding the request with no dealer', async () => {
    const a = await app();
    const m = a.markets.find((x) => x.seller_display_name)!;
    const r = await handleIntake(form({ zip: '99501', market: m.id }), { db: a.db, markets: a.markets, policy: a.ctx.policy, hashPepper: 'p', requireLaunchable: false, anyZip: true });
    expect(r.status).toBe('invalid');
    expect(a.db.raw.prepare('SELECT COUNT(*) AS n FROM opportunities').get()).toEqual({ n: 0 });
  });

  it('a no-dealer post shows an honest thank-you and writes no more rows than a normal lead', async () => {
    const db = sqliteDb();
    const env = { DB: db, ENVIRONMENT: 'staging', BASE_URL: STG, CRM_PROVIDER: 'mock' } as any;
    const tables = (db.raw.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'").all() as { name: string }[]).map((t) => t.name);
    const rows = () => ({ n: tables.reduce((n, t) => n + Number((db.raw.prepare(`SELECT COUNT(*) AS c FROM ${t}`).get() as { c: number }).c), 0) });
    // Rows changed (inserts and updates, before index touches), for a routed-to-hold Denver lead and a no-dealer one.
    const changes = () => Number((db.raw.prepare('SELECT total_changes() AS c').get() as { c: number }).c);
    let t0 = changes();
    await post(env, { market: 'denver', zip: '80202', page: '/', email: 'denver-test@example.com' }, 'mhws_site=denverwatersystems.com');
    const denverWrites = changes() - t0;
    const before = rows().n;
    t0 = changes();
    const r = await post(env, { market: NO_DEALER_ID, zip: '99501' });
    const noDealerWrites = changes() - t0;
    expect(noDealerWrites).toBeLessThanOrEqual(denverWrites);
    expect(r.status).toBe(200);
    expect(r.text).toContain('No water treatment company is set up for ZIP code 99501 yet, so we cannot promise a local test or quote.');
    expect(r.text).not.toMatch(/local specialist|will contact you/);
    expect(r.text.slice(r.text.indexOf('<main>'), r.text.indexOf('</main>'))).not.toMatch(/—|!/);
    // Table rows after its jobs ran, counting the one market row stored the first time. A routed lead makes 24.
    const added = rows().n - before;
    expect(added).toBeLessThanOrEqual(24);
    // A city form that named only us also covers an uncovered ZIP typed into it.
    const c = await post(env, { market: 'denver', zip: '99502', page: '/' }, 'mhws_site=denverwatersystems.com');
    expect(c.text).toContain('ZIP code 99502');
  });

  it('production: a city site whose market is not open shows the no-dealer form in design B', async () => {
    const closed = MARKET_CONFIGS.filter((m) => marketLaunchBlockers(m).length);
    expect(closed.length).toBeGreaterThan(0);
    const t = await (await worker.fetch(new Request('https://madisonwatersystems.com/'), prod)).text();
    expect(t).toContain('class="d-b"');
    expect(t).toContain(`name="market" value="${NO_DEALER_ID}"`);
    expect(t).not.toContain('Not open yet');
    // An open market keeps its own form.
    const d = await (await worker.fetch(new Request('https://denverwatersystems.com/'), prod)).text();
    expect(d).toContain('name="market" value="denver"');
  });
});
