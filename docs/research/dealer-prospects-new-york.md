# New York City dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-new-york.csv` (12 rows, NYC-D-01 to NYC-D-12). Market: New York City's five boroughs (Manhattan, Brooklyn, Queens, Bronx, Staten Island). The angle here is filtration (lead, whole-home filters, RO) more than softening, so rows with filtration, RO or lead claims were preferred.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer pages tried:**
  - Culligan's New York page loaded and listed one dealer for the city: Culligan of Long Island and NYC (Holbrook).
  - Kinetico dealer pages loaded as static pages. Aqualife USA (Brooklyn) is listed for all five boroughs. Westfair Water Systems lists Kings and Queens on Kinetico's page, but its own site does not name NYC (excluded).
  - EcoWater's Old Bethpage dealer page loaded and confirmed Long Island Clean Water as an EcoWater dealer.
  - A Puronics dealer page gave MayimTov (Valley Stream), but MayimTov's own site refused automated access (excluded).
  - No RainSoft or Hague dealer serving the city was found.
- **Other sources:** web searches by borough and neighborhood, plus other wordings (lead pipes, brownstone, whole-house filter, RO, softener, licensed master plumber). HomeAdvisor, Angi, Thumbtack, Yellow Pages and The Builder Market were used only to find names. Several HomeAdvisor pages listed no company names.
- **What loaded and what did not:** maniwater.com and mayimtov.com refused automated access (robots). Most other company sites loaded.
- **What a row needed:** the company's own site (or, for Aqualife, its own pricing page plus the Kinetico dealer page) confirming residential filtration, RO or softener installs, and naming NYC or at least one borough.

## Licensing finding

- **Plumbing work:** NYC Department of Buildings licenses Licensed Master Plumbers (LMP). The DOB registrant page says "Only these Licensees, or the employees they supervise, may work on piping systems" (https://www.nyc.gov/site/buildings/industry/project-requirements-registrant-plumbing-n-site-req.page). The DOB permit page says ordinary plumbing work and fixture replacement are permit-exempt but "must be performed by a Licensed Master Plumber" (https://www.nyc.gov/site/buildings/property-or-business-owner/do-i-need-a-permit.page).
- **No separate water treatment license** was found for NYC. My reading, not a DOB ruling, is that tying a whole-house filter or softener into the water line is plumbing work for an LMP. An under-sink RO hookup is less clear.
- **Home Improvement Contractor (HIC):** NYC DCWP issues HIC licenses. DOB's HIC page says licensed plumbers are exempt when the work is within their craft (https://www.nyc.gov/site/buildings/property-or-business-owner/home-improvement-contractor-permit-requirements.page). Non-plumber water treatment firms that do home work would normally show up as HIC licensees.
- **Lookups used:** DOB License Info (NYC Open Data dataset t8hj-ruu2) and DCWP Legally Operating Businesses (dataset w7w3-xahh), both through the public data.cityofnewyork.us API with no login. Note these are open data copies, not the DOB NOW or DCWP lookup screens.
- **Result:** 8 of 12 rows have a verified active license. LMP for Austin, Petri, Big Apple, Above & Beyond, Taylor Group and P.A.C. DCWP HIC for Endless Purified Water (under High Definition Water NY Corp.) and Aqualife. High Water Standard, Clear Life NY, Long Island Clean Water and Culligan were not found in DCWP HIC data.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| NYC-D-01 | High Water Standard | Brooklyn | Independent | Filtration and RO specialist naming all five boroughs. Publishes an email. No license found. |
| NYC-D-02 | Clear Life NY | Brooklyn | Independent | RO and whole-house filter installer with prices that include NYC installation. Publishes an email. |
| NYC-D-03 | Endless Purified Water (HD Water NY) | Great Neck | Independent | Whole-house, softener and RO line with an NSF/ANSI 58 claim. DCWP HIC verified active. |
| NYC-D-04 | Long Island Clean Water | Old Bethpage | Brand dealer (EcoWater) | Names Manhattan, Brooklyn and Queens and Manhattan co-op work. |
| NYC-D-05 | Aqualife USA | Brooklyn | Brand dealer (Kinetico) | In-city Kinetico dealer listed for all five boroughs. DCWP HIC verified active. |
| NYC-D-06 | Culligan of Long Island and NYC | Holbrook | Franchise | Full line, location email published. Covers four borough counties, not Staten Island. |
| NYC-D-07 | Austin Plumbing & Heating | Brooklyn | Plumbing co. | Lead-rated (NSF/ANSI 53 claim) whole-house filtration plus RO. LMP verified active. |
| NYC-D-08 | Petri Plumbing | Brooklyn | Plumbing co. | Softener and kitchen RO installs across the boroughs. LMP verified active. |
| NYC-D-09 | Big Apple Plumbing & Heating | Queens | Plumbing co. | Under-sink and whole-house filter installs in Queens and Brooklyn. LMP verified active. |
| NYC-D-10 | Above & Beyond Plumbing and Heating | Brooklyn | Plumbing co. | Whole-house filtration, all five boroughs. LMP verified active. |
| NYC-D-11 | Taylor Group Plumbing | Manhattan | Plumbing co. | Whole-house, RO and softener installs in all boroughs. Owner named. LMP verified active. |
| NYC-D-12 | P.A.C. Plumbing, Heating & A/C | Staten Island | Plumbing co. | Only Staten Island row. Filtration, RO and softeners. Two LMPs verified active. |

Counts: 3 independents, 2 brand dealers, 1 franchise, 6 plumbing companies.

## Top three to consider

1. **NYC-D-07 Austin Plumbing & Heating:** it sells lead-rated whole-house filtration and RO to brownstone and Manhattan owners, the exact NYC lead angle, and its LMP license is verified active.
2. **NYC-D-05 Aqualife USA:** it is a Brooklyn-based Kinetico dealer that Kinetico lists for all five boroughs, says on its own site that it installs, and holds an active DCWP HIC license.
3. **NYC-D-03 Endless Purified Water:** it is a filtration specialist with whole-house, softener and RO systems, an NSF/ANSI 58 claim on its RO, and an active DCWP HIC license, though its office is just outside the city in Great Neck.

High Water Standard (NYC-D-01) is the strongest pure specialist on coverage and responsiveness, but no license was found for it, so ask who pulls permits before sending a lead.

## Gaps

- **Specialist licensing:** the specialists (High Water Standard, Clear Life NY, Long Island Clean Water) were not found in DCWP HIC data, and none holds an LMP. Who connects their whole-house systems to the water line is an open question.
- **Coverage:** Culligan's page does not list Staten Island. Endless Purified Water names the boroughs only in customer reviews. Long Island Clean Water names three boroughs. Big Apple names two.
- **Lead claims:** only Austin (NSF/ANSI 53) and Endless (NSF/ANSI 58 for RO) state a certification standard. Others claim lead reduction in general terms or not at all.
- **Decision makers:** only Taylor Group names an owner on its own site.
- **Missing details:** no email for Long Island Clean Water, Aqualife, Petri, Taylor Group or P.A.C. Two rows use free-domain email addresses.
- **Not opened:** the separate "Culligan of New York" site mentioned on a builder's page; RainSoft and Hague locators (no static NYC page found).
- **Reviews:** not opened.

## Exclusions

- **MayimTov (Puronics dealer, Valley Stream):** its own site refused automated access, so installs and coverage could not be confirmed from the company's site.
- **Westfair Water Systems (Kinetico, Bedford Hills):** Kinetico lists Kings and Queens, but its own site says Westchester and Putnam and does not name NYC.
- **NMP Water Systems (Saddle Brook, NJ):** its own site names Northern NJ and the Lower Hudson Valley, not NYC.
- **NP Co. Need A Plumber (needaplumberco.com):** no address and no license number, and the page is built around a 15-minute callback form. Possible lead generation, not confirmed.
- **NYC Water Filtration (nycwaterfiltration.com):** no street address, toll-free number only, no named company. Possible lead generation.
- **H2O Purified Water (h2opurifiedwater.com):** toll-free number, page geo-tagged to Newark NJ, and a "Plumber Partners" footer link. Possible lead network.
- **PureSpring Water Softeners & Filters (Staten Island) and Wellness Water Filtration Systems Staten Island:** template sites. PureSpring uses a 714 (California) phone with a Staten Island suite address. Treated as lead generation.
- **Precise Plumbing & Heating (Staten Island):** offers RO and point-of-entry filters, but the site has no address and no LMP was found under its name.
- **Air Care Heating & Cooling NYC:** an HVAC firm listing RO and other filter types, with no whole-house or softener line. Not pursued.
- **ManiWater:** site refused automated access.
- **Alpha Plumbers Brooklyn, Manhattan Plumbing Pros, samedayplumbingmanhattan.site, 24hourplumbernewyorkcity.com, emergencyplumbernyc.org, eco-service.com, reverseosmosispros.com:** search results with lead-generation style domains. Not opened as evidence.
- **New York Replacement Parts (nyrpcorp.com):** a parts seller with no service area or install claim.
