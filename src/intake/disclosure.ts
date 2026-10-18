import type { MarketConfig } from '../domain/config.ts';

// DRAFT consent language. Must be reviewed by counsel before launch (launch checklist item).
// Any wording change must bump policy.disclosure_version so stored proof matches what was shown.
export function serviceDisclosure(m: MarketConfig): string {
  const party = m.seller_display_name ?? '[seller not yet named]';
  if (m.business_mode === 'direct') {
    return `By submitting, you ask My Home Water System to contact you about this request by the method you chose. ` +
      `My Home Water System is the seller. A licensed installation partner performs the installation. ` +
      `We will share your name, contact details and address with that installer only to schedule and complete your installation.`;
  }
  return `By submitting, you ask My Home Water System to share your request with ${party} and you agree that ` +
    `${party} and My Home Water System may contact you about this request by the method you chose. ` +
    `${party} provides your estimate, contract, installation and ongoing service. ` +
    `We will not share your request with any other company without asking you first.`;
}

export function smsDisclosure(m: MarketConfig): string {
  const party = m.business_mode === 'direct' ? 'My Home Water System' : `My Home Water System and ${m.seller_display_name ?? '[seller]'}`;
  return `Optional: I agree to receive text messages from ${party} about this request. ` +
    `Message frequency varies. Message and data rates may apply. Reply STOP to opt out. Consent is not required to get a quote.`;
}
