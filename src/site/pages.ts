import { takesRequests, type MarketConfig } from '../domain/config.ts';
import { serviceDisclosure, smsDisclosure } from '../intake/disclosure.ts';
import { escapeHtml as e } from '../util.ts';
import { STATIC_PAGES } from '../../content/pages.ts';
import { LOCATIONS } from '../../content/locations.ts';
import { areaDirectory } from './locations.ts';
import company from '../../config/company.json';
import { cityHref, CITY_SITES } from '../../content/sites.ts';

type Vals = Record<string, string | undefined>;

const opt = (name: string, value: string, label: string, vals: Vals, type = 'radio') =>
  `<label class="choice"><input type="${type}" name="${name}" value="${value}"${vals[name] === value ? ' checked' : ''}> <span>${label}</span></label>`;
const err = (errors: Record<string, string>, k: string) => (errors[k] ? `<p class="err" id="${k}-err">${e(errors[k]!)}</p>` : '');
const aria = (errors: Record<string, string>, k: string) => (errors[k] ? ` aria-invalid="true" aria-describedby="${k}-err"` : '');

// The form is only ever shown for one market, so the consent text the person sees names the
// exact party it is stored against. Intake rejects a submission whose ZIP belongs to another market.
export function inquiryForm(o: { requestId: string; market: MarketConfig; vals?: Vals; errors?: Record<string, string>; page: string; brand?: string }): string {
  const v = o.vals ?? {}, er = o.errors ?? {};
  const m = o.market;
  const party = m.business_mode === 'direct' ? 'My Home Water System' : m.seller_display_name;
  const disclosure = serviceDisclosure(m);
  const sms = smsDisclosure(m);
  return `<form class="inquiry" method="post" action="/api/inquiry" id="request" novalidate data-boilerplate>
<h2 style="margin-top:0">Request a quote</h2>
${party ? `<p class="small">Your request goes to <strong>${e(party)}</strong>.</p>` : '<p class="small">A local specialist will contact you about your request.</p>'}
${o.brand ? `<p class="small">${e(o.brand)} is run by My Home Water System.</p>` : ''}
${Object.keys(er).length ? '<p class="err" role="alert">Please fix the items marked below.</p>' : ''}
<input type="hidden" name="request_id" value="${e(o.requestId)}"><input type="hidden" name="page" value="${e(o.page)}"><input type="hidden" name="market" value="${e(m.id)}">
<div class="hp" aria-hidden="true"><label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
<label class="f" for="zip">ZIP code</label><input type="text" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5" value="${e(v.zip ?? '')}"${aria(er, 'zip')}>${err(er, 'zip')}
<fieldset${aria(er, 'homeowner')}><legend>Do you own the home or have authority to approve work on it?</legend>${opt('homeowner', 'yes', 'Yes', v)}${opt('homeowner', 'no', 'No', v)}${err(er, 'homeowner')}</fieldset>
<label class="f" for="concern">Main concern</label><select id="concern" name="concern"${aria(er, 'concern')}><option value="">Choose one</option>
${[['hardness', 'Scale or hard water'], ['taste_odor', 'Taste or odor'], ['drinking_water', 'Drinking water filtration'], ['not_sure', 'Not sure yet']]
  .map(([val, l]) => `<option value="${val}"${v.concern === val ? ' selected' : ''}>${l}</option>`).join('')}</select>${err(er, 'concern')}
<fieldset><legend>Water source</legend>${opt('water_source', 'municipal', 'City or utility water', v)}${opt('water_source', 'well', 'Private well', v)}${opt('water_source', 'unknown', "I'm not sure", v)}${err(er, 'water_source')}</fieldset>
<label class="f" for="first_name">First name</label><input type="text" id="first_name" name="first_name" autocomplete="given-name" value="${e(v.first_name ?? '')}"${aria(er, 'first_name')}>${err(er, 'first_name')}
<label class="f" for="last_name">Last name</label><input type="text" id="last_name" name="last_name" autocomplete="family-name" value="${e(v.last_name ?? '')}"${aria(er, 'last_name')}>${err(er, 'last_name')}
<fieldset><legend>How should we contact you?</legend>${opt('contact_method', 'phone', 'Phone call', v)}${opt('contact_method', 'email', 'Email', v)}${err(er, 'contact_method')}</fieldset>
<label class="f" for="phone">Phone</label><input type="tel" id="phone" name="phone" autocomplete="tel" value="${e(v.phone ?? '')}"${aria(er, 'phone')}>${err(er, 'phone')}
<label class="f" for="email">Email</label><input type="email" id="email" name="email" autocomplete="email" value="${e(v.email ?? '')}"${aria(er, 'email')}>${err(er, 'email')}
<label class="f" for="timing">Timing</label><select id="timing" name="timing"><option value="">Choose one (optional)</option>
${[['soon', 'As soon as possible'], ['months', 'In the next few months'], ['researching', 'Just researching']]
  .map(([val, l]) => `<option value="${val}"${v.timing === val ? ' selected' : ''}>${l}</option>`).join('')}</select>
<label class="f" for="note">Anything about your current system? (optional)</label><textarea id="note" name="note" rows="3" maxlength="500">${e(v.note ?? '')}</textarea>
<p class="small">Please do not include payment, financing, medical or Social Security information.</p>
<label class="choice"><input type="checkbox" name="consent_service" value="yes"${v.consent_service === 'yes' ? ' checked' : ''}${aria(er, 'consent_service')}> <span>${e(disclosure)} <a href="/privacy/">Privacy</a></span></label>${err(er, 'consent_service')}
<label class="choice"><input type="checkbox" name="consent_sms" value="yes"${v.consent_sms === 'yes' ? ' checked' : ''}> <span>${e(sms)}</span></label>${err(er, 'consent_sms')}
<p><button type="submit">Send my request</button></p>
</form>`;
}

export function homeBody(markets: MarketConfig[]): string {
  const live = markets.filter(takesRequests);
  return `<div class="grid two"><div>
<h1>Water treatment options for your home</h1>
<p>Compare water softening, whole-home filtration and drinking-water systems. Tell us about your home, and we will connect you with the installing company that serves your area for a written recommendation and quote.</p>
<p>${live.length ? `We currently take requests in: ${live.map((m) => `<a href="/locations/${e(m.slug)}/">${e(m.name)}</a>`).join(', ')}.` : 'We are not taking requests in any area yet.'}</p>
${LOCATIONS.length ? `<h2>Local water by city</h2><p>${LOCATIONS.filter((l) => markets.some((m) => m.id === l.market_id)).map((l) => `<a href="${e(cityHref(l.slug))}">${e(l.name)}</a>`).join(', ')}</p>` : ''}
<div class="grid three" style="margin-top:20px">
<div class="card"><h3>Scale and hard water</h3><p><a href="/water-softeners/">About softeners</a></p></div>
<div class="card"><h3>Taste and odor</h3><p><a href="/whole-home-filtration/">About whole-home filters</a></p></div>
<div class="card"><h3>Drinking water</h3><p><a href="/reverse-osmosis/">About reverse osmosis</a></p></div></div>
</div><div><form class="inquiry" method="get" action="/check" id="request" data-boilerplate><h2 style="margin-top:0">Check your address</h2>
<label class="f" for="zip">ZIP code</label><input type="text" id="zip" name="zip" inputmode="numeric" autocomplete="postal-code" maxlength="5">
<p><button type="submit">Check availability</button></p><p class="small">We use your ZIP code only to find your service area.</p></form></div></div>`;
}

export function marketBody(m: MarketConfig, requestId: string, form?: { vals?: Vals; errors?: Record<string, string> }): string {
  const open = takesRequests(m);
  const who = m.seller_display_name;
  const rel = m.business_mode === 'direct'
    ? 'My Home Water System is the seller. Installation is performed by a licensed local installation partner. Your quote names who will do the work.'
    : `My Home Water System connects homeowners with ${e(who ?? '[dealer to be named]')}. ${e(who ?? 'The dealer')} provides your estimate, contract, installation and ongoing service.`;
  return `<div class="grid two"><div>
<h1>Water treatment options for your ${e(m.name)} home</h1>
<div class="disclosure" data-boilerplate><strong>Who you are working with.</strong> ${rel}</div>
<h2>How it works</h2><ol class="steps"><li>Send a request.</li><li>Assessment at your home.</li><li>Written quote with what is included and what is extra.</li><li>Installation and service.</li></ol>
<p>Booking an assessment is not a purchase.</p>
<h2>Local water</h2><p>Local utility water information for this area has not been reviewed yet. Conditions in an individual home can differ from a utility report.</p>
<h2>Pricing</h2><p>Quote only. You receive a written quote after the assessment.</p>
</div><div>${open ? inquiryForm({ requestId, market: m, page: `/locations/${m.slug}/`, ...form })
    : '<div class="card"><h2>Not open yet</h2><p>We are not accepting requests in this area yet.</p></div>'}</div></div>`;
}

export function serviceAreasBody(markets: MarketConfig[]): string {
  const rows = areaDirectory(markets);
  return `<h1>Service areas</h1><table><thead><tr><th>Area</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
<p>We list an area only when a qualified local company has agreed to serve it.</p>`;
}

// noDealer: the request is held with My Home Water System and no time is promised (Clint's direction, 2026-10-27).
export function thankYouBody(recipient: string, mode: string | null, duplicate: boolean, noDealer = false): string {
  return `<h1>Thanks. We received your request.</h1>
<p>${noDealer ? 'A local specialist will contact you by the method you chose.' : `${mode === 'direct' ? 'My Home Water System' : e(recipient)} will contact you by the method you chose during business hours.`}${duplicate ? ' It looks like you already have an open request with us, so a coordinator will check and avoid contacting you twice.' : ''}</p>
<p>Nothing is booked yet, and sending a request is not a purchase.</p>
<p>To change how we contact you, see <a href="/communication-preferences/">communication preferences</a>.</p>`;
}

export function outOfAreaBody(zip: string): string {
  return `<h1>We do not serve ${e(zip)} yet</h1><p>We did not store your request or share it with anyone. See <a href="/service-areas/">service areas</a> for where we work today.</p>`;
}

export function unavailableBody(phone?: string | null): string {
  return `<h1>We could not save your request</h1><p>Nothing was submitted. Please try again in a few minutes.${phone ? ` You can also call ${e(phone)}.` : ''}</p>`;
}

const pending = (v: string | null, label: string) => (v ? e(v) : `<em>${label} not yet published</em>`);

export function companyBody(kind: 'about' | 'contact'): string {
  if (kind === 'about') {
    return `<h1>About My Home Water System</h1><p>My Home Water System helps homeowners compare water treatment options and request quotes from a qualified local company. Each service-area page names the company that performs the work.</p>
<p>Legal entity: ${pending(company.legal_name, 'Legal name')}.</p>`;
  }
  const sites = CITY_SITES.map((s) => `<a href="${e(`https://${s.domain}/contact/`)}">${e(s.brand)}</a>`).join(', ');
  return `<h1>Contact</h1><p>Email: ${pending(company.public_email, 'Email')}</p>
<p>Each city's site lists its local phone number: ${sites}.</p>
<p>For a leak or loss of water at a home where a system was installed, call the installing company's service number on your paperwork first.</p>`;
}

// Privacy and terms text, drafted 2026-10-26 from what the build actually does. It stays marked
// draft until Clint approves this wording; then set LEGAL_APPROVED to the approval date.
const LEGAL_APPROVED: string | null = null;
const LEGAL_UPDATED = 'October 26, 2026';

function legalText(kind: 'privacy' | 'terms'): string {
  const mail = company.public_email ? `<a href="mailto:${e(company.public_email)}">${e(company.public_email)}</a>` : 'the email on our contact page';
  if (kind === 'privacy') {
    return `<p>My Home Water System and its city sites, such as KC Water Systems, are run by ${e(company.legal_name)}. Email ${mail} with any question about your information.</p>
<h2>What we collect</h2><p>When you send a request, we collect what you type into the form: your name, phone number, email, ZIP code, the water problem you describe, your timing, how you prefer to be contacted, and any note. We also keep a record of your consent: the exact wording you agreed to, its version, the companies it names, the page and the time.</p>
<h2>How we use it</h2><p>We use your information to answer your request, to call or text you about it by the method you chose, and to arrange an assessment with one local company.</p>
<h2>Who sees it</h2><p>Your request goes to one local company only: the one named when you agreed, or one you agree to later. Local companies pay us when they accept a request. Companies that run our systems for us also handle your information for that purpose only: Cloudflare hosts these sites and stores requests, and HighLevel holds our customer records and sends our calls and texts. We may also share information when the law requires it.</p>
<h2>Texts and calls</h2><p>Reply STOP to any text to stop texts. To stop calls or email, tell whoever contacts you, and we record it for every company handling your request.</p>
<h2>Cookies</h2><p>These sites do not use advertising or analytics cookies.</p>
<h2>Keeping and deleting</h2><p>We keep your request and consent record for as long as we need them to handle your request and to show what you agreed to. To ask us to delete your information, email ${mail}.</p>`;
  }
  return `<p>These terms cover your use of My Home Water System and its city sites, which are run by ${e(company.legal_name)}.</p>
<h2>What we do</h2><p>We help homeowners compare water treatment options and pass each request to one local company. We do not sell, install or service equipment.</p>
<h2>The local company</h2><p>Your estimate, contract, installation, warranty and service come from the local company, not from us. Its own terms apply to any work you buy from it. Local companies pay us when they accept a request.</p>
<h2>No obligation</h2><p>Sending a request or booking an assessment is not a purchase and does not commit you to anything.</p>
<h2>Water information</h2><p>Water figures on these sites are copied from published utility reports, with their dates and sources. Water at your home can differ, so these figures are general information and not a test of your water.</p>
<h2>Prices</h2><p>We do not publish prices. Quotes come from the local company after an assessment at your home.</p>
<h2>Changes</h2><p>We post any change on this page with a new date. Questions go to ${mail}.</p>`;
}

export function legalBody(kind: 'privacy' | 'terms' | 'communication-preferences'): string {
  const title = { privacy: 'Privacy', terms: 'Terms', 'communication-preferences': 'Communication preferences' }[kind];
  if (kind === 'communication-preferences') {
    return `<h1>${title}</h1><p>To stop text messages, reply STOP to any text. To stop calls or email, tell whoever contacts you, and we will record it for every company handling your request.</p>`;
  }
  const status = LEGAL_APPROVED ? `<p class="small">Last updated ${LEGAL_UPDATED}.</p>` : '<p><strong>Draft. This page is not in effect yet.</strong></p>';
  return `<h1>${title}</h1>${status}${legalText(kind)}`;
}

export { STATIC_PAGES };
