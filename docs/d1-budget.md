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
| Live (a lead in flight): config sync | 37 (one per market) | 0 unless a market's config changed |
| Live: offers past SLA, accepted jobs, holds, job claim | rows in flight only, through indexes | jobs run, 1 exception per new issue |

Idle, per day: 288 ticks x at most 3 = at most 864 rows read, 0.02% of the 5 million limit, and 0
written. That 3 is an upper bound I set, one per index probe; Cloudflare's docs say D1 counts the rows a
query scans, and a lookup that finds nothing scans none, so the real figure may be 0.

While leads are in flight, as an illustration only (not a forecast): 100 accepted jobs and 20 active
dealers make about 37 + 220 = 257 reads a tick, or about 74,000 a day at 288 ticks, 1.5% of the limit.

Before this commit the cron ran every minute and synced config on every tick: 37 x 1,440 = 53,280 reads
a day with nothing in flight.

## Per lead

Measured in the test database: one lead writes 9 table rows at intake and 15 more while its jobs run
(24 in all). Counting each index a write touches, the upper bound is about 150 rows written per lead,
so the 100,000 write limit holds about 660 leads a day. Before this commit each lead also deleted and
re-inserted its market's ZIP rows and scanned the whole ZIP table; it now does that only when the
market's config changed.

## Staging

No cron. Writes happen only on test form posts and deploy migrations.
