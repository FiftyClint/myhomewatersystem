// Standalone city sites (content/sites.ts). Every answer here comes from a sourced fact in
// content/locations.ts or from how the service works. No prices, no ratings, no address, and no
// water claim that is not in a utility source.
// Pages lead with the answer, use question headings, and carry the same facts as JSON-LD, /water.json
// and /llms.txt, so an AI assistant can quote a figure with its source and date. People get the same
// answer first, a scale they can read at a glance, and the request panel beside it.
import { takesRequests, type MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import { locationsInMarket, type CityLocation } from '../../content/locations.ts';
import { CITY_ZIPS } from '../../content/zips.ts';
import { fullBrand, HUB_BRAND, siteForSlug, siteUrl, type CitySite } from '../../content/sites.ts';
import { inquiryForm } from './pages.ts';
import { displayPhone } from './layout.ts';
import { classBadge, classLabel, classSentence, cityData, hardnessAnswer, hardnessFacts, hardnessScale, longDate, USGS_HARDNESS } from './water.ts';
import company from '../../config/company.json';

type Form = { vals?: Record<string, string | undefined>; errors?: Record<string, string> };

export const isOpen = takesRequests;

export interface Faq { q: string; a: string }

function installerAnswer(m: MarketConfig, l: CityLocation): string {
  if (m.business_mode === 'dealer_partner' && m.seller_display_name) {
    return `${m.seller_display_name}, a local dealer, provides the estimate, contract, installation and ongoing service. Your request goes only to that company.`;
  }
  return `We have not named a local installing company for ${l.name} yet. We will tell you the company's name and ask you before your request is shared with anyone.`;
}

export const utilitiesOf = (l: CityLocation) => [...new Set(l.facts.map((f) => f.utility))];

export function cityFaq(l: CityLocation, m: MarketConfig, brand = `${l.name} Water Systems`): Faq[] {
  const cls = classSentence(l);
  const out: Faq[] = [
    { q: `How hard is the water in ${l.name}?`, a: hardnessAnswer(l) },
  ];
  if (cls) out.push({ q: `Is ${l.name} water hard or soft?`, a: `${cls} USGS treats water above 180 mg/L as calcium carbonate as very hard and 60 mg/L or less as soft.` });
  out.push(
    { q: `Do I need a water softener in ${l.name}?`, a: 'It depends on what you see at home. Scale on fixtures, spotty glassware and buildup in a water heater point to hardness, which a softener addresses. Chlorine taste and drinking water are different problems with different systems. Have your water tested at the house before buying anything.' },
    { q: `Is the water the same in every ${l.name} home?`, a: 'Utility reports describe the water system as a whole. Water at a single address can differ, especially in older plumbing, so the installing company should test your water before recommending equipment.' },
    { q: 'What counts as very hard water?', a: 'The U.S. Geological Survey classifies water above 180 mg/L as calcium carbonate as very hard. One grain per gallon equals about 17.1 mg/L.' },
    { q: 'Does a water softener remove chlorine?', a: 'A softener is not a general drinking-water filter. It is not designed to remove chlorine taste or most other contaminants. Whole-home filtration and reverse osmosis are the systems usually compared for taste and drinking water.' },
    { q: `How much does a water softener cost in ${l.name}?`, a: 'We do not publish prices. You get a written quote after an assessment at your home, and it lists what is included and what is extra.' },
    { q: 'Who installs the system?', a: installerAnswer(m, l) },
    { q: `Is ${brand} part of the city or the water utility?`, a: `No. We are not a water utility and are not affiliated with ${utilitiesOf(l).join(' or ') || 'the local utility'}. We copy the utility's published figures and link to its report.` },
    { q: 'Is booking an assessment a purchase?', a: 'No. Booking an assessment is not a purchase, and sending a request does not commit you to anything.' },
  );
  return out;
}

const ORG = { '@type': 'Organization', name: HUB_BRAND, url: 'https://www.myhomewatersystem.com/', parentOrganization: { '@type': 'Organization', name: company.legal_name } };

export function cityJsonLd(site: CitySite, l: CityLocation, m: MarketConfig): object[] {
  const url = `${siteUrl(site)}/`;
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: fullBrand(site), alternateName: site.brand, url, publisher: ORG },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cityFaq(l, m, site.brand).map((f) => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'WebPage', url, name: cityTitle(site, l), dateModified: l.checked_on, lastReviewed: l.checked_on,
      about: { '@type': 'City', name: l.name, containedInPlace: { '@type': 'State', name: l.state } },
      citation: hardnessFacts(l).map((f) => ({ '@type': 'CreativeWork', name: f.source_title, url: f.source_url, publisher: { '@type': 'Organization', name: f.utility } })),
      mainEntity: { '@type': 'Service', serviceType: 'Water treatment quote requests', areaServed: { '@type': 'City', name: l.name }, provider: ORG } },
  ];
}

export const cityTitle = (site: CitySite, l: CityLocation) => `${l.name} Water Softeners and Filtration | ${site.brand}`;

export function cityDescription(l: CityLocation): string {
  const utilities = [...new Set(hardnessFacts(l).map((f) => f.utility))];
  const src = utilities.length === 1 ? utilities[0]! : utilities.length ? 'local utilities' : 'your utility';
  return `${l.name} water hardness as published by ${src}, and how to get a written quote for a water softener or filter from a local company.`;
}

export function factsTable(l: CityLocation): string {
  if (!l.facts.length) return '<p>We have not yet found a published hardness figure for this area. Ask your utility for its latest water quality report.</p>';
  const multi = new Set(l.facts.map((f) => f.utility)).size > 1;
  const rows = l.facts.map((f) => `<tr>${multi ? `<td>${e(f.utility)}</td>` : ''}<td>${e(f.label)}</td><td>${e(f.value)}</td><td>${e(f.period)}</td><td><a href="${e(f.source_url)}" rel="noopener">${e(f.source_title)}</a></td></tr>`).join('');
  return `<div class="tablewrap"><table><thead><tr>${multi ? '<th>Utility</th>' : ''}<th>Measure</th><th>As published</th><th>Period</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

function relationship(m: MarketConfig): string {
  return m.business_mode === 'dealer_partner' && m.seller_display_name
    ? `We connect homeowners with ${e(m.seller_display_name)}, which provides your estimate, contract, installation and ongoing service.`
    : 'We are lining up one local company to serve this area. The request form names that company before you submit.';
}

// Other cities in the same market, linked to their own sites where they have one.
function nearby(l: CityLocation, m: MarketConfig, hubBase: string): string {
  const others = locationsInMarket(m.id).filter((x) => x.slug !== l.slug);
  const link = (x: CityLocation) => {
    const s = siteForSlug(x.slug);
    return `<a href="${e(s ? `${siteUrl(s)}/` : `${hubBase}/locations/${x.slug}/`)}">${e(x.name)}</a>`;
  };
  const near = others.length ? `<h2>Nearby cities</h2><p>${others.map(link).join(', ')}.</p>` : '';
  return `${near}<p>Compare published hardness in other cities on <a href="${e(hubBase)}/hard-water-by-city/">hard water by city</a>.</p>`;
}

// The answer card at the top: the figure, its source and date, the USGS class and the scale.
export function answerCard(l: CityLocation): string {
  const src = hardnessFacts(l)[0];
  const badge = classBadge(l);
  return `<section class="answer-card" aria-labelledby="answer-h">
<h2 id="answer-h" class="eyebrow">How hard is ${e(l.name)} water?</h2>
<p class="answer">${e(hardnessAnswer(l))}</p>
${badge ? `<p class="classline">${badge} <span class="small">${e(classSentence(l) ?? '')}</span></p>` : ''}
${hardnessScale(l)}
<p class="small">${src ? `Source: <a href="${e(src.source_url)}" rel="noopener">${e(src.source_title)}</a>. ` : ''}Sources last checked ${e(longDate(l.checked_on))}.</p>
</section>`;
}

const toc = '<nav class="toc" aria-label="On this page"><a href="#water">Local water</a><a href="#meaning">What it means</a><a href="#systems">Systems</a><a href="#how">How it works</a><a href="#faq">Questions</a><a href="#request">Request</a></nav>';

export function cityHomeBody(site: CitySite, l: CityLocation, m: MarketConfig, requestId: string, hubBase: string, form?: Form): string {
  const zips = CITY_ZIPS[l.slug] ?? [];
  const faq = cityFaq(l, m, site.brand);
  const open = isOpen(m);
  const panel = open
    ? inquiryForm({ requestId, market: m, page: '/', brand: site.brand, ...form })
    : `<div class="card" id="request"><h2>Not open yet</h2><p>We are not accepting requests in ${e(l.name)} yet. The water facts on this page were last checked ${e(longDate(l.checked_on))}.</p></div>`;
  return `<div class="grid two"><div>
<h1>Water softeners and filtration in ${e(l.name)}, ${e(l.state)}</h1>
${answerCard(l)}
<div class="disclosure"><strong>Who you are working with.</strong> ${relationship(m)} We are not a water utility.</div>
${toc}
<h2 id="water">What is in ${e(l.name)} water, as published?</h2>
<p>${e(l.intro)}</p>
${factsTable(l)}
${l.notes.length ? `<ul>${l.notes.map((n) => `<li>${e(n)}</li>`).join('')}</ul>` : ''}
<h2 id="meaning">What do the hardness numbers mean for my home?</h2>
<p>Hardness is dissolved calcium and magnesium. It is what leaves scale on fixtures, glass and the inside of water heaters. The U.S. Geological Survey classifies water above 180 mg/L as calcium carbonate as very hard (<a href="${USGS_HARDNESS}" rel="noopener">USGS</a>). One grain per gallon equals about 17.1 mg/L.</p>
${classLabel(l) ? `<p>${e(classSentence(l)!)} Utility figures describe the whole system, so a test at your address is the real answer.</p>` : ''}
<h2 id="systems">Which systems do ${e(l.name)} homeowners compare?</h2>
<div class="grid three"><a class="card link" href="/water-softeners/"><strong>Water softener</strong><span>For scale and hard water.</span></a><a class="card link" href="/whole-home-filtration/"><strong>Whole-home filter</strong><span>For chlorine taste and odor.</span></a><a class="card link" href="/reverse-osmosis/"><strong>Reverse osmosis</strong><span>For drinking water at one tap.</span></a></div>
<h2 id="how">How does getting a quote work?</h2><ol class="steps"><li>Send a request.</li><li>Assessment at your home.</li><li>Written quote with what is included and what is extra.</li><li>Installation and service.</li></ol>
<h2 id="faq">Common questions</h2>
<dl class="faq">${faq.map((f) => `<dt>${e(f.q)}</dt><dd>${e(f.a)}</dd>`).join('')}</dl>
${zips.length ? `<h2>Which ZIP codes does this page cover?</h2><p class="small">${zips.map(e).join(', ')}</p>` : ''}
${nearby(l, m, hubBase)}
<p class="small">Machine-readable facts: <a href="/water.json">water.json</a>. Summary for AI assistants: <a href="/llms.txt">llms.txt</a>.</p>
</div><div class="side">${panel}</div></div>
${open ? '<a class="sticky-cta" href="#request">Request a quote</a>' : ''}`;
}

export function cityContactBody(site: CitySite, m: MarketConfig): string {
  // No number yet means no phone line at all (Clint, 2026-10-27). The request form is the way in.
  const phone = m.tracking_phone ? `Phone: <a href="tel:${e(m.tracking_phone)}">${e(displayPhone(m.tracking_phone))}</a><br>` : '';
  return `<h1>Contact ${e(fullBrand(site))}</h1>
<p>${phone}Request a quote: <a href="/#request">use the request form</a><br>Email: ${company.public_email ? `<a href="mailto:${e(company.public_email)}">${e(company.public_email)}</a>` : '<em>Email not yet published</em>'}</p>
<p>For a leak or loss of water at a home where a system was installed, call the installing company's service number on your paperwork first.</p>`;
}

export function cityAboutBody(site: CitySite, l: CityLocation): string {
  return `<h1>About ${e(fullBrand(site))}</h1>
<p>${e(site.brand)} helps ${e(l.name)} homeowners compare water treatment options and request a written quote from one qualified local company. The request form names that company before you submit.</p>
<p>${e(site.brand)} is run by My Home Water System, operated by ${e(company.legal_name)}. We are not a water utility and are not affiliated with ${e(utilitiesOf(l).join(' or ') || 'the local utility')}.</p>
<h2>Where do the water figures come from?</h2>
<p>Every figure is copied from the utility's own published report or web page, with its period and a link. We do not test water and do not estimate figures. Sources were last checked ${e(longDate(l.checked_on))}.</p>`;
}

// /llms.txt: a plain-text summary for AI assistants, with the facts, their sources and the page links.
export function cityLlmsTxt(site: CitySite, l: CityLocation, m: MarketConfig, hubBase: string): string {
  const base = siteUrl(site);
  const facts = l.facts.map((f) => `- ${f.label}, ${f.utility}: ${f.value} (${f.period}). Source: ${f.source_title}, ${f.source_url}`);
  const lines = [
    `# ${fullBrand(site)}`, '',
    `> Published water hardness for ${l.name}, ${l.state}, copied from the utility's own reports, and a way to request a written water treatment quote from one local company. Not a water utility.`, '',
    '## Water facts, as published',
    ...(facts.length ? facts : [`- No published hardness figure found for ${l.name} as of ${l.checked_on}.`]),
    ...(classLabel(l) ? [`- USGS class, our reading of the published figures: ${classLabel(l)}. Classes: ${USGS_HARDNESS}`] : []),
    ...l.notes.map((n) => `- ${n}`),
    `- Sources last checked: ${l.checked_on}`, '',
    '## Pages',
    `- [${l.name} water and quotes](${base}/): the answer, the sources, common questions`,
    `- [Water data as JSON](${base}/water.json)`,
    `- [Water softeners](${hubBase}/water-softeners/), [whole-home filtration](${hubBase}/whole-home-filtration/), [reverse osmosis](${hubBase}/reverse-osmosis/)`,
    `- [Hard water by city](${hubBase}/hard-water-by-city/): published hardness for every city we cover`, '',
    '## Status',
    `- ${isOpen(m) ? 'Taking requests.' : 'Not taking requests yet.'} No prices are published; quotes come after an assessment at the home.`,
    `- Run by ${HUB_BRAND}, operated by ${company.legal_name}.`, '',
  ];
  return lines.join('\n');
}

export const cityWaterJson = (site: CitySite, l: CityLocation, m: MarketConfig): string =>
  JSON.stringify(cityData(l, { url: `${siteUrl(site)}/`, brand: fullBrand(site) }, isOpen(m)), null, 2);
