# East Valley dealer prospects (market-id east-valley, prefix EV)

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-east-valley.csv` (15 rows, EV-D-01 to EV-D-15). Market: Phoenix East Valley, Arizona (Mesa, Gilbert, Chandler, Tempe, Scottsdale, Queen Creek area; ZIPs 85201 to 85298).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer and brand pages tried:**
  - Kinetico dealer page loaded and named AquaZona, whose main Phoenix-area office is in Chandler.
  - Culligan and Rayne Phoenix pages loaded and list East Valley cities.
  - EcoWater's Phoenix dealer is Parker & Sons, placed in the Phoenix file by office location.
  - RainSoft pages name no dealer; the Tempe RainSoft dealer appeared only on directories.
  - Pentair True Blue search returned no East Valley dealer page.
- **Other sources:** web searches by suburb (Mesa, Gilbert, Chandler, Tempe, Scottsdale) for softener, RO and filtration companies, with two or three wordings each. Directories were used only to find names.
- **What a row needed:** the company's own website confirming it sells and installs or services residential water treatment and serves East Valley cities. Every field comes from a page that was opened; the URL is in contact_source_url.
- **Placement rule used:** water treatment specialists and brand dealers whose own sites show both Phoenix and the East Valley have a row in both files (Clear Water Concepts, Allegiance, American Home Water & Air, AquaZona, Culligan, Rayne). Plumbing companies were placed by office location; ASAP Plumbing has offices in both markets, so it is in both.
- **What did not load:** ROC Contractor Search (JavaScript app, "CSS Error"); ROC posting-list CSV files; Chandler Water Solutions (robots rules disallow fetching, recorded as lookup blocked).
- **Search limit:** the shared web search budget for this session ran out near the end. Remaining checks used pages already found.
- Left blank on purpose: review fields, score, and license number and status. Ratings in notes are the companies' own claims.

## Licensing finding

- **Regulator:** Arizona Registrar of Contractors (ROC), https://roc.az.gov/ . Contractor licensing in Arizona is statewide through the ROC.
- **Which license applies:** the ROC's own classification list (https://www.azroc.gov/sites/default/files/2023-11/License%20Classification%20Requirements_6.8.20_0.pdf) has a dedicated trade called **Water Conditioning Equipment**: R-54 (residential), C-54 (commercial) and CR-54 (dual). The R-54 scope in the Arizona Administrative Code, R4-9-103 (read on the Cornell LII copy, https://www.law.cornell.edu/regulations/arizona/Ariz-Admin-Code-SS-R4-9-103, not on the ROC site), covers installing and repairing "water conditioning equipment", exchange tanks and the brine/backwash waste line.
- **Plumbing licenses:** the same list has R-37 / R-37R / CR-37 Plumbing. The R-37 scope text does not mention water softeners or water treatment. Our reading, which is an inference and not an ROC ruling, is that a plumbing contractor with an R-37 or CR-37 likely installs softeners under that license in practice, while a softener-only shop would need R-54 or CR-54. Confirm with the ROC before relying on it.
- **Public lookup:** the ROC Contractor Search (https://azroc.my.site.com/AZRoc/s/contractor-search) is a JavaScript app. From this environment it showed only "Loading / Sorry to interrupt / CSS Error" on two tries, so no license could be verified. The ROC "Posting List" of active contractors (https://roc.az.gov/posting-list) loaded, but the CSV files that search returned for it failed to load, and the page text did not expose current file links. Every row therefore has license_regulator and license_checked_on (2026-10-28) filled, number and status blank, and any ROC number the company shows on its own site recorded in notes as self-reported.
- **Manual next step:** open the ROC Contractor Search in a normal browser and search each self-reported number. Check that the class is R-54/CR-54 or R-37/CR-37 and the status is ACTIVE.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| EV-D-01 | Clarks Quality Water | Mesa 85203 | Independent | Specialist since 1999 with its own softener and RO lines; covers the core East Valley. |
| EV-D-02 | Water Rehab LLC | Gilbert 85298 | Independent | Small family water treatment specialist; installs and repairs softeners. |
| EV-D-03 | State48Water | East Valley | Independent | Veteran-owned; owner installs; published email; no street address. |
| EV-D-04 | Gilbert Water Softeners | Gilbert 85296 | Independent | Softener and RO sales, install and repair; published email and address. |
| EV-D-05 | Clear Water Concepts | Mesa, Tempe, Glendale | Independent | Specialist since 1998 with published pricing; Valley-wide. |
| EV-D-06 | Allegiance Water Services LLC | Scottsdale 85260 | Independent | Specialist with published email; long East Valley city list. |
| EV-D-07 | American Home Water & Air | Phoenix (Scottsdale warehouse) | Independent | Softener and RO specialist plus HVAC; lists Mesa, Gilbert, Chandler, Tempe, Scottsdale. |
| EV-D-08 | AquaZona (Kinetico) | Chandler 85225 | Brand dealer (Kinetico) | Independent Kinetico dealer since 1987 based in Chandler; Kinetico rules apply. |
| EV-D-09 | Culligan of Phoenix | Phoenix 85040 | Brand dealer (Culligan) | Covers Maricopa and northern Pinal; territory and brand limits likely. |
| EV-D-10 | Rayne of Phoenix | Phoenix area | Brand dealer (Rayne) | Lists Mesa, Gilbert, Chandler, Tempe, Scottsdale; no address or email. |
| EV-D-11 | Adair Plumbing LLC | Mesa 85202 | Plumbing co. | Owner named (since 1978); brand-neutral softener, RO and filtration installs. |
| EV-D-12 | Camcor Plumbing | Mesa 85204 | Plumbing co. | Detailed softener page and published email; family owned since 2008. |
| EV-D-13 | Phend Plumbing | Mesa and Gilbert | Plumbing co. | Owner named; published install price range; no ROC number shown. |
| EV-D-14 | Evolution Plumbing and Misting | Gilbert 85296 | Plumbing co. | Uses Arizona-made AmeriFlow equipment; one-visit installs. |
| EV-D-15 | ASAP Plumbing | Tempe and Phoenix | Plumbing co. | Filtration, RO and softeners; Tempe office. |

Counts: 7 independents, 3 brand dealers, 5 plumbing companies. Verified licenses: 0 of 15 (lookup did not load). Self-reported ROC numbers appear on 11 of 15 sites; Clarks, Culligan, Rayne and Phend show none.

## Top three to consider

1. **EV-D-01 Clarks Quality Water:** it is a Mesa water treatment specialist since 1999 with a street address and its own product lines across the core East Valley cities, though it shows no ROC number or email on the page.
2. **EV-D-02 Water Rehab LLC:** it calls itself a small family water treatment specialist in Gilbert, shows a street address and a self-reported ROC number, and covers Gilbert, Chandler and Mesa.
3. **EV-D-03 State48Water:** the owner installs personally and publishes a direct business email, which suggests a fast reply to a pilot lead, though there is no street address and only a first name for the owner.

Close fourth: EV-D-04 Gilbert Water Softeners (address, email and self-reported ROC). None of these has a license verified on the ROC lookup yet.

## Gaps

- **Licensing:** no license verified (lookup did not load). Self-reported ROC numbers are in notes.
- **Missing contact details:** no street address for State48Water or Rayne; no email for Clarks, Water Rehab, AquaZona, Rayne, Adair or ASAP. Phend and Evolution publish Gmail addresses as business contacts.
- **Decision makers:** named on site only for State48Water (first name), Adair Plumbing (Doug Adair) and Phend Plumbing (Pete Phend).
- **Legal entities:** shown only for Water Rehab, Allegiance and Adair.
- **Brand locators not fully covered:** no RainSoft, Hague, Pentair or EcoWater dealer with an East Valley office was confirmed on its own site. A manual ZIP search (e.g. 85201, 85233, 85224, 85142) on those locators in a browser would close this.
- **Not yet researched (names found only):** Chandler Water Solutions (robots blocked), Topline Chandler Plumber, Desert Drain, Second Opinion Plumbing, Omnia Plumbing (Scottsdale).

## Exclusions

- **All Elite Water LLC (Chandler):** its own site says it is "not a licensed contractor" and acts "as a broker"; contact is a Gmail address.
- **Mesa Water Softeners (mesawatersofteners.com) and Tempe Water Filtration (tempewaterfiltration.com):** city-name sites with no street address, legal entity, owner or ROC number. Our judgment is that they look like rank-and-rent or lead-generation sites, though neither page says so.
- **AZ Water Solutions:** two different phone numbers, no address, GoHighLevel funnel pages; self-reported ROC 329709. Held back as lower confidence.
- **Whale Spout Water LLC (Scottsdale):** address and email shown, but no ROC number, founder unnamed and no years in business. Held back as lower confidence.
- **RainSoft "High Quality Water" (Tempe):** found only on Angi and Birdeye; own website not found.
- **Wellness Water Filtration Systems:** excluded from the KC list as a possible lead network; Scottsdale city page seen in search but not re-verified.
- **Verified but left off to keep the list at 15:** John's Heating, Cooling and Plumbing (Mesa, since 1970, softeners a side line to HVAC); Hansen Family Air Conditioning and Plumbing (Mesa, owner Erik Hansen named, no ROC shown); P&L Plumbing (Mesa, no address or ROC shown); Apple Plumbing (Scottsdale, self-reported ROC 283837).
- **Directories (HomeAdvisor, Angi, BBB, Yellow Pages, houseprosnow.com):** used for names only.
