# My Home Water System

Lead intake, routing and money ledger for a homeowner water-treatment business. One codebase runs either business model, chosen per market in config:

- **dealer_partner**: a local dealer sells, installs and services. We qualify the request, route it to the named dealer and record the fee we earn.
- **direct**: My Home Water System sells. A subcontracted licensed installer does the install. We record customer payments, installer payouts and equipment cost.

Nothing is deployed. No real customer, dealer or account is touched. See `STATUS.md` for what works, what is mocked and what is blocked.

## Stack (all existing accounts)

| Job | Tool | State |
|---|---|---|
| Contacts, conversations, follow-up, calendars, SMS/email | HighLevel (existing account) | Adapter written, **not yet connected** |
| Website, intake endpoint, provider links, cron worker | Cloudflare Workers (existing account) | Runs locally; not deployed |
| Ledger (consent proof, assignments, fees, payments, jobs) | Cloudflare D1 | Runs locally; no database created in the account |

No n8n. No new vendor.

## Run it

```
npm install
cp .dev.vars.example .dev.vars        # fill in any local values
npm run db:migrate:local
npm run dev                           # http://localhost:8787 (staging, synthetic markets)
npm run demo                          # in a second terminal: synthetic lead-to-fee walkthrough
npm test                              # acceptance tests T01-T20 (applicable ones)
npm run typecheck
npm run preflight                     # lists launch blockers; exits 1 while any remain
```

Staging serves two synthetic markets: ZIP `00001`/`00002` (dealer partner) and `00003` (direct sale). Kansas City is a draft and shows "Not open yet".

## Layout

```
config/markets/        market configs (source of truth for territory, model, providers)
config/policies/       production and staging policy switches (all external actions off)
content/pages.ts       educational page copy with review status
migrations/            D1 schema
src/intake/            form validation, consent capture, durable receipt + outbox
src/domain/            state machine, routing gates, fees, report
src/adapters/          CRM interface, HighLevel adapter, mock
src/worker/            job queue (lease, retry, dead letter), handlers, scheduled checks
src/dealer/            signed single-job links for dealers/installers
src/internal/          coordinator/owner API (bearer token)
src/hooks/             HighLevel workflow webhook (opt-outs, complaints)
src/site/              server-rendered pages
tests/                 acceptance tests on in-memory SQLite
docs/                  decisions, business model, HighLevel setup, runbooks, launch checklist
```
