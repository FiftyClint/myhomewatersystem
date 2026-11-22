// Creates or updates the Cloudflare Turnstile widgets for every domain the Worker serves, and writes the
// TURNSTILE_WIDGETS secret value ([{ sitekey, secret, domains }]) to the file named on the command line.
// Run by .github/workflows/turnstile.yml. Needs CLOUDFLARE_API_TOKEN (with Turnstile Sites Write) and
// CLOUDFLARE_ACCOUNT_ID. Prints widget names and domain counts only; secrets are masked in the log.
// API: developers.cloudflare.com/turnstile/get-started/widget-management/api/ (POST, PUT and GET
// /accounts/{account_id}/challenges/widgets). Free plan: 10 hostnames per widget, 20 widgets per account.
import { writeFileSync } from 'node:fs';
import { allApexDomains } from '../content/sites.ts';

const PER_WIDGET = 10, MAX_WIDGETS = 20, PREFIX = 'mhws-forms-';
const token = process.env.CLOUDFLARE_API_TOKEN, account = process.env.CLOUDFLARE_ACCOUNT_ID, out = process.argv[2];
if (!token || !account || !out) { console.error('Needs CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID and an output path.'); process.exit(1); }
const base = `https://api.cloudflare.com/client/v4/accounts/${account}/challenges/widgets`;

interface Widget { sitekey: string; name: string; domains: string[]; secret?: string }
async function cf<T>(path: string, init: RequestInit = {}): Promise<T> {
  const r = await fetch(`${base}${path}`, { ...init, headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' } });
  const j = await r.json() as { success: boolean; result: T; errors?: { code: number; message: string }[] };
  if (!j.success) {
    const msg = (j.errors ?? []).map((e) => `${e.code} ${e.message}`).join('; ');
    if (r.status === 403 || /auth/i.test(msg)) console.error('The Cloudflare API token cannot manage Turnstile. Add the permission "Account > Turnstile > Edit" to the token, then run this again.');
    throw new Error(`Cloudflare API ${init.method ?? 'GET'} ${path || '/'}: ${r.status} ${msg}`);
  }
  return j.result;
}

const domains = [...new Set(allApexDomains())].sort();
const chunks: string[][] = [];
for (let i = 0; i < domains.length; i += PER_WIDGET) chunks.push(domains.slice(i, i + PER_WIDGET));
if (chunks.length > MAX_WIDGETS) { console.error(`${domains.length} domains need ${chunks.length} widgets; the free plan allows ${MAX_WIDGETS}.`); process.exit(1); }

const existing = await cf<Widget[]>('?per_page=50');
const result: { sitekey: string; secret: string; domains: string[] }[] = [];
for (const [i, list] of chunks.entries()) {
  const name = `${PREFIX}${i + 1}`;
  const body = JSON.stringify({ name, domains: list, mode: 'managed' });
  const have = existing.find((w) => w.name === name);
  const w = have ? await cf<Widget>(`/${have.sitekey}`, { method: 'PUT', body }) : await cf<Widget>('', { method: 'POST', body });
  const secret = w.secret ?? (await cf<Widget>(`/${w.sitekey}`)).secret;
  if (!secret) throw new Error(`No secret returned for ${name}`);
  console.log(`::add-mask::${secret}`);
  result.push({ sitekey: w.sitekey, secret, domains: list });
  console.log(`${have ? 'updated' : 'created'} ${name}: ${list.length} domains`);
}
writeFileSync(out, JSON.stringify(result), { mode: 0o600 });
console.log(`${result.length} widgets cover ${domains.length} domains.`);
