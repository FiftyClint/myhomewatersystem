import type { CallResult, CrmAdapter, CrmContactInput } from './crm.ts';

// LIVE adapter for HighLevel (LeadConnector API v2).
// Paths and required fields were checked against the HighLevel operation registry on 2026-10-18:
//   POST /contacts/upsert, POST /opportunities/, PUT /opportunities/{id}, POST /contacts/{contactId}/tasks
// NOT YET EXERCISED against a live account. Base URL and Version header must be confirmed in the
// integration spike before this adapter is enabled (see docs/launch-checklist.md).
export interface HighLevelConfig {
  token: string;
  locationId: string;
  pipelineId: string;
  stageMap: Record<string, string>; // our stage name -> HighLevel pipelineStageId
  baseUrl?: string;
  apiVersion?: string;
  timeoutMs?: number;
}

export class HighLevelCrm implements CrmAdapter {
  readonly name = 'highlevel';
  constructor(private cfg: HighLevelConfig, private fetchImpl: typeof fetch = fetch) {}

  private async call<T>(method: string, path: string, body: unknown, idempotent: boolean,
    pick: (json: any) => T | undefined): Promise<CallResult<T>> {
    const url = `${this.cfg.baseUrl ?? 'https://services.leadconnectorhq.com'}${path}`;
    let res: Response;
    try {
      res = await this.fetchImpl(url, {
        method,
        headers: {
          Authorization: `Bearer ${this.cfg.token}`,
          Version: this.cfg.apiVersion ?? '2021-07-28',
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.cfg.timeoutMs ?? 10000),
      });
    } catch (e) {
      // A timeout after sending may still have created the record.
      return idempotent ? { status: 'retryable', error: String(e) } : { status: 'unknown', error: String(e) };
    }
    if (res.status === 429) return { status: 'retryable', error: 'rate limited' };
    if (res.status >= 500) {
      return idempotent ? { status: 'retryable', error: `HTTP ${res.status}` } : { status: 'unknown', error: `HTTP ${res.status}` };
    }
    if (res.status >= 400) return { status: 'fatal', error: `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}` };
    const json = await res.json().catch(() => ({}));
    const value = pick(json);
    if (value === undefined) return { status: idempotent ? 'retryable' : 'unknown', error: 'unexpected response shape' };
    return { status: 'ok', value };
  }

  private stage(name: string): string | undefined {
    return this.cfg.stageMap[name];
  }

  upsertContact(i: CrmContactInput) {
    return this.call('POST', '/contacts/upsert', {
      locationId: this.cfg.locationId, firstName: i.firstName, lastName: i.lastName,
      email: i.email ?? undefined, phone: i.phone ?? undefined, postalCode: i.postalCode,
      timezone: i.timezone, tags: i.tags, source: i.source,
    }, true, (j) => (j?.contact?.id ? { crmContactId: String(j.contact.id) } : undefined));
  }

  createOpportunity(i: { crmContactId: string; name: string; stage: string }) {
    return this.call('POST', '/opportunities/', {
      locationId: this.cfg.locationId, pipelineId: this.cfg.pipelineId, name: i.name,
      pipelineStageId: this.stage(i.stage), status: 'open', contactId: i.crmContactId,
    }, false, (j) => (j?.opportunity?.id ? { crmOpportunityId: String(j.opportunity.id) } : undefined));
  }

  async updateOpportunityStage(i: { crmOpportunityId: string; stage: string; status: 'open' | 'won' | 'lost' }) {
    const stageId = this.stage(i.stage);
    if (!stageId) return { status: 'fatal' as const, error: `no HighLevel stage mapped for ${i.stage}` };
    // Setting the same stage twice is harmless, so this is treated as idempotent.
    return this.call('PUT', `/opportunities/${encodeURIComponent(i.crmOpportunityId)}`, {
      pipelineId: this.cfg.pipelineId, pipelineStageId: stageId, status: i.status,
    }, true, () => null);
  }

  createTask(i: { crmContactId: string; title: string; body: string; dueAt: string }) {
    return this.call('POST', `/contacts/${encodeURIComponent(i.crmContactId)}/tasks`, {
      title: i.title, body: i.body, dueDate: i.dueAt, completed: false,
    }, false, (j) => (j?.task?.id ? { taskId: String(j.task.id) } : undefined));
  }
}
