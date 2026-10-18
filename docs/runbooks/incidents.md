# Incidents and recovery

| Situation | What the system does | What a person does |
|---|---|---|
| HighLevel down | Intake still saves the lead. `crm_sync` retries with backoff (5 attempts), then dead-letters with an exception. | Once HighLevel is back, requeue dead jobs: `UPDATE jobs SET status='queued', attempts=0 WHERE status='dead' AND job_type='crm_sync'` via `wrangler d1 execute`. |
| CRM call timed out after possibly creating a record | Job goes to `unknown_result` with a high exception. No automatic resend. | Search HighLevel for the contact. If the opportunity exists, copy its ID into `opportunities.crm_opportunity_id` and mark the job done. If not, requeue. |
| D1 unavailable | Form shows "We could not save your request" (503). Never claims success. | Check Cloudflare status. |
| Dealer unavailable | Leads go to capacity_hold once capacity or credentials fail. | Set the dealer `status` to `suspended` in config and deploy. Pause ads. |
| Bad public content | n/a | Roll back the deploy (see deploy-rollback.md). Keep the bad version for review. |
| Opt-out/complaint | HighLevel webhook marks the contact suppressed and opens an exception. | Confirm HighLevel DND is set on all channels. |
| Leaked link or token | n/a | Rotate `LINK_SECRET` (invalidates every provider link) or `ADMIN_TOKEN`, then reissue links with `/internal/link`. |
| Worker crash mid-job | The job lease expires after 60s and another run picks it up. | Nothing, unless an exception appears. |

Backups: D1 Time Travel is the restore mechanism to verify on the actual plan before launch. Run one restore drill to a scratch database before taking real leads.
