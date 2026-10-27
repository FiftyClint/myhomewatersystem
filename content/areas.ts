// Water by area: for cities where the water differs by utility, zone or source, one section per area
// with where it serves, its own published figures and how it is treated. Every line is our plain
// wording of a cited utility publication, with an evidence ID in docs/research/evidence.csv. An area's
// figures are the city's facts in content/locations.ts that `facts` picks out, plus `figures` where the
// utility publishes one per area (Madison's well reports). Each figure is copied as published.
import type { WaterFact } from './locations.ts';
import type { LocalDetail } from './local-details.ts';

export interface Area {
  name: string;
  where: LocalDetail; // which addresses it serves
  facts: (f: WaterFact) => boolean;
  figures?: WaterFact[]; // per-area figures not shown on the home page
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
const SD_FACILITIES = 'https://www.sandiego.gov/public-utilities/water-quality/water-wastewater-facilities';
const SD_2025 = 'https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf';
const LADWP = 'https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf';
const PHL_2025 = 'https://water.phila.gov/2025-quality';
const MESA_2017 = 'https://apps.mesaaz.gov/CCR/';
const MESA_2025 = 'https://www.mesaaz.gov/files/content/public/v/16/utilities/water-wastewater/water-quality/english-water-quality-report-2025.pdf';
const MAD_WELLS = 'https://cityofmadison.com/water/water-quality/water-quality-reports-for-madison-municipal-wells';
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
  'los-angeles': {
    heading: 'Los Angeles water by area',
    intro: "LADWP publishes water quality for five parts of Los Angeles, and each part draws on different plants and wells. Plant averages in 2025 ran from 103 mg/L at the Los Angeles Aqueduct plant to 236 mg/L at Metropolitan Water District's Diemer plant.",
    how_to_tell: 'Find your neighborhood in the lists below, which come from LADWP\'s 2026 water quality report.',
    areas: [
      { name: "San Fernando Valley", mgl: [103, 140], facts: (f) => /Aqueduct plant|northern wells|Jensen/i.test(f.label),
        where: d("LADWP lists these communities: Arleta, Canoga Park, Chatsworth, Encino, Granada Hills, Hollywood Hills, Lake View Terrace, Mission Hills, North Hills, North Hollywood, Northridge, Olive View, Pacoima, Panorama City, Porter Ranch, Reseda, Sherman Oaks, Studio City, Sun Valley, Sunland, Sylmar, Tarzana, Toluca Lake, Tujunga, Valley Village, Van Nuys, Warner Center, West Hills, Winnetka, Woodland Hills.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-01"),
        points: [
          d("LADWP lists its water sources here as Los Angeles Aqueduct, local groundwater, and MWD State Water Project. Test results for this area are under the LA Aqueduct Filtration Plant, Northern Combined Wells and MWD Jensen Plant columns.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-02"),
        ] },
      { name: "Western Los Angeles", mgl: [103, 103], facts: (f) => /Aqueduct plant/i.test(f.label),
        where: d("LADWP lists these communities: Bel Air Estates, Beverly Glen, Brentwood, Castellamare, Century City, Cheviot Hills, Culver City, Mar Vista, Pacific Palisades, Palisades Highlands, Palms, Playa del Rey, Sawtelle, Venice, West Los Angeles, Westchester, Westwood.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-03"),
        points: [
          d("LADWP lists its water sources here as Los Angeles Aqueduct and MWD State Water Project. Test results for this area are under the LA Aqueduct Filtration Plant column.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-04"),
          d("LADWP says the source of drinking water in Culver City may change with operating needs and supply.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-12"),
          d("The report lists the State Water Project as a source here, but points only to the Aqueduct plant column for test results.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-16"),
        ] },
      { name: "Central Los Angeles", mgl: [103, 116], facts: (f) => /Aqueduct plant|southern wells/i.test(f.label),
        where: d("LADWP lists these communities: Baldwin Hills, Chinatown, Country Club Park, Crenshaw, Griffith Park, Hancock Park, Hollywood, Hyde Park, Koreatown, L.A. City Strip, Little Tokyo, Los Feliz, Mid City, Mt. Olympus, Park La Brea, Rancho Park, Silverlake, Watts, West Hollywood, Westlake.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-05"),
        points: [
          d("LADWP lists its water sources here as Los Angeles Aqueduct, MWD State Water Project, and local groundwater. Test results for this area are under the LA Aqueduct Filtration Plant and Southern Combined Wells columns.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-06"),
          d("LADWP says the source of drinking water in L.A. City Strip and West Hollywood may change with operating needs and supply.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-13"),
        ] },
      { name: "Eastern Los Angeles", mgl: [140, 236], facts: (f) => /Weymouth|Diemer|Jensen/i.test(f.label),
        where: d("LADWP lists these communities: Atwater Village, Boyle Heights, Cypress Park, Eagle Rock, Echo Park, El Sereno, Glassell Park, Highland Park, Lincoln Heights, Montecito Heights, Monterey Hills, Mt. Washington.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-07"),
        points: [
          d("LADWP lists its water sources here as MWD State Water Project and Colorado River Aqueduct. Test results for this area are under the MWD Weymouth, MWD Diemer and MWD Jensen columns.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-08"),
        ] },
      { name: "Harbor", mgl: [140, 236], facts: (f) => /Weymouth|Diemer|Jensen/i.test(f.label),
        where: d("LADWP lists these communities: East San Pedro (Terminal Island), Harbor City, Harbor Gateway, L.A. City Strip, San Pedro, Wilmington.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-09"),
        points: [
          d("LADWP lists its water sources here as MWD State Water Project and Colorado River Aqueduct. Test results for this area are under the MWD Weymouth, MWD Diemer and MWD Jensen columns.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-10"),
          d("LADWP says the source of drinking water in Harbor Gateway and L.A. City Strip may change with operating needs and supply.", "LADWP 2026 Drinking Water Quality Report", LADWP, "LA-A-15"),
        ] },
    ],
  },
  'san-diego': {
    heading: 'San Diego water by treatment plant',
    intro: 'San Diego treats most of its water at three plants, and each mainly serves one section of the city. All three averaged about 240 ppm in 2025, which reads as very hard on the USGS scale.',
    how_to_tell: 'The city says each plant mainly serves one section of the city. Its 2025 report says the areas served by each plant overlap and shows them on a service-area map.',
    areas: [
      { name: "Alvarado plant: central San Diego", mgl: [237, 237], facts: (f) => /Alvarado/i.test(f.label), where: d("The Alvarado plant serves customers in the central section of the city.", "City of San Diego water and wastewater facilities page", SD_FACILITIES, "SD-A-01"), points: [] },
      { name: "Miramar plant: northern San Diego", mgl: [242, 242], facts: (f) => /Miramar/i.test(f.label), where: d("The Miramar plant serves about 500,000 customers in the northern section of the city.", "City of San Diego water and wastewater facilities page", SD_FACILITIES, "SD-A-02"), points: [] },
      { name: "Otay plant: southern San Diego", mgl: [243, 243], facts: (f) => /Otay/i.test(f.label), where: d("The Otay plant serves about 100,000 customers in the southern section of the city.", "City of San Diego water and wastewater facilities page", SD_FACILITIES, "SD-A-03"), points: [] },
      { name: 'Purchased treated water', mgl: [145, 145], facts: (f) => /purchased/i.test(f.label), where: d("A small part of the supply is treated water bought from the Metropolitan Water District and the San Diego County Water Authority. The report does not say which neighborhoods get it.", "City of San Diego 2025 Annual Drinking Water Quality Report", SD_2025, 'SD-A-04'), points: [] },
    ],
  },
  philadelphia: {
    heading: 'Philadelphia water by treatment plant',
    intro: "Philadelphia Water Department treats water at three plants. Its 2025 report says the city's water is moderately hard or hard depending on your service area.",
    how_to_tell: "PWD's 2025 report has a service-area map split by Market and Broad Streets and an address lookup that shows where your water is treated.",
    areas: [
      { name: "Baxter plant (Delaware River)", mgl: [101, 101], facts: (f) => /Baxter/i.test(f.label), where: d("Baxter serves the Northeast, the Far Northeast and much of North Philadelphia.", "Philadelphia Water Department 2025 Drinking Water Quality Report", PHL_2025, "PHL-A-01"), points: [] },
      { name: "Queen Lane plant (Schuylkill River)", mgl: [169, 169], facts: (f) => /Queen Lane/i.test(f.label), where: d("Queen Lane serves Northwest Philadelphia.", "Philadelphia Water Department 2025 Drinking Water Quality Report", PHL_2025, "PHL-A-02"), points: [] },
      { name: "Belmont plant (Schuylkill River)", mgl: [151, 151], facts: (f) => /Belmont/i.test(f.label), where: d("Belmont serves everything west of the Schuylkill River, though most of that area also gets some Baxter and Queen Lane water.", "Philadelphia Water Department 2025 Drinking Water Quality Report", PHL_2025, "PHL-A-03"), points: [] },
      { name: "South Philadelphia and Center City", mgl: [101, 169], facts: (f) => /Baxter|Queen Lane/i.test(f.label), where: d("South Philadelphia, Center City and the areas where the Baxter and Queen Lane service areas meet get a mix of water from both plants.", "Philadelphia Water Department 2025 Drinking Water Quality Report", PHL_2025, "PHL-A-04"), points: [] },
    ],
  },
  mesa: {
    heading: 'Mesa water by zone',
    intro: "Mesa's water service is split into three zones that draw on different rivers. The 2025 report gives about 12 grains per gallon for the City Zone and 16 for the Eastern and Southern Zones.",
    how_to_tell: "Mesa's 2025 report shows the zones only on its Water Source Zones map. Its 2017 report used the Eastern Canal as the line between the City and Eastern Zones; the canal runs southeast from Gilbert and McDowell Roads to Greenfield and Baseline Roads. The 2025 report also says every zone may get groundwater or a blend at times.",
    areas: [
      { name: 'City Zone', mgl: [205, 205], converted: true, facts: (f) => /City Zone/.test(f.label),
        where: d("The City Zone is on one side of the Eastern Canal, which the 2017 report used as its boundary with the Eastern Zone.", 'Mesa 2017 Water Quality Consumer Confidence Report', MESA_2017, 'MESA-A-01'),
        points: [d('The City Zone gets Salt and Verde River water through the Salt River Project, plus well water.', 'Mesa 2025 Water Quality Report', MESA_2025, 'MESA-A-03')] },
      { name: 'Eastern Zone', mgl: [274, 274], converted: true, facts: (f) => /Eastern/.test(f.label),
        where: d('The Eastern Zone is across the Eastern Canal from the City Zone, as the 2017 report drew the line.', 'Mesa 2017 Water Quality Consumer Confidence Report', MESA_2017, 'MESA-A-01'),
        points: [d('The Eastern and Southern Zones get Colorado River water through the Central Arizona Project, plus well water.', 'Mesa 2025 Water Quality Report', MESA_2025, 'MESA-A-04')] },
      { name: 'Southern Zone', mgl: [274, 274], converted: true, facts: (f) => /Southern/.test(f.label),
        where: d('The 2025 report shows the Southern Zone on its map but does not describe its boundary in words.', 'Mesa 2025 Water Quality Report', MESA_2025, 'MESA-A-02'),
        points: [d('The Eastern and Southern Zones get Colorado River water through the Central Arizona Project, plus well water.', 'Mesa 2025 Water Quality Report', MESA_2025, 'MESA-A-04')] },
    ],
  },
  madison: {
    heading: 'Madison water by well',
    intro: 'Madison Water Utility pumps from wells across the city, and each well has its own water quality report. In the reports we read, hardness runs from 270 mg/L at Well 20 to 580 mg/L at Well 14, all very hard on the USGS scale.',
    how_to_tell: 'Find your neighborhood in the wells below. Some neighborhoods appear under more than one well, and some wells run only in summer.',
    areas: [
      { name: "Well 6: Near West", mgl: [450, 450], facts: (f) => f.label === "Hardness, Unit Well 6",
        where: d("UW campus area and Near West neighborhoods: Regent, Dudgeon-Monroe, Vilas, Greenbush, Rocky Bluff, Sunset Hills.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-06"),
        points: [] },
      { name: "Well 7: North, Near East", mgl: [390, 390], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 7", value: "390 mg/L (23 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #7 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well07QualityReport.pdf", evidence_ids: ["MAD-W-07"] }],
        where: d("Village of Maple Bluff, Sherman Avenue neighborhoods between Northport Drive and the Yahara River, Sheridan Triangle, Maple Wood, Tenney-Lapham, Marquette.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-07"),
        points: [] },
      { name: "Well 8: Near East (seasonal well)", mgl: [324, 324], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 8", value: "324 mg/L (19 grains per gallon)", period: "Calendar year 2022", source_title: "Unit Well #8 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well08QualityReport.pdf", evidence_ids: ["MAD-W-08"] }],
        where: d("Schenk-Atwood-Starkweather-Yahara and Marquette homes east of the Yahara River. Seasonal well, usually summer only.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-08"),
        points: [] },
      { name: "Well 9: East, Southeast", mgl: [420, 420], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 9", value: "420 mg/L (25 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #9 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well09QualityReport.pdf", evidence_ids: ["MAD-W-09"] }],
        where: d("Eastmorland, Lake Edge, Glendale; neighborhoods between Monona Drive and Stoughton Road south of Cottage Grove Road; all neighborhoods south of Pflaum Road.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-09"),
        points: [] },
      { name: "Well 11: East", mgl: [440, 440], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 11", value: "440 mg/L (26 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #11 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well11QualityReport.pdf", evidence_ids: ["MAD-W-11"] }],
        where: d("East side: Emerson East, Eken Park, Marquette, Schenk-Atwood-Starkweather-Yahara, Hawthorne, Worthington Park, plus homes in Burke Heights, Hiestand, Rolling Meadows and Eastmorland.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-11"),
        points: [] },
      { name: "Well 12: West", mgl: [300, 300], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 12", value: "300 mg/L (18 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #12 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well12QualityReport.pdf", evidence_ids: ["MAD-W-12"] }],
        where: d("Near West and West: University Hill Farms, Sunset Village, Midvale Heights, Westmorland, Crawford-Marlborough-Nakoma, Orchard Ridge, Summit Woods, Meadowood, Allied Dunn's Marsh, Arbor Hills, Leopold.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-12"),
        points: [] },
      { name: "Well 13: North", mgl: [380, 380], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 13", value: "380 mg/L (22 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #13 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well13QualityReport.pdf", evidence_ids: ["MAD-W-13"] }],
        where: d("North side: west of Packers Avenue, north of Warner Park; Berkley Oaks, Sherman, Brentwood Village.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-13"),
        points: [] },
      { name: "Well 14: West", mgl: [580, 580], facts: (f) => f.label === "Hardness, Unit Well 14",
        where: d("West side: Spring Harbor, Old Middleton Greenway, Sunset Village, Regent, Glen Oak Hills, Hill Farms, Village of Shorewood Hills, UW campus area.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-14"),
        points: [] },
      { name: "Well 15: East, Northeast", mgl: [370, 370], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 15", value: "370 mg/L (22 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #15 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well15QualityReport.pdf", evidence_ids: ["MAD-W-15"] }],
        where: d("East Washington corridor (Yahara River to I-90/94): Greater Sandburg, Mayfair Park, Truax, Emerson East, Eken Park, Carpenter-Ridgeway, Bluff Acres, Westchester Gardens.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-15"),
        points: [d('The well list says Well 15 is out of service, but its own report says it resumed delivering water in September 2025.', 'Unit Well #15 water quality report', "https://www.cityofmadison.com/water/documents/water-quality/Well15QualityReport.pdf", 'MAD-A-90')] },
      { name: "Well 16: West", mgl: [380, 380], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 16", value: "380 mg/L (22 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #16 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well16QualityReport.pdf", evidence_ids: ["MAD-W-16"] }],
        where: d("North of Odana Road between Rosa Road and High Point Road (report: north of the Beltline between Whitney Way and High Point Road); Junction Ridge, Greentree.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-16"),
        points: [] },
      { name: "Well 17: Central (seasonal well)", mgl: [320, 320], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 17", value: "320 mg/L (19 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #17 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well17QualityReport.pdf", evidence_ids: ["MAD-W-17"] }],
        where: d("Downtown and Capitol areas between Blair Street and Bedford Street (index page says between Park Street and Blair Street). Seasonal well, usually summer only.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-17"),
        points: [] },
      { name: "Well 18: South", mgl: [320, 320], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 18", value: "320 mg/L (19 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #18 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well18QualityReport.pdf", evidence_ids: ["MAD-W-18"] }],
        where: d("South side Park Street-Fish Hatchery Road corridor; also Greenbush, Bay Creek, Burr Oaks, Bram's Addition, Vilas.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-18"),
        points: [] },
      { name: "Well 19: Near West", mgl: [310, 310], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 19", value: "310 mg/L (18 grains per gallon)", period: "Calendar year 2024", source_title: "Unit Well #19 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well19QualityReport.pdf", evidence_ids: ["MAD-W-19"] }],
        where: d("UW campus area, State-Langdon and Regent neighborhoods.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-19"),
        points: [] },
      { name: "Well 20: Southwest", mgl: [270, 270], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 20", value: "270 mg/L (16 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #20 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well20QualityReport.pdf", evidence_ids: ["MAD-W-20"] }],
        where: d("Southwest neighborhoods south of Raymond Road; also Greentree, Orchard Ridge, Allied Dunn's Marsh, Nakoma, Arbor Hills.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-20"),
        points: [] },
      { name: "Well 24: Central, Near East", mgl: [290, 290], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 24", value: "290 mg/L (17 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #24 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well24QualityReport.pdf", evidence_ids: ["MAD-W-24"] }],
        where: d("Central (Capitol area) and Isthmus/Near East neighborhoods between Park Street and the Yahara River.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-24"),
        points: [] },
      { name: "Well 25: Far East", mgl: [330, 330], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 25", value: "330 mg/L (19 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #25 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well25QualityReport.pdf", evidence_ids: ["MAD-W-25"] }],
        where: d("Far East: Heritage Heights, Elvehjem, Richmond Hills, North Star, Sprecher East, Ridgewood, Hiestand, Rolling Meadows, McClellan Park.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-25"),
        points: [] },
      { name: "Well 26: Far West", mgl: [320, 320], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 26", value: "320 mg/L (19 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #26 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well26QualityReport.pdf", evidence_ids: ["MAD-W-26"] }],
        where: d("Far West neighborhoods west of Gammon Road, south of Mineral Point Road; seasonally most areas west of Rosa Road.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-26"),
        points: [] },
      { name: "Well 27: Near West", mgl: [370, 370], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 27", value: "370 mg/L (22 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #27 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well27QualityReport.pdf", evidence_ids: ["MAD-W-27"] }],
        where: d("South and east of the UW campus: Dudgeon-Monroe, Greenbush, Vilas, South Campus, State-Langdon.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-27"),
        points: [] },
      { name: "Well 28: Far West", mgl: [300, 300], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 28", value: "300 mg/L (18 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #28 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well28QualityReport.pdf", evidence_ids: ["MAD-W-28"] }],
        where: d("Far West neighborhoods west of the Beltline, north of Mineral Point Road and west of Gammon Road (report also names Junction Road and Pleasant View Road).", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-28"),
        points: [] },
      { name: "Well 29: Far East", mgl: [340, 340], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 29", value: "340 mg/L (20 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #29 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well29QualityReport.pdf", evidence_ids: ["MAD-W-29"] }],
        where: d("East of Stoughton Road (and East Washington Ave) north of Commercial Avenue/I-94: Mayfair Park, Burke Heights, Hiestand, Rolling Meadows, High Crossing, Bluff Acres, North Star, Sprecher East.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-29"),
        points: [] },
      { name: "Well 30: South", mgl: [290, 290], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 30", value: "290 mg/L (17 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #30 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well30QualityReport.pdf", evidence_ids: ["MAD-W-30"] }],
        where: d("South side, south of Wingra Creek and east of Park Street: Bridge-Lakepoint, Waunona, Moorland-Rimrock, Highland Manor, Indian Springs, Capitol View Heights, Bram's Addition, Bay Creek, Vilas, Greenbush, Monona Bay.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-30"),
        points: [] },
      { name: "Well 31: Southeast", mgl: [340, 340], facts: () => false,
        figures: [{ utility: 'Madison Water Utility', label: "Hardness, Unit Well 31", value: "340 mg/L (20 grains per gallon)", period: "Calendar year 2025", source_title: "Unit Well #31 water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/Well31QualityReport.pdf", evidence_ids: ["MAD-W-31"] }],
        where: d("East and Southeast sides from the Village of McFarland border north to about Pflaum Road.", 'Madison Water Utility well water quality reports page', MAD_WELLS, "MAD-A-31"),
        points: [] },
    ],
  },
};

export const areaPageOf = (slug: string): AreaPage | undefined => AREA_PAGES[slug];
