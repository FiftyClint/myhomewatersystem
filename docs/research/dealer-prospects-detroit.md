# Detroit dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-detroit.csv` (14 rows, DET-D-01 to DET-D-14). Market: Detroit and nearby Wayne, Oakland and Macomb County suburbs. The homeowner concern here is lead service lines, so rows that show filtration, RO or a lead product rank above softener-only rows.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Name sources (names only, never evidence):** HomeAdvisor water treatment and softener lists for Detroit, Livonia, Clinton Township, Troy, Dearborn, Canton, Southfield, Rochester Hills, Farmington and Sterling Heights; Angi lists for Royal Oak, Plymouth, Warren, Wayne, Romeo and St. Clair; BBB Saline category page; Superpages Macomb; thebuildermarket Troy; MapQuest and chamber listings to find company domains.
- **Manufacturer locators:** the EcoWater dealer page for Douglas Water Conditioning and the Pentair True Blue page for Micropure Water Services loaded as static pages. Kinetico dealer pages surfaced only for out-of-area dealers. Culligan location pages loaded for Wixom and Romeo. The Pentair locator itself needs a location search and was not usable.
- **Did not load:** aaaqualitywater.com (robots refused). Directory pages do not show company websites, so several names could not be matched to a site.
- **Search budget:** the first wordings returned mostly directories. A broader search mode found most company sites. The shared web search limit for this session ran out during the St. Louis work, after the Detroit searches were done.
- A row was kept only when the company's own site confirmed residential water treatment and coverage of the Detroit area. Every CSV field comes from a page that was opened, listed in `contact_source_url` or the notes.

## Licensing finding (Michigan)

- **Regulator:** the Michigan Department of Licensing and Regulatory Affairs (LARA), Bureau of Construction Codes, licenses plumbing contractors, master plumbers and journey plumbers under the Skilled Trades Regulation Act. Licensing section: https://www.michigan.gov/lara/bureau-list/bcc/sections/licensing-section
- **Water treatment exemption:** MCL 339.6107 (Sec. 1107) says no one may work as a plumbing contractor or plumber without a license, but subsection (2)(c) exempts "the installation of domestic water treatment and filtering equipment" that modifies an existing cold water supply and its waste piping, if a permit is secured, the required inspections are done, and the work meets the state construction code. Source: https://zeus-milenia.legislature.mi.gov/documents/mcl/pdf/mcl-339-6107.pdf
- **Definition:** MCL 339.6101(d) defines "domestic water treatment and filtering equipment" as residential water treatment and filtering equipment used in 1-family and 2-family dwellings (https://www.legislature.mi.gov/documents/mcl/pdf/mcl-339-6101-new.pdf). MCL 339.6103(b) says "minor repair" does not include modifications to that equipment (https://www.legislature.mi.gov/documents/mcl/pdf/mcl-339-6103.pdf).
- **What this means in practice (inference):** in Michigan a softener, whole-home filter or RO installer does not need a plumbing license, but each install still needs a permit and inspection from the local building department. For dealer screening, permit history matters more than a license number. The City of Detroit's permit rules were not checked.
- **Lookup:** LARA's "Find / Verify a BCC Licensed Professional or Business" (https://aca-prod.accela.com/LARA/GeneralProperty/PropertyLookUp.aspx?isLicensee=Y&TabName=APO) is an interactive Accela search form. The read-only fetch tool could not submit it, so no license was verified. Numbers companies show on their own sites are in the CSV notes as "self-reported".

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| DET-D-01 | Reynolds Water Conditioning Co. | Farmington Hills | Independent | Specialist since 1931. Names Detroit and all three counties. Has a lead removal product line and a published email. |
| DET-D-02 | Michigan Water Conditioning, Inc. | Waterford | Independent | Softener specialist since 1974 with three offices. No filtration line for lead found; coverage not listed. |
| DET-D-03 | Michigan Water Pros, LLC | Novi | Independent | Softening plus carbon and RO across Wayne and Oakland suburbs. Published email. Marketing-heavy. |
| DET-D-04 | Aqua Otter Water Systems | Livonia | Independent (multi-state) | Softener, whole-home and RO with a Wayne County office. Indianapolis-based company. |
| DET-D-05 | State Soft Water | South Lyon | Independent | Softener, filtration and RO across seven Michigan counties. Detroit page is templated. |
| DET-D-06 | Douglas Water Conditioning | Waterford Township | Brand dealer (EcoWater) | Full line incl. RO, owner named, master plumbers on staff. Northwest Oakland only. |
| DET-D-07 | CGC Home Services (Kinetico) | Clarkston | Brand dealer (Kinetico) | Kinetico softeners and RO, names Grosse Pointe, Royal Oak, Troy. Shows a Michigan license number. |
| DET-D-08 | RainSoft of North Detroit | Washington (Macomb) | Brand dealer (RainSoft) | Softeners, filtration and RO. Areas page names Detroit and Oakland, Macomb and Wayne. |
| DET-D-09 | Culligan of Ann Arbor/Detroit | Wixom | Franchise | Full Culligan line with RO and whole-house filtration. Names Detroit. Published email. |
| DET-D-10 | Culligan of Romeo | Romeo | Franchise | Full Culligan line for north Macomb and north Oakland. |
| DET-D-11 | Mr. Rooter Plumbing of Detroit | Wyandotte | Franchise (plumbing) | Plumbing franchise covering the whole metro, with softener and filter services. |
| DET-D-12 | AJ Danboise Plumbing, Heating, Cooling & Electrical | Farmington Hills | Plumbing co. | Softeners, RO and whole-home filtration. Published email and a license number. |
| DET-D-13 | Detroit Furnace | Fraser | Plumbing co. | Installs whole-home filtration, softeners and RO across the Tri-County area. |
| DET-D-14 | Frost & Kretsch Plumbing | New Baltimore | Plumbing co. | Macomb plumber with a softener install page. Softener-only evidence. |

Counts: 5 independent specialists, 3 brand dealers (EcoWater, Kinetico, RainSoft), 3 franchises (2 Culligan, 1 Mr. Rooter), 3 plumbing companies.

## Top three to consider

1. **DET-D-01 Reynolds Water Conditioning Co.:** it is a long-running water treatment specialist that names Detroit and the inner Wayne, Oakland and Macomb suburbs, carries RO and a lead removal product line, and publishes a service email.
2. **DET-D-09 Culligan of Ann Arbor/Detroit:** it is a full-line dealer that names Detroit, installs RO and whole-house filtration, and lists both a local phone and an email.
3. **DET-D-08 RainSoft of North Detroit:** it is a dedicated water treatment dealer whose areas-served page covers Detroit and the three core counties and that sells filtration and RO alongside softeners, though it is limited to the RainSoft line.

Note: no row has a verified license. Under Michigan's exemption a water treatment installer may not need one, so permit records would be the better check.

## Gaps

- **No NSF/ANSI 53 or 58 claims** were found on any page read. Reynolds has a lead removal product category whose page was not opened. Douglas lists PFAS as a problem addressed. Nobody makes a specific certified lead-reduction claim.
- **No license verified.** The LARA lookup could not be submitted. DET-D-07 (#8111400) and DET-D-12 (#7118497) show numbers worth checking by hand.
- **Detroit city coverage is thin.** Only DET-D-01, DET-D-05, DET-D-08, DET-D-09 and DET-D-11 name Detroit itself. Most offices are in Oakland or north Macomb.
- **Missing details:** legal entity found for only four rows. Owner named only for Douglas. Few published emails.
- **Reviews:** not opened.

## Exclusions

- **Leaf Home Water Solutions:** national company.
- **Detroit Plumbing Team (detroitplumbingteam.com):** its footer says it is a lead generation service and that contractors are independent.
- **Honest Water Co of Metro Detroit (honestwatercoofmetrodetroit.com):** no address, phone, entity or install evidence on the page.
- **Micropure Water Services (Clarkston):** found only on a Pentair True Blue dealer page; no company site found.
- **RainSoft of Northern Michigan (Flushing):** Genesee County office, no RainSoft dealer statement on its site, and two conflicting phone numbers.
- **Advanced Water Treatment (Whitmore Lake and South Lyon):** real specialist, but its site centers on Livingston County and well water, outside the core Detroit area.
- **Water Boy Systems (Ida, Monroe County):** outside the market area; site not opened.
- **Water Softener Michigan, Kinetico Northern Michigan, Great Lakes Water Conditioning (Kalamazoo), Owens Soft Water:** based outside southeast Michigan.
- **SoftPro Water Systems "best water softener detroit" pages and instaservice.com:** online retailer and marketplace pages, not local installers.
- **AAA Quality Water:** site refused automated access (robots).
- **Rolling Stream Water Treatment (Romeo) and Maglothin Well and Water Treatment (Waterford):** directory and chamber pages only; no company site found.
- **Mid Michigan Water Conditioning, Action Water Treatment, Quality Water and Air, Lake Orion Plumbing, Cregger Plumbing, Mrs. Michael Plumbers, JR Hudson Plumbing, American Aqua, Exquisite Touch, Pelkey Services, Benjamin Franklin Plumbing:** names from directories only; own sites not reached.
