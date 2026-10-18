// Dealer-partner unit economics (plan section 8). Every input comes from a quote, an agreement or
// measured pilot data. Nothing here has a default; missing inputs are an error, not a guess.
export interface EconInputs {
  fee_cents: number; // what the dealer pays us per billable event
  billable_event: 'qualified_lead' | 'held_appointment' | 'paid_install';
  cost_per_raw_lead_cents: number; // measured ad cost per raw inquiry
  qualify_rate: number; // raw -> qualified (0-1)
  book_rate: number; // qualified -> booked appointment
  hold_rate: number; // booked -> held
  install_rate: number; // held -> paid install
  coordination_cost_per_qualified_cents: number; // coordinator time per qualified lead
  required_contribution_cents: number; // what Clint wants to keep per billable event
}

export interface EconResult {
  raw_leads_per_event: number;
  acquisition_cost_per_event_cents: number;
  coordination_cost_per_event_cents: number;
  contribution_per_event_cents: number;
  max_cost_per_raw_lead_cents: number; // the most you can pay per raw lead and still keep the required contribution
  viable: boolean;
}

function check(i: EconInputs) {
  for (const k of ['qualify_rate', 'book_rate', 'hold_rate', 'install_rate'] as const) {
    if (!(i[k] > 0 && i[k] <= 1)) throw new Error(`${k} must be between 0 and 1`);
  }
  for (const k of ['fee_cents', 'cost_per_raw_lead_cents', 'coordination_cost_per_qualified_cents', 'required_contribution_cents'] as const) {
    if (!Number.isFinite(i[k]) || i[k] < 0) throw new Error(`${k} must be a non-negative number`);
  }
}

export function economics(i: EconInputs): EconResult {
  check(i);
  // Raw leads needed per billable event, by how deep in the funnel the fee is earned.
  const perQualified = 1 / i.qualify_rate;
  const funnel = { qualified_lead: 1, held_appointment: 1 / (i.book_rate * i.hold_rate), paid_install: 1 / (i.book_rate * i.hold_rate * i.install_rate) };
  const qualifiedPerEvent = funnel[i.billable_event];
  const rawPerEvent = perQualified * qualifiedPerEvent;
  const acq = rawPerEvent * i.cost_per_raw_lead_cents;
  const coord = qualifiedPerEvent * i.coordination_cost_per_qualified_cents;
  const contribution = i.fee_cents - acq - coord;
  const maxCpl = (i.fee_cents - coord - i.required_contribution_cents) / rawPerEvent;
  return {
    raw_leads_per_event: rawPerEvent,
    acquisition_cost_per_event_cents: Math.round(acq),
    coordination_cost_per_event_cents: Math.round(coord),
    contribution_per_event_cents: Math.round(contribution),
    max_cost_per_raw_lead_cents: Math.max(0, Math.floor(maxCpl)),
    viable: contribution >= i.required_contribution_cents,
  };
}

// Plan's stress test: conversion 30% lower and ad cost 25% higher. Test shocks, not forecasts.
export function stressed(i: EconInputs): EconResult {
  return economics({ ...i, cost_per_raw_lead_cents: i.cost_per_raw_lead_cents * 1.25,
    qualify_rate: i.qualify_rate * 0.7, book_rate: i.book_rate, hold_rate: i.hold_rate, install_rate: i.install_rate });
}
