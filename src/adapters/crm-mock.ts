import type { CallResult, CrmAdapter, CrmContactInput } from './crm.ts';

// MOCK. Records calls in memory. Used in staging, tests and while live access is not authorized.
export class MockCrm implements CrmAdapter {
  readonly name = 'mock';
  contacts = new Map<string, CrmContactInput>();
  opportunities = new Map<string, { crmContactId: string; name: string; stage: string; status: string }>();
  tasks: { crmContactId: string; title: string; body: string; dueAt: string }[] = [];
  // Test hooks: force the next call of a method to return a given failure.
  failNext: Partial<Record<keyof CrmAdapter, CallResult<never>>> = {};
  private seq = 0;

  private take(method: keyof CrmAdapter): CallResult<never> | undefined {
    const f = this.failNext[method];
    delete this.failNext[method];
    return f;
  }

  async upsertContact(input: CrmContactInput) {
    const f = this.take('upsertContact'); if (f) return f;
    const existing = [...this.contacts.entries()].find(([, c]) =>
      (input.email && c.email === input.email) || (input.phone && c.phone === input.phone));
    const id = existing?.[0] ?? `mock-contact-${++this.seq}`;
    this.contacts.set(id, input);
    return { status: 'ok' as const, value: { crmContactId: id } };
  }

  async createOpportunity(input: { crmContactId: string; name: string; stage: string }) {
    const f = this.take('createOpportunity'); if (f) return f;
    const id = `mock-opp-${++this.seq}`;
    this.opportunities.set(id, { ...input, status: 'open' });
    return { status: 'ok' as const, value: { crmOpportunityId: id } };
  }

  async updateOpportunityStage(input: { crmOpportunityId: string; stage: string; status: 'open' | 'won' | 'lost' }) {
    const f = this.take('updateOpportunityStage'); if (f) return f;
    const o = this.opportunities.get(input.crmOpportunityId);
    if (!o) return { status: 'fatal' as const, error: 'unknown opportunity' };
    o.stage = input.stage; o.status = input.status;
    return { status: 'ok' as const, value: null };
  }

  async createTask(input: { crmContactId: string; title: string; body: string; dueAt: string }) {
    const f = this.take('createTask'); if (f) return f;
    this.tasks.push(input);
    return { status: 'ok' as const, value: { taskId: `mock-task-${++this.seq}` } };
  }
}
