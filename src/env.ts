import type { Sql } from './db/sql.ts';
import type { MarketConfig, Policy } from './domain/config.ts';
import type { CrmAdapter } from './adapters/crm.ts';
import { MockCrm } from './adapters/crm-mock.ts';
import { HighLevelCrm } from './adapters/crm-highlevel.ts';
import type { AppContext } from './worker/context.ts';
import { AnthropicTriageModel } from './agents/anthropic-model.ts';
import kc from '../config/markets/kansas-city.json';
import eastValley from '../config/markets/east-valley.json';
import lasVegasValley from '../config/markets/las-vegas-valley.json';
import sanAntonioArea from '../config/markets/san-antonio-area.json';
import fixtures from '../fixtures/markets.staging.json';
import prodPolicy from '../config/policies/production.json';
import stagingPolicy from '../config/policies/staging.json';
import protectedIds from '../config/protected.json';

export interface Env {
  DB: D1Database;
  ENVIRONMENT: 'staging' | 'production';
  BASE_URL: string;
  LINK_SECRET?: string;
  HASH_PEPPER?: string;
  ADMIN_TOKEN?: string;
  CRM_WEBHOOK_SECRET?: string;
  CRM_PROVIDER?: 'mock' | 'highlevel';
  ALLOW_LIVE_CRM_IN_STAGING?: string;
  HIGHLEVEL_TOKEN?: string;
  HIGHLEVEL_LOCATION_ID?: string;
  HIGHLEVEL_PIPELINE_ID?: string;
  HIGHLEVEL_STAGE_MAP?: string;
  ANTHROPIC_API_KEY?: string;
  FORM_LIMITER?: RateLimit;
}

export const PRODUCTION_MARKETS = [eastValley, lasVegasValley, sanAntonioArea, kc] as unknown as MarketConfig[];
export const STAGING_MARKETS = [...PRODUCTION_MARKETS, ...(fixtures as unknown as MarketConfig[])];

// Live CRM writes need every switch on. Staging can never write to the production HighLevel location.
export function chooseCrm(env: Partial<Env>, policy: Policy): { crm: CrmAdapter; reason: string } {
  if (env.CRM_PROVIDER !== 'highlevel') return { crm: new MockCrm(), reason: 'CRM_PROVIDER is not highlevel' };
  if (!env.HIGHLEVEL_TOKEN || !env.HIGHLEVEL_LOCATION_ID || !env.HIGHLEVEL_PIPELINE_ID) return { crm: new MockCrm(), reason: 'HighLevel credentials incomplete' };
  if (env.ENVIRONMENT === 'production') {
    if (!policy.external_actions_enabled || policy.dry_run) return { crm: new MockCrm(), reason: 'policy has external actions disabled or dry_run on' };
  } else {
    if (env.ALLOW_LIVE_CRM_IN_STAGING !== 'yes') return { crm: new MockCrm(), reason: 'staging live CRM not allowed' };
    if (protectedIds.production_highlevel_location_ids.includes(env.HIGHLEVEL_LOCATION_ID)) {
      return { crm: new MockCrm(), reason: 'staging may not use a production HighLevel location' };
    }
  }
  return {
    crm: new HighLevelCrm({ token: env.HIGHLEVEL_TOKEN, locationId: env.HIGHLEVEL_LOCATION_ID, pipelineId: env.HIGHLEVEL_PIPELINE_ID,
      stageMap: JSON.parse(env.HIGHLEVEL_STAGE_MAP ?? '{}') }),
    reason: 'live',
  };
}

export function buildContext(env: Env, db: Sql = env.DB as unknown as Sql): AppContext & { crmReason: string; env: Env } {
  const staging = env.ENVIRONMENT !== 'production';
  const policy = (staging ? stagingPolicy : prodPolicy) as Policy;
  const { crm, reason } = chooseCrm(env, policy);
  const linkSecret = env.LINK_SECRET ?? (staging ? 'staging-link-secret' : '');
  if (!linkSecret) throw new Error('LINK_SECRET is required in production');
  const triageModel = policy.agents.triage_enabled && env.ANTHROPIC_API_KEY
    ? new AnthropicTriageModel(env.ANTHROPIC_API_KEY, policy.agents.triage_model, policy.agents.triage_effort) : undefined;
  return { db, crm, crmReason: reason, env, policy, linkSecret, baseUrl: env.BASE_URL, triageModel,
    markets: staging ? STAGING_MARKETS : PRODUCTION_MARKETS };
}
