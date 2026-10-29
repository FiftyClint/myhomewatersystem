import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { LOCATIONS } from '../content/locations.ts';
import { check, crawl } from '../scripts/check-duplicate-copy.ts';
import { designFor } from '../src/site/design.ts';

// The two redesign directions (task "Make the water systems sites look premium", 2026-10-29). Each must keep
// every answer-engine element and the working request form of the classic pages.
const STG = 'https://mhws-staging.clint-bfa.workers.dev';
const staging = { ENVIRONMENT: 'staging', BASE_URL: STG, LINK_SECRET: 't', DB: {} } as any;
const get = (path: string, cookie = '') => worker.fetch(new Request(`${STG}${path}`, { headers: { cookie } }), staging);
const denver = LOCATIONS.find((l) => l.slug === 'denver')!;
const aurora = LOCATIONS.find((l) => l.slug === 'aurora')!;

describe('redesign directions', () => {
  for (const d of ['a', 'b'] as const) {
    it(`design ${d}: a city site keeps the answer card, the facts, the FAQ schema, every source and the form`, async () => {
      const r = await get('/', `mhws_site=denverwatersystems.com; mhws_design=${d}`);
      expect(r.status).toBe(200);
      const t = await r.text();
      expect(t).toContain(`class="d-${d}"`);
      for (const k of ['id="facts-h"', 'class="answer-card"', '"FAQPage"', 'action="/api/inquiry"', 'id="request"', 'id="systems"', 'id="faq"', 'We are not a water utility.', 'href="/water.json"', 'href="/llms.txt"']) expect(t, k).toContain(k);
      for (const f of denver.facts) expect(t, f.source_url).toContain(f.source_url.replace(/&/g, '&amp;'));
      expect(t).not.toMatch(/—/);
      expect(t).not.toMatch(/<script(?! type="application\/ld\+json")/);
      expect(r.headers.get('content-security-policy')).toContain("font-src 'self'");
    });

    it(`design ${d}: a hub city page and the hub home render with their sources`, async () => {
      const c = await (await get(`/locations/${aurora.slug}/`, `mhws_design=${d}`)).text();
      for (const k of ['id="facts-h"', 'class="answer-card"', '"FAQPage"', 'action="/api/inquiry"', 'name="page" value="/locations/aurora/"']) expect(c, k).toContain(k);
      for (const f of aurora.facts) expect(c, f.source_url).toContain(f.source_url.replace(/&/g, '&amp;'));
      const h = await (await get('/', `mhws_design=${d}`)).text();
      expect(h).toContain(`class="d-${d}"`);
      expect(h).toContain('action="/check"');
      expect(h).toContain('"Dataset"');
      expect(h).toContain('href="https://denverwatersystems.com/"');
    });
  }

  it('production stays on the classic look unless SITE_DESIGN names a direction, and ignores the preview cookie', async () => {
    expect(designFor('mhws_design=a', undefined, false)).toBe('classic');
    expect(designFor('mhws_design=a', 'b', false)).toBe('b');
    expect(designFor('mhws_design=a', undefined, true)).toBe('a');
    expect(designFor('mhws_design=zz', undefined, true)).toBe('classic');
    const prod = { ...staging, ENVIRONMENT: 'production', BASE_URL: 'https://www.myhomewatersystem.com' };
    const t = await (await worker.fetch(new Request('https://denverwatersystems.com/', { headers: { cookie: 'mhws_design=a' } }), prod)).text();
    expect(t).not.toContain('class="d-a"');
    expect((await worker.fetch(new Request('https://www.myhomewatersystem.com/__design/a'), prod)).status).not.toBe(303);
  });

  it('staging switches the look by address, alone or with a site', async () => {
    const r = await get('/__design/b');
    expect(r.status).toBe(303);
    expect(r.headers.get('set-cookie')).toContain('mhws_design=b');
    expect((await get('/__design/classic')).headers.get('set-cookie')).toContain('Max-Age=0');
    expect((await get('/__design/zz')).status).toBe(404);
    const s = await get('/__site/denverwatersystems.com?design=a');
    expect(s.headers.get('set-cookie')).toContain('mhws_site=denverwatersystems.com');
    expect(s.headers.get('set-cookie')).toContain('mhws_design=a');
  });

  for (const d of ['a', 'b'] as const) {
    it(`design ${d}: no shared 40-word passage across sites`, async () => {
      const env = { ENVIRONMENT: 'production', BASE_URL: 'https://www.myhomewatersystem.com', LINK_SECRET: 't', HASH_PEPPER: 'p', DB: {}, SITE_DESIGN: d } as any;
      const r = check(await crawl(env));
      const show = (xs: { a: string; b: string; phrase: string }[]) => xs.slice(0, 5).map((x) => `${x.a} | ${x.b}: "${x.phrase}"`);
      expect(r.unguarded).toEqual([]);
      expect(show(r.sameSite)).toEqual([]);
      expect(show(r.crossSite)).toEqual([]);
    }, 300_000);
  }
});
