import { buildContext, type Env } from './env.ts';
import { layout } from './site/layout.ts';
import { companyBody, homeBody, legalBody, marketBody, outOfAreaBody, serviceAreasBody, STATIC_PAGES, thankYouBody, unavailableBody } from './site/pages.ts';
import { cityBody, clusterBody, sitemapXml, urlset } from './site/locations.ts';
import { cityAboutBody, cityContactBody, cityDescription, cityHomeBody, cityJsonLd, cityTitle } from './site/city.ts';
import { locationBySlug, locationsInMarket, type CityLocation } from '../content/locations.ts';
import { CITY_ZIPS } from '../content/zips.ts';
import { CITY_SITES, HUB_DOMAIN, normalizeHost, siteForHost, siteForSlug, siteUrl, type CitySite } from '../content/sites.ts';
import type { MarketConfig } from './domain/config.ts';
import { handleIntake, findMarket } from './intake/intake.ts';
import { providerPage } from './dealer/page.ts';
import { internalApi } from './internal/api.ts';
import { crmHook } from './hooks/crm.ts';
import { syncConfig } from './domain/repo.ts';
import { runChecks } from './worker/checks.ts';
import { runJobs } from './worker/jobs.ts';
import { handlers } from './worker/handlers.ts';
import { timingSafeEqual } from './util.ts';

const MAX_BODY = 16 * 1024;
const SECURITY_HEADERS: Record<string, string> = {
  'content-security-policy': "default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'",
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
};

function html(status: number, page: string, extra: Record<string, string> = {}): Response {
  return new Response(page, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', ...SECURITY_HEADERS, ...extra } });
}

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

type PageFn = (title: string, description: string, body: string, noindex?: boolean, more?: { canonical?: string; jsonLd?: object[] }) => string;

// Routes that differ on a city site. Returns null for routes every host shares (intake, legal pages,
// dealer links, internal API, hooks), which the main handler serves with the city's branding.
async function citySite(req: Request, url: URL, env: Env, site: CitySite, city: CityLocation, m: MarketConfig, page: PageFn, staging: boolean): Promise<Response | null> {
  const path = url.pathname;
  const base = siteUrl(site);
  if (req.method !== 'GET' && req.method !== 'HEAD') return null;
  if (path === '/robots.txt') return new Response(staging ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nDisallow: /p/\nDisallow: /internal/\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);
  if (path === '/sitemap.xml') return new Response(urlset([`${base}/`, `${base}/about/`, `${base}/contact/`]), { headers: { 'content-type': 'application/xml; charset=utf-8' } });
  if (path === '/') {
    const zip = url.searchParams.get('zip') ?? undefined;
    return html(200, page(cityTitle(site, city), cityDescription(city), cityHomeBody(site, city, m, crypto.randomUUID(), env.BASE_URL, { vals: { zip } }),
      false, { canonical: `${base}/`, jsonLd: cityJsonLd(site, city, m) }));
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
  if (path === '/about/') return html(200, page(`About | ${site.brand}`, `About ${site.brand}`, cityAboutBody(site, city)));
  if (path === '/contact/') return html(200, page(`Contact | ${site.brand}`, `How to reach ${site.brand}`, cityContactBody(site, m)));
  // Hub-only sections forward to the hub.
  if (path === '/service-areas/' || path === '/for-dealers/' || path.startsWith('/locations/')) return Response.redirect(`${env.BASE_URL}${path}${url.search}`, 301);
  // Shared guides: served on the city site for visitors, canonical on the hub so the copies do not compete.
  const st = STATIC_PAGES.find((p) => p.path === path);
  if (st) return html(200, page(st.title, st.description, st.html, st.noindex, { canonical: `${env.BASE_URL}${st.path}` }));
  return null;
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const ctx = buildContext(env);
    const url = new URL(req.url);
    const path = url.pathname;
    const staging = env.ENVIRONMENT !== 'production';
    const banner = staging ? 'Staging preview with synthetic data. Not open for real requests. Legal pages and disclosures are drafts pending review.' : null;

    // Staging has one address, so a city site is previewed by cookie: /__site/<domain> picks one, /__site/hub goes back.
    const pick = staging ? path.match(/^\/__site\/([a-z0-9.-]+)$/) : null;
    if (pick) {
      const d = pick[1]!;
      if (d !== 'hub' && !CITY_SITES.some((s) => s.domain === d)) return new Response('unknown site', { status: 404 });
      return new Response(null, { status: 303, headers: { location: '/',
        'set-cookie': d === 'hub' ? 'mhws_site=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax' : `mhws_site=${d}; Path=/; Max-Age=86400; Secure; HttpOnly; SameSite=Lax` } });
    }
    const host = (staging ? (req.headers.get('cookie') ?? '').match(/(?:^|;\s*)mhws_site=([a-z0-9.-]+)/)?.[1] : undefined) ?? url.host;

    // The hub lives at BASE_URL (www). Its bare domain forwards there.
    if (!staging && normalizeHost(url.host) === HUB_DOMAIN && new URL(env.BASE_URL).host !== HUB_DOMAIN) {
      return Response.redirect(`${env.BASE_URL}${path}${url.search}`, 301);
    }

    // City sites: each city domain is its own site. www goes to the bare domain.
    const site = siteForHost(host);
    if (site && normalizeHost(host) !== site.domain) return Response.redirect(`${siteUrl(site)}${path}${url.search}`, 301);
    const siteCity = site && locationBySlug(site.slug);
    const siteMarket = siteCity && ctx.markets.find((x) => x.id === siteCity.market_id);
    const base = site ? siteUrl(site) : env.BASE_URL;

    const page = (title: string, description: string, body: string, noindex = false, more: { canonical?: string; jsonLd?: object[] } = {}) =>
      layout({ title: site ? title.replace(/ \| My Home Water System$/, ` | ${site.brand}`) : title, description, path, body,
        noindex: noindex || staging, banner, baseUrl: base, brand: site?.brand, phone: siteMarket?.tracking_phone ?? null, ...more });

    if (site && siteCity && siteMarket) {
      const r = await citySite(req, url, env, site, siteCity, siteMarket, page, staging);
      if (r) return r;
    }

    if (path === '/healthz') return new Response(JSON.stringify({ ok: true, env: env.ENVIRONMENT, crm: ctx.crm.name, crm_reason: ctx.crmReason }), { headers: { 'content-type': 'application/json' } });
    if (path === '/robots.txt') return new Response(staging ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nDisallow: /p/\nDisallow: /internal/\nDisallow: /api/\nSitemap: ${base}/sitemap.xml\n`);
    if (path === '/sitemap.xml') return new Response(sitemapXml(env.BASE_URL, ctx.markets, STATIC_PAGES.filter((p) => !p.noindex).map((p) => p.path)),
      { headers: { 'content-type': 'application/xml; charset=utf-8' } });

    if (path === '/' && req.method === 'GET') return html(200, page('Home water treatment options | My Home Water System', 'Compare water softening, filtration and drinking-water systems and request a quote from the local company that serves your area.', homeBody(ctx.markets)));

    if (path === '/check' && req.method === 'GET') {
      const zip = (url.searchParams.get('zip') ?? '').trim();
      const m = /^\d{5}$/.test(zip) ? findMarket(ctx.markets, zip, !staging) : null;
      if (m) {
        const c = cityForZip(zip, m);
        const s2 = c && siteForSlug(c.slug);
        if (s2) return Response.redirect(`${siteUrl(s2)}/?zip=${zip}#request`, 303);
        return Response.redirect(`${env.BASE_URL}/locations/${c?.slug ?? m.slug}/?zip=${zip}#request`, 303);
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
      if (city && cityMarket) return html(200, page(`Water softeners and filtration in ${city.name} | My Home Water System`,
        `${city.name} water hardness as published by the local utility, and how to get a written water treatment quote.`,
        cityBody(city, cityMarket, crypto.randomUUID(), { vals: { zip } })));
      const m = ctx.markets.find((x) => x.slug === loc[1]);
      if (!m) return html(404, page('Not found', 'Not found', '<h1>Page not found</h1>', true));
      return html(200, page(`Water treatment in ${m.name} | My Home Water System`, `Water treatment options and quotes in ${m.name}.`,
        locationsInMarket(m.id).length ? clusterBody(m, crypto.randomUUID(), { vals: { zip } }) : marketBody(m, crypto.randomUUID(), { vals: { zip } })));
    }

    if (path === '/service-areas/') return html(200, page('Service areas | My Home Water System', 'Where we take requests.', serviceAreasBody(ctx.markets)));
    const st = STATIC_PAGES.find((p) => p.path === path);
    if (st) return html(200, page(st.title, st.description, st.html, st.noindex));
    if (path === '/about/' || path === '/contact/') return html(200, page(path === '/about/' ? 'About' : 'Contact', 'Company information', companyBody(path === '/about/' ? 'about' : 'contact')));
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
      const r = await handleIntake(form, { db: ctx.db, markets: ctx.markets, policy: ctx.policy,
        hashPepper: env.HASH_PEPPER ?? 'staging-pepper', requireLaunchable: !staging });
      const wantsJson = (req.headers.get('accept') ?? '').includes('application/json');
      if (wantsJson) return new Response(JSON.stringify(r.status === 'invalid' ? { status: r.status, errors: r.errors } : r), {
        status: r.status === 'accepted' ? 200 : r.status === 'invalid' ? 422 : r.status === 'unavailable' ? 503 : 200,
        headers: { 'content-type': 'application/json' } });
      switch (r.status) {
        case 'accepted':
          return html(200, page('Request received', 'Request received', thankYouBody(r.recipient, r.mode, r.duplicate), true));
        case 'discarded': return html(200, page('Request received', 'Request received', '<h1>Thanks.</h1>', true));
        case 'out_of_area': return html(200, page('Not in our service area', 'Service availability', outOfAreaBody(r.zip), true));
        case 'unavailable': return html(503, page('Please try again', 'Error', unavailableBody(siteMarket?.tracking_phone), true));
        case 'invalid': {
          const m = r.market ?? ctx.markets.find((x) => x.id === form.market) ?? ctx.markets.find((x) => x.zips.includes(form.zip ?? ''));
          if (!m) return html(422, page('Check your details', 'Error', '<h1>Please check your ZIP code</h1><p><a href="/">Start again</a></p>', true));
          const rid = form.request_id ?? crypto.randomUUID();
          if (site && siteCity && siteMarket && siteMarket.id === m.id) {
            return html(422, page('Check your details', 'Error', cityHomeBody(site, siteCity, m, rid, env.BASE_URL, { vals: form, errors: r.errors }), true));
          }
          const city = locationBySlug((form.page ?? '').replace(/^\/locations\/|\/$/g, ''));
          const body = city && city.market_id === m.id ? cityBody(city, m, rid, { vals: form, errors: r.errors })
            : locationsInMarket(m.id).length ? clusterBody(m, rid, { vals: form, errors: r.errors }) : marketBody(m, rid, { vals: form, errors: r.errors });
          return html(422, page('Check your details', 'Error', body, true));
        }
      }
    }

    const p = path.match(/^\/p\/([A-Za-z0-9._-]+)$/);
    if (p) {
      const form = req.method === 'POST' ? await readForm(req) ?? {} : {};
      const r = await providerPage(ctx, p[1]!, req.method, form);
      return html(r.status, page(r.title, r.title, r.body, true), { 'referrer-policy': 'no-referrer' });
    }

    if (path.startsWith('/internal/')) {
      const auth = req.headers.get('authorization') ?? '';
      if (!env.ADMIN_TOKEN || !timingSafeEqual(auth, `Bearer ${env.ADMIN_TOKEN}`)) return new Response('unauthorized', { status: 401 });
      return internalApi(ctx, req, path, 'coordinator');
    }

    if (path === '/hooks/crm' && req.method === 'POST') return crmHook(ctx, req, env.CRM_WEBHOOK_SECRET);

    return html(404, page('Not found', 'Not found', '<h1>Page not found</h1><p><a href="/">Home</a></p>', true));
  },

  // Cron: mirror config, run checks, then drain due jobs. The cron wakes the worker; the jobs table holds state.
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const ctx = buildContext(env);
    await syncConfig(ctx.db, ctx.markets);
    await runChecks(ctx);
    await runJobs(ctx.db, handlers(ctx), { max: 50 });
  },
};
