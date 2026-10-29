import { NO_DEALER_ID, NO_DEALER_MARKET } from '../domain/no-dealer.ts';
import type { Sql } from '../db/sql.ts';
import type { CrmAdapter } from '../adapters/crm.ts';
import type { MarketConfig, Policy } from '../domain/config.ts';
import type { TriageModel } from '../agents/triage.ts';

export interface AppContext {
  db: Sql;
  crm: CrmAdapter;
  markets: MarketConfig[];
  policy: Policy;
  linkSecret: string;
  baseUrl: string;
  triageModel?: TriageModel;
  now?: () => Date;
}

export function marketById(ctx: AppContext, id: string): MarketConfig {
  const m = ctx.markets.find((x) => x.id === id) ?? (id === NO_DEALER_ID ? NO_DEALER_MARKET : undefined);
  if (!m) throw new Error(`market ${id} not in config`);
  return m;
}
