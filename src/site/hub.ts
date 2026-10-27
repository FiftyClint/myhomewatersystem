// The hub (myhomewatersystem.com) and the state directory sites. The hub's job is to be the place
// people and AI assistants land when they ask how hard a city's water is: one table of every city's
// published figure with its source, a ZIP check, and links out to each city site.
import type { MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import { LOCATIONS, type CityLocation } from '../../content/locations.ts';
import { cityHref, fullBrand, HUB_BRAND, siteForSlug, siteUrl, type StateSite } from '../../content/sites.ts';
import { classBadge, classLabel, cityData, hardnessFacts, longDate, USGS_HARDNESS } from './water.ts';
import { isOpen } from './city.ts';
import company from '../../config/company.json';

const STATE_NAMES: Record<string, string> = {
  AZ: 'Arizona', CA: 'California', CO: 'Colorado', DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', IL: 'Illinois', IN: 'Indiana',
  MA: 'Massachusetts', MD: 'Maryland', MI: 'Michigan', MN: 'Minnesota', MO: 'Missouri', 'MO/KS': 'Missouri and Kansas', NC: 'North Carolina',
  NV: 'Nevada', NY: 'New York', OH: 'Ohio', OK: 'Oklahoma', PA: 'Pennsylvania', TN: 'Tennessee', TX: 'Texas', WA: 'Washington', WI: 'Wisconsin',
};
const stateName = (s: string) => STATE_NAMES[s] ?? s;

// Cities shown anywhere on the hub: only those whose market is configured here.
export const listedCities = (markets: MarketConfig[]): CityLocation[] =>
  LOCATIONS.filter((l) => markets.some((m) => m.id === l.market_id)).sort((a, b) => a.state.localeCompare(b.state) || a.name.localeCompare(b.name));

const latestChecked = (ls: CityLocation[]) => ls.map((l) => l.checked_on).sort().at(-1) ?? '';

function shortFigure(l: CityLocation): string {
  const f = hardnessFacts(l);
  if (!f.length) return 'No published figure found';
  return f.length === 1 ? f[0]!.value : `${f.length} figures, see the city page`;
}

function cityRow(l: CityLocation): string {
  const f = hardnessFacts(l)[0];
  return `<tr><td><a href="${e(cityHref(l.slug))}">${e(l.name)}</a></td><td>${e(l.state)}</td><td>${e(shortFigure(l))}</td><td>${classBadge(l) || '<span class="small">n/a</span>'}</td>`
    + `<td>${f ? `<a href="${e(f.source_url)}" rel="noopener">${e(f.utility)}</a>, ${e(f.period)}` : '<span class="small">n/a</span>'}</td></tr>`;
}

export function cityTable(ls: CityLocation[]): string {
  return `<div class="tablewrap"><table><thead><tr><th>City</th><th>State</th><th>Hardness, as published</th><th>USGS class</th><th>Source and period</th></tr></thead>
<tbody>${ls.map(cityRow).join('')}</tbody></table></div>`;
}

const zipForm = `<form class="inquiry" method="get" action="/check" id="request" data-boilerplate><h2 style="margin-top:0">Check your ZIP code</h2>
<div class="zipcheck"><div><label class="f" for="zip">ZIP code</label><input type="text" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5"></div>
<button type="submit">Check</button></div><p class="small">We use your ZIP code only to find your city's page and whether a local company serves it.</p></form>`;

export function hubHomeBody(markets: MarketConfig[]): string {
  const ls = listedCities(markets);
  const withFig = ls.filter((l) => hardnessFacts(l).length);
  const veryHard = ls.filter((l) => l.scale_mgl && classLabel(l)?.endsWith('very hard'));
  const live = markets.filter(isOpen);
  return `<section class="hero grid two"><div>
<h1>How hard is your water? Published hardness for ${ls.length} U.S. cities</h1>
<p class="lead">Find your city's water hardness exactly as its utility publishes it, with the source and date. Then compare softeners, filters and reverse osmosis, and request a written quote from one local company.</p>
<div class="statgrid"><div class="stat"><b>${ls.length}</b>cities covered</div><div class="stat"><b>${withFig.length}</b>with a published hardness figure</div><div class="stat"><b>${veryHard.length}</b>read as very hard at the top of their published range</div></div>
<p class="small">Figures are copied from utility reports and checked ${e(longDate(latestChecked(ls)))}. Classes follow the <a href="${USGS_HARDNESS}" rel="noopener">U.S. Geological Survey</a>. We are not a water utility.</p>
</div><div>${zipForm}
<p class="small">${live.length ? `Taking requests in: ${live.map((m) => e(m.name)).join(', ')}.` : 'We are not taking requests in any city yet. The water facts are open to everyone.'}</p></div></section>
<h2>Hard water by city</h2>
${cityTable(ls)}
<p><a href="/hard-water-by-city/">Full table with every utility and period</a> · <a href="/data/cities.json">Data as JSON</a></p>
<h2>What should I compare?</h2>
<div class="grid three"><a class="card link" href="/water-softeners/"><strong>Water softener</strong><span>For scale and hard water.</span></a><a class="card link" href="/whole-home-filtration/"><strong>Whole-home filter</strong><span>For chlorine taste and odor.</span></a><a class="card link" href="/reverse-osmosis/"><strong>Reverse osmosis</strong><span>For drinking water at one tap.</span></a></div>
<h2>How does it work?</h2><ol class="steps"><li>Check your ZIP code.</li><li>Read your city's published water facts.</li><li>Send a request to the one local company named for your area.</li><li>Get an assessment and a written quote. Booking is not a purchase.</li></ol>`;
}

export function hubJsonLd(baseUrl: string, markets: MarketConfig[]): object[] {
  const ls = listedCities(markets);
  const org = { '@type': 'Organization', name: HUB_BRAND, url: `${baseUrl}/`, parentOrganization: { '@type': 'Organization', name: company.legal_name } };
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: HUB_BRAND, url: `${baseUrl}/`, publisher: org },
    { '@context': 'https://schema.org', '@type': 'Dataset', name: 'Published drinking water hardness by U.S. city',
      description: `Water hardness for ${ls.length} U.S. cities, copied as published by each city's water utility, with the reporting period and a link to the source document, and the U.S. Geological Survey hardness class.`,
      url: `${baseUrl}/hard-water-by-city/`, creator: org, dateModified: latestChecked(ls), isAccessibleForFree: true,
      spatialCoverage: { '@type': 'Place', name: 'United States' }, variableMeasured: 'Total hardness (mg/L as calcium carbonate, grains per gallon)',
      distribution: [{ '@type': 'DataDownload', encodingFormat: 'application/json', contentUrl: `${baseUrl}/data/cities.json` }] },
  ];
}

export function hardWaterByCityBody(markets: MarketConfig[]): string {
  const ls = listedCities(markets);
  const rows = ls.flatMap((l) => {
    const fs = hardnessFacts(l);
    if (!fs.length) return [`<tr><td><a href="${e(cityHref(l.slug))}">${e(l.name)}</a>, ${e(l.state)}</td><td colspan="3">No published hardness figure found</td><td>${e(l.checked_on)}</td></tr>`];
    return fs.map((f, i) => `<tr><td>${i ? '' : `<a href="${e(cityHref(l.slug))}">${e(l.name)}</a>, ${e(l.state)}`}</td><td>${e(f.utility)}: ${e(f.label)}</td><td>${e(f.value)}</td><td>${e(f.period)}, <a href="${e(f.source_url)}" rel="noopener">source</a></td><td>${i ? '' : e(l.checked_on)}</td></tr>`);
  }).join('');
  return `<h1>Hard water by city</h1>
<p class="answer">This table lists drinking water hardness for ${ls.length} U.S. cities exactly as each utility publishes it, with the period it covers and a link to the source. The U.S. Geological Survey classes water above 180 mg/L as calcium carbonate as very hard and 60 mg/L or less as soft. One grain per gallon is about 17.1 mg/L.</p>
<p class="small">Download: <a href="/data/cities.json">cities.json</a>. Utility figures describe a whole system; water at one address can differ.</p>
<div class="tablewrap"><table><thead><tr><th>City</th><th>Utility and measure</th><th>As published</th><th>Period and source</th><th>Checked</th></tr></thead><tbody>${rows}</tbody></table></div>
<h2>By state</h2>${[...new Set(ls.map((l) => l.state))].map((st) => `<p><strong>${e(stateName(st))}:</strong> ${ls.filter((l) => l.state === st).map((l) => `<a href="${e(cityHref(l.slug))}">${e(l.name)}</a>${classLabel(l) ? ` (${e(classLabel(l)!)})` : ''}`).join(', ')}</p>`).join('')}`;
}

export function citiesJson(markets: MarketConfig[]): string {
  const ls = listedCities(markets);
  return JSON.stringify({
    title: 'Published drinking water hardness by U.S. city', publisher: HUB_BRAND, operator: company.legal_name,
    method: 'Each figure is copied as published by the city\'s water utility, with its period and source. USGS classes: 0-60 mg/L soft, 61-120 moderately hard, 121-180 hard, over 180 very hard.',
    usgs_source: USGS_HARDNESS, updated: latestChecked(ls),
    cities: ls.map((l) => {
      const s = siteForSlug(l.slug);
      const m = markets.find((x) => x.id === l.market_id);
      return cityData(l, s ? { url: `${siteUrl(s)}/`, brand: fullBrand(s) } : null, !!m && isOpen(m));
    }),
  }, null, 2);
}

export function hubLlmsTxt(baseUrl: string, markets: MarketConfig[]): string {
  const ls = listedCities(markets);
  return [
    `# ${HUB_BRAND}`, '',
    `> Drinking water hardness for ${ls.length} U.S. cities, copied as published by each utility with its source and date, plus guides to water softeners, whole-home filtration and reverse osmosis. Homeowners can request a written quote from one local company per city once that city opens. Not a water utility. Operated by ${company.legal_name}.`, '',
    '## Data',
    `- [Hard water by city](${baseUrl}/hard-water-by-city/): every figure, utility, period and source`,
    `- [cities.json](${baseUrl}/data/cities.json): the same data as JSON`, '',
    '## Cities',
    ...ls.map((l) => {
      const f = hardnessFacts(l)[0];
      return `- [${l.name}, ${l.state}](${cityHref(l.slug).startsWith('http') ? cityHref(l.slug) : baseUrl + cityHref(l.slug)}): ${f ? `${f.label} ${f.value} (${f.utility}, ${f.period})` : 'no published figure found'}${classLabel(l) ? `; USGS class ${classLabel(l)}` : ''}`;
    }), '',
    '## Guides',
    `- [Water softeners](${baseUrl}/water-softeners/)`, `- [Whole-home filtration](${baseUrl}/whole-home-filtration/)`, `- [Reverse osmosis](${baseUrl}/reverse-osmosis/)`, `- [How it works](${baseUrl}/how-it-works/)`, '',
  ].join('\n');
}

// A state directory site, such as californiawatersystems.com: the state's cities and their figures.
// A state site lists its cities in sentences, so its text is its own and not rows copied from the hub's table.
function stateCityItem(l: CityLocation): string {
  const f = hardnessFacts(l), c = classLabel(l);
  const a = `<a href="${e(cityHref(l.slug))}">${e(l.name)}</a>`;
  if (!f.length) return `<li>${a}: no published hardness figure found yet.</li>`;
  const utils = [...new Set(f.map((x) => x.utility))].join(' and ');
  const what = f.length === 1 ? `${e(f[0]!.value)}, ${e(f[0]!.period)}, from ${e(utils)}` : `${f.length} published figures from ${e(utils)}`;
  return `<li>${a}: ${what}.${c ? ` That reads as ${e(c)}.` : ''}</li>`;
}

export function stateBody(st: StateSite, markets: MarketConfig[]): string {
  const ls = listedCities(markets).filter((l) => l.state === st.state);
  return `<h1>Water hardness and water treatment in ${e(st.stateName)}</h1>
<p class="answer">Published drinking water hardness for ${ls.length} ${e(st.stateName)} cities, copied from each city's utility with its period and source. Pick your city for the full facts and to request a quote.</p>
<ul>${ls.map(stateCityItem).join('')}</ul>
<h2>What should I compare?</h2>
<div class="grid three"><a class="card link" href="/water-softeners/"><strong>Water softener</strong><span>For scale and hard water.</span></a><a class="card link" href="/whole-home-filtration/"><strong>Whole-home filter</strong><span>For chlorine taste and odor.</span></a><a class="card link" href="/reverse-osmosis/"><strong>Reverse osmosis</strong><span>For drinking water at one tap.</span></a></div>
<p class="small">The U.S. Geological Survey classes water above 180 mg/L as calcium carbonate as very hard (<a href="${USGS_HARDNESS}" rel="noopener">USGS</a>). We are not a water utility.</p>`;
}

export function stateLlmsTxt(st: StateSite, markets: MarketConfig[], hubBase: string): string {
  const ls = listedCities(markets).filter((l) => l.state === st.state);
  return [`# ${st.brand} by ${HUB_BRAND}`, '', `> Published drinking water hardness for ${st.stateName} cities, with links to each city's site. Not a water utility.`, '', '## Cities',
    ...ls.map((l) => { const f = hardnessFacts(l)[0]; return `- [${l.name}](${cityHref(l.slug).startsWith('http') ? cityHref(l.slug) : hubBase + cityHref(l.slug)}): ${f ? `${f.value} (${f.utility}, ${f.period})` : 'no published figure found'}`; }),
    '', `- [All cities](${hubBase}/hard-water-by-city/)`, ''].join('\n');
}

