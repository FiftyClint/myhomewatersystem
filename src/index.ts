import { buildContext, type Env } from './env.ts';
import { displayPhone, layout } from './site/layout.ts';
import { checkNotOnFileV2, cityPageV2, hubCrumbs, hubHomeV2, shellV2 } from './site/v2.ts';
import { designCookie, designFor, DESIGN_NAMES, DESIGNS, parseDesign, type Design } from './site/design.ts';
import { companyBody, legalBody, marketBody, noDealerAreaThankYou, outOfAreaBody, serviceAreasBody, STATIC_PAGES, thankYouBody, unavailableBody } from './site/pages.ts';
import { cityBody, clusterBody, sitemapXml, urlset } from './site/locations.ts';
import { cityAboutBody, cityAreaBody, cityAreaJsonLd, cityContactBody, cityDescription, cityHomeBody, cityJsonLd, hubCityJsonLd, cityLlmsTxt, cityTitle, cityWaterJson } from './site/city.ts';
import { areaPageOf } from '../content/areas.ts';
import { citiesJson, hardWaterByCityBody, hubHomeBody, listedCities, hubJsonLd, hubLlmsTxt, stateBody, stateLlmsTxt } from './site/hub.ts';
import { robotsTxt } from './site/bots.ts';
import { isSyndicated } from './site/noindex.ts';
import { locationBySlug, locationsInMarket, type CityLocation } from '../content/locations.ts';
import { CITY_ZIPS } from '../content/zips.ts';
import { aliasTarget, ALIAS_DOMAINS, CITY_SITES, HUB_BRAND, HUB_DOMAIN, normalizeHost, siteForHost, siteForSlug, siteUrl, STATE_SITES, stateSiteForHost, type CitySite } from '../content/sites.ts';
import type { MarketConfig } from './domain/config.ts';
import { handleIntake, findMarket } from './intake/intake.ts';
import { NO_DEALER_ID } from './domain/no-dealer.ts';
import { isOpen } from './site/city.ts';
import { providerPage } from './dealer/page.ts';
import { internalApi } from './internal/api.ts';
import { crmHook } from './hooks/crm.ts';
import { syncConfig } from './domain/repo.ts';
import { runJobs } from './worker/jobs.ts';
import { credentialStmts, hasLiveWork, runChecks } from './worker/checks.ts';
import { handlers } from './worker/handlers.ts';
import { timingSafeEqual } from './util.ts';

const MAX_BODY = 16 * 1024;
const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

function html(status: number, page: string, extra: Record<string, string> = {}): Response {
  return new Response(page, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...SECURITY_HEADERS, ...extra } });
}

// Plain text, JSON and XML for crawlers and assistants. Cacheable for an hour; the facts change rarely.
function asset(body: string, type: string): Response {
  return new Response(body, { headers: { 'content-type': `${type}; charset=utf-8`, 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
}
const XML = 'application/xml', TEXT = 'text/plain', JSONT = 'application/json';

// The city a ZIP belongs to, within the market that serves it.
function cityForZip(zip: string, m: MarketConfig): CityLocation | undefined {
  return locationsInMarket(m.id).find((l) => (CITY_ZIPS[l.slug] ?? []).includes(zip));
}

async function readForm(req: Request): Promise<Record<string, string> | null> {
  const len = Number(req.headers.get('content-length') ?? '0');
  if (len > MAX_BODY) return null;
  const text = await req.text();
  if (text.length > MAX_BODY) return null;
  const type = req.headers.get('content-type') ?? '';
  if (type.includes('application/json')) {
    try { return Object.fromEntries(Object.entries(JSON.parse(text)).map(([k, v]) => [k, String(v)])); } catch { return {}; }
  }
  return Object.fromEntries(new URLSearchParams(text));
}

type PageFn = (title: string, description: string, body: string, noindex?: boolean, more?: { canonical?: string; jsonLd?: object[]; alternates?: string }) => string;

type Form = { vals?: Record<string, string | undefined>; errors?: Record<string, string> };
const ld = (o: object): string => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;
// A city site's home page and a hub city page, in the classic look or one of the redesign directions.
// A concern card's "Ask about" link opens the form with that concern chosen. Only the form's own values are taken.
const CONCERNS = ['hardness', 'taste_odor', 'drinking_water', 'not_sure'];
const prefill = (url: URL) => { const c = url.searchParams.get('concern'); return c && CONCERNS.includes(c) ? { concern: c } : {}; };
const cityHome = (d: Design, site: CitySite, l: CityLocation, m: MarketConfig, rid: string, hubBase: string, form: Form) => (d === 'classic'
  ? cityHomeBody(site, l, m, rid, hubBase, form) : cityPageV2(l, m, rid, hubBase, d, { brand: site.brand, page: '/', onHub: false, form }));
const hubCity = (d: Design, l: CityLocation, m: MarketConfig, rid: string, hubBase: string, form: Form) => (d === 'classic'
  ? cityBody(l, m, rid, form) : cityPageV2(l, m, rid, hubBase, d, { brand: HUB_BRAND, page: `/locations/${l.slug}/`, onHub: true, crumbs: hubCrumbs(l, m), form }));

// Routes that differ on a city site. Returns null for routes every host shares (intake, legal pages,
// dealer links, internal API, hooks), which the main handler serves with the city's branding.
async function citySite(req: Request, url: URL, env: Env, site: CitySite, city: CityLocation, m: MarketConfig, page: PageFn, staging: boolean, design: Design): Promise<Response | null> {
  const path = url.pathname;
  const base = siteUrl(site);
  if (req.method !== 'GET' && req.method !== 'HEAD') return null;
  if (path === '/robots.txt') return asset(robotsTxt(base, staging), TEXT);
  const areas = areaPageOf(city.slug);
  if (path === '/sitemap.xml') return asset(urlset([`${base}/`, ...(areas ? [`${base}/by-area/`] : []), `${base}/contact/`, `${base}/llms.txt`, `${base}/water.json`], city.checked_on), XML);
  if (path === '/llms.txt') return asset(cityLlmsTxt(site, city, m, env.BASE_URL), TEXT);
  if (path === '/water.json') return asset(cityWaterJson(site, city, m), JSONT);
  if (path === '/') {
    const zip = url.searchParams.get('zip') ?? undefined;
    return html(200, page(cityTitle(site, city), cityDescription(city), cityHome(design, site, city, m, crypto.randomUUID(), env.BASE_URL, { vals: { zip, ...prefill(url) } }),
      false, { canonical: `${base}/`, jsonLd: cityJsonLd(site, city, m),
        alternates: `<link rel="alternate" type="application/json" href="${base}/water.json"><link rel="alternate" type="text/plain" title="llms.txt" href="${base}/llms.txt">` }));
  }
  if (path === '/check') {
    const zip = (url.searchParams.get('zip') ?? '').trim();
    const found = /^\d{5}$/.test(zip) ? findMarket([m], zip, !staging) : null;
    if (found) {
      const c = cityForZip(zip, found);
      const other = c && c.slug !== city.slug ? siteForSlug(c.slug) : undefined;
      return Response.redirect(other ? `${siteUrl(other)}/?zip=${zip}#request` : `${base}/?zip=${zip}#request`, 303);
    }
    // Another market, or not served: the hub works out where to send it.
    return Response.redirect(`${env.BASE_URL}/check?zip=${encodeURIComponent(zip)}`, 303);
  }
  if (path === '/by-area/' && areas) return html(200, page(`${areas.heading} | ${site.brand}`, areas.intro, cityAreaBody(site, city, areas), false,
    { canonical: `${base}/by-area/`, jsonLd: cityAreaJsonLd(site, city, areas) }));
  // About, the guides and the legal pages are the same text on every domain, so city sites serve them noindex
  // (src/site/noindex.ts). The hub keeps them indexable.
  if (path === '/about/') return html(200, page(`About | ${site.brand}`, `About ${site.brand}`, cityAboutBody(site, city), isSyndicated(path)));
  if (path === '/contact/') return html(200, page(`Contact | ${site.brand}`, `How to reach ${site.brand}`, cityContactBody(site, city, m)));
  // Hub-only sections forward to the hub.
  if (path === '/service-areas/' || path === '/for-dealers/' || path.startsWith('/locations/')) return Response.redirect(`${env.BASE_URL}${path}${url.search}`, 301);
  // Shared guides: served on the city site for visitors, noindex so the copies do not compete with the hub's.
  const st = STATIC_PAGES.find((p) => p.path === path);
  if (st) return html(200, page(st.title, st.description, st.html, st.noindex || isSyndicated(path)));
  return null;
}

export default {
  async fetch(req: Request, env: Env, exec?: ExecutionContext): Promise<Response> {
    const ctx = buildContext(env);
    const url = new URL(req.url);
    const path = url.pathname;
    const staging = env.ENVIRONMENT !== 'production';
    const banner = staging ? 'Staging preview with synthetic data. Not open for real requests. Legal pages and disclosures are drafts pending review.' : null;

    // Staging has one address, so a city site is previewed by cookie: /__site/<domain> picks one, /__site/hub goes back.
    const pick = staging ? path.match(/^\/__site\/([a-z0-9.-]+)$/) : null;
    if (pick) {
      const d = pick[1]!;
      const known = [...CITY_SITES.map((s) => s.domain), ...STATE_SITES.map((s) => s.domain), ...Object.keys(ALIAS_DOMAINS)];
      if (d !== 'hub' && !known.includes(d)) return new Response('unknown site', { status: 404 });
      const h = new Headers({ location: '/' });
      h.append('set-cookie', d === 'hub' ? 'mhws_site=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax' : `mhws_site=${d}; Path=/; Max-Age=86400; Secure; HttpOnly; SameSite=Lax`);
      const want = parseDesign(url.searchParams.get('design'));
      if (want) h.append('set-cookie', designCookie(want));
      return new Response(null, { status: 303, headers: h });
    }
    // Staging previews the redesign directions by cookie too: /__design/a, /__design/b, /__design/classic.
    const dpick = staging ? path.match(/^\/__design\/([a-z]+)$/) : null;
    if (dpick) {
      const d = parseDesign(dpick[1]);
      if (!d) return new Response('unknown design', { status: 404 });
      return new Response(null, { status: 303, headers: { location: '/', 'set-cookie': designCookie(d) } });
    }
    const design = designFor(req.headers.get('cookie'), env.SITE_DESIGN, staging);
    const host = (staging ? (req.headers.get('cookie') ?? '').match(/(?:^|;\s*)mhws_site=([a-z0-9.-]+)/)?.[1] : undefined) ?? url.host;

    // The hub lives at BASE_URL (www). Its bare domain forwards there.
    if (!staging && normalizeHost(url.host) === HUB_DOMAIN && new URL(env.BASE_URL).host !== HUB_DOMAIN) {
      return Response.redirect(`${env.BASE_URL}${path}${url.search}`, 301);
    }

    // A second domain for a city forwards to that city's site, path and all.
    const alias = aliasTarget(host);
    if (alias) return Response.redirect(`https://${alias}${path}${url.search}`, 301);

    // State directory sites: one page of the state's cities, sharing the hub's guides and legal pages.
    const state = stateSiteForHost(host);
    if (state && normalizeHost(host) !== state.domain) return Response.redirect(`https://${state.domain}${path}${url.search}`, 301);

    // City sites: each city domain is its own site. www goes to the bare domain.
    const site = siteForHost(host);
    if (site && normalizeHost(host) !== site.domain) return Response.redirect(`${siteUrl(site)}${path}${url.search}`, 301);
    const siteCity = site && locationBySlug(site.slug);
    const siteMarket = siteCity && ctx.markets.find((x) => x.id === siteCity.market_id);
    const base = site ? siteUrl(site) : state ? `https://${state.domain}` : env.BASE_URL;

    const brandName = site?.brand ?? state?.brand;
    const pageBanner = staging ? `${banner} Look: ${DESIGNS.map((d) => d === design ? `<strong>${DESIGN_NAMES[d]}</strong>` : `<a href="/__design/${d}">${DESIGN_NAMES[d]}</a>`).join(' · ')}.` : null;
    const page = (title: string, description: string, body: string, noindex = false, more: { canonical?: string; jsonLd?: object[]; alternates?: string } = {}) => {
      const t = brandName ? title.replace(/ \| My Home Water System$/, ` | ${brandName}`) : title;
      const phone = siteMarket?.tracking_phone ?? null;
      if (design === 'classic') return layout({ title: t, description, path, body, noindex: noindex || staging, banner: pageBanner, baseUrl: base, brand: brandName, phone, ...more });
      return shellV2({ title: t, description, canonical: more.canonical ?? `${base}${path}`, noindex: noindex || staging, banner: pageBanner,
        brand: brandName ?? 'My Home Water System', city: !!site, phone, phoneDisplay: phone ? displayPhone(phone) : null,
        jsonLd: (more.jsonLd ?? []).map(ld).join(''), alternates: more.alternates ?? '', body, open: body.includes('id="request"') && body.includes('action="/api/inquiry"') }, design);
    };

    if (site && siteCity && siteMarket) {
      const r = await citySite(req, url, env, site, siteCity, siteMarket, page, staging, design);
      if (r) return r;
    }

    if (state && (req.method === 'GET' || req.method === 'HEAD')) {
      const sb = `https://${state.domain}`;
      if (path === '/robots.txt') return asset(robotsTxt(sb, staging), TEXT);
      if (path === '/sitemap.xml') return asset(urlset([`${sb}/`, `${sb}/llms.txt`]), XML);
      if (path === '/llms.txt') return asset(stateLlmsTxt(state, ctx.markets, env.BASE_URL), TEXT);
      if (path === '/') return html(200, page(`${state.stateName} Water Hardness by City | ${state.brand}`,
        `Published drinking water hardness for ${state.stateName} cities, with sources, and how to request a water treatment quote.`, stateBody(state, ctx.markets), false, { canonical: `${sb}/` }));
      // The hub's contact page lists every city site, so a state site sends visitors there rather than serving a copy.
      if (path === '/check' || path === '/contact/' || path === '/service-areas/' || path === '/for-dealers/' || path === '/hard-water-by-city/' || path.startsWith('/locations/')) return Response.redirect(`${env.BASE_URL}${path}${url.search}`, 301);
      const st = STATIC_PAGES.find((p) => p.path === path);
      if (st) return html(200, page(st.title, st.description, st.html, st.noindex || isSyndicated(path)));
    }

    if (path === '/healthz') return new Response(JSON.stringify({ ok: true, env: env.ENVIRONMENT, crm: ctx.crm.name, crm_reason: ctx.crmReason }), { headers: { 'content-type': 'application/json' } });
    if (path === '/robots.txt') return asset(robotsTxt(base, staging), TEXT);
    if (path === '/sitemap.xml') return asset(sitemapXml(env.BASE_URL, ctx.markets, ['/hard-water-by-city/', '/data/cities.json', '/llms.txt', ...STATIC_PAGES.filter((p) => !p.noindex).map((p) => p.path)]), XML);
    if (path === '/llms.txt') return asset(hubLlmsTxt(env.BASE_URL, ctx.markets), TEXT);
    if (path === '/data/cities.json') return asset(citiesJson(ctx.markets), JSONT);

    if (path === '/' && req.method === 'GET') return html(200, page(design === 'classic' ? 'How Hard Is Your Water? Hardness by City | My Home Water System' : 'How Is Your Water Affecting You? Lead, PFAS, Chlorine and Hard Water | My Home Water System',
      design === 'classic' ? 'Drinking water hardness for U.S. cities, copied from each utility with its source and date, and how to get a written quote for a softener or filter.'
        : 'Lead pipes, PFAS, chlorine, hard water and private wells, answered from EPA, USGS and utility reports, with how to check your own water and get a written quote.', (design === 'classic' ? hubHomeBody(ctx.markets) : hubHomeV2(listedCities(ctx.markets), ctx.markets, design)),
      false, { jsonLd: hubJsonLd(env.BASE_URL, ctx.markets), alternates: `<link rel="alternate" type="application/json" href="${env.BASE_URL}/data/cities.json"><link rel="alternate" type="text/plain" title="llms.txt" href="${env.BASE_URL}/llms.txt">` }));
    if (path === '/hard-water-by-city/' && req.method === 'GET') return html(200, page('Hard Water by City: Published Hardness and Sources | My Home Water System',
      'Water hardness for U.S. cities exactly as each utility publishes it, with the period, the source document and the USGS class.', hardWaterByCityBody(ctx.markets),
      false, { jsonLd: hubJsonLd(env.BASE_URL, ctx.markets).slice(1) }));

    if (path === '/check' && req.method === 'GET') {
      const zip = (url.searchParams.get('zip') ?? '').trim();
      // The new designs take a city name too, and answer a place with no page here with how to check it.
      if (design !== 'classic' && !/^\d{5}$/.test(zip)) {
        const q = zip.replace(/,.*$/, '').replace(/\s+/g, ' ').trim().toLowerCase();
        const c = q ? listedCities(ctx.markets).find((l) => l.name.toLowerCase() === q) : undefined;
        if (c) { const s2 = siteForSlug(c.slug); return Response.redirect(s2 ? `${siteUrl(s2)}/` : `${env.BASE_URL}/locations/${c.slug}/`, 303); }
        if (!zip) return Response.redirect(`${env.BASE_URL}/#request`, 303);
        return html(200, page('Check your water | My Home Water System', 'How to check your drinking water in any U.S. city or on a private well.', checkNotOnFileV2(zip.slice(0, 60), false, crypto.randomUUID()), true));
      }
      const m = /^\d{5}$/.test(zip) ? findMarket(ctx.markets, zip, !staging) : null;
      if (m) {
        const c = cityForZip(zip, m);
        const s2 = c && siteForSlug(c.slug);
        if (s2) return Response.redirect(`${siteUrl(s2)}/?zip=${zip}#request`, 303);
        return Response.redirect(`${env.BASE_URL}/locations/${c?.slug ?? m.slug}/?zip=${zip}#request`, 303);
      }
      if (design !== 'classic' && /^\d{5}$/.test(zip)) {
        // A city page whose market is not open still takes the request, held with no dealer.
        const closed = ctx.markets.find((x) => x.zips.includes(zip));
        const c = closed && cityForZip(zip, closed);
        if (c) { const s2 = siteForSlug(c.slug); return Response.redirect(s2 ? `${siteUrl(s2)}/?zip=${zip}#request` : `${env.BASE_URL}/locations/${c.slug}/?zip=${zip}#request`, 303); }
        return html(200, page('Check your water | My Home Water System', 'How to check your drinking water in any U.S. city or on a private well.', checkNotOnFileV2(zip, true, crypto.randomUUID()), true));
      }
      return html(200, page('Not in our service area | My Home Water System', 'Service availability', /^\d{5}$/.test(zip) ? outOfAreaBody(zip) : '<h1>Enter a 5-digit ZIP code</h1><p><a href="/">Back</a></p>', true));
    }

    const loc = path.match(/^\/locations\/([a-z0-9-]+)\/$/);
    if (loc && req.method === 'GET') {
      const zip = url.searchParams.get('zip') ?? undefined;
      // A city with its own site lives there. The hub page for it forwards.
      const own = siteForSlug(loc[1]!);
      if (own) return Response.redirect(`${siteUrl(own)}/${url.search}`, 301);
      const city = locationBySlug(loc[1]!);
      const cityMarket = city && ctx.markets.find((x) => x.id === city.market_id);
      // A hub city page stays noindex and out of the sitemap until its market has a launch approval.
      if (city && cityMarket) return html(200, page(`Water softeners and filtration in ${city.name} | My Home Water System`,
        `${city.name} water hardness as published by the local utility, and how to get a written water treatment quote.`,
        hubCity(design, city, cityMarket, crypto.randomUUID(), env.BASE_URL, { vals: { zip, ...prefill(url) } }), !cityMarket.launch_approval_id,
        { jsonLd: hubCityJsonLd(city, cityMarket, `${env.BASE_URL}/locations/${city.slug}/`) }));
      const m = ctx.markets.find((x) => x.slug === loc[1]);
      if (!m) return html(404, page('Not found', 'Not found', '<h1>Page not found</h1>', true));
      return html(200, page(`Water treatment in ${m.name} | My Home Water System`, `Water treatment options and quotes in ${m.name}.`,
        locationsInMarket(m.id).length ? clusterBody(m, crypto.randomUUID(), { vals: { zip } }) : marketBody(m, crypto.randomUUID(), { vals: { zip } })));
    }

    if (path === '/service-areas/') return html(200, page('Service areas | My Home Water System', 'Where we take requests.', serviceAreasBody(ctx.markets)));
    const st = STATIC_PAGES.find((p) => p.path === path);
    if (st) return html(200, page(st.title, st.description, st.html, st.noindex));
    if (path === '/about/' || path === '/contact/') return html(200, page(path === '/about/' ? 'About' : 'Contact', 'Company information', companyBody(path === '/about/' ? 'about' : 'contact'), !!state && isSyndicated(path)));
    if (['/privacy/', '/terms/', '/communication-preferences/'].includes(path)) {
      const k = path.slice(1, -1) as 'privacy' | 'terms' | 'communication-preferences';
      return html(200, page(k, k, legalBody(k), true));
    }

    if (path === '/api/inquiry' && req.method === 'POST') {
      // Per-address limit on form posts, on top of the honeypot. Approximate per Cloudflare location (Cloudflare docs).
      if (env.FORM_LIMITER) {
        const { success } = await env.FORM_LIMITER.limit({ key: `inquiry:${req.headers.get('cf-connecting-ip') ?? 'unknown'}` });
        if (!success) return html(429, page('Please try again', 'Error', unavailableBody(siteMarket?.tracking_phone), true), { 'retry-after': '60' });
      }
      const form = await readForm(req);
      if (!form) return html(413, page('Too large', 'Error', '<h1>Request too large</h1>', true));
      if (!staging && !env.HASH_PEPPER) return html(503, page('Unavailable', 'Error', unavailableBody(siteMarket?.tracking_phone), true));
      // A database error (for example D1's daily limit) shows the try-again page, never a raw Worker error.
      const r: Awaited<ReturnType<typeof handleIntake>> = await handleIntake(form, { db: ctx.db, markets: ctx.markets, policy: ctx.policy,
        hashPepper: env.HASH_PEPPER ?? 'staging-pepper', requireLaunchable: !staging, anyZip: true })
        .catch((err) => { console.error('intake failed', err instanceof Error ? err.message : String(err)); return { status: 'unavailable' as const, reason: 'storage_error' }; });
      const wantsJson = (req.headers.get('accept') ?? '').includes('application/json');
      if (wantsJson) return new Response(JSON.stringify(r.status === 'invalid' ? { status: r.status, errors: r.errors } : r), {
        status: r.status === 'accepted' ? 200 : r.status === 'invalid' ? 422 : r.status === 'unavailable' ? 503 : 200,
        headers: { 'content-type': 'application/json' } });
      // Route the lead now instead of waiting for the next cron tick.
      if (r.status === 'accepted') exec?.waitUntil(drain(ctx));
      switch (r.status) {
        case 'accepted':
          return html(200, page('Request received', 'Request received', r.noDealerArea ? noDealerAreaThankYou(form.zip ?? '', r.duplicate, env.BASE_URL)
            : thankYouBody(r.recipient, r.mode, r.duplicate, !!r.noDealer), true));
        case 'discarded': return html(200, page('Request received', 'Request received', '<h1>Thanks.</h1>', true));
        case 'out_of_area': return html(200, page('Not in our service area', 'Service availability', outOfAreaBody(r.zip), true));
        case 'unavailable': return html(503, page('Please try again', 'Error', unavailableBody(siteMarket?.tracking_phone), true));
        case 'invalid': {
          const rid0 = form.request_id ?? crypto.randomUUID();
          // The no-dealer form: back to the page it was on, a city page whose market is not open or the check page.
          if (form.market === NO_DEALER_ID && !r.market) {
            const back = { vals: form, errors: r.errors };
            if (site && siteCity && siteMarket && !isOpen(siteMarket)) return html(422, page('Check your details', 'Error', cityHome(design, site, siteCity, siteMarket, rid0, env.BASE_URL, back), true));
            const hc = locationBySlug((form.page ?? '').replace(/^\/locations\/|\/$/g, ''));
            const hm = hc && ctx.markets.find((x) => x.id === hc.market_id);
            if (hc && hm && !isOpen(hm) && !site) return html(422, page('Check your details', 'Error', hubCity(design, hc, hm, rid0, env.BASE_URL, back), true));
            return html(422, page('Check your details', 'Error', checkNotOnFileV2(form.zip ?? '', /^\d{5}$/.test(form.zip ?? ''), rid0, back), true));
          }
          const m = r.market ?? ctx.markets.find((x) => x.id === form.market) ?? ctx.markets.find((x) => x.zips.includes(form.zip ?? ''));
          if (!m) return html(422, page('Check your details', 'Error', '<h1>Please check your ZIP code</h1><p><a href="/">Start again</a></p>', true));
          const rid = form.request_id ?? crypto.randomUUID();
          if (site && siteCity && siteMarket && siteMarket.id === m.id) {
            return html(422, page('Check your details', 'Error', cityHome(design, site, siteCity, m, rid, env.BASE_URL, { vals: form, errors: r.errors }), true));
          }
          const city = locationBySlug((form.page ?? '').replace(/^\/locations\/|\/$/g, ''));
          const body = city && city.market_id === m.id ? hubCity(design, city, m, rid, env.BASE_URL, { vals: form, errors: r.errors })
            : locationsInMarket(m.id).length ? clusterBody(m, rid, { vals: form, errors: r.errors }) : marketBody(m, rid, { vals: form, errors: r.errors });
          return html(422, page('Check your details', 'Error', body, true));
        }
      }
    }

    const p = path.match(/^\/p\/([A-Za-z0-9._-]+)$/);
    if (p) {
      const form = req.method === 'POST' ? await readForm(req) ?? {} : {};
      const r = await providerPage(ctx, p[1]!, req.method, form);
      if (req.method === 'POST') exec?.waitUntil(drain(ctx));
      return html(r.status, page(r.title, r.title, r.body, true), { 'referrer-policy': 'no-referrer' });
    }

    if (path.startsWith('/internal/')) {
      const auth = req.headers.get('authorization') ?? '';
      if (!env.ADMIN_TOKEN || !timingSafeEqual(auth, `Bearer ${env.ADMIN_TOKEN}`)) return new Response('unauthorized', { status: 401 });
      return internalApi(ctx, req, path, 'coordinator');
    }

    if (path === '/hooks/crm' && req.method === 'POST') {
      const res = await crmHook(ctx, req, env.CRM_WEBHOOK_SECRET);
      exec?.waitUntil(drain(ctx));
      return res;
    }

    return html(404, page('Not found', 'Not found', '<h1>Page not found</h1><p><a href="/">Home</a></p>', true));
  },

  // Cron, every 5 minutes in production, none on staging. An idle site touches the database once per tick
  // with one index lookup that finds nothing, and once a day checks dealer credentials from the deployed
  // config. Everything else runs only while a lead is in flight. Daily row math: docs/d1-budget.md.
  async scheduled(event: ScheduledEvent, env: Env): Promise<void> {
    const ctx = buildContext(env);
    const now = new Date(event.scheduledTime);
    if (!(await hasLiveWork(ctx.db))) {
      if (now.getUTCHours() === 14 && now.getUTCMinutes() < 5) {
        const stmts = credentialStmts(ctx, now);
        if (stmts.length) await ctx.db.batch(stmts);
      }
      return;
    }
    await syncConfig(ctx.db, ctx.markets);
    await runChecks(ctx);
    await drain(ctx);
  },
};

function drain(ctx: ReturnType<typeof buildContext>): Promise<number> {
  return runJobs(ctx.db, handlers(ctx), { max: 50 });
}
