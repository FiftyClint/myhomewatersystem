# Los Angeles dealer prospects (City of Los Angeles, LADWP area)

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-los-angeles.csv` (14 rows, LA-D-01 to LA-D-14). Contact details are public business channels only.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Market:** City of Los Angeles (ZIPs 90002 to 91607), which includes the San Fernando Valley neighborhoods (Canoga Park, Winnetka, Van Nuys, North Hollywood, Sylmar, Tujunga and others). Companies based just outside the city line (Burbank, Valencia, Pasadena, Monterey Park, Vista) are included only where their own site claims Los Angeles or San Fernando Valley service. Each row's `office_location` says whether the office is inside the city.
- **Manufacturer locators tried:**
  - Pentair True Blue: the dealer list loads only with JavaScript after a location entry, so it could not be read. No static Los Angeles dealer page was found.
  - Kinetico: no static California dealer page loaded (the state URL returned an error). The Van Nuys Kinetico dealer's own site showed a bot-verification page (see exclusions).
  - RainSoft: the Los Angeles page names no dealer and points to a ZIP locator. A Culver City RainSoft listing exists in directories, but no dealer site of its own was found.
  - Culligan: culligan.com dealer page for Sylmar and the Hall's Culligan location list both loaded and led to culliganla.com.
  - Rayne: location pages for Los Angeles, San Fernando Valley, The Valley and Santa Clarita loaded as static pages.
  - EcoWater: the Fullerton "EcoWater of Los Angeles" dealer page and EcoWater SoCal's own site loaded.
  - Hague: the Southern California Hague dealer site (Bellflower) refused automated reading (robots rule), so it was not used.
- **Other sources:** web searches by neighborhood (San Fernando Valley, Westside, Hollywood, Harbor area) and several wordings. HomeAdvisor, Angi, Thumbtack, MapQuest, BBB and two "best of" lists were used only to find names and website addresses, never as evidence. Yelp refused automated reading.
- **Search limit:** the shared web search allowance for this run ran out partway through. Westside, Harbor area and some Valley searches were not completed, so coverage there is thinner than planned.
- **What a row needed:** the company's own website (or its brand location page) confirming it sells and installs residential softeners, RO or whole-home filtration and serves Los Angeles. The URL is in `contact_source_url`.

## Licensing

- **Regulator:** the California Contractors State License Board (CSLB), https://www.cslb.ca.gov/. Los Angeles has no separate city contractor license for this work.
- **Which license applies:** CSLB class **C-55 Water Conditioning Contractor** covers installing water conditioning equipment with only the pipe and fittings needed to connect it and bypass the parts of the system that should not get treated water (https://www.cslb.ca.gov/About_us/Library/Licensing_Classifications/Licensing_Classifications_Detail.aspx?Class=C55). Class **C-36 Plumbing Contractor** also covers maintenance and replacement of "water conditioning equipment" (https://www.cslb.ca.gov/About_us/Library/Licensing_Classifications/Licensing_Classifications_Detail.aspx?Class=C36). The C-61 limited specialty list has no water conditioning subcategory. So a dealer should hold C-55 or C-36 (or a B general license, which was not researched).
- **Lookup result:** not run for any row. The CSLB license check (https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx) has no bot check, but it is a search form, and this brief bars form submissions. Opening a license-detail address directly returned the empty search form, not a record. The CSLB master list download (Data Portal) also works through a form. License number and status are blank in every row, `license_checked_on` is 2026-10-28, and any number a company shows on its own site is in notes as "self-reported".
- **Self-reported numbers:** LA Water Solutions #1142567, Culligan of Los Angeles LIC#982519, A+ Electric & Plumbing CSLB #942404, Hi-Tech Plumbing #1073669, Mike Diamond Services #399170, Monkey Wrench #922757. A person can check these by hand at the CSLB link above.
- **Not checked:** City of Los Angeles (LADBS) permit rules for softener installs, and any local limits on salt-discharging softeners. One third-party page claimed local limits exist but cited no rule, so it was not relied on.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| LA-D-01 | Puroserve | Canoga Park (in city) | Independent | Water treatment specialist since 1959 with Valley, Santa Clarita and West LA lines. Sells softeners, RO and whole-house systems. |
| LA-D-02 | Praz Pure Water | Burbank | Independent | Softener and RO specialist with 20+ years in LA. Published email. Office sits on the city line. |
| LA-D-03 | LA Water Solutions | LA area (no address) | Independent | Whole-house, RO and softener installs across LA. Published email and a self-reported license number, but no address and two phone numbers. |
| LA-D-04 | Pro Water Solutions | Valencia | Independent | Whole-house RO, softener and filtration specialist that names the San Fernando Valley and Bel Air. |
| LA-D-05 | Superior Water (Waterboy) | San Diego HQ | Independent | Founders named. Covers Greater LA, but sells salt-free whole-house systems only. |
| LA-D-06 | Culligan of Los Angeles | Sylmar (in city) | **Franchise** (Culligan) | Large Hall's Culligan territory covering the Valley and LA County. Brand rules likely. |
| LA-D-07 | Rayne of Los Angeles / San Fernando Valley | No address | **Brand dealer** (Rayne) | Named neighborhood coverage across the city. Who operates each Rayne page is unclear. |
| LA-D-08 | EcoWater SoCal | Vista | **Brand dealer** (EcoWater) | Full product line, but LA is a claimed area with no LA office. |
| LA-D-09 | LifeSource Water Systems | Pasadena | Brand (manufacturer-direct) | Salt-free whole-house only and sells its own brand direct. Weak fit for buying leads. |
| LA-D-10 | Simple Water Heater & Filtration | North Hollywood (in city) | Plumbing co. | Water heater shop with a real softener, RO and whole-house line. Covers the Valley and Westside. Published email. |
| LA-D-11 | A+ Electric & Plumbing | Tujunga (in city) | Plumbing co. | Detailed water treatment page with an install process. Self-reported CSLB number. Published email. |
| LA-D-12 | Hi-Tech Plumbing Services | Winnetka (in city) | Plumbing co. | Small shop that installs softeners. Self-reported license. Published email. |
| LA-D-13 | Mike Diamond Services | Hollywood (in city) | Plumbing co. | Big plumbing brand with softeners, RO and whole-house. Water treatment is a minor line. |
| LA-D-14 | Monkey Wrench Plumbing | Monterey Park | Plumbing co. | Installs softeners, RO and whole-house systems. Office is outside the city. |

Counts: 5 independents, 1 franchise, 3 brand dealers (counting LifeSource), 5 plumbing companies.

## Top three to consider

1. **LA-D-01 Puroserve:** it is a long-running water treatment specialist inside the city with residential softener, RO and whole-house lines and several local phone lines, which makes it the best fit for a pilot.
2. **LA-D-02 Praz Pure Water:** it is a softener and RO specialist that installs and does follow-up check-ups, and it publishes an email for a first touch.
3. **LA-D-04 Pro Water Solutions:** it focuses only on water treatment and names the San Fernando Valley, though it has no published email and its office is in Valencia.

None of the three has a verified license, because the CSLB lookup was not run. Each should be checked by hand at cslb.ca.gov before any lead is sent.

## Gaps

- **Licensing:** no row has a verified license (see Licensing). This is the main gap for both markets.
- **Search coverage:** the web search allowance ran out mid-run. Westside (Venice, Westchester, West LA), Harbor area (San Pedro, Wilmington) and South LA have few or no in-city independents on the list.
- **Locators:** Pentair, Kinetico and RainSoft dealer lists need a ZIP entry in a browser. A manual search for ZIPs such as 90045, 90731, 91311 and 91405 would close this.
- **Missing details:** legal entity shown for only one row (Hi-Tech). No street address on own site for LA Water Solutions and Rayne. No email for Puroserve, Pro Water Solutions, Superior Water, Rayne, EcoWater SoCal, LifeSource and Monkey Wrench.
- **Decision makers:** an owner or founder is named on the company's own site only for Superior Water. LA Water Solutions has a founder name on a second copy of its site that looks unreliable, so it is in notes only.
- **Rayne:** three Rayne location pages cover the city with different phone numbers, and one says it is run from Valencia. Directories also tie "Rayne of the Valley" to Puroserve's address. Ask before treating Rayne and Puroserve as separate options.
- **Reviews:** not opened. **Insurance:** not checked.

## Exclusions

- **Kinetico Water Systems by Basic Technology (Van Nuys):** its own site (kineticobt.com) showed a bot-verification page. Lookup blocked, so nothing could be confirmed.
- **AquaRemedy Smart Water Filters (Sherman Oaks):** only staging copies of a website (many pages.dev addresses) were found. There was no production site, address or phone.
- **EcoWater of Los Angeles (Fullerton dealer page):** the dealer page lists LA cities but never says it installs or services, and the office is in Fullerton.
- **RainSoft (Culver City):** no dealer website of its own found. The RainSoft LA page names no dealer.
- **Hague Quality Water (Bellflower):** its site refused automated reading (robots rule). The office is also outside the city.
- **Plumb Inc (North Hollywood):** heavily templated local pages, and the address has a suite number that looks like a mailbox. Too weak to list.
- **PRO Plumbers of Studio City:** its footer says it is a referral service connecting homeowners with independent providers (lead generation).
- **SoCal Healthy Water:** its site shows a CSLB number but no address, phone, email or service cities.
- **Puragain Water:** no install language and no street address. The phone uses a desert (760) area code.
- **System Wide Services (Cerritos):** its service-area list does not include the City of Los Angeles.
- **West Coast Water Filtration, Pure Water Filtration, Pure Water 1 / Pure Water Groups, Western Rooter, Eco Technology, Homfix:** names came from directories, but no own website was confirmed before search ran out (pure-water-filtration.com returned an error).
