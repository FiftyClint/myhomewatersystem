# D1 row budget

Cloudflare's free plan allows 100,000 rows written and 5,000,000 rows read per database per UTC day.
D1 bills every row a query scans, and every index a write touches counts as another written row.

Rule: before any deploy, recompute this page for every scheduled job and every database call. No
scheduled job writes unless something changed. Nothing deploys with a cron until this math is current.

## What happened on 2026-10-27

Staging inherited the production every-minute cron. Each tick deleted and re-inserted every market's
ZIP rows: about 3,000 rows written and 55,000 read per tick with 37 markets. Writes ran out at 00:38 UTC
and reads at 02:00 UTC. Staging now has no cron, and the sync writes only markets whose config changed.

## Production cron, every minute (1,440 ticks a day)

Counts below are from the code as of this commit, with the indexes in `migrations/0003_query_indexes.sql`.
`tests/query-plans.test.ts` fails if any lead or cron query scans a table other than `markets`.

| Query per tick | Rows read per tick | Rows written per tick |
| --- | --- | --- |
| Config sync: read stored markets | 37 (one per market) | 0 unless a market's config changed |
| Offers past their SLA | offers past due | 0, or 1 exception per new issue |
| Accepted jobs with no update in 7 days | 2 per accepted job | 0, or 1 exception per new issue |
| Dealer license and insurance dates | 1 per active dealer | 0, or 1 exception per new issue |
| Capacity holds | 1 per held lead | 1 retry job per held lead per hour |
| Job queue claim | jobs due now | jobs run |

Idle (no leads in flight), per day: 37 x 1,440 = 53,280 rows read, 1.1% of the read limit, and 0 written.

The rest grows with live work, not with stored history. As an illustration only (these are not
forecasts): 100 accepted jobs and 20 active dealers add 220 reads a tick, or 316,800 a day, for a total
near 370,000, about 7% of the read limit.

## Per lead

Measured in the test database: one lead writes 9 table rows at intake and 15 more while its jobs run
(24 in all). Counting each index a write touches, the upper bound is about 150 rows written per lead,
so the 100,000 write limit holds about 660 leads a day. Before this commit each lead also deleted and
re-inserted its market's ZIP rows and scanned the whole ZIP table; it now does that only when the
market's config changed.

## Staging

No cron. Writes happen only on test form posts and deploy migrations.
