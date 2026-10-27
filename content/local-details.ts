// Sourced local details behind each city site's own questions: where the water comes from, how it is
// disinfected, whether the utility softens it, seasonal changes and which utility serves which area.
// Each text is our plain wording of what the cited utility publication says, and each has an evidence
// ID in docs/research/evidence.csv. A detail with no source is left out, never guessed.

export interface LocalDetail {
  text: string;
  source_title: string;
  source_url: string;
  evidence_ids: string[];
}

export type DisinfectantKind = 'chlorine' | 'chloramine' | 'both' | 'varies';

export interface LocalDetails {
  disinfectant?: LocalDetail & { kind: DisinfectantKind };
  source_water?: LocalDetail;
  softening?: LocalDetail;
  seasonal?: LocalDetail;
  by_area?: LocalDetail; // how water differs across the city (plants, wells, zones)
  service?: LocalDetail;
}

// General statements used in several cities' answers, each from a public agency.
export const GENERAL: Record<'chloramine_filters', LocalDetail | null> = {
  chloramine_filters: { text: "Filters meant for chloramine use catalytic carbon, an activated-carbon product designed to adsorb it.",
    source_title: "NDSU Extension, Filtration: Sediment, Activated Carbon, and Mixed Media", source_url: "https://www.ndsu.edu/agriculture/extension/publications/filtration-sediment-activated-carbon-and-mixed-media", evidence_ids: ["GEN-L-01"] },
};

export const LOCAL_DETAILS: Record<string, LocalDetails> = {
  'chicago': {
    disinfectant: { text: "Chicago lists chlorine as its drinking water disinfectant.", kind: "chlorine",
      source_title: "Chicago 2024 Water Quality Report", source_url: "https://www.chicago.gov/content/dam/city/depts/water/ConsumerConfidenceReports/2024_WaterQuality%20Report_CCR.pdf", evidence_ids: ["CHICAG-L-01"] },
    source_water: { text: "Chicago draws Lake Michigan water through offshore intakes to two plants: Jardine serves the north side and Sawyer the south side.",
      source_title: "Chicago 2024 Water Quality Report", source_url: "https://www.chicago.gov/content/dam/city/depts/water/ConsumerConfidenceReports/2024_WaterQuality%20Report_CCR.pdf", evidence_ids: ["CHICAG-L-02"] },
  },
  'pittsburgh': {
    disinfectant: { text: "Pittsburgh Water treats filtered water with chlorine.", kind: "chlorine",
      source_title: "Pittsburgh Water 2022 Water Quality Report", source_url: "https://www.pgh2o.com/sites/default/files/2023-05/FINAL_PWSA_CCR_2022.pdf", evidence_ids: ["PITTSB-L-01"] },
    source_water: { text: "Pittsburgh Water draws all of its drinking water from the Allegheny River.",
      source_title: "Pittsburgh Water, our water source", source_url: "https://www.pgh2o.com/node/28", evidence_ids: ["PITTSB-L-02"] },
    service: { text: "Pittsburgh Water supplies most of the city. Some neighborhoods get only sewer service from it and buy water from another provider, such as Pennsylvania American Water, so check your bill.",
      source_title: "Pittsburgh Water service area page", source_url: "https://www.pgh2o.com/node/280", evidence_ids: ["PITTSB-L-03"] },
  },
  'baltimore': {
    disinfectant: { text: "Baltimore lists chlorine as the additive that disinfects its supply.", kind: "chlorine",
      source_title: "Baltimore City 2025 Water Quality Report", source_url: "https://s3.amazonaws.com/baltimorecity.gov.if-us-east-1/s3fs-public/2026-07/2025%20Baltimore%20City%20Water%20Quality%20Report.pdf", evidence_ids: ["BALTIM-L-01"] },
    source_water: { text: "Baltimore water is rain and snowmelt stored in the Liberty, Loch Raven and Prettyboy reservoirs and treated at the Ashburton and Montebello plants. The Susquehanna River is used only in severe drought.",
      source_title: "Baltimore City 2025 Water Quality Report", source_url: "https://s3.amazonaws.com/baltimorecity.gov.if-us-east-1/s3fs-public/2026-07/2025%20Baltimore%20City%20Water%20Quality%20Report.pdf", evidence_ids: ["BALTIM-L-02"] },
  },
  'atlanta': {
    disinfectant: { text: "Atlanta lists chlorine as the additive that controls microbes, with a highest monthly average of 1.13 ppm in 2025.", kind: "chlorine",
      source_title: "City of Atlanta 2025 Water Quality Report", source_url: "https://drive.google.com/file/d/11kz5ciFgXn1hLVe_UzxMFVLw4z3LldlY/view?usp=share_link", evidence_ids: ["ATLANT-L-01"] },
    source_water: { text: "Atlanta draws all of its water from the Chattahoochee River. The Chattahoochee and Hemphill plants make about 75 percent of it, and the jointly owned Atlanta-Fulton County plant serves the northeast part of the system.",
      source_title: "City of Atlanta 2025 Water Quality Report", source_url: "https://drive.google.com/file/d/11kz5ciFgXn1hLVe_UzxMFVLw4z3LldlY/view?usp=share_link", evidence_ids: ["ATLANT-L-02"] },
  },
  'miami': {
    disinfectant: { text: "The Miami-Dade main system, which serves the City of Miami, keeps the water disinfected with chloramine.", kind: "chloramine",
      source_title: "Miami-Dade WASD 2025 Water Quality Report", source_url: "https://www.miamidade.gov/resources/water/documents/2025-water-quality-report.pdf", evidence_ids: ["MIAMI-L-01"] },
    source_water: { text: "Most Miami-Dade water comes from the Biscayne Aquifer, treated at the Hialeah, John E. Preston and Alexander Orr Jr. plants. The Hialeah reverse osmosis plant draws from the deeper Upper Floridan Aquifer.",
      source_title: "Miami-Dade WASD 2025 Water Quality Report", source_url: "https://www.miamidade.gov/resources/water/documents/2025-water-quality-report.pdf", evidence_ids: ["MIAMI-L-02"] },
    softening: { text: "Partly. Water from the Alexander Orr Jr. plant gets lime treatment to reduce hardness before it is disinfected and filtered.",
      source_title: "Miami-Dade WASD 2025 Water Quality Report", source_url: "https://www.miamidade.gov/resources/water/documents/2025-water-quality-report.pdf", evidence_ids: ["MIAMI-L-03"] },
    by_area: { text: "The Orr plant generally serves areas south of SW 8 Street, and the Hialeah and Preston plants serve areas north of it.",
      source_title: "Miami-Dade WASD 2025 Water Quality Report", source_url: "https://www.miamidade.gov/resources/water/documents/2025-water-quality-report.pdf", evidence_ids: ["MIAMI-L-04"] },
  },
  'new-braunfels': {
    disinfectant: { text: "NBU lists total chlorine as the additive that controls microbes, averaging 2.64 ppm in 2024.", kind: "chlorine",
      source_title: "New Braunfels Utilities 2024 Water Quality Report", source_url: "https://www.nbutexas.com/wp-content/uploads/2025/06/2024-Water-Quality-Report-Brochure-8.5x11-FINAL.pdf", evidence_ids: ["NEWBRA-L-01"] },
    source_water: { text: "Most New Braunfels water is Guadalupe River water treated at the Gruene Road plant, supplemented by Edwards and Trinity aquifer wells and water bought as needed from Green Valley SUD and GBRA.",
      source_title: "New Braunfels Utilities 2024 Water Quality Report", source_url: "https://www.nbutexas.com/wp-content/uploads/2025/06/2024-Water-Quality-Report-Brochure-8.5x11-FINAL.pdf", evidence_ids: ["NEWBRA-L-02"] },
    seasonal: { text: "NBU says hardness can vary with location, water source and seasonal conditions.",
      source_title: "New Braunfels Utilities water hardness page", source_url: "https://nbutexas.com/?p=36730", evidence_ids: ["NEWBRA-L-03"] },
  },
  'mcallen': {
    disinfectant: { text: "McAllen treats incoming river water with chlorine dioxide, then adds chlorine and ammonia to form chloramine that carries through the pipes.", kind: "chloramine",
      source_title: "McAllen Public Utility 2025 Water Quality Report", source_url: "https://www.mcallenpublicutility.com/assets/docs/quality-and-education/water-quality/water-quality-report-2025.pdf", evidence_ids: ["MCALLE-L-01"] },
    source_water: { text: "McAllen gets Rio Grande water released from Falcon and Amistad dams, moved by irrigation districts to the utility reservoirs and treated at its South and North plants.",
      source_title: "McAllen Public Utility 2025 Water Quality Report", source_url: "https://www.mcallenpublicutility.com/assets/docs/quality-and-education/water-quality/water-quality-report-2025.pdf", evidence_ids: ["MCALLE-L-02"] },
  },
  'oklahoma-city': {
    disinfectant: { text: "OKC disinfects with a small amount of chlorine and ammonia, which forms chloramine, measured at 3.57 ppm at Hefner and 3.25 ppm at Draper in 2025.", kind: "chloramine",
      source_title: "OKC Utilities Consumer Confidence Report for 2025", source_url: "https://www.okc.gov/files/assets/city/v/1/utilities/documents/water-quality-reports/ccr-june-2026-for-2025-reporting_063026cb-publishedv2071426.pdf", evidence_ids: ["OKLAHO-L-01"] },
    source_water: { text: "OKC draws on five reservoirs. Canton water flows down the North Canadian River to Lake Hefner, and Atoka and McGee Creek water travels by pipeline to Lake Stanley Draper, for treatment at the Hefner and Draper plants.",
      source_title: "OKC Utilities Consumer Confidence Report for 2025", source_url: "https://www.okc.gov/files/assets/city/v/1/utilities/documents/water-quality-reports/ccr-june-2026-for-2025-reporting_063026cb-publishedv2071426.pdf", evidence_ids: ["OKLAHO-L-02"] },
    softening: { text: "Partly. A 2024 city project document describes the Hefner plant as a lime softening plant. It does not describe the Draper plant.",
      source_title: "OKC Hefner Water Treatment Plant Clarifier Rehabilitation (2024)", source_url: "https://okc.gov/home/showpublisheddocument/42328/638525013580870000", evidence_ids: ["OKLAHO-L-03"] },
    service: { text: "OKC Utilities serves the city from its Hefner and Draper plants, except The Falls neighborhood, which gets City of Edmond water under an agreement.",
      source_title: "OKC Utilities Consumer Confidence Report for 2025", source_url: "https://www.okc.gov/files/assets/city/v/1/utilities/documents/water-quality-reports/ccr-june-2026-for-2025-reporting_063026cb-publishedv2071426.pdf", evidence_ids: ["OKLAHO-L-04"] },
  },
  'tucson': {
    disinfectant: { text: "Tucson Water keeps a chlorine residual of 0.80 to 1.2 mg/L through its pipes.", kind: "chlorine",
      source_title: "Tucson Water 2025 Consumer Confidence Report", source_url: "https://www.tucsonaz.gov/files/sharedassets/public/v/1/city-services/tucson-water/water-quality/report-archive/ccr_mainsystem_2025.pdf", evidence_ids: ["TUCSON-L-01"] },
    source_water: { text: "Most Tucson water is Colorado River water delivered by the Central Arizona Project, soaked into the ground in Avra Valley and at Pima Mine Road and pumped back out, plus groundwater from the Central Well Field.",
      source_title: "Tucson Water 2025 Consumer Confidence Report", source_url: "https://www.tucsonaz.gov/files/sharedassets/public/v/1/city-services/tucson-water/water-quality/report-archive/ccr_mainsystem_2025.pdf", evidence_ids: ["TUCSON-L-02"] },
    seasonal: { text: "Tucson Water says hardness rises as the share of Central Arizona Project water rises.",
      source_title: "Tucson Water hard water page", source_url: "https://www.tucsonaz.gov/Departments/Water/Water-Quality/Aesthetics/Hard-Water", evidence_ids: ["TUCSON-L-03"] },
  },
  'dallas': {
    disinfectant: { text: "Dallas Water Utilities disinfects with chloramine instead of chlorine.", kind: "chloramine",
      source_title: "Dallas Water Utilities water quality information page", source_url: "https://dallascityhall.com/departments/waterutilities/pages/water_quality_information.aspx", evidence_ids: ["DALLAS-L-01"] },
    source_water: { text: "Dallas uses surface water from the Elm Fork of the Trinity River and lakes Ray Roberts, Lewisville, Grapevine, Ray Hubbard, Tawakoni and Fork, treated at the East Side, Elm Fork and Bachman plants.",
      source_title: "Dallas Water Quality Report", source_url: "https://dallascityhall.com/departments/waterutilities/DCH%20Documents/pdf/water-quality-report.pdf", evidence_ids: ["DALLAS-L-02"] },
  },
  'fort-worth': {
    disinfectant: { text: "Fort Worth Water lists chloramine as the additive that controls microbes, at 2.00 to 3.70 ppm in 2024.", kind: "chloramine",
      source_title: "Fort Worth Water's 2024 water quality data, printed in Westworth Village's 2024 report", source_url: "https://www.cityofwestworth.com/ArchiveCenter/ViewFile/Item/67", evidence_ids: ["FORTWO-L-01"] },
    source_water: { text: "Fort Worth uses surface water from Lake Worth, Eagle Mountain Lake, Lake Bridgeport, Richland-Chambers Reservoir, Cedar Creek Reservoir, Lake Benbrook and the Clear Fork of the Trinity River.",
      source_title: "Fort Worth Water's 2024 water quality data, printed in Westworth Village's 2024 report", source_url: "https://www.cityofwestworth.com/ArchiveCenter/ViewFile/Item/67", evidence_ids: ["FORTWO-L-02"] },
  },
  'nashville': {
    disinfectant: { text: "Metro Water Services disinfects with a small amount of bleach, a form of chlorine, averaging 1.60 ppm in its 2025 report.", kind: "chlorine",
      source_title: "Metro Water Services 2025 Consumer Confidence Report", source_url: "https://www.nashville.gov/sites/default/files/2026-05/2025_Consumer_Confidence_Report-FINAL.pdf?ct=1777986674", evidence_ids: ["NASHVI-L-01"] },
    source_water: { text: "Metro Water draws from the Cumberland River and treats it at the K.R. Harrington and Omohundro plants.",
      source_title: "Metro Water and Sewerage Services Annual Disclosure FY2025", source_url: "https://www.nashville.gov/sites/default/files/2026-05/Metro_Water_and_Sewerage_Services_Annual_Disclosure_FY2025.pdf?ct=1778591132", evidence_ids: ["NASHVI-L-02"] },
    service: { text: "Metro Water serves most of Davidson County, but several separate utility districts, such as Harpeth Valley Utility District, also operate inside the county, so check your bill.",
      source_title: "Metro Water and Sewerage Services Annual Disclosure FY2025", source_url: "https://www.nashville.gov/sites/default/files/2026-05/Metro_Water_and_Sewerage_Services_Annual_Disclosure_FY2025.pdf?ct=1778591132", evidence_ids: ["NASHVI-L-03"] },
  },
  'jersey-city': {
    disinfectant: { text: "Jersey City water gets a small amount of chlorine to disinfect it.", kind: "chlorine",
      source_title: "Veolia Jersey City Consumer Confidence Report (2022 data)", source_url: "https://jcmua.com/wp-content/uploads/2024/04/Veolia_Jersey_City_CCR-2022_data_Locked.pdf", evidence_ids: ["JERSEY-L-01"] },
    source_water: { text: "Jersey City water comes from the Jersey City Reservoir at Boonton and the Split Rock Reservoir in Rockaway Township, treated at the Boonton plant.",
      source_title: "Veolia Jersey City Consumer Confidence Report (2022 data)", source_url: "https://jcmua.com/wp-content/uploads/2024/04/Veolia_Jersey_City_CCR-2022_data_Locked.pdf", evidence_ids: ["JERSEY-L-02"] },
    seasonal: { text: "During maintenance on the plant, aqueduct or mains, Jersey City may receive water from the North Jersey District Water Supply Commission instead.",
      source_title: "Veolia Jersey City Consumer Confidence Report (2022 data)", source_url: "https://jcmua.com/wp-content/uploads/2024/04/Veolia_Jersey_City_CCR-2022_data_Locked.pdf", evidence_ids: ["JERSEY-L-03"] },
  },
  'kansas-city': {
    disinfectant: { text: "It depends on the utility. WaterOne, BPU and Independence use chloramine, and the newest KC Water statement we found, in its 2022 report, says chlorine is added for disinfection.", kind: "varies",
      source_title: "KC Water 2022 Water Quality Report", source_url: "https://www.kcwater.us/wp-content/uploads/2022/05/2022-Water-Quality-Report_web.pdf", evidence_ids: ["KANSAS-L-01"] },
    source_water: { text: "KC Water draws mainly from the Missouri River plus nearby wells. BPU and Independence also draw on the Missouri River and its alluvial aquifer, and WaterOne uses the Kansas and Missouri rivers and wells.",
      source_title: "KC Water 2022 Water Quality Report", source_url: "https://www.kcwater.us/wp-content/uploads/2022/05/2022-Water-Quality-Report_web.pdf", evidence_ids: ["KANSAS-L-02"] },
    softening: { text: "At least in part. KC Water adds lime at its plant for softening and to improve taste and odor.",
      source_title: "KC Water 2022 Water Quality Report", source_url: "https://www.kcwater.us/wp-content/uploads/2022/05/2022-Water-Quality-Report_web.pdf", evidence_ids: ["KANSAS-L-03"] },
    service: { text: "Four utilities serve the area. KC Water serves Kansas City, Missouri, BPU serves Kansas City, Kansas, Independence serves Independence, Missouri, and WaterOne serves 17 Johnson County cities, including Overland Park, Lenexa, Shawnee, Leawood and Prairie Village, and parts of Olathe and De Soto.",
      source_title: "WaterOne service area page", source_url: "https://waterone.org/344/WaterOne-Service-Area", evidence_ids: ["KANSAS-L-04"] },
  },
  'mesa': {
    disinfectant: { text: "Mesa disinfects with chlorine dioxide and chlorine before water enters its pipes.", kind: "chlorine",
      source_title: "Mesa 2025 Water Quality Consumer Confidence Report", source_url: "https://www.mesaaz.gov/files/content/public/v/16/utilities/water-wastewater/water-quality/english-water-quality-report-2025.pdf", evidence_ids: ["MESA-L-01"] },
    seasonal: { text: "Mesa says every zone may get groundwater or a blend of surface water and groundwater at different times of the year, and some customers get only well water at times.",
      source_title: "Mesa 2025 Water Quality Consumer Confidence Report", source_url: "https://www.mesaaz.gov/files/content/public/v/16/utilities/water-wastewater/water-quality/english-water-quality-report-2025.pdf", evidence_ids: ["MESA-L-02"] },
  },
  'chandler': {
    disinfectant: { text: "Chandler disinfects its water with chlorine before it enters the city pipes.", kind: "chlorine",
      source_title: "Chandler 2025 Drinking Water Quality Consumer Confidence Report", source_url: "https://www.chandleraz.gov/sites/default/files/departments/water/City-of-Chandler-2025-Drinking-Water-Quality-Consumer-Confidence-Report.pdf", evidence_ids: ["CHANDL-L-01"] },
    source_water: { text: "Chandler treats Salt, Verde and Colorado River water at its Pecos and Santan Vista plants and pumped groundwater from 27 wells in 2025.",
      source_title: "Chandler 2025 Drinking Water Quality Consumer Confidence Report", source_url: "https://www.chandleraz.gov/sites/default/files/departments/water/City-of-Chandler-2025-Drinking-Water-Quality-Consumer-Confidence-Report.pdf", evidence_ids: ["CHANDL-L-02"] },
    seasonal: { text: "Chandler says the flavor of its water can change at certain times of the year, depending on the source.",
      source_title: "Chandler 2025 Drinking Water Quality Consumer Confidence Report", source_url: "https://www.chandleraz.gov/sites/default/files/departments/water/City-of-Chandler-2025-Drinking-Water-Quality-Consumer-Confidence-Report.pdf", evidence_ids: ["CHANDL-L-03"] },
  },
  'gilbert': {
    disinfectant: { text: "Gilbert disinfects plant water with ozone and chlorine, and its pipes carry chlorine.", kind: "chlorine",
      source_title: "Gilbert water quality page", source_url: "https://www.gilbertaz.gov/departments/public-works/water/water-quality-91", evidence_ids: ["GILBER-L-01"] },
    source_water: { text: "Gilbert gets Salt and Verde River water through Salt River Project canals and Colorado River water through the Central Arizona Project, plus groundwater from 17 wells.",
      source_title: "Gilbert water quality page", source_url: "https://www.gilbertaz.gov/departments/public-works/water/water-quality-91", evidence_ids: ["GILBER-L-02"] },
    seasonal: { text: "Gilbert leans on groundwater during high demand and when canals are dried out for maintenance.",
      source_title: "Gilbert water quality page", source_url: "https://www.gilbertaz.gov/departments/public-works/water/water-quality-91", evidence_ids: ["GILBER-L-03"] },
  },
  'scottsdale': {
    disinfectant: { text: "Scottsdale uses chlorine to keep treated water disinfected.", kind: "chlorine",
      source_title: "Scottsdale 2026 Water Quality Report", source_url: "https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/water/water-quality/annual-reports/2026-water-quality-report.pdf?sfvrsn=18a67596_1", evidence_ids: ["SCOTTS-L-01"] },
    source_water: { text: "Scottsdale gets most of its surface water from the Colorado River, plus Salt and Verde River water, deep aquifer wells and recycled water.",
      source_title: "Scottsdale 2026 Water Quality Report", source_url: "https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/water/water-quality/annual-reports/2026-water-quality-report.pdf?sfvrsn=18a67596_1", evidence_ids: ["SCOTTS-L-02"] },
    seasonal: { text: "Depending on the time of year, weather and demand, a home may get water from one source or a mix of sources.",
      source_title: "Scottsdale 2026 Water Quality Report", source_url: "https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/water/water-quality/annual-reports/2026-water-quality-report.pdf?sfvrsn=18a67596_1", evidence_ids: ["SCOTTS-L-03"] },
    by_area: { text: "Scottsdale says hardness varies across the city and publishes a table of it by area in its report.",
      source_title: "Scottsdale 2026 Water Quality Report", source_url: "https://www.scottsdaleaz.gov/docs/default-source/scottsdaleaz/water/water-quality/annual-reports/2026-water-quality-report.pdf?sfvrsn=18a67596_1", evidence_ids: ["SCOTTS-L-04"] },
  },
  'phoenix': {
    disinfectant: { text: "Phoenix disinfects its entire supply, well water and treated surface water, with chlorine.", kind: "chlorine",
      source_title: "Phoenix 2025 Water Quality Report", source_url: "https://www.phoenix.gov/content/dam/phoenix/waterservicessite/documents/wsdprimarywqr.pdf", evidence_ids: ["PHOENI-L-01"] },
    source_water: { text: "Phoenix gets almost all of its water from the Salt, Verde and Colorado rivers through Salt River Project canals and the Central Arizona Project, and the rest from about 20 city wells.",
      source_title: "Phoenix 2025 Water Quality Report", source_url: "https://www.phoenix.gov/content/dam/phoenix/waterservicessite/documents/wsdprimarywqr.pdf", evidence_ids: ["PHOENI-L-02"] },
    seasonal: { text: "Phoenix says taste and odor changes are often seasonal and strongest near fall, when algae grow in the canals.",
      source_title: "Phoenix seasonal taste and odor FAQ", source_url: "https://www.phoenix.gov/content/dam/phoenix/waterservicessite/documents/seasonal_taste_odor_faqs.pdf", evidence_ids: ["PHOENI-L-03"] },
  },
  'las-vegas': {
    disinfectant: { text: "Chlorine is added as water leaves the treatment plants to protect it on the way to the tap.", kind: "chlorine",
      source_title: "Las Vegas Valley Water District 2026 Water Quality Report", source_url: "https://www.lvvwd.com/assets/pdf/water-quality-report-las-vegas-valley-current.pdf", evidence_ids: ["LASVEG-L-01"] },
    source_water: { text: "About 90 percent of Las Vegas Valley water comes from Lake Mead, and about 10 percent from wells in a deep valley aquifer.",
      source_title: "Las Vegas Valley Water District 2026 Water Quality Report", source_url: "https://www.lvvwd.com/assets/pdf/water-quality-report-las-vegas-valley-current.pdf", evidence_ids: ["LASVEG-L-02"] },
    seasonal: { text: "Groundwater is used mainly from April through October to meet peak demand, so some areas get a blend of well water and Lake Mead water then.",
      source_title: "Las Vegas Valley Water District 2026 Water Quality Report", source_url: "https://www.lvvwd.com/assets/pdf/water-quality-report-las-vegas-valley-current.pdf", evidence_ids: ["LASVEG-L-03"] },
  },
  'henderson': {
    disinfectant: { text: "Henderson lists a free chlorine residual in its water report.", kind: "chlorine",
      source_title: "Henderson 2026 Water Quality Report", source_url: "https://www.cityofhenderson.com/home/showpublisheddocument/18097/639154026931400000", evidence_ids: ["HENDER-L-01"] },
    source_water: { text: "All Henderson water comes from the Colorado River at Lake Mead, treated by the Southern Nevada Water Authority.",
      source_title: "City of Henderson water source document", source_url: "https://www.cityofhenderson.com/home/showpublisheddocument/18284/639184439008070000", evidence_ids: ["HENDER-L-02"] },
  },
  'san-antonio': {
    disinfectant: { text: "SAWS keeps a free chlorine residual, averaging 1.46 ppm in 2025.", kind: "chlorine",
      source_title: "SAWS 2026 Water Quality Report", source_url: "https://www.saws.org/wp-content/uploads/2026/06/2026-SAWS-Water-Quality-Report.pdf", evidence_ids: ["SANANT-L-01"] },
    source_water: { text: "Most SAWS water is groundwater from the Edwards, Carrizo, Simsboro, Trinity and Wilcox aquifers, with Canyon Lake surface water in some areas.",
      source_title: "SAWS 2026 Water Quality Report", source_url: "https://www.saws.org/wp-content/uploads/2026/06/2026-SAWS-Water-Quality-Report.pdf", evidence_ids: ["SANANT-L-02"] },
  },
  'austin': {
    disinfectant: { text: "Austin Water lists chloramine as the disinfectant that controls microbes.", kind: "chloramine",
      source_title: "Austin Water 2025 Water Quality Report", source_url: "https://www.austintexas.gov/water/programs/water-quality-reports", evidence_ids: ["AUSTIN-L-01"] },
    source_water: { text: "Austin Water draws from the Lower Colorado River as it flows through Lake Travis and Lake Austin.",
      source_title: "Austin Water 2025 Water Quality Report", source_url: "https://www.austintexas.gov/water/programs/water-quality-reports", evidence_ids: ["AUSTIN-L-02"] },
    softening: { text: "Yes. Austin Water uses lime softening, which it says also helps coat pipes against corrosion.",
      source_title: "Austin Water 2025 Water Quality Report", source_url: "https://www.austintexas.gov/water/programs/water-quality-reports", evidence_ids: ["AUSTIN-L-03"] },
  },
  'houston': {
    disinfectant: { text: "The main Houston system uses chloramine. Some smaller city systems served only by wells, such as Kingwood, use chlorine.", kind: "varies",
      source_title: "Houston 2025 Water Quality Report", source_url: "https://www.houstonpublicworks.org/sites/g/files/nwywnm456/files/doc/003_2025_houston_water_quality_report.pdf", evidence_ids: ["HOUSTO-L-01"] },
    source_water: { text: "The main system draws mostly surface water from the Trinity River (Lake Livingston) and San Jacinto River (Lake Conroe and Lake Houston), plus deep wells in the Evangeline and Chicot aquifers.",
      source_title: "Houston 2025 Water Quality Report", source_url: "https://www.houstonpublicworks.org/sites/g/files/nwywnm456/files/doc/003_2025_houston_water_quality_report.pdf", evidence_ids: ["HOUSTO-L-02"] },
    service: { text: "Houston Public Works runs six separate water systems: the main system, Kingwood, Willow Chase, District 73, District 82 and Belleau Woods, which buys water from Humble. Each has its own results in the report.",
      source_title: "Houston 2025 Water Quality Report", source_url: "https://www.houstonpublicworks.org/sites/g/files/nwywnm456/files/doc/003_2025_houston_water_quality_report.pdf", evidence_ids: ["HOUSTO-L-03"] },
  },
  'allentown': {
    disinfectant: { text: "Lehigh County Authority uses chlorine as its main disinfectant in Allentown.", kind: "chlorine",
      source_title: "Lehigh County Authority, Allentown Division 2025 Water Quality Report", source_url: "https://lcawaterworks.org/wp-content/uploads/ALD.pdf", evidence_ids: ["ALLENT-L-01"] },
    source_water: { text: "Allentown water comes from Crystal Spring and Schantz Spring plus the Little Lehigh Creek and the Lehigh River.",
      source_title: "Lehigh County Authority, Allentown Division 2025 Water Quality Report", source_url: "https://lcawaterworks.org/wp-content/uploads/ALD.pdf", evidence_ids: ["ALLENT-L-02"] },
  },
  'boston': {
    disinfectant: { text: "MWRA, which supplies Boston, disinfects with monochloramine, a compound of chlorine and ammonia.", kind: "chloramine",
      source_title: "MWRA 2025 Annual Water Quality Test Results", source_url: "https://www.mwra.com/node/8620", evidence_ids: ["BOSTON-L-01"] },
    source_water: { text: "Boston water comes from MWRA's Quabbin and Wachusett reservoirs in central Massachusetts and is delivered by the Boston Water and Sewer Commission.",
      source_title: "MWRA 2025 Annual Water Quality Test Results", source_url: "https://www.mwra.com/node/8620", evidence_ids: ["BOSTON-L-02"] },
    seasonal: { text: "MWRA says a chlorine smell is more likely in summer, when water is warmer, and that algae in its reservoirs can cause an earthy taste in spring and fall.",
      source_title: "MWRA tap water FAQ", source_url: "https://www.mwra.com/your-water-system/drinking-water-quality/frequently-asked-questions-about-mwra-tap-water", evidence_ids: ["BOSTON-L-03"] },
  },
  'charlotte': {
    disinfectant: { text: "Charlotte Water adds chlorine to prevent bacterial growth.", kind: "chlorine",
      source_title: "Charlotte Water 2025 Annual Drinking Water Quality Report", source_url: "https://www.charlottenc.gov/files/sharedassets/cltwater/v/3/documents/water-quality/ccr/current-consumer-confidence-report.pdf", evidence_ids: ["CHARLO-L-01"] },
    source_water: { text: "Charlotte water comes from Mountain Island Lake and Lake Norman on the Catawba River.",
      source_title: "Charlotte Water 2025 Annual Drinking Water Quality Report", source_url: "https://www.charlottenc.gov/files/sharedassets/cltwater/v/3/documents/water-quality/ccr/current-consumer-confidence-report.pdf", evidence_ids: ["CHARLO-L-02"] },
  },
  'cincinnati': {
    disinfectant: { text: "Greater Cincinnati Water Works treats with ultraviolet light and chlorine.", kind: "chlorine",
      source_title: "Greater Cincinnati Water Works water quality reports page", source_url: "https://www.cincinnati-oh.gov/water/water-quality-and-treatment/water-quality-reports/", evidence_ids: ["CINCIN-L-01"] },
    source_water: { text: "About 88 percent of Cincinnati water is Ohio River water from the Miller plant, and the rest is groundwater from the Great Miami Buried Valley Aquifer.",
      source_title: "Greater Cincinnati Water Works water quality reports page", source_url: "https://www.cincinnati-oh.gov/water/water-quality-and-treatment/water-quality-reports/", evidence_ids: ["CINCIN-L-02"] },
  },
  'washington-dc': {
    disinfectant: { text: "For most of the year, the Washington Aqueduct uses chloramine to keep DC water disinfected.", kind: "chloramine",
      source_title: "DC Water 2026 Drinking Water Quality Report", source_url: "https://www.dcwater.com/waterreport", evidence_ids: ["WASHIN-L-01"] },
    source_water: { text: "DC water comes from the Potomac River, treated by the Washington Aqueduct and bought by DC Water.",
      source_title: "DC Water 2026 Drinking Water Quality Report", source_url: "https://www.dcwater.com/waterreport", evidence_ids: ["WASHIN-L-02"] },
    seasonal: { text: "For a short time each spring, the Aqueduct switches from chloramine to chlorine only.",
      source_title: "DC Water 2026 Drinking Water Quality Report", source_url: "https://www.dcwater.com/waterreport", evidence_ids: ["WASHIN-L-03"] },
  },
  'denver': {
    disinfectant: { text: "Denver Water adds chloramine after filtration to keep the water disinfected.", kind: "chloramine",
      source_title: "Denver Water treated water quality summary", source_url: "https://www.denverwater.org/your-water/water-quality/treated-water-quality-summary", evidence_ids: ["DENVER-L-01"] },
    source_water: { text: "Denver Water draws on rivers, streams, reservoirs and springs fed by mountain snowmelt, gathered through a north and a south collection system.",
      source_title: "Denver Water 2026 Water Quality Report", source_url: "https://www.denverwater.org/sites/default/files/water-quality-report-2026.pdf", evidence_ids: ["DENVER-L-02"] },
    seasonal: { text: "Denver Water says its water is slightly harder in winter, when waterways and reservoirs freeze, and softer from late spring through fall, when runoff dilutes the minerals.",
      source_title: "Denver Water water hardness page", source_url: "https://www.denverwater.org/your-water/water-quality/water-hardness", evidence_ids: ["DENVER-L-03"] },
  },
  'detroit': {
    disinfectant: { text: "The Detroit report lists a chlorine residual added to control microbes, ranging 0.59 to 1.08 ppm in 2025. It does not mention chloramine.", kind: "chlorine",
      source_title: "DWSD 2025 Water Quality Report", source_url: "https://detroitmi.gov/sites/detroitmi.localhost/files/2026-06/DWSD%20-%20WQR%20-%202025%20-%20Final%20-1.pdf", evidence_ids: ["DETROI-L-01"] },
    source_water: { text: "Detroit homes get Detroit River water treated at four Great Lakes Water Authority plants.",
      source_title: "DWSD 2025 Water Quality Report", source_url: "https://detroitmi.gov/sites/detroitmi.localhost/files/2026-06/DWSD%20-%20WQR%20-%202025%20-%20Final%20-1.pdf", evidence_ids: ["DETROI-L-02"] },
    service: { text: "The Great Lakes Water Authority treats the water and moves it to the city, and the Detroit Water and Sewerage Department delivers it to neighborhoods.",
      source_title: "DWSD 2025 Water Quality Report", source_url: "https://detroitmi.gov/sites/detroitmi.localhost/files/2026-06/DWSD%20-%20WQR%20-%202025%20-%20Final%20-1.pdf", evidence_ids: ["DETROI-L-03"] },
  },
  'indianapolis': {
    disinfectant: { text: "Citizens Energy Group adds chlorine and a small amount of ammonia, and lists chloramine as the additive that controls microbes.", kind: "chloramine",
      source_title: "Citizens Energy Group 2025 Water Quality Report", source_url: "https://info.citizensenergygroup.com/hubfs/site/water/2025%20Citizens%20Water%20Quality%20Report.pdf", evidence_ids: ["INDIAN-L-01"] },
    source_water: { text: "Most Indianapolis water is surface water from the West Fork of the White River, Fall Creek and Eagle Creek Reservoir, with Morse and Geist reservoirs, plus groundwater from wells.",
      source_title: "Citizens Energy Group 2025 Water Quality Report", source_url: "https://info.citizensenergygroup.com/hubfs/site/water/2025%20Citizens%20Water%20Quality%20Report.pdf", evidence_ids: ["INDIAN-L-02"] },
    by_area: { text: "Citizens says hardness varies with the source water feeding each treatment plant, so it can differ by where you live.",
      source_title: "Citizens Energy Group 2025 Water Quality Report", source_url: "https://info.citizensenergygroup.com/hubfs/site/water/2025%20Citizens%20Water%20Quality%20Report.pdf", evidence_ids: ["INDIAN-L-03"] },
  },
  'los-angeles': {
    disinfectant: { text: "LADWP disinfects its drinking water with chloramine.", kind: "chloramine",
      source_title: "LADWP 2026 Drinking Water Quality Report", source_url: "https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf", evidence_ids: ["LOSANG-L-01"] },
    source_water: { text: "In 2025, 44 percent of LADWP water came from the Los Angeles Aqueduct, 52 percent was bought from the Metropolitan Water District (State Water Project and Colorado River), 1 percent was local groundwater and 3 percent was recycled water.",
      source_title: "LADWP 2026 Drinking Water Quality Report", source_url: "https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf", evidence_ids: ["LOSANG-L-02"] },
    by_area: { text: "LADWP reports by community zone, and says the sources serving a zone can change with operations and supply, so water differs across the city.",
      source_title: "LADWP 2026 Drinking Water Quality Report", source_url: "https://www.ladwp.com/sites/default/files/2026-07/2026_DWQR_Print_Rev2_Digital-remediated.pdf", evidence_ids: ["LOSANG-L-03"] },
  },
  'madison': {
    disinfectant: { text: "Madison Water Utility disinfects with chlorine and says it does not use chloramine.", kind: "chlorine",
      source_title: "Madison Water Utility water quality FAQ", source_url: "https://www.cityofmadison.com/water/water-quality/faq", evidence_ids: ["MADISO-L-01"] },
    source_water: { text: "Madison water is all groundwater, pumped by 21 active wells from a deep sandstone aquifer under the city.",
      source_title: "Madison Water Utility water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/WaterQualityEnglish.pdf", evidence_ids: ["MADISO-L-02"] },
    by_area: { text: "Each Madison well serves its own part of town, and the utility publishes a separate quality report for each well, so water differs by neighborhood.",
      source_title: "Madison Water Utility water quality report", source_url: "https://www.cityofmadison.com/water/documents/water-quality/WaterQualityEnglish.pdf", evidence_ids: ["MADISO-L-03"] },
  },
  'minneapolis': {
    disinfectant: { text: "Minneapolis disinfects with chlorine and lists a chloramine residual in its 2025 water data.", kind: "chloramine",
      source_title: "Minneapolis 2025 Record of Data", source_url: "https://www.minneapolismn.gov/media/-www-content-assets/documents/2025-Record-of-Data-on-new-ltrhead.pdf", evidence_ids: ["MINNEA-L-01"] },
    source_water: { text: "Minneapolis water comes from the Mississippi River.",
      source_title: "Minneapolis 2025 Consumer Confidence Report", source_url: "https://www.minneapolismn.gov/media/-www-content-assets/documents/2025-CCR-Revised-%282%29.pdf", evidence_ids: ["MINNEA-L-02"] },
    softening: { text: "Yes. The city says its treatment removes 65,000 pounds of hardness from the water each day.",
      source_title: "Minneapolis water treatment and delivery page", source_url: "https://www.minneapolismn.gov/government/departments/public-works/water-treatment-distribution/treatment-delivery/", evidence_ids: ["MINNEA-L-03"] },
  },
  'new-york': {
    disinfectant: { text: "New York City disinfects with chlorine, and Croton water also gets ultraviolet light. The 2025 report does not mention chloramine.", kind: "chlorine",
      source_title: "NYC 2025 Drinking Water Supply and Quality Report", source_url: "https://www.nyc.gov/assets/dep/downloads/pdf/water/drinking-water/drinking-water-supply-quality-report/2025-drinking-water-supply-quality-report.pdf", evidence_ids: ["NEWYOR-L-01"] },
    source_water: { text: "New York City water comes from upstate reservoirs: the Catskill and Delaware systems supplied 91.3 percent in 2025 and the Croton system 8.7 percent.",
      source_title: "NYC 2025 Drinking Water Supply and Quality Report", source_url: "https://www.nyc.gov/assets/dep/downloads/pdf/water/drinking-water/drinking-water-supply-quality-report/2025-drinking-water-supply-quality-report.pdf", evidence_ids: ["NEWYOR-L-02"] },
  },
  'orlando': {
    disinfectant: { text: "OUC treats with ozone first, which lets it use less chlorine. It lists chlorine at an average 1.0 ppm and says it does not use chloramine.", kind: "chlorine",
      source_title: "OUC water services page", source_url: "https://www.ouc.com/about/water-services/", evidence_ids: ["ORLAND-L-01"] },
    source_water: { text: "OUC water comes from the Lower Floridan Aquifer.",
      source_title: "OUC water services page", source_url: "https://www.ouc.com/about/water-services/", evidence_ids: ["ORLAND-L-02"] },
    service: { text: "OUC serves the City of Orlando and parts of Orange County.",
      source_title: "OUC water services page", source_url: "https://www.ouc.com/about/water-services/", evidence_ids: ["ORLAND-L-03"] },
  },
  'philadelphia': {
    disinfectant: { text: "Philadelphia Water Department disinfects with chloramine, a combination of chlorine and ammonia.", kind: "chloramine",
      source_title: "Philadelphia Water Department 2025 water quality report", source_url: "https://water.phila.gov/2025-quality", evidence_ids: ["PHILAD-L-01"] },
    source_water: { text: "The Baxter plant draws from the Delaware River, and the Queen Lane and Belmont plants draw from the Schuylkill.",
      source_title: "Philadelphia Water Department 2025 water quality report", source_url: "https://water.phila.gov/2025-quality", evidence_ids: ["PHILAD-L-02"] },
    by_area: { text: "Hardness depends on which treatment plant serves your part of the city, and the department says seasonal changes can affect taste and odor.",
      source_title: "Philadelphia Water Department 2025 water quality report", source_url: "https://water.phila.gov/2025-quality", evidence_ids: ["PHILAD-L-03"] },
  },
  'riverside': {
    disinfectant: { text: "Riverside Public Utilities lists chlorine as its disinfectant. The 2025 report does not mention chloramine.", kind: "chlorine",
      source_title: "Riverside Public Utilities 2025 Water Quality Report", source_url: "https://www.riversideca.gov/utilities/sites/riversideca.gov.utilities/files/pdf/water-quality/2025%20Water%20Quality%20Report.pdf", evidence_ids: ["RIVERS-L-01"] },
    source_water: { text: "Riverside water is local groundwater from the Bunker Hill and Riverside basins.",
      source_title: "Riverside Public Utilities 2025 Water Quality Report", source_url: "https://www.riversideca.gov/utilities/sites/riversideca.gov.utilities/files/pdf/water-quality/2025%20Water%20Quality%20Report.pdf", evidence_ids: ["RIVERS-L-02"] },
  },
  'san-diego': {
    disinfectant: { text: "San Diego uses chloramine to keep water disinfected in the pipes, after ozone or chlorine dioxide treatment at its plants.", kind: "chloramine",
      source_title: "City of San Diego 2025 Annual Drinking Water Quality Report", source_url: "https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf", evidence_ids: ["SANDIE-L-01"] },
    source_water: { text: "Most San Diego water is imported through the County Water Authority, mainly a Colorado River and State Water Project blend, with local reservoir water, treated at the Alvarado, Miramar and Otay plants.",
      source_title: "City of San Diego 2025 Annual Drinking Water Quality Report", source_url: "https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf", evidence_ids: ["SANDIE-L-02"] },
    seasonal: { text: "The city says the share of water from each source changes through the year.",
      source_title: "City of San Diego 2025 Annual Drinking Water Quality Report", source_url: "https://www.sandiego.gov/sites/default/files/2026-06/pud-annual-drinking-water-quality-report-2025.pdf", evidence_ids: ["SANDIE-L-03"] },
  },
  'san-francisco': {
    disinfectant: { text: "SFPUC disinfects with ultraviolet light and chlorine and keeps the water disinfected in the pipes with chloramine.", kind: "chloramine",
      source_title: "SFPUC 2025 Water Quality Report", source_url: "https://www.sfpuc.gov/vi/sites/default/files/accounts-and-services/water-quality/water-quality-en-SF-2025.pdf", evidence_ids: ["SANFRA-L-01"] },
    source_water: { text: "Hetch Hetchy Reservoir supplies up to 85 percent of San Francisco water each year, with the rest from Bay Area reservoirs and a small amount of local groundwater.",
      source_title: "SFPUC 2025 Water Quality Report", source_url: "https://www.sfpuc.gov/vi/sites/default/files/accounts-and-services/water-quality/water-quality-en-SF-2025.pdf", evidence_ids: ["SANFRA-L-02"] },
    seasonal: { text: "SFPUC says blending different sources through the year gave varying water quality.",
      source_title: "SFPUC 2025 Water Quality Report", source_url: "https://www.sfpuc.gov/vi/sites/default/files/accounts-and-services/water-quality/water-quality-en-SF-2025.pdf", evidence_ids: ["SANFRA-L-03"] },
  },
  'seattle': {
    disinfectant: { text: "Seattle Public Utilities lists free chlorine in both its Cedar and Tolt supplies. Its reports do not mention chloramine.", kind: "chlorine",
      source_title: "SPU quarterly surface water analysis, May 2026", source_url: "https://www.seattle.gov/documents/Departments/SPU/Services/Water/Analyses/SPU_Quarterly-Surface-Water-Analysis_05-20-2026.pdf", evidence_ids: ["SEATTL-L-01"] },
    source_water: { text: "In 2025, 62 percent of Seattle water came from the Cedar River and 38 percent from the South Fork Tolt River.",
      source_title: "SPU 2025 Drinking Water Quality Report", source_url: "https://seattle.gov/documents/Departments/SPU/AboutUs/Reports/Water%20Quality/SPU-Drinking-Water-Quality-Report_2025.pdf", evidence_ids: ["SEATTL-L-02"] },
    by_area: { text: "Homes south of Green Lake usually get Cedar River water, and areas north of Green Lake usually get Tolt water, though either source can serve other areas.",
      source_title: "SPU 2025 Drinking Water Quality Report", source_url: "https://seattle.gov/documents/Departments/SPU/AboutUs/Reports/Water%20Quality/SPU-Drinking-Water-Quality-Report_2025.pdf", evidence_ids: ["SEATTL-L-03"] },
  },
  'st-louis': {
    disinfectant: { text: "The St. Louis report lists chloramine as a treatment additive, at 1.67 to 3.46 ppm in 2025.", kind: "chloramine",
      source_title: "St. Louis Water Division Consumer Confidence Report", source_url: "https://www.stlwater.com/ccr.pdf", evidence_ids: ["STLOUI-L-01"] },
    source_water: { text: "The Chain of Rocks plant draws from the Mississippi River and the Howard Bend plant from the Missouri River.",
      source_title: "St. Louis Water Division Consumer Confidence Report", source_url: "https://www.stlwater.com/ccr.pdf", evidence_ids: ["STLOUI-L-02"] },
    softening: { text: "Yes. The city report lists precipitative softening as part of treatment.",
      source_title: "St. Louis Water Division Consumer Confidence Report", source_url: "https://www.stlwater.com/ccr.pdf", evidence_ids: ["STLOUI-L-03"] },
  },
  'tampa': {
    disinfectant: { text: "Tampa adds ammonia to make chloramine so the water stays disinfected through the pipes.", kind: "chloramine",
      source_title: "Tampa 2024 Water Quality Report", source_url: "https://www.tampa.gov/sites/default/files/document/2025/2024-water-quality-report-ada-compliant.pdf", evidence_ids: ["TAMPA-L-01"] },
    source_water: { text: "Tampa relies mainly on the Hillsborough River, plus treated water stored in aquifer wells and a small share bought from Tampa Bay Water (2.5 percent in 2024).",
      source_title: "Tampa 2024 Water Quality Report", source_url: "https://www.tampa.gov/sites/default/files/document/2025/2024-water-quality-report-ada-compliant.pdf", evidence_ids: ["TAMPA-L-02"] },
    seasonal: { text: "The city says hardness is lower in the wet season and higher in the dry season.",
      source_title: "City of Tampa, Understanding Water Hardness", source_url: "https://www.tampa.gov/sites/default/files/document/2026/understanding-water-hardness.pdf", evidence_ids: ["TAMPA-L-03"] },
  },
};

export const localOf = (slug: string): LocalDetails => LOCAL_DETAILS[slug] ?? {};
