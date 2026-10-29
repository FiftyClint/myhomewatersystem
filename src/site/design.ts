// Which look a page renders in. Production keeps the classic look until Clint picks a direction
// (task "Make the water systems sites look premium", 2026-10-29). Staging previews A and B by cookie.
export type Design = 'classic' | 'a' | 'b';

export const DEFAULT_DESIGN: Design = 'classic';
export const DESIGNS: Design[] = ['classic', 'a', 'b'];
export const DESIGN_NAMES: Record<Design, string> = { classic: 'Current live look', a: 'Design A, Water report', b: 'Design B, Neighborhood' };

const valid = (d: string | null | undefined): d is Design => !!d && (DESIGNS as string[]).includes(d);

// Staging: the mhws_design cookie. Production: SITE_DESIGN when set to a known design, else the default.
export function designFor(cookie: string | null, siteDesign: string | undefined, staging: boolean): Design {
  if (staging) {
    const c = (cookie ?? '').match(/(?:^|;\s*)mhws_design=([a-z]+)/)?.[1];
    if (valid(c)) return c;
  }
  return valid(siteDesign) ? siteDesign : DEFAULT_DESIGN;
}

export const designCookie = (d: Design) => (d === DEFAULT_DESIGN
  ? 'mhws_design=; Path=/; Max-Age=0; Secure; HttpOnly; SameSite=Lax'
  : `mhws_design=${d}; Path=/; Max-Age=604800; Secure; HttpOnly; SameSite=Lax`);

export const parseDesign = (d: string | null | undefined): Design | null => (valid(d) ? d : null);
