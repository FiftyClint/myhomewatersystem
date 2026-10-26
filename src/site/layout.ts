import { escapeHtml as e } from '../util.ts';

export interface PageOpts {
  title: string; description: string; path: string; body: string;
  noindex?: boolean; banner?: string | null; baseUrl: string;
  // City sites pass their own brand and tracking number. The hub passes neither.
  brand?: string; phone?: string | null; canonical?: string; jsonLd?: object[];
}

// +16025550123 -> (602) 555-0123. Anything else is shown as stored.
export function displayPhone(e164: string): string {
  const m = e164.match(/^\+1(\d{3})(\d{3})(\d{4})$/);
  return m ? `(${m[1]}) ${m[2]}-${m[3]}` : e164;
}

// JSON-LD inside a script tag: escape < so content can never close the tag.
const ld = (o: object): string => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

const CSS = `
:root{--ink:#0f2742;--text:#24323f;--muted:#5b6b7a;--accent:#0f7c86;--accent-dark:#0b5f67;--line:#dbe3ea;--bg:#ffffff;--soft:#f3f7f9;--warn:#8a5a00;--warn-bg:#fff6e0;--err:#a1261b}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--text);font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--accent-dark)}h1,h2,h3{color:var(--ink);line-height:1.25}
h1{font-size:1.9rem;margin:.2em 0 .4em}h2{font-size:1.4rem;margin-top:1.8em}
.wrap{max-width:1040px;margin:0 auto;padding:0 16px}
header.site{border-bottom:1px solid var(--line)}
header.site .wrap{display:flex;flex-wrap:wrap;gap:8px 20px;align-items:center;justify-content:space-between;padding:14px 16px}
.brand{font-weight:700;color:var(--ink);text-decoration:none;font-size:1.1rem}
nav a{margin-right:14px;text-decoration:none;color:var(--text)}nav a:last-child{margin-right:0}nav a.phone{font-weight:700;color:var(--accent-dark)}
.answer{font-size:1.05rem;background:var(--soft);border-radius:10px;padding:14px 16px}
dl.faq dt{font-weight:700;color:var(--ink);margin-top:14px}dl.faq dd{margin:4px 0 0}
main{padding:24px 0 48px}
.banner{background:var(--warn-bg);color:var(--warn);border-bottom:1px solid #f0d9a0;padding:10px 0;font-size:.95rem}
.disclosure{background:var(--soft);border-left:4px solid var(--accent);padding:12px 16px;margin:16px 0}
.grid{display:grid;gap:16px}@media(min-width:760px){.grid.two{grid-template-columns:1.1fr .9fr}.grid.three{grid-template-columns:repeat(3,1fr)}}
.card{border:1px solid var(--line);border-radius:10px;padding:16px}
form.inquiry{border:1px solid var(--line);border-radius:12px;padding:18px;background:#fff}
fieldset{border:0;padding:0;margin:0 0 14px}legend,label.f{display:block;font-weight:600;color:var(--ink);margin:10px 0 4px}
input[type=text],input[type=email],input[type=tel],select,textarea{width:100%;font:inherit;padding:10px 12px;border:1px solid #9fb0bf;border-radius:8px;background:#fff;color:var(--text)}
input:focus,select:focus,textarea:focus,button:focus,a:focus{outline:3px solid #7cc4cb;outline-offset:2px}
.choice{display:flex;gap:10px;align-items:flex-start;margin:6px 0}.choice input{margin-top:5px;width:20px;height:20px;flex:none}
.err{color:var(--err);font-size:.92rem;margin:4px 0 0}
button,.btn{display:inline-block;background:var(--accent);color:#fff;border:0;border-radius:8px;padding:12px 20px;font:inherit;font-weight:600;cursor:pointer;text-decoration:none}
button:hover,.btn:hover{background:var(--accent-dark)}button.secondary{background:#fff;color:var(--accent-dark);border:1px solid var(--accent)}
.small{font-size:.9rem;color:var(--muted)}.hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
footer{border-top:1px solid var(--line);padding:24px 0;font-size:.92rem;color:var(--muted)}footer a{margin-right:14px}
ol.steps li{margin-bottom:8px}table{border-collapse:collapse;width:100%}td,th{border-bottom:1px solid var(--line);padding:8px;text-align:left;vertical-align:top}
`;

export function layout(o: PageOpts): string {
  const canonical = o.canonical ?? `${o.baseUrl}${o.path}`;
  const city = !!o.brand;
  const brand = o.brand ?? 'My Home Water System';
  const phone = o.phone ? `<a class="phone" href="tel:${e(o.phone)}">${e(displayPhone(o.phone))}</a>` : '';
  const nav = city
    ? '<a href="/water-softeners/">Softeners</a><a href="/whole-home-filtration/">Filtration</a><a href="/how-it-works/">How it works</a><a href="/contact/">Contact</a>'
    : '<a href="/water-softeners/">Systems</a><a href="/how-it-works/">How it works</a><a href="/service-areas/">Service areas</a><a href="/contact/">Contact</a>';
  const foot = city
    ? `<p><a href="/about/">About</a><a href="/contact/">Contact</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/communication-preferences/">Communication preferences</a></p>
<p>${e(brand)} is part of My Home Water System, operated by Aidren LLC. We help homeowners request water treatment quotes. The company that performs your installation is named on the request form before you submit.</p>`
    : `<p><a href="/about/">About</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/communication-preferences/">Communication preferences</a><a href="/for-dealers/">For dealers</a></p>
<p>My Home Water System helps homeowners request water treatment quotes. The company that performs your installation is named on each service-area page and on the request form before you submit.</p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(o.title)}</title><meta name="description" content="${e(o.description)}">
<link rel="canonical" href="${e(canonical)}">${o.noindex ? '<meta name="robots" content="noindex">' : ''}
${(o.jsonLd ?? []).map(ld).join('')}<style>${CSS}</style></head><body>
${o.banner ? `<div class="banner" role="note"><div class="wrap">${o.banner}</div></div>` : ''}
<header class="site"><div class="wrap"><a class="brand" href="/">${e(brand)}</a>
<nav aria-label="Main">${nav}${phone}</nav></div></header>
<main><div class="wrap">${o.body}</div></main>
<footer><div class="wrap">
${foot}
</div></footer></body></html>`;
}
