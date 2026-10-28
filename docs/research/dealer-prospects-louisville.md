# Louisville dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-louisville.csv` (12 rows, LOU-D-01 to LOU-D-12). Market: Louisville, Kentucky metro (Jefferson County and adjacent suburbs).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Name sources (names only, never evidence):** needinstall.com Louisville water treatment list, HomeAdvisor Louisville water treatment and Shepherdsville lists, Angi Louisville and La Grange water softener lists, BBB category pages for Shively, La Grange and Lexington (these loaded), and web searches by product and suburb.
- **Manufacturer locators:** Kinetico's dealer page loaded but listed no dealers. EcoWater searches returned only Louisville, Tennessee. Culligan (Kentuckiana Culligan) and RainSoft (RainSoft of Greater Kentucky) were found through their own dealer sites. Hague and Pentair were not reached.
- **Did not load:** originalpurewater.com (robots), flowritesolutions.com (error), the Louisville HomeAdvisor water softener installation list (no results), and the DHBC plumbing FAQ PDF.
- **Search budget:** the shared web search limit for this session ran out partway through. Remaining candidates were checked only by opening company pages already found. Several directory names were not followed up (see exclusions).
- A row was kept only when the company's own site confirmed residential water treatment and Louisville coverage. Every CSV field comes from a page that was opened, listed in `contact_source_url` or the notes.

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
| LOU-D-01 | Alderstone Water Company | Louisville (no street address) | Independent | Water treatment only: softeners, whole-home, RO, well. Names many Louisville suburbs. Thin on business details. |
| LOU-D-02 | RainSoft of Greater Kentucky | Louisville (40299) | Brand dealer (RainSoft) | Dedicated water treatment dealer with a Louisville office and install and repair service. LLC confirmed on a state page. |
| LOU-D-03 | Kentuckiana Culligan | Clarksville, IN (serves Louisville) | Franchise | Full Culligan line with installation. Office is across the river in Indiana. |
| LOU-D-04 | 1-Tom-Plumber Louisville | Louisville (40222) | Franchise (plumbing) | Detailed softener install and repair page. Shows a Kentucky M license number. |
| LOU-D-05 | Tom Drexler Plumbing, Air & Electric | Louisville (40218) | Plumbing co. | Whole-home water treatment installs. Since 1982. Shows a plumbing license number. |
| LOU-D-06 | Jarboe's Heating, Cooling, Plumbing & Electrical | Louisville (40218) | Plumbing co. | Softener installs. Three Louisville-area offices. Shows a Kentucky M license number. |
| LOU-D-07 | Dauenhauer Plumbing, Heating & Air | Louisville (40218) | Plumbing co. | Softeners, RO, whole-house and UV. Offices in both Louisville and Lexington. |
| LOU-D-08 | Absolute Services | Louisville (40241) | Plumbing co. | Filtration, RO and softener installs. Published email. Offices in both markets. |
| LOU-D-09 | Bryant Heating, Cooling, Plumbing & Electric | Louisville (40218) | Plumbing co. | Softeners, RO and whole-house. Offices in both markets. |
| LOU-D-10 | Greenwell Plumbing, Heating & Air | New Albany, IN (serves Louisville) | Plumbing co. | Installs conditioning, RO and whole-house systems. Indiana office. |
| LOU-D-11 | A+ Derr Heating & Cooling | Louisville (40223 and 40213) | Plumbing co. | Softeners, carbon and RO. HVAC-led company; no Kentucky plumbing number shown. |
| LOU-D-12 | Peterman Brothers | Louisville (40218) | Plumbing co. | Softeners, whole-home, RO, iron. Owners named. Water treatment pages are company-wide. |

Counts: 1 independent specialist, 1 brand dealer (RainSoft), 2 franchises (Culligan, 1-Tom-Plumber), 8 plumbing or home services companies with water treatment lines.

## Top three to consider

1. **LOU-D-02 RainSoft of Greater Kentucky:** it is a dedicated water treatment dealer with a Louisville street address, its own install and repair service, and an LLC that a state regulator page confirms, though its RainSoft-only line and dealer terms may limit flexibility.
2. **LOU-D-03 Kentuckiana Culligan:** it is a full-line water treatment specialist that names Louisville as a service area and does installs with before-and-after water testing, though its office is in Clarksville, Indiana.
3. **LOU-D-05 Tom Drexler Plumbing, Air & Electric:** it is a long-running Louisville plumbing company that installs whole-home water treatment and shows a plumbing license number, which would cover the piping connection once verified.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **Few independent specialists.** Only Alderstone was confirmed, and it shows no street address, entity or owner. Directory names that may be specialists (Home Water Solutions, A Plus Water Conditioning, Tri-State Water, Power & Air, Better Water Warehouse, Original Pure Water, Flow Rite) were not confirmed before the search budget ran out.
- **No license verified.** The DHBC lookup could not be submitted. A manual check would settle LOU-D-04, LOU-D-05, LOU-D-06 and LOU-D-08, which show numbers on their sites.
- **Indiana offices:** LOU-D-03 and LOU-D-10 are based in Indiana. Their Kentucky plumbing licensing is unknown.
- **Missing details:** legal entity found only for RainSoft. Owners named only for Peterman. Few published emails (Absolute Services only). Several phone conflicts or out-of-state area codes (LOU-D-02, LOU-D-11, LOU-D-12).
- **Culligan of Central Kentucky (LEX-D-03)** says it serves the whole state and may also cover Louisville; not counted here.
- **Reviews:** not opened.

## Exclusions

- **Wellness Water Filtration Systems (wellnesswaterfiltrationsystems.com/louisville-ky and wellnesswaterfiltrationsystemslouisvilleky.com):** no address, phone or email; one page's title targets Murrieta, CA and the Louisville text contains spun synonym brackets. Treated as a templated lead-generation site.
- **Clearstone Water Company (clearstonewater.com):** listed by BBB in Louisville, but the site shows no address, phone, entity or install detail. Own site does not confirm an operating installer.
- **Excalibur Water, Louisville page:** a brand location page with a phone number only; no address, local business name or installation evidence.
- **Water Energizers, Inc. (Jeffersonville, IN):** industrial and commercial water treatment only; no softeners, RO or residential filtration.
- **Compass Filtration Services, LLC:** Louisville address, but the site does not state residential softener, RO or whole-home work.
- **Maeser Master Services and Golden Plumbing:** Louisville plumbing companies whose sites show no water treatment service.
- **Original Pure Water:** site refused automated access (robots). **Flow Rite Service Company:** site did not load.
- **Leaf Home Water Solutions:** national company. **Louisville Water Company:** utility. **Lowe's:** retailer.
- **reverseosmosisinstallation.com, jensonrosysteminstallation.com, plumberinlouisvilleky.com, novawrench.pages.dev:** appeared in search results with generic installer names; not opened, and their names and addresses suggest lead-generation sites (inference).
- **Benjamin Franklin Plumbing (Louisville), Parker Plumbing, RL Plumbing, Tony's Plumbing, Durbin Plumbing, Moonlight Plumbing, Wolz Plumbing & Design / Environmental Safety Technologies, Blackburn & Davis, Sanders Water Heaters and Plumbing, Home Water Solutions, A Plus Water Conditioning, Tri-State Water, Power & Air, Better Water Warehouse:** names from directories only; own sites not reached before the search budget ran out.
