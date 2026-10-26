import type { Sql, Stmt } from '../db/sql.ts';
import { duplicateWindowDays, marketLaunchBlockers, type Concern, type MarketConfig, type Policy } from '../domain/config.ts';
import { HOLD_STATES, type State } from '../domain/states.ts';
import { auditStmt, enqueueStmt, exceptionStmt, syncConfigStmts } from '../domain/repo.ts';
import { needsRouting } from '../domain/pipeline.ts';
import { serviceDisclosure, smsDisclosure } from './disclosure.ts';
import { normalizeEmail, normalizePhone, nowIso, sha256Hex, uuid } from '../util.ts';

export const FORM_VERSION = 'inquiry-v1';
const CONCERNS: Concern[] = ['hardness', 'taste_odor', 'drinking_water', 'not_sure'];
const MAX_FIELD = 200;

export interface IntakeInput { [k: string]: string | undefined }

export type IntakeResult =
  | { status: 'accepted'; opportunityId: string; state: State; recipient: string; mode: 'dealer_partner' | 'direct'; duplicate: boolean; replay: boolean }
  | { status: 'invalid'; errors: Record<string, string>; market?: MarketConfig }
  | { status: 'out_of_area'; zip: string }
  | { status: 'unavailable'; reason: string }
  | { status: 'discarded' }; // bot trap; caller shows a neutral response

interface Clean {
  requestId: string; zip: string; homeowner: boolean; concern: Concern; waterSource: 'municipal' | 'well' | 'unknown';
  firstName: string; lastName: string; contactMethod: 'phone' | 'email'; email: string | null; phone: string | null;
  timing: string; note: string | null; consentService: boolean; consentSms: boolean; page: string;
  utm: Record<string, string>;
}

export function validate(i: IntakeInput): { ok: true; value: Clean } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const s = (k: string) => (i[k] ?? '').trim();
  for (const [k, v] of Object.entries(i)) if ((v ?? '').length > (k === 'note' ? 500 : MAX_FIELD)) errors[k] = 'Too long.';

  const requestId = s('request_id');
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) errors.request_id = 'Please reload the page and try again.';
  const zip = s('zip');
  if (!/^\d{5}$/.test(zip)) errors.zip = 'Enter a 5-digit ZIP code.';
  const homeowner = s('homeowner');
  if (!['yes', 'no'].includes(homeowner)) errors.homeowner = 'Tell us whether you own the home or can approve work on it.';
  const concern = s('concern') as Concern;
  if (!CONCERNS.includes(concern)) errors.concern = 'Choose your main concern.';
  const waterSource = s('water_source');
  if (!['municipal', 'well', 'unknown'].includes(waterSource)) errors.water_source = 'Choose your water source.';
  const firstName = s('first_name'), lastName = s('last_name');
  if (!firstName) errors.first_name = 'Enter your first name.';
  if (!lastName) errors.last_name = 'Enter your last name.';
  const contactMethod = s('contact_method');
  if (!['phone', 'email'].includes(contactMethod)) errors.contact_method = 'Choose how you want to be contacted.';
  const emailRaw = s('email');
  const email = emailRaw ? normalizeEmail(emailRaw) : null;
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.';
  const phoneRaw = s('phone');
  const phone = phoneRaw ? normalizePhone(phoneRaw) : null;
  if (phoneRaw && !phone) errors.phone = 'Enter a 10-digit US phone number.';
  if (contactMethod === 'email' && !email) errors.email = 'Enter your email address.';
  if (contactMethod === 'phone' && !phone) errors.phone = 'Enter your phone number.';
  const consentService = s('consent_service') === 'yes';
  if (!consentService) errors.consent_service = 'We need your permission to share your request and contact you about it.';
  const consentSms = s('consent_sms') === 'yes';
  if (consentSms && !phone) errors.consent_sms = 'Text messages need a phone number.';

  if (Object.keys(errors).length) return { ok: false, errors };
  const utm: Record<string, string> = {};
  for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']) {
    const v = s(k); if (v) utm[k] = v;
  }
  return { ok: true, value: {
    requestId: requestId.toLowerCase(), zip, homeowner: homeowner === 'yes', concern,
    waterSource: waterSource as Clean['waterSource'], firstName, lastName,
    contactMethod: contactMethod as Clean['contactMethod'], email, phone, timing: s('timing') || 'unspecified',
    note: s('note') || null, consentService, consentSms, page: s('page') || '/', utm,
  } };
}

export function findMarket(markets: MarketConfig[], zip: string, requireLaunchable: boolean): MarketConfig | null {
  return markets.find((m) => m.status === 'active' && m.business_mode && m.zips.includes(zip)
    && (!requireLaunchable || marketLaunchBlockers(m).length === 0)) ?? null;
}

// Rule-based only. Hard exclusions come from market config, not from a model.
export function qualify(m: MarketConfig, c: Clean): { state: State; reason?: string } {
  if (!c.homeowner) return { state: 'unsupported_scope', reason: 'not the owner or authorized decision maker' };
  if (c.waterSource === 'well' && !m.accept_well_water) return { state: 'unsupported_scope', reason: 'well water needs a separate assessment' };
  if (!m.supported_concerns.includes(c.concern)) return { state: 'unsupported_scope', reason: `concern ${c.concern} not offered` };
  return { state: 'qualified' };
}

export interface IntakeDeps {
  db: Sql; markets: MarketConfig[]; policy: Policy; hashPepper: string; requireLaunchable: boolean; now?: Date;
}

export async function handleIntake(input: IntakeInput, deps: IntakeDeps): Promise<IntakeResult> {
  if ((input.website ?? '').trim() !== '') return { status: 'discarded' }; // honeypot field humans never see
  const v = validate(input);
  if (!v.ok) return { status: 'invalid', errors: v.errors };
  const c = v.value;
  const { db, policy } = deps;
  const market = findMarket(deps.markets, c.zip, deps.requireLaunchable);
  if (!market) return { status: 'out_of_area', zip: c.zip };
  // Consent is only valid for the party the person saw named on the form.
  if (input.market !== market.id) {
    return { status: 'invalid', errors: { zip: 'This ZIP code is served by a different company than the one shown. Please review the details and submit again.' }, market };
  }
  // With no dealer named yet, the request stays with us (the form's consent text says so).
  const noDealer = market.business_mode === 'dealer_partner' && !market.seller_display_name;
  const recipient = market.seller_display_name ?? 'My Home Water System';

  const replay = await db.prepare(
    'SELECT o.id, o.state FROM lead_receipts r JOIN opportunities o ON o.receipt_id = r.id WHERE r.request_id = ?',
  ).bind(c.requestId).first<{ id: string; state: State }>();
  if (replay) return { status: 'accepted', opportunityId: replay.id, state: replay.state, recipient, mode: market.business_mode!, duplicate: false, replay: true };

  const now = deps.now ?? new Date();
  const at = nowIso(now);
  const emailHash = c.email ? await sha256Hex(`${deps.hashPepper}:${c.email}`) : null;
  const phoneHash = c.phone ? await sha256Hex(`${deps.hashPepper}:${c.phone}`) : null;
  const existing = await db.prepare(
    `SELECT id FROM contacts WHERE (email_hash IS NOT NULL AND email_hash = ?) OR (phone_hash IS NOT NULL AND phone_hash = ?)
     ORDER BY created_at LIMIT 1`,
  ).bind(emailHash, phoneHash).first<{ id: string }>();
  const contactId = existing?.id ?? uuid();

  let { state, reason } = qualify(market, c);
  if (noDealer && state === 'qualified') { state = 'consent_hold'; reason = 'no dealer named yet: ask the homeowner before sharing with a dealer'; }
  let duplicate = false;
  if (existing) {
    const since = new Date(now.getTime() - duplicateWindowDays(market) * 86400000).toISOString();
    const terminal = [...HOLD_STATES.filter((h) => h !== 'duplicate_review' && h !== 'consent_hold' && h !== 'capacity_hold'), 'closed'];
    const open = await db.prepare(
      `SELECT id FROM opportunities WHERE contact_id = ? AND market_id = ? AND created_at >= ?
       AND state NOT IN (${terminal.map(() => '?').join(',')}) LIMIT 1`,
    ).bind(contactId, market.id, since, ...terminal).first<{ id: string }>();
    if (open) { state = 'duplicate_review'; reason = `matches open request ${open.id}`; duplicate = true; }
  }

  const receiptId = uuid(), oppId = uuid();
  const payload = JSON.stringify(c);
  const svcText = serviceDisclosure(market), smsText = smsDisclosure(market);
  const svcHash = await sha256Hex(svcText), smsHash = await sha256Hex(smsText);
  const parties = JSON.stringify(market.business_mode === 'direct' || noDealer ? ['My Home Water System'] : ['My Home Water System', recipient]);

  const stmts: Stmt[] = [
    ...syncConfigStmts(db, [market]),
    db.prepare(
      `INSERT INTO lead_receipts (id, request_id, source, form_version, received_at, payload_hash, payload_json, utm_json)
       VALUES (?, ?, 'website', ?, ?, ?, ?, ?)`,
    ).bind(receiptId, c.requestId, FORM_VERSION, at, await sha256Hex(payload), payload, JSON.stringify(c.utm)),
  ];
  if (!existing) {
    stmts.push(db.prepare(
      'INSERT INTO contacts (id, email_hash, phone_hash, timezone, created_at) VALUES (?, ?, ?, ?, ?)',
    ).bind(contactId, emailHash, phoneHash, market.timezone, at));
  }
  const consent = (channel: string, purpose: string, granted: boolean, text: string, hash: string) =>
    db.prepare(
      `INSERT INTO consent_events (id, contact_id, receipt_id, channel, purpose, named_parties, disclosure_version,
         disclosure_hash, granted, event_time, source_page) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(uuid(), contactId, receiptId, channel, purpose, parties, policy.disclosure_version, hash, granted ? 1 : 0, at, c.page);
  stmts.push(consent(c.contactMethod, 'service', true, svcText, svcHash));
  if (c.phone) stmts.push(consent('sms', 'service', c.consentSms, smsText, smsHash));

  stmts.push(
    db.prepare(
      `INSERT INTO opportunities (id, contact_id, market_id, receipt_id, business_mode, state, hold_reason, concern,
         water_source, zip, state_version, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)`,
    ).bind(oppId, contactId, market.id, receiptId, market.business_mode, state, reason ?? null, c.concern, c.waterSource, c.zip, at, at),
    db.prepare(
      `INSERT INTO state_transitions (id, opportunity_id, from_state, to_state, actor, reason, at)
       VALUES (?, ?, 'received', ?, 'system', ?, ?)`,
    ).bind(uuid(), oppId, state, reason ?? 'rules passed', at),
    // CRM sync runs from the outbox, so a CRM outage never loses the inquiry.
    enqueueStmt(db, 'crm_sync', { opportunity_id: oppId }, `crm_sync:${oppId}`, at, policy.max_job_attempts),
    auditStmt(db, 'system', 'intake', 'opportunity', oppId, { state, market: market.id }),
  );
  if (needsRouting(market.business_mode!, state)) {
    stmts.push(enqueueStmt(db, 'route_lead', { opportunity_id: oppId }, `route:intake:${oppId}`, at, policy.max_job_attempts));
  }
  if (c.note && policy.agents.triage_enabled) {
    stmts.push(enqueueStmt(db, 'triage', { opportunity_id: oppId }, `triage:${oppId}`, at, policy.max_job_attempts));
  }
  if (duplicate) stmts.push(exceptionStmt(db, 'low', 'opportunity', oppId, 'possible duplicate request', at));

  try {
    await db.batch(stmts);
  } catch (e) {
    if (String(e).includes('UNIQUE') && String(e).includes('request_id')) {
      const again = await db.prepare(
        'SELECT o.id, o.state FROM lead_receipts r JOIN opportunities o ON o.receipt_id = r.id WHERE r.request_id = ?',
      ).bind(c.requestId).first<{ id: string; state: State }>();
      if (again) return { status: 'accepted', opportunityId: again.id, state: again.state, recipient, mode: market.business_mode!, duplicate: false, replay: true };
    }
    // Never show success if the record was not stored.
    return { status: 'unavailable', reason: 'storage_error' };
  }
  return { status: 'accepted', opportunityId: oppId, state, recipient, mode: market.business_mode!, duplicate, replay: false };
}
