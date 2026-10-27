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
  // The published hardness span in mg/L (ppm), low and high, used for the USGS class and the scale on
  // each page. Copied from the facts above; where a utility publishes grains per gallon only, it is
  // converted at 17.1 mg/L per grain and scale_converted is true. null when nothing is published.
  scale_mgl: [number, number] | null;
  scale_converted?: boolean;
  checked_on: string; // YYYY-MM-DD the sources were last read
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
const PHOENIX_2025 = 'https://phoenix.gov/waterqualityreport';

export const LOCATIONS: CityLocation[] = [
  {
    slug: 'kansas-city', name: 'Kansas City', state: 'MO/KS', market_id: 'kansas-city', scale_mgl: [100, 280], checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'mesa', name: 'Mesa', state: 'AZ', market_id: 'east-valley', scale_mgl: [205, 274], scale_converted: true, checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'chandler', name: 'Chandler', state: 'AZ', market_id: 'east-valley', scale_mgl: [173, 288], checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'gilbert', name: 'Gilbert', state: 'AZ', market_id: 'east-valley', scale_mgl: [113, 300], scale_converted: true, checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'scottsdale', name: 'Scottsdale', state: 'AZ', market_id: 'east-valley', scale_mgl: [215, 290], checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'las-vegas', name: 'Las Vegas', state: 'NV', market_id: 'las-vegas-valley', scale_mgl: [280, 280], checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'henderson', name: 'Henderson', state: 'NV', market_id: 'las-vegas-valley', scale_mgl: [304, 304], checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'san-antonio', name: 'San Antonio', state: 'TX', market_id: 'san-antonio-area', scale_mgl: [257, 342], scale_converted: true, checked_on: '2026-10-26', status: 'draft', reviewer: null,
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
    slug: 'new-braunfels', name: 'New Braunfels', state: 'TX', market_id: 'san-antonio-area', scale_mgl: null, checked_on: '2026-10-26', status: 'draft', reviewer: null,
    intro: 'New Braunfels Utilities treats most of its water from the Guadalupe River and also uses Edwards and Trinity aquifer groundwater.',
    facts: [],
    notes: [
      "NBU's 2025 water quality report does not publish a hardness figure, and we have not found a current one on its site.",
    ],
  },
  {
    slug: 'phoenix', name: 'Phoenix', state: 'AZ', market_id: 'phoenix', scale_mgl: [172, 302], checked_on: '2026-10-26', status: 'draft', reviewer: null,
    intro: 'Phoenix gets almost all of its water from rivers and lakes, delivered through canals, and a small share from city wells.',
    facts: [
      { utility: 'City of Phoenix', label: 'Total hardness', value: '172-302 ppm (10-17.6 grains per gallon), range only', period: 'Calendar year 2025',
        source_title: 'City of Phoenix 2025 Water Quality Report', source_url: PHOENIX_2025, evidence_ids: ['PHX-U-02'] },
    ],
    notes: [
      'Water from the Salt and Verde Rivers is delivered through the Salt River Project canal network. About 20 city wells supplied about two percent of the water.',
      'Phoenix disinfects with chlorine.',
    ],
  },
  // Added 2026-10-27 from each utility's own published documents. Draft until a reviewer checks them.
  {
    slug: 'allentown', name: 'Allentown', state: 'PA', market_id: 'allentown', scale_mgl: [180, 284], scale_converted: true, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Lehigh County Authority supplies Allentown from two springs, the Little Lehigh Creek and the Lehigh River.',
    facts: [
      { utility: 'Lehigh County Authority', label: 'Total hardness', value: 'Average 15.0 grains per gallon, range 10.5-16.6 grains per gallon', period: 'Calendar year 2025',
        source_title: 'Allentown Division, PWSID: 3390024, Annual Water Quality Report for 2025', source_url: 'https://lcawaterworks.org/wp-content/uploads/ALD.pdf', evidence_ids: ['ALN-U-01'] },
    ],
    notes: [
      'Lehigh County Authority disinfects with chlorine.',
      'An undated Lehigh County Authority web page gives 13 grains per gallon for the Allentown Division, lower than the average in its 2025 report.',
    ],
  },
  {
    slug: 'atlanta', name: 'Atlanta', state: 'GA', market_id: 'atlanta', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The City of Atlanta Department of Watershed Management treats water from the Chattahoochee River at three plants.',
    facts: [
    ],
    notes: [
      'Atlanta disinfects with chlorine.',
      'We did not find a hardness figure in the city\'s 2023, 2024 or 2025 water quality reports.',
    ],
  },
  {
    slug: 'austin', name: 'Austin', state: 'TX', market_id: 'austin', scale_mgl: [70, 126], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Austin Water draws water from the Lower Colorado River through Lake Travis and Lake Austin and treats it at three plants.',
    facts: [
      { utility: 'Austin Water', label: 'Total hardness', value: 'Average 93 ppm (5.4 grains per gallon), range 70-126 ppm', period: 'Calendar year 2025',
        source_title: 'Water Quality Reports | Austin Water | AustinTexas.gov (2025 Consumer Confidence Report section)', source_url: 'https://www.austintexas.gov/water/programs/water-quality-reports', evidence_ids: ['AUS-U-01'] },
    ],
    notes: [
      'Austin Water uses chloramine to disinfect water in its distribution system.',
    ],
  },
  {
    slug: 'baltimore', name: 'Baltimore', state: 'MD', market_id: 'baltimore', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Baltimore City Department of Public Works supplies water from the Liberty, Loch Raven and Prettyboy reservoirs.',
    facts: [
    ],
    notes: [
      'Baltimore disinfects with chlorine.',
      'We did not find a hardness figure in the city\'s 2023, 2024 or 2025 water quality reports.',
    ],
  },
  {
    slug: 'boston', name: 'Boston', state: 'MA', market_id: 'boston', scale_mgl: [14.3, 20], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Boston Water and Sewer Commission buys treated water from the MWRA, which draws it from the Quabbin and Wachusett reservoirs.',
    facts: [
      { utility: 'MWRA (for Boston Water and Sewer Commission)', label: 'Typical total hardness', value: 'Approximately 16 mg/L, or 1 grain per gallon', period: 'Undated web page',
        source_title: 'Frequently Asked Questions About Drinking Water (MWRA)', source_url: 'https://www.mwra.com/your-water-system/drinking-water-quality/frequently-asked-questions-about-mwra-tap-water', evidence_ids: ['BOS-U-01'] },
      { utility: 'MWRA (for Boston Water and Sewer Commission)', label: 'Total hardness, monthly reading', value: '14.3 mg/L at the Carroll Water Treatment Plant', period: 'July 2026 sampling',
        source_title: 'Water Quality Update: An Analysis of July 2026 Sampling Data (MWRA)', source_url: 'https://www.mwra.com/media/file/wq-update-072026', evidence_ids: ['BOS-U-02'] },
    ],
    notes: [
      'The MWRA disinfects with chloramine.',
      'The MWRA\'s July 2026 update describes hardness as about 15 to 20 mg/L, or about 1 grain per gallon.',
    ],
  },
  {
    slug: 'charlotte', name: 'Charlotte', state: 'NC', market_id: 'charlotte', scale_mgl: [27, 35], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Charlotte Water treats water drawn from Mountain Island Lake and Lake Norman in the Catawba River basin.',
    facts: [
      { utility: 'Charlotte Water', label: 'Total hardness', value: 'Average 32 ppm, range 27-35 ppm', period: 'Calendar year 2025',
        source_title: '2025 Annual Drinking Water Quality Report (Consumer Confidence Report 2025 - Charlotte Water)', source_url: 'https://www.charlottenc.gov/files/sharedassets/cltwater/v/3/documents/water-quality/ccr/current-consumer-confidence-report.pdf', evidence_ids: ['CLT-U-01'] },
    ],
    notes: [
      'Charlotte Water disinfects with chlorine.',
      'A single September 2026 sample at the Franklin plant, posted on Charlotte Water\'s site, read 39 ppm.',
    ],
  },
  {
    slug: 'chicago', name: 'Chicago', state: 'IL', market_id: 'chicago', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The Chicago Department of Water Management draws water from Lake Michigan and treats it at two plants.',
    facts: [
    ],
    notes: [
      'Chicago disinfects with chlorine.',
      'We did not find a hardness figure in the city\'s 2023 or 2024 water quality reports.',
    ],
  },
  {
    slug: 'cincinnati', name: 'Cincinnati', state: 'OH', market_id: 'cincinnati', scale_mgl: [126, 140], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Greater Cincinnati Water Works supplies the city from the Ohio River and the Great Miami Buried Valley Aquifer.',
    facts: [
      { utility: 'Greater Cincinnati Water Works', label: 'Average hardness, Miller Plant', value: 'Average 126 mg/L (7 grains per gallon)', period: 'Undated FAQ on the page for the 2025 report',
        source_title: 'Water Quality Reports (GCWW), Frequently Asked Questions: How hard is GCWW\'s water?', source_url: 'https://www.cincinnati-oh.gov/water/water-quality-and-treatment/water-quality-reports/', evidence_ids: ['CIN-U-01'] },
      { utility: 'Greater Cincinnati Water Works', label: 'Average hardness, Bolton Plant', value: 'Average 140 mg/L (8 grains per gallon)', period: 'Undated FAQ on the page for the 2025 report',
        source_title: 'Water Quality Reports (GCWW), Frequently Asked Questions: How hard is GCWW\'s water?', source_url: 'https://www.cincinnati-oh.gov/water/water-quality-and-treatment/water-quality-reports/', evidence_ids: ['CIN-U-02'] },
    ],
    notes: [
      'Greater Cincinnati Water Works treats with ultraviolet light and chlorine.',
      'The utility does not say which plant serves which part of the city.',
    ],
  },
  {
    slug: 'dallas', name: 'Dallas', state: 'TX', market_id: 'dallas-fort-worth', scale_mgl: [92, 167], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Dallas Water Utilities supplies the city with surface water from the Elm Fork of the Trinity River and six lakes.',
    facts: [
      { utility: 'Dallas Water Utilities', label: 'Total hardness', value: 'Average 119 mg/L, range 92-167 mg/L', period: 'Calendar year 2003',
        source_title: '2003 Dallas Drinking Water Quality Report', source_url: 'https://dallascityhall.com/departments/waterutilities/DCH%20Documents/pdf/03engWQR.pdf', evidence_ids: ['DAL-U-01'] },
    ],
    notes: [
      'Dallas Water Utilities disinfects with chloramine.',
      'The newest Dallas report we found that publishes hardness covers 2003. Later reports we checked, through 2025, have no hardness line.',
    ],
  },
  {
    slug: 'washington-dc', name: 'Washington', state: 'DC', market_id: 'washington-dc', scale_mgl: [84, 194], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'DC Water buys treated drinking water from the Washington Aqueduct, which draws it from the Potomac River.',
    facts: [
      { utility: 'DC Water', label: 'Total hardness', value: 'Average 139 ppm (8 grains per gallon), range 84-194 ppm', period: 'Calendar year 2025',
        source_title: '2026 Drinking Water Quality Report (DC Water), summarizing 2025 water quality test results', source_url: 'https://www.dcwater.com/waterreport', evidence_ids: ['DCW-U-01'] },
    ],
    notes: [
      'DC Water disinfects with chloramine.',
    ],
  },
  {
    slug: 'denver', name: 'Denver', state: 'CO', market_id: 'denver', scale_mgl: [55, 124], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Denver Water supplies the city with surface water from rivers, lakes and reservoirs fed by mountain snowmelt.',
    facts: [
      { utility: 'Denver Water', label: 'Total hardness', value: 'Average 105,009 ppb, range 55,000-124,000 ppb', period: 'Calendar year 2025',
        source_title: '2026 Water Quality Report', source_url: 'https://www.denverwater.org/sites/default/files/water-quality-report-2026.pdf', evidence_ids: ['DEN-U-01'] },
      { utility: 'Denver Water', label: 'Hardness, as Denver Water describes it', value: '"Soft to moderately hard"', period: 'Undated web page',
        source_title: 'Denver Water: Water Hardness', source_url: 'https://www.denverwater.org/your-water/water-quality/water-hardness', evidence_ids: ['DEN-U-02'] },
    ],
    notes: [
      'Denver Water disinfects with chloramine.',
      'Denver Water publishes hardness in parts per billion. 1,000 ppb equals 1 ppm, so its 2025 range is 55 to 124 ppm. Its own description, soft to moderately hard, is milder than the USGS class for the top of that range.',
    ],
  },
  {
    slug: 'detroit', name: 'Detroit', state: 'MI', market_id: 'detroit', scale_mgl: [96, 142], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The Great Lakes Water Authority treats water from the Detroit River and Lake Huron, and the Detroit Water and Sewerage Department delivers it.',
    facts: [
      { utility: 'Detroit Water and Sewerage Department', label: 'Total hardness', value: 'Average 107 ppm, range 96-142 ppm', period: 'Calendar year 2025',
        source_title: 'Detroit Water Quality Report, 2025 Results (DWSD - WQR - 2025 - Final)', source_url: 'https://detroitmi.gov/sites/detroitmi.localhost/files/2026-06/DWSD%20-%20WQR%20-%202025%20-%20Final%20-1.pdf', evidence_ids: ['DET-U-01'] },
    ],
    notes: [
      'Detroit disinfects with chlorine.',
    ],
  },
  {
    slug: 'fort-worth', name: 'Fort Worth', state: 'TX', market_id: 'dallas-fort-worth', scale_mgl: [100, 171], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Fort Worth Water uses surface water from area lakes, including Lake Worth, Lake Bridgeport and Eagle Mountain Lake.',
    facts: [
      { utility: 'Fort Worth Water', label: 'Total hardness', value: '100-171 ppm (6-10 grains per gallon), range only', period: 'Calendar year 2022',
        source_title: '2022 Water Quality Report', source_url: 'https://www.fortworthtexas.gov/files/assets/public/water/documents/water-quality-reports/water-quality-report-2022.pdf', evidence_ids: ['FTW-U-01'] },
    ],
    notes: [
      'Fort Worth Water disinfects with chloramine.',
      'The newest Fort Worth report we could read covers 2022.',
    ],
  },
  {
    slug: 'houston', name: 'Houston', state: 'TX', market_id: 'houston', scale_mgl: [43.5, 229], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Houston Public Works supplies the city from the Trinity and San Jacinto rivers and from groundwater.',
    facts: [
      { utility: 'Houston Public Works', label: 'Total hardness, main system', value: 'Average 135.5 ppm, range 43.5-229 ppm', period: 'Calendar year 2025',
        source_title: 'Houston Water Quality Report | Jan - Dec 2025', source_url: 'https://www.houstonpublicworks.org/sites/g/files/nwywnm456/files/doc/003_2025_houston_water_quality_report.pdf', evidence_ids: ['HOU-U-01'] },
    ],
    notes: [
      'Houston reports both chlorine and chloramine as disinfectants, without saying which system uses which.',
      'Several smaller Houston systems, such as Kingwood, report their own hardness in the same 2025 report.',
    ],
  },
  {
    slug: 'indianapolis', name: 'Indianapolis', state: 'IN', market_id: 'indianapolis', scale_mgl: [148, 460], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Citizens Energy Group supplies Indianapolis from the White River, Fall Creek and groundwater.',
    facts: [
      { utility: 'Citizens Energy Group', label: 'Hardness', value: 'Average 317 ppm (19 grains per gallon), range 148-460 ppm', period: 'Calendar year 2025',
        source_title: '2025 Drinking Water Report (Citizens Energy Group, 2025 Water Quality Report)', source_url: 'https://info.citizensenergygroup.com/hubfs/site/water/2025%20Citizens%20Water%20Quality%20Report.pdf', evidence_ids: ['INDY-U-01'] },
    ],
    notes: [
      'Citizens Energy Group disinfects with chloramine.',
      'The same 2025 report also says hardness averages 320 mg/L in its text.',
    ],
  },
  {
    slug: 'jacksonville', name: 'Jacksonville', state: 'FL', market_id: 'jacksonville', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'JEA is the water utility for most of Jacksonville.',
    facts: [
    ],
    notes: [
      'We have not read JEA\'s water quality report yet.',
    ],
  },
  {
    slug: 'los-angeles', name: 'Los Angeles', state: 'CA', market_id: 'los-angeles', scale_mgl: [78, 280], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'LADWP serves Los Angeles from the Los Angeles Aqueduct, water bought from the Metropolitan Water District, groundwater and recycled water.',
    facts: [
      { utility: 'LADWP', label: 'Total hardness, Los Angeles Aqueduct plant', value: 'Average 103 mg/L, range 96-117 mg/L', period: 'Calendar year 2025',
        source_title: 'Drinking Water Quality Report 2025 (LADWP), Table III', source_url: 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf', evidence_ids: ['LA-U-01'] },
      { utility: 'LADWP', label: 'Total hardness, northern wells', value: 'Average 115 mg/L, range 78-151 mg/L', period: 'Calendar year 2025',
        source_title: 'Drinking Water Quality Report 2025 (LADWP), Table III', source_url: 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf', evidence_ids: ['LA-U-02'] },
      { utility: 'LADWP', label: 'Total hardness, southern wells', value: 'Average 116 mg/L, range 83-159 mg/L', period: 'Calendar year 2025',
        source_title: 'Drinking Water Quality Report 2025 (LADWP), Table III', source_url: 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf', evidence_ids: ['LA-U-03'] },
      { utility: 'LADWP', label: 'Total hardness, MWD Weymouth plant', value: 'Average 234 mg/L, range 189-280 mg/L', period: 'Calendar year 2025',
        source_title: 'Drinking Water Quality Report 2025 (LADWP), Table III', source_url: 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf', evidence_ids: ['LA-U-04'] },
      { utility: 'LADWP', label: 'Total hardness, MWD Diemer plant', value: 'Average 236 mg/L, range 191-280 mg/L', period: 'Calendar year 2025',
        source_title: 'Drinking Water Quality Report 2025 (LADWP), Table III', source_url: 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf', evidence_ids: ['LA-U-05'] },
      { utility: 'LADWP', label: 'Total hardness, MWD Jensen plant', value: 'Average 140 mg/L, range 137-142 mg/L', period: 'Calendar year 2025',
        source_title: 'Drinking Water Quality Report 2025 (LADWP), Table III', source_url: 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf', evidence_ids: ['LA-U-06'] },
    ],
    notes: [
      'In 2025 the Aqueduct supplied 44 percent and Metropolitan Water District water 52 percent.',
      'LADWP disinfects with chloramine.',
      'LADWP\'s FAQ gives older 2022 figures by area: about 8.6 grains per gallon in the San Fernando Valley and western Los Angeles, and about 16.3 in eastern Los Angeles and the Harbor.',
    ],
  },
  {
    slug: 'madison', name: 'Madison', state: 'WI', market_id: 'madison', scale_mgl: [308, 580], scale_converted: true, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Madison Water Utility pumps groundwater from a deep sandstone aquifer through wells across the city.',
    facts: [
      { utility: 'Madison Water Utility', label: 'Hardness, citywide', value: '18-20 grains per gallon', period: 'Undated FAQ',
        source_title: 'Madison Water Utility: Water Quality Frequently Asked Questions', source_url: 'https://www.cityofmadison.com/water/water-quality/faq', evidence_ids: ['MAD-U-01'] },
      { utility: 'Madison Water Utility', label: 'Hardness, Unit Well 6', value: '450 mg/L (26 grains per gallon)', period: 'Calendar year 2025',
        source_title: 'Unit Well #6 water quality report', source_url: 'https://www.cityofmadison.com/water/documents/water-quality/Well06QualityReport.pdf', evidence_ids: ['MAD-U-02'] },
      { utility: 'Madison Water Utility', label: 'Hardness, Unit Well 14', value: '580 mg/L (34 grains per gallon)', period: 'Calendar year 2025',
        source_title: 'Unit Well #14 water quality report', source_url: 'https://www.cityofmadison.com/water/documents/water-quality/Well14QualityReport.pdf', evidence_ids: ['MAD-U-03'] },
    ],
    notes: [
      'Madison disinfects with chlorine and does not use chloramine.',
      'Hardness differs from well to well. Two of the well reports we read are harder than the citywide FAQ figure.',
    ],
  },
  {
    slug: 'mcallen', name: 'McAllen', state: 'TX', market_id: 'mcallen', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'McAllen Public Utility supplies the city with surface water from the Rio Grande.',
    facts: [
    ],
    notes: [
      'McAllen Public Utility disinfects with chloramine.',
      'We did not find a hardness figure in McAllen\'s water quality reports.',
    ],
  },
  {
    slug: 'miami', name: 'Miami', state: 'FL', market_id: 'miami', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Miami-Dade Water and Sewer Department draws most of its water from the Biscayne Aquifer.',
    facts: [
    ],
    notes: [
      'Miami-Dade disinfects with chloramine.',
      'We did not find a hardness figure in Miami-Dade\'s water quality reports.',
    ],
  },
  {
    slug: 'minneapolis', name: 'Minneapolis', state: 'MN', market_id: 'minneapolis', scale_mgl: [80, 113], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Minneapolis draws its drinking water from the Mississippi River.',
    facts: [
      { utility: 'Minneapolis Water Treatment and Distribution', label: 'Total hardness, plant effluent', value: 'Average 94 ppm, range 80-113 ppm', period: 'Calendar year 2025',
        source_title: 'Plant Effluent Water Analysis, Record of data for 2025', source_url: 'https://www.minneapolismn.gov/media/-www-content-assets/documents/2025-Record-of-Data-on-new-ltrhead.pdf', evidence_ids: ['MPLS-U-01'] },
    ],
    notes: [
      'Minneapolis lists chloramine in its distribution system.',
    ],
  },
  {
    slug: 'nashville', name: 'Nashville', state: 'TN', market_id: 'nashville', scale_mgl: [88.5, 128.4], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Metro Water Services draws water from the Cumberland River and treats it at two plants.',
    facts: [
      { utility: 'Metro Water Services', label: 'Total hardness', value: '100.5 mg/L, range 88.5-128.4 mg/L', period: '2023 data, in the 2025 report',
        source_title: '2025 Consumer Confidence Report', source_url: 'https://www.nashville.gov/sites/default/files/2026-05/2025_Consumer_Confidence_Report-FINAL.pdf?ct=1777986674', evidence_ids: ['NSH-U-01'] },
      { utility: 'Metro Water Services', label: 'Calcium hardness', value: '75.3 mg/L, range 63.9-92.6 mg/L', period: 'Undated row, 2025 water quality report',
        source_title: '2025 Water Quality Report (Nashville Metro Water Service PWSID TN0000494)', source_url: 'https://www.nashville.gov/sites/default/files/2026-04/Water_Quality_Report-2025.pdf?ct=1777578711', evidence_ids: ['NSH-U-02'] },
    ],
    notes: [
      'Metro Water Services disinfects with chlorine.',
      'Metro Water Services calls Nashville\'s water moderately hard. Calcium hardness is only part of total hardness.',
    ],
  },
  {
    slug: 'new-york', name: 'New York City', state: 'NY', market_id: 'new-york', scale_mgl: [18, 100], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'New York City gets its water from reservoirs and lakes in the Catskill, Delaware and Croton watersheds.',
    facts: [
      { utility: 'NYC DEP', label: 'Total hardness', value: 'Average 32 mg/L (2 grains per gallon), range 18-100 mg/L', period: 'Calendar year 2025',
        source_title: 'New York City Drinking Water Supply and Quality Report 2025', source_url: 'https://www.nyc.gov/assets/dep/downloads/pdf/water/drinking-water/drinking-water-supply-quality-report/2025-drinking-water-supply-quality-report.pdf', evidence_ids: ['NYC-U-01'] },
    ],
    notes: [
      'NYC DEP disinfects with chlorine.',
    ],
  },
  {
    slug: 'oklahoma-city', name: 'Oklahoma City', state: 'OK', market_id: 'oklahoma-city', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'OKC Utilities draws water from the Canton, McGee Creek, Atoka, Hefner and Stanley Draper reservoirs.',
    facts: [
    ],
    notes: [
      'OKC Utilities disinfects with chloramine.',
      'We did not find a hardness figure. A 2017 city plan describes Hefner water as generally hard and Draper water as much softer.',
    ],
  },
  {
    slug: 'orlando', name: 'Orlando', state: 'FL', market_id: 'orlando', scale_mgl: [129, 129], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'OUC supplies Orlando with water from the Lower Floridan Aquifer, treated with ozone.',
    facts: [
      { utility: 'OUC', label: 'Total hardness', value: 'Average 129 ppm (7 grains per gallon)', period: 'Undated web page',
        source_title: 'Water Services (OUC)', source_url: 'https://www.ouc.com/about/water-services/', evidence_ids: ['ORL-U-01'] },
    ],
    notes: [
      'OUC disinfects with chlorine and says it does not use chloramine.',
    ],
  },
  {
    slug: 'philadelphia', name: 'Philadelphia', state: 'PA', market_id: 'philadelphia', scale_mgl: [72, 270], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The Philadelphia Water Department treats water from the Delaware and Schuylkill rivers at three plants.',
    facts: [
      { utility: 'Philadelphia Water Department', label: 'Hardness, Baxter plant', value: 'Average 101 ppm (6 grains per gallon), range 72-121 ppm', period: '2025 report year',
        source_title: '2025 Drinking Water Quality Report – Philadelphia Water Department (Hardness in Tap Water table)', source_url: 'https://water.phila.gov/2025-quality', evidence_ids: ['PHL-U-01'] },
      { utility: 'Philadelphia Water Department', label: 'Hardness, Belmont plant', value: 'Average 151 ppm (9 grains per gallon), range 99-204 ppm', period: '2025 report year',
        source_title: '2025 Drinking Water Quality Report – Philadelphia Water Department (Hardness in Tap Water table)', source_url: 'https://water.phila.gov/2025-quality', evidence_ids: ['PHL-U-02'] },
      { utility: 'Philadelphia Water Department', label: 'Hardness, Queen Lane plant', value: 'Average 169 ppm (10 grains per gallon), range 119-270 ppm', period: '2025 report year',
        source_title: '2025 Drinking Water Quality Report – Philadelphia Water Department (Hardness in Tap Water table)', source_url: 'https://water.phila.gov/2025-quality', evidence_ids: ['PHL-U-03'] },
    ],
    notes: [
      'Baxter draws from the Delaware River. Belmont and Queen Lane draw from the Schuylkill.',
      'Philadelphia disinfects with chloramine.',
    ],
  },
  {
    slug: 'pittsburgh', name: 'Pittsburgh', state: 'PA', market_id: 'pittsburgh', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Pittsburgh Water draws its drinking water from the Allegheny River.',
    facts: [
      { utility: 'Pittsburgh Water', label: 'Hardness, as Pittsburgh Water describes it', value: '"Moderately hard" (no number given)', period: 'Undated web page',
        source_title: 'Water Quality FAQ | Pittsburgh Water', source_url: 'https://www.pgh2o.com/node/5164', evidence_ids: ['PGH-U-01'] },
    ],
    notes: [
      'Pittsburgh Water disinfects with chlorine.',
    ],
  },
  {
    slug: 'riverside', name: 'Riverside', state: 'CA', market_id: 'riverside', scale_mgl: [180, 210], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Riverside Public Utilities supplies the city with groundwater from the Bunker Hill and Riverside basins.',
    facts: [
      { utility: 'Riverside Public Utilities', label: 'Hardness', value: 'Average 197 mg/L (12 grains per gallon), range 180-210 mg/L', period: 'Calendar year 2025',
        source_title: 'Riverside Public Utilities 2025 Water Quality Report', source_url: 'https://www.riversideca.gov/utilities/sites/riversideca.gov.utilities/files/pdf/water-quality/2025%20Water%20Quality%20Report.pdf', evidence_ids: ['RIV-U-01'] },
    ],
    notes: [
      'Riverside Public Utilities disinfects with chlorine.',
    ],
  },
  {
    slug: 'san-diego', name: 'San Diego', state: 'CA', market_id: 'san-diego', scale_mgl: [54.4, 285], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The City of San Diego treats water at its Alvarado, Miramar and Otay plants and also buys treated water.',
    facts: [
      { utility: 'City of San Diego Public Utilities', label: 'Total hardness, Alvarado plant', value: 'Average 237 ppm, range 203-270 ppm', period: 'Calendar year 2025',
        source_title: 'Annual Drinking Water Quality Report (2025 data)', source_url: 'https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf', evidence_ids: ['SD-U-01'] },
      { utility: 'City of San Diego Public Utilities', label: 'Total hardness, Miramar plant', value: 'Average 242 ppm, range 200-285 ppm', period: 'Calendar year 2025',
        source_title: 'Annual Drinking Water Quality Report (2025 data)', source_url: 'https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf', evidence_ids: ['SD-U-02'] },
      { utility: 'City of San Diego Public Utilities', label: 'Total hardness, Otay plant', value: 'Average 243 ppm, range 201-271 ppm', period: 'Calendar year 2025',
        source_title: 'Annual Drinking Water Quality Report (2025 data)', source_url: 'https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf', evidence_ids: ['SD-U-03'] },
      { utility: 'City of San Diego Public Utilities', label: 'Total hardness, purchased treated water', value: 'Average 145 ppm, range 54.4-232 ppm', period: 'Calendar year 2025',
        source_title: 'Annual Drinking Water Quality Report (2025 data)', source_url: 'https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf', evidence_ids: ['SD-U-04'] },
    ],
    notes: [
      'Most of the supply is imported from the Colorado River and the State Water Project.',
      'San Diego uses chloramine in its distribution system.',
    ],
  },
  {
    slug: 'san-francisco', name: 'San Francisco', state: 'CA', market_id: 'san-francisco', scale_mgl: [8.1, 112], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The SFPUC supplies San Francisco mostly from reservoirs, with Hetch Hetchy providing up to 85 percent.',
    facts: [
      { utility: 'SFPUC', label: 'Hardness', value: 'Average 62 ppm, range 8.1-112 ppm', period: 'Calendar year 2025',
        source_title: '2025 Annual Water Quality Report (City of San Francisco)', source_url: 'https://www.sfpuc.gov/vi/sites/default/files/accounts-and-services/water-quality/water-quality-en-SF-2025.pdf', evidence_ids: ['SF-U-01'] },
    ],
    notes: [
      'The SFPUC uses chloramine in its distribution system.',
    ],
  },
  {
    slug: 'seattle', name: 'Seattle', state: 'WA', market_id: 'seattle', scale_mgl: [26, 27], scale_converted: true, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Seattle Public Utilities supplies the city from two mountain sources, the Cedar River and the South Fork Tolt River.',
    facts: [
      { utility: 'Seattle Public Utilities', label: 'Hardness, Cedar distribution sample', value: '1.55 grains per gallon', period: 'Single sample, May 2026',
        source_title: 'SPU Quarterly Surface Water Analysis (May 2026), non-regulatory data', source_url: 'https://www.seattle.gov/documents/Departments/SPU/Services/Water/Analyses/SPU_Quarterly-Surface-Water-Analysis_05-20-2026.pdf', evidence_ids: ['SEA-U-01'] },
      { utility: 'Seattle Public Utilities', label: 'Hardness, Tolt distribution sample', value: '1.53 grains per gallon', period: 'Single sample, May 2026',
        source_title: 'SPU Quarterly Surface Water Analysis (May 2026), non-regulatory data', source_url: 'https://www.seattle.gov/documents/Departments/SPU/Services/Water/Analyses/SPU_Quarterly-Surface-Water-Analysis_05-20-2026.pdf', evidence_ids: ['SEA-U-02'] },
    ],
    notes: [
      'In 2025, 62 percent of the water came from the Cedar River and 38 percent from the Tolt.',
      'Seattle Public Utilities disinfects with chlorine.',
      'Seattle publishes these as informational single samples, not an annual average.',
    ],
  },
  {
    slug: 'st-louis', name: 'St. Louis', state: 'MO', market_id: 'st-louis', scale_mgl: [80, 206], checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'The St. Louis Water Division treats water from the Mississippi River at Chain of Rocks and the Missouri River at Howard Bend.',
    facts: [
      { utility: 'City of St. Louis Water Division', label: 'Total hardness', value: 'Average 129 ppm, range 80-206 ppm', period: 'Calendar year 2025',
        source_title: 'ST. LOUIS CITY WATER - A HISTORY OF EXCELLENCE (2025 Consumer Confidence Report)', source_url: 'https://www.stlwater.com/ccr.pdf', evidence_ids: ['STL-U-01'] },
    ],
    notes: [
      'St. Louis uses chloramine.',
    ],
  },
  {
    slug: 'tucson', name: 'Tucson', state: 'AZ', market_id: 'tucson', scale_mgl: null, checked_on: '2026-10-27', status: 'draft', reviewer: null,
    intro: 'Tucson Water serves the city mostly with recharged Central Arizona Project water plus groundwater.',
    facts: [
      { utility: 'Tucson Water', label: 'Hardness, as Tucson Water describes it', value: '"Hard to very hard" (no number given)', period: 'Undated document',
        source_title: 'Tucson Water: Water Quality Parameter Explanation', source_url: 'https://www.tucsonaz.gov/files/sharedassets/public/v/1/city-services/tucson-water/water-quality/parameter-explanation-table.pdf', evidence_ids: ['TUC-U-01'] },
    ],
    notes: [
      'Tucson Water disinfects with chlorine.',
      'Tucson Water shows hardness by address on an interactive map that we could not read.',
    ],
  },
];

export const locationBySlug = (slug: string): CityLocation | undefined => LOCATIONS.find((l) => l.slug === slug);
export const locationsInMarket = (marketId: string): CityLocation[] => LOCATIONS.filter((l) => l.market_id === marketId);
