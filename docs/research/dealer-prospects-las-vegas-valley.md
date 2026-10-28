# Las Vegas Valley dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-las-vegas-valley.csv` (14 rows, LV-D-01 to LV-D-14). Market: Las Vegas, Henderson and North Las Vegas, NV (ZIPs 89002 to 89183).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services.
- **Manufacturer pages tried:**
  - Culligan location pages (culligan.com and culliganlasvegas.com) loaded and gave Culligan of Las Vegas.
  - An EcoWater dealer page loaded (on a staging subdomain) and pointed to lvecowater.com.
  - Puronics dealer pages loaded for Focus Plumbing and Aggua Systems.
  - Kinetico: no static Las Vegas dealer page was found. Kwater's own site says it is the authorized independent Kinetico dealer.
  - RainSoft, Hague and Pentair: no static Las Vegas dealer page was found.
- **Other sources:** web searches by city (Las Vegas, Henderson, North Las Vegas, Summerlin) and by wording (softener, reverse osmosis, whole-home filtration, salt delivery, C-30). HomeAdvisor, Angi, MapQuest, BBB and HomeGuide pages were used only to find names and website addresses, never as evidence.
- **What loaded and what did not:** agguasystems.com refused the fetch (robots rule), so that dealer was not verified. Search results were full of spam pages (pages.dev, netlify, Google Sites); none were used. The shared web search budget for this run ran out near the end, so a few remaining names were not searched.
- **What a row needed:** the company's own site confirming it sells and installs (or services) residential softeners, RO or whole-home filtration in the valley. Every field comes from a page that was opened; the page is in `contact_source_url`.

## Licensing finding

- Regulator: Nevada State Contractors Board (NSCB), https://www.nvcontractorsboard.com/ (nscb.nv.gov redirects there).
- The specialty that fits is **Classification C-30, installing equipment to treat water** (NAC 624.470): "A person who holds a classification C-30 license may install equipment in existing water lines" to treat water. Source: https://regulations.justia.com/states/nevada/chapter-624/classifications/section-624-470/ and the NAC chapter at https://www.leg.state.nv.us/nac/NAC-624.html.
- Plumbing contractors under Classification C-1 (plumbing subclass, shown on sites as C-1D) also do this work. My reading, not a board ruling, is that either license covers a softener or RO install.
- **Lookup result:** the NSCB license search (https://app.nvcontractorsboard.com/Clients/NVSCB/Public/ContractorLicenseSearch/ContractorLicenseSearch.aspx) has no login or bot check. It is an interactive form, though, and it could not be run with read-only page fetches. No license was verified. License numbers that companies print on their own sites are in the notes as "self-reported". A manual search by license number would close this quickly.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| LV-D-01 | Serv-All Water Conditioning | North Las Vegas | Independent | Specialist since 1978 that installs, repairs and maintains softeners across the valley. Publishes an email. |
| LV-D-02 | Rain Water Conditioning (Rain of Las Vegas) | Las Vegas | Independent | Specialist since 1995 with a showroom. Shows a C-30 water treatment license number. Publishes an email. |
| LV-D-03 | H2O to GO | Las Vegas | Independent | Family-owned since 1981. Softeners, RO and whole-house systems, with rentals. Shows an NV license number. |
| LV-D-04 | Hanson's Quality Water Works | Las Vegas | Independent | Water treatment since 1994, but it leans toward commercial and plumbing work. |
| LV-D-05 | Earth Water Solutions | Henderson and Las Vegas | Independent | Veteran-owned. Installs softeners and RO. Shows an NV license number. Its site has copy errors. |
| LV-D-06 | American Water Treatment | Las Vegas | Independent | Family-owned for 30+ years. Mainly RO. Covers Las Vegas, Henderson, Pahrump and Boulder City. |
| LV-D-07 | Red Rock Water Systems | Las Vegas | Independent | Sells softeners and RO online. Lowest confidence: no address or license number shown. |
| LV-D-08 | Culligan of Las Vegas | Las Vegas | Franchise | Large, with valley-wide coverage. Owned by a corporate Culligan group. |
| LV-D-09 | EcoWater Systems Las Vegas | Las Vegas | Brand dealer | EcoWater dealer since 1983. Lists install and service. Publishes an email. |
| LV-D-10 | Kwater (Kinetico) | Henderson | Brand dealer | Authorized independent Kinetico dealer. Also runs Florida offices. |
| LV-D-11 | Focus Plumbing | Las Vegas | Plumbing co. | Puronics dealer inside a plumbing shop. Shows a license number. |
| LV-D-12 | Ideal Services | Henderson | Plumbing co. | Installs softeners, RO and salt-free systems. Shows an NV C-1D plumbing license number. |
| LV-D-13 | Craig's Plumbing | Las Vegas | Plumbing co. | Installs softeners and RO. Covers four valley cities. |
| LV-D-14 | Goettl | Las Vegas | Plumbing co. | HVAC-led regional brand where water treatment is a side line. |

Counts: 7 independents, 3 franchise or brand dealers, 4 plumbing companies (one of them, Focus Plumbing, is also a Puronics dealer).

## Top three to consider

1. **LV-D-02 Rain Water Conditioning:** it is a softener specialist with a showroom, the only row that prints a C-30 water treatment license, and it publishes a business email.
2. **LV-D-01 Serv-All Water Conditioning:** it is a family-owned specialist since 1978 that installs and services all makes valley-wide and publishes a business email.
3. **LV-D-03 H2O to GO:** it is a family-owned specialist since 1981 that covers most of the valley, shows an NV license number and publishes a business email.

None of the three has a license verified with NSCB yet; that is the first check before a pilot lead.

## Gaps

- **Licenses:** none verified (see Licensing finding). Self-reported numbers: Serv-All 77144 and 95582; Rain 43230 (C-30); H2O to GO 91997; Earth Water 0089873; Hanson's 0080828 and 0067977; Focus Plumbing 73299; Ideal Services 0095381 (C-1D).
- **Decision makers:** no owner or founder is named on any company site. All are blank.
- **Legal entities:** shown only for Earth Water USA, LLC, Focus Plumbing LLC and Hanson's (Inc.). No Secretary of State lookup was run.
- **Locators:** the RainSoft, Hague, Pentair and Kinetico locators were not queried, because no static Las Vegas pages were found. No RainSoft or Hague dealer was identified.
- **Data conflicts:** Culligan shows three phone numbers across its pages. The EcoWater address differs between the manufacturer page and the dealer's own site. Kwater's location blocks are mismatched.
- **Search budget:** the run hit its web search limit, so names like Sunrise Service, Pure Plumbing & Air, Monkey Wrench Plumbing and Jump 2 It Plumbing were not checked.
- **Reviews:** not opened.

## Exclusions

- **Custom Water Refining (North Las Vegas):** its own site describes a mobile filter and RO-membrane service and does not confirm new installs. Its contact is a first-name cell line.
- **Superior Water Systems:** its own site shows no street address, a phone number without an area code, and no install statement.
- **Aggua Systems (Puronics dealer):** its own site blocked the fetch (robots rule), so this was a lookup blocked.
- **Leaf Home Water Solutions:** a national company.
- **reverseosmosispros.com:** a multi-city page with no address or license number. It could be a lead network.
- **Spam pages:** pages.dev, netlify and Google Sites pages (including "Kingdom Plumbing" Google Sites pages) are search spam or lead pages.
- **SoftPro Water Systems:** an online retailer with city landing pages, not a local installer.
- **Green Living Water Solutions, Nevada Water Specialists, Design Water Systems:** no company website was found.
