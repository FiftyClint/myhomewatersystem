import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { LOCATIONS } from '../content/locations.ts';
import { check, crawl } from '../scripts/check-duplicate-copy.ts';
import { designFor } from '../src/site/design.ts';
import { readFileSync } from 'node:fs';
import { CONCERN_GENERAL } from '../content/concerns.ts';

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

  it('design b: a city page leads with how the water affects you and answers each concern from its source', async () => {
    const t = await (await get('/', 'mhws_site=denverwatersystems.com; mhws_design=b')).text();
    expect(t).toContain('<h1>How is Denver water affecting you?</h1>');
    for (const k of ['id="concerns-h"', 'id="lead"', 'id="pfas"', 'id="disinfectant"', 'id="hardness"', 'href="#lead"', '15,826 lead lines listed', 'Below EPA&#39;s limit', 'Chloramine']) expect(t, k).toContain(k);
    for (const u of ['https://www.usgs.gov/water-science-school/science/hardness-water', 'https://www.ndsu.edu/agriculture/extension/publications/filtration-sediment-activated-carbon-and-mixed-media',
      'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule', 'https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas']) expect(t, u).toContain(u);
    for (const c of ['drinking_water', 'taste_odor', 'hardness', 'not_sure']) expect(t).toContain(`href="?concern=${c}#request"`);
    // A city with PFAS at or above 4 ppt says it was found, not below the limit.
    const dal = await (await get('/', 'mhws_site=dallaswatersystems.com; mhws_design=b')).text();
    expect(dal).toContain('Found, up to PFOA 6.3 ppt and PFOS 5.1 ppt');
    expect(dal).not.toContain('Below EPA&#39;s limit');
    // A hub city with no lead or PFAS figures on file shows no card for them.
    const c = await (await get('/locations/aurora/', 'mhws_design=b')).text();
    expect(c).toContain('id="hardness"');
    expect(c).not.toContain('id="pfas"');
    expect(c).not.toMatch(/—/);
    const a = await (await get('/', 'mhws_site=denverwatersystems.com; mhws_design=a')).text();
    expect(a).not.toContain('id="concerns-h"');
  });

  it('design b: a concern link chooses that concern in the form, and only the form\'s own values', async () => {
    const t = await (await get('/?concern=taste_odor', 'mhws_site=denverwatersystems.com; mhws_design=b')).text();
    expect(t).toContain('<option value="taste_odor" selected>');
    const bad = await (await get('/?concern=%22%3E%3Cscript%3E', 'mhws_site=denverwatersystems.com; mhws_design=b')).text();
    expect(bad).not.toContain(' selected>');
  });

  it('design b: the hub home asks how your water affects you and covers private wells from EPA', async () => {
    const h = await (await get('/', 'mhws_design=b')).text();
    expect(h).toContain('<h1>How is your water affecting you?</h1>');
    for (const k of ['id="wellwater"', 'id="lead"', 'id="pfas"', 'id="disinfectant"', 'id="hardness"', 'Dallas', 'action="/check"', '"Dataset"']) expect(h, k).toContain(k);
    for (const u of ['https://www.epa.gov/privatewells/protect-your-homes-water', 'https://www.epa.gov/privatewells/potential-well-water-contaminants-and-their-impacts',
      'https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals', 'https://www.epa.gov/ccr/ccr-information-consumers',
      'https://www.epa.gov/ground-water-and-drinking-water/revised-lead-and-copper-rule']) expect(h, u).toContain(u);
    expect(h).not.toMatch(/—/);
    // Open ended: no count of cities reads like coverage stops there, and the tab title is not about hardness alone.
    expect(h).not.toMatch(/cities on file|cities covered|\d+ of \d+ cities/);
    // Every ZIP takes a request, so the hub promises no local company and counts no areas.
    expect(h).not.toMatch(/written quote from a local company|Taking requests in \d+/);
    for (const k of ['id="check-h"', 'Your ZIP code or city', 'How Is Your Water Affecting You?']) expect(h, k).toContain(k);
    expect(await (await get('/', '')).text()).toContain('<title>How Hard Is Your Water?');
  });

  it('design b: the hub check takes a city name, and a place with no page gets how to check it', async () => {
    const r = await get('/check?zip=Aurora', 'mhws_design=b');
    expect(r.status).toBe(303);
    expect(r.headers.get('location')).toContain('/locations/aurora/');
    for (const q of ['Boise%2C%20ID', '99501']) {
      const t = await (await get(`/check?zip=${q}`, 'mhws_design=b')).text();
      for (const k of ['id="check-h"', 'https://www.epa.gov/ccr/ccr-information-consumers', 'https://www.epa.gov/privatewells/protect-your-homes-water',
        'action="/api/inquiry"', 'name="market" value="no-dealer-assigned"', 'No local company is set up for your area yet']) expect(t, k).toContain(k);
      expect(t).not.toContain('A local specialist');
      expect(t).not.toMatch(/—/);
    }
    expect(await (await get('/check?zip=%3Cscript%3E', 'mhws_design=b')).text()).not.toContain('<script>');
    // The classic look keeps its own out-of-area answer.
    expect(await (await get('/check?zip=99501')).text()).toContain('We do not serve 99501 yet');
  });

  it('every concern statement has its evidence row', () => {
    const ids = new Set(readFileSync('docs/research/evidence.csv', 'utf8').split('\n').slice(1).map((l) => l.split(',')[0]));
    for (const [k, v] of Object.entries(CONCERN_GENERAL)) for (const id of v.evidence_ids) expect(ids.has(id), `${k}: ${id}`).toBe(true);
  });

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
