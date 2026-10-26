// Standalone city sites (content/sites.ts). Every answer here comes from a sourced fact in
// content/locations.ts or from how the service works. No prices, no ratings, no address, and no
// water claim that is not in a utility source.
import type { MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import { locationsInMarket, type CityLocation } from '../../content/locations.ts';
import { CITY_ZIPS } from '../../content/zips.ts';
import { siteForSlug, siteUrl, type CitySite } from '../../content/sites.ts';
import { inquiryForm } from './pages.ts';
import { displayPhone } from './layout.ts';
import company from '../../config/company.json';

type Form = { vals?: Record<string, string | undefined>; errors?: Record<string, string> };

const USGS_HARDNESS = 'https://www.usgs.gov/water-science-school/science/hardness-water';
const isOpen = (m: MarketConfig) => m.status === 'active' && !!m.business_mode;

export interface Faq { q: string; a: string }

const hardnessFacts = (l: CityLocation) => l.facts.filter((f) => /hardness/i.test(f.label));

// One plain sentence per utility, copied from the published figures with their period.
function hardnessAnswer(l: CityLocation): string {
  const fs = hardnessFacts(l);
  if (!fs.length) return `We have not found a published hardness figure for ${l.name}. Your utility's latest water quality report is the place to check.`;
  const parts = fs.map((f) => `${f.label} reported by ${f.utility}: ${f.value} (${f.period}).`);
  return `${parts.join(' ')}${fs.length > 1 ? ' Check which utility appears on your water bill.' : ''}`;
}

function installerAnswer(m: MarketConfig, l: CityLocation): string {
  if (m.business_mode === 'dealer_partner' && m.seller_display_name) {
    return `${m.seller_display_name}, a local dealer, provides the estimate, contract, installation and ongoing service. Your request goes only to that company.`;
  }
  return `We have not named a local installing company for ${l.name} yet. We will tell you the company's name and ask you before your request is shared with anyone.`;
}

export function cityFaq(l: CityLocation, m: MarketConfig): Faq[] {
  return [
    { q: `How hard is the water in ${l.name}?`, a: hardnessAnswer(l) },
    { q: `Is the water the same in every ${l.name} home?`, a: 'Utility reports describe the water system as a whole. Water at a single address can differ, especially in older plumbing, so the installing company should test your water before recommending equipment.' },
    { q: 'What counts as very hard water?', a: 'The U.S. Geological Survey classifies water above 180 mg/L as calcium carbonate as very hard. One grain per gallon equals about 17.1 mg/L.' },
    { q: 'Does a water softener remove chlorine?', a: 'A softener is not a general drinking-water filter. It is not designed to remove chlorine taste or most other contaminants. Whole-home filtration and reverse osmosis are the systems usually compared for taste and drinking water.' },
    { q: `How much does a water softener cost in ${l.name}?`, a: 'We do not publish prices. You get a written quote after an assessment at your home, and it lists what is included and what is extra.' },
    { q: 'Who installs the system?', a: installerAnswer(m, l) },
    { q: 'Is booking an assessment a purchase?', a: 'No. Booking an assessment is not a purchase, and sending a request does not commit you to anything.' },
  ];
}

export function cityJsonLd(site: CitySite, l: CityLocation, m: MarketConfig): object[] {
  const url = `${siteUrl(site)}/`;
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brand, url },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cityFaq(l, m).map((f) => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
  ];
}

export const cityTitle = (site: CitySite, l: CityLocation) => `${l.name} Water Softeners and Filtration | ${site.brand}`;

export function cityDescription(l: CityLocation): string {
  const utilities = [...new Set(hardnessFacts(l).map((f) => f.utility))];
  const src = utilities.length === 1 ? utilities[0]! : utilities.length ? 'local utilities' : 'your utility';
  return `${l.name} water hardness as published by ${src}, and how to get a written quote for a water softener or filter from a local company.`;
}

function factsTable(l: CityLocation): string {
  if (!l.facts.length) return '<p>We have not yet found a published hardness figure for this area. Ask your utility for its latest water quality report.</p>';
  const multi = new Set(l.facts.map((f) => f.utility)).size > 1;
  const rows = l.facts.map((f) => `<tr>${multi ? `<td>${e(f.utility)}</td>` : ''}<td>${e(f.label)}</td><td>${e(f.value)}</td><td>${e(f.period)}</td><td><a href="${e(f.source_url)}" rel="noopener">${e(f.source_title)}</a></td></tr>`).join('');
  return `<table><thead><tr>${multi ? '<th>Utility</th>' : ''}<th>Measure</th><th>As published</th><th>Period</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function relationship(m: MarketConfig): string {
  return m.business_mode === 'dealer_partner' && m.seller_display_name
    ? `We connect homeowners with ${e(m.seller_display_name)}, which provides your estimate, contract, installation and ongoing service.`
    : 'We are lining up one local company to serve this area. The request form names that company before you submit.';
}

// Other cities in the same market, linked to their own sites where they have one.
function nearby(l: CityLocation, m: MarketConfig, hubBase: string): string {
  const others = locationsInMarket(m.id).filter((x) => x.slug !== l.slug);
  if (!others.length) return '';
  const link = (x: CityLocation) => {
    const s = siteForSlug(x.slug);
    return `<a href="${e(s ? `${siteUrl(s)}/` : `${hubBase}/locations/${x.slug}/`)}">${e(x.name)}</a>`;
  };
  return `<h2>Nearby cities</h2><p>${others.map(link).join(', ')}.</p>`;
}

export function cityHomeBody(site: CitySite, l: CityLocation, m: MarketConfig, requestId: string, hubBase: string, form?: Form): string {
  const zips = CITY_ZIPS[l.slug] ?? [];
  const faq = cityFaq(l, m);
  const panel = isOpen(m)
    ? inquiryForm({ requestId, market: m, page: '/', brand: site.brand, ...form })
    : `<div class="card" id="request"><h2>Not open yet</h2><p>We are not accepting requests in ${e(l.name)} yet.</p></div>`;
  return `<div class="grid two"><div>
<h1>Water softeners and filtration in ${e(l.name)}, ${e(l.state)}</h1>
<p class="answer">${e(hardnessAnswer(l))}</p>
<div class="disclosure"><strong>Who you are working with.</strong> ${relationship(m)}</div>
<h2>${e(l.name)} water, as published</h2>
<p>${e(l.intro)}</p>
${factsTable(l)}
${l.notes.length ? `<ul>${l.notes.map((n) => `<li>${e(n)}</li>`).join('')}</ul>` : ''}
<p class="small">Hardness is dissolved calcium and magnesium. The U.S. Geological Survey classifies water above 180 mg/L as calcium carbonate as very hard (<a href="${USGS_HARDNESS}" rel="noopener">USGS</a>).</p>
<h2>Systems homeowners compare</h2>
<ul><li><a href="/water-softeners/">Water softeners</a> for scale and hard water.</li><li><a href="/whole-home-filtration/">Whole-home filtration</a> for chlorine taste and odor.</li><li><a href="/reverse-osmosis/">Reverse osmosis</a> for drinking water at one tap.</li></ul>
<h2>How it works</h2><ol class="steps"><li>Send a request.</li><li>Assessment at your home.</li><li>Written quote with what is included and what is extra.</li><li>Installation and service.</li></ol>
<h2>Common questions</h2>
<dl class="faq">${faq.map((f) => `<dt>${e(f.q)}</dt><dd>${e(f.a)}</dd>`).join('')}</dl>
${zips.length ? `<h2>ZIP codes we cover</h2><p class="small">${zips.map(e).join(', ')}</p>` : ''}
${nearby(l, m, hubBase)}
</div><div>${panel}</div></div>`;
}

export function cityContactBody(site: CitySite, m: MarketConfig): string {
  const phone = m.tracking_phone ? `<a href="tel:${e(m.tracking_phone)}">${e(displayPhone(m.tracking_phone))}</a>` : '<em>Phone not yet published</em>';
  return `<h1>Contact ${e(site.brand)}</h1>
<p>Phone: ${phone}<br>Email: ${company.public_email ? `<a href="mailto:${e(company.public_email)}">${e(company.public_email)}</a>` : '<em>Email not yet published</em>'}<br>Hours: ${company.hours_text ? e(company.hours_text) : '<em>Hours not yet published</em>'}</p>
<p>For a leak or loss of water at a home where a system was installed, call the installing company's service number on your paperwork first.</p>`;
}

export function cityAboutBody(site: CitySite, l: CityLocation): string {
  return `<h1>About ${e(site.brand)}</h1>
<p>${e(site.brand)} helps ${e(l.name)} homeowners compare water treatment options and request a written quote from one qualified local company. The request form names that company before you submit.</p>
<p>${e(site.brand)} is part of My Home Water System, operated by ${e(company.legal_name)}.</p>`;
}
