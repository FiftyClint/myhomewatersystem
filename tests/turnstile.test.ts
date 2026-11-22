import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import worker from '../src/index.ts';
import { sqliteDb } from './helpers.ts';
import { allApexDomains } from '../content/sites.ts';
import { verifyTurnstile, type TurnstileWidget } from '../src/site/turnstile.ts';
import { NO_DEALER_ID } from '../src/domain/no-dealer.ts';
import { formRequestId } from '../src/util.ts';

// Clint, 2026-11-22 ("Do it"): Cloudflare Turnstile on the request form. Keys below are SYNTHETIC.
const STG = 'https://mhws-staging.example.workers.dev';
const WIDGET: TurnstileWidget = { sitekey: 'synthetic-sitekey', secret: 'synthetic-secret', domains: ['mhws-staging.example.workers.dev'] };
const env = (extra: Record<string, unknown> = {}) =>
  ({ DB: sqliteDb(), ENVIRONMENT: 'staging', BASE_URL: STG, CRM_PROVIDER: 'mock', SITE_DESIGN: 'b', TURNSTILE_WIDGETS: JSON.stringify([WIDGET]), ...extra }) as any;
const exec = { waitUntil() {} } as any;
const verifyOk = (over: Record<string, unknown> = {}) =>
  vi.fn(async () => new Response(JSON.stringify({ success: true, hostname: 'mhws-staging.example.workers.dev', action: 'inquiry', ...over })));

async function post(e: any, fields: Record<string, string>) {
  const body = new URLSearchParams({ request_id: formRequestId(Date.now() - 30000), page: '/check', website: '', market: NO_DEALER_ID, zip: '99501',
    homeowner: 'yes', concern: 'drinking_water', water_source: 'municipal', first_name: 'Test', last_name: 'Turnstile', contact_method: 'email',
    email: 'turnstile-test@example.com', consent_service: 'yes', ...fields });
  const r = await worker.fetch(new Request(`${STG}/api/inquiry`, { method: 'POST', body, headers: { 'content-type': 'application/x-www-form-urlencoded', referer: `${STG}/check` } }), e, exec);
  return { status: r.status, text: await r.text(), rid: body.get('request_id')! };
}
const receipt = (e: any, rid: string) => e.DB.raw.prepare('SELECT payload_json, signals_json FROM lead_receipts WHERE request_id = ?').get(rid) as any;

afterEach(() => vi.unstubAllGlobals());

describe('Turnstile widgets', () => {
  it('cover every domain the Worker serves, ten to a widget at most', () => {
    const routes = [...readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8').matchAll(/pattern = "([^"]+)"/g)].map((m) => m[1]!.replace(/^www\./, ''));
    expect(new Set(allApexDomains())).toEqual(new Set(routes));
    expect(Math.ceil(new Set(allApexDomains()).size / 10)).toBeLessThanOrEqual(20);
  });

  it('a form page carries the widget and opens the CSP to Turnstile only when the host has one', async () => {
    const on = await worker.fetch(new Request(`${STG}/check?zip=99501`), env(), exec);
    const t = await on.text();
    expect(t).toContain('<div class="cf-turnstile" data-sitekey="synthetic-sitekey" data-action="inquiry"></div>');
    expect(t).toContain('<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>');
    expect(t).not.toContain('<!--turnstile-->');
    const csp = on.headers.get('content-security-policy')!;
    expect(csp).toContain('script-src https://static.cloudflareinsights.com/beacon.min.js https://challenges.cloudflare.com;');
    expect(csp).toContain('frame-src https://challenges.cloudflare.com;');

    const off = await worker.fetch(new Request(`${STG}/check?zip=99501`), env({ TURNSTILE_WIDGETS: undefined }), exec);
    const t2 = await off.text();
    expect(t2).not.toMatch(/cf-turnstile|<!--turnstile-->/);
    expect(off.headers.get('content-security-policy')).not.toContain('challenges.cloudflare.com');
  });

  it('a post with no token or a failed check is asked to try again and stores nothing', async () => {
    const e = env();
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: false, 'error-codes': ['invalid-input-response'] }))));
    for (const fields of [{}, { 'cf-turnstile-response': 'bad-token' }] as Record<string, string>[]) {
      const r = await post(e, fields);
      expect(r.status).toBe(422);
      expect(r.text).toContain('Please complete the check above the button, then send again.');
      expect(r.text).toContain('class="cf-turnstile"');
      expect(receipt(e, r.rid)).toBeUndefined();
    }
  });

  it('a passed check is stored without the token, and an unreachable Cloudflare keeps the request flagged', async () => {
    const e = env();
    const f = verifyOk();
    vi.stubGlobal('fetch', f);
    const r = await post(e, { 'cf-turnstile-response': 'good-token' });
    expect(r.status).toBe(200);
    expect(String((f.mock.calls[0] as any)[1].body)).toContain('secret=synthetic-secret');
    const row = receipt(e, r.rid);
    expect(row.payload_json).not.toContain('good-token');
    expect(JSON.parse(row.signals_json)).toMatchObject({ turnstile: 'pass', checks: [] });

    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('network down'); }));
    const r2 = await post(e, { 'cf-turnstile-response': 'good-token-2', email: 'turnstile-test-2@example.com' });
    expect(r2.status).toBe(200);
    expect(JSON.parse(receipt(e, r2.rid).signals_json).checks).toEqual(['turnstile-unverified']);
  });

  it('a token from another host or another form fails', async () => {
    expect(await verifyTurnstile(WIDGET, 't', null, 'mhws-staging.example.workers.dev', verifyOk({ hostname: 'evil.example' }))).toBe('fail');
    expect(await verifyTurnstile(WIDGET, 't', null, 'mhws-staging.example.workers.dev', verifyOk({ action: 'login' }))).toBe('fail');
    expect(await verifyTurnstile(WIDGET, 't', null, 'mhws-staging.example.workers.dev', verifyOk())).toBe('pass');
    expect(await verifyTurnstile(WIDGET, 'x'.repeat(2049), null, 'mhws-staging.example.workers.dev', verifyOk())).toBe('fail');
  });
});
