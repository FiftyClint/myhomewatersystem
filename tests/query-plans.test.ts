import { afterEach, describe, expect, it, vi } from 'vitest';
import { app } from './helpers.ts';
import { syncConfig } from '../src/domain/repo.ts';
import { runChecks } from '../src/worker/checks.ts';

// D1 bills every row a query reads, and the cron runs every minute in production. A query that scans a
// table that grows with leads costs more each day until it hits the 5 million daily read limit, so every
// query run by a lead or a cron tick must find its rows through an index. Only the markets table, which
// holds one row per market, may be scanned.
const SMALL = new Set(['markets']);

afterEach(() => vi.useRealTimers());

describe('query plans', () => {
  it('no lead or cron query scans a table that grows', async () => {
    const t = await app();
    const seen = new Set<string>();
    const prepare = t.db.prepare.bind(t.db);
    t.db.prepare = (q: string) => { seen.add(q); return prepare(q); };

    await t.submit();
    await t.submit({ email: 'other.person@example.com', phone: '(555) 010-0001' });
    await t.submit(); // same contact again, so the duplicate check runs
    await t.drain();
    await syncConfig(t.db, t.markets.map((m, i) => (i === 0 ? { ...m, zips: m.zips.slice(1) } : m))); // a changed market
    await runChecks(t.ctx);
    await t.drain();

    const scans: string[] = [];
    for (const q of seen) {
      if (!/^\s*(SELECT|UPDATE|DELETE|WITH)/i.test(q)) continue;
      const plan = t.db.raw.prepare(`EXPLAIN QUERY PLAN ${q}`).all() as { detail: string }[];
      for (const { detail } of plan) {
        const m = /^SCAN (\w+)(?! USING)/.exec(detail);
        if (m && !SMALL.has(m[1]!) && !/USING (COVERING )?INDEX/.test(detail)) scans.push(`${detail}  <=  ${q.replace(/\s+/g, ' ').slice(0, 120)}`);
      }
    }
    expect(scans).toEqual([]);
    expect(seen.size).toBeGreaterThan(10);
  });
});
