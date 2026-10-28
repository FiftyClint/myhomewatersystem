# Filtration screen (2026-10-28)

Clint asked for a filtration screen next to the hard-water screen (2026-10-28, "Add a filtration screen"). The hard-water screen measures softener demand and drops soft-water cities such as New York (DEP 2025 report: 32 mg/L). This screen ranks filtration demand on its own terms. Research only: nothing built, bought or contacted.

## Method

- Rank by owner-occupied households in homes built before 1960: Census ACS 2024 1-year, table B25036 (tenure by year structure built), place level, B25036_010E + _011E + _012E (owner, built 1950-59, 1940-49, 1939 or earlier). Pulled from the data.census.gov table API by the "Filtration screen data" workflow; owner totals (B25036_002E) match B25003 in tam-ranking.csv for DC, Louisville and Milwaukee.
- A city qualifies only with at least one water driver from primary data:
  - Lead: lead plus galvanized-requiring-replacement lines are at least 1% of the utility's service lines, from EPA's SDWIS Service Line Inventory dashboard (2026Q3 submission, state-reported per system): https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis_fed_reports_public/service-line-inventory
  - PFAS: a PFOA or PFOS result at or above 4.0 ppt in EPA's UCMR 5 occurrence data (https://www.epa.gov/system/files/other-files/2023-08/ucmr5-occurrence-data.zip, downloaded 2026-10-28). 4.0 ppt is EPA's MCL for both (https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas). A single sample at that level is not a violation; compliance runs on an annual average.
- Candidates: the 20 cities with the most pre-1960 owner households that are not in the live 11 or the next 10 hard-water markets.

## Judgment calls

- 1960 as the cutoff for "older home" is a proxy for lead pipe and old plumbing risk. It counts homes, not pipes.
- The 1% lead+GRR floor is a cutoff chosen for this screen. It drops San Francisco (0.4%) and Oakland/EBMUD (1.0% rounded, 0.96% actual).
- Lead-status-unknown lines are shown but do not qualify a city on their own.
- Chloramine, taste and odor, and other violations were not scored. They are harder to source evenly across utilities.
- SDWIS counts for Cleveland, Columbus, Cincinnati and possibly St. Paul cover the whole utility, suburbs included. EPA notes non-lead counts may be undercounted until states must report them (Nov 1, 2027).

## Result

See filtration-screen.csv (ranks 1-15 and the five dropped) and filtration-lsl.csv (per-utility lead line rows with utility-page comparisons).

Not checked: cities ranked below 20 on pre-1960 owner households. Toledo, Memphis, Jacksonville, Atlanta, Nashville, New Orleans (UCMR 5 PFOA 4.1, PFOS 4.5 across its two plants) and Sacramento (PFOA 17.3, PFOS 41.4) could qualify.
