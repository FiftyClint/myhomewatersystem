// Standalone city sites (content/sites.ts). Every answer here comes from a sourced fact in
// content/locations.ts or from how the service works. No prices, no ratings, no address, and no
// water claim that is not in a utility source.
// Pages lead with the answer, use question headings, and carry the same facts as JSON-LD, /water.json
// and /llms.txt, so an AI assistant can quote a figure with its source and date. People get the same
// answer first, a scale they can read at a glance, and the request panel beside it.
import { takesRequests, type MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import { LOCATIONS, locationsInMarket, type CityLocation } from '../../content/locations.ts';
import { GENERAL, localOf, type DisinfectantKind, type LocalDetail } from '../../content/local-details.ts';
import { areaPageOf, type Area, type AreaPage } from '../../content/areas.ts';
import { CITY_ZIPS } from '../../content/zips.ts';
import { fullBrand, HUB_BRAND, siteForSlug, siteUrl, type CitySite } from '../../content/sites.ts';
import { inquiryForm } from './pages.ts';
import { displayPhone } from './layout.ts';
import { classBadge, classLabel, classOf, classSentence, cityData, hardnessAnswer, hardnessFacts, hardnessScale, longDate, MGL_PER_GRAIN, USGS_HARDNESS } from './water.ts';
import company from '../../config/company.json';
import { filtrationOf, FILTRATION_GENERAL as FG, UCMR5, UCMR5_MRL_PPT, type CityFiltration, type PfasFact } from '../../content/filtration.ts';

type Form = { vals?: Record<string, string | undefined>; errors?: Record<string, string> };

export const isOpen = takesRequests;

export interface Faq { q: string; a: string; src?: { title: string; url: string } }

function installerAnswer(m: MarketConfig, l: CityLocation): string {
  if (m.business_mode === 'dealer_partner' && m.seller_display_name) {
    return `${m.seller_display_name}, a local dealer, provides the estimate, contract, installation and ongoing service. Your request goes only to that company.`;
  }
  return `We have not named a local installing company for ${l.name} yet. We will tell you the company's name and ask you before your request is shared with anyone.`;
}

export const utilitiesOf = (l: CityLocation) => [...new Set(l.facts.map((f) => f.utility))];

const sourced = (q: string, d: LocalDetail, extra = ''): Faq =>
  ({ q, a: `${d.text} Source: ${d.source_title}.${extra ? ` ${extra}` : ''}`, src: { title: d.source_title, url: d.source_url } });

const grains = (mgl: number) => (mgl / MGL_PER_GRAIN).toFixed(1);

// The utility named in the city's facts, for sentences that would otherwise be the same on every site.
const utilityName = (l: CityLocation) => { const u = utilitiesOf(l); return u.length === 1 ? u[0]! : u.length ? `${l.name}'s utilities` : `${l.name}'s utility`; };
const fig = ([lo, hi]: [number, number]) => (lo === hi ? `${lo} mg/L` : `${lo} to ${hi} mg/L`);

// Filtration cities (content/filtration.ts): lead service lines and PFOA/PFOS, said from the city's own figures.
const num = (x: number) => x.toLocaleString('en-US');
const andList = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

export function leadAnswer(l: CityLocation, f: CityFiltration): string {
  return f.lead_lines.map((r) => {
    const parts = [
      r.lead === 0 ? 'no lead lines' : r.lead ? `${num(r.lead)} lead lines` : '',
      r.grr ? `${num(r.grr)} galvanized lines that need replacing` : '',
      r.unknown ? `${num(r.unknown)} lines of unknown material` : r.unknown === 0 ? 'no unknown lines' : '',
    ].filter(Boolean);
    const share = r.total && (r.lead ?? 0) + (r.grr ?? 0) > 0 ? ` Lead and galvanized lines together are ${(((r.lead ?? 0) + (r.grr ?? 0)) / r.total * 100).toFixed(1)}% of the ${num(r.total)} lines listed.` : r.total ? ` The inventory lists ${num(r.total)} lines in all.` : '';
    return `The ${r.utility} service line inventory shows ${andList(parts)} (${r.period[0]!.toLowerCase()}${r.period.slice(1)}).${share}`;
  }).join(' ');
}

const pfasPart = (c: 'PFOA' | 'PFOS', v: number | null, where?: string) =>
  v === null ? `no ${c} result at or above ${UCMR5_MRL_PPT} ppt` : `a highest ${c} result of ${v} ppt${where ? ` (${where})` : ''}`;

export function pfasAnswer(l: CityLocation, p: PfasFact): string {
  const found = p.pfoa_max_ppt === null && p.pfos_max_ppt === null
    ? `EPA's UCMR 5 data for ${p.utility} shows no PFOA or PFOS result at or above the ${UCMR5_MRL_PPT} ppt reporting level in ${p.samples} samples of each, collected ${p.years}.`
    : `EPA's UCMR 5 data for ${p.utility} shows ${pfasPart('PFOA', p.pfoa_max_ppt, p.pfoa_where)} and ${pfasPart('PFOS', p.pfos_max_ppt, p.pfos_where)}, from ${p.samples} samples of each collected ${p.years}.`;
  return `${found} EPA's limit for each in ${l.name} drinking water is 4.0 ppt, which ${p.utility} has until 2029 to meet; a May 18, 2026 proposal would allow until 2031.`;
}

const filterAdvice = (l: CityLocation, f: CityFiltration) =>
  `For lead in a ${l.name} home, EPA points to filters certified to both NSF/ANSI 53 and 42 for reduction to 5 ppb or less. For PFAS from ${l.name} taps, it points to NSF/ANSI 53 or 58.`;

const srcLink = (title: string, url: string) => `<a href="${e(url)}" rel="noopener">${e(title)}</a>`;

function leadTable(f: CityFiltration): string {
  const c = (x: number | null) => (x === null ? 'Not given' : num(x));
  const rows = f.lead_lines.map((r) => `<tr><td>${e(r.utility)}</td><td>${c(r.lead)}</td><td>${c(r.grr)}</td><td>${c(r.unknown)}</td><td>${c(r.total)}</td><td>${e(r.period)}</td><td>${srcLink(r.source_title, r.source_url)}</td></tr>`).join('');
  return `<div class="tablewrap"><table><thead><tr><th>Utility</th><th>Lead</th><th>Galvanized, needs replacing</th><th>Unknown</th><th>All lines</th><th>Period</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

export function filtrationSection(l: CityLocation): string {
  const f = filtrationOf(l.slug);
  if (!f) return '';
  return `<h2 id="lead">Does ${e(l.name)} have lead service lines?</h2>
<p>${e(leadAnswer(l, f))}</p>
${leadTable(f)}
<h2 id="pfas">Has PFAS been found in ${e(l.name)} water?</h2>
<p>${e(pfasAnswer(l, f.pfas))} <span data-citations>Sources: ${srcLink(UCMR5.title, UCMR5.url)}; ${srcLink(FG.pfas_mcl.source_title, FG.pfas_mcl.source_url)}.</span></p>
<p>${e(filterAdvice(l, f))} <span data-citations>Sources: ${srcLink(FG.lead_filters.source_title, FG.lead_filters.source_url)}; ${srcLink(FG.pfas_filters.source_title, FG.pfas_filters.source_url)}.</span></p>
${f.notes.length ? `<ul>${f.notes.map((n) => `<li>${e(n)}</li>`).join('')}</ul>` : ''}`;
}

// Where a published figure sits against the USGS class lines (60, 120, 180 mg/L). Arithmetic only.
function bandPosition(mgl: number): string {
  if (mgl > 180) return `${Math.round(mgl - 180)} mg/L over the 180 mg/L line where the USGS very hard class starts`;
  const top = mgl <= 60 ? 60 : mgl <= 120 ? 120 : 180;
  const gap = Math.round(top - mgl);
  return gap === 0 ? `right at the ${top} mg/L top of the USGS ${classOf(mgl)} class` : `${gap} mg/L under the ${top} mg/L top of the USGS ${classOf(mgl)} class`;
}

function positionSentence(l: CityLocation): string | null {
  if (!l.scale_mgl) return null;
  const [lo, hi] = l.scale_mgl;
  return lo === hi ? `${l.name}'s published ${lo} mg/L is ${bandPosition(lo)}.`
    : `The low end, ${lo} mg/L, is ${bandPosition(lo)}; ${l.name}'s high end, ${hi} mg/L, is ${bandPosition(hi)}.`;
}

// Grains per gallon: the utility's own grains figure where it publishes one, otherwise our stated conversion.
function grainsAnswer(l: CityLocation): string | null {
  const published = hardnessFacts(l).flatMap((f) => {
    const g = f.value.match(/([\d.]+(?:\s*(?:-|to|and)\s*[\d.]+)?)\s*(?:grains|gpg)/i);
    return g ? [`${g[1]!.replace(/\s*-\s*/, ' to ')} grains per gallon (${f.utility}, ${f.label.toLowerCase()}, ${f.period})`] : [];
  });
  const rest = hardnessFacts(l).length > published.length ? ` The other figures on this page are published in mg/L only; one grain per gallon is ${MGL_PER_GRAIN} mg/L.` : '';
  if (published.length) return `In grains per gallon, as published: ${published.join('; ')}.${rest}`;
  if (!l.scale_mgl) return null;
  const [lo, hi] = l.scale_mgl;
  const span = lo === hi ? `${lo} mg/L is about ${grains(lo)} grains per gallon` : `${lo} to ${hi} mg/L is about ${grains(lo)} to ${grains(hi)} grains per gallon`;
  return `The utility publishes hardness in mg/L, not grains. The published ${span}, converted by us at ${MGL_PER_GRAIN} mg/L per grain.`;
}

// Other covered cities in the same market, then the same state, with their published spans.
function compareAnswer(l: CityLocation): string | null {
  const pool = LOCATIONS.filter((x) => x.slug !== l.slug && x.scale_mgl);
  const near = [...pool.filter((x) => x.market_id === l.market_id), ...pool.filter((x) => x.market_id !== l.market_id && x.state === l.state)].slice(0, 3);
  if (!l.scale_mgl || !near.length) return null;
  const span = (x: CityLocation) => { const [lo, hi] = x.scale_mgl!; return `${lo === hi ? lo : `${lo} to ${hi}`} mg/L${x.scale_converted ? ' (converted from grains)' : ''}`; };
  return `Published hardness in ${l.name} spans ${span(l)}. Covered cities near ${l.name}: ${near.map((x) => `${x.name} ${span(x)}`).join('; ')}. Each figure comes from that city's own utility, not from ${l.name}'s.`;
}

function softenerAnswer(l: CityLocation): string {
  const c = classLabel(l);
  if (!c || !l.scale_mgl) return `${utilityName(l)} does not publish a hardness figure we could find for ${l.name}, so a test at your house is the number to decide on.`;
  return `${utilityName(l)} publishes ${fig(l.scale_mgl)} for ${l.name}, which reads as ${c}. A test at your house shows whether your tap matches it.`;
}

function disinfectantExtra(l: CityLocation, kind: DisinfectantKind): string {
  const g = GENERAL.chloramine_filters;
  if ((kind === 'chloramine' || kind === 'both' || kind === 'varies') && g) return `That matters when choosing a filter for a ${l.name} home: catalytic carbon is the activated-carbon type designed to adsorb chloramine (${g.source_title}). A softener leaves ${utilityName(l)}'s disinfectant in the water.`;
  return 'A softener does not remove it.';
}

// Built from what the city's own facts show: how many figures, from how many utilities, for which periods.
function sameHomeAnswer(l: CityLocation): string {
  const hf = hardnessFacts(l);
  const area = areaPageOf(l.slug) ? ` The water-by-area page breaks ${l.name} down further.` : '';
  if (!hf.length) return `No published figure covers ${l.name} homes yet, so a test at the house is the only reading.`;
  if (hf.length === 1) return `${hf[0]!.utility} publishes one figure for its whole system (${hf[0]!.period}).${area}`;
  return `${hf.length} published figures cover ${l.name}, from ${new Set(hf.map((f) => f.utility)).size} ${new Set(hf.map((f) => f.utility)).size === 1 ? 'utility' : 'utilities'}; which applies depends on where you live.${area}`;
}

// Entity facts for answer engines: one line each, every value from a sourced fact above or the city's local details.
export interface KeyFact { label: string; value: string; src?: { title: string; url: string } }

const DISINFECTANT_WORD: Record<DisinfectantKind, string> = { chlorine: 'Chlorine', chloramine: 'Chloramine', both: 'Chlorine and chloramine', varies: 'Varies by area' };

export function keyFacts(l: CityLocation): KeyFact[] {
  const d = localOf(l.slug);
  const hf = hardnessFacts(l)[0];
  const c = classLabel(l);
  const out: KeyFact[] = [{ label: 'Water utility', value: utilitiesOf(l).join('; ') || 'Not identified yet' }];
  if (d.source_water) out.push({ label: 'Source water', value: d.source_water.text, src: { title: d.source_water.source_title, url: d.source_water.source_url } });
  if (d.disinfectant) out.push({ label: 'Disinfectant', value: DISINFECTANT_WORD[d.disinfectant.kind], src: { title: d.disinfectant.source_title, url: d.disinfectant.source_url } });
  out.push({ label: 'Published hardness', value: l.scale_mgl ? `${fig(l.scale_mgl)}, about ${l.scale_mgl[0] === l.scale_mgl[1] ? grains(l.scale_mgl[0]) : `${grains(l.scale_mgl[0])} to ${grains(l.scale_mgl[1])}`} grains per gallon${c ? `, ${c} on the USGS scale` : ''}` : 'No published figure found',
    ...(hf ? { src: { title: hf.source_title, url: hf.source_url } } : {}) });
  const f = filtrationOf(l.slug);
  if (f) {
    const r = f.lead_lines[0]!;
    out.push({ label: 'Lead service lines', value: `${r.lead === null ? 'Not given' : num(r.lead)} lead, ${r.grr === null ? 'not given' : num(r.grr)} galvanized needing replacement, ${r.unknown === null ? 'not given' : num(r.unknown)} unknown (${r.period[0]!.toLowerCase()}${r.period.slice(1)})`, src: { title: r.source_title, url: r.source_url } });
    const p = f.pfas;
    const hi = [p.pfoa_max_ppt !== null ? `PFOA up to ${p.pfoa_max_ppt} ppt` : '', p.pfos_max_ppt !== null ? `PFOS up to ${p.pfos_max_ppt} ppt` : ''].filter(Boolean);
    out.push({ label: 'PFOA and PFOS (EPA UCMR 5)', value: hi.length ? `${hi.join(', ')}; EPA limit 4.0 ppt each` : `None at or above ${UCMR5_MRL_PPT} ppt in ${p.samples} ${p.utility} samples each, ${p.years}`, src: { title: UCMR5.title, url: UCMR5.url } });
  }
  out.push({ label: 'Sources last checked', value: longDate(l.checked_on) });
  return out;
}

export function keyFactsBlock(l: CityLocation): string {
  const rows = keyFacts(l).map((k) => `<dt>${e(k.label)}</dt><dd>${e(k.value)}${k.src ? ` <span class="small" data-citations>(<a href="${e(k.src.url)}" rel="noopener">source</a>)</span>` : ''}</dd>`).join('');
  return `<section aria-labelledby="facts-h"><h2 id="facts-h">${e(l.name)}, ${e(l.state)} water at a glance</h2><dl class="facts">${rows}</dl></section>`;
}

// Which system fits, said from this city's own facts: hardness class, disinfectant, lead lines and PFAS.
export function systemAnswer(l: CityLocation): string {
  const d = localOf(l.slug);
  const c = classLabel(l);
  const f = filtrationOf(l.slug);
  const parts: string[] = [];
  if (c && l.scale_mgl) parts.push(l.scale_mgl[1] <= 60
    ? `${l.name}'s published hardness reads as ${c}, so a softener is unlikely to be the first system a ${l.name} home needs.`
    : `${l.name}'s published ${fig(l.scale_mgl)} reads as ${c}, which is what a softener treats.`);
  else parts.push(`With no published hardness figure for ${l.name}, a hardness test at the house decides whether a softener is worth it.`);
  if (d.disinfectant && d.disinfectant.kind !== 'chlorine') parts.push(`Because ${utilityName(l)} uses ${DISINFECTANT_WORD[d.disinfectant.kind].toLowerCase()}, a whole-home filter for ${l.name} taste and odor should use catalytic carbon (${GENERAL.chloramine_filters?.source_title ?? 'NDSU Extension'}).`);
  else if (d.disinfectant) parts.push(`${utilityName(l)} uses chlorine, and a softener leaves it in ${l.name} water.`);
  if (f) {
    const r = f.lead_lines[0]!;
    if ((r.lead ?? 0) + (r.grr ?? 0) > 0) parts.push(`${r.utility} lists ${num((r.lead ?? 0) + (r.grr ?? 0))} lead or galvanized lines, and for lead EPA points to point-of-use filters certified to both NSF/ANSI 53 and 42 (EPA consumer tool).`);
    if (f.pfas.pfoa_max_ppt !== null || f.pfas.pfos_max_ppt !== null) parts.push(`PFAS results at or above 4 ppt in ${f.pfas.utility} water point to a filter certified to NSF/ANSI 53 or 58 for PFAS (EPA home filter guidance).`);
  }
  parts.push(`The installing company tests the water at your ${l.name} address before quoting.`);
  return parts.join(' ');
}

export function cityFaq(l: CityLocation, m: MarketConfig, brand = `${l.name} Water Systems`): Faq[] {
  const d = localOf(l.slug);
  const cls = classSentence(l);
  const out: Faq[] = [
    { q: `How hard is the water in ${l.name}?`, a: hardnessAnswer(l) },
  ];
  const fl = filtrationOf(l.slug);
  if (fl) out.push(
    { q: `Does ${l.name} have lead service lines?`, a: `${leadAnswer(l, fl)} Source: ${fl.lead_lines[0]!.source_title}.`, src: { title: fl.lead_lines[0]!.source_title, url: fl.lead_lines[0]!.source_url } },
    { q: `Has PFAS been found in ${l.name} tap water?`, a: `${pfasAnswer(l, fl.pfas)} Source: ${UCMR5.title}.`, src: { title: UCMR5.title, url: UCMR5.url } },
  );
  if (cls) out.push({ q: `Is ${l.name} water hard or soft?`, a: `${classLabel(l)![0]!.toUpperCase()}${classLabel(l)!.slice(1)}. ${positionSentence(l)}` });
  const gpg = grainsAnswer(l);
  if (gpg) out.push({ q: `How many grains per gallon is ${l.name} water?`, a: gpg });
  if (d.service) out.push(sourced(`Which utility supplies water in ${l.name}?`, d.service));
  if (d.source_water) out.push(sourced(`Where does ${l.name} tap water come from?`, d.source_water));
  if (d.softening) out.push(sourced(`Does the utility soften ${l.name} water?`, d.softening));
  if (d.by_area) out.push(sourced(`Does water differ across ${l.name}?`, d.by_area));
  if (d.seasonal) out.push(sourced(`Does ${l.name} water change over time?`, d.seasonal));
  if (d.disinfectant) out.push(sourced(`Is ${l.name} water treated with chlorine or chloramine?`, d.disinfectant, disinfectantExtra(l, d.disinfectant.kind)));
  const cmp = compareAnswer(l);
  if (cmp) out.push({ q: `How does ${l.name} water compare with nearby cities?`, a: cmp });
  out.push(
    { q: `Do I need a water softener in ${l.name}?`, a: softenerAnswer(l) },
    { q: `Which water treatment system fits a ${l.name} home?`, a: systemAnswer(l) },
  );
  if (!d.by_area) out.push({ q: `Is the water the same in every ${l.name} home?`, a: sameHomeAnswer(l) });
  if (!d.disinfectant) out.push({ q: 'Does a water softener remove chlorine?', a: `No. A softener targets hardness, not the disinfectant ${utilityName(l)} adds.` });
  out.push(
    { q: `How much does a water softener cost in ${l.name}?`, a: `We publish no prices for ${l.name}. The installing company gives a written quote after an assessment at your home.` },
    { q: 'Who installs the system?', a: installerAnswer(m, l) },
    { q: `Is ${brand} part of the ${l.name} city government or water utility?`, a: `No. ${brand} is not affiliated with ${utilitiesOf(l).join(' or ') || 'the local utility'}; it copies and links the published figures.` },
    { q: 'Is booking an assessment a purchase?', a: 'No, and a request commits you to nothing.' },
  );
  return out;
}

// Distinct sources behind the local details, for citations.
const localSources = (l: CityLocation) => {
  const seen = new Map<string, string>();
  for (const d of Object.values(localOf(l.slug))) if (d && !seen.has(d.source_url)) seen.set(d.source_url, d.source_title);
  return [...seen].map(([url, title]) => ({ url, title }));
};

const ORG = { '@type': 'Organization', name: HUB_BRAND, url: 'https://www.myhomewatersystem.com/', parentOrganization: { '@type': 'Organization', name: company.legal_name } };

export function cityJsonLd(site: CitySite, l: CityLocation, m: MarketConfig): object[] {
  const url = `${siteUrl(site)}/`;
  return [
    { '@context': 'https://schema.org', '@type': 'WebSite', name: fullBrand(site), alternateName: site.brand, url, publisher: ORG },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cityFaq(l, m, site.brand).map((f) => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'WebPage', url, name: cityTitle(site, l), dateModified: l.checked_on, lastReviewed: l.checked_on,
      isPartOf: { '@type': 'WebSite', url, name: fullBrand(site) },
      ...cityEntity(l),
      citation: citations(l),
      mainEntity: { '@type': 'Service', serviceType: 'Water treatment quote requests', areaServed: { '@type': 'City', name: l.name }, provider: ORG } },
  ];
}

// The city as an entity, with its water facts as properties, and the utilities the page cites.
export function cityEntity(l: CityLocation) {
  return {
    about: { '@type': 'City', name: l.name, containedInPlace: { '@type': 'State', name: l.state },
      additionalProperty: keyFacts(l).map((k) => ({ '@type': 'PropertyValue', name: k.label, value: k.value, ...(k.src ? { url: k.src.url } : {}) })) },
    mentions: utilitiesOf(l).map((u) => ({ '@type': 'Organization', name: u })),
  };
}

export function citations(l: CityLocation): object[] {
  const seen = new Set<string>();
  const out: object[] = [];
  const add = (name: string, url: string, publisher?: string) => {
    if (seen.has(url)) return; seen.add(url);
    out.push({ '@type': 'CreativeWork', name, url, ...(publisher ? { publisher: { '@type': 'Organization', name: publisher } } : {}) });
  };
  for (const f of hardnessFacts(l)) add(f.source_title, f.source_url, f.utility);
  for (const u of localSources(l)) add(u.title, u.url);
  const fl = filtrationOf(l.slug);
  if (fl) {
    for (const r of fl.lead_lines) add(r.source_title, r.source_url);
    add(UCMR5.title, UCMR5.url, 'US EPA');
    for (const g of Object.values(FG)) add(g.source_title, g.source_url, 'US EPA');
  }
  return out;
}

// JSON-LD for a hub page about a city with no site of its own.
export function hubCityJsonLd(l: CityLocation, m: MarketConfig, url: string): object[] {
  return [
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: cityFaq(l, m, HUB_BRAND).map((f) => ({
      '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    { '@context': 'https://schema.org', '@type': 'WebPage', url, name: `Water softeners and filtration in ${l.name} | ${HUB_BRAND}`, dateModified: l.checked_on, lastReviewed: l.checked_on,
      isPartOf: { '@type': 'WebSite', url: ORG.url, name: HUB_BRAND }, ...cityEntity(l), citation: citations(l),
      mainEntity: { '@type': 'Service', serviceType: 'Water treatment quote requests', areaServed: { '@type': 'City', name: l.name }, provider: ORG } },
  ];
}

export const cityTitle = (site: CitySite, l: CityLocation) => `${l.name} Water Softeners and Filtration | ${site.brand}`;

export function cityDescription(l: CityLocation): string {
  const utilities = [...new Set(hardnessFacts(l).map((f) => f.utility))];
  const src = utilities.length === 1 ? utilities[0]! : utilities.length ? 'local utilities' : 'your utility';
  if (filtrationOf(l.slug)) return `${l.name} lead service line counts, PFAS test results and water hardness as published by ${src} and EPA, and how to get a written quote for a water filter or softener from a local company.`;
  return `${l.name} water hardness as published by ${src}, and how to get a written quote for a water softener or filter from a local company.`;
}

export function factsTable(l: CityLocation): string {
  if (!l.facts.length) return '<p>We have not yet found a published hardness figure for this area. Ask your utility for its latest water quality report.</p>';
  const multi = new Set(l.facts.map((f) => f.utility)).size > 1;
  const rows = l.facts.map((f) => `<tr>${multi ? `<td>${e(f.utility)}</td>` : ''}<td>${e(f.label)}</td><td>${e(f.value)}</td><td>${e(f.period)}</td><td><a href="${e(f.source_url)}" rel="noopener">${e(f.source_title)}</a></td></tr>`).join('');
  return `<div class="tablewrap"><table><thead><tr>${multi ? '<th>Utility</th>' : ''}<th>Measure</th><th>As published</th><th>Period</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table></div>`;
}

// Who the homeowner deals with. A disclosure, so it reads the same on every site and is marked
// data-boilerplate where it is shown, as Powered Land Co marks its legal disclaimer. Never mark prose that way.
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
  return `${near}<p>${e(l.name)} is one of the cities covered by <a href="${e(hubBase)}/">${e(HUB_BRAND)}</a>. Compare ${e(l.name)}'s published hardness with other cities on <a href="${e(hubBase)}/hard-water-by-city/">hard water by city</a>.</p>`;
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

export function meaningText(l: CityLocation): string {
  if (!l.scale_mgl) return `${utilityName(l)} publishes no hardness figure for ${l.name} that we could find, so a test at the house is the only number to go on. Hardness is the calcium and magnesium that leaves scale on fixtures and inside water heaters.`;
  const [lo, hi] = l.scale_mgl;
  const g = lo === hi ? grains(lo) : `${grains(lo)} to ${grains(hi)}`;
  return `${fig(l.scale_mgl)} is about ${g} grains per gallon. ${positionSentence(l)}`;
}

// System cards ordered and described from the city's own figures and disinfectant.
export function systemCards(l: CityLocation): string {
  const d = localOf(l.slug).disinfectant;
  const c = classLabel(l);
  const soft = l.scale_mgl ? l.scale_mgl[1] <= 60 : false;
  const softener = `<a class="card link" href="/water-softeners/"><strong>Water softener</strong><span>${e(c ? `For hardness; ${l.name} reads as ${c}.` : 'For hardness, once a test shows it.')}</span></a>`;
  const kind = d?.kind === 'chloramine' ? 'chloramine' : d?.kind === 'chlorine' ? 'chlorine' : d ? 'chlorine or chloramine' : 'the disinfectant';
  const filter = `<a class="card link" href="/whole-home-filtration/"><strong>Whole-home filter</strong><span>${e(`For taste and odor from ${kind}${d ? `, which ${utilityName(l)} uses` : ''}.`)}</span></a>`;
  const fl = filtrationOf(l.slug);
  const ro = `<a class="card link" href="/reverse-osmosis/"><strong>Reverse osmosis</strong><span>${e(fl ? `Drinking water at one ${l.name} kitchen tap. Check its certification for lead or PFAS.` : `Drinking water at one ${l.name} kitchen tap.`)}</span></a>`;
  return `<div class="grid three">${soft || fl ? filter + ro + softener : softener + filter + ro}</div>`;
}

export function quoteSteps(l: CityLocation): string[] {
  const zips = (CITY_ZIPS[l.slug] ?? []).length;
  return [
    zips ? `Send a request from one of the ${zips} ${l.name} ZIP codes listed below.` : `Send a request with your ${l.name} address.`,
    l.scale_mgl ? `An assessment at your home, where your tap can be checked against ${utilityName(l)}'s published ${fig(l.scale_mgl)}.` : 'An assessment at your home.',
    'You get a written quote listing what is included.',
    'Installation and service by that company.',
  ];
}

const toc = (l: CityLocation) => `<nav class="toc" aria-label="On this page"><a href="#facts-h">At a glance</a><a href="#water">Local water</a>${filtrationOf(l.slug) ? '<a href="#lead">Lead lines</a><a href="#pfas">PFAS</a>' : ''}<a href="#meaning">What it means</a><a href="#systems">Systems</a><a href="#how">How it works</a><a href="#faq">Questions</a><a href="#request">Request</a></nav>`;

export function cityHomeBody(site: CitySite, l: CityLocation, m: MarketConfig, requestId: string, hubBase: string, form?: Form): string {
  const zips = CITY_ZIPS[l.slug] ?? [];
  const faq = cityFaq(l, m, site.brand);
  const open = isOpen(m);
  const panel = open
    ? inquiryForm({ requestId, market: m, page: '/', brand: site.brand, ...form })
    : `<div class="card" id="request"><h2>Not open yet</h2><p>${e(l.name)} requests are not open yet.</p></div>`;
  return `<div class="grid two"><div>
<h1>Water softeners and filtration in ${e(l.name)}, ${e(l.state)}</h1>
${answerCard(l)}
${keyFactsBlock(l)}
<div class="disclosure" data-boilerplate><strong>Who you are working with.</strong> ${relationship(m)} We are not a water utility.</div>
${toc(l)}
<h2 id="water">What does ${e(utilityName(l))} publish about ${e(l.name)} water?</h2>
<p>${e(l.intro)}</p>
${factsTable(l)}
${l.notes.length ? `<ul>${l.notes.map((n) => `<li>${e(n)}</li>`).join('')}</ul>` : ''}
${areaPageOf(l.slug) ? `<p><a href="/by-area/">${e(areaPageOf(l.slug)!.heading)}</a>: where each one serves, its own figures and how it is treated.</p>` : ''}
${filtrationSection(l)}
<h2 id="meaning">What does ${e(l.scale_mgl ? fig(l.scale_mgl) : 'the published figure')} mean for a ${e(l.name)} home?</h2>
<p>${e(meaningText(l))} (<a href="${USGS_HARDNESS}" rel="noopener">USGS hardness classes</a>)</p>
<h2 id="systems">Which systems fit ${e(l.name)} water?</h2>
${systemCards(l)}
<h2 id="how">How does a ${e(l.name)} quote work?</h2><ol class="steps">${quoteSteps(l).map((x) => `<li>${e(x)}</li>`).join('')}</ol>
<h2 id="faq">Common questions</h2>
<dl class="faq">${faq.map((f) => `<dt>${e(f.q)}</dt><dd>${f.src ? e(f.a).replace(e(` Source: ${f.src.title}.`), ` Source: <a href="${e(f.src.url)}" rel="noopener">${e(f.src.title)}</a>.`) : e(f.a)}</dd>`).join('')}</dl>
${zips.length ? `<h2>Which ZIP codes does this page cover?</h2><p class="small">${zips.map(e).join(', ')}</p>` : ''}
${nearby(l, m, hubBase)}
<p class="small">Machine-readable facts: <a href="/water.json">water.json</a>. Summary for AI assistants: <a href="/llms.txt">llms.txt</a>.</p>
</div><div class="side">${panel}</div></div>
${open ? '<a class="sticky-cta" href="#request">Request a quote</a>' : ''}`;
}

export function cityContactBody(site: CitySite, l: CityLocation, m: MarketConfig): string {
  // No number yet means no phone line at all (Clint, 2026-10-27). The request form is the way in.
  const phone = m.tracking_phone ? `Phone: <a href="tel:${e(m.tracking_phone)}">${e(displayPhone(m.tracking_phone))}</a><br>` : '';
  return `<h1>Contact ${e(fullBrand(site))}</h1>
<p>${phone}Request a quote: <a href="/#request">use the request form</a><br>Email: ${company.public_email ? `<a href="mailto:${e(company.public_email)}">${e(company.public_email)}</a>` : '<em>Email not yet published</em>'}</p>
<p>For a leak or loss of water at a ${e(l.name)} home where a system was installed, call the installing company's service number on your paperwork first. A problem with the water supply itself, such as a main break, goes to ${e(utilityName(l))}.</p>`;
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
    ...Object.values(localOf(l.slug)).filter((d): d is LocalDetail => !!d).map((d) => `- ${d.text} Source: ${d.source_title}, ${d.source_url}`),
    ...(filtrationOf(l.slug) ? [
      `- Lead service lines: ${leadAnswer(l, filtrationOf(l.slug)!)} Source: ${filtrationOf(l.slug)!.lead_lines.map((r) => `${r.source_title}, ${r.source_url}`).join('; ')}`,
      `- PFAS: ${pfasAnswer(l, filtrationOf(l.slug)!.pfas)} Sources: ${UCMR5.title}, ${UCMR5.url}; ${FG.pfas_mcl.source_title}, ${FG.pfas_mcl.source_url}`,
      `- Filters: ${filterAdvice(l, filtrationOf(l.slug)!)} Sources: ${FG.lead_filters.source_url}; ${FG.pfas_filters.source_url}`,
      ...filtrationOf(l.slug)!.notes.map((n) => `- ${n}`),
    ] : []),
    `- Sources last checked: ${l.checked_on}`, '',
    '## Pages',
    `- [${l.name} water and quotes](${base}/): the answer, the sources, common questions`,
    `- [Water data as JSON](${base}/water.json)`,
    ...(areaPageOf(l.slug) ? [`- [${areaPageOf(l.slug)!.heading}](${base}/by-area/): where each area or utility serves, its own figures and treatment`] : []),
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

// /by-area/: one section per utility, zone or source, for cities where the water differs across town.
const link = (d: LocalDetail) => `<a href="${e(d.source_url)}" rel="noopener">${e(d.source_title)}</a>`;
const span = ([lo, hi]: [number, number]) => (lo === hi ? `${lo}` : `${lo} to ${hi}`);

function areaReading(a: Area, publishedGrains: boolean): string {
  if (!a.mgl) return 'No published hardness figure found for this area.';
  const [lo, hi] = a.mgl;
  const cls = classOf(lo) === classOf(hi) ? classOf(lo) : `${classOf(lo)} to ${classOf(hi)}`;
  const g = lo === hi ? grains(lo) : `${grains(lo)} to ${grains(hi)}`;
  const figure = lo === hi ? `The published figure here is ${lo} mg/L` : `Published figures here run from ${lo} to ${hi} mg/L`;
  return a.converted
    ? `About ${span(a.mgl)} mg/L, which is our conversion of the published grains at ${MGL_PER_GRAIN} mg/L per grain. That reads as ${cls} on the USGS scale.`
    : publishedGrains ? `${figure}, which reads as ${cls} on the USGS scale.`
    : `${figure}, about ${g} grains per gallon by our conversion. That reads as ${cls} on the USGS scale.`;
}

const areaFacts = (l: CityLocation, a: Area) => [...l.facts.filter(a.facts), ...(a.figures ?? [])];

function areaSection(l: CityLocation, a: Area, i: number): string {
  const facts = areaFacts(l, a);
  // Sentences rather than the home page's table: the home page owns the table, and the same rows on two
  // pages of one site would compete with each other (same-site rule, scripts/check-duplicate-copy.ts).
  const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
  const rows = facts.map((f) => `<li>${e(f.value)} for ${e(lower(f.label))}, ${e(lower(f.period))}. Source: <a href="${e(f.source_url)}" rel="noopener">${e(f.source_title)}</a>.</li>`).join('');
  return `<section aria-labelledby="area-${i}">
<h2 id="area-${i}">${e(a.name)}</h2>
<p>${e(a.where.text)} Source: ${link(a.where)}.</p>
${facts.length ? `<ul>${rows}</ul>` : ''}
<p>${e(areaReading(a, facts.some((f) => /grains|gpg/i.test(f.value))))}</p>
${a.points.length ? `<ul>${a.points.map((d) => `<li>${e(d.text)} Source: ${link(d)}.</li>`).join('')}</ul>` : ''}
</section>`;
}

// What the areas on this page add up to, from their own figures.
function areaSpan(l: CityLocation, p: AreaPage): string {
  const ms = p.areas.flatMap((a) => a.mgl ?? []);
  if (!ms.length) return `None of these ${l.name} areas has a published hardness figure, so a test at the house is the number to go on.`;
  const lo = Math.min(...ms), hi = Math.max(...ms);
  const span = lo === hi ? `${lo} mg/L` : `${lo} to ${hi} mg/L`;
  const cls = classOf(lo) === classOf(hi) ? `sits in the USGS ${classOf(lo)} class` : `spans USGS classes from ${classOf(lo)} to ${classOf(hi)}`;
  const conv = p.areas.some((a) => a.converted) ? ', with grains figures converted at our stated rate,' : '';
  return `Across the ${p.areas.length} ${l.name} areas above, the figures${conv} run ${span}, which ${cls}. Each is a plant, well or area figure, not a reading at one address.`;
}

export function cityAreaBody(site: CitySite, l: CityLocation, p: AreaPage): string {
  return `<h1>${e(p.heading)}</h1>
<p class="answer">${e(p.intro)}</p>
<h2>Which one serves my home?</h2>
<p>${e(p.how_to_tell)}</p>
${p.areas.map((a, i) => areaSection(l, a, i)).join('\n')}
<p>${e(areaSpan(l, p))} (<a href="${USGS_HARDNESS}" rel="noopener">USGS hardness classes</a>)</p>
<p>See <a href="/">${e(l.name)} water and quotes</a>, or <a href="/#request">request a quote</a>.</p>
<p class="small">Sources last checked ${e(longDate(l.checked_on))}. ${e(site.brand)} is not a water utility.</p>`;
}

export function cityAreaJsonLd(site: CitySite, l: CityLocation, p: AreaPage): object[] {
  const seen = new Map<string, string>();
  for (const a of p.areas) {
    for (const d of [a.where, ...a.points]) if (!seen.has(d.source_url)) seen.set(d.source_url, d.source_title);
    for (const f of areaFacts(l, a)) if (!seen.has(f.source_url)) seen.set(f.source_url, f.source_title);
  }
  return [{ '@context': 'https://schema.org', '@type': 'WebPage', url: `${siteUrl(site)}/by-area/`, name: p.heading, description: p.intro,
    dateModified: l.checked_on, lastReviewed: l.checked_on, isPartOf: { '@type': 'WebSite', name: fullBrand(site), url: `${siteUrl(site)}/` },
    about: { '@type': 'City', name: l.name, containedInPlace: { '@type': 'State', name: l.state } },
    citation: [...seen].map(([url, name]) => ({ '@type': 'CreativeWork', name, url })) }];
}
