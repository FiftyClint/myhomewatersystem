import { takesRequests, type MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import { LOCATIONS, locationsInMarket, type CityLocation } from '../../content/locations.ts';
import { inquiryForm } from './pages.ts';
import { CITY_ZIPS } from '../../content/zips.ts';
import { cityHref, HUB_BRAND, siteForSlug } from '../../content/sites.ts';
import { answerCard, cityFaq, factsTable, keyFactsBlock, meaningText, quoteSteps, systemCards } from './city.ts';

const USGS_HARDNESS = 'https://www.usgs.gov/water-science-school/science/hardness-water';

const isOpen = takesRequests;

function relationship(m: MarketConfig): string {
  const who = m.seller_display_name;
  return m.business_mode === 'direct'
    ? 'My Home Water System is the seller. Installation is performed by a licensed local installation partner. Your quote names who will do the work.'
    : `My Home Water System connects homeowners with ${e(who ?? '[dealer to be named]')}. ${e(who ?? 'The dealer')} provides your estimate, contract, installation and ongoing service.`;
}

function requestPanel(m: MarketConfig, requestId: string, page: string, form?: { vals?: Record<string, string | undefined>; errors?: Record<string, string> }): string {
  return isOpen(m) ? inquiryForm({ requestId, market: m, page, ...form })
    : `<div class="card"><h2>Not open yet</h2><p>Requests in the ${e(m.name)} are not open yet.</p></div>`;
}


function nearby(l: CityLocation, m: MarketConfig): string {
  const others = locationsInMarket(m.id).filter((x) => x.slug !== l.slug);
  if (!others.length) return '';
  return `<h2>Nearby</h2><p>${others.map((x) => `<a href="/locations/${e(x.slug)}/">${e(x.name)}</a>`).join(', ')}${m.slug !== l.slug ? `. See the whole <a href="/locations/${e(m.slug)}/">${e(m.name)}</a> area.` : '.'}</p>`;
}

export function cityBody(l: CityLocation, m: MarketConfig, requestId: string, form?: { vals?: Record<string, string | undefined>; errors?: Record<string, string> }): string {
  const utilityNames = [...new Set(l.facts.map((f) => f.utility))];
  const who = utilityNames.length === 1 ? utilityNames[0]! : `${l.name}'s utilities`;
  const faq = cityFaq(l, m, HUB_BRAND);
  return `<div class="grid two"><div>
<p class="small"><a href="/service-areas/">Service areas</a> / ${m.slug !== l.slug ? `<a href="/locations/${e(m.slug)}/">${e(m.name)}</a> / ` : ''}${e(l.name)}</p>
<h1>Water softeners and filtration in ${e(l.name)}, ${e(l.state)}</h1>
${answerCard(l)}
${keyFactsBlock(l)}
<div class="disclosure" data-boilerplate><strong>Who you are working with.</strong> ${relationship(m)}</div>
<h2 id="water">What does ${e(who)} publish about ${e(l.name)} water?</h2>
<p>${e(l.intro)}</p>
${factsTable(l)}
${l.notes.length ? `<ul>${l.notes.map((n) => `<li>${e(n)}</li>`).join('')}</ul>` : ''}
<h2 id="meaning">What does ${e(l.scale_mgl ? `${l.scale_mgl[0] === l.scale_mgl[1] ? l.scale_mgl[0] : `${l.scale_mgl[0]} to ${l.scale_mgl[1]}`} mg/L` : 'the published figure')} mean for a ${e(l.name)} home?</h2>
<p>${e(meaningText(l))} (<a href="${USGS_HARDNESS}" rel="noopener">USGS hardness classes</a>)</p>
<h2 id="systems">Which systems fit ${e(l.name)} water?</h2>
${systemCards(l)}
<h2 id="how">How does a ${e(l.name)} quote work?</h2><ol class="steps">${quoteSteps(l).map((x) => `<li>${e(x)}</li>`).join('')}</ol>
<h2 id="faq">Common questions</h2>
<dl class="faq">${faq.map((f) => `<dt>${e(f.q)}</dt><dd>${f.src ? e(f.a).replace(e(` Source: ${f.src.title}.`), ` Source: <a href="${e(f.src.url)}" rel="noopener">${e(f.src.title)}</a>.`) : e(f.a)}</dd>`).join('')}</dl>
${zipList(l)}
${nearby(l, m)}
<p>Compare ${e(l.name)} with other cities on <a href="/hard-water-by-city/">hard water by city</a>.</p>
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
<div class="disclosure" data-boilerplate><strong>Who you are working with.</strong> ${relationship(m)}</div>
<h2>Cities</h2>${cities.length ? `<ul>${list}</ul>` : '<p>No city pages yet.</p>'}
${cities.length ? `<p class="small">${cities.length === 1 ? 'The city page above shows' : `Each of the ${cities.length} city pages above shows`} its own utility's published figures and links to the report.</p>` : ''}
<h2>How does a ${e(m.name)} request work?</h2><ol class="steps"><li>Send a request from a ${e(m.name)} ZIP code.</li><li>Assessment at your home.</li><li>Written quote with what is included and what is extra.</li><li>Installation and service by the company the form names.</li></ol>
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
    ...LOCATIONS.filter((l) => markets.some((m) => m.id === l.market_id && m.launch_approval_id) && !siteForSlug(l.slug)).map((l) => `/locations/${l.slug}/`)];
  return urlset([...new Set(paths)].map((p) => baseUrl + p));
}

export const urlset = (urls: string[], lastmod?: string): string =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `<url><loc>${e(u)}</loc>${lastmod ? `<lastmod>${e(lastmod)}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
