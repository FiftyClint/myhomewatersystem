// City domains that forward to their page on the hub. Ownership is NOT verified for any of these:
// each was checked as registered at GoDaddy on 2026-10-24, which shows someone holds it, not that the
// owner does. See docs/domain-register.csv. A domain only forwards once its DNS points at this Worker,
// so an entry here does nothing on its own.
export const CITY_DOMAINS: Record<string, string> = {
  'mesawatersystems.com': 'mesa',
  'chandlerwatersystems.com': 'chandler',
  'gilbertwatersystems.com': 'gilbert',
  'scottsdalewatersystems.com': 'scottsdale',
  'vegaswatersystems.com': 'las-vegas',
  'hendersonwatersystems.com': 'henderson',
  'sanantoniohomewatersystems.com': 'san-antonio',
  'newbraunfelswatersystems.com': 'new-braunfels',
  'kcwatersystems.com': 'kansas-city',
};

export function cityRedirect(host: string, canonicalBase: string): string | null {
  const h = host.toLowerCase().replace(/^www\./, '').replace(/:\d+$/, '');
  const slug = CITY_DOMAINS[h];
  return slug ? `${canonicalBase}/locations/${slug}/` : null;
}
