import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { sqliteDb } from './helpers.ts';

// Clint, 2026-10-27: every water site takes requests. A pilot market (KC, phone set) and a market with
// no dealer (Denver, no phone) both hold the lead for Ryan: consent names only My Home Water System.
const STAGING = 'https://mhws-staging.example.workers.dev';

async function post(env: any, domain: string, market: string, zip: string, requestId: string) {
  const waits: Promise<unknown>[] = [];
  const body = new URLSearchParams({ request_id: requestId, page: '/', market, website: '', zip, homeowner: 'yes', concern: 'hardness',
    water_source: 'municipal', first_name: 'Test', last_name: 'Staging', contact_method: 'email', email: 'staging-test@example.com',
    timing: 'researching', consent_service: 'yes' });
  const r = await worker.fetch(new Request(`${STAGING}/api/inquiry`, { method: 'POST', body,
    headers: { 'content-type': 'application/x-www-form-urlencoded', cookie: `mhws_site=${domain}` } }), env, { waitUntil: (p: Promise<unknown>) => waits.push(p) } as any);
  await Promise.all(waits);
  return { status: r.status, text: await r.text() };
}

describe('staging form posts', () => {
  it('a KC and a Denver request are stored and held for Ryan, with no dealer named', async () => {
    const db = sqliteDb();
    const env = { DB: db, ENVIRONMENT: 'staging', BASE_URL: STAGING, CRM_PROVIDER: 'mock' } as any;
    for (const [domain, market, zip, id] of [['kcwatersystems.com', 'kansas-city', '64111', 'a1b2c3d4-0000-4000-8000-000000000001'],
      ['denverwatersystems.com', 'denver', '80202', 'a1b2c3d4-0000-4000-8000-000000000002']] as const) {
      const r = await post(env, domain, market, zip, id);
      expect(r.status, domain).toBe(200);
      expect(r.text, domain).toContain('A local specialist will contact you by the method you chose.');
      const row = db.raw.prepare('SELECT o.state, o.market_id, (SELECT group_concat(DISTINCT c.named_parties) FROM consent_events c WHERE c.receipt_id = l.id) AS named_parties FROM lead_receipts l JOIN opportunities o ON o.receipt_id = l.id WHERE l.request_id = ?').get(id) as any;
      expect(row, domain).toEqual({ state: 'consent_hold', market_id: market, named_parties: '["My Home Water System"]' });
    }
  });

  it('a database error shows the try-again page, not a Worker error', async () => {
    const broken = { prepare: () => { throw new Error('D1_ERROR: exceeded daily row read limit'); }, batch: async () => { throw new Error('nope'); } };
    const env = { DB: broken, ENVIRONMENT: 'staging', BASE_URL: STAGING, CRM_PROVIDER: 'mock' } as any;
    const r = await post(env, 'denverwatersystems.com', 'denver', '80202', 'a1b2c3d4-0000-4000-8000-000000000003');
    expect(r.status).toBe(503);
    expect(r.text).toContain('We could not save your request');
  });
});
