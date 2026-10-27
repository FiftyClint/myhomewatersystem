# Status

Last updated: 2026-10-27

## 2026-10-27 18:45 UTC: Powered Land Co duplicate copy rules on the water sites (staging)

- Clint asked for the same de-duplication rules as Powered Land Co. Ported from poweredlandco scripts/check-duplicate-copy.mjs, src/lib/noindex.mjs and README "The guards" to `scripts/check-duplicate-copy.ts`, run by `tests/duplicate-copy.test.ts` on every test run.
- Rule: no 40-word run of visible `<main>` text shared by two sites, or by two indexable pages on one site. Lowercase words, no name swapping. Skipped: `data-boilerplate` (the request and ZIP forms, and the who-you-are-working-with disclosure, as PLC skips its legal disclaimer) and `data-citations`. About, legal and the four guides are identical everywhere, so city and state sites serve them noindex with a self canonical (`src/site/noindex.ts`); the hub keeps them indexable. About left the city sitemaps. State sites send /contact/ to the hub's.
- Rewritten so nothing collides: city home and FAQ sections around each city's own figures and utility, contact pages, by-area figure lines and closing note, the chloramine filter answer, state site city lists, hub market pages. Result: 0 shared passages across 109 indexable pages on 47 sites.
- Old measure (8-word runs, names swapped): median 56% before, 34% after (24-42%). Table: /mnt/project-files/water-systems/duplicate-text-plc-2026-10-27.csv.

## 2026-10-27 15:30 UTC: water-by-area pages (staging)

- New `/by-area/` page on 8 city sites where the water differs across town: Kansas City (by utility), Scottsdale (3 road zones), Seattle (Cedar and Tolt), Los Angeles (5 LADWP zones), San Diego (3 plants plus purchased water), Philadelphia (3 plants plus the mixed area), Mesa (3 zones) and Madison (22 wells).
- Each section says where it serves, shows that area's published figures and sources, and the USGS reading. Linked from the home page, sitemap.xml and llms.txt; WebPage JSON-LD with citations.
- Data in `content/areas.ts`; evidence rows `*-A-*` and `MAD-W-*` in docs/research/evidence.csv. San Diego facts now carry the published grains per gallon.
- No area page where the utility publishes no geography: Cincinnati, Houston, Baltimore, Indianapolis, Oklahoma City, Denver, Chicago, and the single-system cities.
- Mesa's zone line in words is from the 2017 report; the 2025 report shows zones on a map only.

## 2026-10-27 15:00 UTC: local figures and local questions on every city site (staging)

- New hardness figures: Chicago (2014, newest the city has published), Baltimore (2022 lab analyses), New Braunfels (NBU's own range, matches 2017 data). Fort Worth moved to 2024 data (Fort Worth Water's wholesale-customer table).
- Still no published number after the utility reports, state data and USGS: Atlanta, Miami, Jacksonville (JEA site behind a bot check), McAllen, Oklahoma City, Pittsburgh, Tucson. Each page says so and names the nearest authoritative source. Dallas (2003), Jersey City (2022) and Nashville (2023 data) have no newer figure.
- content/local-details.ts: sourced source water, disinfectant, softening, seasonal, by-area and which-utility details for 46 of 47 cities (Jacksonville none), each with an evidence row. City FAQ adds grains per gallon, nearby-city comparison and those details, with source links; mirrored in FAQPage JSON-LD, llms.txt and water.json.
- Text shared with a typical other site, after swapping names: median 71% before, 57% after (41-64%). Table: /mnt/project-files/water-systems/duplicate-text-2026-10-27.csv.

## Where things stand
**2026-10-27 14:10 UTC Live forms on every site; Jersey and Tampa Bay added (staging only):** Clint: every site takes requests now and phone numbers come later. One rule (takesRequests) drives pages and intake: a draft market with no dealer takes requests through the accept_before_dealer hold (consent names only My Home Water System, nothing routed, lead held for Ryan). No-dealer pages say a local specialist will contact the homeowner, with no time promise. A missing phone is no longer a launch blocker; pages with no number show no phone line. Production still shows "Not open yet" for any market with launch blockers (every market today lacks a launch approval), so going live stays a per-market yes. New sites: jerseywatersystems.com read as Jersey City (Veolia/JCMUA 2022 report, the newest readable) and tampabaywatersystems.com read as the City of Tampa (2024 report), 48 sites in all. Idle D1 unchanged: a held lead is not live work, so the idle tick stays one lookup (at most 864 reads a day, 0 writes, production only; staging has no cron). Staging deployed 14:10 UTC without migration 0003, because D1 is still over today's free read limit from the 02:30 incident until 00:00 UTC. A live staging form post at 14:12 UTC hit that limit and showed a raw Worker error; form posts now catch database errors and show the try-again page. KC and Denver posts pass end to end against the local database stand-in (consent_hold, consent names only My Home Water System). The live staging test and migration 0003 wait for the reset.

**2026-10-27 11:00 UTC Idle cron cut to near zero (not deployed):** production cron now every 5 minutes, not every minute. An idle tick runs one index lookup and returns; config sync, checks and the job queue run only while a lead is in flight. The form post, dealer links and CRM hook drain the queue themselves, so a lead routes at once. The dealer credential check runs once a day from the deployed config with no table reads. Idle: at most 864 rows read a day (was 53,280), 0 written. See `docs/d1-budget.md`.

**2026-10-27 10:45 UTC D1 budget rule and indexes (not deployed):** Clint's rule: no deploy until the daily D1 reads and writes for every scheduled job and database call are worked out, and no scheduled job writes unless something changed. The math is in `docs/d1-budget.md`. Idle production cron: 53,280 rows read a day (1.1% of the limit), 0 written. Migration 0003 adds six indexes so no lead or cron query scans a growing table (nine did; `tests/query-plans.test.ts` now fails on any), and a lead no longer rewrites its market's ZIP rows unless the config changed. Migration 0003 is not applied on staging yet: it needs the next staging deploy with migrations on, after the 00:00 UTC reset.

**2026-10-27 02:30 UTC D1 daily limits used up (staging):** the staging Worker inherited the every-minute cron, and each tick deleted and re-inserted every market's ZIP rows: about 3,000 rows written and 55,000 read per tick once the 37 markets went to staging at 00:12 UTC. Free-plan D1 allows 100,000 written and 5 million read per day; writes ran out at 00:38 and reads at 02:00 UTC. Fixed in code: the cron sync now writes only markets whose config changed (a tick with no change writes nothing; test added), and staging has no cron. Deployed to staging 2026-10-27 10:29 UTC with migrations skipped (run 40488859766, version 1922eef8). The deploy log lists no schedule for mhws-staging; the 00:28 UTC deploy before it listed `* * * * *`. Production is not deployed and still has the cron in wrangler.toml, where it now writes only on change. Only the two mhws databases exist in the account, so the PoweredLandCo and REAP Workers do not use D1.
**2026-10-27 36 new sites built, hub reworked (staging only):** 33 new city sites (Allentown through Tucson), lawatersystems.com as a 301 alias of losangeleswatersystems.com, and californiawatersystems.com as a California directory. Each city is its own draft market (Dallas and Fort Worth share dallas-fort-worth), with no tracking number, no fee and no dealer, so every page shows "Not open yet". Hardness comes from each utility's own documents, copied as published with period and source, 43 new evidence rows. No published figure found for Atlanta, Baltimore, Chicago, Jacksonville, McAllen, Miami or Oklahoma City; those pages say so. Dallas's newest published figure is from 2003 and Fort Worth's from 2022, labeled. Every site now has an answer card with the USGS class and a hardness scale, question headings, a table of contents, WebPage JSON-LD, /llms.txt, /water.json, a sitemap with lastmod, and a robots.txt that names and allows AI assistant crawlers (staging stays Disallow all). The hub leads with "How hard is your water? Published hardness for N U.S. cities", a city table, /hard-water-by-city/, /data/cities.json (Dataset JSON-LD) and /llms.txt. Every footer says we are not a water utility. `npm test` 87 passed. The new domains' nameservers still read carlos/kristina at the registry (00:09 UTC); Cloudflare assigned priscilla/sonny to their zones. Production not deployed, nothing bought or sent.
**2026-10-26 staging deployed:** the Deploy (manual) workflow ran for staging at 23:03 UTC (run 40417089168) and passed every step: tests, both D1 migrations, upload, the Worker's four secrets made, and /healthz answered ok. Staging is at https://mhws-staging.clint-bfa.workers.dev, marked noindex. The hub and all nine city previews load with the right market number, and their about, contact and sitemap pages answer. Every city shows "Not open yet" in place of the form, because no market is active until your launch go. Nameservers at the .com registry (Verisign RDAP, 23:06 UTC): kcwatersystems.com points at Cloudflare; the other nine still list GoDaddy's nameservers, last changed 2026-10-18. Production not deployed, no DNS records changed, launch policy untouched.
**2026-10-26 domains on Cloudflare:** all ten domains (hub plus nine city) were added to your Cloudflare account on the Free plan at 22:32 UTC. Every one was assigned the nameservers carlos.ns.cloudflare.com and kristina.ns.cloudflare.com and sits at pending until GoDaddy points at them. The zones hold no DNS records yet, so any email at GoDaddy on these domains stops when the nameservers change unless its records are copied first. Nothing changed at GoDaddy and nothing deployed.
**2026-10-26 launch prep:** both Cloudflare D1 databases exist (mhws-staging, mhws-production) and their IDs are in wrangler.toml. Production lists all ten domains, apex and www, as custom domains; the bare hub domain forwards to www. Form posts are rate limited. Staging previews a city site at /__site/<domain>. The deploy workflow (on the default branch, so it shows under Actions) sets staging's address, makes the Worker's own secrets once, and checks /healthz. Preflight lists 6 blockers, all Clint's go: policy external actions and dry run, and a launch approval per market. `npm test` 76 passed. Nothing deployed, no DNS touched, nothing bought or sent. Phone forwarding is the last step before go-live.

**2026-10-26 23:23 UTC nameservers:** registry shows nine of ten on carlos/kristina.ns.cloudflare.com. chandlerwatersystems.com is still on GoDaddy nameservers. phoenixhomewatersystems.com (owned, not in the build, no Cloudflare zone) was also switched to Cloudflare nameservers.

**2026-10-26 Phoenix added (Clint's yes):** phoenixhomewatersystems.com is a standalone city site in its own market `phoenix` (status draft, not open). City page carries the City of Phoenix 2025 report hardness (172-302 ppm, 10-17.6 gpg, range only). 41 ZIPs included; 85086 and 85087 held as check (under half their land is in Phoenix city). No tracking number yet: buying one needs Clint's yes, and preflight lists it as a blocker. Cloudflare zone created 23:38 UTC, pending until GoDaddy points at priscilla/sonny; the production deploy may fail on the Phoenix route until the zone is active. No dealer contacted.

**2026-10-26 23:38 UTC Cloudflare:** all ten zones read active (activated 22:43-23:27 UTC). phoenixhomewatersystems.com zone created (Free, no records imported), status pending; Cloudflare assigned priscilla.ns.cloudflare.com and sonny.ns.cloudflare.com, so GoDaddy must be changed from carlos/kristina to those two.




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
2. Dealers: no notes go out (Clint, 2026-10-26). Each dealer hears first through a live lead sent by hand after the homeowner agrees to that named dealer; credentials and agreement go in once a dealer wants more. ZIP lists are done. Target lists (unvetted, nobody contacted) are in the shared folder water-systems/launch/.
3. Domains: confirmed yours on 2026-10-26 and added to Cloudflare the same day (Free plan, pending). You change each domain's nameservers at GoDaddy to carlos.ns.cloudflare.com and kristina.ns.cloudflare.com; first confirm none of them has email at GoDaddy.
3a. Tracking numbers: done 2026-10-26. One per market, shared by its city sites: 913-286-7027 Kansas City, 602-962-2652 East Valley, 725-525-0811 Las Vegas Valley, 726-204-2386 San Antonio area. Call forwarding to Ryan is the last step before go-live.
3b. City facts are unreviewed drafts; a named reviewer must check them against the sources. (NBU's 2026-10-15 boil water notice covered about 600 Copper Ridge customers after a main break and was lifted 2026-10-16.)
4. hello@myhomewatersystem.com forwards to clint@cgf.solutions once the domain is on Cloudflare. No hours and no mailing address are shown, by your call.
5. Consent text approved 2026-10-26. Privacy and terms text was drafted 2026-10-26 and waits on your approval; the pages stay marked draft until then.
6. Approval to create the HighLevel pipeline and a test sub-account for the integration spike.
7. D1 databases created 2026-10-26. You create the Cloudflare API token and save it with the account ID as GitHub secrets; the deploy workflow runs only when you start it.

## Costs
Incurred: $0. Two empty D1 databases were created 2026-10-26; I have no verified D1 price for your plan. Recurring added so far: $0. Planned new vendors: none. I have no verified pricing for D1/Workers usage on your plan or for a separate HighLevel sub-account; check those in the account before approving.

## Research (drafts, unreviewed, nobody contacted)
- Pilot dealer target lists, 2026-10-24, in the shared folder water-systems/launch/: East Valley 13 (9 AZ ROC licenses confirmed by name), Las Vegas Valley 12 (9 NV NSCB confirmed), San Antonio area 15 (2 TCEQ confirmed), Kansas City 12 (none checked). Source URLs on every row. Ratings are thin; Google and Yelp were not readable.
- `docs/research/dealer-prospects.csv` / `.md`: 20 KC prospects verified on their own sites. License fields filled 2026-10-18 from the Johnson County and KCMO public lookups (see `kc-licensing.md`). Insurance is not publicly verifiable. KS/MO Secretary of State searches were blocked here and still need a manual run.
- `docs/research/kc-licensing.md`: licensing by jurisdiction plus a per-prospect check. Dragonfly and JF Denney are active in both JoCo and KCMO. None of the 7 water-treatment specialists has a public contractor license on record. Whether a softener install needs a permit or license is unclear in every jurisdiction; ask each building department.
- `docs/research/kc-utility-dossier.md` + `evidence.csv`: 37 sourced claims. Hardness published for BPU, WaterOne, Independence; not for KC Water (current) or Lee's Summit; Olathe site blocked access.
- `docs/research/dealer-scorecard.md`, `dealer-outreach-draft.md`: drafts, not used. Clint decided 2026-10-26 that no notes go out.

## Next task
- Waiting on owner: create the My Home Water System sub-account and token; Anthropic API key to run the live eval.
- Done: license verification (docs/research/kc-licensing.md). Licensed plumbing companies lead the shortlist; dealer gate now requires the dealer or a named subcontracted plumber to hold the city license.
- Waiting on owner: approval to send dealer outreach (drafts delivered in chat, not saved).
- Next build: dealer status-chase drafts (A5-lite) on the same pattern.

## 2026-10-26 23:45 UTC: zones for the remaining water domains
- RDAP: all 46 water domains at the registry show carlos/kristina.ns.cloudflare.com.
- Created Cloudflare Free zones (no records) for 35 domains that had none. Cloudflare assigned priscilla/sonny.ns.cloudflare.com to all 35 and to phoenixhomewatersystems.com.
- Owner step: switch those 36 at GoDaddy to priscilla/sonny. The original ten are correct on carlos/kristina.

- 2026-10-27 11:10 UTC: account-wide free plan check written to docs/account-budget.md. Water pages now cost one Worker request each (empty inline icon, tested). Powered Land and party boat cost 4 to 5 requests per page view through `run_worker_first: true`; fixes listed there, not applied. Crons 2 of 5. Analytics not read (Cloudflare connection key rejected).
