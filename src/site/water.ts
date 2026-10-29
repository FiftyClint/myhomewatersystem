// Shared water answers for city sites, state directories and the hub. Every sentence is built from a
// published fact in content/locations.ts or from the USGS hardness classes. Nothing here is estimated.
import { escapeHtml as e } from '../util.ts';
import { FILTRATION } from '../../content/filtration.ts';
import type { CityLocation } from '../../content/locations.ts';
import { localOf } from '../../content/local-details.ts';

export const USGS_HARDNESS = 'https://www.usgs.gov/water-science-school/science/hardness-water';
export const MGL_PER_GRAIN = 17.1;

export type HardnessClass = 'soft' | 'moderately hard' | 'hard' | 'very hard';

// USGS classes, mg/L as calcium carbonate: 0-60 soft, 61-120 moderately hard, 121-180 hard, over 180 very hard.
export function classOf(mgl: number): HardnessClass {
  if (mgl <= 60) return 'soft';
  if (mgl <= 120) return 'moderately hard';
  if (mgl <= 180) return 'hard';
  return 'very hard';
}

// "very hard", or "moderately hard to very hard" when the published span crosses classes.
export function classLabel(l: CityLocation): string | null {
  if (!l.scale_mgl) return null;
  const [lo, hi] = l.scale_mgl;
  const a = classOf(lo), b = classOf(hi);
  return a === b ? a : `${a} to ${b}`;
}

export const hardnessFacts = (l: CityLocation) => l.facts.filter((f) => /hardness/i.test(f.label));

// One plain sentence per utility, copied from the published figures with their period.
export function hardnessAnswer(l: CityLocation): string {
  const fs = hardnessFacts(l);
  if (!fs.length) return `We have not found a published hardness figure for ${l.name}. Your utility's latest water quality report is the place to check.`;
  // A label that already names the utility ("Hardness, Denver Water") is not followed by "reported by Denver Water".
  const parts = fs.map((f) => (f.label.includes(f.utility) ? `${f.label}: ${f.value} (${f.period}).` : `${f.label} reported by ${f.utility}: ${f.value} (${f.period}).`));
  return `${parts.join(' ')}${new Set(fs.map((f) => f.utility)).size > 1 ? ' Check which utility appears on your water bill.' : ''}`;
}

// The class sentence, said as our reading of the published numbers, never as a test of anyone's home.
export function classSentence(l: CityLocation): string | null {
  const c = classLabel(l);
  if (!c) return null;
  const conv = l.scale_converted ? ' (grains converted at 17.1 mg/L per grain)' : '';
  const u = [...new Set(hardnessFacts(l).map((f) => f.utility))];
  const who = u.length === 1 ? `${u[0]}'s figures for ${l.name}` : `The ${u.length} utilities' figures for ${l.name}`;
  return `${who} read as ${c} on the USGS scale${conv}.`;
}

const SCALE_MAX = 400;
const pct = (v: number) => Math.max(0, Math.min(100, (v / SCALE_MAX) * 100));

// A plain-HTML scale from 0 to 400 mg/L with the four USGS bands and the published span marked.
export function hardnessScale(l: CityLocation): string {
  if (!l.scale_mgl) return '';
  const [lo, hi] = l.scale_mgl;
  const left = pct(lo), width = Math.max(1.5, pct(hi) - left);
  const label = lo === hi ? `${lo} mg/L` : `${lo} to ${hi} mg/L`;
  return `<figure class="scale" aria-label="Published hardness ${e(label)} on the USGS scale">
<div class="bands"><span class="b-soft" style="width:15%">Soft</span><span class="b-mod" style="width:15%">Mod.</span><span class="b-hard" style="width:15%">Hard</span><span class="b-very" style="width:55%">Very hard</span>
<span class="mark" style="left:${left.toFixed(1)}%;width:${width.toFixed(1)}%"></span></div>
<figcaption class="small">${e(l.name)}: ${e(label)}${l.scale_converted ? ' (converted from grains per gallon)' : ''} on USGS bands, 0 to ${SCALE_MAX} mg/L.</figcaption></figure>`;
}

export const classBadge = (l: CityLocation): string => {
  const c = classLabel(l);
  return c ? `<span class="badge c-${e(classOf(l.scale_mgl![1]).replace(' ', '-'))}">${e(c[0]!.toUpperCase() + c.slice(1))}</span>` : '';
};

// Readable month-day-year for a YYYY-MM-DD date.
export function longDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[(m ?? 1) - 1]} ${d}, ${y}`;
}

// Machine-readable facts for one city: what /water.json serves and what the hub dataset is built from.
export function cityData(l: CityLocation, site: { url: string; brand: string } | null, open: boolean) {
  return {
    city: l.name, state: l.state, slug: l.slug,
    hardness_facts: l.facts.map((f) => ({ utility: f.utility, measure: f.label, value_as_published: f.value, period: f.period,
      source_title: f.source_title, source_url: f.source_url })),
    published_span_mg_per_l: l.scale_mgl, span_converted_from_grains: !!l.scale_converted,
    usgs_class: classLabel(l), usgs_class_source: USGS_HARDNESS,
    notes: l.notes, local_details: localOf(l.slug), sources_checked_on: l.checked_on,
    filtration: FILTRATION[l.slug] ?? null,
    site: site?.url ?? null, brand: site?.brand ?? null, taking_requests: open,
  };
}
