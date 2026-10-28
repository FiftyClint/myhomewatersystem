# Next 10 markets after the 11 live (2026-10-28)

Same rule as tam-ranking.md: cities ranked by owner-occupied households (Census ACS 2024 1-year, table B25003, B25003_002E, place level), kept only where the main water utility publishes hardness of 121 mg/L or more (USGS: hard 121-180, very hard over 180; 1 gpg = 17.1 mg/L). The live 11 and every city inside a live market (Henderson, Mesa, Chandler, Gilbert, Scottsdale, Kansas City KS, Overland Park, Olathe, New Braunfels) are excluded. Household counts came from the Census data.census.gov table API (ACSDT1Y2024.B25003): one pull of all US places, cross-checked by single-place queries for Oklahoma City, Washington, Tucson, Omaha, Milwaukee, Wichita, Aurora, Tampa and St. Petersburg (all matched), and the all-places figures also match every city already in tam-ranking.csv. api.census.gov, censusreporter.org and the www2.census.gov .dat file could not be read (proxy block, robots block, binary). Hardness comes only from each utility's own report, FAQ or plant analysis; no third-party maps. Every row has its URL in tam-ranking-next.csv.

## Top 10

| Rank | City | Owner households | Hardness as published | Class | Period | Domain owned |
|---|---|---|---|---|---|---|
| 1 | Louisville KY | 162,462 | 128 ppm avg | hard | 2025 | no |
| 2 | El Paso TX | 151,778 | about 175 mg/L avg (utility sheet, not CCR) | hard | undated | no |
| 3 | Washington DC | 134,836 | 139 ppm avg (84-194) | hard | 2025 | yes |
| 4 | Tucson AZ | 122,246 | "hard to very hard" on the utility's 120+ scale, no number | hard to very hard | undated | yes |
| 5 | Omaha NE | 115,172 | plant avgs 133 / 141 / 133 mg/L | hard | Sep 2026 | no |
| 6 | Milwaukee WI | 102,128 | 137 mg/L (112-142) | hard | undated | no |
| 7 | Wichita KS | 97,826 | 150 ppm (2023 sample); 131 mg/L 2018 avg | hard | 2023 | no |
| 8 | Aurora CO | 94,167 | 136 ppm avg (87-198) | hard | 2025 | no |
| 9 | Tampa FL | 88,014 | 185 mg/L avg | very hard | 2024 | yes |
| 10 | St. Petersburg FL | 76,831 | 158 mg/L avg | hard | 2025 | no |

Next qualifiers (rank 11+): Lexington KY 76,373 (149-161 ppm by plant), Lincoln NE 73,544 (192 ppm), Fort Wayne IN 70,514 (129 mg/L, 2021 data), Corpus Christi TX 69,525 (236 ppm), St. Louis MO 68,310, Madison WI 58,600, Cincinnati OH 58,544, Riverside CA 57,170, Orlando FL 51,045, Allentown PA 19,384. The last six are owned-domain cities.

## Flagged and not found

The ranking is fragile at the top and at rank 10. Jacksonville (240,209) and Oklahoma City (165,385) would both rank above Louisville if hard, and neither publishes a figure the research could reach: every jea.com page, including /hardness and the report PDF, served a human check (not worked), and OKC's CCRs for 2017, 2019, 2021 and 2025 data carry no hardness line. New Orleans (83,242), Port St. Lucie (77,663) and Arlington TX (77,401) sit between Tampa and St. Petersburg with no published figure found; any one of them could take rank 10. Miami and McAllen (owned) publish no hardness in their 2025 reports. Durham and Chesapeake were not resolved.

Flagged rather than dropped: Dallas avg 119 mg/L (2003, the newest report with a figure), Cleveland avg 117, Fort Worth 76.5-175 range only, Albuquerque "moderately hard to hard" with no number, Colorado Springs soft at some plants and hard at others (2021), Tulsa 140 ppm at A.B. Jewell and 89 at Mohawk, Long Beach 220 ppm in the MWD zone and 76 in the blended zone. Tucson is ranked on the utility's class statement because no number was found; its interactive ArcGIS map was not read.

Out (checked): Virginia Beach, Memphis, Raleigh, Sacramento, Fresno, Bakersfield, Oakland, Cape Coral. Atlanta, Austin, Baltimore, Boston, Charlotte, Denver, Detroit, Minneapolis, Nashville, New York, Pittsburgh, San Francisco, Seattle and Jersey City stay out from prior research and were not rechecked. Places below St. Louis (Anchorage, Honolulu, Boise, Plano, Greensboro, St. Paul, Toledo, North Las Vegas, Reno and others) were not checked for hardness; they cannot reach the top 10.

## Could not reach

api.census.gov, www2.census.gov and censusreporter.org (proxy or robots block; the B25003 .dat file returned as binary); jea.com (human check); Wichita's 2025 and 2026 report links (site error); Tucson's hardness map; the Omaha 2025 CCR hardness row (text extraction too jumbled to map, so plant analyses were used instead).
