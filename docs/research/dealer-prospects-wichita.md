# Wichita dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-wichita.csv` (6 rows, ICT-D-01 to ICT-D-06). Market: Wichita, Kansas (Sedgwick County and adjacent suburbs).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Search budget:** the shared web search limit for this session ran out after the Wichita licensing searches and before any Wichita dealer searches. Names were therefore taken from pages already found: needinstall.com's Wichita water treatment list, Angi lists for Sedgwick and Wichita, a HomeAdvisor Wichita page and the BBB Wichita water treatment category (names only, never evidence). Each company's own site was then opened. The shared page-fetch budget then ran out as well.
- **Manufacturer and brand pages:**
  - Culligan: the Wichita location page on culligan.com and culliganwichita.com both loaded (ICT-D-04).
  - EcoWater: Moore Water & Air of Kansas's own site loaded (ICT-D-05).
  - Hague: Clear Water Purification's own site says it is an authorized Hague dealer (ICT-D-03).
  - RainSoft: the locator needs a ZIP entry. No Wichita dealer found.
  - Kinetico: the domain tried for a Wichita dealer refused automated access (robots). No Wichita Kinetico dealer confirmed.
- **Did not load or refused automated access:** kan-techinc.com, lindyspringwatertechnology.godaddysites.com, stwplumbing.com, yokesmasterplumbing.com, masterplumbinc.com (robots); wellnesswaterfiltrationsystems.com; the Clear Choice about page; the 2024 and 2025 UBTC PDFs (binary only); the MABCD license lookup.
- Every field in the CSV comes from a page that was opened, listed in `contact_source_url` or in `notes`.

## Licensing finding

- **Regulator:** the Metropolitan Area Building and Construction Department (MABCD), a joint Wichita and Sedgwick County department, licenses contractors for the City of Wichita, unincorporated Sedgwick County and its contracted small cities (Andale, Bentley, Cheney, Clearwater, Colwich, Garden Plain, Goddard, Maize, Mulvane, Valley Center). Source: https://sedgwickcounty.org/mabcd/contracted-small-cities
- **License that applies:** MABCD issues a **Water Conditioner** trade contractor license.
  - The trade contractor license application lists "Water Conditioner" among its license types (MABCD Form 45A/45B, rev. 5/12/2021: https://www.sedgwickcounty.org/media/59154/mabcd-form-45a-45b-application-for-trade-contractors-license.pdf).
  - The MABCD fee table lists "Water Conditioner 2 years $360 Odd Year", the same term as the Plumbing license (Table A, rev. 5/8/2019: https://www.sedgwickcounty.org/media/55369/fee-table-a.pdf).
  - The Wichita-Sedgwick County Unified Building and Trade Code (version current 9/30/2021) lists "Water Conditioner" among plumbing license fees (Table A) and a plumbing permit fee for "Water Conditioning $4.50" per unit (Table H, item 12): https://www.sedgwickcounty.org/media/59878/wichita-sedgwick-county-unified-building-trade-code-ubtc-current-9-30-2021-complete-ubtc.pdf. The code text that defines the license scope was not in the readable part of the PDF.
  - The current MABCD contractor licensing web page (https://sedgwickcounty.org/mabcd/contractor-licensing) does not list Water Conditioner among its trade licenses, so the forms and the web page disagree. MABCD's number on that page, 316-660-1840, is where the owner could confirm.
- **What this means in practice (inference):** a softener or RO install in Wichita likely needs a plumbing permit pulled by a holder of an MABCD Water Conditioner or Plumbing license.
- **Suburbs with their own rules:** MABCD says Bel Aire, Derby, Kechi and Park City handle their own permitting and licensing, and Valley Center also requires its own contractor license. Andover and Augusta are in Butler County and were not checked.
- **Lookup:** MABCD's Online LookUp portal offers a contractor license search by number or applicant (https://mabcdportal.sedgwickcounty.org/Views/CDR/CDRLookUpMain.aspx), but both search links returned "An unexpected error occurred". No license was verified.
- **State of Kansas:** not rechecked in this pass. The Kansas City licensing note cites Kansas statutes that leave plumbing licensing to cities and counties.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| ICT-D-01 | Clear Choice Water of Kansas | West Wichita (67205) | Independent | Family specialist, 20+ years. Own install techs. Softeners and RO. Kenai dealer. |
| ICT-D-02 | Central Water Systems | Wichita (67213) | Independent | Local specialist with a street address. Conditioning and whole-house filtration. WQA member. |
| ICT-D-03 | Clear Water Purification, LLC | Wichita (no address on site) | Brand dealer (Hague) | Hague dealer for 26 years, specialist since 2000. No phone on its site. |
| ICT-D-04 | Culligan of Wichita | Wichita (67226) | Franchise | Full residential line with a published email. Two different phone numbers. |
| ICT-D-05 | Moore Water & Air of Kansas | Wichita (no address on site) | Brand dealer (EcoWater) | Multi-state EcoWater dealer that started near Wichita. Same company as the Omaha row. |
| ICT-D-06 | Benjamin Franklin Plumbing of Wichita | Wichita (67211) | Franchise | Plumbing franchise installing softeners, whole-home filtration and RO. Wide suburb list. |

Counts: 2 independent specialists, 2 brand dealers (Hague, EcoWater), 2 franchises (Culligan, Benjamin Franklin). No independent plumbing company with a confirmed water treatment line was found.

## Top three to consider

1. **ICT-D-01 Clear Choice Water of Kansas:** it is a family-owned specialist whose own technicians install softeners and RO across Wichita, with direct phone and email channels on its site.
2. **ICT-D-02 Central Water Systems:** it is a locally owned specialist with a Wichita street address and its own install technicians, though its site is thin on product detail.
3. **ICT-D-03 Clear Water Purification, LLC:** it is the longest-running specialist found, a Hague dealer serving Wichita and nearby towns, but its site shows no phone or address, so its channels need confirming.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **Only 6 rows.** The search budget was used up before Wichita dealer searches, and the fetch budget ran out soon after. A fresh session should run suburb and product searches (Derby, Andover, Haysville, Maize, Park City, "reverse osmosis Wichita", "water softener Wichita") and check Mr. Rooter Wichita, Kinetico and RainSoft dealers, Superior Water Treatment, Lindyspring Water Technology (Derby) and Wichita plumbing companies with softener lines.
- **No license verified.** The MABCD lookup errored. A manual check of the Water Conditioner license for the top three would settle this. Benjamin Franklin shows license number 5377 on its site (self-reported).
- **Missing details:** no street address on site for Clear Choice, Clear Water Purification or Moore Water & Air of Kansas. No phone on Clear Water Purification's site. Legal entity confirmed only for Clear Water Purification. No owner named on any site.
- **Conflicts:** Culligan of Wichita shows 316-267-5287 on culligan.com and (316) 330-3637 on culliganwichita.com. The MABCD forms list a Water Conditioner license but the current MABCD web page does not.
- **Reviews:** not opened.

## Exclusions

- **American Water Purification, Inc.:** ozone treatment for poultry, laundry and produce; no residential softeners or RO.
- **Filter Water Direct LLC:** online seller based in Lakeview, Arkansas; no installation.
- **PureSpring Water Softeners & Filters:** site reads as a lead-generation template (cloned pages, keyword lists, no install evidence).
- **Midwest Smart Water Solutions:** sells softeners and RO, but its site does not claim that it installs.
- **The H2O Heroes:** national company centered on Florida; no Wichita location shown.
- **Kan-Tech, Lindyspring Water Technology, STW Plumbing, Yokes Master Plumbing, Masterplumb:** own sites refused automated access (robots). Lookup blocked.
- **Wellness Water Filtration Systems:** page failed to load.
- **Living Waters Aquatic Management:** pond and aquarium service, not residential water treatment.
- **Mountainland Supply:** wholesale distributor (not opened).
- **Total Filtration Services:** industrial filtration supplier in Troy, Michigan.
- **Fahnestock Plumbing, HVAC & Electric; Sooter Plumbing:** own sites do not mention water treatment.
- **Wichita Plumbing Company:** site lists "Reverse Osmosis systems" only under other issues, with no softener or install language, and its published email is a free webmail address.
- **Bowers Plumbing, Superior Service Co:** the domains tried belong to companies in Alabama and Louisiana; Wichita sites not found.
- **Superior Water Treatment:** no website listed.
- **Abundant Flow Water Systems (Pfeifer KS), Leaf Home Water Solutions:** outside the market or national.
