import { textsAllowed, type MarketConfig } from '../domain/config.ts';
import company from '../../config/company.json';

// DRAFT consent language. Clint approves the wording himself before launch; no counsel review (his call, 2026-10-26).
// Any wording change must bump policy.disclosure_version so stored proof matches what was shown.
// Drafting notes: docs/consent-draft.md.
// Markets with texts off name calls only.
const reach = (m: MarketConfig): string => textsAllowed(m) ? 'calls or texts' : 'calls';
const operator = (): string => `My Home Water System, operated by ${company.legal_name ?? '[legal name not set]'}`;

export function serviceDisclosure(m: MarketConfig): string {
  const us = operator();
  if (m.business_mode === 'direct') {
    return `By checking this box and submitting, you ask ${us}, to contact you about this request by the method you chose, ` +
      `including ${reach(m)} to the number you gave, which may use automated technology. ` +
      `My Home Water System is the seller. A licensed installation partner performs the installation. ` +
      `We will share your name, contact details and address with that installer only to schedule and complete your installation. ` +
      `Consent is not required to buy anything.`;
  }
  const party = m.seller_display_name;
  if (!party) {
    // Before a dealer signs in a market, requests stay with us. Sharing later needs the person's yes to the named dealer.
    return `By checking this box and submitting, you ask ${us}, to contact you about this request by the method you chose, ` +
      `including ${reach(m)} to the number you gave, which may use automated technology. ` +
      `No local dealer is named for your area yet. Before we share your request with a dealer, we will tell you the dealer's name and ask you first. ` +
      `We will never share your request with more than one dealer. Consent is not required to buy anything.`;
  }
  return `By checking this box and submitting, you ask ${us}, to share your request with one local dealer, ${party}, ` +
    `and you agree that ${party} and My Home Water System may contact you about this request by the method you chose, ` +
    `including ${reach(m)} to the number you gave, which may use automated technology. ` +
    `${party} provides your estimate, contract, installation and ongoing service. ` +
    `We will not share your request with any other company without asking you first. Consent is not required to buy anything.`;
}

export function smsDisclosure(m: MarketConfig): string {
  const us = `My Home Water System (${company.legal_name ?? '[legal name not set]'})`;
  const party = m.business_mode === 'direct' || !m.seller_display_name ? us : `${us} and ${m.seller_display_name}`;
  return `Optional: I agree to receive text messages from ${party} about this request at the number I gave, which may be sent with automated technology. ` +
    `Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not required to buy anything.`;
}
