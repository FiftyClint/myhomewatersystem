import type { MarketConfig } from './config.ts';

// Clint, 2026-10-29 ("Yes, yes" to "should the form take every ZIP?"): a request from a ZIP that no open
// market serves is still stored and sent to Notion Water Leads, under this market so the row reads
// "no-dealer-assigned". Nothing routes it: it is stored in the out_of_area state, and the consent text
// is the no-dealer one, which names only My Home Water System and promises to ask before any sharing.
// Texts are off because the ZIP can be in any state (Texas markets have texts off, see texts_allowed).
// It is kept out of ctx.markets so pages, sitemaps and the cron never list it; marketById knows it.
// The timezone is a placeholder: no business-hours timer or message runs on an out_of_area lead.
export const NO_DEALER_ID = 'no-dealer-assigned';

export const NO_DEALER_MARKET: MarketConfig = {
  id: NO_DEALER_ID,
  slug: NO_DEALER_ID,
  name: 'No dealer assigned',
  status: 'active',
  config_version: '2026-10-29.1',
  launch_approval_id: 'clint-yes-any-zip-2026-10-29',
  business_mode: 'dealer_partner',
  timezone: 'America/New_York',
  zips: [],
  supported_concerns: ['hardness', 'taste_odor', 'drinking_water', 'not_sure'],
  accept_well_water: true,
  business_hours: { days: [1, 2, 3, 4, 5], start: '08:00', end: '17:00' },
  seller_display_name: null,
  tracking_phone: null,
  accept_before_dealer: true,
  texts_allowed: false,
  providers: [],
};

// A market whose form names only My Home Water System and has no dealer: its consent covers holding
// the request with us, which is all a no-dealer request does.
export const namesOnlyUs = (m: MarketConfig): boolean => m.business_mode === 'dealer_partner' && !m.seller_display_name;
