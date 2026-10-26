import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import worker from '../src/index.ts';
import { CITY_SITES, HUB_DOMAIN } from '../content/sites.ts';
import { chooseCrm } from '../src/env.ts';
import prodPolicy from '../config/policies/production.json';

const BASE = 'https://www.myhomewatersystem.com';
const prod = { ENVIRONMENT: 'production', BASE_URL: BASE, LINK_SECRET: 'test', DB: {} } as any;
const staging = { ENVIRONMENT: 'staging', BASE_URL: 'https://mhws-staging.example.workers.dev', DB: {} } as any;
const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');

describe('launch readiness', () => {
  it('a form post over the limit gets 429 before anything is stored', async () => {
    const keys: string[] = [];
    const env = { ...prod, HASH_PEPPER: 'p', FORM_LIMITER: { limit: async ({ key }: { key: string }) => { keys.push(key); return { success: false }; } } };
    const r = await worker.fetch(new Request(`${BASE}/api/inquiry`, { method: 'POST', headers: { 'cf-connecting-ip': '203.0.113.9' }, body: 'zip=85201' }), env);
    expect(r.status).toBe(429);
    expect(r.headers.get('retry-after')).toBe('60');
    expect(keys).toEqual(['inquiry:203.0.113.9']);
  });

  it('the bare hub domain forwards to www', async () => {
    const r = await worker.fetch(new Request(`https://${HUB_DOMAIN}/how-it-works/?a=1`), prod);
    expect(r.status).toBe(301);
    expect(r.headers.get('location')).toBe(`${BASE}/how-it-works/?a=1`);
  });

  it('staging previews a city site by cookie, and production ignores the cookie', async () => {
    const pick = await worker.fetch(new Request(`${staging.BASE_URL}/__site/kcwatersystems.com`), staging);
    expect(pick.status).toBe(303);
    expect(pick.headers.get('set-cookie')).toContain('mhws_site=kcwatersystems.com');
    const cookie = { headers: { cookie: 'mhws_site=kcwatersystems.com' } };
    const page = await (await worker.fetch(new Request(`${staging.BASE_URL}/`, cookie), staging)).text();
    expect(page).toContain('KC Water Systems');
    expect((await worker.fetch(new Request(`${staging.BASE_URL}/__site/example.com`), staging)).status).toBe(404);
    expect((await worker.fetch(new Request(`${BASE}/__site/kcwatersystems.com`), prod)).status).toBe(404);
    const hub = await (await worker.fetch(new Request(`${BASE}/`, cookie), prod)).text();
    expect(hub).not.toContain('KC Water Systems by');
  });

  it('wrangler has real database IDs and attaches every domain, apex and www, in production only', () => {
    expect(toml).not.toContain('00000000-0000-0000-0000-000000000000');
    const prodPart = toml.slice(toml.indexOf('[env.production]'));
    const stagingPart = toml.slice(toml.indexOf('[env.staging]'), toml.indexOf('[env.production]'));
    for (const d of [HUB_DOMAIN, ...CITY_SITES.map((s) => s.domain)]) {
      expect(prodPart).toContain(`{ pattern = "${d}", custom_domain = true }`);
      expect(prodPart).toContain(`{ pattern = "www.${d}", custom_domain = true }`);
    }
    expect(stagingPart).not.toContain('custom_domain');
  });

  it('staging can never use the My Home Water System HighLevel location', () => {
    const r = chooseCrm({ ENVIRONMENT: 'staging', CRM_PROVIDER: 'highlevel', ALLOW_LIVE_CRM_IN_STAGING: 'yes',
      HIGHLEVEL_TOKEN: 't', HIGHLEVEL_LOCATION_ID: '1NdIhzTx9ZJlqnXshDkQ', HIGHLEVEL_PIPELINE_ID: 'p' }, prodPolicy as any);
    expect(r.reason).toBe('staging may not use a production HighLevel location');
  });
});
