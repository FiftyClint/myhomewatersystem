// The two redesign directions on staging (task "Make the water systems sites look premium", 2026-10-29).
// Clint called the live sites cheap, AI-looking and a 2000s wall of text. Both directions keep every
// answer-engine element of the classic pages (the answer card, the at-a-glance facts, the "which system
// fits" answer, every source link, the same FAQ as the FAQPage JSON-LD) and the same request form, but
// show them as short blocks, figures and cards instead of paragraphs.
//   A, "Water report": flat paper and ink, IBM Plex Sans and Mono, one cobalt accent, numbered sections,
//      the figures set large like a lab report. No illustrations; the data is the picture.
//   B, "Neighborhood": white and sand, Figtree, navy with a tangerine call to action, rounded cards,
//      line icons and a drawn house, and the request form in the first screen.
// Fonts are self-hosted static assets (public/fonts, SIL Open Font License), so they cost no Worker requests.
import type { MarketConfig } from '../domain/config.ts';
import { escapeHtml as e } from '../util.ts';
import type { CityLocation } from '../../content/locations.ts';
import { locationsInMarket } from '../../content/locations.ts';
import { GENERAL, localOf } from '../../content/local-details.ts';
import { CONCERN_GENERAL as CG } from '../../content/concerns.ts';
import { areaPageOf } from '../../content/areas.ts';
import { CITY_ZIPS } from '../../content/zips.ts';
import { filtrationOf, FILTRATION_GENERAL as FG, UCMR5, UCMR5_MRL_PPT } from '../../content/filtration.ts';
import { cityHref, HUB_BRAND, siteForSlug, siteUrl } from '../../content/sites.ts';
import { classLabel, classOf, hardnessAnswer, hardnessFacts, longDate, MGL_PER_GRAIN, USGS_HARDNESS } from './water.ts';
import { cityFaq, factsTable, filterAdvice, isOpen, leadAnswer, pfasAnswer, quoteSteps, systemAnswer, utilityNameOf, type Faq } from './city.ts';
import { inquiryForm } from './pages.ts';
import type { Design } from './design.ts';
import company from '../../config/company.json';

type Form = { vals?: Record<string, string | undefined>; errors?: Record<string, string> };

const num = (x: number) => x.toLocaleString('en-US');
const fig = ([lo, hi]: [number, number]) => (lo === hi ? `${lo} mg/L` : `${lo} to ${hi} mg/L`);
const grains = (mgl: number) => (mgl / MGL_PER_GRAIN).toFixed(1);
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const src = (title: string, url: string, label = 'Source') => `<a class="src" href="${e(url)}" rel="noopener" title="${e(title)}">${e(label)}</a>`;

// ---------------------------------------------------------------------------------------------------
// Pictures made from the data: the hardness ruler and the lead line bar.

const SCALE_MAX = 400;
const pct = (v: number) => Math.max(0, Math.min(100, (v / SCALE_MAX) * 100));

// A ruler from 0 to 400 mg/L with the USGS class lines at 60, 120 and 180 and the published span marked.
export function ruler(l: CityLocation, d: Design): string {
  if (!l.scale_mgl) return '';
  const [lo, hi] = l.scale_mgl;
  const left = pct(lo), width = Math.max(1.6, pct(hi) - left);
  const label = lo === hi ? `${lo} mg/L` : `${lo} to ${hi} mg/L`;
  const ticks = [0, 60, 120, 180, 400].map((t) => `<span class="tick" style="left:${pct(t)}%">${t}</span>`).join('');
  return `<figure class="ruler ruler-${d}" aria-label="Published hardness ${e(label)} on the USGS scale, 0 to ${SCALE_MAX} mg/L">
<div class="track"><span class="z z1"></span><span class="z z2"></span><span class="z z3"></span><span class="z z4"></span>
<span class="span" style="left:${left.toFixed(1)}%;width:${width.toFixed(1)}%"></span></div>
<div class="ticks" aria-hidden="true">${ticks}</div>
<div class="zones" aria-hidden="true"><span>Soft</span><span>Moderate</span><span>Hard</span><span>Very hard</span></div>
<figcaption>${e(l.name)}: ${e(label)}${l.scale_converted ? ', converted from grains per gallon' : ''}. USGS classes, mg/L as calcium carbonate.</figcaption></figure>`;
}

function leadBar(l: CityLocation): string {
  const r = filtrationOf(l.slug)?.lead_lines[0];
  if (!r || !r.total) return '';
  const parts = [['lead', r.lead ?? 0, 'Lead'], ['grr', r.grr ?? 0, 'Galvanized, needs replacing'], ['unk', r.unknown ?? 0, 'Unknown']] as const;
  const rest = Math.max(0, r.total - parts.reduce((s, p) => s + p[1], 0));
  const w = (n: number) => `${Math.max(n ? 0.8 : 0, (n / r.total!) * 100).toFixed(1)}%`;
  return `<figure class="leadbar" aria-label="${e(`${r.utility} service lines by material`)}">
<div class="bar">${parts.map(([k, n]) => `<span class="${k}" style="width:${w(n)}"></span>`).join('')}<span class="ok" style="width:${w(rest)}"></span></div>
<ul class="legend">${parts.map(([k, n, t]) => `<li><i class="${k}"></i>${e(t)} <b>${num(n)}</b></li>`).join('')}<li><i class="ok"></i>Other material <b>${num(rest)}</b></li></ul>
<figcaption>Of ${num(r.total)} service lines in the ${e(r.utility)} inventory, ${e(r.period.charAt(0).toLowerCase() + r.period.slice(1))}.</figcaption></figure>`;
}

// ---------------------------------------------------------------------------------------------------
// Icons and the drawn house for B. Plain line drawings, no photos, so nothing pretends to be a real home or crew.

const ICONS: Record<string, string> = {
  softener: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="10" width="13" height="30" rx="6"/><rect x="26" y="18" width="13" height="22" rx="3"/><path d="M15.5 10V5M15.5 5h8"/><path d="M13 22h5M13 28h5"/></svg>',
  filter: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 14h12M32 14h12"/><rect x="16" y="8" width="16" height="32" rx="5"/><path d="M20 18h8M20 24h8M20 30h8"/></svg>',
  ro: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 20h16a6 6 0 0 1 6 6v2"/><path d="M14 20v-6h8v6"/><path d="M32 33c0 2.5-1.8 4.5-4 4.5s-4-2-4-4.5c0-3 4-7.5 4-7.5s4 4.5 4 7.5z"/><path d="M6 42h36"/></svg>',
  test: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M18 6h12M20 6v16L10 38a3 3 0 0 0 2.6 4.5h22.8A3 3 0 0 0 38 38L28 22V6"/><path d="M15 31h18"/></svg>',
  quote: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="10" y="6" width="28" height="36" rx="3"/><path d="M16 16h16M16 23h16M16 30h10"/></svg>',
  pipe: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 16h14a6 6 0 0 1 6 6v20"/><path d="M4 26h8a2 2 0 0 1 2 2v14"/><path d="M30 10h14M30 18h14"/><path d="M30 10v8"/></svg>',
  drop: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M36 28c0 7-5.4 13-12 13s-12-6-12-13C12 19 24 6 24 6s12 13 12 22z"/><path d="M19 30a5 5 0 0 0 5 5"/></svg>',
  well: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 20h28M14 20V8h20v12"/><path d="M12 20v20h24V20"/><path d="M24 12v14"/><path d="M21 26h6v5h-6z"/></svg>',
  home: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M6 22 24 8l18 14"/><path d="M11 19v21h26V19"/><path d="M20 40V28h8v12"/></svg>',
};

const HOUSE = `<svg class="house" viewBox="0 0 360 260" role="img" aria-label="Drawing of a house with water coming in from the street through a treatment system">
<path class="ground" d="M0 228h360"/>
<path class="roof" d="M70 112 180 36l110 76"/><path class="wall" d="M90 100v128h180V100"/>
<rect class="win" x="112" y="128" width="40" height="34" rx="4"/><rect class="door" x="196" y="160" width="40" height="68" rx="4"/>
<path class="pipe" d="M0 244h120v-24"/><rect class="tank" x="110" y="176" width="22" height="44" rx="8"/><rect class="tank2" x="138" y="190" width="20" height="30" rx="4"/>
<path class="pipe" d="M132 186h14v-22h50"/>
<path class="drop" d="M310 44c0 9-6 15-13 15s-13-6-13-15c0-11 13-25 13-25s13 14 13 25z"/>
<path class="drop d2" d="M338 92c0 6-4 10-9 10s-9-4-9-10c0-7 9-17 9-17s9 10 9 17z"/>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// Small pieces shared by the city page and the hub's own city pages.

interface Tile { label: string; big?: string; text: string; link?: { title: string; url: string } }

// The at-a-glance facts as tiles. Same facts as keyFacts() and the JSON-LD, with the headline number pulled out.
export function glanceTiles(l: CityLocation): Tile[] {
  const d = localOf(l.slug);
  const hf = hardnessFacts(l)[0];
  const c = classLabel(l);
  const f = filtrationOf(l.slug);
  const util = [...new Set(l.facts.map((x) => x.utility))];
  const out: Tile[] = [];
  out.push(l.scale_mgl
    ? { label: 'Published hardness', big: fig(l.scale_mgl), text: `About ${l.scale_mgl[0] === l.scale_mgl[1] ? grains(l.scale_mgl[0]) : `${grains(l.scale_mgl[0])} to ${grains(l.scale_mgl[1])}`} grains per gallon${c ? `, ${c} on the USGS scale` : ''}.`, ...(hf ? { link: { title: hf.source_title, url: hf.source_url } } : {}) }
    : { label: 'Published hardness', big: 'Not published', text: `No hardness figure turned up in ${util[0] ?? 'the utility'}'s reports, so a test at the house is the number to use.` });
  if (d.disinfectant) out.push({ label: 'Disinfectant', big: d.disinfectant.kind === 'both' ? 'Chlorine and chloramine' : d.disinfectant.kind === 'varies' ? 'Varies by area' : cap(d.disinfectant.kind),
    text: `Added by ${util.length === 1 ? util[0] : 'the utility'} after treatment.`, link: { title: d.disinfectant.source_title, url: d.disinfectant.source_url } });
  if (f) {
    const r = f.lead_lines[0]!;
    out.push({ label: 'Lead service lines', big: r.lead === null ? 'Not given' : num(r.lead),
      text: `${r.grr === null ? 'Galvanized count not given' : `${num(r.grr)} galvanized need replacing`}, ${r.unknown === null ? 'unknown count not given' : `${num(r.unknown)} unknown`}.`, link: { title: r.source_title, url: r.source_url } });
    const p = f.pfas;
    const hi = [p.pfoa_max_ppt !== null ? `PFOA ${p.pfoa_max_ppt} ppt` : '', p.pfos_max_ppt !== null ? `PFOS ${p.pfos_max_ppt} ppt` : ''].filter(Boolean);
    out.push({ label: 'PFOA and PFOS', big: hi.length ? `Up to ${hi.join(', ')}` : `None at ${UCMR5_MRL_PPT} ppt or more`,
      text: `EPA UCMR 5, ${p.samples} ${p.utility} samples of each, ${p.years}.`, link: UCMR5 });
  }
  if (d.source_water) out.push({ label: 'Source water', text: d.source_water.text, link: { title: d.source_water.source_title, url: d.source_water.source_url } });
  out.push({ label: util.length > 1 ? 'Water utilities' : 'Water utility', big: util.length ? util.join(', ') : 'Not identified yet', text: `Sources checked ${longDate(l.checked_on)}.` });
  return out;
}

function glanceBlock(l: CityLocation): string {
  const tiles = glanceTiles(l).map((t) => `<div class="tile${t.big ? '' : ' wide'}"><dt>${e(t.label)}</dt><dd>${t.big ? `<b>${e(t.big)}</b>` : ''}<span>${e(t.text)}</span>${t.link ? ` <span data-citations>${src(t.link.title, t.link.url)}</span>` : ''}</dd></div>`).join('');
  return `<section class="glance" aria-labelledby="facts-h"><h2 id="facts-h">${e(l.name)}, ${e(l.state)} water at a glance</h2><dl class="tiles">${tiles}</dl></section>`;
}

// The answer card: the question, the answer as published, the class and the ruler. Kept for answer engines.
function answerBlock(l: CityLocation, d: Design): string {
  const f = hardnessFacts(l)[0];
  const c = classLabel(l);
  const head = l.scale_mgl ? (l.scale_mgl[0] === l.scale_mgl[1] ? `${l.scale_mgl[0]}` : `${l.scale_mgl[0]}–${l.scale_mgl[1]}`) : null;
  return `<section class="answer-card" aria-labelledby="answer-h">
<h2 id="answer-h" class="eyebrow">How hard is ${e(l.name)} water?</h2>
${head ? `<p class="figure"><span class="n">${e(head)}</span><span class="u">mg/L</span></p>` : ''}
${c ? `<p class="cls cls-${e(classOf(l.scale_mgl![1]).replace(' ', '-'))}">${e(cap(c))}</p>` : ''}
${ruler(l, d)}
<p class="answer">${e(hardnessAnswer(l))}</p>
<p class="meta">${f ? `${src(f.source_title, f.source_url, f.source_title)} · ` : ''}Checked ${e(longDate(l.checked_on))}</p>
</section>`;
}

function leadPfasBlock(l: CityLocation, d: Design, n: (k: string) => string): string {
  const f = filtrationOf(l.slug);
  if (!f) return '';
  const r = f.lead_lines[0]!;
  const p = f.pfas;
  const none = p.pfoa_max_ppt === null && p.pfos_max_ppt === null;
  const more = f.lead_lines.length > 1 || f.notes.length;
  return `<section class="band" aria-labelledby="lead">${n('Lead and PFAS')}
<div class="pair">
<article class="panel"><h2 id="lead">Does ${e(l.name)} have lead service lines?</h2>
<p class="stat">${r.lead === null ? 'Not given' : num(r.lead)}<small>lead lines listed by ${e(r.utility)}</small></p>
${leadBar(l)}
<p>${e(leadAnswer(l, f))} <span data-citations>${src(r.source_title, r.source_url, r.source_title)}</span></p></article>
<article class="panel"><h2 id="pfas">Has PFAS been found in ${e(l.name)} water?</h2>
<p class="stat${none ? ' good' : ''}">${none ? 'None found' : 'Detected'}<small>${none ? `no PFOA or PFOS at ${UCMR5_MRL_PPT} ppt or more` : 'PFOA or PFOS at or above the reporting level'}</small></p>
<p>${e(pfasAnswer(l, p))} <span data-citations>${src(UCMR5.title, UCMR5.url, UCMR5.title)}; ${src(FG.pfas_mcl.source_title, FG.pfas_mcl.source_url, 'EPA PFAS rule')}</span></p>
<p class="note">${e(filterAdvice(l, f))} <span data-citations>${src(FG.lead_filters.source_title, FG.lead_filters.source_url, 'EPA lead filters')}; ${src(FG.pfas_filters.source_title, FG.pfas_filters.source_url, 'EPA PFAS filters')}</span></p></article>
</div>
${more ? `<details class="more"><summary>Inventory detail and source notes</summary>${f.lead_lines.length > 1 ? `<ul>${f.lead_lines.map((x) => `<li>${e(x.utility)}: ${x.lead === null ? 'lead not given' : `${num(x.lead)} lead`}, ${x.grr === null ? 'galvanized not given' : `${num(x.grr)} galvanized`}, ${x.unknown === null ? 'unknown not given' : `${num(x.unknown)} unknown`} (${e(x.period)}). ${src(x.source_title, x.source_url)}</li>`).join('')}</ul>` : ''}${f.notes.length ? `<ul>${f.notes.map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : ''}</details>` : ''}
</section>`;
}

// ---------------------------------------------------------------------------------------------------
// Design B leads with "How is your water affecting you?" (Clint, 2026-10-29: "the CTA should be more towards,
// how is your water hurting you? and then we answer that question with facts"). Each concern card gives the
// local figure as published, one agency sentence on what it means, the system that addresses it and a link
// that opens the request form with that concern chosen. A concern with no local figure on file is left out,
// never filled with a guess. Below a limit is said plainly.

interface Concern {
  id: string; icon: string; tag: string; q: string; status: string; tone: 'good' | 'warn' | 'info';
  facts: string; means?: string; extra?: string; fix?: { label: string; href: string }; ask: { concern: string; label: string; href?: string };
}

const askHref = (a: Concern['ask']) => a.href ?? `?concern=${a.concern}#request`;

function concernCard(c: Concern): string {
  return `<article class="concern t-${c.tone}" aria-labelledby="${c.id}"><div class="ch"><span class="ic">${ICONS[c.icon]}</span><p class="tag">${e(c.tag)}</p></div>
<h3 id="${c.id}">${e(c.q)}</h3><p class="status">${e(c.status)}</p>
<p>${c.facts}</p>${c.extra ?? ''}${c.means ? `<p class="means">${c.means}</p>` : ''}
<div class="fix">${c.fix ? `<a class="arrow" href="${e(c.fix.href)}">${e(c.fix.label)}</a>` : ''}<a class="ask" href="${e(askHref(c.ask))}">${e(c.ask.label)}</a></div></article>`;
}

const cite = (title: string, url: string, label?: string) => ` <span data-citations>${src(title, url, label)}</span>`;
const disWordOf = (k: string) => (k === 'both' ? 'chlorine and chloramine' : k === 'varies' ? 'a disinfectant that varies by area' : k);

export function cityConcerns(l: CityLocation, g: (p: string) => string): Concern[] {
  const u = utilityNameOf(l);
  const f = filtrationOf(l.slug);
  const dis = localOf(l.slug).disinfectant;
  const out: Concern[] = [];
  if (f) {
    const r = f.lead_lines[0]!;
    const more = f.lead_lines.length > 1 || f.notes.length;
    out.push({ id: 'lead', icon: 'pipe', tag: 'Lead pipes', q: `Does ${l.name} have lead service lines?`,
      status: r.lead === null ? 'Count not given' : r.lead === 0 ? 'No lead lines listed' : `${num(r.lead)} lead lines listed`, tone: r.lead ? 'warn' : 'good',
      facts: `${e(leadAnswer(l, f))}${cite(r.source_title, r.source_url, r.source_title)}`,
      extra: `${leadBar(l)}${more ? `<details class="more"><summary>Inventory detail and source notes</summary>${f.lead_lines.length > 1 ? `<ul>${f.lead_lines.map((x) => `<li>${e(x.utility)}: ${x.lead === null ? 'lead not given' : `${num(x.lead)} lead`}, ${x.grr === null ? 'galvanized not given' : `${num(x.grr)} galvanized`}, ${x.unknown === null ? 'unknown not given' : `${num(x.unknown)} unknown`} (${e(x.period)}). ${src(x.source_title, x.source_url)}</li>`).join('')}</ul>` : ''}${f.notes.length ? `<ul>${f.notes.map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : ''}</details>` : ''}`,
      means: `The count covers all of ${e(l.name)}. What matters is whether your own line is one. For a ${e(l.name)} home on one, EPA points to filters certified to both NSF/ANSI 53 and 42 for lead.${cite(FG.lead_filters.source_title, FG.lead_filters.source_url, 'EPA lead filters')}`,
      fix: { label: `Reverse osmosis for ${l.name} taps`, href: g('/reverse-osmosis/') }, ask: { concern: 'drinking_water', label: 'Ask about lead' } });
    const p = f.pfas;
    const none = p.pfoa_max_ppt === null && p.pfos_max_ppt === null;
    const hi = [p.pfoa_max_ppt !== null ? `PFOA ${p.pfoa_max_ppt} ppt` : '', p.pfos_max_ppt !== null ? `PFOS ${p.pfos_max_ppt} ppt` : ''].filter(Boolean);
    out.push({ id: 'pfas', icon: 'drop', tag: 'PFAS', q: `Has PFAS been found in ${l.name} water?`,
      status: none ? "Below EPA's limit" : `Found, up to ${hi.join(' and ')}`, tone: none ? 'good' : 'warn',
      facts: `${e(pfasAnswer(l, p))}${cite(UCMR5.title, UCMR5.url, UCMR5.title)}`,
      means: none
        ? `Every result for ${e(l.name)} was under 4 ppt, which is below EPA's limit for both.${cite(FG.pfas_mcl.source_title, FG.pfas_mcl.source_url, 'EPA PFAS rule')}`
        : `For PFAS at a ${e(l.name)} tap, EPA points to home filters certified to NSF/ANSI 53 or 58.${cite(FG.pfas_filters.source_title, FG.pfas_filters.source_url, 'EPA PFAS filters')}`,
      fix: { label: `Reverse osmosis for ${l.name} taps`, href: g('/reverse-osmosis/') }, ask: { concern: 'drinking_water', label: 'Ask about PFAS' } });
  }
  if (dis) {
    const gc = GENERAL.chloramine_filters;
    out.push({ id: 'disinfectant', icon: 'filter', tag: 'Taste and smell', q: `What does ${u} add to your water?`,
      status: cap(disWordOf(dis.kind)), tone: 'info',
      facts: `${e(dis.text)}${cite(dis.source_title, dis.source_url)}`,
      means: dis.kind !== 'chlorine' && gc ? `If the taste or smell bothers you, a whole-home filter for ${e(l.name)}'s chloramine needs catalytic carbon, which is made to adsorb it.${cite(gc.source_title, gc.source_url, 'NDSU Extension')}`
        : `If the taste or smell of ${e(u)}'s chlorine bothers you, a whole-home filter is the system that addresses it.`,
      fix: { label: `Whole-home filtration in ${l.name}`, href: g('/whole-home-filtration/') }, ask: { concern: 'taste_odor', label: 'Ask about taste and smell' } });
  }
  const c = classLabel(l);
  const h = CG.hardness_effects;
  out.push({ id: 'hardness', icon: 'softener', tag: 'Scale and hard water', q: `Is hard water a problem in ${l.name}?`,
    status: c ? cap(c) : 'Not published', tone: 'info',
    facts: l.scale_mgl
      ? `${e(u)} reports ${e(fig(l.scale_mgl))}, about ${l.scale_mgl[0] === l.scale_mgl[1] ? grains(l.scale_mgl[0]) : `${grains(l.scale_mgl[0])} to ${grains(l.scale_mgl[1])}`} grains per gallon. <a href="#answer-h">See where ${e(l.name)} falls on the scale</a>.`
      : `${e(u)} publishes no hardness figure we could find, so a test at your ${e(l.name)} tap is the number to use.`,
    means: `${e(h.text)}${cite(h.source_title, h.source_url, 'USGS')}`,
    fix: { label: `Water softeners in ${l.name}`, href: g('/water-softeners/') }, ask: { concern: 'hardness', label: 'Ask about hard water' } });
  return out;
}

function concernsBlock(l: CityLocation, hubBase: string, onHub: boolean): string {
  const g = (p: string) => (onHub ? p : `${hubBase}${p}`);
  const cs = cityConcerns(l, g);
  const u = utilityNameOf(l);
  return `<section class="band concerns" aria-labelledby="concerns-h">
<h2 id="concerns-h">What is in ${e(l.name)} water, and does it matter for you?</h2>
<p class="lead-in">${cs.length === 4 ? 'Four' : cs.length === 2 ? 'Two' : String(cs.length)} things ${e(l.name)} homeowners ask about, each answered from ${e(u)}, EPA or USGS with a link to the source.</p>
<div class="cgrid">${cs.map(concernCard).join('')}</div>
<div class="other"><div><h3>Noticing something else in your ${e(l.name)} water?</h3><p>Stains, spots, a smell or a taste can start in the house as well as at ${e(u)}. The home assessment is where your own tap gets checked.</p></div><a class="btn" href="?concern=not_sure#request">Test my water</a></div>
</section>`;
}

// System cards, ordered from the city's own facts: filter first where hardness is low or lead and PFAS matter.
function systemsBlock(l: CityLocation, d: Design, n: (k: string) => string, hubBase: string, onHub: boolean): string {
  const dis = localOf(l.slug).disinfectant;
  const c = classLabel(l);
  const soft = l.scale_mgl ? l.scale_mgl[1] <= 60 : false;
  const fl = filtrationOf(l.slug);
  const kind = dis?.kind === 'chloramine' ? 'chloramine' : dis?.kind === 'chlorine' ? 'chlorine' : dis ? 'chlorine or chloramine' : 'the disinfectant';
  const g = (p: string) => (onHub ? p : `${hubBase}${p}`);
  const card = (icon: string, title: string, why: string, href: string) =>
    `<a class="sys" href="${e(href)}">${d === 'b' ? `<span class="ic">${ICONS[icon]}</span>` : ''}<strong>${e(title)}</strong><span>${e(why)}</span><em>How it works</em></a>`;
  const softener = card('softener', 'Water softener', c ? `Treats hardness. ${l.name} reads as ${c}.` : `Treats hardness, once a test of your ${l.name} tap shows it.`, g('/water-softeners/'));
  const filter = card('filter', 'Whole-home filter', `Taste and odor from ${dis ? `${utilityNameOf(l)}'s ${kind}` : `the disinfectant ${utilityNameOf(l)} adds`}${dis?.kind === 'chloramine' || dis?.kind === 'both' || dis?.kind === 'varies' ? '. Look for catalytic carbon.' : '.'}`, g('/whole-home-filtration/'));
  const ro = card('ro', 'Reverse osmosis', fl ? `Drinking water at a ${l.name} kitchen tap. Check its lead or PFAS certification.` : `Drinking water at one ${l.name} kitchen tap.`, g('/reverse-osmosis/'));
  return `<section class="band" aria-labelledby="systems">${n('Systems')}
<h2 id="systems">Which water treatment system fits a ${e(l.name)} home?</h2>
<p class="lead-in">${e(systemAnswer(l))}</p>
<div class="cards3">${soft || fl ? filter + ro + softener : softener + filter + ro}</div>
</section>`;
}

function stepsBlock(l: CityLocation, d: Design, n: (k: string) => string): string {
  const icons = ['home', 'test', 'quote', 'softener'];
  const titles = ['Send a request', 'Home assessment', 'Written quote', 'Install and service'];
  return `<section class="band" aria-labelledby="how">${n('How it works')}
<h2 id="how">How does a ${e(l.name)} quote work?</h2>
<ol class="steps4">${quoteSteps(l).map((x, i) => `<li>${d === 'b' ? `<span class="ic">${ICONS[icons[i]!]}</span>` : `<span class="k">${String(i + 1).padStart(2, '0')}</span>`}<strong>${titles[i]}</strong><span>${e(x)}</span></li>`).join('')}</ol>
<p class="small">Booking a ${e(l.name)} assessment is not a purchase, and a request commits you to nothing.</p>
</section>`;
}

function faqBlock(faq: Faq[], n: (k: string) => string): string {
  const a = (f: Faq) => (f.src ? e(f.a).replace(e(` Source: ${f.src.title}.`), ` Source: <a href="${e(f.src.url)}" rel="noopener">${e(f.src.title)}</a>.`) : e(f.a));
  return `<section class="band" aria-labelledby="faq">${n('Questions')}
<h2 id="faq">Common questions</h2>
<div class="faq">${faq.map((f) => `<details><summary>${e(f.q)}</summary><p>${a(f)}</p></details>`).join('')}</div>
</section>`;
}

function waterBlock(l: CityLocation, n: (k: string) => string): string {
  const u = utilityNameOf(l);
  return `<section class="band" aria-labelledby="water">${n('Hardness')}
<h2 id="water">What does ${e(u)} publish about ${e(l.name)} water?</h2>
<p class="lead-in">${e(l.intro)}</p>
${factsTable(l)}
${l.notes.length ? `<ul class="notes">${l.notes.map((x) => `<li>${e(x)}</li>`).join('')}</ul>` : ''}
${areaPageOf(l.slug) ? `<p><a class="arrow" href="/by-area/">${e(areaPageOf(l.slug)!.heading)}</a></p>` : ''}
<p class="small" id="meaning">${l.scale_mgl ? `${e(fig(l.scale_mgl))} is about ${l.scale_mgl[0] === l.scale_mgl[1] ? grains(l.scale_mgl[0]) : `${grains(l.scale_mgl[0])} to ${grains(l.scale_mgl[1])}`} grains per gallon at ${MGL_PER_GRAIN} mg/L per grain. ` : ''}<a href="${USGS_HARDNESS}" rel="noopener">USGS hardness classes</a></p>
</section>`;
}

function coverageBlock(l: CityLocation, m: MarketConfig, hubBase: string, onHub: boolean): string {
  const zips = CITY_ZIPS[l.slug] ?? [];
  const others = locationsInMarket(m.id).filter((x) => x.slug !== l.slug);
  const link = (x: CityLocation) => { const s = siteForSlug(x.slug); return `<a href="${e(s ? `${siteUrl(s)}/` : `${onHub ? '' : hubBase}/locations/${x.slug}/`)}">${e(x.name)}</a>`; };
  return `<section class="band coverage">
${others.length ? `<p><strong>Nearby:</strong> ${others.map(link).join(', ')}</p>` : ''}
${zips.length ? `<details class="more"><summary>${zips.length} ${e(l.name)} ZIP codes this page covers</summary><p class="zips">${zips.map(e).join(' ')}</p></details>` : ''}
<p class="small">${e(l.name)} is one of the cities on <a href="${onHub ? '/' : `${e(hubBase)}/`}">${e(HUB_BRAND)}</a>. Compare it on <a href="${onHub ? '' : e(hubBase)}/hard-water-by-city/">hard water by city</a>.${onHub ? '' : ' Data: <a href="/water.json">water.json</a>, <a href="/llms.txt">llms.txt</a>.'}</p>
</section>`;
}

function relationship(m: MarketConfig): string {
  return m.business_mode === 'dealer_partner' && m.seller_display_name
    ? `We connect homeowners with ${e(m.seller_display_name)}, which provides your estimate, contract, installation and ongoing service.`
    : 'We are lining up one local company to serve this area. The request form names that company before you submit.';
}

function requestBlock(m: MarketConfig, l: CityLocation, form: string, d: Design): string {
  const open = isOpen(m);
  const panel = open ? form : `<div class="panel" id="request"><h2>Not open yet</h2><p>${e(l.name)} requests are not open yet.</p></div>`;
  const disclosure = `<div class="disclosure" data-boilerplate><strong>Who you are working with.</strong> ${relationship(m)} We are not a water utility.</div>`;
  if (d === 'b') return `<div class="formcard">${panel}${disclosure}</div>`;
  return `<section class="band request" aria-label="Request a quote"><div class="req-copy"><p class="kicker">Request</p><p class="req-h">One written quote for your ${e(l.name)} home, from one local company.</p>
<ul class="ticks-list"><li>A test of your own tap before any recommendation</li><li>A written quote that lists what is included</li><li>Your details go to one company only, and only after you agree</li></ul>${disclosure}</div><div class="req-form">${panel}</div></section>`;
}

function heroCopy(l: CityLocation, m: MarketConfig): { lede: string; kicker: string } {
  const u = utilityNameOf(l);
  const dis = localOf(l.slug).disinfectant;
  const disWord = dis ? (dis.kind === 'both' ? 'chlorine and chloramine' : dis.kind === 'varies' ? 'a disinfectant that varies by area' : dis.kind) : null;
  const lede = l.scale_mgl
    ? `${u} reports ${fig(l.scale_mgl)} of hardness${disWord ? ` and treats with ${disWord}` : ''}. Here is what that means for a ${l.name} home, and how to get one written quote.`
    : `${u} publishes no hardness figure we could find for ${l.name}. Here is what is published, and how to get your own tap tested and quoted.`;
  return { lede, kicker: `${l.name}, ${l.state}` };
}

// The city page in A or B. onHub: a hub page for a city with no site of its own (/locations/<slug>/).
export function cityPageV2(l: CityLocation, m: MarketConfig, requestId: string, hubBase: string, d: Design, o: { brand: string; page: string; onHub: boolean; crumbs?: string; form?: Form }): string {
  const faq = cityFaq(l, m, o.brand);
  const open = isOpen(m);
  const form = inquiryForm({ requestId, market: m, page: o.page, brand: o.onHub ? undefined : o.brand, ...o.form });
  let i = 0;
  const n = (k: string) => (d === 'a' ? `<p class="sec"><span>${String(++i).padStart(2, '0')}</span>${e(k)}</p>` : '');
  const { lede, kicker } = heroCopy(l, m);
  const h1 = `<h1>Water softeners and filtration in ${e(l.name)}, ${e(l.state)}</h1>`;
  const ctas = open ? '<div class="ctas"><a class="btn" href="#request">Get a written quote</a><a class="btn ghost" href="#facts-h">See the water facts</a></div>' : '<div class="ctas"><a class="btn ghost" href="#facts-h">See the water facts</a></div>';
  const body = [
    waterBlock(l, n), leadPfasBlock(l, d, n), systemsBlock(l, d, n, hubBase, o.onHub), stepsBlock(l, d, n), faqBlock(faq, n),
  ].join('\n');
  if (d === 'b') {
    const u = utilityNameOf(l);
    const cs = cityConcerns(l, (p) => (o.onHub ? p : `${hubBase}${p}`));
    const dis = localOf(l.slug).disinfectant;
    const names = cs.map((c) => (c.id === 'lead' ? 'lead pipes' : c.id === 'pfas' ? 'PFAS' : c.id === 'disinfectant' && dis ? `the ${disWordOf(dis.kind)} ${u} adds` : 'hardness'));
    const ledeB = `Here is what the published sources say about ${names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}` : names[0]} in ${l.name}, what each means for your home, and which system addresses it.`;
    const quick = `<ul class="quick">${cs.map((c) => `<li class="t-${c.tone}"><a href="#${c.id}"><span>${e(c.tag)}</span><b>${e(c.status)}</b></a></li>`).join('')}</ul>`;
    const ctasB = `<div class="ctas">${open ? '<a class="btn" href="#request">Test my water and get a quote</a>' : ''}<a class="btn ghost" href="#concerns-h">See what we found</a></div>`;
    return `<section class="hero"><div class="hero-copy">${o.crumbs ?? ''}<p class="kicker">Water softeners and filtration in ${e(l.name)}, ${e(l.state)}</p><h1>How is ${e(l.name)} water affecting you?</h1><p class="lede">${e(ledeB)}</p>${quick}${ctasB}
<ul class="trust"><li>${ICONS.test}Figures from ${e(u)}, EPA and USGS, each linked</li><li>${ICONS.quote}Written quote, no obligation</li><li>${ICONS.home}One local company, named before you send</li></ul>
${HOUSE}</div>${requestBlock(m, l, form, d)}</section>
${concernsBlock(l, hubBase, o.onHub)}
<div class="sheet">${answerBlock(l, d)}${glanceBlock(l)}</div>
${[waterBlock(l, n), systemsBlock(l, d, n, hubBase, o.onHub), stepsBlock(l, d, n), faqBlock(faq, n)].join('\n')}
${coverageBlock(l, m, hubBase, o.onHub)}
${open ? '<a class="sticky-cta" href="#request">Test my water</a>' : ''}`;
  }
  return `<section class="hero"><div class="hero-copy">${o.crumbs ?? ''}<p class="kicker">${e(kicker)}</p>${h1}<p class="lede">${e(lede)}</p>${ctas}</div>${answerBlock(l, d)}</section>
${glanceBlock(l)}
${body}
${requestBlock(m, l, form, d)}
${coverageBlock(l, m, hubBase, o.onHub)}
${open ? '<a class="sticky-cta" href="#request">Get a written quote</a>' : ''}`;
}

// ---------------------------------------------------------------------------------------------------
// Hub home in A or B.

type Lists = { withF: CityLocation[]; found: CityLocation[]; maxLead: CityLocation | undefined };
function filtrationLists(ls: CityLocation[]): Lists {
  const withF = ls.filter((l) => filtrationOf(l.slug));
  const found = withF.filter((l) => { const p = filtrationOf(l.slug)!.pfas; return p.pfoa_max_ppt !== null || p.pfos_max_ppt !== null; });
  const maxLead = [...withF].sort((a, b) => (filtrationOf(b.slug)!.lead_lines[0]!.lead ?? 0) - (filtrationOf(a.slug)!.lead_lines[0]!.lead ?? 0))[0];
  return { withF, found, maxLead };
}

// The hub's concern cards. The hub serves a homeowner anywhere, so each card answers from EPA or USGS
// first and uses a city on file only as an example, never as a count that reads like coverage. Private
// wells, which no utility tests, get their own card. General statements are in content/concerns.ts.
function hubConcerns(ls: CityLocation[], withFig: CityLocation[], li: Lists): Concern[] {
  const and = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
  const chlor = ls.find((l) => l.slug === 'denver' && localOf(l.slug).disinfectant?.kind === 'chloramine') ?? ls.find((l) => localOf(l.slug).disinfectant?.kind === 'chloramine' && !localOf(l.slug).disinfectant!.text.startsWith('The '));
  const gc = GENERAL.chloramine_filters;
  const zipAsk = { concern: '', label: 'Check my water', href: '#request' };
  const cs: Concern[] = [];
  const lead = li.maxLead && filtrationOf(li.maxLead.slug)!.lead_lines[0]!;
  cs.push({ id: 'lead', icon: 'pipe', tag: 'Lead pipes', q: 'Does your home have a lead service line?', status: 'Your utility had to list them', tone: 'warn',
    facts: `${e(CG.check_lead.text)}${cite(CG.check_lead.source_title, CG.check_lead.source_url)}${lead ? ` ${e(lead.utility)} lists ${num(lead.lead ?? 0)} lead lines in ${e(li.maxLead!.name)}, the largest count we have read so far.${cite(lead.source_title, lead.source_url)}` : ''}`,
    means: `${e(FG.lead_filters.text)}${cite(FG.lead_filters.source_title, FG.lead_filters.source_url, 'EPA lead filters')}`,
    fix: { label: 'Reverse osmosis', href: '/reverse-osmosis/' }, ask: zipAsk });
  cs.push({ id: 'pfas', icon: 'drop', tag: 'PFAS', q: 'Has PFAS been found in your water?', status: 'EPA tested 2023 to 2025', tone: 'info',
    facts: `${e(CG.check_pfas.text)}${cite(CG.check_pfas.source_title, CG.check_pfas.source_url)}${li.found.length ? ` Cities whose results we have read with PFOA or PFOS at or above ${UCMR5_MRL_PPT} ppt include ${e(and(li.found.map((l) => l.name)))}.${cite(UCMR5.title, UCMR5.url, UCMR5.title)}` : ''}`,
    means: `${e(FG.pfas_mcl.text)}${cite(FG.pfas_mcl.source_title, FG.pfas_mcl.source_url, 'EPA PFAS rule')}`,
    fix: { label: 'Reverse osmosis', href: '/reverse-osmosis/' }, ask: zipAsk });
  const cd = chlor && localOf(chlor.slug).disinfectant!;
  cs.push({ id: 'disinfectant', icon: 'filter', tag: 'Taste and smell', q: 'What does your utility add to the water?', status: 'Chlorine or chloramine', tone: 'info',
    facts: `Every utility we have read so far adds chlorine, chloramine or both after treatment, and its own reports name which.${cd ? ` Here is one example from ${e(chlor!.name)}. ${e(cd.text)}${cite(cd.source_title, cd.source_url)}` : ''}`,
    means: gc ? `${e(gc.text)}${cite(gc.source_title, gc.source_url, 'NDSU Extension')}` : undefined,
    fix: { label: 'Whole-home filtration', href: '/whole-home-filtration/' }, ask: zipAsk });
  const hardest = [...withFig].sort((a, b) => b.scale_mgl![1] - a.scale_mgl![1])[0];
  cs.push({ id: 'hardness', icon: 'softener', tag: 'Scale and hard water', q: 'How hard is your water?', status: 'A nuisance, not a health issue', tone: 'info',
    facts: `${e(CG.hardness_effects.text)}${cite(CG.hardness_effects.source_title, CG.hardness_effects.source_url, 'USGS')}${hardest ? ` The hardest we have read so far is ${e(hardest.name)}, where the published range tops out at ${num(hardest.scale_mgl![1])} mg/L. <a href="#top-h">See the hardest we have found</a>.` : ''}`,
    fix: { label: 'Water softeners', href: '/water-softeners/' }, ask: zipAsk });
  return cs;
}

function hubConcernsBlock(cs: Concern[]): string {
  const w = CG;
  const well = `<article class="concern wide t-warn" aria-labelledby="wellwater"><div class="ch"><span class="ic">${ICONS.well}</span><p class="tag">Private wells</p></div>
<h3 id="wellwater">On a private well, who tests your water?</h3><p class="status">You do</p>
<p>${e(w.well_testing.text)}${cite(w.well_testing.source_title, w.well_testing.source_url)}</p>
<ul class="wl"><li><strong>Bacteria</strong><span>${e(w.well_bacteria.text)}${cite(w.well_bacteria.source_title, w.well_bacteria.source_url)}</span></li>
<li><strong>Nitrate</strong><span>${e(w.well_nitrate.text)}${cite(w.well_nitrate.source_title, w.well_nitrate.source_url)}</span></li>
<li><strong>Iron</strong><span>${e(w.iron.text)}${cite(w.iron.source_title, w.iron.source_url)}</span></li></ul>
<div class="fix"><a class="ask" href="#request">Get my well water tested</a></div></article>`;
  return `<section class="band concerns" aria-labelledby="concerns-h">
<h2 id="concerns-h">What could be in your water?</h2>
<p class="lead-in">The questions homeowners ask most, answered from EPA, USGS and the utilities' own reports. A city named in a card is an example, and your own utility's report has your figures.</p>
<div class="cgrid">${cs.map(concernCard).join('')}${well}</div>
</section>`;
}

// How a homeowner anywhere checks their own water, for the hub and for a ZIP or city we have no page for.
export function checkOwnWaterBlock(): string {
  const w = CG;
  return `<section class="band" aria-labelledby="check-h">
<h2 id="check-h">How do you check your own water?</h2>
<ol class="steps4 check"><li><span class="ic">${ICONS.test}</span><strong>Read your utility's annual report</strong><span>${e(w.check_report.text)}${cite(w.check_report.source_title, w.check_report.source_url)}</span></li>
<li><span class="ic">${ICONS.pipe}</span><strong>Ask for the service line inventory</strong><span>Ask your utility whether the line to your address is listed as lead, galvanized or unknown.${cite(w.check_lead.source_title, w.check_lead.source_url)}</span></li>
<li><span class="ic">${ICONS.drop}</span><strong>Look up PFAS results</strong><span>Search your water system by name in EPA's UCMR 5 Data Finder.${cite(w.check_pfas.source_title, w.check_pfas.source_url)}</span></li>
<li><span class="ic">${ICONS.well}</span><strong>Test a private well yourself</strong><span>No utility tests a private well, so EPA tells owners to test it every year.${cite(w.well_testing.source_title, w.well_testing.source_url)}</span></li></ol>
</section>`;
}

// /check when the ZIP or city has no page here: say so plainly, then how to check it anyway.
export function checkNotOnFileV2(q: string, isZip: boolean): string {
  const what = isZip ? `ZIP code ${e(q)}` : e(q);
  return `<section class="hero"><div class="hero-copy"><p class="kicker">Your water has a published answer wherever you live</p>
<h1>We do not have a page for ${what} yet</h1>
<p class="lede">The steps below show where to find it, and they work in any U.S. city or on a private well. We did not store what you typed.</p>
<div class="ctas"><a class="btn" href="#check-h">How to check your water</a><a class="btn ghost" href="/">Back to the questions</a></div></div>${HOUSE}</section>
${checkOwnWaterBlock()}
<section class="band"><p class="small">A local company can only test your tap and quote a system where one is set up. <a href="/service-areas/">See where we take requests today</a>.</p></section>`;
}

export function hubHomeV2(ls: CityLocation[], markets: MarketConfig[], d: Design): string {
  const withFig = ls.filter((l) => l.scale_mgl);
  const veryHard = withFig.filter((l) => classOf(l.scale_mgl![1]) === 'very hard');
  const checked = ls.map((l) => l.checked_on).sort().at(-1) ?? '';
  const live = markets.filter(isOpen);
  const top = [...withFig].sort((a, b) => b.scale_mgl![1] - a.scale_mgl![1]).slice(0, 8);
  const bar = (l: CityLocation) => {
    const [lo, hi] = l.scale_mgl!;
    return `<li><a href="${e(cityHref(l.slug))}">${e(l.name)}, ${e(l.state)}</a><span class="hbar"><span class="z${'shmv'.indexOf(classOf(hi)[0]!) + 1}" style="left:${pct(lo).toFixed(1)}%;width:${Math.max(1.6, pct(hi) - pct(lo)).toFixed(1)}%"></span></span><b>${e(fig([lo, hi]))}</b></li>`;
  };
  const states = [...new Set(ls.map((l) => l.state))];
  const chip = (l: CityLocation) => {
    const c = l.scale_mgl ? classOf(l.scale_mgl[1]) : null;
    return `<a class="chip" href="${e(cityHref(l.slug))}"><i class="${c ? `dot-${c.replace(' ', '-')}` : 'dot-none'}"></i>${e(l.name)}</a>`;
  };
  const zip = `<form class="zipform" method="get" action="/check" id="request" data-boilerplate><label for="zip">Your ZIP code</label><div class="zrow"><input type="text" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5" placeholder="e.g. 64111"><button type="submit">Check my water</button></div><p class="small">We use it only to find your city's page and whether a local company serves it.</p></form>`;
  const stats = `<div class="stats"><div><b>${ls.length}</b><span>cities covered</span></div><div><b>${withFig.length}</b><span>with a published hardness number</span></div><div><b>${veryHard.length}</b><span>very hard at the top of their range</span></div></div>`;
  const legend = '<p class="legend-row"><span><i class="dot-soft"></i>Soft</span><span><i class="dot-moderately-hard"></i>Moderately hard</span><span><i class="dot-hard"></i>Hard</span><span><i class="dot-very-hard"></i>Very hard</span><span><i class="dot-none"></i>No figure</span></p>';
  const sys = (icon: string, t: string, s: string, href: string) => `<a class="sys" href="${href}">${d === 'b' ? `<span class="ic">${ICONS[icon]}</span>` : ''}<strong>${t}</strong><span>${s}</span><em>How it works</em></a>`;
  let i = 0;
  const n = (k: string) => (d === 'a' ? `<p class="sec"><span>${String(++i).padStart(2, '0')}</span>${e(k)}</p>` : '');
  const lists = filtrationLists(ls);
  const heroA = `<section class="hero hub-hero"><div class="hero-copy"><p class="kicker">Water hardness by city, from the utilities' own reports</p>
<h1>How hard is your water? Published hardness for ${ls.length} U.S. cities</h1>
<p class="lede">Every figure is copied from the city's water utility with its date and a link to the report. Read yours, then get one written quote from one local company.</p>
${stats}</div><div class="hero-side">${zip}</div></section>`;
  const hcs = hubConcerns(ls, withFig, lists);
  const quickB = `<ul class="quick">${hcs.map((c) => `<li class="t-${c.tone}"><a href="#${c.id}"><span>${e(c.tag)}</span><b>${e(c.status)}</b></a></li>`).join('')}<li class="t-warn"><a href="#wellwater"><span>Private wells</span><b>You test it yourself</b></a></li></ul>`;
  const zipB = `<form class="zipform" method="get" action="/check" id="request" data-boilerplate><label for="zip">Your ZIP code or city</label><div class="zrow"><input type="text" id="zip" name="zip" autocomplete="postal-code" maxlength="60" placeholder="ZIP code or city"><button type="submit">Check my water</button></div><p class="small">Any U.S. ZIP code or city works. We use it only to show what is published for your water and whether a local company serves you.</p></form>`;
  const heroB = `<section class="hero hub-hero"><div class="hero-copy"><p class="kicker">Every answer here comes from EPA, USGS or a utility's own report</p>
<h1>How is your water affecting you?</h1>
<p class="lede">Lead pipes, PFAS, chlorine taste, hard water and private wells each have a published answer. Enter your ZIP code or city to see what is known about your water and how to check it, then get one written quote from a local company.</p>
${zipB}${quickB}</div>${HOUSE}</section>
${hubConcernsBlock(hcs)}
${checkOwnWaterBlock()}`;
  const hero = d === 'b' ? heroB : heroA;
  return `${hero}
<section class="band" aria-labelledby="top-h">${n('Hardest water')}
<h2 id="top-h">Where is the water hardest?</h2>
<p class="lead-in">${d === 'b' ? `These are examples from the utilities we have read so far, each bar showing the top of the city's published range on the USGS scale from 0 to ${SCALE_MAX} mg/L.` : `The top of each city's published range, on the USGS scale from 0 to ${SCALE_MAX} mg/L.`} Checked ${e(longDate(checked))}.</p>
<ol class="hbars">${top.map(bar).join('')}</ol>
<p><a class="arrow" href="/hard-water-by-city/">Every city, utility, period and source</a></p>
</section>
<section class="band" aria-labelledby="cities-h">${n('Find your city')}
<h2 id="cities-h">${d === 'b' ? 'Cities with their own page' : 'Find your city'}</h2>${d === 'b' ? '<p class="lead-in">Not listed? Enter your ZIP code or city above, or follow <a href="#check-h">how to check your own water</a>.</p>' : ''}${legend}
<div class="states">${states.map((st) => `<div class="state"><h3>${e(st)}</h3><div class="chips">${ls.filter((l) => l.state === st).map(chip).join('')}</div></div>`).join('')}</div>
</section>
<section class="band" aria-labelledby="sys-h">${n('Systems')}
<h2 id="sys-h">What should I compare?</h2>
<div class="cards3">${sys('softener', 'Water softener', 'For scale and hard water.', '/water-softeners/')}${sys('filter', 'Whole-home filter', 'For chlorine or chloramine taste and odor.', '/whole-home-filtration/')}${sys('ro', 'Reverse osmosis', 'For drinking water at one tap.', '/reverse-osmosis/')}</div>
${d === 'b' ? `<p class="small">On a private well, the system follows what your test shows. <a href="#wellwater">What EPA says to test for</a>.</p>` : ''}
</section>
<section class="band" aria-labelledby="how-h">${n('How it works')}
<h2 id="how-h">How does it work?</h2>
<ol class="steps4"><li>${d === 'b' ? `<span class="ic">${ICONS.home}</span>` : '<span class="k">01</span>'}<strong>Check your ZIP</strong><span>Find your city's page and its published figures.</span></li><li>${d === 'b' ? `<span class="ic">${ICONS.quote}</span>` : '<span class="k">02</span>'}<strong>Send one request</strong><span>It goes to the one local company named for your area.</span></li><li>${d === 'b' ? `<span class="ic">${ICONS.test}</span>` : '<span class="k">03</span>'}<strong>Home assessment</strong><span>Your own tap gets tested before anything is recommended.</span></li><li>${d === 'b' ? `<span class="ic">${ICONS.softener}</span>` : '<span class="k">04</span>'}<strong>Written quote</strong><span>Booking is not a purchase.</span></li></ol>
${live.length ? `<details class="more"><summary>Taking requests in ${live.length} areas</summary><p>${live.map((m) => e(m.name)).join(', ')}.</p></details>` : ''}
<p class="small">Classes follow the <a href="${USGS_HARDNESS}" rel="noopener">U.S. Geological Survey</a>. Data: <a href="/data/cities.json">cities.json</a>, <a href="/llms.txt">llms.txt</a>. We are not a water utility.</p>
</section>`;
}

// ---------------------------------------------------------------------------------------------------
// The page shell for A and B: header, footer and the styles.

export interface ShellOpts {
  title: string; description: string; canonical: string; noindex?: boolean; banner?: string | null;
  brand: string; city: boolean; phone: string | null; phoneDisplay: string | null; jsonLd: string; alternates: string; body: string; open: boolean;
}

const MARK_A = '<svg class="mark" viewBox="0 0 24 24" aria-hidden="true"><rect width="24" height="24" rx="4"/><path d="M12 5c3 4 5 6.6 5 9.2A5 5 0 0 1 12 19a5 5 0 0 1-5-4.8C7 11.6 9 9 12 5z"/></svg>';
const MARK_B = '<svg class="mark" viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="14"/><path d="M5 15c3-2.5 6 2.5 9 0s6 2.5 9 0M5 20c3-2.5 6 2.5 9 0s6 2.5 9 0"/></svg>';

export function shellV2(o: ShellOpts, d: Design): string {
  const nav = o.city
    ? '<a href="/water-softeners/">Softeners</a><a href="/whole-home-filtration/">Filtration</a><a href="/how-it-works/">How it works</a><a href="/contact/">Contact</a>'
    : '<a href="/hard-water-by-city/">Hard water by city</a><a href="/water-softeners/">Systems</a><a href="/how-it-works/">How it works</a><a href="/contact/">Contact</a>';
  const phone = o.phone ? `<a class="phone" href="tel:${e(o.phone)}">${e(o.phoneDisplay ?? o.phone)}</a>` : '';
  const foot = o.city
    ? `<p class="fl"><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/communication-preferences/">Communication preferences</a></p>
<p>${e(o.brand)} is run by My Home Water System, operated by Aidren LLC. Not a water utility.</p>`
    : `<p class="fl"><a href="/about/">About</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/communication-preferences/">Communication preferences</a><a href="/for-dealers/">For dealers</a></p>
<p>My Home Water System helps homeowners request water treatment quotes. The company that performs your installation is named on each service-area page and on the request form before you submit. We are not a water utility; water figures are copied from utility reports with their sources.</p>`;
  return `<!doctype html><html lang="en" class="d-${d}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(o.title)}</title><meta name="description" content="${e(o.description)}">
<link rel="canonical" href="${e(o.canonical)}">${o.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="max-snippet:-1, max-image-preview:large">'}
<meta property="og:type" content="website"><meta property="og:site_name" content="${e(o.brand)}"><meta property="og:title" content="${e(o.title)}">
<meta property="og:description" content="${e(o.description)}"><meta property="og:url" content="${e(o.canonical)}"><meta name="theme-color" content="${d === 'a' ? '#f6f5f1' : '#13253d'}">
<link rel="icon" href="data:,">
${d === 'a' ? '<link rel="preload" href="/fonts/ibm-plex-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>' : '<link rel="preload" href="/fonts/figtree-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>'}
${o.alternates}
${o.jsonLd}<style>${d === 'a' ? CSS_A : CSS_B}</style></head><body>
${o.banner ? `<div class="banner" role="note"><div class="wrap">${o.banner}</div></div>` : ''}
<header class="site"><div class="wrap"><a class="brand" href="/">${d === 'a' ? MARK_A : MARK_B}<span>${e(o.brand)}${o.city ? ' <span class="by">by My Home Water System</span>' : ''}</span></a>
<nav aria-label="Main">${nav}${phone}${o.open ? '<a class="navcta" href="#request">Get a quote</a>' : ''}</nav></div></header>
<main><div class="wrap">${o.body}</div></main>
<footer><div class="wrap">
${foot}
</div></footer></body></html>`;
}

export const contactEmail = company.public_email;

// ---------------------------------------------------------------------------------------------------
// Styles. Each set also covers the classes the guide, legal and table pages already use.

const FONT_A = `@font-face{font-family:Plex;src:url(/fonts/ibm-plex-sans-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:Plex;src:url(/fonts/ibm-plex-sans-latin-600-normal.woff2) format("woff2");font-weight:600;font-display:swap}
@font-face{font-family:Plex;src:url(/fonts/ibm-plex-sans-latin-700-normal.woff2) format("woff2");font-weight:700;font-display:swap}
@font-face{font-family:PlexMono;src:url(/fonts/ibm-plex-mono-latin-400-normal.woff2) format("woff2");font-weight:400;font-display:swap}
@font-face{font-family:PlexMono;src:url(/fonts/ibm-plex-mono-latin-500-normal.woff2) format("woff2");font-weight:500;font-display:swap}`;

const CSS_A = `${FONT_A}
:root{--paper:#f6f5f1;--card:#fff;--ink:#111418;--text:#2a2f36;--muted:#646b75;--rule:#dedbd2;--blue:#2346d6;--blue-d:#1a35a8;--z1:#dce8f7;--z2:#a9c6ec;--z3:#5f8fdc;--z4:#233f9b;--ok:#1f7a4d}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--paper);color:var(--text);font:16.5px/1.6 Plex,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--blue)}a:hover{color:var(--blue-d)}
h1,h2,h3{color:var(--ink);font-weight:600;letter-spacing:-.015em;line-height:1.15;margin:0 0 .5em}
h1{font-size:clamp(2rem,4.6vw,3.3rem);letter-spacing:-.03em;max-width:15em}
h2{font-size:clamp(1.35rem,2.4vw,1.75rem)}h3{font-size:1.05rem}
p{margin:0 0 1em}.small,.meta,figcaption{font-size:.86rem;color:var(--muted)}
.wrap{max-width:1160px;margin:0 auto;padding:0 20px}
.banner{background:#111418;color:#e9e6dd;font-size:.85rem;padding:8px 0}.banner a{color:#fff}
header.site{background:var(--card);border-bottom:1px solid var(--rule);position:sticky;top:0;z-index:5}
header.site .wrap{display:flex;gap:10px 24px;align-items:center;justify-content:space-between;padding:12px 20px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font-weight:600;font-size:1.02rem}.brand .by{display:block;font-weight:400;font-size:.76rem;color:var(--muted);letter-spacing:.01em}
.mark{width:28px;height:28px;flex:none}.mark rect{fill:var(--blue)}.mark path{fill:#fff}
nav{display:flex;flex-wrap:wrap;gap:4px 20px;align-items:center}nav a{text-decoration:none;color:var(--text);font-size:.95rem}nav a:hover{color:var(--blue)}
nav a.phone{font-family:PlexMono,monospace;font-weight:500;color:var(--ink)}
nav a.navcta{background:var(--ink);color:#fff;padding:8px 14px;border-radius:4px;font-weight:600}nav a.navcta:hover{background:var(--blue);color:#fff}
@media(max-width:720px){nav a:not(.navcta):not(.phone){display:none}}
main{padding:0 0 72px}
.kicker,.eyebrow,.sec{font-family:PlexMono,monospace;font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin:0 0 14px;font-weight:500}
.sec{display:flex;gap:14px;align-items:center;border-top:1px solid var(--ink);padding-top:12px;margin-bottom:22px;color:var(--ink)}.sec span{color:var(--blue)}
.hero{display:grid;gap:28px;padding:48px 0 40px;align-items:start}@media(min-width:900px){.hero{grid-template-columns:1.15fr .85fr;gap:56px;padding:72px 0 56px}}
.lede{font-size:1.16rem;line-height:1.55;max-width:34em;color:var(--text)}
.ctas{display:flex;flex-wrap:wrap;gap:10px;margin-top:22px}
.btn,button{display:inline-block;background:var(--blue);color:#fff;border:0;border-radius:4px;padding:13px 20px;font:inherit;font-weight:600;text-decoration:none;cursor:pointer}
.btn:hover,button:hover{background:var(--blue-d);color:#fff}.btn.ghost{background:transparent;color:var(--ink);border:1px solid var(--ink)}.btn.ghost:hover{background:var(--ink);color:#fff}
.answer-card{background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:24px}
.figure{display:flex;align-items:baseline;gap:10px;margin:6px 0 4px}.figure .n{font-family:PlexMono,monospace;font-size:clamp(3rem,7vw,4.6rem);font-weight:500;letter-spacing:-.04em;color:var(--ink);line-height:1}.figure .u{font-family:PlexMono,monospace;color:var(--muted);font-size:1.05rem}
.cls{display:inline-block;font-family:PlexMono,monospace;font-size:.8rem;text-transform:uppercase;letter-spacing:.06em;padding:3px 8px;border:1px solid currentColor;border-radius:3px;margin:6px 0 14px;color:var(--blue-d)}
.answer-card .answer{font-size:.95rem;color:var(--text);margin:14px 0 8px}
.ruler{margin:10px 0 0}.ruler .track{position:relative;height:14px;display:flex;border-radius:2px;overflow:hidden}
.ruler .z{display:block;height:100%}.ruler .z1{width:15%;background:var(--z1)}.ruler .z2{width:15%;background:var(--z2)}.ruler .z3{width:15%;background:var(--z3)}.ruler .z4{width:55%;background:var(--z4)}
.ruler .span{position:absolute;top:-4px;bottom:-4px;border:2px solid var(--ink);background:rgba(255,255,255,.35);border-radius:2px}
.ruler .ticks{position:relative;height:18px;font-family:PlexMono,monospace;font-size:.7rem;color:var(--muted)}.ruler .tick{position:absolute;top:4px;transform:translateX(-50%)}.ruler .tick:first-child{transform:none}.ruler .tick:last-child{transform:translateX(-100%)}
.ruler .zones{display:flex;font-size:.72rem;color:var(--muted);margin-top:2px}.ruler .zones span:nth-child(-n+3){width:15%}.ruler .zones span:last-child{width:55%;text-align:right}
@media(max-width:520px){.ruler .zones{display:none}}
.ruler figcaption{margin-top:8px}
.glance{margin:8px 0 56px}.glance h2{font-size:1.1rem;font-family:PlexMono,monospace;font-weight:500;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
dl.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1px;background:var(--rule);border:1px solid var(--rule);margin:0}
.tile{background:var(--card);padding:18px 18px 16px}.tile.wide{grid-column:1/-1}@media(min-width:900px){.tile.wide{grid-column:span 2}}
.tile:last-child{grid-column-end:-1}
.tile dt{font-family:PlexMono,monospace;font-size:.72rem;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:8px}
.tile dd{margin:0;font-size:.92rem;color:var(--text)}.tile dd b{display:block;font-size:1.35rem;font-weight:600;color:var(--ink);letter-spacing:-.01em;line-height:1.2;margin-bottom:6px}
a.src{font-family:PlexMono,monospace;font-size:.74rem;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;border-bottom:1px solid currentColor;white-space:nowrap}
.answer-card .meta a.src,.panel a.src,.lead-in a.src,.note a.src{text-transform:none;letter-spacing:0;white-space:normal}
.band{margin:0 0 64px}.lead-in{font-size:1.06rem;max-width:46em}
.tablewrap{overflow-x:auto;-webkit-overflow-scrolling:touch;background:var(--card);border:1px solid var(--rule);margin:18px 0}
table{border-collapse:collapse;width:100%;font-size:.92rem}th{font-family:PlexMono,monospace;font-weight:500;font-size:.72rem;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);text-align:left;padding:10px 14px;border-bottom:1px solid var(--ink)}
td{padding:11px 14px;border-bottom:1px solid var(--rule);vertical-align:top}tr:last-child td{border-bottom:0}
ul.notes{padding-left:18px;color:var(--muted);font-size:.92rem;max-width:48em}
a.arrow{font-weight:600;text-decoration:none}a.arrow::after{content:" \\2192"}
.pair{display:grid;gap:20px}@media(min-width:860px){.pair{grid-template-columns:1fr 1fr}}
.panel{background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:24px}.panel h2{font-size:1.2rem}
.stat{font-family:PlexMono,monospace;font-size:2.6rem;font-weight:500;letter-spacing:-.03em;color:var(--ink);line-height:1;margin:6px 0 16px}.stat small{display:block;font-family:Plex,sans-serif;font-size:.86rem;letter-spacing:0;color:var(--muted);margin-top:8px;font-weight:400}.stat.good{color:var(--ok)}
.note{font-size:.9rem;color:var(--muted);border-top:1px solid var(--rule);padding-top:12px}
.leadbar{margin:0 0 16px}.leadbar .bar{display:flex;height:12px;background:var(--z1);border-radius:2px;overflow:hidden}.leadbar .bar span{display:block}
.lead{background:#c2410c}.grr{background:#f59e0b}.unk{background:#9aa3ad}.ok{background:var(--z1)}
.leadbar .lead,.leadbar .grr,.leadbar .unk,.leadbar .ok{height:100%}
.legend{list-style:none;padding:0;margin:10px 0 6px;display:flex;flex-wrap:wrap;gap:4px 16px;font-size:.82rem;color:var(--muted)}.legend i{display:inline-block;width:10px;height:10px;margin-right:6px;vertical-align:-1px}.legend b{color:var(--ink);font-family:PlexMono,monospace;font-weight:500}
.cards3{display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule);margin-top:20px}@media(min-width:760px){.cards3{grid-template-columns:repeat(3,1fr)}}
a.sys{display:flex;flex-direction:column;gap:6px;background:var(--card);padding:22px;text-decoration:none;color:var(--text)}a.sys strong{color:var(--ink);font-size:1.08rem}a.sys em{font-style:normal;font-weight:600;color:var(--blue);margin-top:auto;padding-top:8px}a.sys em::after{content:" \\2192"}a.sys:hover{background:#fbfaf7}
.steps4{list-style:none;padding:0;margin:20px 0 14px;display:grid;gap:22px}@media(min-width:760px){.steps4{grid-template-columns:repeat(4,1fr)}}
.steps4 li{border-top:2px solid var(--ink);padding-top:14px;display:flex;flex-direction:column;gap:4px;font-size:.93rem}.steps4 .k{font-family:PlexMono,monospace;color:var(--blue);font-size:.82rem}.steps4 strong{color:var(--ink);font-size:1.02rem}
.faq{border-top:1px solid var(--ink)}.faq details{border-bottom:1px solid var(--rule)}.faq summary{cursor:pointer;list-style:none;padding:16px 36px 16px 0;font-weight:600;color:var(--ink);position:relative}
.faq summary::-webkit-details-marker{display:none}.faq summary::after{content:"+";position:absolute;right:4px;top:12px;font-family:PlexMono,monospace;font-size:1.3rem;color:var(--blue)}.faq details[open] summary::after{content:"\\2212"}.faq details p{margin:0 0 18px;max-width:48em}
details.more{margin:14px 0}details.more summary{cursor:pointer;font-weight:600;color:var(--blue)}.zips{font-family:PlexMono,monospace;font-size:.85rem;color:var(--muted);word-spacing:.4em}
.request{display:grid;gap:28px;background:var(--ink);color:#d9dde3;border-radius:6px;padding:28px}@media(min-width:900px){.request{grid-template-columns:.8fr 1.2fr;padding:44px;gap:48px}}
.request .kicker{color:#9fb0ff}.req-h{font-size:clamp(1.5rem,3vw,2.1rem);line-height:1.15;color:#fff;font-weight:600;letter-spacing:-.02em}
.ticks-list{list-style:none;padding:0;margin:18px 0}.ticks-list li{padding:8px 0 8px 26px;border-top:1px solid #2d333b;position:relative}.ticks-list li::before{content:"";position:absolute;left:0;top:15px;width:12px;height:7px;border-left:2px solid #9fb0ff;border-bottom:2px solid #9fb0ff;transform:rotate(-45deg)}
.request .disclosure{color:#b9c0c9;font-size:.88rem;border-top:1px solid #2d333b;padding-top:14px}.request .disclosure strong{color:#fff}
.disclosure{font-size:.9rem}
form.inquiry,.req-form .panel{background:var(--card);color:var(--text);border-radius:6px;padding:24px}
form.inquiry h2{font-size:1.3rem}
fieldset{border:0;padding:0;margin:18px 0 14px}legend,label.f{display:block;font-weight:600;color:var(--ink);margin:14px 0 6px;font-size:.92rem}
input[type=text],input[type=email],input[type=tel],select,textarea{width:100%;font:inherit;padding:11px 12px;border:1px solid #b9b5aa;border-radius:4px;background:#fff;color:var(--ink)}
input:focus,select:focus,textarea:focus,button:focus,a:focus,summary:focus{outline:3px solid #9fb0ff;outline-offset:2px}
.choice{display:flex;gap:10px;align-items:flex-start;margin:6px 0;font-size:.94rem}.choice input{margin-top:4px;width:18px;height:18px;flex:none;accent-color:var(--blue)}
fieldset .choice{display:inline-flex;margin:0 6px 6px 0;padding:9px 14px;border:1px solid #b9b5aa;border-radius:4px;cursor:pointer;align-items:center}fieldset .choice input{margin:0}
fieldset .choice:has(input:checked){border-color:var(--blue);background:#eef1fd}
form.inquiry>label.choice{font-size:.78rem;line-height:1.5;color:var(--muted);background:var(--paper);padding:12px;border-radius:4px}
form.inquiry button{width:100%;padding:15px;font-size:1.02rem}
.err{color:#b42318;font-size:.88rem;margin:4px 0 0}.hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.coverage{border-top:1px solid var(--rule);padding-top:22px;font-size:.94rem}
.sticky-cta{position:fixed;left:12px;right:12px;bottom:12px;text-align:center;background:var(--ink);color:#fff;border-radius:4px;padding:14px;font-weight:600;text-decoration:none;z-index:6}@media(min-width:760px){.sticky-cta{display:none}}
footer{border-top:1px solid var(--rule);background:var(--card);padding:28px 0;font-size:.86rem;color:var(--muted)}footer .fl a{margin-right:16px}
.hub-hero .hero-side{background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:24px}
.zipform label{display:block;font-weight:600;color:var(--ink);margin-bottom:8px}.zrow{display:flex;gap:8px}.zrow input{flex:1;font-size:1.1rem;font-family:PlexMono,monospace}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);margin-top:28px}.stats div{background:var(--card);padding:16px}.stats b{display:block;font-family:PlexMono,monospace;font-size:2rem;font-weight:500;color:var(--ink);line-height:1}.stats span{font-size:.82rem;color:var(--muted)}
.hbars{list-style:none;padding:0;margin:20px 0;border-top:1px solid var(--ink)}.hbars li{display:grid;grid-template-columns:minmax(120px,190px) 1fr auto;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid var(--rule)}
.hbars a{text-decoration:none;color:var(--ink);font-weight:600}.hbars b{font-family:PlexMono,monospace;font-weight:500;font-size:.86rem;color:var(--ink)}
.hbar{position:relative;height:10px;background:linear-gradient(90deg,var(--z1) 0 15%,var(--z2) 15% 30%,var(--z3) 30% 45%,var(--z4) 45% 100%);opacity:.35;border-radius:2px}.hbar span{position:absolute;top:0;bottom:0;background:var(--ink);border-radius:2px}
.hbars .hbar{opacity:1;background:#ebe8e0}.hbar .z1{background:var(--z2)}.hbar .z2{background:var(--z2)}.hbar .z3{background:var(--z3)}.hbar .z4{background:var(--z4)}
@media(max-width:600px){.hbars li{grid-template-columns:1fr auto}.hbars .hbar{grid-column:1/-1;order:3}}
.legend-row{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:.84rem;color:var(--muted)}.legend-row i,.chip i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:7px}
.dot-soft{background:var(--z1);box-shadow:inset 0 0 0 1px #9ab}.dot-moderately-hard{background:var(--z2)}.dot-hard{background:var(--z3)}.dot-very-hard{background:var(--z4)}.dot-none{background:transparent;box-shadow:inset 0 0 0 1px var(--muted)}
.states{display:grid;gap:1px;background:var(--rule);border:1px solid var(--rule);grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}.state{background:var(--card);padding:14px 16px}.state h3{font-family:PlexMono,monospace;font-weight:500;font-size:.78rem;color:var(--muted);letter-spacing:.06em;margin-bottom:8px}
.chips{display:flex;flex-wrap:wrap;gap:6px}a.chip{display:inline-flex;align-items:center;text-decoration:none;color:var(--ink);font-size:.92rem;padding:4px 10px;border:1px solid var(--rule);border-radius:3px}a.chip:hover{border-color:var(--blue)}
.badge{font-family:PlexMono,monospace;font-size:.74rem;text-transform:uppercase;letter-spacing:.04em;padding:2px 6px;border:1px solid currentColor;border-radius:3px;white-space:nowrap}
.c-soft{color:#3d6ea8}.c-moderately-hard{color:#2b58b8}.c-hard{color:#1f3f9b}.c-very-hard{color:#111c55}
.answer{font-size:1.02rem}dl.faq dt{font-weight:600;color:var(--ink);margin-top:16px}dl.faq dd{margin:4px 0 0}
.card{background:var(--card);border:1px solid var(--rule);border-radius:6px;padding:18px}.grid{display:grid;gap:18px}@media(min-width:760px){.grid.two{grid-template-columns:1.1fr .9fr}.grid.three{grid-template-columns:repeat(3,1fr)}}
a.card.link{display:block;text-decoration:none;color:var(--text)}a.card.link strong{display:block;color:var(--ink)}
main>.wrap>h1:first-child,main>.wrap>.grid:first-child,main>.wrap>p:first-child{margin-top:48px}
ol.steps li{margin-bottom:8px}.toc{display:none}
`;

const CSS_B = `@font-face{font-family:Fig;src:url(/fonts/figtree-latin-wght-normal.woff2) format("woff2");font-weight:300 900;font-display:swap}
:root{--bg:#fff;--sand:#f6f1e8;--ink:#13253d;--text:#33435a;--muted:#66758a;--line:#e5e0d6;--orange:#e8622c;--orange-d:#c94d1b;--blue:#1f5fbf;--sky:#e3eefc;--z1:#cdebd9;--z2:#cfe3fa;--z3:#fbe0a8;--z4:#f5b9a6;--ok:#16794a}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--text);font:17px/1.6 Fig,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
a{color:var(--blue)}h1,h2,h3{color:var(--ink);line-height:1.12;margin:0 0 .5em;font-weight:800;letter-spacing:-.02em}
h1{font-size:clamp(2.1rem,4.8vw,3.4rem)}h2{font-size:clamp(1.45rem,2.6vw,2rem)}h3{font-size:1.1rem;font-weight:700}
p{margin:0 0 1em}.small,.meta,figcaption{font-size:.88rem;color:var(--muted)}
.wrap{max-width:1180px;margin:0 auto;padding:0 20px}
.banner{background:var(--sky);color:var(--ink);font-size:.86rem;padding:8px 0}
header.site{background:rgba(255,255,255,.94);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5;backdrop-filter:saturate(1.2) blur(6px)}
header.site .wrap{display:flex;gap:10px 26px;align-items:center;justify-content:space-between;padding:12px 20px;flex-wrap:wrap}
.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink);font-weight:800;font-size:1.1rem;letter-spacing:-.01em}.brand .by{display:block;font-weight:500;font-size:.76rem;color:var(--muted);letter-spacing:0}
.mark{width:32px;height:32px;flex:none}.mark circle{fill:var(--blue)}.mark path{fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round}
nav{display:flex;flex-wrap:wrap;gap:4px 22px;align-items:center}nav a{text-decoration:none;color:var(--ink);font-weight:600;font-size:.96rem}nav a:hover{color:var(--blue)}
nav a.phone{color:var(--blue)}nav a.navcta{background:var(--orange);color:#fff;padding:9px 16px;border-radius:999px}nav a.navcta:hover{background:var(--orange-d);color:#fff}
@media(max-width:720px){nav a:not(.navcta):not(.phone){display:none}}
main{padding:0 0 80px}
.kicker{display:inline-block;background:var(--sky);color:var(--blue);font-weight:700;font-size:.85rem;padding:4px 12px;border-radius:999px;margin:0 0 16px}
.eyebrow{font-size:.86rem;font-weight:700;color:var(--muted);margin:0 0 6px;text-transform:none;letter-spacing:0}
.hero{display:grid;gap:28px;padding:36px 0 40px;align-items:start}@media(min-width:960px){.hero{grid-template-columns:1.05fr .95fr;gap:48px;padding:56px 0 56px}}
.hero-copy{position:relative}.lede{font-size:1.2rem;line-height:1.55;max-width:32em}
.ctas{display:flex;flex-wrap:wrap;gap:10px;margin:22px 0 18px}
.btn,button{display:inline-block;background:var(--orange);color:#fff;border:0;border-radius:999px;padding:14px 24px;font:inherit;font-weight:700;text-decoration:none;cursor:pointer;box-shadow:0 6px 16px rgba(232,98,44,.25)}
.btn:hover,button:hover{background:var(--orange-d);color:#fff}.btn.ghost{background:#fff;color:var(--ink);box-shadow:inset 0 0 0 2px var(--line)}.btn.ghost:hover{box-shadow:inset 0 0 0 2px var(--ink);background:#fff;color:var(--ink)}
.trust{list-style:none;padding:0;margin:10px 0 0;display:grid;gap:10px;font-weight:600;color:var(--ink);font-size:.95rem}.trust li{display:flex;gap:10px;align-items:center}
.trust svg,.ic svg{width:26px;height:26px;fill:none;stroke:var(--blue);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;flex:none}
.house{display:none;width:100%;max-width:400px;margin-top:24px}@media(min-width:960px){.house{display:block}}
.house path,.house rect{fill:none;stroke:var(--ink);stroke-width:2.4;stroke-linecap:round;stroke-linejoin:round}.house .ground{stroke:var(--line)}.house .roof{stroke:var(--blue)}
.house .pipe{stroke:var(--blue);stroke-width:3.4}.house .tank{fill:var(--sky)}.house .tank2{fill:var(--sand)}.house .win{fill:var(--sky)}.house .drop{fill:var(--sky);stroke:var(--blue)}
.formcard{background:#fff;border-radius:22px;box-shadow:0 1px 0 var(--line),0 18px 48px rgba(19,37,61,.12);padding:26px;border:1px solid var(--line)}
@media(min-width:960px){.formcard{position:sticky;top:84px}}
.formcard .disclosure{font-size:.84rem;color:var(--muted);margin-top:14px;border-top:1px solid var(--line);padding-top:12px}.formcard .disclosure strong{color:var(--ink)}
.sheet{background:var(--sand);border-radius:28px;padding:22px;display:grid;gap:22px;margin:0 0 64px}@media(min-width:900px){.sheet{grid-template-columns:.9fr 1.1fr;padding:34px;gap:34px}}
.answer-card{background:#fff;border-radius:20px;padding:24px}.answer-card .answer{font-size:.96rem;margin:14px 0 8px}
.figure{display:flex;align-items:baseline;gap:10px;margin:4px 0}.figure .n{font-size:clamp(3rem,7vw,4.4rem);font-weight:800;letter-spacing:-.04em;color:var(--ink);line-height:1}.figure .u{font-weight:700;color:var(--muted)}
.cls{display:inline-block;font-weight:700;font-size:.9rem;padding:4px 12px;border-radius:999px;margin:8px 0 12px}
.cls-soft{background:var(--z1);color:#14532d}.cls-moderately-hard{background:var(--z2);color:#0b4a6f}.cls-hard{background:var(--z3);color:#6e4400}.cls-very-hard{background:var(--z4);color:#7a1f0e}
.ruler{margin:8px 0 0}.ruler .track{position:relative;height:16px;display:flex;border-radius:999px;overflow:visible}
.ruler .z{display:block;height:100%}.ruler .z1{width:15%;background:var(--z1);border-radius:999px 0 0 999px}.ruler .z2{width:15%;background:var(--z2)}.ruler .z3{width:15%;background:var(--z3)}.ruler .z4{width:55%;background:var(--z4);border-radius:0 999px 999px 0}
.ruler .span{position:absolute;top:-5px;bottom:-5px;border:3px solid var(--ink);border-radius:999px;background:rgba(255,255,255,.4)}
.ruler .ticks{position:relative;height:20px;font-size:.74rem;color:var(--muted);font-weight:600}.ruler .tick{position:absolute;top:6px;transform:translateX(-50%)}.ruler .tick:first-child{transform:none}.ruler .tick:last-child{transform:translateX(-100%)}
.ruler .zones{display:flex;font-size:.74rem;color:var(--muted);font-weight:600}.ruler .zones span:nth-child(-n+3){width:15%}.ruler .zones span:last-child{width:55%;text-align:right}
@media(max-width:520px){.ruler .zones{display:none}}
.glance h2{font-size:1.25rem}
dl.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin:0}
.tile{background:#fff;border-radius:16px;padding:16px 18px}.tile.wide{grid-column:1/-1}.tile:last-child{grid-column-end:-1}
.tile dt{font-size:.82rem;font-weight:700;color:var(--muted);margin-bottom:4px}.tile dd{margin:0;font-size:.9rem}.tile dd b{display:block;font-size:1.3rem;font-weight:800;color:var(--ink);line-height:1.2;margin-bottom:4px;letter-spacing:-.01em}
a.src{font-size:.84rem;font-weight:700;text-decoration:none;white-space:nowrap}a.src::after{content:" \\2197"}
.panel a.src,.lead-in a.src,.note a.src,.answer-card .meta a.src{white-space:normal}
.band{margin:0 0 72px}.lead-in{font-size:1.08rem;max-width:46em}
.tablewrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:16px;margin:18px 0}
table{border-collapse:collapse;width:100%;font-size:.94rem}th{text-align:left;padding:12px 16px;background:var(--sand);color:var(--ink);font-weight:700;font-size:.86rem}td{padding:12px 16px;border-top:1px solid var(--line);vertical-align:top}
ul.notes{padding-left:18px;color:var(--muted);font-size:.94rem;max-width:48em}
a.arrow{font-weight:700;text-decoration:none}a.arrow::after{content:" \\2192"}
.pair{display:grid;gap:18px}@media(min-width:860px){.pair{grid-template-columns:1fr 1fr}}
.panel{background:var(--sand);border-radius:22px;padding:26px}.panel h2{font-size:1.3rem}
.stat{font-size:2.8rem;font-weight:800;letter-spacing:-.03em;color:var(--ink);line-height:1;margin:6px 0 16px}.stat small{display:block;font-size:.9rem;letter-spacing:0;color:var(--muted);margin-top:8px;font-weight:600}.stat.good{color:var(--ok)}
.note{font-size:.9rem;color:var(--muted);border-top:1px solid var(--line);padding-top:12px}
.leadbar{margin:0 0 16px}.leadbar .bar{display:flex;height:14px;background:#fff;border-radius:999px;overflow:hidden}.leadbar .bar span{display:block;height:100%}
.lead{background:#d9480f}.grr{background:#f2a541}.unk{background:#a7b1bf}.ok{background:#fff}
.legend{list-style:none;padding:0;margin:10px 0 6px;display:flex;flex-wrap:wrap;gap:4px 16px;font-size:.84rem;color:var(--muted)}.legend i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:-1px;box-shadow:inset 0 0 0 1px var(--line)}.legend b{color:var(--ink)}
.cards3{display:grid;gap:16px;margin-top:20px}@media(min-width:760px){.cards3{grid-template-columns:repeat(3,1fr)}}
a.sys{display:flex;flex-direction:column;gap:6px;background:#fff;border:1px solid var(--line);border-radius:20px;padding:22px;text-decoration:none;color:var(--text);transition:box-shadow .15s,border-color .15s}
a.sys:hover{border-color:transparent;box-shadow:0 12px 32px rgba(19,37,61,.12)}a.sys strong{color:var(--ink);font-size:1.15rem}a.sys em{font-style:normal;font-weight:700;color:var(--blue);margin-top:auto;padding-top:8px}a.sys em::after{content:" \\2192"}
.ic{display:inline-flex;width:52px;height:52px;border-radius:16px;background:var(--sky);align-items:center;justify-content:center;margin-bottom:6px}
.steps4{list-style:none;padding:0;margin:20px 0 14px;display:grid;gap:16px}@media(min-width:760px){.steps4{grid-template-columns:repeat(4,1fr)}}
.steps4 li{background:var(--sand);border-radius:20px;padding:20px;display:flex;flex-direction:column;gap:4px;font-size:.93rem}.steps4 .ic{background:#fff}.steps4 strong{color:var(--ink);font-size:1.05rem}
.faq{display:grid;gap:10px}.faq details{border:1px solid var(--line);border-radius:16px;padding:0 20px;background:#fff}.faq details[open]{background:var(--sand);border-color:transparent}
.faq summary{cursor:pointer;list-style:none;padding:16px 32px 16px 0;font-weight:700;color:var(--ink);position:relative}.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"";position:absolute;right:2px;top:22px;width:9px;height:9px;border-right:2.5px solid var(--blue);border-bottom:2.5px solid var(--blue);transform:rotate(45deg)}.faq details[open] summary::after{transform:rotate(-135deg);top:26px}
.faq details p{margin:0 0 18px;max-width:50em}
details.more{margin:14px 0}details.more summary{cursor:pointer;font-weight:700;color:var(--blue)}.zips{font-size:.88rem;color:var(--muted);word-spacing:.4em}
.disclosure{font-size:.9rem}
form.inquiry h2{font-size:1.5rem;margin-bottom:4px}
fieldset{border:0;padding:0;margin:18px 0 12px}legend,label.f{display:block;font-weight:700;color:var(--ink);margin:14px 0 6px;font-size:.93rem}
input[type=text],input[type=email],input[type=tel],select,textarea{width:100%;font:inherit;padding:12px 14px;border:1.5px solid #cfd6e0;border-radius:12px;background:#fff;color:var(--ink)}
input:focus,select:focus,textarea:focus{border-color:var(--blue);outline:3px solid var(--sky);outline-offset:0}button:focus,a:focus,summary:focus{outline:3px solid #9cc0f5;outline-offset:2px}
.choice{display:flex;gap:10px;align-items:flex-start;margin:6px 0;font-size:.95rem}.choice input{margin-top:4px;width:18px;height:18px;flex:none;accent-color:var(--orange)}
fieldset .choice{display:inline-flex;margin:0 6px 6px 0;padding:9px 16px;border:1.5px solid #cfd6e0;border-radius:999px;cursor:pointer;align-items:center;font-weight:600}fieldset .choice input{margin:0}
fieldset .choice:has(input:checked){border-color:var(--orange);background:#fdf0ea}
form.inquiry>label.choice{font-size:.78rem;line-height:1.5;color:var(--muted);background:var(--sand);padding:12px;border-radius:12px}
form.inquiry button{width:100%;padding:16px;font-size:1.05rem}
.err{color:#b42318;font-size:.88rem;margin:4px 0 0}.hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
.coverage{background:var(--sand);border-radius:22px;padding:22px 26px;font-size:.95rem}
.sticky-cta{position:fixed;left:12px;right:12px;bottom:12px;text-align:center;background:var(--orange);color:#fff;border-radius:999px;padding:15px;font-weight:700;text-decoration:none;z-index:6;box-shadow:0 10px 24px rgba(0,0,0,.18)}@media(min-width:760px){.sticky-cta{display:none}}
footer{background:var(--ink);color:#b8c3d3;padding:32px 0;font-size:.88rem}footer a{color:#fff}footer .fl a{margin-right:16px}
.hub-hero .house{display:block;max-width:420px;margin:0 auto}@media(max-width:959px){.hub-hero .house{display:none}}
.zipform{background:#fff;border-radius:22px;box-shadow:0 18px 48px rgba(19,37,61,.12);border:1px solid var(--line);padding:20px;margin:22px 0;max-width:520px}
.zipform label{display:block;font-weight:700;color:var(--ink);margin-bottom:8px}.zrow{display:flex;gap:8px}.zrow input{flex:1;font-size:1.1rem}.zrow button{box-shadow:none}
.stats{display:flex;flex-wrap:wrap;gap:12px 30px;margin-top:8px}.stats b{display:block;font-size:2.1rem;font-weight:800;color:var(--ink);line-height:1}.stats span{font-size:.86rem;color:var(--muted);font-weight:600}
.hbars{list-style:none;padding:0;margin:20px 0;display:grid;gap:10px}.hbars li{display:grid;grid-template-columns:minmax(120px,200px) 1fr auto;gap:14px;align-items:center;background:var(--sand);border-radius:14px;padding:12px 16px}
.hbars a{text-decoration:none;color:var(--ink);font-weight:700}.hbars b{font-weight:800;font-size:.9rem;color:var(--ink)}
.hbar{position:relative;height:12px;background:#fff;border-radius:999px}.hbar span{position:absolute;top:0;bottom:0;border-radius:999px}.hbar .z1{background:#7cc79d}.hbar .z2{background:#78aeea}.hbar .z3{background:#f2b33d}.hbar .z4{background:#e2643e}
@media(max-width:600px){.hbars li{grid-template-columns:1fr auto}.hbars .hbar{grid-column:1/-1;order:3}}
.legend-row{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:.86rem;color:var(--muted);font-weight:600}.legend-row i,.chip i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:7px}
.dot-soft{background:#7cc79d}.dot-moderately-hard{background:#78aeea}.dot-hard{background:#f2b33d}.dot-very-hard{background:#e2643e}.dot-none{background:#fff;box-shadow:inset 0 0 0 1.5px var(--muted)}
.states{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}.state{background:var(--sand);border-radius:18px;padding:16px 18px}.state h3{font-size:.9rem;color:var(--muted);margin-bottom:8px}
.chips{display:flex;flex-wrap:wrap;gap:6px}a.chip{display:inline-flex;align-items:center;text-decoration:none;color:var(--ink);font-weight:600;font-size:.93rem;padding:6px 12px;background:#fff;border-radius:999px}a.chip:hover{box-shadow:inset 0 0 0 2px var(--blue)}
.badge{font-weight:700;font-size:.8rem;padding:3px 10px;border-radius:999px;white-space:nowrap}
.c-soft{background:var(--z1);color:#14532d}.c-moderately-hard{background:var(--z2);color:#0b4a6f}.c-hard{background:var(--z3);color:#6e4400}.c-very-hard{background:var(--z4);color:#7a1f0e}
.answer{font-size:1.04rem}dl.faq dt{font-weight:700;color:var(--ink);margin-top:16px}dl.faq dd{margin:4px 0 0}
.card{background:var(--sand);border-radius:20px;padding:20px}.grid{display:grid;gap:18px}@media(min-width:760px){.grid.two{grid-template-columns:1.1fr .9fr}.grid.three{grid-template-columns:repeat(3,1fr)}}
a.card.link{display:block;text-decoration:none;color:var(--text)}a.card.link strong{display:block;color:var(--ink)}
main>.wrap>h1:first-child,main>.wrap>.grid:first-child,main>.wrap>p:first-child{margin-top:44px}
form.inquiry:not(.formcard form){background:#fff;border:1px solid var(--line);border-radius:22px;padding:24px}
ol.steps li{margin-bottom:8px}.toc{display:none}
.quick{list-style:none;padding:0;margin:20px 0 4px;display:grid;grid-template-columns:1fr 1fr;gap:8px;max-width:34em}
[id]{scroll-margin-top:96px}
.concern .leadbar .ok,.concern .legend i.ok{background:var(--sky)}
.quick a{display:flex;flex-direction:column;gap:2px;text-decoration:none;background:var(--sand);border-radius:14px;padding:10px 14px;border-left:4px solid var(--blue);height:100%}
.quick span{font-size:.78rem;font-weight:700;color:var(--muted)}.quick b{color:var(--ink);font-size:.98rem;line-height:1.25}
.quick .t-warn a{border-left-color:var(--orange)}.quick .t-good a{border-left-color:var(--ok)}.quick a:hover{box-shadow:inset 0 0 0 2px var(--line)}
.concerns{margin-top:8px}.cgrid{display:grid;gap:18px;margin-top:22px}@media(min-width:860px){.cgrid{grid-template-columns:1fr 1fr}}
.concern{background:#fff;border:1px solid var(--line);border-radius:22px;padding:24px;display:flex;flex-direction:column;border-top:6px solid var(--blue)}
.concern.t-warn{border-top-color:var(--orange)}.concern.t-good{border-top-color:var(--ok)}.concern.wide{grid-column:1/-1}
.concern .ch{display:flex;align-items:center;gap:12px;margin-bottom:10px}.concern .ch .ic{margin:0;width:44px;height:44px;border-radius:14px}.concern .tag{margin:0;font-weight:700;font-size:.86rem;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.concern h3{font-size:1.25rem;margin-bottom:6px}.concern .status{font-size:1.6rem;font-weight:800;letter-spacing:-.02em;line-height:1.15;color:var(--ink);margin:0 0 12px}
.concern.t-warn .status{color:var(--orange-d)}.concern.t-good .status{color:var(--ok)}
.concern>p{font-size:.95rem}.concern .means{background:var(--sand);border-radius:14px;padding:12px 14px;font-size:.92rem;color:var(--text)}
.concern .fix{display:flex;flex-wrap:wrap;gap:10px 18px;align-items:center;margin-top:auto;padding-top:8px}
a.ask{display:inline-block;font-weight:700;text-decoration:none;color:var(--orange-d);border:2px solid #f6c7b2;border-radius:999px;padding:7px 14px;font-size:.92rem}a.ask:hover{background:#fdf0ea;border-color:var(--orange)}
.wl{list-style:none;padding:0;margin:4px 0 14px;display:grid;gap:12px}@media(min-width:860px){.wl{grid-template-columns:repeat(3,1fr)}}
.wl li{background:var(--sand);border-radius:14px;padding:14px;font-size:.92rem;display:flex;flex-direction:column;gap:4px}.wl strong{color:var(--ink)}
.other{display:flex;flex-wrap:wrap;gap:16px 28px;align-items:center;justify-content:space-between;background:var(--ink);color:#d7dfea;border-radius:22px;padding:24px 28px;margin-top:18px}
.other h3{color:#fff;font-size:1.2rem}.other p{margin:0;max-width:44em}.other .btn{box-shadow:none}
`;

// The breadcrumb a hub city page carries above its heading.
export const hubCrumbs = (l: CityLocation, m: MarketConfig) =>
  `<p class="crumbs"><a href="/service-areas/">Service areas</a> / ${m.slug !== l.slug ? `<a href="/locations/${e(m.slug)}/">${e(m.name)}</a> / ` : ''}${e(l.name)}</p>`;
