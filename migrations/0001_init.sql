-- Ledger schema. HighLevel holds contact details and conversations.
-- This database holds receipts, consent proof, assignments, outcomes and money.
-- Times are ISO-8601 UTC strings. Money is integer cents.

CREATE TABLE markets (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  business_mode TEXT NOT NULL CHECK (business_mode IN ('dealer_partner','direct')),
  timezone TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('draft','active','paused','retired')),
  config_json TEXT NOT NULL,
  config_version TEXT NOT NULL,
  launch_approval_id TEXT
);

CREATE TABLE zip_codes (
  zip TEXT NOT NULL,
  market_id TEXT NOT NULL REFERENCES markets(id),
  PRIMARY KEY (zip, market_id)
);

-- Dealers (dealer_partner mode) and installers (direct mode) share one table.
CREATE TABLE providers (
  id TEXT PRIMARY KEY,
  market_id TEXT NOT NULL REFERENCES markets(id),
  kind TEXT NOT NULL CHECK (kind IN ('dealer','installer')),
  legal_name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('candidate','active','suspended','terminated')),
  license_expires_on TEXT,
  insurance_expires_on TEXT,
  weekly_capacity INTEGER NOT NULL DEFAULT 0 CHECK (weekly_capacity >= 0),
  agreement_version TEXT,
  urgent_contact TEXT,
  priority INTEGER NOT NULL DEFAULT 0,
  synthetic INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE lead_receipts (
  id TEXT PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  source TEXT NOT NULL,
  form_version TEXT NOT NULL,
  received_at TEXT NOT NULL,
  payload_hash TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  utm_json TEXT
);

CREATE TABLE contacts (
  id TEXT PRIMARY KEY,
  crm_id TEXT, -- several ledger contacts can map to one CRM contact (shared household phone)
  email_hash TEXT,
  phone_hash TEXT,
  timezone TEXT NOT NULL,
  suppressed_at TEXT,
  suppression_reason TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX contacts_email_hash ON contacts(email_hash);
CREATE INDEX contacts_crm_id ON contacts(crm_id);
CREATE INDEX contacts_phone_hash ON contacts(phone_hash);

CREATE TABLE consent_events (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  receipt_id TEXT NOT NULL REFERENCES lead_receipts(id),
  channel TEXT NOT NULL CHECK (channel IN ('email','phone','sms')),
  purpose TEXT NOT NULL CHECK (purpose IN ('service','marketing')),
  named_parties TEXT NOT NULL,
  disclosure_version TEXT NOT NULL,
  disclosure_hash TEXT NOT NULL,
  granted INTEGER NOT NULL CHECK (granted IN (0,1)),
  event_time TEXT NOT NULL,
  source_page TEXT NOT NULL,
  revoked_at TEXT
);

CREATE TABLE opportunities (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES contacts(id),
  market_id TEXT NOT NULL REFERENCES markets(id),
  receipt_id TEXT NOT NULL UNIQUE REFERENCES lead_receipts(id),
  business_mode TEXT NOT NULL,
  state TEXT NOT NULL,
  hold_reason TEXT,
  concern TEXT NOT NULL,
  water_source TEXT NOT NULL,
  zip TEXT NOT NULL,
  crm_opportunity_id TEXT UNIQUE,
  state_version INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE state_transitions (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id),
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  actor TEXT NOT NULL,
  reason TEXT,
  evidence TEXT,
  at TEXT NOT NULL
);

CREATE TABLE assignments (
  id TEXT PRIMARY KEY,
  opportunity_id TEXT NOT NULL REFERENCES opportunities(id),
  provider_id TEXT NOT NULL REFERENCES providers(id),
  role TEXT NOT NULL CHECK (role IN ('dealer','installer')),
  status TEXT NOT NULL CHECK (status IN ('offered','accepted','released','completed')),
  assigned_at TEXT NOT NULL,
  accepted_at TEXT,
  released_at TEXT,
  sla_due_at TEXT
);
-- One live assignment per opportunity and role. This is the exclusivity guarantee.
CREATE UNIQUE INDEX one_active_assignment
  ON assignments(opportunity_id, role) WHERE status IN ('offered','accepted');

-- Money in and out. Dealer modes: fees we bill the dealer.
-- Direct mode: customer payments, installer payouts, equipment cost, refunds.
CREATE TABLE ledger_entries (
  id TEXT PRIMARY KEY,
  billing_key TEXT NOT NULL UNIQUE,
  opportunity_id TEXT REFERENCES opportunities(id),
  market_id TEXT NOT NULL REFERENCES markets(id),
  kind TEXT NOT NULL CHECK (kind IN (
    'dealer_fee','dealer_fee_credit','customer_payment','customer_refund',
    'installer_payout','equipment_cost','campaign_spend')),
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  direction TEXT NOT NULL CHECK (direction IN ('in','out')),
  agreement_version TEXT,
  triggering_transition_id TEXT,
  earned_at TEXT NOT NULL,
  received_at TEXT,
  evidence TEXT,
  note TEXT
);

CREATE TABLE jobs (
  id TEXT PRIMARY KEY,
  job_type TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('queued','running','done','dead','unknown_result')),
  due_at TEXT NOT NULL,
  lease_until TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 5,
  last_error TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX jobs_due ON jobs(status, due_at);

CREATE TABLE exceptions (
  id TEXT PRIMARY KEY,
  severity TEXT NOT NULL CHECK (severity IN ('low','medium','high','critical')),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
  created_at TEXT NOT NULL,
  resolved_at TEXT,
  resolution TEXT
);
-- One open exception per entity and reason, so scheduled checks do not pile up duplicates.
CREATE UNIQUE INDEX one_open_exception
  ON exceptions(entity_type, entity_id, reason) WHERE status = 'open';

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  detail TEXT,
  at TEXT NOT NULL
);
