import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { FILTRATION, FILTRATION_GENERAL } from '../content/filtration.ts';
import { locationBySlug } from '../content/locations.ts';
import { filtrationSection, leadAnswer, pfasAnswer } from '../src/site/city.ts';

const ids = new Set(readFileSync('docs/research/evidence.csv', 'utf8').split('\n').slice(1).map((l) => l.split(',')[0]));

describe('filtration facts', () => {
  it('belong to a known city, cite evidence that exists, and render', () => {
    for (const g of Object.values(FILTRATION_GENERAL)) for (const id of g.evidence_ids) expect(ids.has(id), id).toBe(true);
    for (const [slug, f] of Object.entries(FILTRATION)) {
      const l = locationBySlug(slug);
      expect(l, slug).toBeDefined();
      for (const id of [...f.lead_lines.flatMap((r) => r.evidence_ids), ...f.pfas.evidence_ids]) expect(ids.has(id), `${slug} ${id}`).toBe(true);
      for (const r of f.lead_lines) expect(r.source_url.startsWith('https://'), slug).toBe(true);
      const html = filtrationSection(l!);
      expect(html).toContain('id="lead"');
      expect(html).toContain('id="pfas"');
      expect(leadAnswer(l!, f)).not.toMatch(/undefined|NaN/);
      expect(pfasAnswer(l!, f.pfas)).not.toMatch(/undefined|NaN/);
    }
  });
  it('leaves cities without filtration facts unchanged', () => {
    expect(filtrationSection(locationBySlug('phoenix')!)).toBe('');
  });
});
