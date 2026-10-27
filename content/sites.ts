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
  { domain: 'phoenixhomewatersystems.com', slug: 'phoenix', brand: 'Phoenix Home Water Systems' },
  // Added 2026-10-27: every remaining water domain Clint owns, held as not open.
  { domain: 'allentownwatersystems.com', slug: 'allentown', brand: 'Allentown Water Systems' },
  { domain: 'atlantawatersystems.com', slug: 'atlanta', brand: 'Atlanta Water Systems' },
  { domain: 'austinwatersystems.com', slug: 'austin', brand: 'Austin Water Systems' },
  { domain: 'baltimorewatersystems.com', slug: 'baltimore', brand: 'Baltimore Water Systems' },
  { domain: 'bostonwatersystems.com', slug: 'boston', brand: 'Boston Water Systems' },
  { domain: 'charlottewatersystems.com', slug: 'charlotte', brand: 'Charlotte Water Systems' },
  { domain: 'chicagowatersystems.com', slug: 'chicago', brand: 'Chicago Water Systems' },
  { domain: 'cincinnatiwatersystems.com', slug: 'cincinnati', brand: 'Cincinnati Water Systems' },
  { domain: 'dallaswatersystems.com', slug: 'dallas', brand: 'Dallas Water Systems' },
  { domain: 'dcwatersystems.com', slug: 'washington-dc', brand: 'DC Water Systems' },
  { domain: 'denverwatersystems.com', slug: 'denver', brand: 'Denver Water Systems' },
  { domain: 'detroitwatersystems.com', slug: 'detroit', brand: 'Detroit Water Systems' },
  { domain: 'fortworthwatersystems.com', slug: 'fort-worth', brand: 'Fort Worth Water Systems' },
  { domain: 'houstonhomewatersystems.com', slug: 'houston', brand: 'Houston Home Water Systems' },
  { domain: 'indianapoliswatersystems.com', slug: 'indianapolis', brand: 'Indianapolis Water Systems' },
  { domain: 'jacksonvillewatersystems.com', slug: 'jacksonville', brand: 'Jacksonville Water Systems' },
  { domain: 'losangeleswatersystems.com', slug: 'los-angeles', brand: 'Los Angeles Water Systems' },
  { domain: 'madisonwatersystems.com', slug: 'madison', brand: 'Madison Water Systems' },
  { domain: 'mcallenwatersystems.com', slug: 'mcallen', brand: 'McAllen Water Systems' },
  { domain: 'miamihomewatersystems.com', slug: 'miami', brand: 'Miami Home Water Systems' },
  { domain: 'minneapoliswatersystems.com', slug: 'minneapolis', brand: 'Minneapolis Water Systems' },
  { domain: 'nashvillewatersystems.com', slug: 'nashville', brand: 'Nashville Water Systems' },
  { domain: 'nycwatersystems.com', slug: 'new-york', brand: 'NYC Water Systems' },
  { domain: 'okcwatersystems.com', slug: 'oklahoma-city', brand: 'OKC Water Systems' },
  { domain: 'orlandowatersystems.com', slug: 'orlando', brand: 'Orlando Water Systems' },
  { domain: 'philadelphiawatersystems.com', slug: 'philadelphia', brand: 'Philadelphia Water Systems' },
  { domain: 'pittsburghwatersystems.com', slug: 'pittsburgh', brand: 'Pittsburgh Water Systems' },
  { domain: 'riversidehomewatersystems.com', slug: 'riverside', brand: 'Riverside Home Water Systems' },
  { domain: 'sandiegowatersystems.com', slug: 'san-diego', brand: 'San Diego Water Systems' },
  { domain: 'sanfranciscowatersystems.com', slug: 'san-francisco', brand: 'San Francisco Water Systems' },
  { domain: 'seattlewatersystems.com', slug: 'seattle', brand: 'Seattle Water Systems' },
  { domain: 'stlouiswatersystems.com', slug: 'st-louis', brand: 'St. Louis Water Systems' },
  { domain: 'tucsonwatersystems.com', slug: 'tucson', brand: 'Tucson Water Systems' },
];

// Second domains for a city that already has a site. They forward to it so the two never compete.
export const ALIAS_DOMAINS: Record<string, string> = {
  'lawatersystems.com': 'losangeleswatersystems.com',
};

// State directory sites: one page that lists that state's city sites and their published water.
export interface StateSite { domain: string; state: string; stateName: string; brand: string }
export const STATE_SITES: StateSite[] = [
  { domain: 'californiawatersystems.com', state: 'CA', stateName: 'California', brand: 'California Water Systems' },
];

export const normalizeHost = (host: string): string => host.toLowerCase().replace(/:\d+$/, '');
export const apexOf = (host: string): string => normalizeHost(host).replace(/^www\./, '');

export const siteForHost = (host: string): CitySite | undefined => CITY_SITES.find((s) => s.domain === apexOf(host));
export const aliasTarget = (host: string): string | undefined => ALIAS_DOMAINS[apexOf(host)];
export const stateSiteForHost = (host: string): StateSite | undefined => STATE_SITES.find((s) => s.domain === apexOf(host));
export const siteForSlug = (slug: string): CitySite | undefined => CITY_SITES.find((s) => s.slug === slug);
export const siteUrl = (s: CitySite): string => `https://${s.domain}`;
// Clint's call (2026-10-26): every site reads as "[City] Water Systems by My Home Water System".
export const fullBrand = (s: CitySite): string => `${s.brand} by ${HUB_BRAND}`;

// Where the hub links for a city: its own site if it has one, otherwise the hub's city page.
export const cityHref = (slug: string): string => {
  const s = siteForSlug(slug);
  return s ? `${siteUrl(s)}/` : `/locations/${slug}/`;
};
