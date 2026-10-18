import type { AppContext } from '../worker/context.ts';
import { marketById } from '../worker/context.ts';
import { transition } from '../domain/pipeline.ts';
import { auditStmt, getAssignment } from '../domain/repo.ts';
import { buildReport } from '../domain/report.ts';
import { makeLink } from '../dealer/links.ts';
import type { State } from '../domain/states.ts';
import { nowIso, uuid } from '../util.ts';

const LEDGER_KINDS = ['dealer_fee_credit', 'customer_payment', 'customer_refund', 'installer_payout', 'equipment_cost', 'campaign_spend'] as const;
const DIRECTION: Record<string, 'in' | 'out'> = {
  dealer_fee_credit: 'out', customer_payment: 'in', customer_refund: 'out', installer_payout: 'out', equipment_cost: 'out', campaign_spend: 'out',
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body, null, 2), { status, headers: { 'content-type': 'application/json' } });

// Coordinator/owner API. Protected by a bearer token here; put Cloudflare Access in front in production.
export async function internalApi(ctx: AppContext, req: Request, path: string, actor: 'coordinator' | 'owner'): Promise<Response> {
  const body = req.method === 'POST' ? await req.json().catch(() => ({})) as Record<string, any> : {};
  const { db } = ctx;

  if (path === '/internal/report' && req.method === 'GET') return json(200, await buildReport(db));

  // Coordinator work list. No contact details: those live in HighLevel.
  if (path === '/internal/opportunities' && req.method === 'GET') {
    return json(200, (await db.prepare(`SELECT o.id, o.market_id, o.business_mode, o.state, o.hold_reason, o.concern, o.zip,
        o.state_version, o.crm_opportunity_id, o.created_at, a.id AS assignment_id, a.provider_id, a.status AS assignment_status, a.sla_due_at
      FROM opportunities o LEFT JOIN assignments a ON a.opportunity_id = o.id AND a.status IN ('offered','accepted')
      ORDER BY o.created_at DESC LIMIT 200`).all()).results);
  }

  if (path === '/internal/exceptions' && req.method === 'GET') {
    return json(200, (await db.prepare(`SELECT * FROM exceptions WHERE status = 'open' ORDER BY
      CASE severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END, created_at`).all()).results);
  }

  if (path === '/internal/exceptions/resolve' && req.method === 'POST') {
    const r = await db.prepare(`UPDATE exceptions SET status = 'resolved', resolved_at = ?, resolution = ? WHERE id = ? AND status = 'open'`)
      .bind(nowIso(), String(body.resolution ?? ''), String(body.id ?? '')).run();
    return json(r.meta.changes ? 200 : 404, { resolved: r.meta.changes === 1 });
  }

  if (path === '/internal/transition' && req.method === 'POST') {
    const opp = await db.prepare('SELECT market_id FROM opportunities WHERE id = ?').bind(String(body.opportunity_id)).first<{ market_id: string }>();
    if (!opp) return json(404, { error: 'not_found' });
    const r = await transition(db, marketById(ctx, opp.market_id), {
      opportunityId: String(body.opportunity_id), to: body.to as State, actor, reason: body.reason, evidence: body.evidence,
      expectedVersion: typeof body.expected_version === 'number' ? body.expected_version : undefined,
    });
    return json(r.ok ? 200 : r.error === 'not_found' ? 404 : 409, r);
  }

  // Money facts entered by a person with a reference. Code never invents an amount.
  if (path === '/internal/ledger' && req.method === 'POST') {
    const kind = String(body.kind);
    if (!(LEDGER_KINDS as readonly string[]).includes(kind)) return json(400, { error: 'kind not allowed' });
    const amount = Number(body.amount_cents);
    if (!Number.isInteger(amount) || amount < 0) return json(400, { error: 'amount_cents must be a non-negative integer' });
    if (!body.billing_key || !body.evidence || !body.market_id) return json(400, { error: 'billing_key, evidence and market_id are required' });
    marketById(ctx, String(body.market_id));
    const r = await db.prepare(
      `INSERT INTO ledger_entries (id, billing_key, opportunity_id, market_id, kind, amount_cents, direction, earned_at, received_at, evidence, note)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(billing_key) DO NOTHING`,
    ).bind(uuid(), String(body.billing_key), body.opportunity_id ?? null, String(body.market_id), kind, amount, DIRECTION[kind],
      body.earned_at ?? nowIso(), body.received_at ?? (DIRECTION[kind] === 'in' ? null : nowIso()), String(body.evidence), body.note ?? null).run();
    return json(r.meta.changes ? 201 : 200, { inserted: r.meta.changes === 1, duplicate: r.meta.changes === 0 });
  }

  // Record that money we earned actually arrived.
  if (path === '/internal/ledger/received' && req.method === 'POST') {
    const r = await db.prepare(`UPDATE ledger_entries SET received_at = ?, evidence = COALESCE(evidence, '') || ' | received: ' || ?
       WHERE billing_key = ? AND received_at IS NULL`).bind(body.received_at ?? nowIso(), String(body.evidence ?? ''), String(body.billing_key)).run();
    return json(r.meta.changes ? 200 : 404, { updated: r.meta.changes === 1 });
  }

  if (path === '/internal/suppress' && req.method === 'POST') {
    const r = await db.batch([
      db.prepare(`UPDATE contacts SET suppressed_at = COALESCE(suppressed_at, ?), suppression_reason = ? WHERE id = ?`)
        .bind(nowIso(), String(body.reason ?? 'requested'), String(body.contact_id)),
      db.prepare(`UPDATE consent_events SET revoked_at = COALESCE(revoked_at, ?) WHERE contact_id = ?`).bind(nowIso(), String(body.contact_id)),
      auditStmt(db, actor, 'suppress', 'contact', String(body.contact_id), { reason: body.reason }),
    ]);
    return json(r[0]!.meta.changes ? 200 : 404, { suppressed: r[0]!.meta.changes === 1 });
  }

  if (path === '/internal/link' && req.method === 'POST') {
    const a = await getAssignment(db, String(body.assignment_id));
    if (!a) return json(404, { error: 'not_found' });
    const token = await makeLink(ctx.linkSecret, a.id, new Date(Date.now() + 14 * 86400000));
    return json(200, { url: `${ctx.baseUrl}/p/${token}` });
  }

  return json(404, { error: 'unknown endpoint' });
}
