import type { BusinessHours } from './hours.ts';

export type BusinessMode = 'dealer_partner' | 'direct';
export type Concern = 'hardness' | 'taste_odor' | 'drinking_water' | 'not_sure';
export type DealerCommercialModel = 'dealer_funded' | 'exclusive_lead' | 'appointment_fee' | 'install_referral';

export interface ProviderConfig {
  id: string;
  kind: 'dealer' | 'installer';
  legal_name: string;
  display_name: string;
  status: 'candidate' | 'active' | 'suspended' | 'terminated';
  license_expires_on: string | null; // YYYY-MM-DD, null = not verified
  insurance_expires_on: string | null;
  weekly_capacity: number;
  agreement_version: string | null;
  urgent_contact: string | null;
  synthetic?: boolean;
}

export interface MarketConfig {
  id: string;
  slug: string;
  name: string;
  status: 'draft' | 'active' | 'paused' | 'retired';
  config_version: string;
  launch_approval_id: string | null;
  // null until the owner chooses. A market cannot go active without it.
  business_mode: BusinessMode | null;
  timezone: string;
  zips: string[];
  supported_concerns: Concern[];
  accept_well_water: boolean;
  business_hours: BusinessHours;
  // The party the customer buys from and who installs. Shown in every disclosure.
  seller_display_name: string | null;
  // The market's call-tracking number in E.164 (+1 and ten digits), shown on its city sites.
  // Clint buys these himself. null until bought.
  tracking_phone?: string | null;
  // Clint's call (2026-10-26): take requests before a dealer signs. Each one waits in consent_hold,
  // and the homeowner is asked before it goes to the dealer once one signs.
  accept_before_dealer?: boolean;
  // false: no marketing texts in this market. The form drops the text consent box and the service
  // consent names calls only. Clint's call (2026-10-28) for Texas until SB 140 registration is settled.
  texts_allowed?: boolean;
  // Set at runtime only, never in a config file: production closes a market that has launch blockers,
  // so its pages never show a form that intake would refuse. See buildContext in src/env.ts.
  requests_closed?: boolean;
  dealer_partner?: {
    commercial_model: DealerCommercialModel | null; // null until agreed with the dealer
    // Pipeline state that earns a per-event fee. null for dealer_funded (monthly fee billed outside).
    // exclusive_lead uses dealer_accepted: the fee is earned when the one dealer accepts the lead.
    fee_trigger_state: 'dealer_accepted' | 'appointment_held' | 'installed' | 'collected' | null;
    fee_cents: number;
    // Clint's call (2026-10-28): leads go free to preferred dealers first, as proof before they buy.
    // While on, no dealer fee is earned and a market needs no price to launch. ends_on null means
    // until Clint ends it. The fee settings above are what applies afterward.
    free_proof?: { ends_on: string | null };
    accept_sla_business_minutes: number;
    duplicate_window_days: number;
  };
  direct?: {
    // Standard rates are planning defaults only. Actual amounts are recorded per job.
    standard_installer_payout_cents: number | null;
    accept_sla_business_minutes: number;
    duplicate_window_days: number;
  };
  providers: ProviderConfig[];
}

export interface Policy {
  version: string;
  excluded_orchestrators: string[];
  external_actions_enabled: boolean;
  dry_run: boolean;
  autonomous_spend_increase: false;
  outbound_cold_sms: false;
  autonomous_outbound_voice: false;
  campaign_total_cap_cents: number;
  content_claim_changes_require_review: true;
  max_job_attempts: number;
  disclosure_version: string;
  agents: { triage_enabled: boolean; triage_model: string; triage_effort: 'low' | 'medium' | 'high'; monthly_cap_cents: number };
}

export function slaMinutes(m: MarketConfig): number {
  return m.business_mode === 'direct'
    ? m.direct?.accept_sla_business_minutes ?? 30
    : m.dealer_partner?.accept_sla_business_minutes ?? 30;
}

export function duplicateWindowDays(m: MarketConfig): number {
  return m.business_mode === 'direct'
    ? m.direct?.duplicate_window_days ?? 90
    : m.dealer_partner?.duplicate_window_days ?? 90;
}

// at is an ISO date or timestamp. The proof period runs through ends_on inclusive.
export function freeProofActive(m: MarketConfig, at: string): boolean {
  const fp = m.business_mode === 'dealer_partner' ? m.dealer_partner?.free_proof : undefined;
  return !!fp && (!fp.ends_on || at.slice(0, 10) <= fp.ends_on);
}

export const textsAllowed = (m: MarketConfig): boolean => m.texts_allowed !== false;

// Clint's call (2026-10-27): every water site shows a live request form, with or without a phone number.
// A market takes requests unless paused, retired or closed at runtime, once it has a business mode and
// either a named seller or the hold for requests that arrive before a dealer signs.
export function takesRequests(m: MarketConfig): boolean {
  if (m.requests_closed || !m.business_mode) return false;
  if (m.status !== 'draft' && m.status !== 'active') return false;
  return m.business_mode === 'direct' || !!m.seller_display_name || !!m.accept_before_dealer;
}

// Problems that block a market from taking real requests. Empty list = launchable config.
export function marketLaunchBlockers(m: MarketConfig, today = new Date().toISOString()): string[] {
  const out: string[] = [];
  if (!m.business_mode) out.push('business_mode not chosen');
  if (m.zips.length === 0) out.push('no approved ZIP codes');
  const holding = m.business_mode === 'dealer_partner' && m.accept_before_dealer && !m.seller_display_name;
  if (!m.seller_display_name && !holding) out.push('no named seller/installer for disclosures');
  if (!m.launch_approval_id) out.push('no launch approval recorded');
  // A phone number is optional (Clint, 2026-10-27: "We can add numbers later"). Pages show none until set.
  if (m.tracking_phone && !/^\+1\d{10}$/.test(m.tracking_phone)) out.push('tracking phone number is not in +1XXXXXXXXXX form');
  const free = freeProofActive(m, today);
  if (m.business_mode === 'dealer_partner' && !free && !m.dealer_partner?.commercial_model) out.push('dealer fee model not agreed');
  if (m.business_mode === 'dealer_partner' && !free && m.dealer_partner?.fee_trigger_state && !(m.dealer_partner.fee_cents > 0)) out.push('dealer fee amount not set');
  if (m.business_mode === 'direct' && !m.direct) out.push('direct-mode terms missing');
  const kind = m.business_mode === 'direct' ? 'installer' : 'dealer';
  const active = m.providers.filter((p) => p.kind === kind && p.status === 'active' && !p.synthetic);
  if (active.length === 0 && !holding) out.push(`no active verified ${kind}`);
  for (const p of active) {
    if (!p.license_expires_on) out.push(`${p.id}: license not verified`);
    if (!p.insurance_expires_on) out.push(`${p.id}: insurance not verified`);
    if (!p.agreement_version) out.push(`${p.id}: no signed agreement version`);
    if (!p.urgent_contact) out.push(`${p.id}: no urgent-service contact`);
  }
  return out;
}
