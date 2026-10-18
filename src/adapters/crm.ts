// The CRM is the operating system for contacts, conversations and follow-up.
// This interface is the only way code touches it, so the vendor stays replaceable.

export type CallResult<T> =
  | { status: 'ok'; value: T }
  | { status: 'retryable'; error: string } // safe to try again
  | { status: 'unknown'; error: string } // may have happened; reconcile before retrying
  | { status: 'fatal'; error: string }; // will not succeed without a human

export interface CrmContactInput {
  firstName: string; lastName: string; email: string | null; phone: string | null;
  postalCode: string; timezone: string; tags: string[]; source: string;
}

export interface CrmAdapter {
  readonly name: string;
  // Upsert is idempotent by email/phone, so an unknown result can be retried.
  upsertContact(input: CrmContactInput): Promise<CallResult<{ crmContactId: string }>>;
  // Not idempotent in HighLevel. An unknown result must be reconciled by a person.
  createOpportunity(input: { crmContactId: string; name: string; stage: string }): Promise<CallResult<{ crmOpportunityId: string }>>;
  updateOpportunityStage(input: { crmOpportunityId: string; stage: string; status: 'open' | 'won' | 'lost' }): Promise<CallResult<null>>;
  createTask(input: { crmContactId: string; title: string; body: string; dueAt: string }): Promise<CallResult<{ taskId: string }>>;
}
