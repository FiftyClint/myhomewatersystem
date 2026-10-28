# Lexington dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-lexington.csv` (11 rows, LEX-D-01 to LEX-D-11). Market: Lexington, Kentucky (Fayette County and adjacent suburbs).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Name sources (names only, never evidence):** Superpages Lexington water filtration list, HomeAdvisor Lexington water softener list, Angi Lexington water softener list, BBB category pages for Lexington, Versailles and Nicholasville (these loaded), and web searches by product and town.
- **Manufacturer locators:** the Culligan location page for Central Kentucky loaded. Kinetico's dealer page loaded but listed no dealers; the Kinetico dealer (Aqua Clear) was found through BBB and its own site. RainSoft (KY Water & Air) was found through its own site. EcoWater searches returned no Kentucky dealer. Hague and Pentair were not reached.
- **Did not load or returned nothing:** HomeAdvisor Versailles list (error), HomeAdvisor Lexington and Nicholasville water treatment lists (no company names), and the DHBC plumbing FAQ PDF.
- **Search budget:** the shared web search limit for this session ran out partway through. Remaining candidates were checked only by opening pages already found.
- A row was kept only when the company's own site confirmed residential water treatment and Lexington coverage. Every CSV field comes from a page that was opened, listed in `contact_source_url` or the notes.

## Licensing finding (Kentucky, applies to Louisville and Lexington)

- **Regulator:** the Kentucky Department of Housing, Buildings and Construction (DHBC), Division of Plumbing. Its page says KRS Chapter 318 charges it to license master and journeyman plumbers, issue plumbing permits and inspect work under the Kentucky State Plumbing Code. It also says permits go to licensed master plumbers or to homeowners for their own homes, and other plumbing work "must be installed by a licensed journeyman plumber under the supervision of a licensed master plumber." Source: https://dhbc.ky.gov/newstatic_info.aspx?static_id=337
- **State law:** KRS 318.010(4) defines plumbing as installing in buildings "the pipes for distributing the water supply, the fixtures for using water ... together with fittings, appurtenances, and appliances of various kinds." The text read (2024 version on Justia, https://law.justia.com/codes/kentucky/2024/chapter-318/section-318-010/) does not mention water softeners, water treatment or water conditioning. KRS 318.015 says the chapter applies in all counties and does not apply to farmsteads. KRS 318.020 exempts apprentices, maintenance workers and water utility employees. No softener exemption like Indiana's was found.
- **Permits:** 815 KAR 20:050 (effective 3-1-2022, https://apps.legislature.ky.gov/law/kar/titles/815/020/050/) requires a permit for new plumbing installations, relocated fixtures, water service work, backflow devices added to a water service and water heaters. It does not name water treatment equipment. 815 KAR 20:120 (water supply and distribution) was checked and does not mention softeners or filters.
- **What this means in practice (inference):** Kentucky has no separate water treatment license that was found. Connecting a softener, whole-home filter or RO unit to a home's water distribution piping appears to fall within the statutory definition of plumbing, so the installing company would need a Kentucky master plumber, with journeyman plumbers doing the work. Whether DHBC treats a softener swap or an under-sink RO as permit-free repair work was not confirmed. A DHBC FAQ on when a plumbing license is needed (dhbc.ky.gov/Documents/KHBC-FAQWhenplumbing.pdf) did not load.
- **License number pattern (inference):** on the sites read, Kentucky master plumber numbers start with M (for example M5308, M5940, M8594 labeled "KY State Master Plumber"), master HVAC numbers with HM, journeyman with J, and master electrician with ME or CE.
- **Local rules:** KRS 318.015 applies the state law in every county. Louisville Metro and Lexington-Fayette Urban County Government local contractor rules were not checked.
- **Lookup:** the DHBC Licensee Search (https://dhbc.ky.gov/Search/HBC_List_Licensees.aspx) loads without login and covers plumbing, HVAC and electrical license types, but it is a form that must be submitted interactively. The read-only fetch tool could not submit it, so no license was verified. Numbers companies show on their own sites are in the CSV notes as "self-reported".

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| LEX-D-01 | Bluegrass Water Treatments | Harrodsburg (serves Lexington) | Independent | Specialist with softeners, RO, filters and salt delivery. Owner named. Installs by certified plumbers. |
| LEX-D-02 | KY Water & Air | Lexington (40504) | Brand dealer (RainSoft) | Specialist with a Lexington office. Next-day installation. |
| LEX-D-03 | Culligan of Central Kentucky (KarSare Water Systems) | Versailles (40383) | Franchise | Full Culligan line, services most makes since 1994. Published email. |
| LEX-D-04 | Aqua Clear Water Systems | Frankfort (40601) | Brand dealer (Kinetico) | Kinetico softeners, RO and filtration. Founder named. Mainly a Tennessee company. |
| LEX-D-05 | Fayette Heating & Air with H2O Maestro Plumbing | Lexington (40511) | Plumbing co. | Softener installs in Lexington. Shows an M license number. |
| LEX-D-06 | Dauenhauer Plumbing, Heating & Air | Lexington (40505) | Plumbing co. | Softeners, RO, whole-house and UV. Offices in both markets. |
| LEX-D-07 | Bryant Heating, Cooling, Plumbing & Electric | Lexington (40509) | Plumbing co. | Softeners, RO and whole-house. Offices in both markets. |
| LEX-D-08 | Absolute Services | Lexington (40511) | Plumbing co. | Filtration, RO and softener installs. Published email. |
| LEX-D-09 | GreenBox Heating & Air with Turbo Plumbing Pros | Lexington (40508) | Plumbing co. | Softener installs, RO and filtration. Shows a master plumber number. |
| LEX-D-10 | Elite Performance Plumbing | Lexington (40509) | Plumbing co. | Licensed softener installs. Main office in Richmond. |
| LEX-D-11 | Tom Drexler Plumbing, Air & Electric | Frankfort office (serves Lexington) | Plumbing co. | Whole-home treatment installs. No Lexington office. |

Counts: 1 independent specialist, 2 brand dealers (RainSoft, Kinetico), 1 franchise (Culligan), 7 plumbing or home services companies with water treatment lines.

## Top three to consider

1. **LEX-D-02 KY Water & Air:** it is a water treatment specialist with a Lexington street address and next-day installation, which makes it the closest specialist to Fayette County homeowners, though it sells only the RainSoft line.
2. **LEX-D-01 Bluegrass Water Treatments:** it is an independent, family-owned specialist with a named owner, a full product line and certified plumber installs, and it lists Lexington as a service area, though its office is in Harrodsburg.
3. **LEX-D-03 Culligan of Central Kentucky:** it is a full-line Culligan dealer next door in Versailles that names Lexington first in its service area, publishes a business email and services most makes.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **No license verified.** The DHBC lookup could not be submitted. A manual check would settle LEX-D-05 and LEX-D-09, which show master plumber style numbers, and would show whether the specialists (LEX-D-01 to LEX-D-04) hold or employ a Kentucky master plumber.
- **Only one specialist office in Fayette County** (KY Water & Air). The others are in Harrodsburg, Versailles and Frankfort.
- **Below the 12 to 15 target.** Names not followed up because the search budget ran out: Creative Water Solutions (Nicholasville, listed with a rainsoft.com link), Authentic Water Conditioning, Nimbus Water Purification Systems, H 2 Osmosis, Service Central KY, Brady Brewer Plumbing, Boone Plumbing, Wallace Plumbing.
- **Missing details:** legal entity found only for Aqua Clear (Enjoy LLC). Owners named only for Bluegrass Water Treatments and Aqua Clear. Phone conflicts at Aqua Clear and Fayette Heating & Air.
- **Ownership change:** Culligan of Central Kentucky says it is under new local ownership; older directory listings show KarSare as a Kinetico seller.
- **Reviews:** not opened.

## Exclusions

- **Mr. Rooter Plumbing of Lexington:** its softener page covers repair and maintenance only; installation is not stated.
- **Maeser Master Services:** serves Lexington, but its site shows no water treatment service.
- **Wellness Water Filtration Systems Lexington site:** not opened; same naming pattern as the Louisville site that read as a templated lead-generation page.
- **Aqua-Tronics:** Angi lists it in Florence, KY (Northern Kentucky); own site not found.
- **Doyle Water Distributors, Bluegrass/Kesco, US Filter Distribution:** Superpages names; own sites not opened and residential water treatment not shown.
- **Pond and Fountain World, irrigation companies, Coca-Cola Bottling, Kentucky Utilities, water districts:** not residential water treatment installers.
- **Leaf Home Water Solutions:** national company.
- **Ohio-based dealers on the BBB Lexington page (Culligan of Cincinnati, Ohio Valley Pure Water Systems and others):** outside the market.
- **Creative Water Solutions, Authentic Water Conditioning, Nimbus Water Purification Systems, H 2 Osmosis, Service Central KY, Brady Brewer Plumbing, Boone Plumbing, Wallace Plumbing:** names from directories only; own sites not reached before the search budget ran out.
