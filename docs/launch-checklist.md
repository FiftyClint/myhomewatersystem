# Launch checklist

`npm run preflight` checks the config items automatically. The rest need a person.

## Owner decisions
- [ ] Business model for the first market (dealer_partner or direct)
- [ ] Pilot loss cap, ad budget cap, daily target
- [ ] HighLevel placement (pipeline in CGF vs separate sub-account)
- [ ] Coordinator and backup named; technical maintainer named
- [x] Domain ownership confirmed by Clint on 2026-10-26 for myhomewatersystem.com and the nine city domains in content/sites.ts

## Partner and legal
- [ ] Dealer (or installers) selected, credentials and insurance verified, dates entered in market config
- [ ] Signed agreement; `agreement_version` entered
- [ ] Approved ZIP list entered
- [x] Consent text approved by Clint on 2026-10-26 (no counsel review, his call); `disclosure_version` owner-approved-2026-10-26
- [ ] Privacy and terms pages: still marked draft on the site
- [ ] Direct mode only: contractor licensing for our role, customer contract, sales tax, payments, warranty reserve, insurance

## Accounts and config
- [x] Company legal name and email in `config/company.json`; no hours and no address by Clint's call; phone per market
- [ ] hello@myhomewatersystem.com forwarded to Clint's CGF inbox (Cloudflare Email Routing, needs his yes)
- [ ] Cloudflare API token created by Clint and saved with the account ID as GitHub secrets CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID
- [ ] D1 staging and production databases created; IDs in `wrangler.toml`
- [ ] Secrets set: LINK_SECRET, HASH_PEPPER, ADMIN_TOKEN, CRM_WEBHOOK_SECRET, HIGHLEVEL_*
- [ ] HighLevel pipeline, workflows and webhook built (docs/highlevel-setup.md); integration spike passed
- [ ] Cloudflare Access (or equivalent) in front of `/internal/*`
- [ ] Bot protection on the form (Cloudflare Turnstile) and rate limiting
- [ ] DNS for the hub and each city domain (apex and www) points at the Worker as a Workers custom domain (needs Clint's yes)
- [ ] Each city site checked live: home page 200, www goes to the bare domain, sitemap.xml lists only that site, phone number in the header
- [ ] Each site submitted to Google Search Console and Bing Webmaster Tools with its sitemap

## Verification
- [ ] `npm test` and `npm run typecheck` pass
- [ ] Staging walkthrough with the coordinator (`npm run demo`)
- [ ] One authorized test record through production, then deleted
- [ ] Restore drill (export D1, restore to a scratch database)
- [ ] Policy flipped: `external_actions_enabled: true`, `dry_run: false`, launch approval ID recorded in market config and docs/decisions.md
