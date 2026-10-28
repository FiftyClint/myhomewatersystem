// Filtration facts for the city sites Clint owns in the filtration screen (docs/research/filtration-screen.md):
// lead service line counts from each utility's inventory and PFOA/PFOS results from EPA's UCMR 5 data.
// Same rules as content/locations.ts: every figure is copied as published, with its period and source,
// and has an evidence ID in docs/research/evidence.csv. No figure from one utility is shown for another.
// Draft until a named reviewer checks the figures against the sources.

import type { LocalDetail } from './local-details.ts';

export interface LeadLineFact {
  utility: string;
  lead: number | null; // lines listed as lead
  grr: number | null; // galvanized lines requiring replacement
  unknown: number | null; // lead status unknown
  total: number | null; // all service lines in the inventory; null when the source gives none
  period: string;
  source_title: string;
  source_url: string;
  evidence_ids: string[];
}

export interface PfasFact {
  utility: string;
  system: string; // the system name as EPA lists it
  samples: number; // samples per chemical in UCMR 5
  years: string; // collection years
  pfoa_max_ppt: number | null; // highest PFOA result, null when no result reached the 4 ppt reporting level
  pfoa_where?: string;
  pfos_max_ppt: number | null;
  pfos_where?: string;
  evidence_ids: string[];
}

export interface CityFiltration {
  lead_lines: LeadLineFact[];
  pfas: PfasFact;
  notes: string[]; // sourced context: scope of the inventory, conflicts between sources
  checked_on: string;
}

export const SDWIS_LSI = 'https://sdwis.epa.gov/ords/sfdw_pub/r/sfdw/sdwis_fed_reports_public/service-line-inventory';
const SDWIS_TITLE = 'EPA SDWIS Service Line Inventory dashboard';
const SDWIS_PERIOD = 'As reported to EPA, 2026 Q3';
export const UCMR5 = { title: 'EPA UCMR 5 occurrence data', url: 'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule' };
export const UCMR5_MRL_PPT = 4; // UCMR 5 minimum reporting level for PFOA and PFOS: 0.004 ug/L in the data file

// General statements from EPA, used on every filtration city's page inside city-specific sentences.
export const FILTRATION_GENERAL: Record<'pfas_mcl' | 'pfas_filters' | 'lead_filters', LocalDetail> = {
  pfas_mcl: { text: 'EPA set enforceable limits of 4.0 parts per trillion each for PFOA and PFOS. Water systems have until 2029 to meet them, and a May 18, 2026 proposal would let systems ask for two more years, to 2031.',
    source_title: 'EPA, Per- and Polyfluoroalkyl Substances (PFAS)', source_url: 'https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas', evidence_ids: ['GEN-F-01'] },
  pfas_filters: { text: 'EPA advises choosing a home filter certified to NSF/ANSI 53 or NSF/ANSI 58 for PFAS reduction, and names activated carbon, reverse osmosis and ion exchange as the types that can reduce PFAS.',
    source_title: 'EPA, Reducing PFAS in Your Drinking Water with a Home Filter', source_url: 'https://www.epa.gov/cleanups/reducing-pfas-your-drinking-water-home-filter', evidence_ids: ['GEN-F-02'] },
  lead_filters: { text: "EPA's consumer tool points to point-of-use and pitcher filters certified to both NSF/ANSI 53 and 42 for lead reduction to 5 ppb or less.",
    source_title: 'EPA, Consumer Tool for Identifying Point-of-Use and Pitcher Filters Certified to Reduce Lead in Drinking Water', source_url: 'https://www.epa.gov/water-research/consumer-tool-identifying-point-use-and-pitcher-filters-certified-reduce-lead', evidence_ids: ['GEN-F-03'] },
};

const sdwis = (utility: string, lead: number, grr: number, unknown: number, total: number, id: string): LeadLineFact =>
  ({ utility, lead, grr, unknown, total, period: SDWIS_PERIOD, source_title: SDWIS_TITLE, source_url: SDWIS_LSI, evidence_ids: [id] });

const none = (utility: string, system: string, samples: number, years: string, id: string): PfasFact =>
  ({ utility, system, samples, years, pfoa_max_ppt: null, pfos_max_ppt: null, evidence_ids: [id] });

export const FILTRATION: Record<string, CityFiltration> = {
  'new-york': {
    lead_lines: [sdwis('NYC Department of Environmental Protection', 120931, 3266, 124917, 820465, 'NYC-F-01')],
    pfas: none('NYC Department of Environmental Protection', 'NEW YORK CITY SYSTEM', 16, '2023 to 2025', 'NYC-F-02'),
    notes: [
      "The New York State Department of Health's inventory page for the New York City system, certified December 29, 2025, lists 817,567 lines, 117,561 lead, 3,050 galvanized requiring replacement and 114,473 unknown, with zero on the utility-owned side.",
      "New York City's 2025 Lead Compliance Report gives 2024 figures of 857,000 private service lines, 120,163 containing lead and 123,758 unknown.",
    ],
    checked_on: '2026-10-28',
  },
  'detroit': {
    lead_lines: [sdwis('Detroit Water and Sewerage Department', 80595, 120, 39073, 251531, 'DET-F-01')],
    pfas: none('Detroit Water and Sewerage Department', 'DETROIT CITY OF', 16, '2023', 'DET-F-02'),
    notes: [
      "DWSD's 2025 water quality report gives rounder and different figures: about 75,000 lead lines and about 48,000 unknown, out of about 311,000 lines.",
    ],
    checked_on: '2026-10-28',
  },
  'baltimore': {
    lead_lines: [{ utility: 'Baltimore City Department of Public Works', lead: 9193, grr: 459, unknown: 58508, total: null, period: 'DPW update of September 24, 2025',
      source_title: 'Update on Water Service Line Inventory Notification Letters (Baltimore City DPW)', source_url: 'https://www.baltimorecity.gov/publicworks/news-media/update-on-water-service-line-inventory-notification-letters', evidence_ids: ['BAL-F-01'] }],
    pfas: none('Baltimore City Department of Public Works', 'CITY OF BALTIMORE', 12, '2024 to 2025', 'BAL-F-02'),
    notes: [
      "DPW's September 2025 update gives no total number of lines.",
      "EPA's SDWIS dashboard still lists 47 lead and 385 galvanized-requiring-replacement lines for Baltimore's system, the sum of the city and county figures in DPW's initial October 2024 inventory.",
    ],
    checked_on: '2026-10-28',
  },
  'denver': {
    lead_lines: [sdwis('Denver Water', 15826, 848, 34057, 311392, 'DEN-F-01')],
    pfas: none('Denver Water', 'DENVER WATER BOARD', 15, '2023 to 2025', 'DEN-F-02'),
    notes: [
      "Denver Water's Lead Reduction Program Annual Report 2025 counts differently: as of December 31, 2025 it lists 42,882 confirmed lead service lines, including 7,137 galvanized requiring replacement and 36,819 already replaced, out of 311,396.",
    ],
    checked_on: '2026-10-28',
  },
  'dallas': {
    lead_lines: [sdwis('Dallas Water Utilities', 0, 6, 258104, 320491, 'DAL-F-01')],
    pfas: { utility: 'Dallas Water Utilities', system: 'DALLAS WATER UTILITY', samples: 12, years: '2023 to 2024',
      pfoa_max_ppt: 6.3, pfoa_where: 'Bachman plant tap, October 16, 2023', pfos_max_ppt: 5.1, pfos_where: 'Bachman plant tap, March 8, 2023', evidence_ids: ['DAL-F-02', 'DAL-F-03'] },
    notes: [
      'Most Dallas lines are listed with an unknown material, so the inventory does not yet say how many are lead.',
      'Four PFOA results at Dallas plants reached 4 ppt or more, three at Bachman and one at Elm Fork. Two PFOS results did, both at Bachman.',
    ],
    checked_on: '2026-10-28',
  },
  'fort-worth': {
    lead_lines: [sdwis('Fort Worth Water', 0, 32590, 0, 300778, 'FTW-F-01')],
    pfas: { utility: 'Fort Worth Water', system: 'CITY OF FORT WORTH', samples: 20, years: '2023 to 2024',
      pfoa_max_ppt: 8.3, pfoa_where: 'South Holly plant, April 10, 2023', pfos_max_ppt: 7.3, pfos_where: 'North Holly plant, April 10, 2023', evidence_ids: ['FTW-F-02', 'FTW-F-03'] },
    notes: [
      'Every Fort Worth line the inventory flags is galvanized requiring replacement. It lists no lead and no unknown lines.',
      'Eight of 20 PFOA samples and eight of 20 PFOS samples at the North and South Holly plants were at or above 4 ppt.',
    ],
    checked_on: '2026-10-28',
  },
  'boston': {
    lead_lines: [sdwis('Boston Water and Sewer Commission', 2184, 265, 4180, 99945, 'BOS-F-01')],
    pfas: none('Boston Water and Sewer Commission', 'BOSTON WATER AND SEWER COMMISSION (MWRA)', 4, '2024', 'BOS-F-02'),
    notes: [
      "BWSC's water service map page links an address-level inventory dated October 16, 2024. Its own pages give no summary counts to compare.",
    ],
    checked_on: '2026-10-28',
  },
  'minneapolis': {
    lead_lines: [sdwis('Minneapolis Public Works Water', 38341, 132, 962, 100414, 'MSP-F-01')],
    pfas: none('Minneapolis Public Works Water', 'Minneapolis', 8, '2023 to 2024', 'MSP-F-02'),
    notes: [
      'A city bulletin of November 25, 2024 cites more than 38,000 remaining lead lines, about 40,000 properties, which agrees with the EPA figure.',
    ],
    checked_on: '2026-10-28',
  },
  'st-louis': {
    lead_lines: [sdwis('City of St. Louis Water Division', 9990, 525, 64378, 105873, 'STL-F-01')],
    pfas: none('City of St. Louis Water Division', 'ST LOUIS CITY PWS', 8, '2024', 'STL-F-02'),
    notes: [
      "The city's October 10, 2024 release gave rounded figures of about 9,000 lead and 58,000 unknown out of about 113,000 lines.",
    ],
    checked_on: '2026-10-28',
  },
  'pittsburgh': {
    lead_lines: [sdwis('Pittsburgh Water', 16165, 2250, 2361, 80528, 'PIT-F-01')],
    pfas: none('Pittsburgh Water', 'PITTSBURGH WATER & SEWER AUTH', 4, '2024', 'PIT-F-02'),
    notes: [
      "Pittsburgh Water's October 2024 page described about 83,000 lines with about a third unconfirmed. That does not match the 2,361 unknown lines in the EPA listing, and we have not found why.",
    ],
    checked_on: '2026-10-28',
  },
  'cincinnati': {
    lead_lines: [sdwis('Greater Cincinnati Water Works', 34673, 44, 45, 238335, 'CIN-F-01')],
    pfas: { utility: 'Greater Cincinnati Water Works', system: 'CINCINNATI PUBLIC WATER SYSTEM', samples: 6, years: '2023 to 2024',
      pfoa_max_ppt: null, pfos_max_ppt: 6.1, pfos_where: 'Bolton plant, November 6, 2023', evidence_ids: ['CIN-F-02'] },
    notes: [
      "The EPA figures cover Greater Cincinnati Water Works' whole system, which serves areas beyond the city.",
      'Two PFOS results at the Bolton plant reached 4 ppt or more, 4.2 ppt in June 2023 and 6.1 ppt in November 2023. No PFOA result did.',
    ],
    checked_on: '2026-10-28',
  },
};

export const filtrationOf = (slug: string): CityFiltration | undefined => FILTRATION[slug];
