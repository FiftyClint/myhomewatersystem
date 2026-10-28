# Omaha dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-omaha.csv` (11 rows, OMA-D-01 to OMA-D-11). Market: Omaha, Nebraska (Douglas and Sarpy counties). Council Bluffs, Iowa offices are included only where the company's own site says it serves Omaha.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Name sources (names only, never evidence):** The Builder Market, Superpages (La Vista), BBB Omaha water treatment category, and Angi lists for Bellevue, Elkhorn and Chalco. Each company's own site was then opened. A row was kept only when the company's own page confirmed residential softener, RO or whole-home filtration work and service in the Omaha area.
- **Manufacturer and brand pages:**
  - Culligan: the La Vista location page on culligan.com loaded and is used for OMA-D-05. The culligan.com locations index needs a ZIP search and could not be queried.
  - Kinetico: omahakinetico.com redirects to kineticoofomaha.com, which loaded.
  - EcoWater: an ecowater.com dealer page for La Vista loaded (Moore Water Treatment). ecowaternebraska.com shows only "Page Under Construction". The Moore Water & Air local Omaha page failed to load.
  - RainSoft: the locator needs a ZIP entry. No Omaha dealer was found.
  - Hague, Pentair, Water-Right: not reached. Futuramic's own site says it is a Water Right Evolve dealer.
- **Did not load or refused automated access:** crystalclearwateromaha.com, algiere-water.com and omahah2o.com (robots), permits.cityofomaha.org/licensing-information, planning.omaha.gov code PDFs, municode and up.codes copies of the Omaha code.
- **Budget:** the shared web search budget and then the shared page-fetch budget for this session ran out partway through. Suburb searches for Elkhorn, Papillion and Bellevue ran, but several plumbing and franchise candidates could not be checked (see Gaps).
- Every field in the CSV comes from a page that was opened, listed in `contact_source_url` or in `notes`.

## Licensing finding

- **City of Omaha:** Omaha licenses water treatment installers as a separate class under its plumbing licensing. The Plumbing Board's page on the City of Omaha Planning Department site lists "Water Conditioner Forms" among its documents (https://planning.cityofomaha.org/boards/plumbing-board/policiescodesformsapplications). The Omaha Municipal Code, Chapter 49 (Plumbing), Article II, has a Division 6, "Water Conditioning Contractor and Installer Licenses", with a section 49-273, "Scope of license". The scope text could not be read: the municode, up.codes and planning.omaha.gov copies all failed to load. A surety bond vendor's page (not the regulator) lists two classes, Water Conditioning Contractor and Water Conditioning Installer, with a $10,000 bond. That detail is not verified on the regulator's site.
- **Bellevue (Sarpy County):** Bellevue's code requires a water conditioning contractor or installer license. The applicant must show "proof of a current license issued by the City of Omaha or any other approved jurisdiction" (Bellevue Code 27-266 to 27-268, Ord. 3520, 2009: https://codelibrary.amlegal.com/codes/bellevuene/latest/bellevue_ne/0-0-0-8359). So an Omaha water conditioning license is the base credential for at least one Sarpy County city. Papillion, La Vista and Gretna were not checked.
- **State of Nebraska:** the Nebraska Department of Labor says "All contractors doing business in Nebraska must register" under the Contractor Registration Act (https://dol.nebraska.gov/LaborStandards/Contractors). This is a registration, not a trade license.
- **What this means in practice (inference):** a dealer installing softeners or RO in Omaha should hold an Omaha Water Conditioning Contractor license, with installers holding the installer license, plus Nebraska DOL contractor registration. Plumbing companies may install under a master plumber license instead; the scope section that would settle this was not retrieved.
- **Lookups:** no public City of Omaha license lookup was found. The Nebraska DOL registration search (https://dol.nebraska.gov/conreg/Search) is an interactive form that the read-only fetch tool could not submit. No license was verified. Numbers or "licensed" claims on company sites are in notes as self-reported.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| OMA-D-01 | Futuramic's Clean Water Center | Omaha (68106) | Independent | Family specialist since 1969 with a full line, rentals and installs. Showroom in Omaha. |
| OMA-D-02 | Clean Water Guys Inc. | Omaha (68137) | Independent | Specialist with WQA-certified installers. Covers Omaha, Bellevue, Papillion and Council Bluffs. |
| OMA-D-03 | Convenient Water Treatment | Omaha area (no address) | Independent | Family specialist, 30+ years. Widest named service area. Softeners, RO, whole-house RO. |
| OMA-D-04 | Kinetico of Omaha | Omaha (68144) | Brand dealer (Kinetico) | Independent Kinetico dealer covering the metro and Council Bluffs. |
| OMA-D-05 | Culligan of Omaha (La Vista) | La Vista (68128) | Franchise | Full line with a published email. Likely run by Hall's Culligan. |
| OMA-D-06 | Moore Water & Air (Omaha/La Vista) | La Vista (68128) | Brand dealer (EcoWater) | Multi-state EcoWater dealer. Same company as the Wichita row. Local page did not load. |
| OMA-D-07 | Benjamin Franklin Plumbing of Omaha | Omaha (68144) | Franchise | Plumbing franchise offering Brita PRO whole-home filtration. Softeners not confirmed. |
| OMA-D-08 | McIntosh Plumbing | Omaha (68124) and Council Bluffs | Plumbing co. | Installs softeners, filtration and RO. Two offices. |
| OMA-D-09 | JP Plumbing Co | Omaha area (no address) | Plumbing co. | Softener installs and RO. Covers the south and west metro. |
| OMA-D-10 | In-Law Plumbing & Drain Services | Omaha (68144) | Plumbing co. | Softener installs with a clear process. Published email. |
| OMA-D-11 | Plumbing Works | Bellevue (no address) | Plumbing co. | Softener installs and water conditioning. Sarpy County based. |

Counts: 3 independent specialists, 2 brand dealers (Kinetico, EcoWater), 2 franchises (Culligan, Benjamin Franklin), 4 plumbing companies with water treatment lines.

## Top three to consider

1. **OMA-D-01 Futuramic's Clean Water Center:** it is a long-running Omaha specialist with a showroom, a full product line, its own sales and install service, and a named company president.
2. **OMA-D-02 Clean Water Guys Inc.:** it is a specialist with an Omaha street address, a stated legal entity, WQA-certified installers and a service area that covers both Douglas and Sarpy counties.
3. **OMA-D-03 Convenient Water Treatment:** it is a family-owned specialist with 30+ years in Omaha and the broadest named suburb coverage, though its address and legal entity need confirming.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **No license verified.** Omaha has no public lookup that was found, the Omaha scope section was not retrievable, and the Nebraska DOL search could not be submitted. A manual check of the Omaha water conditioning license and DOL registration for the top three would settle this.
- **Search and fetch budgets ran out.** Not checked: Mr. Rooter Omaha, Aksarben ARS, John Henry's Plumbing (domain not identified), JTM Plumbing, Gretna Plumbing, Apex Services, Taurus Water Treatment (Council Bluffs), Husker Water Experts LLC (Mead), Chem Free Pure Water Systems, and any RainSoft or Hague dealer.
- **Missing details:** no street address for Convenient Water Treatment, JP Plumbing or Plumbing Works. Legal entity confirmed on site only for Clean Water Guys. No owner named on any site. Moore Water & Air's Omaha address and phone come from EcoWater's dealer page, not its own site.
- **Ownership questions:** Kinetico of Omaha's footer names Western Water, Inc. Culligan La Vista appears to be Hall's Culligan. Neither is stated outright.
- **Reviews:** not opened.

## Exclusions

- **Crystal Clear Water Omaha, Algiere Enterprises Water Conditioning, Omaha H2O:** own sites refused automated access (robots). Lookup blocked.
- **LaMarSOFT, LLC (lamarsoft.com):** listed under water softening in a directory, but the site is a web design and software company.
- **EcoWater Nebraska (ecowaternebraska.com):** placeholder page only. The EcoWater dealer for the area is covered as OMA-D-06.
- **Foldoy Water Conditioning:** HomeAdvisor shows "This pro may not be in business"; own site not found.
- **WaterLink, Inc.:** commercial and industrial boiler and cooling tower treatment; no residential products.
- **Husker Water Specialists:** only a directory-hosted page with a phone number; no install evidence or address.
- **Nalco, DPC Industries:** industrial water chemical companies.
- **Stryker Rental Service, Aqua Express:** directory listings that point to omahawater.com (Futuramic, OMA-D-01).
- **Papillion water treatment plant, Riverside Lakes water:** utilities, not dealers.
- **John Henry's Plumbing:** the domain tried belongs to a Michigan meat company; own site not found.
- **Aksarben ARS:** the domain tried failed to load.
- **Leaf Home Water Solutions:** national company.
- **Culligan Water, Missouri Valley IA:** Iowa location; Omaha service not confirmed.
