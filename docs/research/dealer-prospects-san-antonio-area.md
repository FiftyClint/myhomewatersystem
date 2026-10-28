# San Antonio area dealer prospects

Research draft. No one has been contacted.

Market: `san-antonio-area` (Bexar County plus New Braunfels and the near suburbs; ZIPs 78130 to 78266). Companion data file: `dealer-prospects-san-antonio-area.csv` (15 rows, SA-D-01 to SA-D-15).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer and brand pages that loaded:** Kinetico dealer page for Kinetico of San Antonio; EcoWater dealer microsite for Oasis Water Solutions; Culligan location page for San Antonio; Puronics locator page for True H2O.
- **Did not load or not used:** RainSoft's locator needs a ZIP entry and its city pages name no dealer. Pentair's locator was not reached. Oasis Water Solutions' own site and LegaSeay Water Systems' own site both disallow automated access by robots rule, so they were not read.
- **Name finding only (never evidence):** HomeAdvisor and Angi San Antonio pages, BBB New Braunfels category page, and an Alamo Examiner list article.
- **Search wordings:** softener and RO companies by San Antonio, Boerne, Helotes, New Braunfels, Canyon Lake, Schertz, Cibolo and Universal City; "Class III water treatment specialist" San Antonio; brand dealer searches for Kinetico, RainSoft, EcoWater and Culligan.
- **What a row needed:** the company's own site (or, for Culligan and Kinetico, the brand-hosted local dealer page plus the dealer's own site where one exists) confirming it sells and installs or services residential softeners, RO or whole-home filtration in this area. Every field comes from the page named in `contact_source_url`.
- **Left blank on purpose:** review fields and score. Decision makers only where the company's own site names an owner or founder.

## Licensing finding

- **Which license applies.** Texas certifies people who install, exchange, service and repair residential water treatment equipment (softeners, RO, filters) as **Water Treatment Specialists** under Texas Occupations Code Chapter 1904 and 30 TAC Chapter 30, Subchapter H. There are three classes (WTS Class I, II and III); TCEQ's page says Class II holders may not work on RO or deionization equipment unless supervised by a higher class, and Class III covers RO and DI. Anyone who does this work "under contract" needs the license unless exempt.
- **Who runs it.** The brief said to start at the Texas State Board of Plumbing Examiners (tsbpe.texas.gov). On the pages read on 2026-10-28, the WTS program is run by **TCEQ** (Texas Commission on Environmental Quality), not TSBPE: https://www.tceq.texas.gov/licensing/licenses/wtslic . The Texas Water Quality Association page (https://twqa.org/TCEQ) says the same. TSBPE's site lists plumbing licenses only (Responsible Master, Master, Journeyman, Tradesman, Inspector, endorsements) and no WTS license: https://www.tsbpe.texas.gov/search/license-search . No page found said the WTS program had moved to TSBPE. Worth a manual check before relying on this.
- **Plumber exemption.** TCEQ's WTS page lists plumbers licensed under Occupations Code Chapter 1301 (TSBPE) as exempt. So a plumbing company's master plumber license (TSBPE) also covers softener work, and a water treatment specialist's WTS license (TCEQ) covers it without a plumbing license.
- **Lookups.**
  - TCEQ Licensing and Registration search (https://www2.tceq.texas.gov/lic_dpa/index.cfm, linked from https://www.tceq.texas.gov/licensing/authorized-contact-info): the site's robots rule disallows automated access, so it was not used. **Lookup blocked.**
  - TSBPE public license search (https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do): runs in a timed session and, per TSBPE's own how-to PDF (https://tsbpe.texas.gov/wp-content/uploads/2023/05/TSBPE_HowTo_PublicLicenseSearch.pdf), asks the user to confirm they are not a robot. **Lookup blocked.**
  - Result: no row has a verified license number or status. `license_checked_on` is set to 2026-10-28 on every row. Any number a company shows on its own site is in notes as **self-reported**.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| SA-D-01 | Little Profit Water Softeners | San Antonio | Independent | Owner-run softener specialist with a named founder and a self-reported TCEQ Class III license number. |
| SA-D-02 | The Water Man | San Antonio (78250) | Independent | Specialist for 35+ years with a published email, and it services other brands' systems. |
| SA-D-03 | Simple Water Softeners | San Antonio (78260) | Independent | Small Clack-based specialist with published installed prices and a Class III tech. |
| SA-D-04 | Alamo Water Softeners | San Antonio (78217) | Independent | High-volume specialist with a named founder; it absorbed Texas Blue Water Filtration. |
| SA-D-05 | Texas Splash Inc. | Boerne | Independent (3M dealer) | Specialist since 1993 that says its staff hold TCEQ Class III licenses. |
| SA-D-06 | Hill Country Water Systems | New Braunfels | Independent | Covers New Braunfels and the I-35 corridor and says it is TCEQ licensed. |
| SA-D-07 | The Water Doctor | San Antonio (78261) | Independent | Brand-neutral specialist that services all makes, on the north side. |
| SA-D-08 | Kinetico of San Antonio | San Antonio (78249) | Brand dealer (Kinetico) | Established since 1970 with wide coverage, but Kinetico rules apply. |
| SA-D-09 | Culligan of San Antonio | San Antonio (78208) | Franchise (Culligan) | Has a published email, but its territory leans south and west. |
| SA-D-10 | Culligan of Seguin & New Braunfels | Seguin | Franchise (Culligan) | Covers New Braunfels, Schertz and Cibolo, where SA-D-09 does not. |
| SA-D-11 | Aqua-Man Water Conditioning | Boerne | Brand dealer (Hague) | Hague softeners with RO and whole-house filters, and it covers about 40 cities. |
| SA-D-12 | True H2O | San Antonio | Brand dealer (Puronics) | Newer Puronics dealer with a published email and 24/7 service. |
| SA-D-13 | Sweetwater Home Services | San Antonio (78217) | Independent (RainSoft hinted) | Has in-house install teams and has been in Texas since 1987. |
| SA-D-14 | Radiant Plumbing, AC & Electrical | San Antonio (78217) | Plumbing co. | Has a full water line (softener, RO, whole-home) and a self-reported master plumber license. |
| SA-D-15 | Shafer Services Plus | San Antonio (78212) | Plumbing co. | Does softener installs and runs a salt membership, but has no RO line. |

Counts: 8 independents (incl. SA-D-13), 5 brand or franchise dealers, 2 plumbing companies.

## Top three to consider

1. **SA-D-01 Little Profit Water Softeners.** It is an owner-run softener specialist that names its founder and posts a TCEQ Class III license number (self-reported), and a small shop like this is likely to answer a single free lead quickly.
2. **SA-D-02 The Water Man.** It has worked in San Antonio for over 35 years, publishes a business email and a street address, and services existing systems of any brand, which fits a lead that may already own equipment.
3. **SA-D-04 Alamo Water Softeners.** It is a high-volume local specialist with a named founder and a full softener, RO and whole-home line, though its multi-market reach (Austin, Corpus Christi) may make a $95 exclusive less important to it.

## Gaps

- **No license verified.** Both state lookups were blocked (see above). Self-reported credentials: SA-D-01 (WT0006276), SA-D-04 (M-36213), SA-D-14 (M-45619), SA-D-15 (TACLA26198E/M215), SA-D-13 (RMP# 39461), plus unnumbered TCEQ claims on SA-D-03, SA-D-05 and SA-D-06.
- **No street address on own site:** SA-D-01 (city only) and SA-D-12 (city only; the Puronics page gives one).
- **Decision makers:** named owners or founders only for SA-D-01 (Jason Hartfelder) and SA-D-04 (Allen Townsend). All others are blank.
- **Legal entities:** only Texas Splash Inc. showed one. Texas SOS entity search was not tried.
- **Locators:** RainSoft and Pentair dealer lists were not captured. EcoWater's local dealer (Oasis) could not be read on its own site.
- **Office outside the market ZIP range (but serving it):** SA-D-05 and SA-D-11 (Boerne) and SA-D-10 (Seguin).
- **Reviews:** not opened. Ratings in notes are the companies' own claims.

## Exclusions

- **Oasis Water Solutions (EcoWater dealer, 11809 Warfield):** its own site (oasiswatersa.com) disallows automated access, so only the EcoWater-hosted page was read. Add it back if a person confirms the own site.
- **LegaSeay Water Solutions (New Braunfels):** its own site disallows automated access.
- **Mueller Water Conditioning, San Antonio branch (Converse):** its branch page mentions residential softener installs, but the company homepage targets commercial and industrial customers. It is held as an alternate.
- **Texas Blue Water Filtration:** now part of Alamo Water Softeners (SA-D-04) per Alamo's site.
- **Lone Star Water Services:** it is based in Driftwood (Hays County) and San Antonio is one of about 25 cities it lists.
- **Soft H2O:** it gives no address and lists a statewide service area (Dallas, Houston, Austin and San Antonio).
- **South Texas Water Solutions (Canyon Lake), Central Texas Water Softeners (texaswatersofteners.com), WinBar Services (New Braunfels):** none shows a street address, and two list multi-metro areas. They are thin on evidence.
- **San Antonio Water Solutions (Brewster St):** the page shows three different phone numbers and heavy keyword text, so it could not be told apart from a lead site with confidence.
- **COR Plumbing:** template placeholder text sits where the address should be.
- **Leaf Home Water Solutions:** national.
- **Directory and lead sites (names only):** HomeAdvisor, Angi, Thumbtack, BBB, Alamo Examiner, softprowatersystems.com city pages, newbraunfelswatersoftener.com, boernewatersoftenerpros.com, and the sites.google.com "Water Doctor" pages.
- **Own site not found by search:** Krystalina Water (Converse), Mandry Water Services (New Braunfels), Texas Clean Water Solutions.
- **Not researched (names only, from directories):** CBS Systems (Bulverde), Will's Plumbing & Testing, Beyer Plumbing, Jason's Water Systems, H2O Pros.
