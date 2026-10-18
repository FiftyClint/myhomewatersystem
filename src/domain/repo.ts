import type { Sql, Stmt } from '../db/sql.ts';
import type { MarketConfig, ProviderConfig } from './config.ts';
import type { State } from './states.ts';
import { nowIso, uuid } from '../util.ts';

export interface OpportunityRow {
  id: string; contact_id: string; market_id: string; receipt_id: string;
  business_mode: 'dealer_partner' | 'direct'; state: State; hold_reason: string | null;
  concern: string; water_source: string; zip: string; crm_opportunity_id: string | null;
  state_version: number; created_at: string; updated_at: string;
}

export interface AssignmentRow {
  id: string; opportunity_id: string; provider_id: string; role: 'dealer' | 'installer';
  status: 'offered' | 'accepted' | 'released' | 'completed';
  assigned_at: string; accepted_at: string | null; released_at: string | null; sla_due_at: string | null;
}

export const getOpportunity = (db: Sql, id: string) =>
  db.prepare('SELECT * FROM opportunities WHERE id = ?').bind(id).first<OpportunityRow>();

export const getAssignment = (db: Sql, id: string) =>
  db.prepare('SELECT * FROM assignments WHERE id = ?').bind(id).first<AssignmentRow>();

export function exceptionStmt(db: Sql, severity: 'low' | 'medium' | 'high' | 'critical',
  entityType: string, entityId: string, reason: string, at = nowIso()): Stmt {
  return db.prepare(
    `INSERT INTO exceptions (id, severity, entity_type, entity_id, reason, status, created_at)
     VALUES (?, ?, ?, ?, ?, 'open', ?) ON CONFLICT DO NOTHING`,
  ).bind(uuid(), severity, entityType, entityId, reason, at);
}

export function auditStmt(db: Sql, actor: string, action: string, entityType: string, entityId: string, detail?: unknown): Stmt {
  return db.prepare('INSERT INTO audit_events (id, actor, action, entity_type, entity_id, detail, at) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .bind(uuid(), actor, action, entityType, entityId, detail === undefined ? null : JSON.stringify(detail), nowIso());
}

export function enqueueStmt(db: Sql, jobType: string, payload: unknown, idempotencyKey: string,
  dueAt = nowIso(), maxAttempts = 5): Stmt {
  return db.prepare(
    `INSERT INTO jobs (id, job_type, payload_json, idempotency_key, status, due_at, attempts, max_attempts, created_at)
     VALUES (?, ?, ?, ?, 'queued', ?, 0, ?, ?) ON CONFLICT(idempotency_key) DO NOTHING`,
  ).bind(uuid(), jobType, JSON.stringify(payload), idempotencyKey, dueAt, maxAttempts, nowIso());
}

// Config in git is the source of truth for markets and providers. This mirrors it into the ledger.
export function syncConfigStmts(db: Sql, markets: MarketConfig[]): Stmt[] {
  const out: Stmt[] = [];
  for (const m of markets) {
    if (!m.business_mode) continue; // not launchable, nothing to store
    out.push(db.prepare(
      `INSERT INTO markets (id, slug, business_mode, timezone, status, config_json, config_version, launch_approval_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET slug=excluded.slug, business_mode=excluded.business_mode,
         timezone=excluded.timezone, status=excluded.status, config_json=excluded.config_json,
         config_version=excluded.config_version, launch_approval_id=excluded.launch_approval_id`,
    ).bind(m.id, m.slug, m.business_mode, m.timezone, m.status, JSON.stringify(m), m.config_version, m.launch_approval_id));
    out.push(db.prepare('DELETE FROM zip_codes WHERE market_id = ?').bind(m.id));
    for (const z of m.zips) out.push(db.prepare('INSERT INTO zip_codes (zip, market_id) VALUES (?, ?)').bind(z, m.id));
    m.providers.forEach((p: ProviderConfig, i: number) => out.push(db.prepare(
      `INSERT INTO providers (id, market_id, kind, legal_name, display_name, status, license_expires_on,
         insurance_expires_on, weekly_capacity, agreement_version, urgent_contact, priority, synthetic)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET market_id=excluded.market_id, kind=excluded.kind,
         legal_name=excluded.legal_name, display_name=excluded.display_name, status=excluded.status,
         license_expires_on=excluded.license_expires_on, insurance_expires_on=excluded.insurance_expires_on,
         weekly_capacity=excluded.weekly_capacity, agreement_version=excluded.agreement_version,
         urgent_contact=excluded.urgent_contact, priority=excluded.priority, synthetic=excluded.synthetic`,
    ).bind(p.id, m.id, p.kind, p.legal_name, p.display_name, p.status, p.license_expires_on,
      p.insurance_expires_on, p.weekly_capacity, p.agreement_version, p.urgent_contact, i, p.synthetic ? 1 : 0)));
  }
  return out;
}

export async function syncConfig(db: Sql, markets: MarketConfig[]): Promise<void> {
  const stmts = syncConfigStmts(db, markets);
  if (stmts.length) await db.batch(stmts);
}
