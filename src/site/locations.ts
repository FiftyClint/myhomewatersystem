import type { MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import { LOCATIONS, locationsInMarket, type CityLocation } from '../../content/locations.ts';
import { inquiryForm } from './pages.ts';
import { CITY_ZIPS } from '../../content/zips.ts';
import { cityHref, siteForSlug } from '../../content/sites.ts';

const USGS_HARDNESS = 'https://www.usgs.gov/water-science-school/science/hardness-water';

const isOpen = (m: MarketConfig) => m.status === 'active' && !!m.business_mode;

function relationship(m: MarketConfig): string {
  const who = m.seller_display_name;
  return m.business_mode === 'direct'
    ? 'My Home Water System is the seller. Installation is performed by a licensed local installation partner. Your quote names who will do the work.'
    : `My Home Water System connects homeowners with ${e(who ?? '[dealer to be named]')}. ${e(who ?? 'The dealer')} provides your estimate, contract, installation and ongoing service.`;
}

function requestPanel(m: MarketConfig, requestId: string, page: string, form?: { vals?: Record<string, string | undefined>; errors?: Record<string, string> }): string {
  return isOpen(m) ? inquiryForm({ requestId, market: m, page, ...form })
    : '<div class="card"><h2>Not open yet</h2><p>We are not accepting requests in this area yet.</p></div>';
}

function factsTable(l: CityLocation): string {
  if (!l.facts.length) return '<p>We have not yet found a published hardness figure for this area. Ask your utility for its latest water quality report.</p>';
  const multi = new Set(l.facts.map((f) => f.utility)).size > 1;
  const rows = l.facts.map((f) => `<tr>${multi ? `<td>${e(f.utility)}</td>` : ''}<td>${e(f.label)}</td><td>${e(f.value)}</td><td>${e(f.period)}</td><td><a href="${e(f.source_url)}" rel="noopener">${e(f.source_title)}</a></td></tr>`).join('');
  return `<table><thead><tr>${multi ? '<th>Utility</th>' : ''}<th>Measure</th><th>As published</th><th>Period</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function nearby(l: CityLocation, m: MarketConfig): string {
  const others = locationsInMarket(m.id).filter((x) => x.slug !== l.slug);
  if (!others.length) return '';
  return `<h2>Nearby</h2><p>${others.map((x) => `<a href="/locations/${e(x.slug)}/">${e(x.name)}</a>`).join(', ')}${m.slug !== l.slug ? `. See the whole <a href="/locations/${e(m.slug)}/">${e(m.name)}</a> area.` : '.'}</p>`;
}

export function cityBody(l: CityLocation, m: MarketConfig, requestId: string, form?: { vals?: Record<string, string | undefined>; errors?: Record<string, string> }): string {
  const utilityNames = [...new Set(l.facts.map((f) => f.utility))];
  const utilityLine = utilityNames.length === 1 ? ` The figures below are from ${e(utilityNames[0]!)}.` : '';
  return `<div class="grid two"><div>
<p class="small"><a href="/service-areas/">Service areas</a> / ${m.slug !== l.slug ? `<a href="/locations/${e(m.slug)}/">${e(m.name)}</a> / ` : ''}${e(l.name)}</p>
<h1>Water treatment options for your ${e(l.name)} home</h1>
<div class="disclosure"><strong>Who you are working with.</strong> ${relationship(m)}</div>
<h2>Your local water</h2>
<p>${e(l.intro)}${utilityLine}</p>
${factsTable(l)}
${l.notes.length ? `<ul>${l.notes.map((n) => `<li>${e(n)}</li>`).join('')}</ul>` : ''}
<p class="small">Utility reports describe the water system as a whole. Water at a single address can differ, especially in older plumbing, so the installing company should test your water before recommending equipment.</p>
<h2>What the hardness numbers mean</h2>
<p>Hardness is dissolved calcium and magnesium. It is what leaves scale on fixtures, glass and the inside of water heaters. The U.S. Geological Survey classifies water above 180 mg/L as calcium carbonate as very hard (<a href="${USGS_HARDNESS}" rel="noopener">USGS</a>). One grain per gallon equals about 17.1 mg/L.</p>
<p>Compare options: <a href="/water-softeners/">water softeners</a>, <a href="/whole-home-filtration/">whole-home filtration</a> and <a href="/reverse-osmosis/">reverse osmosis</a>.</p>
<h2>How it works</h2><ol class="steps"><li>Send a request.</li><li>Assessment at your home.</li><li>Written quote with what is included and what is extra.</li><li>Installation and service.</li></ol>
<p>Booking an assessment is not a purchase.</p>
${zipList(l)}
${nearby(l, m)}
</div><div>${requestPanel(m, requestId, `/locations/${l.slug}/`, form)}</div></div>`;
}

function zipList(l: CityLocation): string {
  const zips = CITY_ZIPS[l.slug] ?? [];
  return zips.length ? `<h2>ZIP codes this page covers</h2><p class="small">${zips.map(e).join(', ')}</p>` : '';
}

// Cluster page: one dealer territory, linking to each city in it.
export function clusterBody(m: MarketConfig, requestId: string, form?: { vals?: Record<string, string | undefined>; errors?: Record<string, string> }): string {
  const cities = locationsInMarket(m.id);
  const list = cities.map((c) => {
    const f = c.facts.find((x) => /hardness/i.test(x.label));
    return `<li><a href="${e(cityHref(c.slug))}">${e(c.name)}</a>${f ? `: ${e(f.label.toLowerCase())} ${e(f.value)} (${e(f.utility)}, ${e(f.period)})` : ''}</li>`;
  }).join('');
  return `<div class="grid two"><div>
<p class="small"><a href="/service-areas/">Service areas</a> / ${e(m.name)}</p>
<h1>Water treatment options in the ${e(m.name)}</h1>
<div class="disclosure"><strong>Who you are working with.</strong> ${relationship(m)}</div>
<h2>Cities</h2>${cities.length ? `<ul>${list}</ul>` : '<p>No city pages yet.</p>'}
<p class="small">Each city's site shows its own utility's published figures and links to the report.</p>
<h2>How it works</h2><ol class="steps"><li>Send a request.</li><li>Assessment at your home.</li><li>Written quote with what is included and what is extra.</li><li>Installation and service.</li></ol>
</div><div>${requestPanel(m, requestId, `/locations/${m.slug}/`, form)}</div></div>`;
}

export function areaDirectory(markets: MarketConfig[]): string {
  return markets.map((m) => {
    const cities = locationsInMarket(m.id);
    const head = cities.length === 1 && cities[0]!.slug === m.slug ? '' : `<a href="/locations/${e(m.slug)}/">${e(m.name)}</a>: `;
    const links = cities.map((c) => `<a href="${e(cityHref(c.slug))}">${e(c.name)}</a>`).join(', ');
    return `<tr><td>${head}${links || `<a href="/locations/${e(m.slug)}/">${e(m.name)}</a>`}</td><td>${isOpen(m) ? 'Taking requests' : 'Not open yet'}</td></tr>`;
  }).join('');
}

// Hub sitemap. Cities with their own site are listed in that site's sitemap instead.
export function sitemapXml(baseUrl: string, markets: MarketConfig[], staticPaths: string[]): string {
  const paths = ['/', '/service-areas/', ...staticPaths,
    ...markets.filter((m) => !LOCATIONS.some((l) => l.slug === m.slug)).map((m) => `/locations/${m.slug}/`),
    ...LOCATIONS.filter((l) => markets.some((m) => m.id === l.market_id) && !siteForSlug(l.slug)).map((l) => `/locations/${l.slug}/`)];
  return urlset([...new Set(paths)].map((p) => baseUrl + p));
}

export const urlset = (urls: string[], lastmod?: string): string =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${e(u)}</loc>${lastmod ? `<lastmod>${e(lastmod)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
