import { describe, expect, it } from 'vitest';
import type { MarketConfig } from '../src/domain/config.ts';
import { CITY_ZIPS } from '../content/zips.ts';
import { LOCATIONS } from '../content/locations.ts';
import { serviceDisclosure, smsDisclosure } from '../src/intake/disclosure.ts';
import ev from '../config/markets/east-valley.json';
import lv from '../config/markets/las-vegas-valley.json';
import sa from '../config/markets/san-antonio-area.json';
import kc from '../config/markets/kansas-city.json';
import phx from '../config/markets/phoenix.json';

const MARKETS = [ev, lv, sa, kc, phx] as unknown as MarketConfig[];

describe('pilot market ZIP lists', () => {
  it('each market accepts exactly the ZIPs its city pages list, and no ZIP belongs to two markets', () => {
    const seen = new Map<string, string>();
    for (const m of MARKETS) {
      const fromCities = LOCATIONS.filter((l) => l.market_id === m.id).flatMap((l) => CITY_ZIPS[l.slug] ?? []);
      expect([...m.zips].sort()).toEqual([...fromCities].sort());
      for (const z of m.zips) {
        expect(z).toMatch(/^\d{5}$/);
        expect(seen.get(z), `${z} in ${seen.get(z)} and ${m.id}`).toBeUndefined();
        seen.set(z, m.id);
      }
    }
  });
  it('Johnson County KS ZIPs are in (Clint, 2026-10-26)', () => {
    for (const z of ['66062', '66210', '66213', '66221']) expect(kc.zips).toContain(z);
  });
});

describe('draft consent wording', () => {
  const m = structuredClone(MARKETS[0]!);
  it('names Aidren LLC and, before a dealer signs, promises to ask before sharing', () => {
    const text = serviceDisclosure({ ...m, seller_display_name: null });
    expect(text).toContain('operated by Aidren LLC');
    expect(text).toContain('we will tell you the dealer\'s name and ask you first');
    expect(text).toContain('Consent is not required to buy anything');
  });
  it('names the one dealer once a dealer signs', () => {
    const text = serviceDisclosure({ ...m, seller_display_name: 'Example Dealer' });
    expect(text).toContain('one local dealer, Example Dealer');
    expect(smsDisclosure({ ...m, seller_display_name: 'Example Dealer' })).toContain('My Home Water System (Aidren LLC) and Example Dealer');
  });
});
