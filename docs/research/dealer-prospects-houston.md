# Houston dealer prospects

Research draft. No one has been contacted.

Market: `houston` (Houston metro core; ZIPs 77002 to 77345). Companion data file: `dealer-prospects-houston.csv` (15 rows, HOU-D-01 to HOU-D-15).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer and brand pages that loaded:** EcoWater dealer page for Abacus Plumbing (IAH area). Culligan of Houston's own franchise site.
- **Did not load or not used:** RainSoft's Houston pages name no dealer and its locator needs a ZIP entry. No Kinetico dealer page for Houston was found; the one Kinetico dealer found (AquaTex, Alvin) showed no address or phone on its site. Pentair's locator was not reached, but Houston Water Solutions says on its own site that it is a True Blue dealer. Three own sites disallow automated access by robots rule and were not read: cleanwatersolutionshouston.com, txsoftwater.com, and the TCEQ lookup.
- **Name finding only (never evidence):** Angi Houston and Cypress pages, and the waterfiltrationhouston.com "providers" directory (a lead-matching publisher, 73 names).
- **Search wordings:** softener and RO companies by Houston, Katy, Cypress, Spring, Humble, Kingwood, Pearland, Friendswood and League City; "Class III water treatment specialist" Houston; brand dealer searches for Kinetico, Culligan, RainSoft, EcoWater and Hague.
- **What a row needed:** the company's own site confirming it sells and installs or services residential softeners, RO or whole-home filtration in the Houston area. Every field comes from the page named in `contact_source_url`.
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
| HOU-D-01 | Aqua General | Houston (77054) | Independent | Specialist since 1994 with a published service email, and it says it holds a TCEQ Class III license. |
| HOU-D-02 | United Water Softeners | Houston (77084) | Independent | Owner-named WTS III specialist on the west side, and it is expanding to San Antonio. |
| HOU-D-03 | Homer's Soft Water | Wallis (west of Katy) | Independent | Owner-named specialist since 1987 that installs and services, but it covers the west side only. |
| HOU-D-04 | Texas Water Team | Cypress | Independent (Hague products) | Covers a 50-mile radius and services most brands. |
| HOU-D-05 | Filtration Brothers | Cypress | Independent | Small owner-operated firm with published installed prices. |
| HOU-D-06 | Green House Water Solutions | Houston (77063) | Independent | Has a full line and a Westchase office, plus a mall unit. |
| HOU-D-07 | Primary Solutions Consulting | Cypress | Independent | Brand-neutral specialist; its spokesperson says they are a licensed WTS. |
| HOU-D-08 | Pura Flo | Spring | Independent | Mostly RO and coolers, with softeners on the side. |
| HOU-D-09 | Houston Water Solutions | Houston (77041) | Brand dealer (Pentair True Blue) | Has a published email and address and repairs most makes. |
| HOU-D-10 | Culligan of Houston | Houston (77040) | Franchise (Culligan) | Metro-wide since 1947, but Culligan rules apply. |
| HOU-D-11 | Quality Home Products of Texas | Houston (77073) | Brand dealer (RainSoft) | Large RainSoft dealer since 1989 with a self-reported master plumber license. |
| HOU-D-12 | Southern Water Solutions | Sugar Land | Brand dealer (Brita PRO) | Gives its legal entity and covers the southwest and northeast suburbs. |
| HOU-D-13 | Potentia Water | Houston (77055) | Brand dealer (Puronics) | Has a published email and a San Antonio address too, but install evidence is thin. |
| HOU-D-14 | Nick's Plumbing & AC | Houston (77018) | Plumbing co. | Inner-loop plumber that installs whole-house softeners, with a published email. |
| HOU-D-15 | Abacus Plumbing, AC & Electrical | Houston (77032) | Plumbing co. (EcoWater dealer) | Large multi-trade firm with water as a minor line. |

Counts: 8 independents, 5 brand or franchise dealers, 2 plumbing companies (one also an EcoWater dealer).

## Top three to consider

1. **HOU-D-01 Aqua General.** It is a Houston water treatment specialist since 1994 with a street address, a published service email, eight-county coverage and a stated TCEQ Class III license, so it fits a specialist-first pilot.
2. **HOU-D-02 United Water Softeners.** Its site names the owner, says it holds a WTS III license and shows a west Houston office, and its planned move into San Antonio could make it a two-market partner.
3. **HOU-D-09 Houston Water Solutions.** It has a Houston address and a published email, installs and repairs most makes, and is a Pentair program dealer rather than a franchise, so it should be free to take outside leads.

Alternate: HOU-D-03 Homer's Soft Water names its owner and has run since 1987, but it is based in Wallis and covers only the west and southwest suburbs.

## Gaps

- **No license verified.** Both state lookups were blocked (see above). Self-reported credentials: HOU-D-11 (MPL #45964), HOU-D-14 (MPL# 38548), HOU-D-15 (M-20628), plus unnumbered TCEQ or WTS claims on HOU-D-01, HOU-D-02 and HOU-D-07. Aqua General's homepage links to a TCEQ record, which was not opened.
- **No street address on own site:** HOU-D-05 and HOU-D-07 (city only).
- **Decision makers:** named owners only for HOU-D-02 (Gary Tompkins) and HOU-D-03 (Kevin Davitt), plus first names for HOU-D-05. Aqua General names a President (David A. Davies), recorded in notes only.
- **Legal entities:** shown only for Aqua General, Inc., Homer's Soft Water LLC, Texas Water Team LLC and Southern Water Solutions, LLC. Texas SOS entity search was not tried.
- **Locators:** Kinetico, RainSoft and Pentair dealer lists were not captured. No Kinetico or Hague dealer with a verifiable own-site address was found.
- **Office outside the core ZIP range (but serving it):** HOU-D-03 (Wallis), HOU-D-04 (Cypress 77429), HOU-D-08 (Spring 77379), HOU-D-12 (Sugar Land 77479). East side and Bay Area (Pasadena, Baytown, Clear Lake) are thin.
- **Reviews:** not opened. Ratings in notes are the companies' own claims.

## Exclusions

- **Clean Water Solutions Houston, TX Soft Water:** their own sites disallow automated access by robots rule.
- **AquaTex Water Conditioning (Kinetico dealer, Alvin):** its site gave no address, phone or email, and Alvin is outside the market.
- **Mueller Water Conditioning (Houston HQ):** its homepage targets commercial and industrial customers only. Its San Antonio branch page mentions residential work.
- **Klaro Water Systems (Puronics):** gives no street address, only Houston.
- **Water Bro's Co:** gives no street address, and its email is a gmail account.
- **Houston Water Pros:** gives no street address, names no owner, and has no history on the site.
- **Houston Water Softeners (houstonwatersofteners.net):** gives no address, and its "Texas Water Team" branding may duplicate HOU-D-04.
- **AquaLife of Houston:** gives no address, and its only phone is an Austin (512) number.
- **National Water Systems:** a national site with no address or phone.
- **Soft H2O:** gives no address and lists a statewide service area.
- **Alamo Water Softeners:** Angi lists it under Houston, but its own site lists Austin, Buda, Corpus Christi and San Antonio, not Houston. It is a San Antonio row (SA-D-04).
- **Leaf Home Water Solutions:** national (Ohio).
- **Directory and lead sites (names only):** waterfiltrationhouston.com, Angi, HomeAdvisor, softprowatersystems.com city pages.
- **Not researched (names only, from the directory):** about 50 other Houston names, including Alpro Water, Aquaworld Systems, Infinity Water Systems, Living Water Company (Baytown), Montgomery Water Softening, Texas Water Softeners (Aldine) and RB's Water Resources. Running them is the clearest way to add east-side and Bay Area rows.
