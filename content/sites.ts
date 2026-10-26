// Standalone city sites. Each city domain serves its own site (home page, guides, contact) with its
// market's tracking number. The hub myhomewatersystem.com links out to these sites and serves cities
// that have no site of their own. Clint confirmed on 2026-10-26 that every domain here is his.
// sanantoniowatersystems.com is not his and is not listed. A domain only serves once its DNS points
// at this Worker, so an entry here does nothing on its own. See docs/domain-register.csv.
export interface CitySite {
  domain: string; // apex, lower case
  slug: string; // city slug in content/locations.ts
  brand: string; // shown in the header, titles and footer
}

export const HUB_DOMAIN = 'myhomewatersystem.com';
export const HUB_BRAND = 'My Home Water System';

export const CITY_SITES: CitySite[] = [
  { domain: 'mesawatersystems.com', slug: 'mesa', brand: 'Mesa Water Systems' },
  { domain: 'chandlerwatersystems.com', slug: 'chandler', brand: 'Chandler Water Systems' },
  { domain: 'gilbertwatersystems.com', slug: 'gilbert', brand: 'Gilbert Water Systems' },
  { domain: 'scottsdalewatersystems.com', slug: 'scottsdale', brand: 'Scottsdale Water Systems' },
  { domain: 'vegaswatersystems.com', slug: 'las-vegas', brand: 'Vegas Water Systems' },
  { domain: 'hendersonwatersystems.com', slug: 'henderson', brand: 'Henderson Water Systems' },
  { domain: 'sanantoniohomewatersystems.com', slug: 'san-antonio', brand: 'San Antonio Home Water Systems' },
  { domain: 'newbraunfelswatersystems.com', slug: 'new-braunfels', brand: 'New Braunfels Water Systems' },
  { domain: 'kcwatersystems.com', slug: 'kansas-city', brand: 'KC Water Systems' },
];

export const normalizeHost = (host: string): string => host.toLowerCase().replace(/:\d+$/, '');
export const apexOf = (host: string): string => normalizeHost(host).replace(/^www\./, '');

export const siteForHost = (host: string): CitySite | undefined => CITY_SITES.find((s) => s.domain === apexOf(host));
export const siteForSlug = (slug: string): CitySite | undefined => CITY_SITES.find((s) => s.slug === slug);
export const siteUrl = (s: CitySite): string => `https://${s.domain}`;

// Where the hub links for a city: its own site if it has one, otherwise the hub's city page.
export const cityHref = (slug: string): string => {
  const s = siteForSlug(slug);
  return s ? `${siteUrl(s)}/` : `/locations/${slug}/`;
};
