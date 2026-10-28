# Phoenix dealer prospects (market-id phoenix, prefix PHX)

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-phoenix.csv` (13 rows, PHX-D-01 to PHX-D-13). Market: the City of Phoenix, Arizona (ZIPs in the 85003 to 85085 range).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer and brand pages tried:**
  - Kinetico dealer page (kinetico.com) loaded and named AquaZona.
  - EcoWater dealer page (ecowater.com/dealer/phoenix-az) loaded and named Parker & Sons.
  - Culligan dealer pages (culligan.com and culliganwater.com) loaded for Culligan of Phoenix.
  - Rayne Water's Phoenix page loaded.
  - RainSoft's Phoenix pages loaded but name no dealer, only a corporate form and 1-800 number.
  - Pentair True Blue search returned no Phoenix AZ dealer page (one result was Phoenix, Maryland).
- **Other sources:** web searches for softener, RO and filtration companies in Phoenix, by Phoenix neighborhood (Ahwatukee, Arcadia, Deer Valley) and by ZIP, plus brand names. HomeAdvisor, Angi, BBB, Yellow Pages and similar directories were used only to find names, never as evidence.
- **What a row needed:** the company's own website confirming it sells and installs or services residential water treatment and serves Phoenix. Every field comes from a page that was opened; the URL is in contact_source_url.
- **Placement rule used:** most Valley dealers list both Phoenix and East Valley cities. Water treatment specialists and brand dealers whose own sites show both markets have a row in both files. Plumbing companies were placed in the file for their office location, even when they also list the other market, to keep each list near 12 to 15 rows.
- **What did not load:** ROC Contractor Search (JavaScript app, "CSS Error"); ROC posting-list CSV files; Deer Valley Plumbing and Agave Plumbing pages (site errors); Chandler Water Solutions (robots rules disallow fetching).
- **Search limit:** the shared web search budget for this session ran out near the end. Remaining checks used pages already found.
- Left blank on purpose: review fields (reviews not opened), score, and license number and status (lookup did not load). Ratings in notes are the companies' own claims.

## Licensing finding

- **Regulator:** Arizona Registrar of Contractors (ROC), https://roc.az.gov/ . Contractor licensing in Arizona is statewide through the ROC.
- **Which license applies:** the ROC's own classification list (https://www.azroc.gov/sites/default/files/2023-11/License%20Classification%20Requirements_6.8.20_0.pdf) has a dedicated trade called **Water Conditioning Equipment**: R-54 (residential), C-54 (commercial) and CR-54 (dual). The R-54 scope in the Arizona Administrative Code, R4-9-103 (read on the Cornell LII copy, https://www.law.cornell.edu/regulations/arizona/Ariz-Admin-Code-SS-R4-9-103, not on the ROC site), covers installing and repairing "water conditioning equipment", exchange tanks and the brine/backwash waste line.
- **Plumbing licenses:** the same list has R-37 / R-37R / CR-37 Plumbing. The R-37 scope text does not mention water softeners or water treatment. Our reading, which is an inference and not an ROC ruling, is that a plumbing contractor with an R-37 or CR-37 likely installs softeners under that license in practice, while a softener-only shop would need R-54 or CR-54. Confirm with the ROC before relying on it.
- **Public lookup:** the ROC Contractor Search (https://azroc.my.site.com/AZRoc/s/contractor-search) is a JavaScript app. From this environment it showed only "Loading / Sorry to interrupt / CSS Error" on two tries, so no license could be verified. The ROC "Posting List" of active contractors (https://roc.az.gov/posting-list) loaded, but the CSV files that search returned for it failed to load, and the page text did not expose current file links. Every row therefore has license_regulator and license_checked_on (2026-10-28) filled, number and status blank, and any ROC number the company shows on its own site recorded in notes as self-reported.
- **Manual next step:** open the ROC Contractor Search in a normal browser and search each self-reported number. Check that the class is R-54/CR-54 or R-37/CR-37 and the status is ACTIVE.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| PHX-D-01 | Soft Water Plus | Phoenix 85086 | Independent | Phoenix water treatment specialist; owning family named on site; sales, service and install. |
| PHX-D-02 | American Home Water & Air | Phoenix 85029 | Independent | Phoenix-based softener and RO specialist that also does HVAC; open 24 hours; Valley-wide. |
| PHX-D-03 | Complete Water Systems LLC | Phoenix area | Independent | Services many softener brands and installs within 72 hours; no street address on site. |
| PHX-D-04 | Clear Water Concepts | Mesa, Tempe, Glendale | Independent | Specialist since 1998 with published pricing; covers the whole Valley. |
| PHX-D-05 | Allegiance Water Services LLC | Scottsdale | Independent | Specialist with published email and long Phoenix-area city list. |
| PHX-D-06 | AquaZona (Kinetico) | Chandler and Scottsdale | Brand dealer (Kinetico) | Independent Kinetico dealer since 1987; 24/7 service; Kinetico rules apply. |
| PHX-D-07 | Culligan of Phoenix | Phoenix 85040 | Brand dealer (Culligan) | Big established brand with published email; territory and brand limits likely. |
| PHX-D-08 | Rayne of Phoenix | Phoenix area | Brand dealer (Rayne) | Full product line; no address or email on page. |
| PHX-D-09 | Parker & Sons | Phoenix 85040 | Plumbing co. (EcoWater dealer) | Large home-services firm, water installs since 1974; water treatment is one line among many. |
| PHX-D-10 | Custom Plumbing of Arizona | Phoenix 85024 | Plumbing co. | North Phoenix plumber since 2001 with a full softener page. |
| PHX-D-11 | ASAP Plumbing | Phoenix and Tempe | Plumbing co. | Filtration, RO and softeners; offices in both markets. |
| PHX-D-12 | Reddi Services | Peoria | Plumbing co. | Has a Phoenix softener and RO page, but install detail is thin. |
| PHX-D-13 | AZ Family Plumbing | Glendale | Plumbing co. | Softeners, RO and whole-home filtration; no street address on site. |

Counts: 5 independents, 3 brand dealers, 5 plumbing companies (one of them, Parker & Sons, is also an EcoWater dealer). Verified licenses: 0 of 13 (lookup did not load). Self-reported license numbers appear on 10 of 13 sites (9 labeled ROC; Reddi does not name the agency).

## Top three to consider

1. **PHX-D-01 Soft Water Plus:** it is a family-run water treatment specialist with a Phoenix street address and named owners, which suits a one-lead pilot, though it publishes no email and its license is only self-reported.
2. **PHX-D-02 American Home Water & Air:** it is a Phoenix-based softener and RO installer with a main office in the city and a 24-hour line, though its posted ROC numbers are for plumbing and HVAC, not R-54.
3. **PHX-D-04 Clear Water Concepts:** it is a water treatment specialist since 1998 with published pricing and a service list that covers Phoenix and the East Valley, which makes it a fit for either market.

None of the three has a license verified on the ROC lookup yet.

## Gaps

- **Licensing:** no license verified. Ten sites post license numbers (self-reported in notes; Reddi does not name the agency). Custom Plumbing, Culligan and Rayne show none.
- **Missing contact details:** no street address on Complete Water Systems, Rayne or AZ Family Plumbing; most rows have no published email (only Allegiance and Culligan publish one).
- **Phone conflicts:** Culligan shows 602-264-3111 on one Culligan page and 1-888-295-5382 on another. American Home Water & Air and Allegiance show several numbers.
- **Decision makers:** named only for Soft Water Plus.
- **Legal entities:** shown on site only for Soft Water Plus, Complete Water Systems, Allegiance and Parker & Sons.
- **Brand locators not fully covered:** RainSoft names no Phoenix dealer; Pentair, Hague and second Kinetico or EcoWater dealers were not found. A manual ZIP search on those locators (e.g. 85016, 85032, 85044) in a browser would close this.
- **Not yet researched (names found only):** Deer Valley Plumbing (page error), Agave Plumbing (page error), Zippity Split Plumbing, Action Plumbing, Aquality HVAC (Goodyear), Goettl, Benjamin Franklin Plumbing Phoenix.

## Exclusions

- **RainSoft (Phoenix pages):** RainSoft's pages name no local dealer; the Tempe dealer "High Quality Water" appeared only on Angi and Birdeye, and its own website was not found.
- **Salus Water (saluswater.com):** no business name, address, phone or license on the page; keyword-stuffed copy. Looks like a lead or placeholder site.
- **AZ Water Solutions (azwatersolutions.com):** self-reported ROC 329709 and a Valley-wide list, but two different phone numbers, no address, and GoHighLevel funnel pages. Held back as lower confidence; could be revisited.
- **Whale Spout Water LLC (Scottsdale):** a real installer with an address and email, but no ROC number shown, founder unnamed, and no years in business. Held back as lower confidence for both markets.
- **Puragain Water:** multi-state company (San Diego, Los Angeles, Las Vegas, Phoenix) with no Phoenix office shown.
- **Wellness Water Filtration Systems:** excluded from the KC list as a possible lead network; its Phoenix city page appeared in search but was not re-verified.
- **Apple Plumbing (Scottsdale, self-reported ROC 283837):** verified as offering softeners, RO and filtration, but left off to keep the list focused; its office is in Scottsdale.
- **Directories (getyourbucksworth.com, thebuildermarket.com, HomeAdvisor, Angi, BBB, Yellow Pages, thephoenixreview.com):** used for names only.
