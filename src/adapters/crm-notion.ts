import type { CallResult, CrmAdapter, CrmContactInput } from './crm.ts';

// LIVE adapter for Notion (Clint, 2026-10-28: "why don't we just hook this up to notion?").
// Writes one row per homeowner request into the Notion database "Water Leads (myhomewatersystem.com)",
// the way usdareapgrant.com writes its Website Leads: POST /v1/pages with an internal integration token,
// Notion-Version 2022-06-28. Other paths used: POST /v1/databases/{id}/query, GET and PATCH /v1/pages/{id},
// PATCH /v1/blocks/{id}/children.
// Contact and opportunity are the same row: upsertContact makes the row, createOpportunity names it and
// sets its Stage. A second request from the same person gets a new row with the same contact fields.
export interface NotionConfig {
  token: string;
  databaseId: string;
  baseUrl?: string;
  timeoutMs?: number;
}

const VERSION = '2022-06-28';

// Notion caps one rich text item at 2,000 characters.
const text = (s: string) => {
  const parts: { type: 'text'; text: { content: string } }[] = [];
  for (let i = 0; i < s.length && parts.length < 50; i += 2000) parts.push({ type: 'text', text: { content: s.slice(i, i + 2000) } });
  return parts;
};
const tagValue = (tags: string[], prefix: string) => tags.find((t) => t.startsWith(prefix))?.slice(prefix.length);

export class NotionCrm implements CrmAdapter {
  readonly name = 'notion';
  // Workers throw "Illegal invocation" when fetch is called as a method of another object, so the default wraps it.
  constructor(private cfg: NotionConfig, private fetchImpl: typeof fetch = (input, init) => fetch(input, init)) {}

  private async call<T>(method: string, path: string, body: unknown, idempotent: boolean,
    pick: (json: any) => T | undefined): Promise<CallResult<T>> {
    let res: Response;
    try {
      res = await this.fetchImpl(`${this.cfg.baseUrl ?? 'https://api.notion.com'}${path}`, {
        method,
        headers: {
          Authorization: `Bearer ${this.cfg.token}`,
          'Notion-Version': VERSION,
          'Content-Type': 'application/json',
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(this.cfg.timeoutMs ?? 10000),
      });
    } catch (e) {
      // A timeout after sending may still have made the row.
      return idempotent ? { status: 'retryable', error: String(e) } : { status: 'unknown', error: String(e) };
    }
    if (res.status === 429 || res.status === 409) return { status: 'retryable', error: `HTTP ${res.status}` };
    if (res.status >= 500) {
      return idempotent ? { status: 'retryable', error: `HTTP ${res.status}` } : { status: 'unknown', error: `HTTP ${res.status}` };
    }
    if (res.status >= 400) return { status: 'fatal', error: `HTTP ${res.status}: ${(await res.text()).slice(0, 300)}` };
    const json = await res.json().catch(() => ({}));
    const value = pick(json);
    if (value === undefined) return { status: idempotent ? 'retryable' : 'unknown', error: 'unexpected response shape' };
    return { status: 'ok', value };
  }

  private contactProps(i: CrmContactInput) {
    const p: Record<string, unknown> = {
      Name: { title: text(`${i.firstName} ${i.lastName}`.trim() || i.email || i.phone || 'Unnamed') },
      ZIP: { rich_text: text(i.postalCode) },
      Source: { rich_text: text(i.source) },
      Tags: { rich_text: text(i.tags.join(', ')) },
      'Texts OK': { checkbox: i.tags.includes('mhws-sms-ok') },
    };
    if (i.email) p.Email = { email: i.email };
    if (i.phone) p.Phone = { phone_number: i.phone };
    const market = tagValue(i.tags, 'mhws-market-');
    if (market) p.Market = { select: { name: market } };
    const concern = tagValue(i.tags, 'mhws-concern-');
    if (concern) p.Concern = { rich_text: text(concern) };
    return p;
  }

  // Looks for the person's row first, so a retry after a timeout finds the row it already made.
  async upsertContact(i: CrmContactInput): Promise<CallResult<{ crmContactId: string }>> {
    const filter = i.email ? { property: 'Email', email: { equals: i.email } }
      : i.phone ? { property: 'Phone', phone_number: { equals: i.phone } } : null;
    if (filter) {
      const found = await this.call('POST', `/v1/databases/${this.cfg.databaseId}/query`,
        { filter, sorts: [{ timestamp: 'created_time', direction: 'descending' }], page_size: 1 }, true,
        (j) => (Array.isArray(j?.results) ? (j.results[0]?.id as string | undefined) ?? '' : undefined));
      if (found.status !== 'ok') return found;
      if (found.value) return { status: 'ok', value: { crmContactId: found.value } };
    }
    return this.call('POST', '/v1/pages', { parent: { database_id: this.cfg.databaseId }, properties: this.contactProps(i) },
      true, (j) => (j?.id ? { crmContactId: String(j.id) } : undefined));
  }

  async createOpportunity(i: { crmContactId: string; name: string; stage: string }): Promise<CallResult<{ crmOpportunityId: string }>> {
    const page = await this.call('GET', `/v1/pages/${encodeURIComponent(i.crmContactId)}`, undefined, true, (j) => (j?.properties ? j : undefined));
    if (page.status !== 'ok') return page;
    const props = page.value.properties;
    const stage = props.Stage?.select?.name as string | undefined;
    const title = ((props.Name?.title ?? []) as { plain_text?: string; text?: { content: string } }[])
      .map((t) => t.plain_text ?? t.text?.content ?? '').join('');
    const set = { Name: { title: text(i.name) }, Stage: { select: { name: i.stage } }, Outcome: { select: { name: 'open' } } };
    // The person's row has no request on it yet, or a retry already put this one there.
    if (!stage || title === i.name) {
      const r = await this.call('PATCH', `/v1/pages/${encodeURIComponent(i.crmContactId)}`, { properties: set }, true, (j) => (j?.id ? j.id : undefined));
      return r.status === 'ok' ? { status: 'ok', value: { crmOpportunityId: i.crmContactId } } : r;
    }
    // A later request from the same person: a new row with the same contact fields.
    const copy: Record<string, unknown> = { ...set };
    for (const k of ['Email', 'Phone', 'ZIP', 'Market', 'Concern', 'Texts OK', 'Tags', 'Source']) {
      const v = props[k];
      if (!v) continue;
      if (v.type === 'email' && v.email) copy[k] = { email: v.email };
      else if (v.type === 'phone_number' && v.phone_number) copy[k] = { phone_number: v.phone_number };
      else if (v.type === 'select' && v.select?.name) copy[k] = { select: { name: v.select.name } };
      else if (v.type === 'checkbox') copy[k] = { checkbox: !!v.checkbox };
      else if (v.type === 'rich_text' && v.rich_text?.length) copy[k] = { rich_text: text(v.rich_text.map((t: any) => t.plain_text ?? '').join('')) };
    }
    return this.call('POST', '/v1/pages', { parent: { database_id: this.cfg.databaseId }, properties: copy }, false,
      (j) => (j?.id ? { crmOpportunityId: String(j.id) } : undefined));
  }

  updateOpportunityStage(i: { crmOpportunityId: string; stage: string; status: 'open' | 'won' | 'lost' }): Promise<CallResult<null>> {
    return this.call('PATCH', `/v1/pages/${encodeURIComponent(i.crmOpportunityId)}`,
      { properties: { Stage: { select: { name: i.stage } }, Outcome: { select: { name: i.status } } } }, true, () => null);
  }

  // The task lands on the person's row: its title in "Next step" and a to-do with the details on the page.
  async createTask(i: { crmContactId: string; title: string; body: string; dueAt: string }): Promise<CallResult<{ taskId: string }>> {
    const id = encodeURIComponent(i.crmContactId);
    const head = await this.call('PATCH', `/v1/pages/${id}`, { properties: { 'Next step': { rich_text: text(i.title) } } }, true, (j) => (j?.id ? j.id : undefined));
    if (head.status !== 'ok') return head;
    return this.call('PATCH', `/v1/blocks/${id}/children`, {
      children: [
        { object: 'block', type: 'to_do', to_do: { rich_text: text(`${i.title} (due ${i.dueAt} UTC)`), checked: false } },
        { object: 'block', type: 'paragraph', paragraph: { rich_text: text(i.body) } },
      ],
    }, false, (j) => (j?.results?.[0]?.id ? { taskId: String(j.results[0].id) } : undefined));
  }
}
