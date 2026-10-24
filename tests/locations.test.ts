import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import worker from '../src/index.ts';
import { LOCATIONS } from '../content/locations.ts';
import { CITY_DOMAINS, cityRedirect } from '../content/domains.ts';
import { PRODUCTION_MARKETS } from '../src/env.ts';

const BASE = 'https://www.myhomewatersystem.com';
const env = { ENVIRONMENT: 'production', BASE_URL: BASE, LINK_SECRET: 'test', DB: {} } as any;
const get = (url: string) => worker.fetch(new Request(url), env);

// Evidence IDs that exist in the research log.
const evidenceIds = new Set(readFileSync(new URL('../docs/research/evidence.csv', import.meta.url), 'utf8')
  .split('\n').slice(1).map((line) => line.split(',')[0]).filter(Boolean));

describe('city pages', () => {
  it('every city belongs to a production market and has a unique slug', () => {
    const ids = new Set(PRODUCTION_MARKETS.map((m) => m.id));
    for (const l of LOCATIONS) expect(ids.has(l.market_id), l.slug).toBe(true);
    expect(new Set(LOCATIONS.map((l) => l.slug)).size).toBe(LOCATIONS.length);
  });

  it('every water fact cites a source and evidence rows that exist', () => {
    for (const l of LOCATIONS) for (const f of l.facts) {
      expect(f.source_url, `${l.slug} ${f.label}`).toMatch(/^https:\/\//);
      expect(f.evidence_ids.length, `${l.slug} ${f.label}`).toBeGreaterThan(0);
      for (const id of f.evidence_ids) expect(evidenceIds.has(id), `${l.slug}: ${id} missing from evidence.csv`).toBe(true);
    }
  });

  it('renders each city page with its published facts and the not-open panel', async () => {
    for (const l of LOCATIONS) {
      const res = await get(`${BASE}/locations/${l.slug}/`);
      expect(res.status, l.slug).toBe(200);
      const body = await res.text();
      expect(body).toContain(`your ${l.name} home`);
      for (const f of l.facts) expect(body).toContain(f.source_url.replace(/&/g, '&amp;'));
      expect(body).toContain('Not open yet');
    }
  });

  it('city copy carries no prices or absolute claims', () => {
    for (const l of LOCATIONS) {
      const text = [l.intro, ...l.notes, ...l.facts.map((f) => f.value)].join(' ');
      expect(text, l.slug).not.toMatch(/\$\s?\d/);
      expect(text.toLowerCase(), l.slug).not.toMatch(/removes all|guarantee|cheapest|best in|unsafe|toxic|dangerous/);
    }
  });

  it('renders cluster pages that link to their cities', async () => {
    const res = await get(`${BASE}/locations/east-valley/`);
    expect(res.status).toBe(200);
    const body = await res.text();
    for (const l of LOCATIONS.filter((x) => x.market_id === 'east-valley')) expect(body).toContain(`/locations/${l.slug}/`);
  });

  it('lists every city in the sitemap', async () => {
    const xml = await (await get(`${BASE}/sitemap.xml`)).text();
    for (const l of LOCATIONS) expect(xml).toContain(`${BASE}/locations/${l.slug}/`);
    expect(xml).toContain(`${BASE}/locations/east-valley/`);
  });
});

describe('city domains', () => {
  it('every city domain points at a real city page', () => {
    const slugs = new Set(LOCATIONS.map((l) => l.slug));
    for (const [d, slug] of Object.entries(CITY_DOMAINS)) expect(slugs.has(slug), d).toBe(true);
  });

  it('forwards a city domain to its hub page with a 301, dropping the path', async () => {
    const res = await get('https://www.mesawatersystems.com/anything?x=1');
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe(`${BASE}/locations/mesa/`);
    expect(cityRedirect('KCWaterSystems.com', BASE)).toBe(`${BASE}/locations/kansas-city/`);
  });

  it('does not forward the hub itself', async () => {
    expect(cityRedirect('www.myhomewatersystem.com', BASE)).toBeNull();
    expect((await get(`${BASE}/`)).status).toBe(200);
  });
});
