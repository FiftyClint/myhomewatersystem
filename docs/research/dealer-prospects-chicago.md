# Chicago dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-chicago.csv` (14 rows, CHI-D-01 to CHI-D-14). Market: City of Chicago, Illinois (ZIPs 60601 to 60661).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Manufacturer locators tried:**
  - Culligan: culliganchicago.com loaded as a static page and listed 12 dealer links. Two of them list Chicago as served: Culligan of Wheeling (U.S. Water group) and Culligan of Oak Forest (Culligan of Merrillville site). Meredith's Culligan of Broadview does not list Chicago.
  - EcoWater: static dealer pages loaded for Countryside EcoWater (Arlington Heights) and Angel Water (Barrington). Other EcoWater state pages returned downstate dealers only.
  - Kinetico: dealer pages found by search were all outside the city (Huemann in Johnsburg, McKinley in Farmer City). Osby Water Systems (Hebron, Indiana) is a Kinetico dealer whose own site claims the Chicago area.
  - RainSoft: the Chicago pages on rainsoft.com name no dealer. The locator needs a ZIP entry. RainSoft of Chicago (Lombard) was found through its BBB profile, but its own site refused automated access (robots), so it could not be verified.
  - Pentair True Blue and Find a Local Pro: dealer lists load with JavaScript and showed no results.
  - Hague: the Illinois find-a-dealer page showed no listings. haguechicago.com showed no address or phone.
- **Other sources:** web search by product and neighborhood (North Side, Northwest Side, South Side, Beverly, Logan Square), and the BBB "water conditioning contractor" category list for Chicago. Angi and BBB were used only to find names. Yelp and HomeAdvisor refused automated access.
- **Search budget:** the shared web search limit for this session ran out partway through. Some names found on Angi (Hobson Plumbing, Netzel Plumbing, RJ Graham Plumbing, Fettes Love & Sieben, Right Away Plumbing, Goodberlet Home Services) were not researched.
- **What a row needed:** each row was confirmed on the company's own website, which had to show water treatment sales and installation and Chicago in its service area. Every field comes from a page that was opened, listed in `contact_source_url`.

## Licensing finding

- **State law:** the Illinois Plumbing License Law (225 ILCS 320) says that "plumbing" does not include "the business of installing water softening equipment and of maintaining and servicing the same." The current statute text does not extend that exclusion to filtration or RO units. A 2007 bill (SB 2441, 95th General Assembly) proposed adding "water filtration units," but the current text checked shows only softening equipment. Source: https://ilga.gov/legislation/ilcs/ilcs3.asp?ActID=1343
- **What this means in practice (inference):** softener installation by a water treatment business is outside the state plumbing license. Work that alters water supply piping, which RO and whole-house filtration usually involves, is plumbing and needs an Illinois-licensed plumber. Any plumber working for others must also register as a plumbing contractor with IDPH. Source: https://dph.illinois.gov/topics-services/environmental-health-protection/plumbing.html
- **City of Chicago:** the state law lets cities over 500,000 run their own plumber licensing. Chicago's Department of Buildings requires a City plumbing contractor license for anyone who installs, alters, repairs or maintains plumbing in the City, even if they hold a state license. The City page does not mention softeners or water treatment. Source: https://chicago.gov/city/en/depts/bldgs/supp_info/TLdetails/PLcontractor.html
- **Applicable license for a pilot partner:** a City of Chicago plumbing contractor license, or an IDPH plumbing contractor registration for suburban crews, for any job that touches supply piping. Whether Chicago enforces its license for softener-only work was not confirmed on the City's site.
- **Lookups:** the IDPH Plumbing License Verification tool (https://ildohplmprod.glsuite.us/GLSuiteWeb/Clients/ILDOHPLM/PUBLIC/Verification/Plumber_License_Verification.aspx) is a form that must be submitted interactively. The read-only fetch tool could not submit it. The City's Licensed Trade Contractors lists (https://webapps1.chicago.gov/licensedcontractors/plumbing) load with JavaScript and returned no rows. No license was verified. Numbers that companies show on their own sites are in the notes as "self-reported".

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| CHI-D-01 | ProEcoLife | Chicago (60656) | Independent | The only Chicago-based water treatment specialist found. Installs RO and whole-house filtration. Founder named, published email. No softeners. |
| CHI-D-02 | Angel Water, Inc. | Barrington, IL | Brand dealer (EcoWater) | Full specialist line. Owner/CEO named. Shows an IDPH license number. Chicago coverage is only implied. |
| CHI-D-03 | Osby Water Systems | Hebron, IN | Brand dealer (Kinetico) | Specialist since 1968 with a full line. The Chicago claim sits on a templated page from an Indiana office. |
| CHI-D-04 | Culligan of Wheeling (U.S. Water Culligan Group) | Wheeling, IL | Franchise | Lists Chicago. Full line, after-hours and emergency service. Territory set by Culligan. |
| CHI-D-05 | Culligan of Oak Forest | Oak Forest, IL | Franchise | Lists Chicago. Likely covers the South Side. Territory set by Culligan. |
| CHI-D-06 | VanDerBosch Plumbing Inc. | Chicago (60626) | Plumbing co. | Rogers Park office. Installs RO and whole-house filtration. Shows City of Chicago and state license numbers. |
| CHI-D-07 | HandyBandi | Chicago (60640) | Plumbing co. | Andersonville office. Full line including softeners. Published email. Annual maintenance offered. |
| CHI-D-08 | J. Blanton Plumbing | Chicago (60640) | Plumbing co. | North and Northwest Side focus. Installs filters, RO and softeners. Some template text on page. |
| CHI-D-09 | Oasis Plumbing, Heating & Cooling | Chicago (60659) | Plumbing co. | West Ridge office. Softener install and service. Family-owned since 1997. |
| CHI-D-10 | A Custom Services | Chicago (60634) | Plumbing co. (HVAC-led) | Northwest Side. Whole-house purification and salt-free conditioners only. Published email (Gmail). |
| CHI-D-11 | Four Seasons Heating, Air, Plumbing & Electric | Chicago (60638) | Plumbing co. | Large multi-trade firm. Softeners, carbon and RO. Water treatment is a side line. |
| CHI-D-12 | Suburban Plumbing Experts | Brookfield, IL | Plumbing co. | Has a Chicago phone line and published email. Softeners and whole-home filtration. Shows license number. |
| CHI-D-13 | Precision Today | Franklin Park and 4 other suburbs | Plumbing co. | Large multi-trade firm with its own WaterTech line. Lists Chicago. Published email. |
| CHI-D-14 | King Heating, Cooling & Plumbing | Oak Lawn, IL | Plumbing co. | RO, whole-home and softeners. City coverage limited to Beverly, Mount Greenwood and Ashburn. |

Counts: 1 independent specialist, 2 brand dealers (EcoWater, Kinetico), 2 Culligan franchises, 9 plumbing or HVAC companies with water treatment lines.

## Top three to consider

1. **CHI-D-01 ProEcoLife:** it is the only water treatment specialist found with an office inside city limits, it installs RO and whole-house filtration, and it publishes a business email and a named founder.
2. **CHI-D-06 VanDerBosch Plumbing:** it has a city office, installs RO and whole-house filtration, and its site lists a City of Chicago plumbing contractor license number, which a lookup could confirm.
3. **CHI-D-07 HandyBandi:** it has a city office, covers the North Side and inner suburbs, offers the full line including softeners with annual maintenance, and publishes a business email.

Note: no row has a verified license, so none of the three meets the "verified license" test yet. Angel Water (CHI-D-02) is the strongest pure specialist, but its own site does not clearly state that it serves the city.

## Gaps

- **No license verified.** Both lookups were unusable from this environment. A manual check of the IDPH tool and the City list would settle CHI-D-06, CHI-D-11, CHI-D-12, CHI-D-13 and CHI-D-14, which show numbers on their sites.
- **Few true specialists in the city.** Most water treatment dealers sit in the suburbs and only list "Chicago" in a long city list. Chicago's Lake Michigan water drives demand toward RO, lead and whole-house filtration more than softeners (inference).
- **Locators not captured:** Pentair, RainSoft, Hague and Kinetico load dealers with JavaScript after a ZIP entry. A manual ZIP search (for example 60614, 60622, 60643, 60657) in a browser would close this gap.
- **Missing details:** legal entity shown on site for only 2 of 14 rows (Angel Water, VanDerBosch). Owner named for only ProEcoLife and Angel Water. Culligan of Wheeling shows two different phone numbers across Culligan pages. How the two Culligan dealers split the city is not stated.
- **Unresearched names** because the search budget ran out: Hobson Plumbing, Netzel Plumbing, RJ Graham Plumbing, Fettes Love & Sieben, Right Away Plumbing, Goodberlet Home Services, Chlorinating Ltd.
- **Reviews:** not opened.

## Exclusions

- **Johnson Water Conditioning (Villa Park):** a real specialist with 12 offices, but its own service area list does not include the City of Chicago.
- **Meredith's Culligan of Broadview:** its page lists west suburbs only, not Chicago.
- **Huemann Water Conditioning (Johnsburg, Kinetico):** serves McHenry and Lake Counties only.
- **McKinley Water Conditioning (Farmer City, Kinetico):** Central Illinois only.
- **Countryside EcoWater (Arlington Heights):** EcoWater page says north and northwest suburbs; its own site refused automated access (robots), so not verified.
- **RainSoft of Chicago (Lombard; BBB alternate name Aqua Resolution, LLC):** own site refused automated access (robots): lookup blocked.
- **Chicago Water Pros:** no street address on its site, and its page description is for a pool builder (template leftover). Directory listing shows a Lincolnshire address. Too weak to include.
- **PureSpring Water Softeners & Filters:** cloned template site, mixed business names ("Wellness Water Filtration Systems", which was also excluded in Kansas City as a possible lead network), unfilled template fields.
- **Plumbers 911 Chicago:** says it "dispatches" union plumbers and does not make clear whether it does the work or routes jobs. Treated as a possible lead network.
- **The OnBoard Group / haguechicago.com:** no address, phone or dealer status on the pages that loaded.
- **Clarity Waterworks:** the page returned only a title, with no contact or service details.
- **Chicagoland Water Conditioning & Purification, Inc. (Morton Grove):** found on BBB; no company website was found.
- **Leaf Home Water Solutions:** national company.
- **Intelligent Service (Mount Prospect):** its water softener page failed to load.
