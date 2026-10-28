# D1 row budget

Cloudflare's free plan allows 100,000 rows written and 5,000,000 rows read per database per UTC day.
D1 bills every row a query scans, and every index a write touches counts as another written row.

Rule: before any deploy, recompute this page for every scheduled job and every database call. No
scheduled job writes unless something changed. Nothing deploys with a cron until this math is current.

## What happened on 2026-10-27

Staging inherited the production every-minute cron. Each tick deleted and re-inserted every market's
ZIP rows: about 3,000 rows written and 55,000 read per tick with 37 markets. Writes ran out at 00:38 UTC
and reads at 02:00 UTC. Staging now has no cron, and the sync writes only markets whose config changed.

## Production cron, every 5 minutes (288 ticks a day)

Counts below are from the code as of this commit, with the indexes in `migrations/0003_query_indexes.sql`.
`tests/query-plans.test.ts` fails if any lead or cron query scans a table other than `markets`, and
`tests/cron-cost.test.ts` fails if an idle tick runs more than one query or writes anything.

A new lead is routed the moment it arrives (the form post drains the job queue itself), so the cron is
not on the lead's path. It exists for things that need a clock: a dealer who has not accepted inside the
30 business-minute window, a retry after a failed CRM call, a capacity hold, and a stale job. Every
5 minutes means an unaccepted lead is flagged at most 5 minutes late.

| Tick | Rows read | Rows written |
| --- | --- | --- |
| Idle: one lookup for jobs, offers, accepted work or held leads | 0 found; at most 3 index probes | 0 |
| Once a day at 14:00 UTC: dealer license and insurance dates | from the deployed config, no table reads | 1 per new issue only |
| Live (a lead in flight): config sync | 39 (one per market) | 0 unless a market's config changed |
| Live: offers past SLA, accepted jobs, holds, job claim | rows in flight only, through indexes | jobs run, 1 exception per new issue |

Idle, per day: 288 ticks x at most 3 = at most 864 rows read, 0.02% of the 5 million limit, and 0
written. That 3 is an upper bound I set, one per index probe; Cloudflare's docs say D1 counts the rows a
query scans, and a lookup that finds nothing scans none, so the real figure may be 0.

While leads are in flight, as an illustration only (not a forecast): 100 accepted jobs and 20 active
dealers make about 39 + 220 = 259 reads a tick, or about 74,600 a day at 288 ticks, 1.5% of the limit.

Before 2026-10-27 the cron ran every minute and synced config on every tick: 37 x 1,440 = 53,280 reads
a day with nothing in flight (37 markets then, 39 now).

## Per lead

Measured in the test database: one lead writes 9 table rows at intake and 15 more while its jobs run
(24 in all). Counting each index a write touches, the upper bound is about 150 rows written per lead,
so the 100,000 write limit holds about 660 leads a day. Before this commit each lead also deleted and
re-inserted its market's ZIP rows and scanned the whole ZIP table; it now does that only when the
market's config changed.

## HighLevel (production, once the token is saved)

Calls to HighLevel are made by the jobs a lead already creates, so they add no scheduled work and no D1
rows beyond the per-lead count above. The deploy step that finds or makes the pipeline calls HighLevel
only, not D1.

## Staging

No cron. Writes happen only on test form posts and deploy migrations.

## One free lead per dealer (2026-10-28)

No scheduled work. Each dealer acceptance adds one COUNT over that dealer's own assignments, using the assignments_provider index, so it reads about as many rows as the dealer has leads. Idle use is unchanged: at most 864 reads a day and 0 writes. A free acceptance writes one row fewer than a paid one, because no ledger entry is made.

## Notion lead database (2026-10-28)

Leads go to the Notion database "Water Leads (myhomewatersystem.com)" through the same three jobs the
mock CRM already ran (crm_sync, crm_stage, notify_provider). Notion calls go over the network, not to D1,
so a lead that reaches Notion on the first try writes the same 24 rows (about 150 with index touches) as
before. No scheduled work is added: idle use stays at most 864 rows read a day and 0 written.

If Notion is down, each failed attempt claims and requeues its job: 2 job-row updates, 4 rows counting
the jobs_due index. At most 5 attempts per job (policy max_job_attempts), so the worst case adds
4 retries x 4 rows x 3 jobs = 48 rows per lead, about 200 in all, which still holds about 500 leads a
day under the 100,000 write limit. Retries are picked up by the existing 5-minute cron.
