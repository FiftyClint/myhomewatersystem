# Launch checklist

`npm run preflight` checks the config items automatically. The rest need a person.

## Owner decisions
- [ ] Business model for the first market (dealer_partner or direct)
- [ ] Pilot loss cap, ad budget cap, daily target
- [ ] HighLevel placement (pipeline in CGF vs separate sub-account)
- [ ] Coordinator and backup named; technical maintainer named
- [x] Domain ownership confirmed by Clint on 2026-10-26 for myhomewatersystem.com and the nine city domains in content/sites.ts

## Partner and legal
- [ ] First live lead offered to a dealer per market by hand, after the homeowner agrees to that named dealer (no outreach notes, Clint 2026-10-26)
- [ ] Dealer (or installers) who want more: credentials and insurance verified, dates entered in market config
- [ ] Signed agreement; `agreement_version` entered
- [ ] Approved ZIP list entered
- [x] Consent text approved by Clint on 2026-10-26 (no counsel review, his call); `disclosure_version` owner-approved-2026-10-26
- [ ] Privacy and terms text approved by Clint (drafted 2026-10-26 in src/site/pages.ts); set LEGAL_APPROVED
- [ ] Direct mode only: contractor licensing for our role, customer contract, sales tax, payments, warranty reserve, insurance

## Accounts and config
- [x] Company legal name and email in `config/company.json`; no hours and no address by Clint's call; phone per market
- [ ] hello@myhomewatersystem.com forwarded to clint@cgf.solutions (Cloudflare Email Routing, needs his yes)
- [ ] Cloudflare API token created by Clint and saved with the account ID as GitHub secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID (the deploy workflow is on the default branch, so it already shows under Actions)
- [ ] Phone forwarding for the four numbers: last step before go-live
- [x] D1 databases created 2026-10-26 on Clint's Cloudflare account (the one with the poweredlandco Workers): mhws-staging dc685077-9aae-4beb-81b3-5e5f4d7788b2, mhws-production 91b9be82-4405-4927-9bb0-65a5ec33b1df; IDs in `wrangler.toml`. Tables are created by the deploy workflow's migration step.
- [x] LINK_SECRET, HASH_PEPPER, ADMIN_TOKEN, CRM_WEBHOOK_SECRET: the deploy workflow makes each one once if it is missing (ADMIN_TOKEN and CRM_WEBHOOK_SECRET come from GitHub secrets of the same name when those exist)
- [ ] HIGHLEVEL_TOKEN on mhws-staging (MHWS Test token) and mhws (real token), set by Clint; HIGHLEVEL_LOCATION_ID for production is in `wrangler.toml` (1NdIhzTx9ZJlqnXshDkQ) and is on the staging block list in config/protected.json
- [ ] HighLevel pipeline, workflows and webhook built (docs/highlevel-setup.md); integration spike passed
- [x] `/internal/*` needs the ADMIN_TOKEN bearer token, compared in constant time (src/index.ts); robots.txt disallows it
- [x] Form rate limit: 5 posts a minute per address (FORM_LIMITER binding, both environments), on top of the honeypot
- [ ] Turnstile on the form: later, if spam shows up
- [x] Hub and nine city domains added to Clint's Cloudflare account on the Free plan, 2026-10-26 (status pending, no DNS records yet). All ten were assigned carlos.ns.cloudflare.com and kristina.ns.cloudflare.com.
- [ ] Nameservers changed at GoDaddy for each of the ten domains (Clint, guide Stage 6), after confirming none has email at GoDaddy. The twenty custom domains (apex and www) are already listed in `wrangler.toml`, so the production deploy attaches them once the zones are active.
- [ ] Each city site checked live: home page 200, www goes to the bare domain, sitemap.xml lists only that site, phone number in the header
- [ ] Each site submitted to Google Search Console and Bing Webmaster Tools with its sitemap

## Verification
- [x] `npm test` (76) and `npm run typecheck` pass, 2026-10-26
- [x] Staging deployed 2026-10-26 23:03 UTC (workflow run 40417089168): migrations applied, secrets made, /healthz ok at https://mhws-staging.clint-bfa.workers.dev
- [ ] Staging walkthrough with the coordinator (`npm run demo`)
- [ ] One authorized test record through production, then deleted
- [ ] Restore drill (export D1, restore to a scratch database)
- [ ] Policy flipped: `external_actions_enabled: true`, `dry_run: false`, launch approval ID recorded in market config and docs/decisions.md
