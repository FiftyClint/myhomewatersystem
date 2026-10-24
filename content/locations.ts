// City pages. Each city belongs to one market (a dealer territory) and shows its utility's water facts.
// Every fact is copied as published, with its period and source, and has an evidence ID in
// docs/research/evidence.csv. No fact from one utility is shown for another utility's area.
// Status "draft" until a named reviewer checks the facts against the sources.

export interface WaterFact {
  utility: string;
  label: string; // e.g. "Total hardness"
  value: string; // as published, units as published
  period: string;
  source_title: string;
  source_url: string;
  evidence_ids: string[];
}

export interface CityLocation {
  slug: string;
  name: string;
  state: string;
  market_id: string;
  intro: string; // one or two plain sentences, no claims beyond the facts below
  facts: WaterFact[];
  notes: string[]; // sourced context: source water, disinfectant, conflicts between sources
  status: 'draft' | 'approved';
  reviewer: string | null;
}

const KC_WATER_TOPICS = 'https://www.kcwater.us/water-quality/water-quality-topics/';
const BPU_2026 = 'https://bpu.com/wp-content/uploads/2026/08/2026-Water-Quality-Report-FINAL-newformat.pdf';
const WATERONE_2026 = 'https://www.waterone.org/ArchiveCenter/ViewFile/Item/177';
const INDEPENDENCE_2025 = 'https://www.independencemo.gov/sites/default/files/2026-06/2025%20CCR_Draft%20Final.pdf';

const LVVWD_2026 = 'https://www.lvvwd.com/assets/pdf/water-quality-report-las-vegas-valley-current.pdf';
const HENDERSON_WQR = 'https://www.cityofhenderson.com/government/departments/utility-services/water-quality/water-quality-report';
const SAWS_FAQ = 'https://www.saws.org/your-water/water-quality/saws-water-quality-concerns/faqs/';
const MESA_2025 = 'https://www.mesaaz.gov/files/content/public/v/16/utilities/water-wastewater/water-quality/english-water-quality-report-2025.pdf';
const CHANDLER_2025 = 'https://www.chandleraz.gov/sites/default/files/departments/water/City-of-Chandler-2025-Drinking-Water-Quality-Consumer-Confidence-Report.pdf';
const GILBERT_2025 = 'https://www.gilbertaz.gov/home/showpublisheddocument/54483/639183476630708025';
const SCOTTSDALE_2026 = 'https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/water/water-quality/annual-reports/2026-water-quality-report.pdf?sfvrsn=18a67596_1';

export const LOCATIONS: CityLocation[] = [
  {
    slug: 'kansas-city', name: 'Kansas City', state: 'MO/KS', market_id: 'kansas-city', status: 'draft', reviewer: null,
    intro: 'The Kansas City area is served by several water utilities, and their published hardness differs a lot. Check which utility appears on your water bill.',
    facts: [
      { utility: 'BPU (Kansas City, KS)', label: 'Total hardness', value: '280 ppm (16.4 grains per gallon)', period: 'Jan.-Dec. 2025',
        source_title: 'BPU 2026 Water Quality Report', source_url: BPU_2026, evidence_ids: ['BPU-U-04', 'BPU-U-05'] },
      { utility: 'WaterOne (Johnson County, KS)', label: 'Total hardness', value: 'Average 135 ppm, range 110-157 ppm', period: 'Calendar year 2025',
        source_title: 'WaterOne Water Quality Report 2026', source_url: WATERONE_2026, evidence_ids: ['WO-U-05'] },
      { utility: 'Independence, MO', label: 'Total hardness', value: '123 mg/L as calcium carbonate (single sample)', period: 'Sampled May 6, 2024',
        source_title: 'Independence 2025 Annual Water Quality Report', source_url: INDEPENDENCE_2025, evidence_ids: ['IND-U-05'] },
      { utility: 'KC Water (Kansas City, MO)', label: 'Average hardness', value: '100 mg/L (5-6 grains per gallon)', period: 'Undated web page',
        source_title: 'KC Water water quality topics', source_url: KC_WATER_TOPICS, evidence_ids: ['KC-U-07'] },
    ],
    notes: [
      "KC Water's figures do not agree across its own documents: an undated web page gives an average of 100 mg/L, its 2022 report gives a range of 84.6-136 ppm for 2021, and its latest report does not list hardness for its own supply.",
      'WaterOne, BPU and Independence use chloramine to disinfect water in their distribution systems.',
    ],
  },
  {
    slug: 'mesa', name: 'Mesa', state: 'AZ', market_id: 'east-valley', status: 'draft', reviewer: null,
    intro: "Mesa's water service is split into three zones, and hardness depends on which zone you are in.",
    facts: [
      { utility: 'City of Mesa', label: 'Average hardness, City Zone', value: 'About 12 grains per gallon', period: 'Calendar year 2025',
        source_title: 'Mesa 2025 Water Quality Consumer Confidence Report', source_url: MESA_2025, evidence_ids: ['MESA-U-02'] },
      { utility: 'City of Mesa', label: 'Average hardness, Eastern and Southern Zones', value: '16 grains per gallon', period: 'Calendar year 2025',
        source_title: 'Mesa 2025 Water Quality Consumer Confidence Report', source_url: MESA_2025, evidence_ids: ['MESA-U-03'] },
    ],
    notes: [
      'The City Zone gets Salt River Project water from the Salt and Verde Rivers. The Eastern and Southern Zones get Central Arizona Project water from the Colorado River. Groundwater wells supply all zones.',
      'Mesa disinfects with chlorine.',
      "Mesa's undated water quality concerns page gives a wider range of 12 to 22 grains per gallon depending on the source serving the area.",
    ],
  },
  {
    slug: 'chandler', name: 'Chandler', state: 'AZ', market_id: 'east-valley', status: 'draft', reviewer: null,
    intro: 'Chandler blends Salt River, Verde River and Colorado River surface water with water from city wells.',
    facts: [
      { utility: 'City of Chandler', label: 'Total hardness', value: '173-288 mg/L (10.1-16.8 grains per gallon)', period: 'Calendar year 2025',
        source_title: 'Chandler 2025 Drinking Water Quality Consumer Confidence Report', source_url: CHANDLER_2025, evidence_ids: ['CHA-U-02'] },
    ],
    notes: [
      'Chandler disinfects with chlorine. Its 2025 residual averaged 0.93 ppm.',
      "Chandler's undated water quality FAQ gives a different figure: an average of 16.5 grains per gallon within a range of 5 to 20.",
    ],
  },
  {
    slug: 'gilbert', name: 'Gilbert', state: 'AZ', market_id: 'east-valley', status: 'draft', reviewer: null,
    intro: 'Gilbert treats Salt River Project and Central Arizona Project canal water at two plants and adds water from town wells.',
    facts: [
      { utility: 'Town of Gilbert', label: 'Total hardness', value: 'Average 10.79 grains per gallon (184.44 mg/L), range 6.61-17.54 grains per gallon', period: 'Calendar year 2025',
        source_title: 'Gilbert 2025 Annual Drinking Water Quality Report', source_url: GILBERT_2025, evidence_ids: ['GIL-U-02', 'GIL-U-03'] },
    ],
    notes: [
      'Gilbert disinfects with chlorine. Its 2025 residual averaged 0.92 ppm.',
    ],
  },
  {
    slug: 'scottsdale', name: 'Scottsdale', state: 'AZ', market_id: 'east-valley', status: 'draft', reviewer: null,
    intro: 'Most of Scottsdale\'s water comes from the Central Arizona Project, and hardness varies by part of the city.',
    facts: [
      { utility: 'City of Scottsdale', label: 'Approximate hardness, south of Indian School Rd', value: '13-15 grains per gallon (230-260 mg/L)', period: 'Calendar year 2025',
        source_title: 'Scottsdale 2026 Water Quality Report', source_url: SCOTTSDALE_2026, evidence_ids: ['SCO-U-02'] },
      { utility: 'City of Scottsdale', label: 'Approximate hardness, Indian School Rd to Chaparral Rd', value: '13-17 grains per gallon (215-285 mg/L)', period: 'Calendar year 2025',
        source_title: 'Scottsdale 2026 Water Quality Report', source_url: SCOTTSDALE_2026, evidence_ids: ['SCO-U-03'] },
      { utility: 'City of Scottsdale', label: 'Approximate hardness, north of Chaparral Rd', value: '13-17 grains per gallon (230-290 mg/L)', period: 'Calendar year 2025',
        source_title: 'Scottsdale 2026 Water Quality Report', source_url: SCOTTSDALE_2026, evidence_ids: ['SCO-U-04'] },
    ],
    notes: [
      "Scottsdale's 2025 supply was 71 percent Central Arizona Project, 13 percent Salt River Project, 8 percent groundwater and 8 percent recycled water.",
      'Scottsdale disinfects with chlorine. Its 2025 residual averaged 0.64 ppm.',
      "The city's undated hard water fact sheet lists higher figures for the same areas, up to 22-25 grains per gallon south of Indian School Rd. The current annual report figures are shown above.",
    ],
  },
  {
    slug: 'las-vegas', name: 'Las Vegas', state: 'NV', market_id: 'las-vegas-valley', status: 'draft', reviewer: null,
    intro: 'Most homes in metropolitan Las Vegas get water from the Las Vegas Valley Water District.',
    facts: [
      { utility: 'Las Vegas Valley Water District', label: 'Hardness', value: '280 parts per million (16 grains per gallon)', period: 'Calendar year 2025',
        source_title: 'LVVWD 2026 Water Quality Report', source_url: LVVWD_2026, evidence_ids: ['LVVWD-U-02'] },
    ],
    notes: [
      'About 90 percent of the water comes from Lake Mead on the Colorado River and about 10 percent from deep groundwater wells.',
      'The district disinfects with chlorine. Its 2025 free chlorine residual averaged 0.99 ppm.',
      "One section of the district's water quality FAQ page gives 291 ppm (17 grains per gallon). The current annual report gives 280 ppm.",
    ],
  },
  {
    slug: 'henderson', name: 'Henderson', state: 'NV', market_id: 'las-vegas-valley', status: 'draft', reviewer: null,
    intro: 'The City of Henderson delivers water that comes from the Colorado River through Lake Mead.',
    facts: [
      { utility: 'City of Henderson', label: 'Hardness', value: 'Typically 304 parts per million (18 grains per gallon)', period: '2026 report (2025 data)',
        source_title: 'City of Henderson Water Quality Report', source_url: HENDERSON_WQR, evidence_ids: ['HEN-U-02'] },
    ],
    notes: [
      'The city describes its water as very hard and suggests setting a softener between 16 and 19 grains per gallon.',
      "Henderson's 2025 free chlorine residual averaged 0.82 ppm.",
    ],
  },
  {
    slug: 'san-antonio', name: 'San Antonio', state: 'TX', market_id: 'san-antonio-area', status: 'draft', reviewer: null,
    intro: 'San Antonio Water System (SAWS) serves about 2 million people in Bexar County and parts of Medina and Atascosa counties.',
    facts: [
      { utility: 'San Antonio Water System', label: 'Typical hardness', value: '15 to 20 grains per gallon', period: 'Undated FAQ page',
        source_title: 'SAWS water quality FAQs', source_url: SAWS_FAQ, evidence_ids: ['SAWS-U-02'] },
    ],
    notes: [
      "SAWS water comes from the Edwards, Carrizo, Simsboro, Trinity and Wilcox aquifers, and some areas also get surface water from Canyon Lake.",
      "SAWS's 2026 annual report does not list hardness. It reports a free chlorine residual averaging 1.46 ppm in 2025.",
    ],
  },
  {
    slug: 'new-braunfels', name: 'New Braunfels', state: 'TX', market_id: 'san-antonio-area', status: 'draft', reviewer: null,
    intro: 'New Braunfels Utilities treats most of its water from the Guadalupe River and also uses Edwards and Trinity aquifer groundwater.',
    facts: [],
    notes: [
      "NBU's 2025 water quality report does not publish a hardness figure, and we have not found a current one on its site.",
    ],
  },
];

export const locationBySlug = (slug: string): CityLocation | undefined => LOCATIONS.find((l) => l.slug === slug);
export const locationsInMarket = (marketId: string): CityLocation[] => LOCATIONS.filter((l) => l.market_id === marketId);
