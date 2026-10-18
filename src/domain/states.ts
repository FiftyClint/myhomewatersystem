import type { BusinessMode } from './config.ts';

export const HOLD_STATES = [
  'invalid', 'duplicate_review', 'out_of_area', 'unsupported_scope', 'consent_hold',
  'capacity_hold', 'no_response', 'declined', 'cancelled', 'disputed',
] as const;

export type State =
  | 'received' | 'qualified' | 'assignment_pending' | 'dealer_accepted'
  | 'appointment_booked' | 'appointment_held' | 'quote_issued' | 'customer_accepted'
  | 'install_scheduled' | 'installed' | 'collected' | 'closed'
  | (typeof HOLD_STATES)[number];

export type Actor = 'system' | 'coordinator' | 'dealer' | 'installer' | 'owner';

type Graph = Partial<Record<State, State[]>>;

// Dealer partner: the dealer runs the sale after accepting.
const DEALER: Graph = {
  received: ['qualified', 'invalid', 'duplicate_review', 'out_of_area', 'unsupported_scope', 'consent_hold'],
  qualified: ['assignment_pending', 'capacity_hold', 'consent_hold'],
  assignment_pending: ['dealer_accepted', 'capacity_hold', 'consent_hold'],
  dealer_accepted: ['appointment_booked', 'quote_issued', 'no_response', 'declined', 'consent_hold'],
  appointment_booked: ['appointment_held', 'cancelled', 'no_response'],
  appointment_held: ['quote_issued', 'declined'],
  quote_issued: ['customer_accepted', 'declined'],
  customer_accepted: ['install_scheduled', 'cancelled'],
  install_scheduled: ['installed', 'cancelled'],
  installed: ['collected', 'disputed'],
  collected: ['closed', 'disputed'],
  duplicate_review: ['qualified', 'invalid'],
  consent_hold: ['qualified'],
  capacity_hold: ['assignment_pending'],
  disputed: ['collected', 'closed'],
  no_response: ['closed'],
  declined: ['closed'],
  cancelled: ['closed'],
};

// Direct sale: we assess, quote and collect. An installer is assigned for the install.
const DIRECT: Graph = {
  received: ['qualified', 'invalid', 'duplicate_review', 'out_of_area', 'unsupported_scope', 'consent_hold'],
  qualified: ['appointment_booked', 'no_response', 'consent_hold'],
  appointment_booked: ['appointment_held', 'cancelled', 'no_response'],
  appointment_held: ['quote_issued', 'declined'],
  quote_issued: ['customer_accepted', 'declined'],
  customer_accepted: ['install_scheduled', 'capacity_hold', 'cancelled'],
  capacity_hold: ['install_scheduled', 'cancelled'],
  install_scheduled: ['installed', 'capacity_hold', 'cancelled'],
  installed: ['collected', 'disputed'],
  collected: ['closed', 'disputed'],
  duplicate_review: ['qualified', 'invalid'],
  consent_hold: ['qualified'],
  disputed: ['collected', 'closed'],
  no_response: ['closed'],
  declined: ['closed'],
  cancelled: ['closed'],
};

// Who may move a record into a state. Outside parties only report what they did.
const DEALER_ACTORS: Partial<Record<State, Actor[]>> = {
  dealer_accepted: ['dealer', 'coordinator'],
  appointment_booked: ['dealer', 'coordinator'],
  appointment_held: ['dealer', 'coordinator'],
  quote_issued: ['dealer', 'coordinator'],
  customer_accepted: ['dealer', 'coordinator'],
  install_scheduled: ['dealer', 'coordinator'],
  installed: ['dealer', 'coordinator'],
  collected: ['dealer', 'coordinator'],
  no_response: ['dealer', 'coordinator'],
  declined: ['dealer', 'coordinator'],
  cancelled: ['dealer', 'coordinator'],
};
const DIRECT_ACTORS: Partial<Record<State, Actor[]>> = {
  installed: ['installer', 'coordinator'],
  // Only we confirm money we collected.
  collected: ['coordinator', 'owner'],
};
const SYSTEM_STATES: State[] = ['qualified', 'assignment_pending', 'capacity_hold', 'consent_hold',
  'invalid', 'duplicate_review', 'out_of_area', 'unsupported_scope'];

// States that need a reference a human can check (calendar ID, invoice number, photo ref).
export const EVIDENCE_REQUIRED: State[] = ['appointment_held', 'installed', 'collected'];

export function graphFor(mode: BusinessMode): Graph {
  return mode === 'direct' ? DIRECT : DEALER;
}

export function canTransition(mode: BusinessMode, from: State, to: State, actor: Actor): { ok: true } | { ok: false; reason: string } {
  const next = graphFor(mode)[from] ?? [];
  if (!next.includes(to)) return { ok: false, reason: `${from} -> ${to} not allowed in ${mode}` };
  if (actor === 'owner' || actor === 'coordinator') return { ok: true };
  if (actor === 'system') {
    return SYSTEM_STATES.includes(to) || to === 'closed' ? { ok: true } : { ok: false, reason: `system cannot set ${to}` };
  }
  const allowed = (mode === 'direct' ? DIRECT_ACTORS : DEALER_ACTORS)[to] ?? [];
  return allowed.includes(actor) ? { ok: true } : { ok: false, reason: `${actor} cannot set ${to}` };
}

export function nextStatesFor(mode: BusinessMode, from: State, actor: Actor): State[] {
  return (graphFor(mode)[from] ?? []).filter((to) => canTransition(mode, from, to, actor).ok);
}
