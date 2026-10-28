# El Paso dealer prospects (market-id el-paso, prefix ELP)

Research draft. No one has been contacted.

Market: El Paso, TX (El Paso County, including Horizon City, Socorro, Canutillo, Anthony and Fort Bliss). Companion data file: `dealer-prospects-el-paso.csv` (12 rows, ELP-D-01 to ELP-D-12).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Brand and manufacturer pages that loaded:** Puronics dealer locator pages for Garcia Water Care, Southwest Pure Water, Kleen Water Solutions and MicroPure (Albuquerque); EcoWater dealer page for Aqua Crystal LLC; Mr. Rooter El Paso water filter and softener pages.
- **Brands with no El Paso dealer found:** searches for Culligan, Kinetico, RainSoft, Rayne and Hague in El Paso turned up no local dealer page. Search results showed only BBB listings for Culligan Water Conditioning of West Texas (Midland) and Kinetico of West Texas (Wolfforth); those pages were not opened and no El Paso service was confirmed.
- **Did not load:** SPB Hydro, El Paso Drop and Hydro Solutions own sites (robots rules disallow fetching). Aqua Innova's services page returned an error.
- **Name finding only (never evidence):** Angi, HomeAdvisor (returned no results), BBB El Paso water softener category, needinstall.com and thebuildermarket.com directory pages, and a KFOX TV segment.
- **Search wordings:** softener, RO and filtration companies in El Paso, Horizon City and Socorro; "TCEQ licensed" water treatment El Paso; plumbing companies with softener installation; each brand name with El Paso.
- **Search limit:** the shared web search budget for the session ran out near the end of the work. The remaining checks used pages already found.
- **What a row needed:** the company's own site (or, for Aqua Crystal, the EcoWater-hosted dealer page plus its own site) confirming it sells and installs residential softeners, RO or whole-home filtration in El Paso. Every field comes from the page named in `contact_source_url`.
- **Left blank on purpose:** review fields and score. Decision makers only where the company's own site names an owner or founder.

## Licensing finding

- **Which license applies.** Texas licenses individuals who, under contract, install, exchange, service or repair potable water treatment equipment as **Water Treatment Specialists** (TCEQ, Texas Commission on Environmental Quality): https://www.tceq.texas.gov/licensing/licenses/wtslic . TCEQ's page (read 2026-10-28) gives three classes. Class I works under supervision. Class II can install and service water conditioners but not RO or deionization equipment unless supervised. Class III covers all equipment including RO. Private wells that are not public water systems are outside the rule.
- **Plumber exemption.** The same TCEQ page lists plumbers licensed under Texas Occupations Code Chapter 1301 as exempt. Plumbing licenses are issued by the Texas State Board of Plumbing Examiners (TSBPE): https://www.tsbpe.texas.gov/search/license-search . So a plumbing company's master plumber license covers softener and RO work, and a specialist shop needs TCEQ WTS licensed staff.
- **Lookups.**
  - TCEQ license search (https://www2.tceq.texas.gov/lic_dpa/index.cfm, linked from the WTS page): the site's robots rule refused automated access on 2026-10-28. **Lookup blocked.**
  - TSBPE public license search (https://vo.licensing.hpc.texas.gov/datamart/selSearchType.do): the search-type page loaded, but the search itself runs in a session form that was not completed from this environment. **Not verified.**
  - Result: no row has a verified license number or status. `license_checked_on` is 2026-10-28 on every row. No El Paso site posted a TCEQ or plumbing license number; unnumbered claims are in notes as self-reported.
- **Note on New Mexico.** Several El Paso dealers also serve Las Cruces and Santa Teresa, NM. New Mexico licensing was not researched because it is outside the market.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| ELP-D-01 | Home Water Services | El Paso 79938 | Independent | Specialist for 25+ years with a full softener, RO and whole-home line and a wide El Paso County area. |
| ELP-D-02 | Clean Water of El Paso | El Paso 79922 | Independent | Long-running local installer (site says since 1995) with a street address and published email. |
| ELP-D-03 | El Paso Watertech | El Paso 79936 and 79912 | Independent | Younger specialist (2019) with two offices and a published email. |
| ELP-D-04 | The Good Water Guys | El Paso 79904 | Independent | Whole-home filtration and softening shop with a published email. |
| ELP-D-05 | Home Flash Services | El Paso 79935 | Independent | Installs softeners, RO and filtration, but the site is thin. |
| ELP-D-06 | Hard 2 Soft | El Paso 79903 | Independent | Central El Paso softener installer with a published email; lower confidence. |
| ELP-D-07 | Purity Bay | El Paso 79904 | Independent | Family company since 2002 with an El Paso showroom; its main market is Florida. |
| ELP-D-08 | Garcia Water Care | El Paso 79935 | Brand dealer (Puronics) | Family-owned Puronics dealer with a named founder and published email. |
| ELP-D-09 | Southwest Pure Water | El Paso 79915 | Brand dealer (Puronics) | Puronics dealer that installs with its own master plumber. |
| ELP-D-10 | Aqua Crystal | El Paso 79925 | Brand dealer (EcoWater) | El Paso's EcoWater dealer, but its own site is thin. |
| ELP-D-11 | Mr. Rooter Plumbing of El Paso | El Paso | Plumbing co. (franchise) | Installs RO and replaces softeners; franchise rules apply. |
| ELP-D-12 | Liberty Plumbing | El Paso 79924 | Plumbing co. | Local plumber with a softener install page and published email. |

Counts: 7 independents, 3 brand dealers, 2 plumbing companies. Verified licenses: 0 of 12.

## Top three to consider

1. **ELP-D-01 Home Water Services.** It is an El Paso water treatment specialist with more than 25 years in business, a full softener, RO and whole-home line, and a service area that covers all of El Paso County, though it publishes no email and its license is only self-reported.
2. **ELP-D-08 Garcia Water Care.** It is a family-owned shop whose own site names its founder, which gives a clear decision maker for a one-lead pilot, though Puronics dealer terms may limit what it can sell.
3. **ELP-D-02 Clean Water of El Paso.** It is a long-running local installer with a street address and a published email, though its site leans heavily on promotional copy and the email is a named person's address.

None of the three has a verified license yet.

## Gaps

- **No license verified.** The TCEQ lookup is blocked by robots rules and the TSBPE search was not completed. No El Paso site posted a license number. Unnumbered claims: ELP-D-01 (Texas-licensed water treatment specialists), ELP-D-03 (licensed plumbers), ELP-D-08 (TCEQ certified), ELP-D-09 (own master plumber), ELP-D-12 (licensed, insured and bonded).
- **Decision makers:** named on the company's own site only for ELP-D-08 (Joshua Garcia). Owner names for ELP-D-01, ELP-D-04 and ELP-D-12 appear only in a TV segment or customer reviews and were not recorded.
- **Legal entities:** shown only for ELP-D-08 and ELP-D-10, both from brand pages.
- **No street address on own site:** ELP-D-10 (address from EcoWater page), ELP-D-11 (no ZIP), ELP-D-12 (ZIP only).
- **Shared addresses:** ELP-D-04 and ELP-D-07 share 8935 Gateway Blvd S, and ELP-D-05 and ELP-D-08 share 10420 Montwood Dr Suite N. The pages do not say whether these companies are related.
- **Phone conflicts:** ELP-D-09 shows a different phone and email on the Puronics page than on its own site.
- **Brand coverage:** no Culligan, Kinetico, RainSoft, Rayne or Hague dealer was found for El Paso. A manual ZIP search on those locators (for example 79912, 79936, 79938) in a normal browser would confirm it.
- **Reviews:** not opened.

## Exclusions

- **Kleen Water Solutions (Puronics dealer, 6006 N. Mesa):** listed on the Puronics locator, but no company website was found.
- **Aqua Innova (Puronics dealer, 1000 Diesel Dr):** its home page names softeners and alkaline filters but does not say it installs, and its services page returned an error.
- **OG Home Solutions:** says it is a Puronics dealer selling softeners, but the site is mainly solar, HVAC, windows and roofing, and it does not describe water treatment installation. Held as an alternate.
- **MicroPure Water Systems:** Albuquerque-based Puronics dealer that lists El Paso as one of many areas; no El Paso office.
- **Mechanical Technologies (epmechtech.com):** HVAC and mechanical firm; its site does not mention water treatment.
- **Continental Smart Solutions:** lists "whole house purification" and solar, but gives no detail on water treatment products or installation.
- **Alka Water Experts:** alkaline water stores and vending machines; sells an RO unit but does not describe softeners or confirm installation.
- **Aquakleen Products:** California company; its site does not list El Paso among its branches.
- **SPB Hydro, El Paso Drop, Hydro Solutions:** own sites disallow automated access, so they could not be read.
- **Wellness Water Filtration Systems (El Paso city site):** excluded from earlier lists as a possible lead network and not re-verified here.
- **Ramos Drilling & Water Treatment, Seitsinger Water (Ralmar Inc.), Home H2O, Aqua Perfect of El Paso, Vanta Water LLC, A&F Water Solutions, Supreme Waters Inc., El Paso Water Softeners, Future Vision, EcoVida-Life, FSH AQUA, Pure H20:** found only in directories; no company website was found or checked before the search budget ran out.
- **Lead and directory sites (names only):** Angi, HomeAdvisor, BBB, needinstall.com, thebuildermarket.com, softprowatersystems.com El Paso pages, waterfiltersofamerica.com, contractorplus.app.
