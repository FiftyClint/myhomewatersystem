import { NO_DEALER_ID } from '../domain/no-dealer.ts';
import type { AppContext } from './context.ts';
import { marketById } from './context.ts';
import type { Handler, JobOutcome } from './jobs.ts';
import type { CallResult } from '../adapters/crm.ts';
import { crmStageFor } from '../domain/crm-stages.ts';
import { textsAllowed } from '../domain/config.ts';
import { getAssignment, getOpportunity } from '../domain/repo.ts';
import { route } from '../domain/routing.ts';
import { makeLink } from '../dealer/links.ts';
import { runTriage } from '../agents/run-triage.ts';

const asOutcome = (r: CallResult<unknown>): JobOutcome | null =>
  r.status === 'ok' ? null : r.status === 'retryable' ? { kind: 'retry', error: r.error }
    : r.status === 'unknown' ? { kind: 'unknown', error: r.error } : { kind: 'fatal', error: r.error };

export function handlers(ctx: AppContext): Record<string, Handler> {
  const { db, crm } = ctx;
  const now = () => ctx.now?.() ?? new Date();

  return {
    // W01/W08 support: copy the inquiry into the CRM. Retried from the outbox until it lands.
    async crm_sync(p: { opportunity_id: string }) {
      const opp = await getOpportunity(db, p.opportunity_id);
      if (!opp) return { kind: 'fatal', error: 'opportunity missing' };
      const market = marketById(ctx, opp.market_id);
      const receipt = await db.prepare('SELECT payload_json FROM lead_receipts WHERE id = ?').bind(opp.receipt_id)
        .first<{ payload_json: string }>();
      const form = JSON.parse(receipt!.payload_json);
      if (form.purged) return { kind: 'fatal', error: 'payload purged before CRM sync' };
      const contact = (await db.prepare('SELECT * FROM contacts WHERE id = ?').bind(opp.contact_id).first<{ crm_id: string | null }>())!;

      let crmContactId = contact.crm_id;
      if (!crmContactId) {
        const r = await crm.upsertContact({
          firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone,
          postalCode: form.zip, timezone: market.timezone, source: 'myhomewatersystem.com',
          // HighLevel follow-up workflows key off these tags. SMS workflows must require mhws-sms-ok.
          tags: ['mhws', `mhws-market-${market.slug}`, `mhws-mode-${opp.business_mode}`, `mhws-concern-${opp.concern}`,
            form.consentSms && textsAllowed(market) ? 'mhws-sms-ok' : 'mhws-no-sms', `mhws-state-${opp.state}`],
        });
        const fail = asOutcome(r); if (fail) return fail;
        crmContactId = (r as { value: { crmContactId: string } }).value.crmContactId;
        await db.prepare('UPDATE contacts SET crm_id = ? WHERE id = ?').bind(crmContactId, opp.contact_id).run();
      }
      if (!opp.crm_opportunity_id) {
        const stage = crmStageFor(opp.state)?.stage ?? 'New Inquiry';
        const r = await crm.createOpportunity({
          crmContactId, stage, name: `${form.firstName} ${form.lastName} - ${opp.concern} - ${opp.zip}${opp.market_id === NO_DEALER_ID ? ' - no dealer assigned' : ''}`,
        });
        const fail = asOutcome(r); if (fail) return fail;
        await db.prepare('UPDATE opportunities SET crm_opportunity_id = ? WHERE id = ? AND crm_opportunity_id IS NULL')
          .bind((r as { value: { crmOpportunityId: string } }).value.crmOpportunityId, opp.id).run();
      }
      return { kind: 'done' };
    },

    // Reads the current state at run time, so out-of-order jobs still converge on the latest stage.
    async crm_stage(p: { opportunity_id: string }) {
      const opp = await getOpportunity(db, p.opportunity_id);
      if (!opp) return { kind: 'fatal', error: 'opportunity missing' };
      if (!opp.crm_opportunity_id) return { kind: 'retry', error: 'waiting for crm_sync' };
      const target = crmStageFor(opp.state);
      if (!target) return { kind: 'done' };
      return asOutcome(await crm.updateOpportunityStage({ crmOpportunityId: opp.crm_opportunity_id, ...target })) ?? { kind: 'done' };
    },

    // W03: deterministic routing. A model never picks or activates a provider.
    async route_lead(p: { opportunity_id: string }) {
      const opp = await getOpportunity(db, p.opportunity_id);
      if (!opp) return { kind: 'fatal', error: 'opportunity missing' };
      await route(db, marketById(ctx, opp.market_id), opp.id, now());
      return { kind: 'done' };
    },

    // A4: model reads the free-text note and proposes; the executor only raises internal exceptions.
    async triage(p: { opportunity_id: string }) {
      return runTriage(db, ctx.policy, ctx.triageModel, p.opportunity_id, now());
    },

    // Internal task for the coordinator, carrying the provider's single-job link.
    async notify_provider(p: { assignment_id: string }) {
      const a = await getAssignment(db, p.assignment_id);
      if (!a) return { kind: 'fatal', error: 'assignment missing' };
      if (a.status !== 'offered') return { kind: 'done' };
      const opp = (await getOpportunity(db, a.opportunity_id))!;
      const contact = await db.prepare('SELECT crm_id FROM contacts WHERE id = ?').bind(opp.contact_id).first<{ crm_id: string | null }>();
      if (!contact?.crm_id) return { kind: 'retry', error: 'waiting for crm_sync' };
      const provider = (await db.prepare('SELECT display_name FROM providers WHERE id = ?').bind(a.provider_id).first<{ display_name: string }>())!;
      const token = await makeLink(ctx.linkSecret, a.id, new Date(now().getTime() + 14 * 86400000));
      const r = await crm.createTask({
        crmContactId: contact.crm_id,
        title: `Send new ${a.role === 'dealer' ? 'lead' : 'install'} to ${provider.display_name}`,
        body: `Send this private link to ${provider.display_name}. It shows only this job and lets them report status.\n` +
          `${ctx.baseUrl}/p/${token}\nAcceptance due by ${a.sla_due_at ?? 'n/a'} (UTC).`,
        dueAt: a.sla_due_at ?? now().toISOString(),
      });
      // A duplicate internal task is a nuisance, not a customer harm, so an unknown result is retried.
      if (r.status === 'unknown') return { kind: 'retry', error: r.error };
      return asOutcome(r) ?? { kind: 'done' };
    },
  };
}
