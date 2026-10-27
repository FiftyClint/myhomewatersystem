// Pages that city and state sites serve noindex, and why. Same rules as the Powered Land Co
// network (poweredlandco src/lib/noindex.mjs), applied after Clint's direction of 2026-10-27.
//
// SYNDICATED: one text served on every domain. About and the legal pages describe one company, and
// the guides are the hub's own pages. Writing a version per city to please a checker would be a bad
// trade, so the copies stay identical and every site except the hub marks them noindex. Without that,
// Google picks one of the copies as canonical itself ("Duplicate, Google chose different canonical
// than user"), which is what Search Console reported for Powered Land Co on 2026-09-16.
//
// The layout, the sitemaps and the duplicate copy check all read this list, so they cannot drift.

export const SYNDICATED_PATHS = [
  '/about/', '/privacy/', '/terms/', '/communication-preferences/',
  '/water-softeners/', '/whole-home-filtration/', '/reverse-osmosis/', '/how-it-works/',
];

const clean = (path: string): string => `/${path.replace(/^\/+|\/+$/g, '')}/`.replace(/^\/\/$/, '/');

// True when a city or state site must serve this path noindex. The hub keeps these pages indexable.
export const isSyndicated = (path: string): boolean => SYNDICATED_PATHS.includes(clean(path));
