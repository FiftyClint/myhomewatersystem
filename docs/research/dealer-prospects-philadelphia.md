# Philadelphia dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-philadelphia.csv` (11 rows, PHL-D-01 to PHL-D-11). Market: City of Philadelphia, PA (ZIPs 19102 to 19154).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer pages tried:**
  - Culligan's location page loaded and gave Culligan of Philadelphia (Norristown). culliganphilly.com returned an error.
  - The Hague state dealer list returned an error, and a Hague dealer detail page loaded without dealer data. EPA Water Consultants was confirmed as a Hague dealer from its own site.
  - Kinetico dealer pages that loaded (Clearwater Systems, H2O Restoration, Martin Water) are not in or serving Philadelphia, based on their own pages. Martin Water does not name Philadelphia.
  - The EcoWater Pennsylvania page had no dealer list. No RainSoft dealer page was found.
  - Puronics gave Purfect Water Solutions (see exclusions).
- **Other sources:** web searches by neighborhood and suburb, plus other wordings (softener, RO, whole-house filtration, family owned). HomeAdvisor, ProFindr, MapQuest and similar pages were used only to find names and websites.
- **What loaded and what did not:** the shared web search budget for this run ran out partway through Philadelphia. A few found names could not be searched further (Goodman Plumbing's production site, Len The Plumber's Philadelphia coverage, more independents).
- **What a row needed:** the company's own site confirming residential softener, RO or whole-home filtration installs, and naming Philadelphia (or, in two flagged rows, "Greater Philadelphia").

## Licensing finding

- **Regulator:** City of Philadelphia Department of Licenses and Inspections (L&I).
  - The master plumber page (https://www.phila.gov/services/permits-violations-licenses/get-a-license/trade-licenses/get-a-master-plumbers-license) says "Plumbing work needs to be done by a licensed master plumber." It defines plumbing work to include water piping and fixtures.
  - L&I also issues a Contractor license. See https://www.phila.gov/services/permits-violations-licenses/find-a-licensed-contractor-and-contractor-information/.
- **No separate water treatment license** was found for Philadelphia. My reading, not an L&I ruling, is that tying a softener or whole-house filter into the water line is plumbing work, so a Philadelphia master plumber license applies, along with an L&I Contractor license.
- Pennsylvania also requires Home Improvement Contractor (HIC) registration with the Attorney General (https://hicsearch.attorneygeneral.gov/). That search is a form and could not be submitted with read-only fetches.
- **Lookup used:** the L&I contractor lookup (li.phila.gov/Contractor-Lookup) loads by JavaScript and could not be read. The city publishes the same license data as open data: the "L&I Trade Licenses" dataset (https://opendataphilly.org/datasets/licenses-and-inspections-trade-licenses), queried through the city's public Carto API (phl.carto.com, table trade_licenses), without login.
- **Result:** licenses were verified for City Plumbing, Sila and Home Rangers. Home Rangers' record is a Contractor license only. No water treatment specialist or Culligan was found in Philadelphia's trade license data.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| PHL-D-01 | Certified Water Services | Bucks County area (no address) | Independent | Specialist since 1993. Names Philadelphia, installs and services all brands. Publishes an email. |
| PHL-D-02 | Kel Tren WaterCare / Trident Water Treatment | Trenton, NJ and East Norriton, PA | Independent | Specialist whose Philadelphia page names city neighborhoods. Merged into Trident. |
| PHL-D-03 | AQUA Industries | Mickleton, NJ | Independent | RO and softener specialist since 1987, with a Philadelphia service page. |
| PHL-D-04 | EPA Water Consultants | Quakertown, PA | Independent (Hague-brand dealer) | Hague softeners, RO and whole-house systems. Lists Philadelphia County. Shows a PA HIC number. |
| PHL-D-05 | Pure Flow Water (East Coast Water Treatment LLC) | Souderton area | Independent | Owner named on site, publishes an email. Says "Greater Philadelphia", but the city is not named. |
| PHL-D-06 | Culligan of Philadelphia | Norristown, PA | Franchise | Names Philadelphia, full product line. Location email published. |
| PHL-D-07 | City Plumbing | Philadelphia (Port Richmond) | Plumbing co. | In-city office with three master plumbers and a softener page. L&I licenses verified active. |
| PHL-D-08 | Sila | Feasterville-Trevose, PA | Plumbing co. | Large HVAC and plumbing firm. L&I master plumber and contractor licenses verified active. |
| PHL-D-09 | Home Rangers | Warminster, PA | Plumbing co. | Installs whole-house softeners and names Philadelphia. L&I contractor license verified active. |
| PHL-D-10 | Synergy3 Home Solutions | Philadelphia and NJ (no address) | Plumbing co. | Installs softeners, filtration and RO in Philadelphia. Not found in L&I data under that name. |
| PHL-D-11 | Wm Henderson | Main Line (no address) | Plumbing co. | Installs softeners. "Greater Philadelphia" only. Firm-level license not confirmed. |

Counts: 5 independents (one is a Hague-brand dealer), 1 franchise, 5 plumbing companies.

## Top three to consider

1. **PHL-D-07 City Plumbing:** it has an office inside the city, a dedicated softener page, three master plumbers, and an active Philadelphia master plumber and contractor license verified in L&I data.
2. **PHL-D-01 Certified Water Services:** it is a water treatment specialist since 1993 that names Philadelphia, services all brands and publishes a business email.
3. **PHL-D-04 EPA Water Consultants:** it is a Hague dealer that sells and installs the full residential line, lists Philadelphia County and prints a PA HIC number.

Neither specialist in the top three showed up in Philadelphia's trade license data. Ask them who pulls plumbing permits in the city before sending a lead.

## Gaps

- **Row count is 11, below the 12 to 15 target.** The search budget ran out before more independents could be found.
- **Locators:** no Kinetico, EcoWater or RainSoft dealer serving the city was found. Those locators load by ZIP search with JavaScript.
- **Licenses:**
  - Specialists and Culligan were not found in L&I trade license data under their names (searched by company and contact name).
  - The PA HIC registry was not checked.
  - Self-reported numbers: EPA HIC PA97212; Pure Flow HIC 203427; City Plumbing HIC PA097899; Home Rangers HIC PA163523; Wm Henderson HIC PA013279.
  - Wm Henderson's "PA Plumbing 38511" matches an active Philadelphia master plumber license with no company on the record. City Plumbing's second number, 060942, is the same case.
- **Coverage:** Pure Flow and Wm Henderson say "Greater Philadelphia" and do not name the city. Certified Water Services names Philadelphia but lists no Philadelphia ZIPs. Kel Tren's parent Trident does not name Philadelphia.
- **Decision makers:** only Pure Flow names an owner on its own site.
- **Missing details:** no street address for Certified Water Services, Synergy3, Wm Henderson or Pure Flow. No email for several rows.
- **Reviews:** not opened.

## Exclusions

- **Purfect Water Solutions (Puronics dealer, Newark, DE):** the Puronics page lists Philadelphia County, but the company's own site does not name Philadelphia or describe a service area.
- **Philadelphia Plumbing Co (philadelphiaplumbingco.com):** its footer says "All contractors are independent". It is a lead-generation site.
- **Elite Water Filtration:** a multi-state template site with a toll-free number and no address. Likely lead generation.
- **Stone Water Treatment:** a contractor marketplace ("Signup as a Pro"). Lead generation.
- **Dream Team Home Services:** its water filters and softeners page does not mention softeners, filtration or RO in the body text.
- **Plumbing Pals (Economy Drain Cleaning LLC):** the water filtration page redirects to a general installs page with no water treatment line.
- **A Clear Alternative:** its own site lists New Jersey counties and does not name Philadelphia.
- **Brandywine Water Systems, Martin Water, Trident's own site, Len The Plumber:** their own sites do not name Philadelphia.
- **Goodman Plumbing:** only a netlify preview build of its site was found, not the production site.
- **Leaf Home Water Solutions:** a national company.
- **Bayes Water Treatment, Dime Water:** based in Michigan and California, not local.
- **Max Rooter and culliganphilly.com:** the pages returned errors and could not be verified.
