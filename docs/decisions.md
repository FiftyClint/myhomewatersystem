# Decision log

| Date | Decision | Owner | Rationale |
|---|---|---|---|
| 2026-10-18 | Build for both business models, chosen per market in config. No model is selected yet. | Clint | Keep the option open until dealer conversations show which is viable. |
| 2026-10-18 | n8n excluded. | Clint | Owner directive in the plan. |
| 2026-10-18 | HighLevel is the CRM (existing account, CGF sub-account connected). Default: new pipeline in the CGF sub-account unless a separate sub-account is chosen. | Claude (proposed) | Already paid for and connected; has pipelines, workflows, SMS/email, calendars. Separate sub-account is still open (cost unknown). |
| 2026-10-18 | Cloudflare Workers + D1 + Cron Triggers for site, intake and ledger. | Claude (proposed) | Account already hosts 22 Workers. Avoids a new vendor. Supabase stays available if Postgres is needed later. |
| 2026-10-18 | Server-rendered site inside the Worker instead of a separate Astro build. | Claude (proposed) | One deployable, no extra build tool. Can move to Astro later if content grows. |
| 2026-10-18 | Follow-up messages (acknowledgement, day 1/3/7/14) run as HighLevel workflows, not code. | Claude (proposed) | One sender, one suppression list, HighLevel handles STOP natively. Code only tags contacts. |
| 2026-10-18 | AI triage/drafting deferred until the rules-based flow is live. | Claude (proposed) | Plan section 20 ordering. Anthropic API access not confirmed. |
| 2026-10-18 | Domains myhomewatersystem.com and kcwatersystems.com recorded as ownership_unknown. | Claude | Both are registered (GoDaddy availability check); no registrar records found in Gmail. |
