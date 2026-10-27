// Water by area: for cities where the water differs by utility, zone or source, one section per area
// with where it serves, its own published figures and how it is treated. Every line is our plain
// wording of a cited utility publication, with an evidence ID in docs/research/evidence.csv. An area's
// figures are the city's facts in content/locations.ts that `facts` picks out, never new numbers.
import type { WaterFact } from './locations.ts';
import type { LocalDetail } from './local-details.ts';

export interface Area {
  name: string;
  where: LocalDetail; // which addresses it serves
  facts: (f: WaterFact) => boolean;
  // Published span for this area in mg/L, copied from its facts (converted at 17.1 mg/L per grain
  // when only grains are published, and then `converted` is true). null when nothing is published.
  mgl: [number, number] | null;
  converted?: boolean;
  points: LocalDetail[]; // treatment, source water and softening for this area
}

export interface AreaPage {
  heading: string; // e.g. 'Kansas City water by utility'
  intro: string;
  how_to_tell: string; // how a homeowner finds out which area they are in
  areas: Area[];
}

const KC_2022 = 'https://www.kcwater.us/wp-content/uploads/2022/05/2022-Water-Quality-Report_web.pdf';
const BPU_2026 = 'https://bpu.com/wp-content/uploads/2026/08/2026-Water-Quality-Report-FINAL-newformat.pdf';
const WATERONE_2026 = 'https://www.waterone.org/ArchiveCenter/ViewFile/Item/177';
const IND_2023 = 'https://www.independencemo.gov/sites/default/files/2024-05/2023%20CCR.pdf';
const SCOTTSDALE_2026 = 'https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/water/water-quality/annual-reports/2026-water-quality-report.pdf?sfvrsn=18a67596_1';
const SPU_2025 = 'https://seattle.gov/documents/Departments/SPU/AboutUs/Reports/Water%20Quality/SPU-Drinking-Water-Quality-Report_2025.pdf';

const d = (text: string, source_title: string, source_url: string, id: string): LocalDetail => ({ text, source_title, source_url, evidence_ids: [id] });

export const AREA_PAGES: Record<string, AreaPage> = {
  'kansas-city': {
    heading: 'Kansas City water by utility',
    intro: 'Four utilities supply most homes in the Kansas City area, and each treats its own water. Published hardness runs from about 100 to 280 mg/L depending on which one serves you.',
    how_to_tell: 'Your water bill names your utility. If you live in Kansas City, Missouri, it is usually KC Water; in Kansas City, Kansas, BPU; in most Johnson County cities, WaterOne; and in Independence, the City of Independence.',
    areas: [
      { name: 'KC Water (Kansas City, Missouri)', mgl: [100, 100], facts: (f) => f.utility.startsWith('KC Water'),
        where: d('KC Water covers about 319 square miles of Kansas City, Missouri.', 'KC Water 2022 Water Quality Report', KC_2022, 'KC-A-01'),
        points: [
          d('Water comes mainly from the Missouri River, plus wells near the river.', 'KC Water 2022 Water Quality Report', KC_2022, 'KC-A-02'),
          d('Lime is added at the plant for softening and to improve taste and odor, and chlorine is added for disinfection.', 'KC Water 2022 Water Quality Report', KC_2022, 'KC-A-03'),
          { text: "KC Water's own figures differ. Its 2022 report gives 84.6 to 136 ppm for 2021, and its latest report lists no hardness for its own supply.", source_title: 'KC Water 2022 Water Quality Report', source_url: KC_2022, evidence_ids: ['KC-U-06', 'KC-U-04'] },
        ] },
      { name: 'BPU (Kansas City, Kansas)', mgl: [280, 280], facts: (f) => f.utility.startsWith('BPU'),
        where: d('BPU serves a 152-square-mile area that includes Kansas City, Kansas and Edwardsville.', 'BPU 2026 Water Quality Report', BPU_2026, 'KC-A-04'),
        points: [
          d('Water is drawn from deep below the Missouri River through collector wells.', 'BPU 2026 Water Quality Report', BPU_2026, 'KC-A-05'),
          d('BPU uses chloramine, averaging 2.72 ppm in 2025. Its report describes no softening step.', 'BPU 2026 Water Quality Report', BPU_2026, 'KC-A-06'),
        ] },
      { name: 'WaterOne (Johnson County, Kansas)', mgl: [110, 157], facts: (f) => f.utility.startsWith('WaterOne'),
        where: d('WaterOne serves 17 Johnson County cities: De Soto (part), Fairway, Lake Quivira, Leawood, Lenexa, Merriam, Mission, Mission Hills, Mission Woods, Olathe (part), Overland Park, Prairie Village, Roeland Park, Shawnee, Spring Hill, Westwood and Westwood Hills.', 'WaterOne service area page', 'https://waterone.org/344/WaterOne-Service-Area', 'KC-A-07'),
        points: [
          d('Water comes from the Kansas and Missouri rivers.', 'WaterOne Water Quality Report 2026', WATERONE_2026, 'KC-A-08'),
          d('Lime, and sometimes soda ash, is added to soften the water, and chloramine is added before it enters the pipes.', 'WaterOne Water Quality Report 2026', WATERONE_2026, 'KC-A-09'),
        ] },
      { name: 'City of Independence, Missouri', mgl: [123, 123], facts: (f) => f.utility.startsWith('Independence'),
        where: d('Independence supplies about 250,000 people, including its own residents and 12 wholesale customers.', 'City of Independence consumer confidence reports page', 'https://www.independencemo.gov/consumerconfidencereports', 'KC-A-10'),
        points: [
          d('Water comes from wells that pump from the Missouri River alluvial aquifer.', 'Independence 2023 Consumer Confidence Report', IND_2023, 'KC-A-11'),
          d('The well water is softened and disinfected at the treatment plant, and the report lists chloramine.', 'Independence 2023 Consumer Confidence Report', IND_2023, 'KC-A-12'),
        ] },
    ],
  },
  scottsdale: {
    heading: 'Scottsdale water by area',
    intro: "Scottsdale publishes hardness for three parts of the city, split at Indian School Road and Chaparral Road. All three read as very hard on the USGS scale.",
    how_to_tell: 'Find which side of Indian School Road and Chaparral Road your home is on.',
    areas: [
      { name: 'South of Indian School Road', mgl: [230, 260], facts: (f) => /south of Indian School/i.test(f.label),
        where: d('The part of Scottsdale south of Indian School Road.', 'Scottsdale 2026 Water Quality Report', SCOTTSDALE_2026, 'SCO-A-01'), points: [] },
      { name: 'Indian School Road to Chaparral Road', mgl: [215, 285], facts: (f) => /Indian School Rd to Chaparral/i.test(f.label),
        where: d('The part of Scottsdale between Indian School Road and Chaparral Road.', 'Scottsdale 2026 Water Quality Report', SCOTTSDALE_2026, 'SCO-A-01'), points: [] },
      { name: 'North of Chaparral Road', mgl: [230, 290], facts: (f) => /north of Chaparral/i.test(f.label),
        where: d('The part of Scottsdale north of Chaparral Road.', 'Scottsdale 2026 Water Quality Report', SCOTTSDALE_2026, 'SCO-A-01'), points: [] },
    ],
  },
  seattle: {
    heading: 'Seattle water by source',
    intro: 'Seattle gets its water from two mountain rivers, and which one reaches you depends mostly on where you live. Both read as soft on the USGS scale.',
    how_to_tell: 'Seattle Public Utilities uses Green Lake as the rough dividing line, and says either source can serve other areas at times.',
    areas: [
      { name: 'Cedar River', mgl: [27, 27], converted: true, facts: (f) => /Cedar/.test(f.label),
        where: d('Homes south of Green Lake usually get Cedar River water. The Cedar supplied 62 percent of Seattle water in 2025.', 'SPU 2025 Drinking Water Quality Report', SPU_2025, 'SEA-A-01'), points: [] },
      { name: 'South Fork Tolt River', mgl: [26, 26], converted: true, facts: (f) => /Tolt/.test(f.label),
        where: d('Areas north of Green Lake usually get Tolt water. The Tolt supplied 38 percent of Seattle water in 2025.', 'SPU 2025 Drinking Water Quality Report', SPU_2025, 'SEA-A-01'), points: [] },
    ],
  },
};

export const areaPageOf = (slug: string): AreaPage | undefined => AREA_PAGES[slug];
