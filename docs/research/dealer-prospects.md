# Kansas City metro dealer prospects

Research draft. No one has been contacted. Contact details are public business channels only.

Companion data file: `dealer-prospects.csv` (20 rows, KC-D-01 to KC-D-20).

## Method

- **Date:** 2026-10-18. Read-only public web research. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer locators tried:**
  - Pentair Find a Local Pro and True Blue pages. The locator loads results with JavaScript and could not be queried. One static dealer page was found: Pure Water of Kansas City, Gladstone MO.
  - EcoWater dealer pages, which led to Moore Water & Air in Olathe.
  - RainSoft locator: it needs a ZIP entry, and no static KC listing was found.
  - Kinetico locator: the URL tried returned 404. JF Denney's own site says it is an authorized Kinetico dealer.
  - Culligan: the KC franchise site, culligankc.com.
  - Hague: dealer site haguequalitywaterkc.com.
- **Other sources:** web search for softener, RO and filtration companies by suburb on both sides of the state line. HomeAdvisor city pages were used only to find names, never as evidence.
- **What a row needed:** each row was confirmed on the company's own website (or, for Pure Water of KC, the manufacturer's dealer page as well). Every field in the CSV comes from a page that was opened, and the URL is in `contact_source_url`.
- **Left blank on purpose:** license fields, review fields and score. Licensing is a later step, and review pages were not opened directly. Decision makers are recorded only where the company's own site names an owner or founder.
- A listing is a prospect, not proof of quality. Self-reported ratings in the notes are the companies' own claims.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| KC-D-01 | Hague Quality Water of Kansas City | Olathe, KS | Independent (Hague-brand dealer) | Water-treatment specialist since 1992. Installs, maintains and repairs. Lists cities in both states. |
| KC-D-02 | KC Water Solutions | Kansas City (KS side implied) | Independent (Kenai authorized dealer, KS) | Specialist since 1988. Named owner (Brandon Sims) and published email. Does annual service visits. |
| KC-D-03 | Pure Water of Kansas City | Gladstone, MO | Independent (Pentair True Blue PRO) | Covers the Northland. Sells and services softeners and RO, mostly Fleck/Pentair. Veteran- and family-owned. |
| KC-D-04 | The Pure Water Store (fmr. Pure Water Oasis) | Independence, MO | Independent | Since 1994. Services other makers' systems. Eastern Jackson County. |
| KC-D-05 | Integrity Water Co. | Overland Park, KS | Independent | Locally owned specialist in softeners and RO. Does one-day installs. Published email. |
| KC-D-06 | Honest Water Co. of Kansas City | Kansas City, MO | Independent | Family-run specialist with its own HWC equipment line. Works in both states. Published email. |
| KC-D-07 | Clearwater Air & Water Solutions | Lee's Summit, MO | Independent (Westinghouse exclusive retailer) | Specialist since 1990 on the MO side. Its site looks poorly maintained. |
| KC-D-08 | JF Denney | Leavenworth and Olathe, KS | Plumbing co. (Kinetico dealer) | Licensed plumbers covering 6 counties in both states. Maintenance plans include salt delivery. Kinetico brand rules apply. |
| KC-D-09 | Culligan of Kansas City (Wheatland Waters, Inc.) | Olathe, KS | **Franchise** (Culligan) | Large and established (since 1951). Territory and brand limits likely. |
| KC-D-10 | Moore Water & Air | Olathe, KS | **Franchise-brand dealer** (EcoWater) | Regional multi-site dealer since 1981. Installs softeners and RO. EcoWater rules apply. |
| KC-D-11 | Lutz Plumbing | Lenexa, KS | Plumbing co. | Installs and services softeners and filtration. Long-established. License number shown in footer (not yet checked). |
| KC-D-12 | Full Nelson | Leawood and KC, KS | Plumbing co. | Installs and services softeners and filtration. Owners named by first name. Says it is not a franchise. |
| KC-D-13 | Dragonfly HCP | Blue Springs, MO and Overland Park, KS | Plumbing co. | Full water-quality line (softener, RO, whole-home, salt-free). Offices in both states. Says it is licensed in MO and KS. |
| KC-D-14 | Bill Fry the Plumbing Guy | Lee's Summit, MO and Leawood, KS | Plumbing co. | Softeners, RO, salt delivery and maintenance plans. Published email. |
| KC-D-15 | Eric Kjelshus Energy | Greenwood, MO | HVAC/plumbing co. | Covers south and east Jackson and Cass Counties. Founder named. Softeners are a side line. |
| KC-D-16 | Anthony PHCE | Lenexa, KS and KC, MO | Plumbing co. | Metro-wide reach, but softeners are a minor line. Possible parent platform (not confirmed). |
| KC-D-17 | MVP | Mission, KS | Plumbing co. | Softeners and whole-home purification. |
| KC-D-18 | Quick Relief Plumbing | Kansas City, KS | Plumbing co. | Small shop with a softener focus on its page. Published email. |
| KC-D-19 | Garrison Plumbing | Olathe area, KS | Plumbing co. | South Johnson County. Lowest confidence: template placeholder text on the page and no address shown. |
| KC-D-20 | Benjamin Franklin Plumbing KC | Kansas City, MO | **Franchise** | Metro coverage, but water treatment is a minor line. |

Counts:

- 7 water-treatment independents (KC-D-01 to 07).
- 3 franchise or franchise-brand dealers (Culligan, EcoWater/Moore, Benjamin Franklin).
- 10 plumbing or HVAC companies with water-treatment lines. One of these, JF Denney, is also a Kinetico brand dealer.

## Gaps

- **Manufacturer locators not queried:** Pentair, RainSoft and Kinetico all load dealers with JavaScript after a ZIP entry, so their full KC dealer lists were not captured. WaterBoss, Fleck/Hague international and Kinetico locator pages were not found or did not load. A manual ZIP search (e.g. 64105, 66210, 64081, 64118) in a browser would close this gap.
- **No RainSoft or second Kinetico dealer found** for KC. No Culligan location on the Missouri side was found. Culligan of Kansas City lists only Kansas-side cities.
- **Missing details, to confirm later:**
  - Most rows have no legal entity. Only Culligan, Lutz, Dragonfly, Clearwater, The Pure Water Store and Hague showed one on site.
  - No street address on own site for KC Water Solutions, Clearwater, Garrison and Benjamin Franklin.
  - Honest Water Co. shows two different phone numbers.
- **Decision makers:** an owner or founder is named only for KC Water Solutions (Brandon Sims), Full Nelson (first names) and Eric Kjelshus (founder). All others are blank.
- **Licensing:** not checked. Lutz shows a license number in its footer, recorded in notes only. Licensing is for local jurisdictions and state boards to confirm in the next step.
- **Reviews:** review pages were not opened. The ratings in the notes are the companies' own claims.
- **Excluded:**
  - Overland Park Plumbing Co: its footer says it is a lead-generation site.
  - Wellness Water Filtration Systems: no address, conflicting phone numbers, and a multi-state service area. Could be a lead network.
  - Leaf Home: national.
  - Clear Water Purification: Wichita-based Hague dealer; KC presence not verified on its own site.
  - Pure Water Oasis listed separately: now The Pure Water Store.
  - Mission Plumbing, Dick Ray, Arete Plumbarius, Dons Quality Water and Home Water Systems: own website not found, or softener work not confirmed on their own site.
- **Not yet covered:** Clear Choice Water of Kansas (named on the KC Water Solutions site) was not researched. The far edges of the metro (St. Joseph, Warrensburg, Lawrence-only shops) are thin.
