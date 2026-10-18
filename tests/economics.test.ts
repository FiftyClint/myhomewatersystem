import { describe, expect, it } from 'vitest';
import { economics, stressed } from '../src/domain/economics.ts';

// Reproduces the plan's own illustration (section 8): $35 raw lead, 50% qualify, 50% book, 70% attend
// -> ~$200 ad cost per held appointment, so a $150 appointment fee loses money. Illustration only.
const base = { fee_cents: 15000, billable_event: 'held_appointment' as const, cost_per_raw_lead_cents: 3500,
  qualify_rate: 0.5, book_rate: 0.5, hold_rate: 0.7, install_rate: 0.5, coordination_cost_per_qualified_cents: 0, required_contribution_cents: 0 };

describe('dealer economics', () => {
  it('matches the plan illustration: about $200 per held appointment', () => {
    const r = economics(base);
    expect(r.acquisition_cost_per_event_cents).toBe(20000);
    expect(r.viable).toBe(false);
    expect(r.contribution_per_event_cents).toBe(-5000);
  });
  it('computes the most you can pay per raw lead for a target contribution', () => {
    const r = economics({ ...base, fee_cents: 30000, required_contribution_cents: 5000 });
    // (300 - 50) / 5.714 raw leads per held appointment = $43.75
    expect(r.max_cost_per_raw_lead_cents).toBe(4375);
  });
  it('stress test makes things worse, never better', () => {
    const ok = { ...base, fee_cents: 30000 };
    expect(stressed(ok).contribution_per_event_cents).toBeLessThan(economics(ok).contribution_per_event_cents);
  });
  it('rejects missing or impossible inputs instead of guessing', () => {
    expect(() => economics({ ...base, qualify_rate: 0 })).toThrow();
    expect(() => economics({ ...base, fee_cents: Number.NaN })).toThrow();
  });
});
