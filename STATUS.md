# Status

Last updated: 2026-10-18

## Where things stand
Phase 2 core (plan section 25) is built and tested locally with synthetic data, for **both** business models. Nothing is deployed, no live account has been written to, nobody has been contacted, and no money has been spent.

## Working (tested)
| Area | Evidence |
|---|---|
| Website: home, ZIP check, market page, product education, how it works, dealers, service areas, thank-you | `src/site/`, served by local Worker (`npm run dev`), all routes 200 / 404 as expected |
| Intake: validation, honeypot, consent capture tied to the named party, durable receipt + outbox, replay safety, duplicate detection | `src/intake/`, tests T01-T03, T05 |
| State machine for dealer_partner and direct | `src/domain/states.ts`, tests T11, direct.test.ts |
| Routing with credential, agreement and capacity gates; one live assignment per job enforced by the database | `src/domain/routing.ts`, tests T06, T07, T19 |
| Business-hours SLA with DST | `src/domain/hours.ts`, test T08 |
| Signed single-job dealer/installer links; contact details only after accept | `src/dealer/`, test T12 |
| Fee ledger (dealer mode) and cash ledger (direct mode); earned vs collected | `src/domain/pipeline.ts`, `src/domain/report.ts`, tests T11, T20 |
| Job queue: atomic claim, lease recovery, backoff, dead letter, unknown-result hold | `src/worker/jobs.ts`, tests T09, T10, T18 |
| Scheduled checks: SLA misses, stale status, credential expiry, capacity-hold retry | `src/worker/checks.ts` |
| Opt-out webhook from HighLevel (shared-secret header) | `src/hooks/crm.ts`, test T04 |
| Staging can never write to the production HighLevel location | `src/env.ts`, test T17 |
| Coordinator API: work list, exceptions, transitions, ledger, links, report | `src/internal/api.ts` |
| Launch preflight: lists 14 blockers today | `npm run preflight` |
| Full HTTP walkthrough on the real Workers runtime (local) | `npm run demo`, run 2026-10-18: lead, replay, route, accept, 7 status updates, $600 synthetic fee earned, $0 collected |

`npm test`: 29 passed. `npm run typecheck`: clean.

## Mocked (labeled)
- **CRM**: `MockCrm` everywhere. The HighLevel adapter (`src/adapters/crm-highlevel.ts`) is written against operation paths verified in your HighLevel registry but has **never called the live API**.
- **Dealer notification**: a HighLevel task for the coordinator to forward the link. No direct email/SMS to dealers.
- Market data: only synthetic fixture markets have ZIPs and providers.

## Not built (by design, for now)
- Follow-up message sequences: these belong in HighLevel workflows (docs/highlevel-setup.md), not code.
- AI triage/drafting (plan A4/A5): deferred until the rules-based flow is live; Anthropic API access unconfirmed.
- Ad spend watchdog (T14) and ad integrations: no ad account connected; nothing can spend.
- Model-outage handling (T16): no model in the request path, so nothing to fail.
- Calendar booking integration: dealers book in their own calendar and report "appointment booked" with a reference.
- Retention purge: `lead_receipts.payload_json` keeps the submitted form (needed to retry CRM sync and to show the dealer contact details) with no expiry yet. Retention period needs counsel; purge job comes after.
- Bot protection beyond the honeypot, rate limiting, Cloudflare Access on /internal: launch checklist.

## Test map (plan section 23)
T01 pass, T02 pass, T03 pass, T04 pass, T05 pass, T06 pass, T07 pass, T08 pass (timezone/DST; reminders live in HighLevel), T09 pass, T10 pass, T11 pass, T12 pass, T13 pass, T14 n/a, T15 pass (content guard + launch blockers), T16 n/a, T17 pass, T18 pass, T19 pass, T20 pass.

## Blockers (need you or a third party)
1. Dealer fee model for Kansas City (dealer partner chosen 2026-10-18): dealer-funded, appointment fee or install referral.
2. Dealer/installer selection, credentials, signed agreement, ZIP list.
3. Domain ownership for myhomewatersystem.com and kcwatersystems.com: both registered, owner unknown.
4. Company legal name, phone, email, hours, address.
5. Counsel review of consent text, privacy and terms.
6. Approval to create the HighLevel pipeline and a test sub-account for the integration spike.
7. Approval to create Cloudflare D1 databases and deploy staging.

## Costs
Incurred: $0. Recurring added so far: $0. Planned new vendors: none. I have no verified pricing for D1/Workers usage on your plan or for a separate HighLevel sub-account; check those in the account before approving.

## Next task
Research dossiers (plan step 2): Kansas City utility service areas and a source-backed dealer prospect list in `docs/research/dealer-prospects-template.csv`, with drafts only, no outreach.
