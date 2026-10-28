# St. Louis dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-st-louis.csv` (9 rows, STL-D-01 to STL-D-09). Market: City of St. Louis and St. Louis County, Missouri. The homeowner concern is lead service lines, so rows that show RO or whole-home filtration rank above softener-only rows.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Name sources (names only, never evidence):** HomeAdvisor Fenton and Wentzville water treatment lists, Prime Buyer's Report St. Louis County list, and web searches by product and suburb.
- **Manufacturer locators:** the Kinetico dealer page for H2ONLY loaded. RainSoft's St. Louis pages name no dealer and point to a dealer search. Culligan pages loaded. Aqua Systems' St. Louis page returned a 404.
- **Did not load:** watercenterplaza.com (H2ONLY's own site, robots refused), plumbingmasters.com (error), several St. Louis County government pages (errors), and the Tri-State Water, Power & Air St. Louis softener page (empty).
- **Search budget:** the shared web search limit for this session ran out partway through this market. After that, only pages already found were opened. Several directory names could not be matched to a company site (see exclusions).
- A row was kept only when the company's own site confirmed residential water treatment and coverage of St. Louis City or County. Every CSV field comes from a page that was opened, listed in `contact_source_url` or the notes.

## Licensing finding (Missouri, St. Louis City and County)

- **State:** no state-issued plumbing license. RSMo 341.010 requires a plumbing certificate for anyone working at the business of plumbing in cities or towns of 15,000 or more, issued through local boards. Source: https://revisor.mo.gov/main/OneSection.aspx?section=341.010 (the same finding is in `kc-licensing.md`).
- **St. Louis County:** the Department of Transportation and Public Works, Plumbing Code Licensing, issues six master licenses: Master Plumber, Master Drainlayer, Master Pipefitter, Master Sprinklerfitter, Master Lawn Irrigation System Installer and Master Water Heater Replacement Specialist. There is no water softener or water treatment license. Source: https://stlouiscountymo.gov/st-louis-county-departments/transportation-and-public-works/plumbing-licensing/plumbing-master-plumber/plumbing-surety-bond/ . The county's plumbing code copy, residential plumbing permit page and board policies returned errors, so the code's text on water treatment was not read.
- **City of St. Louis:** the Building Division issues plumbing permits only to "licensed plumbing contractors who are certified by the City of Saint Louis" with a registered trades contractor account. Its permit and fee pages do not mention softeners or water treatment, and the fee schedule has no line for them. Sources: https://www.stlouis-mo.gov/government/departments/public-safety/building/permits/plumbing-permit.cfm and https://www.stlouis-mo.gov/government/departments/public-safety/building/permits/plumbing-permit-fees.cfm
- **What this means in practice (inference):** in both the city and the county, the license that would cover connecting a softener or whole-home filter to the water piping is a master plumber or city-certified plumbing contractor license. Whether a stand-alone softener or under-sink RO install needs a permit was not confirmed. Some St. Louis County municipalities run their own plumbing permits (University City has a plumbing permit page that was not opened).
- **Lookup:** St. Louis County's licensing pages returned errors to the read-only fetch tool (lookup blocked), and the City of St. Louis gives no public license lookup on the pages read. No license was verified. Numbers companies show on their own sites are in the CSV notes as "self-reported".

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| STL-D-01 | Jones Air & Water Treatment, LLC | Portage Des Sioux (St. Charles Co.) | Independent | Specialist since 1995, owner named and installs every job. Covers only west St. Louis County. |
| STL-D-02 | Wellspring Water Filtration of St. Louis | Chesterfield | Independent | Whole-house, RO and softeners in west county. Owner named. No street address. |
| STL-D-03 | All Pro Water LLC | Ellisville | Brand dealer (Hague) | Softeners and whole-house filtration across St. Louis County. Install photos. |
| STL-D-04 | Pure Honest Water | Carlyle, IL | Brand dealer (Kinetico) | Kinetico softeners and RO pitched for lead and PFAS. Names Clayton and Creve Coeur. Illinois-based. |
| STL-D-05 | Culligan of St. Louis | Chesterfield | Franchise | Full Culligan line with RO and whole-home filters. Published email. |
| STL-D-06 | Moore Water & Air (St. Louis) | St. Louis (no address) | Independent (multi-state) | Softeners, whole-home and RO. Only a national toll-free number. |
| STL-D-07 | Anton's Plumbing, Heating/Cooling & Energy Experts | Fenton | Plumbing co. | Whole-home filtration and softeners. Shows St. Louis County and City plumbing numbers. |
| STL-D-08 | Academy Air | Hazelwood | Plumbing co. | Softener and filtration installs across north and west county. Published email and plumbing number. |
| STL-D-09 | Hoffmann Brothers | St. Louis City (Tower Grove Ave) | Plumbing co. | Whole-house carbon filtration and softening. Covers City and inner-ring suburbs. |

Counts: 3 independent or multi-state specialists, 2 brand dealers (Hague, Kinetico), 1 franchise (Culligan), 3 plumbing or home services companies.

## Top three to consider

1. **STL-D-01 Jones Air & Water Treatment, LLC:** it is an owner-run water treatment specialist with a named founder, a published email, RO and carbon filtration, and installs done by the owners, though it covers only west St. Louis County from St. Charles County.
2. **STL-D-05 Culligan of St. Louis:** it is a full-line dealer with RO and whole-home filtration, a Chesterfield office and a published email, and it covers the whole metro.
3. **STL-D-07 Anton's Plumbing, Heating/Cooling & Energy Experts:** it is a plumbing company that installs whole-home filtration and softeners and shows St. Louis County and City plumbing license numbers, which would cover the piping connection once verified.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **Fewer than 12 rows.** The search budget ran out before the directory names below could be matched to company sites. The strongest missing candidate is H2ONLY Water Purification Systems (Kinetico dealer, 3328 N Lindbergh Blvd, Saint Ann, MO 63074, 314-209-1996, per its Kinetico dealer page), whose own site refused automated access.
- **No NSF/ANSI 53 or 58 claims.** Culligan says its systems are certified to ANSI/NSF standards without naming them. Pure Honest Water claims RO removes lead and PFAS without a standard number.
- **St. Louis City is thin.** Only Hoffmann Brothers has an office in the city. Jones Air & Water and All Pro Water do not name the city.
- **No license verified.** County pages were blocked and the city has no public lookup. A manual check would settle STL-D-07 (County P5325, City MPD32) and STL-D-08 (P7666).
- **Missing details:** street address missing for STL-D-02 and STL-D-06. Few owners named.
- **Reviews:** not opened.

## Exclusions

- **H2ONLY Water Purification Systems (Saint Ann):** own site (watercenterplaza.com) refused automated access (lookup blocked); only the Kinetico dealer page was read. Worth a manual check.
- **Trusted Water Co (trustedwater.co):** no street address, entity or owner; 573 area code phone; could not confirm an operating installer.
- **Tri-State Water, Power & Air:** its site shows generators, water heaters and plumbing but no water treatment line; corporate address in Addison, TX.
- **Mr. Rooter Plumbing of St. Charles:** covers St. Charles County only; St. Louis County not named.
- **Classic Aire Care (formerly Faszold):** the Faszold softener page redirects to Classic Aire Care, whose page shows no water treatment line.
- **Plumbing Masters:** site returned an error.
- **Aqua Systems (St. Louis page):** 404. **Leaf Home Water Solutions:** national company. **RainSoft corporate St. Louis pages:** name no local dealer.
- **waterfiltersofamerica.com:** online retailer.
- **stlouiswatertesting.com, lakestlouiswatersoftener.com, reverseosmosisstl.com:** appeared in search results but were not opened; keyword domains suggest lead-generation sites (inference).
- **Ark Plumbing & Water Conditioning (Fenton), Aqua Pure (Hazelwood), Purefect Water Systems, American Water Treatment Inc, Watcon Water Conditioning, Krystal Klear Water, Quality Water Treatment Inc, Trionics Superior Water, Mr. Rooter Plumbing of St. Louis, Brighthouse Plumbing, Maplewood Plumbing:** names and addresses from directories only; own sites not found before the search budget ran out.
