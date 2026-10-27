# Cloudflare account budget (all Workers on the account)

Checked 2026-10-27 from the code of each repo. Real daily request counts were not read: the
Cloudflare connection that can query analytics rejected its key (error 9106), so every traffic
figure below is per page view, not a measured total.

## Free plan caps (Cloudflare docs, read 2026-10-27)
- Workers: 100,000 requests a day for the whole account, reset 00:00 UTC; error 1027 past it.
  Static asset requests are free only when they do not invoke the Worker. With
  `run_worker_first: true` every file request runs the Worker and counts.
- Static assets default to `Cache-Control: public, max-age=0, must-revalidate`, so a browser
  asks again for the CSS and font on every page view.
- 5 cron triggers per account. D1: 5M rows read and 100k written a day. KV: 100k reads and
  1,000 writes, deletes and lists a day.

## Requests per page view, measured from built pages
| Workers | Sites | Worker requests per view | Why |
|---|---|---|---|
| My Home Water System (mhws) | hub + city sites | 1 | CSS inline, `<link rel="icon" href="data:,">` (test: cron-cost.test.ts) |
| Powered Land Co hub + 18 states | 19 | 4 | HTML, 1 CSS, 1 font, /favicon.ico, all through the Worker (`run_worker_first: true`) |
| Party boat (planned) | 7 | 5 on the home page | HTML, 2 CSS, 1 font, /favicon.ico, same setting |
| usdareapgrant | 1 | 0 for pages | `run_worker_first: ["/api/*"]`; only form posts count |
| poweredlandco-mcp (+staging) | 2 | per tool call | Durable Objects ledger and gate; no cron |

So 100,000 requests a day is about 25,000 Powered Land page views, or 100,000 water page views,
shared across everything above. Bots that fetch only HTML cost 1 each on every site.

## Crons (5 allowed)
- usdareapgrant `*/15`: 96 runs a day. Each run lists KV once (96 lists a day of 1,000).
- mhws production `*/5` once deployed: 288 runs a day, 1 D1 query when idle.
- mhws staging: none. Powered Land's lead jobs run on GitHub Actions, not Cloudflare.
- Total 2 of 5.

## D1, KV, Durable Objects
- D1: only mhws (see d1-budget.md). Idle: at most 864 rows read a day, 0 written.
- KV (usdareapgrant): about 3 writes or deletes per lead, so about 330 leads a day before the
  1,000 write cap. Fine at current volume (inference: no lead counts were read).
- Durable Objects: the MCP Worker only, per call.

## Fixes listed for the other repos (not applied)
Powered Land Co and party boat, each one cuts a request from every page view:
1. Add `<link rel="icon" href="data:,">` (or a real icon file with a long cache) to the base layout.
2. Set Astro `build.inlineStylesheets: 'always'` so the CSS ships inside the HTML.
3. Add `public/_headers` with `/fonts/*` and `/_astro/*` set to
   `Cache-Control: public, max-age=31536000, immutable` (both are fingerprinted or never change).
Result: 1 request per page view and the 301 canonical redirects stay as they are.
The bigger alternative is `run_worker_first: ["/api/*"]`, which makes pages free but drops the
Worker's 301 path cleanup back to the asset handler's 307, the reason the setting exists.
