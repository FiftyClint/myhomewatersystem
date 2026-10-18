import { buildContext, type Env } from './env.ts';
import { layout } from './site/layout.ts';
import { companyBody, homeBody, legalBody, marketBody, outOfAreaBody, serviceAreasBody, STATIC_PAGES, thankYouBody, unavailableBody } from './site/pages.ts';
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

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const ctx = buildContext(env);
    const url = new URL(req.url);
    const path = url.pathname;
    const staging = env.ENVIRONMENT !== 'production';
    const banner = staging ? 'Staging preview with synthetic data. Not open for real requests. Legal pages and disclosures are drafts pending review.' : null;
    const page = (title: string, description: string, body: string, noindex = false) =>
      layout({ title, description, path, body, noindex: noindex || staging, banner, baseUrl: env.BASE_URL });

    if (path === '/healthz') return new Response(JSON.stringify({ ok: true, env: env.ENVIRONMENT, crm: ctx.crm.name, crm_reason: ctx.crmReason }), { headers: { 'content-type': 'application/json' } });
    if (path === '/robots.txt') return new Response(staging ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nDisallow: /p/\nDisallow: /internal/\nDisallow: /api/\n');

    if (path === '/' && req.method === 'GET') return html(200, page('Home water treatment options | My Home Water System', 'Compare water softening, filtration and drinking-water systems and request a quote from the local company that serves your area.', homeBody(ctx.markets)));

    if (path === '/check' && req.method === 'GET') {
      const zip = (url.searchParams.get('zip') ?? '').trim();
      const m = /^\d{5}$/.test(zip) ? findMarket(ctx.markets, zip, !staging) : null;
      if (m) return Response.redirect(`${env.BASE_URL}/locations/${m.slug}/?zip=${zip}#request`, 303);
      return html(200, page('Not in our service area | My Home Water System', 'Service availability', /^\d{5}$/.test(zip) ? outOfAreaBody(zip) : '<h1>Enter a 5-digit ZIP code</h1><p><a href="/">Back</a></p>', true));
    }

    const loc = path.match(/^\/locations\/([a-z0-9-]+)\/$/);
    if (loc && req.method === 'GET') {
      const m = ctx.markets.find((x) => x.slug === loc[1]);
      if (!m) return html(404, page('Not found', 'Not found', '<h1>Page not found</h1>', true));
      const zip = url.searchParams.get('zip') ?? undefined;
      return html(200, page(`Water treatment in ${m.name} | My Home Water System`, `Water treatment options and quotes in ${m.name}.`,
        marketBody(m, crypto.randomUUID(), { vals: { zip } })));
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
      const form = await readForm(req);
      if (!form) return html(413, page('Too large', 'Error', '<h1>Request too large</h1>', true));
      if (!staging && !env.HASH_PEPPER) return html(503, page('Unavailable', 'Error', unavailableBody(), true));
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
        case 'unavailable': return html(503, page('Please try again', 'Error', unavailableBody(), true));
        case 'invalid': {
          const m = r.market ?? ctx.markets.find((x) => x.id === form.market) ?? ctx.markets.find((x) => x.zips.includes(form.zip ?? ''));
          if (!m) return html(422, page('Check your details', 'Error', '<h1>Please check your ZIP code</h1><p><a href="/">Start again</a></p>', true));
          return html(422, page('Check your details', 'Error', marketBody(m, form.request_id ?? crypto.randomUUID(), { vals: form, errors: r.errors }), true));
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
