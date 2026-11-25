import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { sqliteDb } from './helpers.ts';
import { sourceTag } from '../src/intake/intake.ts';
import { NO_DEALER_ID } from '../src/domain/no-dealer.ts';
import { formRequestId } from '../src/util.ts';

// Clint, 2026-11-25: a $1,500 first-month ad test. A lead must carry the ad click that brought it, or the
// test cannot be measured. All values below are SYNTHETIC.
const env = (db: any) => ({ DB: db, ENVIRONMENT: 'production', BASE_URL: 'https://www.myhomewatersystem.com', CRM_PROVIDER: 'mock', LINK_SECRET: 't', HASH_PEPPER: 'p', SITE_DESIGN: 'b' }) as any;
const exec = { waitUntil() {} } as any;

describe('ad attribution', () => {
  it('an ad landing sets a 30-day cookie with the campaign tags, and a plain visit sets none', async () => {
    const db = sqliteDb();
    const r = await worker.fetch(new Request('https://sanfranciscowatersystems.com/?gclid=synthetic-gclid&utm_campaign=sf-test&other=x'), env(db), exec);
    const c = r.headers.get('set-cookie')!;
    expect(c).toMatch(/^mhws_src=/);
    expect(c).toContain('Max-Age=2592000');
    expect(JSON.parse(decodeURIComponent(c.split(';')[0]!.slice('mhws_src='.length)))).toEqual({ utm_campaign: 'sf-test', gclid: 'synthetic-gclid' });
    const plain = await worker.fetch(new Request('https://sanfranciscowatersystems.com/'), env(db), exec);
    expect(plain.headers.get('set-cookie')).toBeNull();
  });

  it('a request sent later carries the cookie tags into the lead and its CRM tag', async () => {
    const db = sqliteDb();
    const cookie = `mhws_src=${encodeURIComponent(JSON.stringify({ gclid: 'synthetic-gclid', utm_campaign: 'sf-test' }))}`;
    const body = new URLSearchParams({ request_id: formRequestId(Date.now() - 40000), page: '/', website: '', market: NO_DEALER_ID, zip: '94110',
      homeowner: 'yes', concern: 'hardness', water_source: 'municipal', first_name: 'Test', last_name: 'Adclick', contact_method: 'email',
      email: 'adclick-test@example.com', consent_service: 'yes' });
    const r = await worker.fetch(new Request('https://sanfranciscowatersystems.com/api/inquiry', { method: 'POST', body,
      headers: { 'content-type': 'application/x-www-form-urlencoded', cookie, referer: 'https://sanfranciscowatersystems.com/' } }), env(db), exec);
    expect(r.status).toBe(200);
    const row = db.raw.prepare('SELECT utm_json FROM lead_receipts WHERE request_id = ?').get(body.get('request_id')!) as any;
    expect(JSON.parse(row.utm_json)).toEqual({ utm_campaign: 'sf-test', gclid: 'synthetic-gclid' });
  });

  it('names the source in one tag', () => {
    expect(sourceTag({ gclid: 'x' })).toBe('mhws-src-google-ads');
    expect(sourceTag({ wbraid: 'x' })).toBe('mhws-src-google-ads');
    expect(sourceTag({ msclkid: 'x' })).toBe('mhws-src-microsoft-ads');
    expect(sourceTag({ fbclid: 'x' })).toBe('mhws-src-meta');
    expect(sourceTag({ utm_source: 'Nextdoor Post' })).toBe('mhws-src-nextdoor-post');
    expect(sourceTag({})).toBe('mhws-src-none');
  });
});
