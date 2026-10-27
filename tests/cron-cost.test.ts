import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { app, sqliteDb } from './helpers.ts';
import { syncConfig } from '../src/domain/repo.ts';
import { PRODUCTION_MARKETS } from '../src/env.ts';
import worker from '../src/index.ts';
import { hasLiveWork } from '../src/worker/checks.ts';

// The cron runs every 5 minutes in production. D1's free plan allows 100,000 rows written and 5 million
// read per day, so a tick with no config change must write nothing.
describe('cron cost', () => {
  it('writes ZIP rows once, then nothing while the config is unchanged', async () => {
    const db = sqliteDb();
    let batches = 0;
    const batch = db.batch.bind(db);
    db.batch = async (s) => { batches++; return batch(s); };
    await syncConfig(db, PRODUCTION_MARKETS);
    expect(batches).toBe(1);
    const zips = (db.raw.prepare('SELECT COUNT(*) AS n FROM zip_codes').get() as { n: number }).n;
    expect(zips).toBe(PRODUCTION_MARKETS.filter((m) => m.business_mode).reduce((n, m) => n + m.zips.length, 0));
    await syncConfig(db, PRODUCTION_MARKETS);
    await syncConfig(db, PRODUCTION_MARKETS);
    expect(batches).toBe(1);
    const changed = PRODUCTION_MARKETS.map((m) => (m.id === 'phoenix' ? { ...m, zips: m.zips.slice(1) } : m));
    await syncConfig(db, changed);
    expect(batches).toBe(2);
  });

  it('a lead does not rewrite its market when the stored config matches', async () => {
    const t = await app();
    t.db.raw.prepare(`DELETE FROM zip_codes WHERE market_id = 'demo-dealer' AND zip = '00001'`).run();
    await t.submit();
    expect(t.db.raw.prepare(`SELECT COUNT(*) AS n FROM zip_codes WHERE market_id = 'demo-dealer' AND zip = '00001'`).get()).toEqual({ n: 0 });
    vi.useRealTimers();
  });

  it('an idle tick runs one lookup and writes nothing; the daily tick writes only credential issues', async () => {
    const db = sqliteDb();
    const queries: string[] = [];
    let batches = 0;
    const prepare = db.prepare.bind(db), batch = db.batch.bind(db);
    db.prepare = (q) => { queries.push(q); return prepare(q); };
    db.batch = async (s) => { batches++; return batch(s); };
    const env = { DB: db, ENVIRONMENT: 'staging', BASE_URL: 'https://test.local', CRM_PROVIDER: 'mock' } as any;
    const tick = (iso: string) => worker.scheduled({ scheduledTime: Date.parse(iso), cron: '*/5 * * * *' } as any, env);

    await tick('2026-10-27T10:00:00Z');
    expect(queries.length).toBe(1);
    expect(batches).toBe(0);

    queries.length = 0;
    await tick('2026-10-27T14:00:00Z');
    expect(queries.filter((q) => /^\s*SELECT/i.test(q))).toHaveLength(1);
    expect(batches).toBeLessThanOrEqual(1);
  });

  it('live work is seen only while a lead is in flight', async () => {
    const t = await app();
    expect(await hasLiveWork(t.db)).toBe(false);
    await t.submit();
    expect(await hasLiveWork(t.db)).toBe(true);
    vi.useRealTimers();
  });

  it('production runs the cron every 5 minutes, not every minute', () => {
    const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
    expect(toml.slice(0, toml.indexOf('[env.staging]'))).toContain('crons = ["*/5 * * * *"]');
  });

  it('staging has no cron', () => {
    const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
    const staging = toml.slice(toml.indexOf('[env.staging]'), toml.indexOf('[env.production]'));
    expect(staging).toContain('triggers = { crons = [] }');
  });
});
