import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import type { Sql, Stmt } from '../src/db/sql.ts';
import { MockCrm } from '../src/adapters/crm-mock.ts';
import type { MarketConfig, Policy } from '../src/domain/config.ts';
import type { AppContext } from '../src/worker/context.ts';
import { syncConfig } from '../src/domain/repo.ts';
import { handlers } from '../src/worker/handlers.ts';
import { runJobs } from '../src/worker/jobs.ts';
import { handleIntake, type IntakeInput } from '../src/intake/intake.ts';
import fixtures from '../fixtures/markets.staging.json';
import policyJson from '../config/policies/staging.json';

// node:sqlite stand-in for D1, with the same transactional batch semantics.
export function sqliteDb(): Sql & { raw: DatabaseSync } {
  const raw = new DatabaseSync(':memory:');
  raw.exec('PRAGMA foreign_keys = ON');
  raw.exec(readFileSync(new URL('../migrations/0001_init.sql', import.meta.url), 'utf8'));
  const clean = (v: unknown[]) => v.map((x) => (x === undefined ? null : x)) as any[];
  const stmt = (q: string, params: unknown[] = []): Stmt & { exec(): { changes: number } } => ({
    bind: (...v: unknown[]) => stmt(q, v),
    first: async <T>() => (raw.prepare(q).get(...clean(params)) as T) ?? null,
    all: async <T>() => ({ results: raw.prepare(q).all(...clean(params)) as T[] }),
    run: async () => ({ meta: { changes: Number(raw.prepare(q).run(...clean(params)).changes) } }),
    exec: () => ({ changes: Number(raw.prepare(q).run(...clean(params)).changes) }),
  });
  return {
    raw,
    prepare: (q) => stmt(q),
    async batch(stmts) {
      raw.exec('BEGIN');
      try {
        const out = stmts.map((s) => ({ meta: (s as ReturnType<typeof stmt>).exec() }));
        raw.exec('COMMIT');
        return out;
      } catch (e) {
        raw.exec('ROLLBACK');
        throw e;
      }
    },
  };
}

export const MARKETS = structuredClone(fixtures) as unknown as MarketConfig[];
export const POLICY = policyJson as Policy;
export const DEALER_MARKET = () => MARKETS.find((m) => m.id === 'demo-dealer')!;
export const DIRECT_MARKET = () => MARKETS.find((m) => m.id === 'demo-direct')!;

export interface TestApp { db: ReturnType<typeof sqliteDb>; crm: MockCrm; ctx: AppContext; clock: { t: Date };
  markets: MarketConfig[]; submit(over?: IntakeInput): ReturnType<typeof handleIntake>; drain(): Promise<number>; }

export async function app(opts: { markets?: MarketConfig[]; now?: Date } = {}): Promise<TestApp> {
  const db = sqliteDb();
  const crm = new MockCrm();
  // Tuesday 2026-10-20 10:00 America/Chicago, inside business hours.
  const clock = { t: opts.now ?? new Date('2026-10-20T15:00:00Z') };
  const markets = opts.markets ?? structuredClone(MARKETS);
  const ctx: AppContext = { db, crm, markets, policy: POLICY, linkSecret: 'test-secret', baseUrl: 'https://test.local', now: () => clock.t };
  await syncConfig(db, markets);
  return {
    db, crm, ctx, clock, markets,
    submit: (over = {}) => handleIntake(form(over), { db, markets, policy: POLICY, hashPepper: 'pepper', requireLaunchable: false, now: clock.t }),
    drain: () => runJobs(db, handlers(ctx), { now: () => clock.t }),
  };
}

export function form(over: IntakeInput = {}): IntakeInput {
  return {
    request_id: crypto.randomUUID(), market: 'demo-dealer', zip: '00001', homeowner: 'yes', concern: 'hardness',
    water_source: 'municipal', first_name: 'Test', last_name: 'Person', contact_method: 'phone',
    phone: '(555) 010-0000', email: 'test.person@example.com', consent_service: 'yes', consent_sms: 'yes', page: '/locations/demo-dealer/',
    ...over,
  };
}

export const count = async (db: Sql, table: string, where = '1=1', ...args: unknown[]) =>
  (await db.prepare(`SELECT COUNT(*) AS n FROM ${table} WHERE ${where}`).bind(...args).first<{ n: number }>())!.n;
