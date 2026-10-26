# Status

Last updated: 2026-10-26

## Where things stand
**2026-10-26 owner answers applied:** hello@ forwards to Clint's CGF inbox (address to confirm, set up at the DNS stage). No hours on any site. Consent wording approved (owner-approved-2026-10-26). Every city site reads "[City] Water Systems by My Home Water System". Sites take requests before a dealer signs: the lead is held and nobody is routed until the homeowner agrees to a named dealer. A manual-only deploy workflow is in .github/workflows/deploy.yml and needs Clint's token in GitHub secrets. Preflight lists 11 blockers. `npm test` 70 passed. Nothing deployed, no DNS touched, nothing bought or sent.

**2026-10-26 standalone city sites:** each of the nine city domains now serves its own site: a home page with the city's sourced water facts, a short published-figure answer at the top, seven FAQs with FAQPage JSON-LD, the request form, about and contact pages, and its own sitemap and robots. www goes to the bare domain. The header shows the market's tracking number once it is set. The hub links out to the city sites and 301s its old /locations/<city>/ pages to them. Johnson County (36 ZIPs) is now in Kansas City (104 ZIPs). Contact pages show hello@myhomewatersystem.com and no mailing address. Preflight lists 21 blockers. Nothing deployed, no DNS touched, nothing bought or sent.

**2026-10-24 pilot:** four dealer-partner markets (Phoenix East Valley, Las Vegas Valley, San Antonio area, Kansas City), all status draft, all "sell the leads" at $95 per exclusive lead, earned when the one dealer accepts it (starting price, approved 2026-10-24, expected to change after installer talks). Nine city pages at /locations/<city>/ with sourced utility hardness figures (New Braunfels has none published), four cluster pages, /sitemap.xml, and 301 forwarding from nine city domains to the hub (content/domains.ts). Every city page shows "Not open yet". Nothing deployed, no DNS touched.

**2026-10-24 launch prep:** ZIP lists are set for all four markets (east-valley 36, las-vegas-valley 52, san-antonio-area 60, kansas-city 68), checked against Census ZCTA-to-place shares (docs/research/market-zips.csv), and each city page lists its ZIPs. Johnson County KS is held out of Kansas City until you decide. 85256 (Salt River Pima-Maricopa land) is held out of Scottsdale. Draft consent text names Aidren LLC, covers one dealer, and covers calls and texts about the request (docs/consent-draft.md); it is marked draft-2026-10-24, so preflight blocks launch until counsel signs off. Domain register updated from RDAP: the ten mapped domains are at GoDaddy, registered 2026-10-18, registrant redacted, so ownership is inferred, not verified.

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
| Standalone city sites per domain (home, FAQ and JSON-LD, contact, about, sitemap, robots), hub links out and forwards old city pages; every fact has an evidence row | `content/sites.ts`, `content/locations.ts`, `src/site/city.ts`, `src/site/locations.ts`, tests/locations.test.ts |
| Launch preflight: reads every config/markets/*.json; lists 20 blockers on 2026-10-24 (fee and ZIP blockers cleared; consent-draft blocker added) | `npm run preflight` |
| Dealer economics calculator: raw leads per billable event, contribution, max cost per raw lead, stress test (conversion -30%, ad cost +25%). Reproduces the plan's $200-per-held-appointment illustration | `npm run economics -- inputs.json`, `src/domain/economics.ts` |
| Full HTTP walkthrough on the real Workers runtime (local) | `npm run demo`, run 2026-10-18: lead, replay, route, accept, 7 status updates, $600 synthetic fee earned, $0 collected |

`npm test`: 61 passed (tests/launch-config.test.ts added 2026-10-24 for ZIP lists and consent text; tests/lead-fee.test.ts added for the per-lead fee; tests/locations.test.ts added earlier; tests/helpers.ts now fakes Date so default timestamps match the test clock, which fixed three tests that failed once the real date passed 2026-10-20). `npm run typecheck`: clean.

## Agent layer (built, off by default)
- **Inquiry sorting (A4)**: `src/agents/`. Reads only the concern, water source, timing and free-text note (no name, phone or email). Returns a schema-checked proposal. A deterministic guard can only make handling more careful. The executor only writes an audit row and, when warranted, a coordinator exception (critical for possible leaks). It never changes pipeline state.
- Every call recorded in `agent_runs` with model, prompt version, tokens and cost; a monthly cap stops calls when reached and falls back to manual triage. Model outage or refusal also falls back to manual triage.
- Default model `claude-opus-5-5` at low effort; configurable in `config/policies/*.json`. Pricing used for cost: Opus 5.5 $4/$20, Sonnet 5.5 $2/$10, Haiku 5.5 $0.10/$0.50 per million tokens (Anthropic pricing table, cached 2026-10-06).
- **Eval**: 40 synthetic cases (`fixtures/evals/triage.jsonl`), 14 critical (leaks, health, prompt injection). Gate: 0 critical failures and >=95% correct action. `npm run eval:triage` runs the MOCK keyword model, which FAILS (5 critical misses), showing the gate works. **The real model has not been evaluated**: needs `ANTHROPIC_API_KEY`, then `npm run eval:triage -- --live --confirm`.
- To turn on: API key secret, live eval passes, then `triage_enabled: true` and a `monthly_cap_cents` in the policy (owner approval).

## Mocked (labeled)
- **CRM**: `MockCrm` everywhere. The HighLevel adapter (`src/adapters/crm-highlevel.ts`) is written against operation paths verified in your HighLevel registry but has **never called the live API**.
- **Dealer notification**: a HighLevel task for the coordinator to forward the link. No direct email/SMS to dealers.
- Market data: the four pilot markets have ZIP lists; no market has a verified dealer.

## Not built (by design, for now)
- Follow-up message sequences: these belong in HighLevel workflows (docs/highlevel-setup.md), not code.
- Ad spend watchdog (T14) and ad integrations: no ad account connected; nothing can spend.
- Model-outage handling (T16): no model in the request path, so nothing to fail.
- Calendar booking integration: dealers book in their own calendar and report "appointment booked" with a reference.
- Retention purge: `lead_receipts.payload_json` keeps the submitted form (needed to retry CRM sync and to show the dealer contact details) with no expiry yet. Retention period needs counsel; purge job comes after.
- Bot protection beyond the honeypot, rate limiting, Cloudflare Access on /internal: launch checklist.

## Test map (plan section 23)
T01 pass, T02 pass, T03 pass, T04 pass, T05 pass, T06 pass, T07 pass, T08 pass (timezone/DST; reminders live in HighLevel), T09 pass, T10 pass, T11 pass, T12 pass, T13 pass, T14 n/a, T15 pass (content guard + launch blockers), T16 n/a, T17 pass, T18 pass, T19 pass, T20 pass.

## Blockers (need you or a third party)
1. Monthly fee is not modeled in code. The approved formula (each city's trailing three-month average of accepted leads times $95) is in docs/decisions.md and docs/business-model.md and would be billed by hand until built. The $95 per-lead fee itself is set in all four markets.
2. Dealer selection, credentials and signed agreement for each of the four markets. ZIP lists are done. Target lists (unvetted, nobody contacted) are in the shared folder water-systems/launch/.
3. Domains: confirmed yours on 2026-10-26. DNS for the hub and the nine city domains must point at the Worker before any site serves (needs your yes).
3a. Tracking numbers: done 2026-10-26. One per market, shared by its city sites: 913-286-7027 Kansas City, 602-962-2652 East Valley, 725-525-0811 Las Vegas Valley, 726-204-2386 San Antonio area. Call forwarding to Ryan is set in HighLevel.
3b. City facts are unreviewed drafts; a named reviewer must check them against the sources. (NBU's 2026-10-15 boil water notice covered about 600 Copper Ridge customers after a main break and was lifted 2026-10-16.)
4. hello@myhomewatersystem.com forwards to clint@cgf.solutions once the domain is on Cloudflare. No hours and no mailing address are shown, by your call.
5. Consent text approved 2026-10-26. Privacy and terms text was drafted 2026-10-26 and waits on your approval; the pages stay marked draft until then.
6. Approval to create the HighLevel pipeline and a test sub-account for the integration spike.
7. Approval to create Cloudflare D1 databases and deploy staging. You create the Cloudflare API token and save it as a GitHub secret; the deploy workflow runs only when you start it.

## Costs
Incurred: $0. Recurring added so far: $0. Planned new vendors: none. I have no verified pricing for D1/Workers usage on your plan or for a separate HighLevel sub-account; check those in the account before approving.

## Research (drafts, unreviewed, nobody contacted)
- Pilot dealer target lists, 2026-10-24, in the shared folder water-systems/launch/: East Valley 13 (9 AZ ROC licenses confirmed by name), Las Vegas Valley 12 (9 NV NSCB confirmed), San Antonio area 15 (2 TCEQ confirmed), Kansas City 12 (none checked). Source URLs on every row. Ratings are thin; Google and Yelp were not readable.
- `docs/research/dealer-prospects.csv` / `.md`: 20 KC prospects verified on their own sites. License fields filled 2026-10-18 from the Johnson County and KCMO public lookups (see `kc-licensing.md`). Insurance is not publicly verifiable. KS/MO Secretary of State searches were blocked here and still need a manual run.
- `docs/research/kc-licensing.md`: licensing by jurisdiction plus a per-prospect check. Dragonfly and JF Denney are active in both JoCo and KCMO. None of the 7 water-treatment specialists has a public contractor license on record. Whether a softener install needs a permit or license is unclear in every jurisdiction; ask each building department.
- `docs/research/kc-utility-dossier.md` + `evidence.csv`: 37 sourced claims. Hardness published for BPU, WaterOne, Independence; not for KC Water (current) or Lee's Summit; Olathe site blocked access.
- `docs/research/dealer-scorecard.md`, `dealer-outreach-draft.md`: drafts, not approved, not sent.

## Next task
- Waiting on owner: create the My Home Water System sub-account and token; Anthropic API key to run the live eval.
- Done: license verification (docs/research/kc-licensing.md). Licensed plumbing companies lead the shortlist; dealer gate now requires the dealer or a named subcontracted plumber to hold the city license.
- Waiting on owner: approval to send dealer outreach (drafts delivered in chat, not saved).
- Next build: dealer status-chase drafts (A5-lite) on the same pattern.
