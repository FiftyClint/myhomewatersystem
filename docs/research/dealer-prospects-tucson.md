# Tucson dealer prospects (market-id tucson, prefix TUS)

Research draft. No one has been contacted.

Market: Tucson, AZ and the Pima County metro (Tucson, Oro Valley, Marana, Sahuarita). Companion data file: `dealer-prospects-tucson.csv` (10 rows, TUS-D-01 to TUS-D-10).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services.
- **Brand and manufacturer pages that loaded:** Culligan of Tucson (culligan.com and culliganwater.com); EcoWater dealer page and EcoWater microsite for Superior Water Treatment; AquaZona Kinetico of Tucson own site; Parker & Sons Tucson pages (EcoWater systems).
- **Did not load:** Sun Tap Water Systems and Rainmaker Technologies (knowater.life) own sites disallow automated access by robots rule. Western Water Technologies (wwtinc.biz) redirected to another domain and was not followed.
- **Name finding only (never evidence):** Angi Tucson water softener page, HomeAdvisor Oro Valley page, Superpages Tucson water filtration list, a radio station business directory, Greater Vail Chamber and Tucson Chamber listings, and trade press on the Water Tec acquisition.
- **Search wordings:** softener, RO and filtration companies in Tucson, Oro Valley and Marana; brand names (Culligan, Kinetico, RainSoft, EcoWater, Rayne, Hague) with Tucson; "water conditioning" and ROC wording with Tucson.
- **Search limit:** the shared web search budget for the session ran out partway through Tucson. Planned searches by Sahuarita, Green Valley and Marana did not run, and the remaining checks used pages already found. This is the main reason the list has 10 rows, not 12 to 15.
- **What a row needed:** the company's own site (or, for Culligan and Superior, the brand-hosted dealer page plus the own site) confirming it sells and installs residential softeners, RO or whole-home filtration in the Tucson area. Every field comes from the page named in `contact_source_url`.
- **Left blank on purpose:** review fields and score. No row's own site names an owner or founder, so decision_maker_verified is blank on every row.

## Licensing finding

- **Regulator:** Arizona Registrar of Contractors (ROC), https://roc.az.gov/ . Contractor licensing in Arizona is statewide through the ROC, so the Tucson rules are the same as Phoenix.
- **Which license applies:** the ROC's license classification list (https://www.azroc.gov/sites/default/files/2023-11/License%20Classification%20Requirements_6.8.20_0.pdf, read 2026-10-28) has a dedicated **Water Conditioning Equipment** trade: R-54 (residential), C-54 (commercial) and CR-54 (dual). The same list has R-37, R-37R and CR-37 Plumbing.
- **Plumbing licenses:** the classification list does not say whether a plumbing license covers softener installs. Our reading, which is an inference and not an ROC ruling, is that a plumbing contractor with R-37 or CR-37 likely installs softeners under that license in practice, while a softener-only shop would need R-54 or CR-54. Confirm with the ROC before relying on it.
- **Public lookup:** the ROC Contractor Search (https://azroc.my.site.com/AZRoc/s/contractor-search) showed only "Loading / Sorry to interrupt / CSS Error" from this environment on 2026-10-28. The ROC Posting List page (https://roc.az.gov/posting-list) loaded and says its active contractor lists were last updated 2025-03-24, but it exposed no file links. No license could be verified. Every row has license_regulator and license_checked_on filled, number and status blank, and any ROC number the company shows on its own site recorded in notes as self-reported.
- **Manual next step:** open the ROC Contractor Search in a normal browser and search each self-reported number. Check that the class is R-54/CR-54 or R-37/CR-37 and the status is active.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| TUS-D-01 | Pure Way Filtration Tucson | Tucson 85718 | Independent | Local whole-home filtration and softening specialist, which looks new and is likely hungry for leads. |
| TUS-D-02 | Clear Water Concepts | Valley-wide, Tucson techs | Independent | Specialist since 1998 with published prices; its city list covers the whole Tucson metro. |
| TUS-D-03 | Water Tec of Tucson | Tucson 85714 | Brand dealer (A. O. Smith-owned) | Tucson water treatment firm since 1967 with a full line, now owned by A. O. Smith. |
| TUS-D-04 | Superior Water Tucson | Tucson 85711 | Brand dealer (EcoWater) | EcoWater dealer whose site lists Tucson, Oro Valley, Marana and Sahuarita. |
| TUS-D-05 | AquaZona: Kinetico of Tucson | Tucson 85705 | Brand dealer (Kinetico) | Kinetico dealer since 1987 with a Tucson office; same company as the Phoenix AquaZona row. |
| TUS-D-06 | Culligan of Tucson | Tucson 85706 | Franchise (Culligan) | Large established dealer with a published email and all of southern Arizona as territory. |
| TUS-D-07 | Intelligent Design | Tucson 85719 | Plumbing co. | Has installed Brita PRO softeners in Tucson since 2011 and lists the whole metro. |
| TUS-D-08 | Rite Way Heating, Cooling & Plumbing | Tucson 85714 | Plumbing co. | Installs RO and whole-home softeners across the metro. |
| TUS-D-09 | Parker & Sons (Tucson) | Tucson | Plumbing co. (EcoWater) | Large home-services firm doing water conditioning installs since 1974. |
| TUS-D-10 | Goettl (Tucson) | Tucson 85714 | Plumbing co. | Installs softeners and RO across the metro; water is one line among many. |

Counts: 2 independents, 4 brand or franchise dealers, 4 plumbing companies. Verified licenses: 0 of 10. Self-reported ROC numbers appear on 5 of 10 sites (TUS-D-02, 03, 05, 07, 09).

## Top three to consider

1. **TUS-D-01 Pure Way Filtration Tucson.** It is a local Tucson whole-home water treatment company that installs through licensed plumbers and appears to be newer, so a free lead and an exclusive may matter more to it than to an established dealer, though its site shows no ROC number and two phone numbers are in circulation.
2. **TUS-D-04 Superior Water Tucson.** It is a Tucson-based EcoWater dealer whose own site lists Tucson, Oro Valley, Marana and Sahuarita, which matches the market exactly, though EcoWater program terms may apply and no license number is shown.
3. **TUS-D-02 Clear Water Concepts.** It is a water treatment specialist since 1998 with published install prices, a self-reported ROC number and Tucson field technicians, though it has no Tucson street address and is the same company already listed for Phoenix and the East Valley.

None of the three has a license verified on the ROC lookup yet.

## Gaps

- **Row count below target:** 10 rows, not 12 to 15, because the web search budget ran out before suburb searches (Sahuarita, Green Valley, Marana) ran. Only two independents made the list.
- **Licensing:** no license verified. Self-reported ROC numbers: TUS-D-02 (ROC355411), TUS-D-03 (098784, 104403), TUS-D-05 (ROC097214), TUS-D-07 (340962, 322375, 296386, 276673, plus 322428 in its FAQ), TUS-D-09 (152654, 152656, 233298, 258885, 300696). None show on TUS-D-01, 04, 06, 08 or 10.
- **Decision makers:** no own site names an owner or founder.
- **Missing contact details:** no street address on own site for TUS-D-01 (ZIP only), TUS-D-02 and TUS-D-09. Only TUS-D-06 publishes an email.
- **Phone conflicts:** TUS-D-01 (chamber shows a different number), TUS-D-03 (two Tucson numbers), TUS-D-04 (three numbers across own site and EcoWater pages), TUS-D-06 (local number versus 1-888 number), TUS-D-10 (a Los Angeles area code on one page).
- **Overlap with Phoenix files:** TUS-D-02, TUS-D-05 and TUS-D-09 are the same companies as rows in the Phoenix and East Valley lists. Exclusivity offered in one market may interact with the other.
- **Not yet researched (names found only):** Sun Tap Water Systems (site blocked), Rainmaker Technologies (site blocked), Lifewater Solutions LLC, Reliable Water Service, Sahuarita Plumbing, Rootin Tootin Rooter, Hester Plumbing, B&B Plumbers, Arizona Service Plumbing, Plumb Plumbing, Strongbuilt Plumbing & Air, Aqualine II Water Systems, Btw Water Softeners Filters & More, Pure Water Technology, Ionics Pure Solutions.
- **Reviews:** not opened.

## Exclusions

- **LifeSource Water Systems (Tucson office):** factory-direct salt-free brand; the Tucson page shows no street address and a Phoenix phone number. Held as an alternate.
- **Pure Home 365 (Tucson):** air purification and bedding showroom; the page names water filtration but no softeners, RO, installs, address or phone.
- **High Quality Water of Tucson (RainSoft):** found only in a Yext directory listing; its own site was not found before the search budget ran out. RainSoft's pages name no Tucson dealer.
- **Southwestern Utility Management (Raindance Water):** manages small water utilities; its page does not mention residential treatment.
- **My Plumber Plumbing Services:** Tucson plumber, but its site lists no softener, RO or filtration service.
- **Daiohs First Choice:** office coffee and water service, not residential.
- **Western Water Technologies (wwtinc.biz):** redirected to another domain; not followed.
- **Advantage Pure Flo:** Angi lists it under Mesa; no Tucson site found.
- **Directory and lead sites (names only):** Angi, HomeAdvisor, Superpages, Yext, kgvy1080.com directory, softprowatersystems.com Tucson pages, instaservice.com, abcwaterandair.vercel.app.
