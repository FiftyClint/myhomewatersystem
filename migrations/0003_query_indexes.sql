-- D1 bills every row a query scans. Without these, the every-minute checks and each lead's duplicate
-- check scan whole tables, and the cost grows with every stored lead.
CREATE INDEX zip_codes_market ON zip_codes(market_id);
CREATE INDEX assignments_status ON assignments(status, sla_due_at);
CREATE INDEX opportunities_state ON opportunities(state);
CREATE INDEX opportunities_contact ON opportunities(contact_id, market_id);
CREATE INDEX providers_status ON providers(status);
CREATE INDEX assignments_provider ON assignments(provider_id, assigned_at);
