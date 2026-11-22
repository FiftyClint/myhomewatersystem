import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { app, form } from './helpers.ts';
import { handleIntake, MIN_FILL_MS, suspicion } from '../src/intake/intake.ts';
import { NO_DEALER_ID } from '../src/domain/no-dealer.ts';
import { formRequestId, requestIdTime } from '../src/util.ts';

// Clint, 2026-11-22 ("Yes" to bot protection): four no-dealer requests in five days passed the honeypot with
// identical answers and out-of-state phones. Each request now records what the edge saw and how long the
// form was open; a post faster than a person can fill the form is dropped like the honeypot.
// All data below is SYNTHETIC.

describe('form request ids carry the render time', () => {
  it('round-trips the time and rejects random ids', () => {
    const t = Date.UTC(2026, 10, 22, 12, 0, 0);
    const id = formRequestId(t);
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    expect(requestIdTime(id)).toBe(t);
    expect(requestIdTime(crypto.randomUUID())).toBeNull();
    expect(formRequestId(t)).not.toBe(id);
  });

  it('every rendered form uses a timed id', async () => {
    const env = { ENVIRONMENT: 'production', BASE_URL: 'https://www.myhomewatersystem.com', LINK_SECRET: 't', SITE_DESIGN: 'b', DB: {} } as any;
    const r = await worker.fetch(new Request('https://www.myhomewatersystem.com/check?zip=99501'), env, { waitUntil() {} } as any);
    const id = /name="request_id" value="([^"]+)"/.exec(await r.text())?.[1];
    expect(id && requestIdTime(id)).toBeTypeOf('number');
  });
});

describe('intake checks', () => {
  const setup = async () => {
    const a = await app();
    return { a, deps: { db: a.db, markets: a.markets, policy: a.ctx.policy, hashPepper: 'p', requireLaunchable: false, anyZip: true } };
  };

  it('drops a form sent faster than a person can fill it, and keeps a normal one with its signals', async () => {
    const { a, deps } = await setup();
    const now = new Date(Date.UTC(2026, 10, 22, 12, 0, 0));
    const fast = form({ zip: '99501', market: NO_DEALER_ID, request_id: formRequestId(now.getTime() - (MIN_FILL_MS - 1)) });
    expect(await handleIntake(fast, { ...deps, now })).toEqual({ status: 'discarded' });
    expect(a.db.raw.prepare('SELECT count(*) n FROM lead_receipts').get()).toEqual({ n: 0 });

    const signals = { host: 'www.myhomewatersystem.com', referer: 'https://www.myhomewatersystem.com/check', userAgent: 'Mozilla/5.0 (synthetic)',
      contentType: 'application/x-www-form-urlencoded', country: 'US', regionCode: 'CA', asn: 64512, asOrganization: 'Synthetic ISP', colo: 'SJC' };
    const ok = form({ zip: '99501', market: NO_DEALER_ID, request_id: formRequestId(now.getTime() - 45000) });
    expect(await handleIntake(ok, { ...deps, now, signals })).toMatchObject({ status: 'accepted' });
    const row = a.db.raw.prepare('SELECT signals_json FROM lead_receipts WHERE request_id = ?').get(ok.request_id!) as any;
    expect(JSON.parse(row.signals_json)).toEqual({ ...signals, fill_ms: 45000, checks: [] });
  });

  it('flags, never drops, a request with no form time or from another country, and tags it in the CRM', async () => {
    const { a, deps } = await setup();
    const input = form({ zip: '99501', market: NO_DEALER_ID, request_id: crypto.randomUUID() });
    const r = await handleIntake(input, { ...deps, signals: { host: 'www.myhomewatersystem.com', referer: null, country: 'NL', contentType: 'application/json' } });
    expect(r).toMatchObject({ status: 'accepted' });
    const row = a.db.raw.prepare('SELECT signals_json FROM lead_receipts WHERE request_id = ?').get(input.request_id!) as any;
    expect(JSON.parse(row.signals_json).checks).toEqual(['no-form-time', 'non-us', 'json-post', 'no-referer']);
    await a.drain();
    const tags = [...a.crm.contacts.values()][0]!.tags;
    expect(tags).toEqual(expect.arrayContaining(['mhws-check-no-form-time', 'mhws-check-non-us', 'mhws-check-json-post', 'mhws-check-no-referer']));
  });

  it('names each check from the recorded signals', () => {
    expect(suspicion({ fill_ms: null, host: 'a.com', referer: 'https://a.com/' })).toEqual(['no-form-time']);
    expect(suspicion({ fill_ms: 9000, host: 'a.com', referer: 'https://b.com/x' })).toEqual(['other-site-referer']);
  });
});

describe('untrusted render times', () => {
  it('a render time in the future or over a day old is kept but not used as a fill time', async () => {
    const a = await app();
    const deps = { db: a.db, markets: a.markets, policy: a.ctx.policy, hashPepper: 'p', requireLaunchable: false, anyZip: true };
    const now = new Date(Date.UTC(2026, 10, 22, 12, 0, 0));
    for (const t of [now.getTime() + 60000, now.getTime() - 2 * 86400000]) {
      const input = form({ zip: '99501', market: NO_DEALER_ID, request_id: formRequestId(t) });
      expect(await handleIntake(input, { ...deps, now })).toMatchObject({ status: 'accepted' });
      const row = a.db.raw.prepare('SELECT signals_json FROM lead_receipts WHERE request_id = ?').get(input.request_id!) as any;
      expect(JSON.parse(row.signals_json).fill_ms).toBeNull();
    }
  });
});
