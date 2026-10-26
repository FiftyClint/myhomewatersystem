import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import worker from '../src/index.ts';
import { LOCATIONS } from '../content/locations.ts';
import { CITY_SITES, siteForHost, siteForSlug } from '../content/sites.ts';
import { CITY_ZIPS } from '../content/zips.ts';
import { marketLaunchBlockers } from '../src/domain/config.ts';
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

  it('serves each city site home page with its published facts and the not-open panel', async () => {
    for (const site of CITY_SITES) {
      const l = LOCATIONS.find((x) => x.slug === site.slug)!;
      const res = await get(`https://${site.domain}/`);
      expect(res.status, site.domain).toBe(200);
      const body = await res.text();
      expect(body).toContain(`Water softeners and filtration in ${l.name}`);
      expect(body).toContain(`<title>${l.name} Water Softeners and Filtration | ${site.brand}</title>`);
      expect(body).toContain(`<link rel="canonical" href="https://${site.domain}/">`);
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

  it('renders hub cluster pages that link out to each city site', async () => {
    const res = await get(`${BASE}/locations/east-valley/`);
    expect(res.status).toBe(200);
    const body = await res.text();
    for (const l of LOCATIONS.filter((x) => x.market_id === 'east-valley')) expect(body).toContain(`https://${siteForSlug(l.slug)!.domain}/`);
  });

  it('hub sitemap leaves out cities that have their own site; each site lists its own pages', async () => {
    const xml = await (await get(`${BASE}/sitemap.xml`)).text();
    for (const l of LOCATIONS) expect(xml.includes(`${BASE}/locations/${l.slug}/`), l.slug).toBe(!siteForSlug(l.slug));
    expect(xml).toContain(`${BASE}/locations/east-valley/`);
    const cityXml = await (await get('https://mesawatersystems.com/sitemap.xml')).text();
    expect(cityXml).toContain('<loc>https://mesawatersystems.com/</loc>');
    expect(cityXml).not.toContain('myhomewatersystem.com');
    expect(await (await get('https://mesawatersystems.com/robots.txt')).text()).toContain('Sitemap: https://mesawatersystems.com/sitemap.xml');
  });
});

describe('city sites', () => {
  it('every city site points at a real city and no domain or slug repeats', () => {
    const slugs = new Set(LOCATIONS.map((l) => l.slug));
    for (const s of CITY_SITES) expect(slugs.has(s.slug), s.domain).toBe(true);
    expect(new Set(CITY_SITES.map((s) => s.domain)).size).toBe(CITY_SITES.length);
    expect(new Set(CITY_SITES.map((s) => s.slug)).size).toBe(CITY_SITES.length);
    expect(CITY_SITES.map((s) => s.domain)).not.toContain('sanantoniowatersystems.com');
    expect(siteForHost('WWW.KCWaterSystems.com:443')?.slug).toBe('kansas-city');
    expect(siteForHost('www.myhomewatersystem.com')).toBeUndefined();
  });

  it('sends www to the bare city domain, keeping the path', async () => {
    const res = await get('https://www.mesawatersystems.com/contact/?x=1');
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://mesawatersystems.com/contact/?x=1');
  });

  it('forwards the hub page of a city with its own site to that site', async () => {
    const res = await get(`${BASE}/locations/mesa/`);
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://mesawatersystems.com/');
    expect((await get(`${BASE}/`)).status).toBe(200);
  });

  it('brands shared pages for the city and keeps guide canonicals on the hub', async () => {
    const body = await (await get('https://hendersonwatersystems.com/water-softeners/')).text();
    expect(body).toContain('<title>Water softeners | Henderson Water Systems</title>');
    expect(body).toContain(`<link rel="canonical" href="${BASE}/water-softeners/">`);
    expect(body).toContain('Henderson Water Systems is run by My Home Water System');
    expect(body).toContain('Henderson Water Systems <span class="by">by My Home Water System</span>');
    const privacy = await (await get('https://hendersonwatersystems.com/privacy/')).text();
    expect(privacy).toContain('Henderson Water Systems');
    expect((await get('https://hendersonwatersystems.com/service-areas/')).headers.get('location')).toBe(`${BASE}/service-areas/`);
  });

  it('shows hello@ and no mailing address on contact pages', async () => {
    for (const url of ['https://kcwatersystems.com/contact/', `${BASE}/contact/`]) {
      const body = await (await get(url)).text();
      expect(body, url).toContain('hello@myhomewatersystem.com');
      expect(body.toLowerCase(), url).not.toMatch(/mailing address|po box|suite \d/);
    }
    const kcContact = await (await get('https://kcwatersystems.com/contact/')).text();
    expect(kcContact).toContain('href="tel:+19132867027"');
    expect(kcContact).toContain('(913) 286-7027');
    expect(kcContact).toContain('Contact KC Water Systems by My Home Water System');
    expect(kcContact).not.toContain('Hours');
  });

  it('city home pages carry FAQ and website JSON-LD with no address, price or rating', async () => {
    const body = await (await get('https://gilbertwatersystems.com/')).text();
    const blocks = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]!));
    expect(blocks.map((b) => b['@type'])).toEqual(['WebSite', 'FAQPage']);
    expect(blocks[1].mainEntity[0].name).toBe('How hard is the water in Gilbert?');
    const all = JSON.stringify(blocks);
    expect(all).not.toMatch(/"address"|PostalAddress|aggregateRating|priceRange|\$\s?\d/i);
  });

  it('a ZIP checked on one city site goes to the site for that ZIP', async () => {
    const res = await get('https://mesawatersystems.com/check?zip=85224');
    expect(res.status).toBe(303);
    // Markets are not open yet, so even a served ZIP goes to the hub's out-of-area answer.
    expect(res.headers.get('location')).toBe(`${BASE}/check?zip=85224`);
  });
});

describe('market config', () => {
  it('Kansas City includes Johnson County ZIPs on its city site', () => {
    const kc = PRODUCTION_MARKETS.find((m) => m.id === 'kansas-city')!;
    for (const z of ['66062', '66212', '66215', '66221']) {
      expect(kc.zips, z).toContain(z);
      expect(CITY_ZIPS['kansas-city'], z).toContain(z);
    }
  });

  it('85256 stays out of the East Valley', () => {
    expect(PRODUCTION_MARKETS.find((m) => m.id === 'east-valley')!.zips).not.toContain('85256');
  });

  it("each city site shows its market's tracking number", async () => {
    const want: Record<string, string> = { 'kansas-city': '+19132867027', 'east-valley': '+16029622652', 'las-vegas-valley': '+17255250811', 'san-antonio-area': '+17262042386' };
    for (const site of CITY_SITES) {
      const market = LOCATIONS.find((l) => l.slug === site.slug)!.market_id;
      const body = await (await get(`https://${site.domain}/`)).text();
      expect(body, site.domain).toContain(`href="tel:${want[market]}"`);
    }
  });

  it('a market cannot launch without a tracking number in +1 form', () => {
    for (const m of PRODUCTION_MARKETS) expect(marketLaunchBlockers(m).join(), m.id).not.toMatch(/tracking phone/);
    expect(marketLaunchBlockers({ ...PRODUCTION_MARKETS[0]!, tracking_phone: null })).toContain('no tracking phone number');
    const m = { ...PRODUCTION_MARKETS[0]!, tracking_phone: '602-555-0100' };
    expect(marketLaunchBlockers(m)).toContain('tracking phone number is not in +1XXXXXXXXXX form');
    expect(marketLaunchBlockers({ ...m, tracking_phone: '+16025550100' }).join()).not.toMatch(/tracking phone/);
  });
});
