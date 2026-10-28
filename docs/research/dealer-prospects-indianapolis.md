# Indianapolis dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-indianapolis.csv` (10 rows, IND-D-01 to IND-D-10). Market: Indianapolis, Indiana (Marion County, ZIPs 46183 to 46278).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Search budget:** the shared web search limit for this session ran out before Indianapolis dealer searches began. Names were therefore taken from the Angi Indianapolis water softener list (names only, never as evidence) and from manufacturer and franchise brand names, and each company's likely own website was then opened directly. A row was kept only when the page that loaded showed the same business name with an Indianapolis address or phone and water treatment installation.
- **Manufacturer locators tried:**
  - Culligan: the Culligan dealer page for Indianapolis and the Culligan Ultrapure locations page both loaded. Culligan of Indianapolis is included.
  - Kinetico: kineticoindy.com loaded. The kinetico.com dealer directory did not load.
  - EcoWater: the Indianapolis dealer page did not load. Mr. Plumber's own site says it carries EcoWater softeners.
  - Pentair Find a Local Pro and True Blue: dealer lists load with JavaScript and showed no results. An Indianapolis True Blue page did not load.
  - RainSoft and Hague: not reached. No Indianapolis dealer site was confirmed.
- **Other sources that did not load:** BBB category list (robots), Angi page 2, and several company domains (see exclusions).
- Every field in the CSV comes from a page that was opened, listed in `contact_source_url`.

## Licensing finding

- **State law:** Indiana's plumbing definition (IC 25-28.5-1-2) says that "plumbing" does not include "the sale or installation of water softening equipment and apparatuses and services of the same." That statute text was read on Justia (https://law.justia.com/codes/indiana/title-25/article-28-5/chapter-1/section-25-28-5-1-2) because the regulator's pages do not quote it. The exclusion names softeners only, not filtration or RO.
- **Regulator:** the Indiana Professional Licensing Agency, Plumbing Commission, licenses plumbing contractors, corporate plumbing businesses and journeyman plumbers. Its licensing page does not mention water treatment. Source: https://www.in.gov/pla/professions/plumbing-home/plumbing-licensing-information
- **What this means in practice (inference):** a water treatment company can sell and install softeners without a state plumbing license. RO or whole-house filtration that alters water supply piping is plumbing work and needs an Indiana plumbing contractor.
- **City of Indianapolis:** the City's Department of Business and Neighborhood Services also issues contractor licenses (https://www.indy.gov/activity/contractor-licenses), but that page rendered no content, so the local rule for water treatment work was not confirmed.
- **Lookups:** the PLA e-Verification search (https://mylicense.in.gov/EVerification/Search.aspx) is a form that must be submitted interactively. The read-only fetch tool could not submit it. No license was verified. Numbers that companies show on their own sites are in the notes as "self-reported". Several use a "CO" prefix that matches other Indiana plumbing contractor numbers seen in this research (inference).

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| IND-D-01 | Indy Soft Water | Indianapolis area (4148 W 99th St; city not shown) | Independent | Specialist with a full line, rentals, salt delivery, 24/7 repair. Says woman-owned, 26 years. |
| IND-D-02 | Zenith Pure Solutions | Indianapolis (46219) | Independent | Specialist with softeners, whole-home, RO, well and PFAS systems. Own install crew. Published email. |
| IND-D-03 | Elgin Water Care | Indianapolis (no street address) | Independent | Third-generation specialist since 1946. Services most makes. No address or email on site. |
| IND-D-04 | Coopers Water | Indianapolis (46226) | Independent | Specialist since 1980 that added plumbing and HVAC. Shows a CO license number. |
| IND-D-05 | Kinetico Indianapolis | Indianapolis (46256 and 46227) | Brand dealer (Kinetico) | Two Marion County offices. Kinetico only. May be manufacturer-operated. |
| IND-D-06 | Culligan of Indianapolis (Culligan Ultrapure) | Indianapolis (46256) | Franchise | Full line, multi-state dealer group. Published email. Phone conflict between pages. |
| IND-D-07 | Benjamin Franklin Plumbing of Indianapolis | Indianapolis (46254) | Franchise | Plumbing franchise. Water treatment confirmed only on the national brand page. |
| IND-D-08 | Mr. Plumber by Metzler & Hallam | Indianapolis (46236) | Plumbing co. | Installs EcoWater softeners and filtration. Six offices. Shows CO license number. |
| IND-D-09 | Hope Plumbing, Heating and Cooling | Indianapolis (46220) | Plumbing co. | Installs softeners and RO. Founders named. Shows license numbers. |
| IND-D-10 | Grateful Plumber, LLC | Indianapolis (46241) | Plumbing co. | Softener install and repair with salt delivery. Shows license number. |

Counts: 4 independent specialists, 1 brand dealer (Kinetico), 2 franchises (Culligan, Benjamin Franklin), 3 plumbing companies with water treatment lines.

## Top three to consider

1. **IND-D-02 Zenith Pure Solutions:** it is a specialist with an Indianapolis street address, its own install and service crew, the full product line, and a published business email.
2. **IND-D-01 Indy Soft Water:** it is a long-running specialist covering Indianapolis with installs, rentals, salt delivery and same-day response, though its address needs a city and ZIP confirmed.
3. **IND-D-04 Coopers Water:** it is a specialist in business since 1980 with an Indianapolis office, and it shows an Indiana plumbing contractor number that would cover RO and filtration piping once verified.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **Search budget ran out before this market was searched.** Only the Angi name list and manufacturer pages were used to find candidates. A fresh search session should run suburb and product searches (for example Lawrence, Beech Grove, Speedway, Southport, "reverse osmosis Indianapolis") before this list is treated as complete.
- **No license verified.** The PLA lookup could not be submitted. A manual check would settle IND-D-04, IND-D-07, IND-D-08, IND-D-09 and IND-D-10, which show numbers on their sites.
- **Missing details:** legal entity shown on site only for Grateful Plumber (in link text). Owner named only for Hope Plumbing. No street address for Elgin Water Care; no city or ZIP for Indy Soft Water. Culligan shows two phone numbers.
- **Ownership question:** Kinetico Indianapolis uses a kinetico.com email and a Kinetico Incorporated footer, so it may be factory-run rather than an independent dealer.
- **Locators not captured:** Pentair, RainSoft, Hague and EcoWater. A manual ZIP search (for example 46205, 46220, 46227, 46268) would close this gap.
- **Reviews:** not opened.

## Exclusions

- **Spooner Water Solutions, C and J Water Treatment & Softeners / C&J Well Drilling, Drop Water Systems of Central Indiana, Mowery Heating Air Conditioning & Plumbing, Howald Heating Air Conditioning and Plumbing, Winters Plumbing:** found as names on Angi; the domains tried for each refused automated access or did not load, so their own sites were not confirmed. Not researched further because the search budget had run out.
- **Home Heroes Plumbing, Heating & Air:** the domain tried redirects to a Florida plumbing company, so it is not the same business. Own site not found.
- **Mister Quik Home Services:** Indianapolis plumbing, HVAC and electrical company, but its site does not mention water treatment.
- **aquasystems.net:** an information site, not a dealer.
- **RainSoft and EcoWater Indianapolis dealers:** no dealer site was reached.
- **Mr. Rooter Indianapolis:** the water softener page failed to load.
- **Leaf Home Water Solutions:** national company (Hudson, Ohio).
