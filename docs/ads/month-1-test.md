# Month 1 ad test: $1,500, Google Search, three cities

Status: DRAFT. Nothing is live and no money is spent until Clint creates the account and turns it on.
Approved budget: $1,500 for the first month (Clint, 2026-11-25, option B).

## Why these three cities

Each is a large metro whose utility-published hardness reaches the USGS "very hard" class (over
180 mg/L), and each has a live site. Figures are the ranges on file in `content/locations.ts`.

| City | Site | Published hardness, mg/L | Budget |
| --- | --- | --- | --- |
| Phoenix | phoenixhomewatersystems.com | 172 to 302 | $500 |
| Las Vegas | vegaswatersystems.com | 280 | $500 |
| San Antonio | sanantoniohomewatersystems.com | 257 to 342 | $500 |

$500 a month is about $16.67 a day per campaign (500 / 30). Google can spend more than the daily
figure on some days; check its billing help page for the current rule before relying on the daily number.

No source on file for cost per click or cost per lead in these markets. The test exists to measure it.

## Settings for each campaign

- Type: Search only. Turn off Display Network and Search Partners.
- Locations: the metro (Phoenix metro, Las Vegas metro, San Antonio metro).
- Location option: "Presence: people in or regularly in your included locations". Not "presence or interest".
  Five of the six fake requests so far came from other states.
- Final URL: the city site home page, for example `https://phoenixhomewatersystems.com/`.
- Tracking: leave auto-tagging on (Google adds gclid). Add to Final URL suffix:
  `utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}`
- Bidding for the first two weeks: Maximize clicks with a max CPC cap. After 15 or more real leads, consider
  Maximize conversions. (Our own rule, not a Google figure.)
- Ad schedule: all hours to start.

## Keywords (phrase match), per city, replace [city]

water softener [city] / water softener installation / hard water [city] / hard water treatment /
whole house water filter / whole house water filtration / reverse osmosis system installation /
water treatment system [city] / water filtration system for home

## Negative keywords (all campaigns)

diy, how to, salt, pellets, filter replacement, cartridge, pitcher, refrigerator, fridge, amazon, home depot,
lowes, walmart, costco, jobs, job, career, salary, rental, rent, repair manual, pdf, reddit, youtube, free, used

## Responsive search ad (per city, replace [City])

Headlines (30 characters or fewer each; check the count in Google Ads):
- Hard Water in [City]?
- [City] Water Hardness, Sourced
- Water Softeners in [City]
- Whole Home Water Filtration
- See Your Utility's Hardness
- Request a Local Quote
- Reverse Osmosis Systems

Descriptions (90 characters or fewer each):
- See your city's hardness as the utility publishes it, then request a water treatment quote.
- Softeners, whole-home filters and drinking water systems. Tell us about your home.

Do not add "free", "licensed", "certified", "best" or a price. None of these are on file.

## Measuring it

- Each lead now stores the ad click ID (gclid) and campaign tags, and its Notion row gets the tag
  `mhws-src-google-ads`. Fake-looking leads get `mhws-check-*` tags.
- Weekly: a real lead (Clint or Ryan reached a homeowner) is uploaded to Google Ads as an offline
  conversion by gclid, so Google learns from real leads, not form fills. The CSV can be pulled from D1.
- Scorecard per city at the end of the month: spend, clicks, form requests, requests with no check tag,
  homeowners reached, leads sold, revenue. Cost per real lead = spend / homeowners reached.

## Blockers before turning it on

1. A Google Ads account (none found in the cgf.solutions inbox).
2. Turnstile: the Cloudflare API token needs Account > Turnstile > Edit, then run "Turnstile widgets (manual)".
3. What the page promises (see STATUS.md 2026-11-25). In these three cities the form now says no local
   company is set up, which will cut paid conversions.
