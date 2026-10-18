# Decision log

| Date | Decision | Owner | Rationale |
|---|---|---|---|
| 2026-10-18 | Build for both business models, chosen per market in config. No model is selected yet. | Clint | Keep the option open until dealer conversations show which is viable. |
| 2026-10-18 | Kansas City runs the dealer partner model. Fee model (dealer-funded, appointment fee or install referral) still open until dealer talks. | Clint | Owner decision. |
| 2026-10-18 | n8n excluded. | Clint | Owner directive in the plan. |
| 2026-10-18 | ~~New pipeline in the CGF sub-account.~~ Superseded below. | | |
| 2026-10-18 | HighLevel structure: Clint's own agency account (unlimited sub-accounts), one sub-account per business (My Home Water System, party boats, CGF...). Markets are tags/fields inside a business, not sub-accounts. CGF currently sits under the CRMX agency; moving it is a separate, later project. | Clint + Claude (proposed) | Separate texting registration, sender reputation, permissions, P&L and clean exit per business at no extra base cost. |
| 2026-10-18 | Planned sub-accounts in the new agency: My Home Water System (new), Powered Land Co (split out of CGF, where it is currently a pipeline with 8 opportunities), CGF (transfer from CRMX later). | Clint | Owner direction. PLC move is a data split, not a sub-account transfer. |
| 2026-10-18 | Agents connect per sub-account with a HighLevel Private Integration Token (official HighLevel MCP/API), not through the CRMX connector. | Claude (proposed) | Least privilege per business; does not depend on CRMX after CGF moves. |
| 2026-10-18 | Cloudflare Workers + D1 + Cron Triggers for site, intake and ledger. | Claude (proposed) | Account already hosts 22 Workers. Avoids a new vendor. Supabase stays available if Postgres is needed later. |
| 2026-10-18 | Server-rendered site inside the Worker instead of a separate Astro build. | Claude (proposed) | One deployable, no extra build tool. Can move to Astro later if content grows. |
| 2026-10-18 | Follow-up messages (acknowledgement, day 1/3/7/14) run as HighLevel workflows, not code. | Claude (proposed) | One sender, one suppression list, HighLevel handles STOP natively. Code only tags contacts. |
| 2026-10-18 | AI triage/drafting deferred until the rules-based flow is live. | Claude (proposed) | Plan section 20 ordering. Anthropic API access not confirmed. |
| 2026-10-18 | Domains myhomewatersystem.com and kcwatersystems.com recorded as ownership_unknown. | Claude | Both are registered (GoDaddy availability check); no registrar records found in Gmail. |
