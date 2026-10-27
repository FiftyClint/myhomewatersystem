import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { sqliteDb } from './helpers.ts';
import { syncConfig } from '../src/domain/repo.ts';
import { PRODUCTION_MARKETS } from '../src/env.ts';

// The cron runs every minute in production. D1's free plan allows 100,000 rows written and 5 million
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

  it('staging has no cron', () => {
    const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
    const staging = toml.slice(toml.indexOf('[env.staging]'), toml.indexOf('[env.production]'));
    expect(staging).toContain('triggers = { crons = [] }');
  });
});
