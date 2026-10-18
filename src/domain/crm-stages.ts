import type { State } from './states.ts';

// The CRM pipeline is deliberately coarser than the ledger. Create these stages in
// HighLevel and map their IDs in HIGHLEVEL_STAGE_MAP.
export const CRM_STAGES = ['New Inquiry', 'Assigned', 'Appointment', 'Assessed', 'Quoted', 'Sold',
  'Installed', 'Paid', 'On Hold', 'Lost'] as const;
export type CrmStage = (typeof CRM_STAGES)[number];

export function crmStageFor(state: State): { stage: CrmStage; status: 'open' | 'won' | 'lost' } | null {
  switch (state) {
    case 'received': case 'qualified': return { stage: 'New Inquiry', status: 'open' };
    case 'assignment_pending': case 'dealer_accepted': return { stage: 'Assigned', status: 'open' };
    case 'appointment_booked': return { stage: 'Appointment', status: 'open' };
    case 'appointment_held': return { stage: 'Assessed', status: 'open' };
    case 'quote_issued': return { stage: 'Quoted', status: 'open' };
    case 'customer_accepted': case 'install_scheduled': return { stage: 'Sold', status: 'open' };
    case 'installed': return { stage: 'Installed', status: 'open' };
    case 'collected': return { stage: 'Paid', status: 'won' };
    case 'duplicate_review': case 'consent_hold': case 'capacity_hold': case 'disputed':
    case 'out_of_area': case 'unsupported_scope':
      return { stage: 'On Hold', status: 'open' };
    case 'invalid': case 'no_response': case 'declined': case 'cancelled':
      return { stage: 'Lost', status: 'lost' };
    case 'closed': return null; // keep whatever won/lost stage it already has
  }
}
