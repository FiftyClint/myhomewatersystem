# Tampa Bay dealer prospects

Research draft. No one has been contacted.

Market: `tampa-bay` (Tampa in Hillsborough County and St. Petersburg in Pinellas County). Companion data file: `dealer-prospects-tampa-bay.csv` (11 rows, TPA-D-01 to TPA-D-11). Each row's `service_area` says which of the two cities the dealer's own site names, or which counties it names when it names neither city.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Brand pages that loaded:** Culligan's Largo dealer page (Culligan of Pinellas County). Culligan's Tampa page loaded but names no dealer.
- **Did not load or not used:** Three own sites disallow automated access by robots rule and were not read: tampawatercompany.com (listed as an EcoWater dealer in St. Petersburg), waterforlifeinc.com and thewellgenie.com. spwts.com (Simply Pure Water Treatment Systems) redirects to an expired-domain page.
- **Name finding only (never evidence):** Yellow Pages water softening pages for Tampa and Saint Petersburg, a Tampa Magazines sponsored page (Aqua-Wise), a marketspread.com vendor page (Blue Pelican), Angi and HomeAdvisor result lists.
- **Search wordings:** softener and RO companies by Tampa and St. Petersburg; Florida licensing searches for water treatment, plumbing contractor and county specialty licenses.
- **Budget stop:** the shared web search budget for this session ran out early in this market, before suburb and brand-locator searches (Kinetico, RainSoft, Hague, Puronics, EcoWater) could be run. The page-fetch budget also ran short. Rows came from the two Yellow Pages lists and the few search results already in hand.
- **What a row needed:** the company's own site confirming it sells and installs or services residential softeners, RO or whole-home filtration in the Tampa Bay area. Every field comes from the page named in `contact_source_url`.
- **Left blank on purpose:** review fields and score. No row has an owner named with a title on its own site, so `decision_maker_verified` is blank throughout.

## Licensing finding

- **What the state law says.** Florida has no separate water treatment specialist license that the research found. The closest state license is the **plumbing contractor** license under Chapter 489, Part I, Florida Statutes, issued by the DBPR's Construction Industry Licensing Board as a certified (CFC, statewide) or registered (RF, local) license. The 2026 text of s. 489.105(3)(m) (read at https://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0400-0499%2F0489%2FSections%2F0489.105.html) covers installing and repairing water supply systems and water lines, but it does not name water treatment, softening or filtration. The words "water treatment" appear only in the pool and spa contractor definitions.
- **What the counties show.** Hillsborough County's contractor licensing page lists local specialty licenses (aluminum structure, demolition, drywall, glass, irrigation, marine) and none for water treatment: https://hcfl.gov/en/businesses/permits-and-records/permit-applications-and-forms/contractor-licensing . Pinellas County's contractor search lists about 60 license types, including plumbing contractor, with none for water treatment or conditioning: https://contractorsearch.pcclb.com/ .
- **Reading of it (inference, not a ruling).** It appears that tying a softener or whole-home system into a home's water piping falls under plumbing contractor work, while selling and servicing equipment may not need a license at all. None of the pages read settles this. A call to DBPR or the county building departments would be needed before relying on it.
- **Lookups.**
  - DBPR Verify a License (https://www.myfloridalicense.com/portalsearches/VerifyLicensee, linked from https://www2.myfloridalicense.com/how-to-verify-a-license/): the page loads with no login or bot check shown, but its search runs through a script-driven form that this read-only method could not drive. **Lookup did not work.**
  - The older DBPR search address (myfloridalicense.com/wl11.asp) answered, but returned "no records found" for both the number Friend's Plumbing publishes (CFC025577) and the name "Friends Plumbing". That looks like a lookup failure, not a real absence, so no result was used as evidence.
  - Pinellas County contractor search (https://contractorsearch.pcclb.com/) loads without login, but it is a form search, and it says state-certified contractors are verified on MyFloridaLicense instead. Not used.
  - Result: no row has a verified license number or status. `license_checked_on` is 2026-10-28 on every row. TPA-D-10's CFC025577 is in notes as **self-reported**.

## Summary table

| ID | Name | Location | Type | Which city | Why it might fit |
|---|---|---|---|---|---|
| TPA-D-01 | Water Purification Solutions | Tampa (33603) | Independent | Tampa; Pinellas by county | Tampa street address, published email, and it services other brands. |
| TPA-D-02 | Just Water Treatment | Clearwater | Independent | Both | Names both cities, since 1985, own install crews and a published email. |
| TPA-D-03 | Florida Water Treatment | Dunedin | Independent | Tampa; Pinellas referenced | Since 1993 with a separate Hillsborough phone line. |
| TPA-D-04 | Advanced Water Services | Clearwater | Independent | Both by county | Since 1998, softener installs and rebuilds with a 5-year warranty. |
| TPA-D-05 | Aqua-Wise Water Systems | No address | Independent | Tampa; Pinellas by county | Full line with stated install times, but no address. |
| TPA-D-06 | Blue Pelican Water Solutions | No address (Largo per directory) | Independent | St. Petersburg | Pinellas-focused with a published email, but no address or history. |
| TPA-D-07 | Filterman Water Treatment | No address | Independent | Both by county | Founder-run whole-home conditioning, but softeners and RO are not named. |
| TPA-D-08 | Williams Water Conditioning | New Port Richey | Independent | Tampa Bay only | Long-running family firm, but it names no city or county. |
| TPA-D-09 | Culligan of Pinellas County | Largo | Franchise (Culligan) | St. Petersburg | Established brand with a published email, Pinellas only. |
| TPA-D-10 | Friend's Plumbing | Oldsmar | Plumbing co. | Both | Since 1979, names both cities, self-reported CFC license. |
| TPA-D-11 | Reedy Plumbing | Wimauma | Plumbing co. | Hillsborough (south) | Installs RO and lists softeners, south county only. |

Counts: 8 independents, 1 franchise, 2 plumbing companies.

## Top three to consider

1. **TPA-D-02 Just Water Treatment.** It is a specialist since 1985 that names both Tampa and St. Petersburg, installs with its own crews, gives a street address and publishes a business email, so it fits a two-city pilot best.
2. **TPA-D-01 Water Purification Solutions.** It is the only specialist with a street address inside Tampa, it names Pinellas as well, and it publishes an email and services other brands' equipment.
3. **TPA-D-03 Florida Water Treatment.** It has served Tampa Bay since 1993, names Tampa, keeps a separate Hillsborough phone line and installs softeners, whole-home filters and RO.

Alternate: TPA-D-04 Advanced Water Services has a Clearwater address and 28 years of softener work across Pinellas, Pasco and Hillsborough, but publishes no readable email and does not name RO.

## Gaps

- **No license verified.** The DBPR lookup did not work by read-only fetch (see above), and the state law does not clearly name a license for water treatment work.
- **Row count.** 11 rows, below the 12 to 15 target, because the search budget ran out early.
- **Brand dealers are thin.** Only Culligan of Pinellas County. The EcoWater dealer in St. Petersburg (tampawatercompany.com) blocks automated access. Culligan's Tampa page names no dealer. Kinetico, RainSoft, Hague, Puronics and Pentair locators were not reached.
- **Tampa core is thin.** Only TPA-D-01 has a Tampa street address. Most rows are Pinellas or Pasco based and cover Hillsborough by county.
- **No street address on own site:** TPA-D-05, TPA-D-06, TPA-D-07.
- **Decision makers:** none confirmed. TPA-D-02 carries "Dave Payton" in its brand name and TPA-D-07 names a founder by first name only.
- **Emails:** none readable for TPA-D-03, -04, -05, -08. TPA-D-09's email is a staff-named address on the dealer's domain. TPA-D-01's email is an outlook.com address in the company name.
- **Legal entities:** shown only for TPA-D-01, -02, -05, -06, -11 (and -10 from link text). The Florida Division of Corporations (Sunbiz) was not tried.
- **Reviews:** not opened.

## Exclusions

- **EcoWater Systems / tampawatercompany.com (St. Petersburg), Water For Life Inc (Tampa), Aquatic Filter Systems / thewellgenie.com (St. Petersburg):** their own sites disallow automated access by robots rule.
- **Simply Pure Water Treatment Systems (spwts.com):** the domain redirects to an expired-domain page.
- **Soft and Pure Water:** gives no street address, and its only email is a yahoo account (same rule as Houston's Water Bro's).
- **Clearwater Softeners:** gives no address or email, and St. Petersburg appears only in page meta keywords.
- **AB Certified Water Treatment (Wimauma):** its site shows no phone, address, or softener or RO statement.
- **Graywater Plumbing (Safety Harbor):** its site describes "home water filtration" but names no softener, RO or whole-home system, and gives no street address.
- **Leaf Home Water Solutions:** national (Ohio).
- **Commercial or industrial firms seen on Yellow Pages (names only):** Carter & Ver Planck, Xylem, Doosan Hydro, Nalco, Process Systems & Components, TSC-Jacobs, Filter Pure Systems, Turning Water.
- **Directory and lead sites (names only):** Yellow Pages, Angi, HomeAdvisor, marketspread.com, Yext, Tampa Magazines sponsored page.
- **Not researched (names only):** Quality Water Conditioning (Tampa and Largo listings), Indigo Water Systems (Clearwater), Blair Water Conditioning (Clearwater), On Tap Water Treatment, Advanced Pump & Well Service (Tampa), Bay Area Pump & Well (Apollo Beach), G Water Solutions (Tampa), The Friendly Water Guy (Tampa), EarthSmarte Water. Running the Tampa-side names first would fix the thin Hillsborough coverage.
