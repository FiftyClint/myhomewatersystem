# Cincinnati dealer prospects

Research draft. No one has been contacted.

Companion data file: `dealer-prospects-cincinnati.csv` (13 rows, CIN-D-01 to CIN-D-13). Market: Cincinnati and Hamilton County, Ohio (Greater Cincinnati Water Works area). Northern Kentucky companies are included only where their own site says they serve Cincinnati. The homeowner concerns are lead service lines and PFOS, so rows that show RO, whole-home filtration or a lead or PFAS claim rank above softener-only rows.

## Method

- **Date:** 2026-10-28. Read-only public web research with web search and page fetches only. No forms, accounts, calls, emails, people-search or enrichment services were used.
- **Name sources (names only, never evidence):** HomeAdvisor and Angi Cincinnati pages, and web searches by product, suburb and Northern Kentucky.
- **Manufacturer locators:** Culligan's Cincinnati dealer page loaded. Kinetico dealer pages surfaced Integrity Water Solutions. EcoWater searches returned only dealers in other parts of Ohio. RainSoft dealer status came from the dealer's own site.
- **Did not load:** Yelp (robots refused), wellnesswaterfiltrationsystemscincinnatioh.com (robots refused), and the Ohio eLicense verification page (empty page).
- A row was kept only when the company's own site confirmed residential water treatment and Cincinnati coverage. Every CSV field comes from a page that was opened, listed in `contact_source_url` or the notes.

## Licensing finding (Ohio, Cincinnati and Hamilton County)

- **State license:** the Ohio Construction Industry Licensing Board (OCILB) issues the plumbing contractor license. Both local regulators below require it.
- **City of Cincinnati:** the Department of Buildings & Inspections does plumbing inspections with State of Ohio-certified inspectors. Its page says all plumbing work must be done by "a State of Ohio-licensed plumbing contractor, licensed journeyman plumber, or registered apprentice." Source: https://www.cincinnati-oh.gov/buildings/building-construction-inspections/plumbing-inspections/ . Its registration page says a licensed plumbing contractor registers with the city by presenting the state examining board certificate and renews every year: https://cincyweb.cincinnati-oh.gov/buildings/building-permit-forms-applications/permit-guide/do-i-need-a-registered-contractor/
- **Hamilton County outside the city:** Hamilton County Public Health (HCPH) runs plumbing permits. Anyone installing, repairing or modifying a plumbing system in its district must be registered and bonded, and contractors pulling permits must show an Ohio plumbing contractor license from OCILB. Sources: https://hamiltoncountyhealth.org/services/plumbing/plumbing-contractor-registration/ and Plumbing Regulation 4-2014 (https://www.hamiltoncountyhealth.org/wp-content/uploads/051214_41_FINAL_PlumbingRegulation_4.pdf).
- **Water treatment equipment:** none of these pages names water softeners, filters or RO. HCPH's "When to get a permit" sheet (https://www.hamiltoncountyhealth.org/wp-content/uploads/whentogetapermit.pdf) does not list them, and the city fee and permit pages do not mention them.
- **What this means in practice (inference):** Ohio has no separate water treatment license that was found. Connecting a softener or whole-home filter to the supply piping looks like plumbing work, so a Cincinnati dealer would need an OCILB plumbing contractor license (or a licensed plumber on staff) plus city or HCPH registration. Whether an under-sink RO swap needs a permit was not confirmed. HCPH's plumbing division (513-946-7854) is the place to ask.
- **Northern Kentucky:** Kentucky companies need a Kentucky master plumber license from the Department of Housing, Buildings and Construction for Kentucky work (see `dealer-prospects-louisville.md`), and an Ohio license for Cincinnati work.
- **Lookup:** the OCILB verification page on Ohio's eLicense site came back empty to the read-only fetch tool, and neither the city nor HCPH publishes a contractor list that was found. No license was verified. Numbers companies show on their own sites are in the CSV notes as "self-reported".

## Summary table

| ID | Name | Location | Type | Why it might fit |
|---|---|---|---|---|
| CIN-D-01 | Ohio Valley Pure Water | Cincinnati (no address) | Independent | Specialist since 1988 doing softeners, RO and whole-house carbon. Talks about lead and PFAS. Recent install testimonials. |
| CIN-D-02 | Butler Water Systems LLC | Fairfield | Independent | Specialist since 1973 with softeners and RO, services all major brands. Published email. |
| CIN-D-03 | Tri-State Waterworks | Maineville | Independent | Softeners, RO, whole-house carbon. Installs its own work. Published email. |
| CIN-D-04 | Pure H2O | Cincinnati (Reading Rd) | Brand dealer (RainSoft) | Full line with a PFAS product claim and RO for lead. Columbus-based company. |
| CIN-D-05 | Culligan of Cincinnati | Cincinnati (45242) | Franchise | Full Culligan line, names Hamilton County, published email. |
| CIN-D-06 | Integrity Water Solutions | Dayton | Brand dealer (Kinetico) | Kinetico softeners and drinking water with a Cincinnati page on lead and PFAS. Office is in Dayton. |
| CIN-D-07 | Ken Neyer Plumbing, Inc. | Cleves | Plumbing co. | Softeners and filtration since 1972. Shows Ohio and Kentucky license numbers. |
| CIN-D-08 | Apollo Home | Cincinnati (45209) | Plumbing co. | Whole-house filtration and softener combos installed at the main line. |
| CIN-D-09 | 513 Plumbing & Gas Solutions | Blue Ash | Plumbing co. | Softeners, whole-house filtration and under-sink RO. Owner-operated. |
| CIN-D-10 | Blue Ash Plumbing & Drain | Blue Ash | Plumbing co. | Softeners, purification and RO. Shows an Ohio plumbing number. Part of Five Star Home Services. |
| CIN-D-11 | Arlinghaus | Erlanger, KY | Plumbing co. | RO, softeners and UV. Serves Cincinnati with a Sharonville office. |
| CIN-D-12 | Arronco Comfort Air | Burlington, KY | Plumbing co. | Under-sink RO. Shows an Ohio master plumbing number. |
| CIN-D-13 | Bryant Heating, Cooling, Plumbing & Electric | Florence, KY | Plumbing co. | Softeners and whole-house filtration across a three-state footprint. |

Counts: 3 independent specialists, 2 brand dealers (RainSoft, Kinetico), 1 franchise (Culligan), 7 plumbing or home services companies with water treatment lines.

## Top three to consider

1. **CIN-D-01 Ohio Valley Pure Water:** it is a local water treatment specialist with recent Cincinnati install testimonials and a product line (RO plus whole-house carbon) that speaks to both lead and PFAS, though it shows no address or license.
2. **CIN-D-02 Butler Water Systems LLC:** it is a long-running specialist with a confirmed LLC name, a street address, a published email and a softener and RO line, though its site is dated and its office is in Butler County.
3. **CIN-D-07 Ken Neyer Plumbing, Inc.:** it is a long-running Cincinnati-area plumbing company that sells softeners and filtration and shows Ohio and Kentucky license numbers, which would cover the piping connection once verified.

Note: no row has a verified license, so none of the three meets the "verified license" test yet.

## Gaps

- **No NSF/ANSI 53 or 58 claims** on any page read. Pure H2O claims a PFAS product (UltreFlo Protect) and recommends RO for lead; Ohio Valley Pure Water recommends RO for PFAS. No dealer cites a certified lead or PFAS reduction standard.
- **No license verified.** The OCILB lookup did not load. A manual check would settle CIN-D-07, CIN-D-10, CIN-D-11 and CIN-D-12, which show numbers.
- **Few specialists inside Hamilton County with a street address.** Ohio Valley Pure Water has none; Butler and Tri-State are in Butler and Warren counties; Integrity is in Dayton.
- **Missing details:** owner not named on any row. Legal entity found for only two rows.
- **Reviews:** not opened.

## Exclusions

- **Cincinnati Water Treatment (cincinnatiwatertreatment.com):** says it is a service connecting homeowners with independent contractors (lead generation).
- **Wellness Water Filtration Systems Cincinnati:** site refused automated access; the same name family was excluded in Louisville as a templated lead-generation site.
- **Pure Way Filtration (Cincinnati page):** national distributor network page with no local address or staff.
- **Ultra Pure Water Technologies:** commercial, industrial and medical only.
- **True Flow Services (Florence, KY):** Cincinnati is not in its listed service area.
- **Five Star Cincinnati Plumbing and Cincinnati Plumbing & Drain:** same company group and same license number as CIN-D-10; counted once.
- **Kinetico of Vincennes:** surfaced in a Kinetico search; serves Vincennes, IN only.
- **Leaf Home Water Solutions:** national company.
- **Nixco Plumbing, Halpin Plumbing, Anderson Hills Plumbing, Steve Jones Plumbing, LAUX Plumbing, Pete the Plumber, Tarvin Plumbing:** names from directories only; own sites not checked for water treatment.
