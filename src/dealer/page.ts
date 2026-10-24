import type { AppContext } from '../worker/context.ts';
import { marketById } from '../worker/context.ts';
import { readLink } from './links.ts';
import { getAssignment, getOpportunity, exceptionStmt, auditStmt } from '../domain/repo.ts';
import { transition } from '../domain/pipeline.ts';
import { EVIDENCE_REQUIRED, nextStatesFor, type State } from '../domain/states.ts';
import { escapeHtml as e, nowIso } from '../util.ts';

const LABEL: Partial<Record<State, string>> = {
  appointment_booked: 'Appointment booked', appointment_held: 'Assessment completed', quote_issued: 'Quote sent',
  customer_accepted: 'Customer accepted quote', install_scheduled: 'Install scheduled', installed: 'Installed',
  collected: 'Customer paid in full', no_response: 'Could not reach customer', declined: 'Customer declined',
  cancelled: 'Cancelled',
};

export interface PageResult { status: number; title: string; body: string }

// Single-job page for a dealer or installer. The token is the only credential and covers one assignment.
export async function providerPage(ctx: AppContext, token: string, method: string, form: Record<string, string>): Promise<PageResult> {
  const now = ctx.now?.() ?? new Date();
  const link = await readLink(ctx.linkSecret, token, now);
  if (!link) return { status: 404, title: 'Link not valid', body: '<h1>This link is not valid or has expired</h1><p>Ask your coordinator for a new link.</p>' };
  const a = await getAssignment(ctx.db, link.assignmentId);
  if (!a || a.status === 'released') return { status: 410, title: 'No longer assigned', body: '<h1>This job is no longer assigned to you</h1>' };
  const opp = (await getOpportunity(ctx.db, a.opportunity_id))!;
  const market = marketById(ctx, opp.market_id);
  const role = a.role === 'dealer' ? 'dealer' : 'installer';
  let notice = '';

  if (method === 'POST') {
    const action = form.action ?? '';
    const expected = Number(form.version);
    if (action === 'accept' && a.status === 'offered') {
      const accept = ctx.db.prepare(`UPDATE assignments SET status = 'accepted', accepted_at = ? WHERE id = ? AND status = 'offered'`)
        .bind(nowIso(now), a.id);
      if (role === 'dealer') {
        const r = await transition(ctx.db, market, { opportunityId: opp.id, to: 'dealer_accepted', actor: 'dealer', expectedVersion: expected,
          evidence: `accepted via dealer link, assignment ${a.id}`,
          extra: (_o, tid) => [ctx.db.prepare(`UPDATE assignments SET status = 'accepted', accepted_at = ?
             WHERE id = ? AND status = 'offered' AND EXISTS (SELECT 1 FROM state_transitions WHERE id = ?)`).bind(nowIso(now), a.id, tid)] });
        notice = r.ok ? 'Accepted.' : 'This job changed since you opened it. Review the current status below.';
      } else {
        await ctx.db.batch([accept, auditStmt(ctx.db, role, 'accept', 'assignment', a.id)]);
        notice = 'Accepted.';
      }
    } else if (action === 'release' && a.status !== 'completed') {
      // Customer consent named this provider. Moving the job needs a person, and in dealer mode, new consent.
      const to = role === 'dealer' ? 'consent_hold' : 'capacity_hold';
      const r = await transition(ctx.db, market, { opportunityId: opp.id, to, actor: 'system', expectedVersion: expected,
        holdReason: `${a.provider_id} released the job`, reason: (form.reason ?? '').slice(0, 300) || 'released by provider',
        extra: (_o, tid) => [
          ctx.db.prepare(`UPDATE assignments SET status = 'released', released_at = ?
            WHERE id = ? AND EXISTS (SELECT 1 FROM state_transitions WHERE id = ?)`).bind(nowIso(now), a.id, tid),
          exceptionStmt(ctx.db, 'high', 'opportunity', opp.id,
            role === 'dealer' ? 'dealer released lead; new consent needed before another dealer' : 'installer released job; reassign'),
        ] });
      if (r.ok) return { status: 200, title: 'Released', body: '<h1>Released</h1><p>Thanks for letting us know. The coordinator has been notified.</p>' };
      notice = 'This job changed since you opened it.';
    } else if (action.startsWith('state:') && a.status === 'accepted') {
      const to = action.slice(6) as State;
      const r = await transition(ctx.db, market, { opportunityId: opp.id, to, actor: role, expectedVersion: expected,
        evidence: (form.evidence ?? '').slice(0, 500), reason: 'reported via provider link' });
      notice = r.ok ? `Recorded: ${LABEL[to] ?? to}.` : r.error === 'evidence_required'
        ? 'Add a reference we can check (for example a calendar entry, invoice or work order number).'
        : 'That update could not be recorded. The job may have changed. Review the status below.';
    }
  }

  const fresh = (await getOpportunity(ctx.db, opp.id))!;
  const asg = (await getAssignment(ctx.db, a.id))!;
  const receipt = await ctx.db.prepare('SELECT payload_json FROM lead_receipts WHERE id = ?').bind(fresh.receipt_id).first<{ payload_json: string }>();
  const f = JSON.parse(receipt?.payload_json ?? '{}');
  // Contact details appear only after the provider accepts the job.
  const details = asg.status === 'accepted'
    ? `<p><strong>${e(`${f.firstName ?? ''} ${f.lastName ?? ''}`)}</strong><br>Phone: ${e(f.phone ?? 'not given')}<br>Email: ${e(f.email ?? 'not given')}<br>Prefers: ${e(f.contactMethod ?? '')}</p>
       ${f.note ? `<p>Customer note: ${e(f.note)}</p>` : ''}`
    : `<p>${e(f.firstName ?? '')}, ZIP ${e(fresh.zip)}. Contact details appear after you accept.</p>`;
  const actions = asg.status === 'offered'
    ? `<button name="action" value="accept">Accept this job</button> <button class="secondary" name="action" value="release">Decline</button>`
    : nextStatesFor(fresh.business_mode, fresh.state, role).map((s) =>
      `<button class="secondary" name="action" value="state:${s}">${e(LABEL[s] ?? s)}</button>`).join(' ');
  const needsEvidence = nextStatesFor(fresh.business_mode, fresh.state, role).some((s) => EVIDENCE_REQUIRED.includes(s));
  return { status: 200, title: 'Job update', body: `<h1>Job update</h1>${notice ? `<p role="status"><strong>${e(notice)}</strong></p>` : ''}
<p>Concern: ${e(fresh.concern)} &middot; Water source: ${e(fresh.water_source)} &middot; Status: <strong>${e(fresh.state)}</strong></p>${details}
<form method="post"><input type="hidden" name="version" value="${fresh.state_version}">
${asg.status === 'accepted' && needsEvidence ? '<label class="f" for="evidence">Reference (required for assessment completed, installed and paid)</label><input type="text" id="evidence" name="evidence" maxlength="500">' : ''}
<p>${actions || 'No updates needed from you right now.'}</p>
${asg.status === 'accepted' ? '<p class="small"><button class="secondary" name="action" value="release">Release this job</button> if you cannot complete it.</p>' : ''}
</form>` };
}
