# Baltimore dealer prospects

Research draft. No one has been contacted.

Market: `baltimore` (Baltimore City and Baltimore County, Maryland). Companion data file: `dealer-prospects-baltimore.csv` (14 rows, BAL-D-01 to BAL-D-14). Dealers based outside the two jurisdictions are included only where their own site names Baltimore, Baltimore County or towns in it.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Homeowner concern:** lead service lines and general filtration, so rows with RO, whole-house filtration or lead content on their own site were favored. No row's own site states an NSF/ANSI 53 or 58 certification. Lead claims are noted in the CSV only as the site words them.
- **Brand pages that loaded:** Culligan's Annapolis (Elkridge) dealer page on culligan.com; Culligan Mid-Atlantic's own site; RainSoft of Baltimore's own site; EcoWater's Westminster page (it redirects to Carroll Water); WaterCare's Maryland dealer list (names Atlantic Blue).
- **Did not load or not used:** culligan.com dealer-locator page for ZIP 21054 (site error). Kinetico's dealer-detail page is not a static locator; no Kinetico dealer for Baltimore was found. The Maryland Department of Labor license search asks the user to tick a box before searching, so it was treated as a check and not used; direct access was also refused.
- **Name finding only (never evidence):** HomeAdvisor pages for Baltimore, Cockeysville and Elkridge; Yellow Pages Baltimore water systems page; Angi and Houzz listings.
- **Search wordings:** softener, RO and whole-house filtration by Baltimore, Towson, Catonsville, Baltimore County; lead filter and RO for Baltimore homes; Baltimore City plumber plus whole-house filter; brand searches for Culligan, Kinetico, EcoWater, RainSoft and Hague; names from the state water conditioner installer roster.
- **What a row needed:** the company's own site confirming it sells and installs or services residential softeners, RO or whole-home filtration, and naming Baltimore, Baltimore County or towns in either.
- **Left blank on purpose:** review fields and score. Decision maker only where the company's own site names an owner (one row).

## Licensing finding

- **Water conditioner installer license (state).** Maryland's State Board of Well Drillers, part of the Maryland Department of the Environment, issues a Water Conditioner Installer (WCI) license and an Apprentice WCI license under Title 13 of the Environment Article. The Board's applicant information says well drilling includes installing well system equipment, and that well system equipment includes water conditioning equipment. Board page: https://mde.maryland.gov/programs/Permits/EnvironmentalBoards/Pages/boardofwelldrillers.aspx . Applicant information: https://mde.maryland.gov/programs/Permits/EnvironmentalBoards/Documents/MDE-WMA-BWD-INT.pdf . Statute text (2013 code on Justia, which says it may not be current): https://law.justia.com/codes/maryland/2013/article-gen/section-13-306/index.html .
- **Plumbing license.** The Maryland State Board of Plumbing (Maryland Department of Labor) licenses plumbers: https://labor.maryland.gov/license/pl/plfaqs.shtml . The pages read did not say whether connecting a softener or RO unit on public water needs a plumbing license, a WCI license or both. Because the WCI license is framed around well system equipment, and Baltimore City and Baltimore County homes are mostly on city water, a partner holding a Maryland master plumber license, or using one, looks like the safer match (judgment call, not a regulator statement).
- **Local layer.** Anne Arundel County issues its own water conditioner installer license (https://www.aacounty.org/node/6698), so counties can add their own rules. One row (BAL-D-13) self-reports a Baltimore County plumbing license. Baltimore City and Baltimore County local rules were not researched.
- **Lookups.**
  - Board of Well Drillers: no online lookup. It publishes a roster of active/current licensees by company, printed 2026-09-28: https://mde.maryland.gov/programs/permits/EnvironmentalBoards/Documents/Roster-by-Company.pdf . The roster gives no city or expiry date, so matches are by company name only, and a few names fall across page breaks.
  - Maryland Department of Labor plumbing (and MHIC) search: https://www.dllr.state.md.us/cgi-bin/ElectronicLicensing/OP_search/OP_search.cgi?calling_app=PLM::PLM_qselect asks the user to tick a box before searching. Treated as a check. **Lookup blocked.** Plumbing numbers on company sites are recorded in notes as self-reported.
- **Result:** 4 of 14 rows show a WCI licensee on the Board roster (BAL-D-01, -02, -05, -09). No plumbing license was verified. `license_checked_on` is 2026-10-28 on every row.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| BAL-D-01 | National Water Service | Woodbine | Independent | Specialist since 1979 with a Baltimore County page that recommends RO for lead, a WCI on the state roster and a published email. |
| BAL-D-02 | R&G Water Systems | Hampstead | Independent | Family specialist that names Baltimore County, has two WCIs on the roster and a published email, but no RO or lead product. |
| BAL-D-03 | Water Doctor | Annapolis Junction | Independent | Specialist since 1978 with a Baltimore softener page, RO and lab testing, and Baltimore County towns listed. |
| BAL-D-04 | Atlantic Blue Water Services | Westminster | Brand dealer (WaterCare) | Has Baltimore County and Towson pages, a lead page, whole-house RO and a published email. |
| BAL-D-05 | Carroll Water | Cockeysville | Brand dealer (EcoWater) | Office inside Baltimore County, names Baltimore City, RO and filters, and a WCI on the roster. |
| BAL-D-06 | RainSoft of Baltimore | Baltimore (21221) | Brand dealer (RainSoft) | Local RainSoft dealer with RO and filtration, but no towns named and no email. |
| BAL-D-07 | Culligan of Annapolis (Elkridge) | Gambrills | Franchise (Culligan) | Culligan dealer page lists Baltimore, with RO and whole-house filtration and a published email. |
| BAL-D-08 | Culligan Mid-Atlantic | New Freedom, PA | Franchise (Culligan) | Names Baltimore County, full Culligan line incl. PFAS filter, published email, but based in Pennsylvania. |
| BAL-D-09 | Hague Quality Water of Maryland | Annapolis | Brand dealer (Hague) | Hague dealer with a WCI on the roster that lists Baltimore, but no RO named and it sits in Annapolis. |
| BAL-D-10 | Mike's Plumbing & Heating | Essex | Plumbing co. | Baltimore County plumber naming Hampden and Towson, with whole-house, under-sink and RO systems. |
| BAL-D-11 | Len The Plumber | Halethorpe | Plumbing co. | Large plumber that names Baltimore City and County, with softeners and whole-home filtration. |
| BAL-D-12 | Five Star Plumbing | Joppa | Plumbing co. | Owner-named master plumber serving Baltimore County towns, with RO, carbon and UV, and an email. |
| BAL-D-13 | Ensor Plumbing | Monkton | Plumbing co. | Plumber with a full water treatment line and self-reported state and Baltimore County licenses. |
| BAL-D-14 | Brian B. Quick Plumbing | Reisterstown | Plumbing co. | Master plumber with a Baltimore softener page naming city neighborhoods, but softeners only. |

Counts: 3 independents, 6 brand or franchise dealers, 5 plumbing companies.

## Top three to consider

1. **BAL-D-01 National Water Service.** It is a water treatment specialist with a page written for Baltimore County that pushes RO for lead, a water conditioner installer on the state roster, a self-reported master plumber license and a published email.
2. **BAL-D-05 Carroll Water.** It is the only row with an office inside Baltimore County that also names Baltimore City, it has a WCI on the state roster, and it sells RO and whole-house filters, though it publishes no email and is an exclusive EcoWater dealer.
3. **BAL-D-04 Atlantic Blue Water Services.** It has Baltimore County and Towson pages, a dedicated lead page, whole-house RO and a published email, though no license was found under its name.

Alternate: BAL-D-02 R&G Water Systems has two WCIs on the roster and a published email, but its site names no RO or lead product, which matters for a lead-line market.

## Gaps

- **Baltimore City is thin.** Only BAL-D-05, BAL-D-11 and BAL-D-14 name Baltimore City outright (BAL-D-10 names Hampden). Most specialists name Baltimore County only.
- **No specialist office in Baltimore City.** The nearest specialist offices are in Cockeysville, Essex and Annapolis Junction.
- **No NSF/ANSI 53 or 58 claims** were found on any row's own pages. Lead claims are general.
- **Licenses:** WCI roster matches are by company name only. No plumbing or MHIC license was verified because the state search asks for a tick-box check. Whether a WCI or a plumbing license governs city-water installs was not confirmed from a regulator page.
- **No Kinetico dealer** for Baltimore was found.
- **Emails:** none published for BAL-D-03, -05, -06, -09, -10, -11, -13, -14. Two published emails are staff or owner named (BAL-D-07, -12).
- **Decision makers:** only BAL-D-12 names an owner.
- **Reviews:** not opened.

## Exclusions

- **Leaf Home Water Solutions:** national company (Ohio).
- **Aerus of Towson (aerustowson.com):** RO and filtration pages loaded, but no phone, address or company contact on the pages read.
- **Blue Dot of Maryland (bluedotmd.com):** softener and purification pages loaded with no phone, address or license.
- **Saffer Total Home (Baltimore):** lists "Well & Water Treatment" but the pages read describe no softener, RO or filtration product.
- **Prime Plumbing (Glen Burnie):** Brita PRO whole-home filtration with a lead-reduction claim and MHIC 165008 (self-reported), but its page names Baltimore only once and says "Central Maryland"; service area not confirmed.
- **Mr. Water Professional Water Treatment of Maryland:** Hagerstown, far from Baltimore.
- **Lester Water Inc:** WCI on the roster, but results point to Chester County, Pennsylvania.
- **No own site found (names only):** Arundel Gas & Water Conditioning (WCI on roster), Feezer Water Systems (WCI on roster), Tapp Water Systems, Baltimore Water Treatment Inc, Mermaid Water Systems, Nature's Own Water Systems, Atlantic Filtration Systems.
- **Not researched (names only):** Sila Heating, Cooling and Plumbing (on the DC list), Purfect Water Solutions (Puronics), J-Squad Services, Pohlman Plumbing, Honest Abe Plumbing, TNT Plumbing, Roto-Rooter, F.H. Furr Finksburg, maxrooter.us.
- **Directory, retail and lead sites (names only):** Angi, HomeAdvisor, Yelp, Yellow Pages, Houzz, BBB, Thumbtack, instaservice.com, contractorplus.app, softprowatersystems.com.
