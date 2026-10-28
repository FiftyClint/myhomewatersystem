# Aurora dealer prospects

Research draft. No one has been contacted.

Market: `aurora` (Aurora CO across its Arapahoe, Adams and Douglas county parts, plus Denver metro dealers whose own site names Aurora as served). Companion data file: `dealer-prospects-aurora.csv` (10 rows, AUR-D-01 to AUR-D-10).

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches. No forms, accounts, calls, emails, people-search or enrichment services.
- **Brand pages that loaded:** Culligan's Englewood dealer page (it names Littleton, not Aurora). Kinetico Advanced Water Systems' Denver location page (it names Denver, not Aurora). Culligan's generic Colorado, Denver and Aurora pages and RainSoft's Denver pages loaded but name no local dealer. Kinetico's dealer-detail page is not a locator.
- **Did not load or not used:** The DORA license lookup page (apps2.colorado.gov) failed to load. Aerus of Denver's service-area page failed; its homepage loaded. One own site disallows automated access by robots rule and was not read: watrdude.com.
- **Name finding only (never evidence):** Yellow Pages Aurora water softener and water conditioning pages, BBB Colorado category pages, HomeAdvisor Aurora water treatment page, The Builder Market Aurora page, an HBA Denver member listing and a Yext listing (for Kinetico's address).
- **Search wordings:** softener, RO and whole-house filtration companies by Aurora (80011 to 80016), Parker, Centennial, Denver metro; plumber plus softener for Aurora; brand searches for Culligan, Kinetico, EcoWater, RainSoft, Hague, Puronics and Pentair.
- **Budget stop:** the shared web search budget for this session ran out partway through, and the page-fetch budget ran short later. More names could be run in a follow-up (see Gaps).
- **What a row needed:** the company's own site confirming it sells and installs or services residential softeners, RO or whole-home filtration, and naming Aurora (or having its office in Aurora). Every field comes from the page named in `contact_source_url`, except license fields and the legal entity names marked "name on DORA record".
- **Left blank on purpose:** review fields and score. Decision makers only where the company's own site names an owner.

## Licensing finding

- **Which license applies.** Colorado regulates water conditioning work under the Plumbing Practice Act. C.R.S. 12-155-108 says a person may practice as a **water conditioning contractor** only if registered with the State Plumbing Board, must have a registered **water conditioning principal** responsible for the work, and that a **water conditioning installer** must be registered, with proof of certification from a recognized national water conditioning association (statute text read at https://colorado.public.law/statutes/crs_12-155-108). The same section lets licensed plumbers, apprentices and registered **plumbing contractors** work on water conditioning appliances within their scope. A 2024 DORA and CDPHE bulletin on HB24-1344 repeats that plumbers and registered plumbing contractors do not need the separate water conditioning registration (https://content.govdelivery.com/accounts/CODORA/bulletins/3a60575).
- **Who runs it.** The Colorado State Plumbing Board in DORA's Division of Professions and Occupations: https://dpo.colorado.gov/Plumbing/LicensingServices .
- **Lookups.**
  - DORA license lookup (https://apps2.colorado.gov/dora/licensing/lookup/licenselookup.aspx): the page failed to load. **Lookup blocked.**
  - Instead, the state open-data portal publishes DORA's license records with a link back to DORA's own verify page for each record: "Professional and Occupational Licenses in Colorado", https://data.colorado.gov/Regulations/Professional-and-Occupational-Licenses-in-Colorado/7s5z-vewr . It answered plain read-only queries. Every license number and status in the CSV comes from that dataset on 2026-10-28, and the notes say so. Status is as of the dataset's last refresh, which the page does not state.
  - The dataset holds only 20 water conditioning contractor (WC) registrations statewide (alongside 15 installer and 21 principal registrations). None of the ten rows holds one. Each verified row is a plumbing contractor (PC) registration, plus one person's master plumber (MP) license for AUR-D-03.
  - The dataset also carries discipline entries. Four rows have one or more (AUR-D-01, -04, -07 and -09). AUR-D-08 and AUR-D-10 show none. They are listed in notes by case number and action name only. The case details were not opened.
- **Result:** 7 of 10 rows have a license number and status from the DORA records (AUR-D-01, -03, -04, -07, -08, -09, -10). AUR-D-02, -05 and -06 were not found by name. `license_checked_on` is 2026-10-28 on every row.

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| AUR-D-01 | Water Pros | Aurora (80011) | Independent | Aurora-based owner-operated specialist with 33 years in water and an active PC registration. |
| AUR-D-02 | Colorado Water Purification (Water Works) | Centennial (80112) | Independent | Specialist with a dedicated Aurora page, a published email and a yearly service visit model. |
| AUR-D-03 | Pure Water Choices | Castle Rock | Independent | WQA-member specialist that lists Aurora and holds an active master plumber license. |
| AUR-D-04 | Colorado Water Works | Englewood | Independent | Water treatment firm with an active PC registration that lists Aurora, but it has open discipline entries. |
| AUR-D-05 | AquaShield Home Systems | Fort Collins | Independent | Small specialist that lists Aurora and publishes an email, but Aurora is far from its base. |
| AUR-D-06 | Clean Water Co | Aurora (80014) | Brand dealer (Maytag) | Aurora-based with its own install team and a published email. |
| AUR-D-07 | Plumbline Services | Centennial (80112) | Plumbing co. (EcoWater line) | Large firm with an Aurora page that installs EcoWater softeners. |
| AUR-D-08 | Superior Mile High Plumbing | Aurora (80013) | Plumbing co. | Owner-named Aurora plumber that installs softeners, with an active PC registration and no discipline entry. |
| AUR-D-09 | Plumb Pros | Arvada | Plumbing co. | Plumber with an Aurora softener page and RO and whole-house filters. |
| AUR-D-10 | High 5 Plumbing | Denver, Golden, Littleton | Plumbing co. | Multi-trade firm with an Aurora water filter page and an active PC registration. |

Counts: 5 independents, 1 brand dealer, 4 plumbing companies (one with an EcoWater line).

## Top three to consider

1. **AUR-D-01 Water Pros.** It is a water treatment specialist with its office in Aurora, a named owner, a published email and an active plumbing contractor registration, though the owner should be asked about the 2026 stipulation shown on the DORA record.
2. **AUR-D-02 Colorado Water Purification.** It has a page written for Aurora homes, a published email and a test-then-install model with yearly service, but no license was found under its name.
3. **AUR-D-03 Pure Water Choices.** It is a specialist that lists Aurora, does its installs in-house and holds an active master plumber license, though it publishes no email and sits in Castle Rock.

Alternate: AUR-D-06 Clean Water Co is based in Aurora with its own install team, but it sells Maytag as an exclusive dealer, and no license was found under its name.

## Gaps

- **Row count.** 10 rows, below the 12 to 15 target. The search budget ran out before more suburbs (Littleton, Highlands Ranch, Brighton, Commerce City) and more brand locators could be run.
- **Brand dealers are thin.** Culligan's Englewood dealer page names Littleton only, and Kinetico Advanced Water Systems names Denver only, so neither met the "site names Aurora" rule. A "Mile High Culligan Water, Inc." name appeared on a directory but no own site was found. No RainSoft, Hague, Puronics or Pentair dealer page for the Denver metro was found.
- **Licenses not found:** AUR-D-02, -05 and -06 by name. A business can trade under a name different from its DORA record, so this is not proof they are unlicensed.
- **Discipline entries** on AUR-D-01, -04, -07 and -09 were not opened. AUR-D-04's entries include a formal complaint filed with the Office of Administrative Courts in 2025.
- **No street address on own site:** AUR-D-05 (city only), AUR-D-07 and AUR-D-08 (city and ZIP from DORA record only).
- **Decision makers:** named owners only for AUR-D-01 and AUR-D-08.
- **Emails:** none published for AUR-D-03, -04, -07, -08, -09, -10. Two emails are staff-named addresses on the company domain (AUR-D-01, -05).
- **Reviews:** not opened. Ratings in notes are the companies' own claims.

## Exclusions

- **Kinetico Advanced Water Systems (Denver, 2505 W 2nd Ave):** its own site and Denver page name Denver but not Aurora. Strong brand candidate if Aurora coverage is confirmed.
- **Culligan of Englewood (Hall's Water):** its dealer page names Littleton, not Aurora.
- **The Source H2O (Englewood):** its site does not name Aurora, and it sells nationwide through local installers.
- **Eco Water Services (Morrison):** its site names Parker and the metro but not Aurora, and gives no street address.
- **L&L Systems (Aerus of Denver, Lakewood):** its site does not name Aurora.
- **GeoWater Services (Evergreen):** holds a DORA water conditioning contractor registration (self-reported WC.0000008), but its site does not name Aurora or describe residential softeners or RO.
- **Done Plumbing:** its softener page names Denver only and gives no address or phone.
- **Headstrong Plumbing:** its site serves Lone Tree and nearby areas and does not name Aurora.
- **Watrdude Consulting (Brighton):** its own site disallows automated access by robots rule.
- **Rocky Mountain Bottled Water (rmbw.com):** bottled water and office filtration, no softener or RO install.
- **Loren & Associates (Aurora):** industrial and commercial water treatment only.
- **Superior Water & Air:** Utah and Idaho company; Aurora not named.
- **EarthSmarte Water of Greater Denver:** its page carried only a title and meta tags.
- **Leaf Home Water Solutions:** national (Ohio); also in the DORA WC list with an Ohio address.
- **Directory and lead sites (names only):** Angi, HomeAdvisor, Yelp, Yellow Pages, BBB, The Builder Market, Thumbtack, needinstall.com, whole-house-water-softener-install pages.dev sites.
- **Not researched (names only):** Benjamin Franklin Plumbing Denver, Mountain Standard Plumbing (Centennial), An Affordable Plumber (Highlands Ranch), Chuck the Water Man (Denver; its DORA WC registration shows expired), Clarity Water Services (Thornton; WC expired), Mile High Culligan Water, Inc.
