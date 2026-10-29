// General agency statements behind the "How is your water affecting you?" concern cards (Design B,
// 2026-10-29). Same rules as content/filtration.ts: our plain wording of what the cited page says, each
// with an evidence ID in docs/research/evidence.csv. Local figures stay in content/locations.ts,
// content/local-details.ts and content/filtration.ts; nothing here is about one city.

import type { LocalDetail } from './local-details.ts';

const USGS = { source_title: 'USGS Water Science School, Hardness of Water', source_url: 'https://www.usgs.gov/water-science-school/science/hardness-water' };
const WELLS = { source_title: "EPA, Protect Your Home's Water", source_url: 'https://www.epa.gov/privatewells/protect-your-homes-water' };
const WELL_RISKS = { source_title: 'EPA, Potential Well Water Contaminants and Their Impacts', source_url: 'https://www.epa.gov/privatewells/potential-well-water-contaminants-and-their-impacts' };
const CCR = { source_title: 'EPA, CCR Information for Consumers', source_url: 'https://www.epa.gov/ccr/ccr-information-consumers' };
const LCRR = { source_title: 'EPA, Revised Lead and Copper Rule', source_url: 'https://www.epa.gov/ground-water-and-drinking-water/revised-lead-and-copper-rule' };
const UCMR = { source_title: 'EPA UCMR 5 occurrence data', source_url: 'https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule' };
const SECONDARY = { source_title: 'EPA, Secondary Drinking Water Standards: Guidance for Nuisance Chemicals', source_url: 'https://www.epa.gov/sdwa/secondary-drinking-water-standards-guidance-nuisance-chemicals' };

export const CONCERN_GENERAL: Record<'hardness_effects' | 'well_testing' | 'well_nitrate' | 'well_bacteria' | 'iron' | 'check_report' | 'check_lead' | 'check_pfas', LocalDetail> = {
  hardness_effects: { text: 'USGS calls hardness a nuisance rather than a health concern. It leaves mineral buildup in plumbing, fixtures and water heaters, and it takes more soap to get things clean.',
    ...USGS, evidence_ids: ['GEN-C-01'] },
  well_testing: { text: 'EPA tells private well owners to test every year for total coliform bacteria, nitrates, total dissolved solids and pH.',
    ...WELLS, evidence_ids: ['GEN-C-02'] },
  well_nitrate: { text: 'EPA lists fertilizer, sewage and animal waste as sources of nitrate, and says high levels are most serious for infants.',
    ...WELL_RISKS, evidence_ids: ['GEN-C-03'] },
  well_bacteria: { text: 'EPA says well owners are responsible for protecting their own drinking water, and that bacteria, viruses and parasites in it can cause stomach illness.',
    ...WELL_RISKS, evidence_ids: ['GEN-C-04'] },
  iron: { text: "EPA's guideline for iron is 0.3 mg/L. Above it, water can turn rusty, taste metallic and leave reddish or orange stains. EPA does not treat it as a health risk at that level.",
    ...SECONDARY, evidence_ids: ['GEN-C-05'] },
  // How a homeowner anywhere checks their own water (hub, 2026-10-29): no city figure needed.
  check_report: { text: 'EPA requires community water systems to send customers an annual drinking water quality report, the Consumer Confidence Report, by July 1. It names where the water comes from and the regulated contaminants found in it. EPA says to call your water supplier if you did not get one.',
    ...CCR, evidence_ids: ['GEN-C-06'] },
  check_lead: { text: "EPA's revised lead rule required public water systems to prepare an inventory of service line materials by October 16, 2024, and to make public where their lead service lines are.",
    ...LCRR, evidence_ids: ['GEN-C-07'] },
  check_pfas: { text: "EPA's UCMR 5 tested public water systems for 29 PFAS and lithium from January 2023 through December 2025. EPA's Data Finder lets you look up results by water system name or by state.",
    ...UCMR, evidence_ids: ['GEN-C-08'] },
};
