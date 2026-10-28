import { describe, expect, it } from 'vitest';
import worker from '../src/index.ts';
import { LOCATIONS } from '../content/locations.ts';
import { CITY_SITES } from '../content/sites.ts';
import { classOf } from '../src/site/water.ts';
import { PRODUCTION_MARKETS } from '../src/env.ts';

// Pages built for AI assistants and search engines as well as people: answers first, sources linked,
// machine-readable copies of the same published facts, and crawler rules that welcome AI assistants.
const BASE = 'https://www.myhomewatersystem.com';
const env = { ENVIRONMENT: 'production', BASE_URL: BASE, LINK_SECRET: 'test', DB: {} } as any;
const staging = { ...env, ENVIRONMENT: 'staging', BASE_URL: 'https://mhws-staging.clint-bfa.workers.dev' };
const get = (url: string, e = env) => worker.fetch(new Request(url), e);

describe('USGS classes', () => {
  it('uses the USGS boundaries in mg/L as calcium carbonate', () => {
    expect([0, 60, 61, 120, 121, 180, 181].map(classOf)).toEqual(['soft', 'soft', 'moderately hard', 'moderately hard', 'hard', 'hard', 'very hard']);
  });

  it('every published span sits inside its facts and is low to high', () => {
    for (const l of LOCATIONS) {
      if (!l.scale_mgl) continue;
      expect(l.scale_mgl[0], l.slug).toBeLessThanOrEqual(l.scale_mgl[1]);
      expect(l.facts.length, l.slug).toBeGreaterThan(0);
    }
  });
});

describe('city sites for AI assistants', () => {
  it('serves llms.txt and water.json with the same published facts and no prices', async () => {
    for (const site of CITY_SITES) {
      const l = LOCATIONS.find((x) => x.slug === site.slug)!;
      const txt = await (await get(`https://${site.domain}/llms.txt`)).text();
      expect(txt, site.domain).toContain(`# ${site.brand}`);
      for (const f of l.facts) expect(txt, site.domain).toContain(f.source_url);
      const res = await get(`https://${site.domain}/water.json`);
      expect(res.headers.get('content-type'), site.domain).toContain('application/json');
      const data = await res.json() as any;
      expect(data.city).toBe(l.name);
      expect(data.hardness_facts.length).toBe(l.facts.length);
      expect(data.published_span_mg_per_l).toEqual(l.scale_mgl);
      // Only markets with Clint's launch go take requests in production.
      expect(data.taking_requests, site.domain).toBe(!!PRODUCTION_MARKETS.find((m) => m.id === l.market_id)!.launch_approval_id);
      expect(JSON.stringify(data) + txt).not.toMatch(/\$\s?\d/);
    }
  });

  it('answers the hardness question first, with the USGS class and the not-a-utility line', async () => {
    const body = await (await get('https://philadelphiawatersystems.com/')).text();
    expect(body).toContain('class="answer-card"');
    expect(body).toContain('read as moderately hard to very hard');
    expect(body).toContain('We are not a water utility');
    // Philadelphia is open (Clint's go, 2026-10-28), so it carries the request button; Atlanta is not.
    expect(body).toContain('class="sticky-cta"');
    const none = await (await get('https://atlantawatersystems.com/')).text();
    expect(none).toContain('We have not found a published hardness figure for Atlanta');
    expect(none).not.toContain('class="sticky-cta"');
  });

  it('lists llms.txt and water.json in the sitemap with a lastmod date', async () => {
    const xml = await (await get('https://denverwatersystems.com/sitemap.xml')).text();
    expect(xml).toContain('<loc>https://denverwatersystems.com/llms.txt</loc>');
    expect(xml).toContain('<loc>https://denverwatersystems.com/water.json</loc>');
    expect(xml).toContain('<lastmod>2026-10-27</lastmod>');
  });
});

describe('robots.txt', () => {
  it('names AI assistant crawlers and allows them on production', async () => {
    const txt = await (await get('https://seattlewatersystems.com/robots.txt')).text();
    for (const bot of ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) expect(txt).toContain(`User-agent: ${bot}`);
    expect(txt).toContain('Allow: /');
    expect(txt).toContain('Disallow: /internal/');
    expect(txt).toContain('Sitemap: https://seattlewatersystems.com/sitemap.xml');
  });

  it('blocks every crawler on staging', async () => {
    const txt = await (await get('https://mhws-staging.clint-bfa.workers.dev/robots.txt', staging)).text();
    expect(txt).toContain('Disallow: /');
    expect(txt).not.toContain('GPTBot');
  });
});

describe('hub', () => {
  it('leads with hardness by city and links each city site', async () => {
    const body = await (await get(`${BASE}/`)).text();
    expect(body).toMatch(/<h1>How hard is your water\? Published hardness for \d+ U\.S\. cities<\/h1>/);
    for (const s of CITY_SITES) expect(body, s.domain).toContain(`https://${s.domain}/`);
    const blocks = [...body.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]!));
    expect(blocks.map((b) => b['@type'])).toContain('Dataset');
  });

  it('serves the city table page, cities.json and llms.txt', async () => {
    expect((await get(`${BASE}/hard-water-by-city/`)).status).toBe(200);
    const data = await (await get(`${BASE}/data/cities.json`)).json() as any;
    const list = Array.isArray(data) ? data : data.cities;
    expect(list.length).toBe(LOCATIONS.length);
    const txt = await (await get(`${BASE}/llms.txt`)).text();
    expect(txt).toContain('/data/cities.json');
    const xml = await (await get(`${BASE}/sitemap.xml`)).text();
    expect(xml).toContain(`${BASE}/hard-water-by-city/`);
  });
});

describe('alias and state domains', () => {
  it('sends lawatersystems.com to the Los Angeles site, keeping the path', async () => {
    const res = await get('https://www.lawatersystems.com/water.json?x=1');
    expect(res.status).toBe(301);
    expect(res.headers.get('location')).toBe('https://losangeleswatersystems.com/water.json?x=1');
  });

  it('serves the California directory and sends hub-only pages to the hub', async () => {
    const res = await get('https://californiawatersystems.com/');
    expect(res.status).toBe(200);
    const body = await res.text();
    for (const s of CITY_SITES.filter((x) => LOCATIONS.find((l) => l.slug === x.slug)!.state === 'CA')) expect(body, s.domain).toContain(`https://${s.domain}/`);
    expect((await get('https://www.californiawatersystems.com/')).status).toBe(301);
    expect((await get('https://californiawatersystems.com/hard-water-by-city/')).headers.get('location')).toBe(`${BASE}/hard-water-by-city/`);
    expect(await (await get('https://californiawatersystems.com/llms.txt')).text()).toContain('California');
  });
});
