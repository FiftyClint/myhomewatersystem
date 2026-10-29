// Fails when two pages share a run of body copy. A port of the Powered Land Co check
// (poweredlandco scripts/check-duplicate-copy.mjs and README "The guards"), same rules:
//
// - Only the visible text inside <main>. Header, nav and footer are chrome and may be identical.
// - Lowercase words with punctuation removed, so rewording is what counts. No name swapping.
// - Every rolling window of 40 words is hashed. The same window on two different sites fails.
// - The same window on two pages of one site also fails, unless one of the two is noindex.
// - Subtrees marked data-boilerplate (the request form, interface only) and data-citations (source
//   lists) are skipped. Never put data-boilerplate on prose to get it past this check.
// - About, privacy, terms and the guides are identical everywhere on purpose. They are skipped by the
//   passage check only on the condition, asserted here, that every site but the hub serves them
//   noindex (src/site/noindex.ts).
//
// Pages are found by crawling each site from "/" through its own links, in the production
// environment, which is what a search engine is served.

import worker from '../src/index.ts';
import { CITY_SITES, STATE_SITES } from '../content/sites.ts';
import { isSyndicated } from '../src/site/noindex.ts';
import { createHash } from 'node:crypto';

export const WINDOW = 40;
const HUB = 'www.myhomewatersystem.com';
const ENV = { ENVIRONMENT: 'production', BASE_URL: `https://${HUB}`, LINK_SECRET: 't', HASH_PEPPER: 'p', DB: {} } as any;
const NOINDEX = /<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i;

export interface Page { site: string; path: string; html: string; noindex: boolean }

// Remove every element whose opening tag carries one of the attributes, with its whole subtree.
function dropMarked(html: string, attrs: string[]): string {
  const open = new RegExp(`<([a-z][a-z0-9]*)\\b[^>]*\\s(?:${attrs.join('|')})(?=[\\s>=])[^>]*>`, 'i');
  for (let m = open.exec(html); m; m = open.exec(html)) {
    const tag = m[1]!.toLowerCase();
    const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi');
    re.lastIndex = m.index + m[0].length;
    let depth = 1, end = html.length;
    for (let t = re.exec(html); t; t = re.exec(html)) {
      depth += t[1] ? -1 : 1;
      if (depth === 0) { end = t.index + t[0].length; break; }
    }
    html = html.slice(0, m.index) + ' ' + html.slice(end);
  }
  return html;
}

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…' };
const decode = (t: string): string => t
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-z]+);/gi, (w, n) => ENTITIES[n.toLowerCase()] ?? w);

// Visible text of <main>, without scripts, styles, the form and the source lists.
export function mainText(html: string): string {
  const a = html.indexOf('<main'), b = html.lastIndexOf('</main>');
  if (a < 0 || b < 0) return '';
  let s = html.slice(a, b).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ');
  s = dropMarked(s, ['data-boilerplate', 'data-citations']);
  return decode(s.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
}

export const words = (text: string): string[] => text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(Boolean);

// Every page reachable from "/" on each site through same-site links.
export async function crawl(env: typeof ENV = ENV): Promise<Page[]> {
  const sites = [HUB, ...CITY_SITES.map((s) => s.domain), ...STATE_SITES.map((s) => s.domain)];
  const pages: Page[] = [];
  for (const site of sites) {
    const queue = ['/'], seen = new Set(queue);
    while (queue.length) {
      const path = queue.shift()!;
      const r = await worker.fetch(new Request(`https://${site}${path}`), env);
      if (r.status !== 200 || !(r.headers.get('content-type') ?? '').includes('text/html')) continue;
      const html = await r.text();
      pages.push({ site, path, html, noindex: NOINDEX.test(html) });
      for (const m of html.matchAll(/href="([^"#?]*)/g)) {
        let href = m[1]!;
        if (href.startsWith(`https://${site}/`)) href = href.slice(`https://${site}`.length);
        if (!href.startsWith('/') || href.startsWith('//') || !href.endsWith('/')) continue;
        if (!seen.has(href)) { seen.add(href); queue.push(href); }
      }
    }
  }
  return pages;
}

export interface Report { pages: number; sites: number; unguarded: string[]; sameSite: { a: string; b: string; phrase: string }[]; crossSite: { a: string; b: string; phrase: string }[] }

export function check(all: Page[]): Report {
  const unguarded = all.filter((p) => p.site !== HUB && isSyndicated(p.path) && !p.noindex).map((p) => `${p.site}${p.path}`);
  const pages = all.filter((p) => !isSyndicated(p.path));
  const seen = new Map<string, Page>();
  const sameSite: Report['sameSite'] = [], crossSite: Report['crossSite'] = [];
  for (const page of pages) {
    const list = words(mainText(page.html));
    const reported = new Set<string>();
    for (let i = 0; i + WINDOW <= list.length; i++) {
      const phrase = list.slice(i, i + WINDOW).join(' ');
      const hash = createHash('sha1').update(phrase).digest('hex');
      const prev = seen.get(hash);
      if (!prev) { seen.set(hash, page); continue; }
      const pair = `${prev.site}${prev.path}|${page.site}${page.path}`;
      if (reported.has(pair) || prev === page) continue;
      if (prev.site === page.site) {
        if (prev.noindex || page.noindex) continue;
        reported.add(pair); sameSite.push({ a: `${prev.site}${prev.path}`, b: `${page.site}${page.path}`, phrase });
        continue;
      }
      reported.add(pair); crossSite.push({ a: `${prev.site}${prev.path}`, b: `${page.site}${page.path}`, phrase });
    }
  }
  return { pages: pages.length, sites: new Set(pages.map((p) => p.site)).size, unguarded, sameSite, crossSite };
}
