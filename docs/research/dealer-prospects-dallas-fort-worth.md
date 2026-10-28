# Dallas-Fort Worth dealer prospects

Research draft. No one has been contacted.

Market: `dallas-fort-worth` (City of Dallas and City of Fort Worth plus close suburbs in Dallas and Tarrant counties). Companion data file: `dealer-prospects-dallas-fort-worth.csv` (15 rows, DFW-D-01 to DFW-D-15).

Homeowner angle for this market: both utilities reported UCMR 5 PFOA/PFOS results above 4 ppt, and Fort Worth has galvanized service lines. Rows note where a dealer's own site shows RO, whole-house carbon, or PFAS or lead reduction claims. No dealer site cited a specific NSF/ANSI 53 or 58 standard number; several show only an NSF logo or say "NSF certified".

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer and brand pages that loaded:** Puronics dealer page for DFW Pure Water (Euless); EcoWater dealer page for Fort Worth (Advantage Aqua LLC); Brita PRO partner page for DFW Water Softeners, LLC (Flower Mound). Kinetico, Culligan and RainSoft dealers were found by search and confirmed on their own sites. A Kinetico dealer page for Shelton's came up in search but was not opened.
- **Name finding only (never evidence):** Angi lists for Dallas, Fort Worth and Arlington; HomeAdvisor and Thumbtack result titles.
- **Search wordings:** softener, RO and whole-house filtration companies in Dallas, Fort Worth, Arlington, Grand Prairie, Irving, Richardson, Garland, Mesquite, DeSoto and Carrollton; "water treatment specialist" Dallas; PFAS filtration Dallas; brand searches for Kinetico, Culligan, RainSoft, EcoWater and Hague; Fort Worth plumbers with water treatment. Standard search mode returned mostly directory pages; extended search mode found company sites.
- **Did not load:** Service Champs (servicechampstx.com) returned an empty page. The TCEQ license search refused access by robots rule.
- **What a row needed:** the company's own site confirming it sells and installs or services residential softeners, RO or whole-house filtration in the DFW area. Every field comes from the page named in `contact_source_url`.
- **Left blank on purpose:** review fields and score. Decision makers only where the company's own site names an owner or founder.

## Licensing finding

- **Which license applies.** Texas licenses people who install, exchange, service and repair water treatment equipment as **Water Treatment Specialists** (WTS Class I, II and III). TCEQ's page says Class II may not work on RO or deionization equipment unless supervised by a higher class, and Class III covers RO and DI. Source: https://www.tceq.texas.gov/licensing/licenses/wtslic
- **Who runs it.** The brief pointed to the Texas State Board of Plumbing Examiners. TSBPE's own license search page (https://www.tsbpe.texas.gov/search/license-search) lists Responsible Master, Master, Journeyman, Tradesman-Limited, Inspector, Apprentice, Other Registrations and Endorsements, and does not mention a water treatment license. The WTS program is run by **TCEQ** on the pages read on 2026-10-28. No page found said it had moved to TSBPE.
- **Plumber exemption.** TCEQ's WTS page lists plumbers licensed under Occupations Code Chapter 1301 (TSBPE) as exempt, so a plumbing company working under a TSBPE master plumber license does not also need a WTS license.
- **City of Dallas.** Dallas Building Inspection has a Water Treatment Specialist Registration form (revised 01/18/18). It asks for the state WTS license number and expiry, the applicant certifies TCEQ compliance, the fee is $120, and the city registration expires with the state license. Source: https://dallas.gov/departments/sustainabledevelopment/buildinginspection/DCH%20documents/pdf/BI_Water%20Treatment%20Specialist%20Registration%20Form%201.18.pdf . A Dallas-side partner should hold both. Fort Worth's rules were not checked.
- **Lookups.**
  - TCEQ License Information search (https://www2.tceq.texas.gov/lic_dpa/index.cfm): the site's robots rule refused automated access. **Lookup blocked.**
  - TSBPE public search (https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do): an interactive session form; it was not completed. Not checked.
  - Result: no row has a verified license number or status. `license_checked_on` is 2026-10-28 on every row. Numbers shown on company sites are in notes as **self-reported**: DFW-D-02 (WTS #WT0007727), DFW-D-14 (RMP-38434), DFW-D-15 (M-36735 and others).

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| DFW-D-01 | Honest Water Co | Fort Worth (76112) | Independent | Named founder, published email, and an 11-county list that covers both cities. |
| DFW-D-02 | Water Fixers of DFW | Forney | Independent | Named founder, a self-reported WTS number, and an RO that it says reduces PFAS and lead. |
| DFW-D-03 | Dallas Water Doctor | Richardson | Independent | Dallas County specialist since 2000 whose homepage claims PFAS and lead removal. |
| DFW-D-04 | Elder's Pure Water | Aledo | Brand dealer (Kenai) | West-side specialist since 2016 with a long Fort Worth service list. |
| DFW-D-05 | JBC Water Treatment Company | Fort Worth (76112) | Independent (Hague products) | Fort Worth office that installs and repairs softeners, RO and whole-house filters. |
| DFW-D-06 | DFW Water Softeners | Flower Mound | Brand dealer (Brita PRO) | Lists Brita PRO PFAS filtering and covers Dallas, Tarrant and Denton counties. |
| DFW-D-07 | Your Water Guy | DFW (no address) | Independent | Small firm covering both cities with a published email, but the site is thin. |
| DFW-D-08 | FlowCore | Saginaw | Independent | Well, treatment and plumbing firm since about 2006, mostly well-water focused. |
| DFW-D-09 | Shelton's Water | Arlington | Brand dealer (Kinetico) | Kinetico dealer for 30+ years, between both cities, with a named founder. |
| DFW-D-10 | DFW Pure Water | Euless | Brand dealer (Puronics) | Puronics dealer midway between the cities that says master plumbers install. |
| DFW-D-11 | RainSoft of Dallas/Ft. Worth | Grand Prairie | Brand dealer (RainSoft) | Local since 1983, but the site is thin and it is tied to RainSoft and Home Depot programs. |
| DFW-D-12 | EcoWater Systems Texas | Fort Worth (per locator) | Brand dealer (EcoWater) | Lists lead and PFAS among issues treated, but its own site gives no address. |
| DFW-D-13 | Culligan of DFW Area | Irving | Franchise (Culligan) | Metro-wide coverage and a PFAS whole-house filter, with Culligan rules. |
| DFW-D-14 | Stinson Plumbing (Larry Stinson Plumbing) | Fort Worth (76118) | Plumbing co. | Tarrant County plumber since 2008 that installs softeners and filtration. |
| DFW-D-15 | Baker Brothers Plumbing, Air & Electric | Dallas/Mesquite (75150) | Plumbing co. | Large multi-trade firm on the Dallas side with softeners as a minor line. |

Counts: 6 independents, 7 brand or franchise dealers, 2 plumbing companies. Dallas side: DFW-D-02, -03, -11, -13, -15 (plus -06 north). Fort Worth side: DFW-D-01, -04, -05, -08, -09, -10, -12, -14.

## Top three to consider

1. **DFW-D-02 Water Fixers of DFW.** It is a water treatment specialist that names its founder, posts a Texas WTS license number that can be checked by hand, sells RO it says reduces PFAS and lead, and lists Dallas, so it fits the PFAS angle on the Dallas side.
2. **DFW-D-01 Honest Water Co.** It is a Fort Worth specialist with a named founder, a published email and a county-by-county list covering both cities, and it includes installation in its price, which suits a single test lead.
3. **DFW-D-09 Shelton's Water.** It has run in Arlington between the two cities for over 30 years as an independent Kinetico dealer and names its founder, though Kinetico dealer terms could limit exclusivity.

Alternate: DFW-D-03 Dallas Water Doctor is a Richardson specialist that answers seven days a week and claims PFAS and lead removal, but it names no owner and shows no license.

## Gaps

- **No license verified.** TCEQ's lookup is blocked by robots rule and TSBPE's is an interactive form. Only DFW-D-02 shows a WTS number. Shelton's, Elder's, DFW Water Softeners and Dallas Water Doctor claim licensed staff without numbers.
- **No NSF/ANSI 53 or 58 claim** with a standard number on any dealer site. PFAS or lead claims appear on DFW-D-02, -03, -05, -06, -12 and -13, all without a standard cited.
- **No street address on own site:** DFW-D-02 (Forney ZIP only), DFW-D-07, DFW-D-10 and DFW-D-12 (the last two have addresses only on manufacturer locator pages).
- **Decision makers:** named only for DFW-D-01 (Anthony Jory), DFW-D-02 (Sai Akash Tumu) and DFW-D-09 (Bob Shelton).
- **Legal entities:** shown only for DFW-D-04, DFW-D-06 and DFW-D-12 (from page metadata or locator pages). Texas SOS search was not tried.
- **Offices outside Dallas and Tarrant counties but serving them:** DFW-D-02 (Kaufman), DFW-D-04 (Parker), DFW-D-06 (Denton).
- **Southern Dallas and east Fort Worth suburbs** are thin; most rows are north, west or mid-cities.
- **Reviews:** not opened. Ratings in notes are the companies' own claims.

## Exclusions

- **Reliant Water (YTC Ventures LLC):** no street address, a toll-free number only, and it covers Houston, DFW and San Antonio.
- **Aqua Pure LLC:** offices in Katy and Sugar Land; its Dallas page is one of about 40 city templates, and the email is a gmail account.
- **Water Treatment Co (watertreatmentco.com):** a city-template page with no street address, owner, years or license. It may be a real installer; worth a second look if rows drop out.
- **North Texas Water Systems (Kinetico, Plano):** Collin County office, a gmail address, no installation evidence, and a 2019 copyright.
- **Cattlemans Plumbing (formerly C&C Plumbing):** its water treatment page names no city list, brands or license and shows no water treatment work.
- **Jason's Water Systems:** Spring Branch headquarters with no DFW office shown; it serves Texas statewide.
- **PureSpring Water Softeners & Filters:** cloned or template content with no installation evidence.
- **TX Water Treatment (txwatertreatment.com):** its Carrollton page gives an Austin address and phone.
- **Service Champs:** its page returned no content.
- **Leaf Home Water Solutions:** national company.
- **1-800-Plumber and Mr. Rooter:** national plumbing franchises; not researched.
- **Names found but not researched (directories only):** Eden Wellsprings, VA Water LLC, Lewis Filtration Services, GOODWATER RSV, Big Power Water Co., Ernie's Plumbing, BP Lonestar, Culligan of Weatherford, SWAT Plumbing (Aledo), and AquaGuard (Puronics). Running these is the clearest way to add southern Dallas and east Fort Worth rows.
