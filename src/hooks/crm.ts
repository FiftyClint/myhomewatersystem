import type { AppContext } from '../worker/context.ts';
import { auditStmt, exceptionStmt } from '../domain/repo.ts';
import { nowIso, timingSafeEqual } from '../util.ts';

// Receives events from a HighLevel workflow "Webhook" action. HighLevel workflow webhooks are not
// signed, so the workflow must send the shared secret in the X-MHWS-Secret header (configured by hand).
// Expected JSON body: { "event": "opt_out" | "wrong_number" | "complaint" | "reply", "crm_contact_id": "...", "channel": "sms" }
export async function crmHook(ctx: AppContext, req: Request, secret: string | undefined): Promise<Response> {
  const given = req.headers.get('x-mhws-secret') ?? '';
  if (!secret || !timingSafeEqual(given, secret)) return new Response('unauthorized', { status: 401 });
  const text = await req.text();
  if (text.length > 8192) return new Response('too large', { status: 413 });
  let body: Record<string, unknown>;
  try { body = JSON.parse(text); } catch { return new Response('bad json', { status: 400 }); }
  const event = String(body.event ?? ''), crmId = String(body.crm_contact_id ?? '');
  if (!crmId) return new Response('missing crm_contact_id', { status: 400 });
  const { db } = ctx;
  const at = nowIso();
  const contacts = (await db.prepare('SELECT id FROM contacts WHERE crm_id = ?').bind(crmId).all<{ id: string }>()).results;

  if (['opt_out', 'wrong_number', 'complaint'].includes(event)) {
    // Suppression is orthogonal to the pipeline. HighLevel enforces DND for its own sends; this
    // keeps the ledger and any other sender in step and tells a person.
    const stmts = contacts.flatMap((c) => [
      db.prepare('UPDATE contacts SET suppressed_at = COALESCE(suppressed_at, ?), suppression_reason = ? WHERE id = ?').bind(at, event, c.id),
      db.prepare(`UPDATE consent_events SET revoked_at = COALESCE(revoked_at, ?) WHERE contact_id = ? AND (purpose = 'marketing' OR channel = ?)`)
        .bind(at, c.id, String(body.channel ?? 'sms')),
      auditStmt(db, 'crm', event, 'contact', c.id, { channel: body.channel }),
    ]);
    stmts.push(exceptionStmt(db, event === 'complaint' ? 'high' : 'low', 'crm_contact', crmId, `crm event: ${event}`, at));
    await db.batch(stmts);
  } else if (event === 'reply') {
    await db.batch([auditStmt(db, 'crm', 'reply', 'crm_contact', crmId)]);
  } else {
    return new Response('unknown event', { status: 400 });
  }
  return new Response(JSON.stringify({ ok: true, matched: contacts.length }), { headers: { 'content-type': 'application/json' } });
}
