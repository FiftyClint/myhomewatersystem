import { apexOf, normalizeHost } from '../../content/sites.ts';
import { TURNSTILE_SLOT } from './pages.ts';
import { escapeHtml as e } from '../util.ts';

// Cloudflare Turnstile on the request form (Clint, 2026-11-22: "Do it").
// Docs: developers.cloudflare.com/turnstile/get-started/server-side-validation/ and
// /turnstile/reference/content-security-policy/. On the free plan a widget lists at most 10 hostnames and
// an account holds at most 20 widgets (/turnstile/plans/), and a listed hostname covers its subdomains
// (/turnstile/additional-configuration/hostname-management/). So the domains are split across several
// widgets, kept in one Worker secret, TURNSTILE_WIDGETS: [{ sitekey, secret, domains }]. With no secret
// set, nothing changes: no widget, no check.

export interface TurnstileWidget { sitekey: string; secret: string; domains: string[] }
export type TurnstileResult = 'pass' | 'fail' | 'unreachable';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
export const TURNSTILE_ACTION = 'inquiry';
export const TOKEN_FIELD = 'cf-turnstile-response';

export function parseWidgets(raw: string | undefined): TurnstileWidget[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((w) => typeof w?.sitekey === 'string' && typeof w?.secret === 'string' && Array.isArray(w?.domains)) : [];
  } catch { console.error('TURNSTILE_WIDGETS is not valid JSON; Turnstile is off'); return []; }
}

export function widgetForHost(widgets: TurnstileWidget[], host: string): TurnstileWidget | undefined {
  const apex = apexOf(host);
  return widgets.find((w) => w.domains.some((d) => apexOf(d) === apex));
}

// Fills the form's slot with the widget, or removes the slot, and opens the CSP to Turnstile only when
// the page carries the widget.
export async function applyTurnstile(res: Response, w: TurnstileWidget | undefined): Promise<Response> {
  if (!(res.headers.get('content-type') ?? '').startsWith('text/html')) return res;
  const body = await res.text();
  if (!body.includes(TURNSTILE_SLOT)) return new Response(body, res);
  const headers = new Headers(res.headers);
  if (!w) return new Response(body.split(TURNSTILE_SLOT).join(''), { status: res.status, headers });
  const tag = `<div class="cf-turnstile" data-sitekey="${e(w.sitekey)}" data-action="${TURNSTILE_ACTION}"></div><script src="${SCRIPT}" async defer></script>`;
  const csp = (headers.get('content-security-policy') ?? '')
    .replace(/script-src ([^;]*)/, `script-src $1 https://challenges.cloudflare.com`)
    .replace(/default-src 'none';/, "default-src 'none'; frame-src https://challenges.cloudflare.com;");
  headers.set('content-security-policy', csp);
  return new Response(body.split(TURNSTILE_SLOT).join(tag), { status: res.status, headers });
}

// pass: Cloudflare confirmed the token for this host and form. fail: no token, a bad or reused token, or
// a token from another host or form; the person is asked to complete the check and send again.
// unreachable: Cloudflare could not be asked; the request is kept and flagged rather than lost.
export async function verifyTurnstile(w: TurnstileWidget, token: string | undefined, ip: string | null, host: string,
  fetchImpl: typeof fetch = (i, init) => fetch(i, init)): Promise<TurnstileResult> {
  if (!token || token.length > 2048) return 'fail';
  let j: { success?: boolean; hostname?: string; action?: string; 'error-codes'?: string[] };
  try {
    const r = await fetchImpl(SITEVERIFY, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: w.secret, response: token, ...(ip ? { remoteip: ip } : {}) }), signal: AbortSignal.timeout(10000) });
    if (!r.ok) return 'unreachable';
    j = await r.json();
  } catch { return 'unreachable'; }
  if (!j.success) return (j['error-codes'] ?? []).includes('internal-error') ? 'unreachable' : 'fail';
  if (j.hostname && normalizeHost(j.hostname) !== normalizeHost(host)) return 'fail';
  if (j.action && j.action !== TURNSTILE_ACTION) return 'fail';
  return 'pass';
}
