# San Diego dealer prospects (City of San Diego)

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-san-diego.csv` (13 rows, SD-D-01 to SD-D-13). Contact details are public business channels only.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Market:** City of San Diego (ZIPs 92037 to 92182). Companies based elsewhere in the county (Ramona, Escondido, Vista, Chula Vista) are included only where their own site names San Diego or San Diego neighborhoods. Each row's `office_location` gives the office city.
- **Manufacturer locators tried:**
  - Pentair True Blue: the dealer list loads only with JavaScript after a location entry. No static San Diego dealer page was found.
  - Kinetico: the California dealer page returned an error. No San Diego Kinetico dealer was found.
  - Culligan: the Hall's Culligan location list loaded and led to sdculligan.com and culliganescondido.com.
  - Rayne: the San Diego, North County and Vista location pages loaded as static pages.
  - EcoWater: EcoWater's dealer page for Relyon Water (Vista) loaded, but Relyon's own site refused automated reading. EcoWater SoCal's own site loaded.
  - Hague: Hague Quality Water of San Diego's own site loaded.
- **Other sources:** the web search allowance for this run ran out before San Diego neighborhood searches could be done. San Diego names were therefore found mostly through Angi and BBB category pages (water conditioning, softener supplies, water treatment, water purification), then each company's own website was opened. Directories were used only for names and website addresses, never as evidence. HomeAdvisor's San Diego page returned no results.
- **What a row needed:** the company's own website (or its brand location page) confirming it sells and installs residential softeners, RO or whole-home filtration and serves San Diego. The URL is in `contact_source_url`.

## Licensing

- **Regulator:** the California Contractors State License Board (CSLB), https://www.cslb.ca.gov/. San Diego has no separate city contractor license for this work.
- **Which license applies:** CSLB class **C-55 Water Conditioning Contractor** covers installing water conditioning equipment with only the pipe and fittings needed to connect it and bypass the parts of the system that should not get treated water (https://www.cslb.ca.gov/About_us/Library/Licensing_Classifications/Licensing_Classifications_Detail.aspx?Class=C55). Class **C-36 Plumbing Contractor** also covers maintenance and replacement of "water conditioning equipment" (https://www.cslb.ca.gov/About_us/Library/Licensing_Classifications/Licensing_Classifications_Detail.aspx?Class=C36). The C-61 limited specialty list has no water conditioning subcategory.
- **Lookup result:** not run for any row. The CSLB license check (https://www.cslb.ca.gov/OnlineServices/CheckLicenseII/CheckLicense.aspx) has no bot check, but it is a search form, and this brief bars form submissions. Opening a license-detail address directly returned the empty search form, not a record. License number and status are blank in every row, `license_checked_on` is 2026-10-28, and any number a company shows on its own site is in notes as "self-reported".
- **Self-reported numbers:** WPS #1017517 ("Licensed C55/C36", the only row claiming the water conditioning class), Hague Quality Water of San Diego #415453, Aztec H2O #883704, Culligan of San Diego LIC#982519 (same as Culligan of Los Angeles), Trusted Water Systems C-36 #1087368, Bill Howe four numbers, Point Loma C931938. A person can check these by hand at the CSLB link above.
- **Not checked:** City of San Diego permit rules for softener installs, and any local limits on salt-discharging softeners.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| SD-D-01 | WPS (Water Purification Systems Inc.) | San Diego area (no address) | Independent | Specialist that installs softeners, whole-house carbon and RO. Lists city neighborhoods and claims C-55 and C-36. Veteran-owned. |
| SD-D-02 | Hague Quality Water of San Diego | Ramona | Independent (Hague-brand dealer) | 40+ years, installs many makes. Published email. Office is far from the city center. |
| SD-D-03 | Aztec H2O Services | Escondido | Independent | Family softener and filtration specialist with a San Diego page and a self-reported license. |
| SD-D-04 | Superior Water (Waterboy) | Rancho Bernardo (in city) | Independent | Founders named, about 30 years in business. Salt-free whole-house only. |
| SD-D-05 | Ethical H2O | Kearny Mesa area (in city) | Independent | Full line of softeners, whole-house and RO. Published email. |
| SD-D-06 | Culligan of San Diego | San Diego (in city) | **Franchise** (Culligan) | Large county-wide operator (Hall's Culligan). Brand rules likely. |
| SD-D-07 | Rayne of San Diego | No address | **Brand dealer** (Rayne) | Long list of city neighborhoods. Operator not named on site. |
| SD-D-08 | EcoWater SoCal | Vista | **Brand dealer** (EcoWater) | Full product line. Covers all of Southern California. |
| SD-D-09 | Filtercon Technologies | San Diego (no address on site) | Independent | Whole-house, salt-free and RO since 1995. Published email. Install evidence is thin. |
| SD-D-10 | Trusted Water Systems | Chula Vista | Plumbing co. | Owner named. RO, salt systems and whole-house carbon alongside water heaters. Self-reported C-36. |
| SD-D-11 | Carini Home Services | San Diego (in city) | Plumbing co. | HVAC and plumbing firm that installs softeners and whole-house filtration. Published email. |
| SD-D-12 | Bill Howe Plumbing | San Diego (in city) | Plumbing co. | Large family plumbing firm since 1980 with a softener install page. |
| SD-D-13 | Point Loma Electrical, Plumbing, Heating, and Air | San Diego (in city) | Plumbing co. | Installs water conditioners in coastal and central neighborhoods. Weakest water treatment evidence. |

Counts: 6 independents (SD-D-01 to 05 and SD-D-09, with Hague counted as a Hague-brand independent), 1 franchise, 2 brand dealers, 4 plumbing companies.

## Top three to consider

1. **SD-D-01 WPS:** it is a water treatment specialist that names city neighborhoods, sells brand-neutral equipment, and is the only row claiming the C-55 water conditioning license, though it has no published address or email.
2. **SD-D-02 Hague Quality Water of San Diego:** it has installed many makes for over 40 years and publishes an email, but its Ramona office means its reach into the city should be confirmed.
3. **SD-D-05 Ethical H2O:** it is an in-city specialist with a full softener, whole-house and RO line and a published email, though it shows no license number.

Superior Water (SD-D-04) has the strongest named ownership but sells salt-free systems only, so it fits fewer homeowner requests. None of the rows has a verified license, so each pick should be checked by hand at cslb.ca.gov before any lead is sent.

## Gaps

- **Licensing:** no row has a verified license (see Licensing).
- **Search coverage:** web search ran out before any San Diego neighborhood searches were done. The list rests on brand location pages and BBB and Angi category pages. Neighborhood searches (La Jolla, Clairemont, Mira Mesa, Rancho Penasquitos, Otay Mesa) and Kinetico, RainSoft and Pentair ZIP searches in a browser would likely add independents.
- **Count:** 13 rows, but SD-D-08 (EcoWater SoCal) and SD-D-04 (Superior Water) also appear in the Los Angeles list.
- **Missing details:** legal entity shown only for WPS. No street address on own site for WPS, Rayne, Filtercon and Trusted Water Systems. No email for WPS, Aztec (hidden by a script), Superior Water, Culligan, Rayne, EcoWater SoCal, Trusted Water, Bill Howe and Point Loma.
- **Decision makers:** an owner or founder is named on the company's own site only for Superior Water (Ted and Peter Carlisi) and Trusted Water Systems (Jacob McGrew). Ethical H2O names a CEO but not as owner or founder.
- **Reviews:** not opened. **Insurance:** not checked.

## Exclusions

- **Relyon Water (Vista, EcoWater dealer):** its own site refused automated reading (robots rule). The office is also outside the city.
- **Unified Water Solutions (Chula Vista):** its own site refused automated reading (robots rule).
- **High Quality Water of CA (San Diego):** no website of its own. BBB's link points to a third-party community page.
- **Jackson & Foster (La Mesa):** HVAC and plumbing site with no water softener, filtration or RO page found.
- **Puretec Industrial Water (San Diego):** industrial and commercial only, with no residential service.
- **Rayne of North County:** same phone numbers as Rayne of San Diego, so it was treated as the same operator, not a second row.
- **Culligan of Escondido:** same license number and operator as Culligan of San Diego, so it was folded into SD-D-06.
- **Element Pros, Razos Waterworks, Personal Plumbing, Patch Plumbing Solutions, California Plumbing SD, My Plumber CA, EZPZ Plumbing:** names came from directories, but no own website with water treatment work was confirmed (directory pages showed no website or failed to load), or the office is outside the city with no San Diego claim seen.
