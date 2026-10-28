# Minneapolis dealer prospects

Research draft. No one has been contacted.

Market: `minneapolis` (City of Minneapolis and Hennepin County inner suburbs). Companion data file: `dealer-prospects-minneapolis.csv` (14 rows, MSP-D-01 to MSP-D-14).

Homeowner angle for this market: lead service lines. Rows note where a dealer's own site shows RO, whole-house filtration, or lead or PFAS reduction claims. No dealer site cited a specific NSF/ANSI 53 or 58 standard number; only Dean's Home Services names "lead filters" as a product.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer and brand pages that loaded:** Culligan's Minnetonka dealer page; EcoWater's dealer page for Merle's Water Conditioning. Kinetico (Haferman, Aquarius), RainSoft (Aqua Hills Water) and EcoWater (Tri County) dealers were found by search and confirmed on their own sites. No Hague dealer was found.
- **Name finding only (never evidence):** Angi result titles, a BBB category list for St. Louis Park, and a "best water softener companies" blog post on a plumber's site (paulbunyanplumbing.com).
- **Search wordings:** softener, RO and lead filtration companies in Minneapolis, Hennepin County, Bloomington, Edina, Richfield, St. Louis Park, Hopkins and New Hope; brand searches for Kinetico, Culligan, EcoWater, RainSoft and Hague; plumbers with water treatment. Standard search mode returned mostly directory pages; extended mode found company sites.
- **Did not load:** Peterson Salt's review page; the DLI license lookup (see below).
- **What a row needed:** the company's own site confirming it sells and installs or services residential softeners, RO or whole-house filtration and serves Minneapolis or Hennepin County. Every field comes from the page named in `contact_source_url`.
- **Left blank on purpose:** review fields and score. Decision makers only where the company's own site names an owner or founder.

## Licensing finding

- **Which license applies.** The Minnesota Department of Labor and Industry (DLI) licenses water conditioning work. DLI's "Water conditioning license basics" page covers registered unlicensed water conditioners, water conditioning journeyworkers and master water conditioners, and says DLI-licensed plumbers can do water conditioning work "without obtaining a separate water conditioning license". The scope is installing and servicing water conditioning in single-family homes where the plumbing was first set by a licensed plumber and there is no direct connection to a soil or waste pipe without an air gap. Source: https://www.dli.mn.gov/node/5546
- **Business license.** DLI's Water Conditioning Contractor application packet (dated 8.1.2024) sets out the business license: $188 fee, a $3,000 surety bond, general liability insurance of at least $50,000 per person, $100,000 per occurrence and $10,000 property damage, workers' compensation, and a responsible licensed individual who must hold a master license. Source: https://dli.mn.gov/sites/default/files/pdf/pe_wc_packet_new.pdf
- **What this means in practice (inference):** a pilot partner should hold a DLI water conditioning contractor license or a plumbing contractor license, with a master on staff. City of Minneapolis permit rules were not checked.
- **Lookups.**
  - DLI's lookup page (https://www.dli.mn.gov/license-and-registration-lookup) points to iMS (https://ims.dli.mn.gov/). iMS opens on a log-in page and needs an interactive "Continue as Guest" session, which the read-only fetch tool cannot do. Not checked.
  - The same page links a nightly water conditioning CSV export (secure.doli.state.mn.us/ccld/data/MNDLILicRegCertExport_Water_Conditioning.csv). The fetch tool received it as unreadable binary data, and a direct download was refused by this environment's network proxy. **Lookup unavailable.**
  - Result: no row has a verified license number or status. `license_checked_on` is 2026-10-28 on every row. Numbers on company sites are in notes as **self-reported**: MSP-D-01 (WC803903), MSP-D-09 (PC644399, WC646376 and others), MSP-D-13 (PC150290), MSP-D-14 (PC-150148, labeled as a bond). The DLI export is the quickest way to check these by hand.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| MSP-D-01 | Premier Water Technologies | Eden Prairie | Independent | Specialist since 1978 with a self-reported WC license number and PFAS filtration and RO. |
| MSP-D-02 | Peterson Salt & Water Treatment | Hopkins | Independent | Founder-started Hennepin shop since 1987 that names Minneapolis and installs and repairs softeners. |
| MSP-D-03 | Commers Water | Golden Valley | Independent | Family softener maker since 1947 with a Golden Valley store, but Minneapolis is not on its list. |
| MSP-D-04 | Water Doctors Water Treatment Company | Minneapolis (55432) | Independent | Specialist since 1984 with a published email and RO, but it is also a national equipment supplier. |
| MSP-D-05 | Merle's Water Conditioning | East St. Paul | Independent (EcoWater locator) | Specialist since 1959 serving St. Paul and Minneapolis with RO and whole-house filters. |
| MSP-D-06 | Northland Water | South metro (no address) | Independent | Softener repair specialist since 1949 with a Minneapolis line and email, but softeners only. |
| MSP-D-07 | MSP Pure Water | No address | Independent | Founder-run, with a published email, but no address, years or license. |
| MSP-D-08 | Haferman Water | Burnsville | Brand dealer (Kinetico) | Kinetico dealer 50+ years with a Minneapolis page and in-house installers. |
| MSP-D-09 | Aquarius Home Services | Little Canada and others | Brand dealer (Kinetico) | Large Kinetico dealer that lists Minneapolis and most Hennepin suburbs and posts license numbers. |
| MSP-D-10 | Culligan of Minnetonka | Minnetonka | Franchise (Culligan) | Hennepin location with a published email and PFAS and RO lines, with Culligan rules. |
| MSP-D-11 | Tri County Water Conditioning | Prior Lake | Brand dealer (EcoWater) | EcoWater Premier dealer whose Minneapolis page lists Minneapolis and inner suburbs. |
| MSP-D-12 | RainSoft of the Twin Cities (Aqua Hills Water) | Oakdale | Brand dealer (RainSoft) | RainSoft dealer covering the metro, with an out-of-state phone. |
| MSP-D-13 | Paul Bunyan Plumbing & Drains | New Hope | Plumbing co. | Hennepin plumber that installs and maintains softeners and whole-house filters. |
| MSP-D-14 | Dean's Home Services | Maple Grove | Plumbing co. | Multi-trade firm that names lead filters and RO and publishes an email. |

Counts: 7 independents, 5 brand or franchise dealers, 2 plumbing companies. Offices in Hennepin County: MSP-D-01, -02, -03, -10, -13 and -14. MSP-D-04 has a Minneapolis postal address north of the city; MSP-D-08 is in Dakota County.

## Top three to consider

1. **MSP-D-01 Premier Water Technologies.** It is a Hennepin County water treatment specialist since 1978 that posts a water conditioning license number to check by hand and sells RO and PFAS filtration, so it fits a filtration-led pilot.
2. **MSP-D-08 Haferman Water.** It has a dedicated Minneapolis page, says its own installers do all work in-house, and says its Kinetico RO is third-party certified, though Kinetico dealer terms could limit exclusivity and its office is in Burnsville.
3. **MSP-D-02 Peterson Salt & Water Treatment.** It is a Hopkins shop started by a named founder in 1987 that lists Minneapolis delivery days and installs and repairs softeners and RO, and a small owner-run shop is likely to act on a single lead.

Alternate: MSP-D-04 Water Doctors has a Minneapolis postal address, a published sales email and a full RO and filtration line, but it also sells equipment nationally, so local install capacity is less clear.

## Gaps

- **No license verified.** The DLI lookup needs an interactive guest session and the CSV export could not be read here.
- **Lead fit is thin.** Only MSP-D-14 names lead filters; no site cites NSF/ANSI 53 or 58. Several sell RO, which is the usual lead answer, but none states a lead claim with a standard.
- **No street address on own site:** MSP-D-02 (Hopkins only), MSP-D-06 and MSP-D-07.
- **Decision makers:** named only for MSP-D-02 (founder Tom Peterson) and MSP-D-07 (first name only). Commers names its 1947 founder and 1964 successors but no current owner.
- **Legal entities:** only MSP-D-08 shows one on its own site. Minnesota SOS search was not tried.
- **Offices inside the City of Minneapolis:** none confirmed; MSP-D-04 has a Minneapolis postal address in ZIP 55432, north of the city.
- **Brand overlap:** two Kinetico dealers (MSP-D-08 and MSP-D-09) and Merle's (MSP-D-05) is listed by EcoWater while calling itself independent.
- **Reviews:** not opened. Ratings in notes are the companies' own claims.

## Exclusions

- **Puretap Water Systems (St. Paul):** found on Angi and HomeGuide only; its own site was not found.
- **Leaf Home Water Solutions:** national company.
- **Twin Cities Premier Plumbing, Air Mechanical, Today's Plumbing, Randy's Electric, Hero Home Services, Home Service Plus, Northern Benjamin Franklin Plumbing, Bonfe, Blue Yeti, BWS Plumbing, Sabre Plumbing, Brass Tacks, Plumb Right, Mr. Rooter of the Twin Cities:** plumbing or multi-trade names found in search or directories; not researched. Running them would add more plumbing rows inside the city.
- **Range Water Conditioning, EcoWater Central Minnesota:** outside the metro (Grand Rapids and Waite Park).
- **Directory and listing sites (names only):** Angi, HomeAdvisor, Thumbtack, HomeGuide, Yelp, BBB, waterfiltersofamerica.com, softprowatersystems.com.
