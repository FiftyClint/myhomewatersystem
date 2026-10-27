import { escapeHtml as e } from '../util.ts';

export interface PageOpts {
  title: string; description: string; path: string; body: string;
  noindex?: boolean; banner?: string | null; baseUrl: string;
  // City sites pass their own brand and tracking number. The hub passes neither.
  brand?: string; phone?: string | null; canonical?: string; jsonLd?: object[];
  alternates?: string; // extra <link> tags, e.g. the page's JSON and llms.txt
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
.brand{font-weight:700;color:var(--ink);text-decoration:none;font-size:1.1rem}.brand .by{font-weight:400;font-size:.85rem;color:var(--muted)}
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
.answer-card{border:1px solid var(--line);border-radius:14px;padding:16px 18px;margin:12px 0 18px;background:linear-gradient(#f4f9fa,#fff)}
.eyebrow{font-size:.85rem;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:0 0 6px}.answer-card .answer{background:none;padding:0;font-size:1.12rem;color:var(--ink)}
.classline{display:flex;flex-wrap:wrap;gap:6px 10px;align-items:center}
.badge{display:inline-block;border-radius:999px;padding:3px 12px;font-weight:700;font-size:.9rem;white-space:nowrap}
.c-soft{background:#e3f4ea;color:#14532d}.c-moderately-hard{background:#e4f0f8;color:#0b4a6f}.c-hard{background:#fff1d0;color:#6e4400}.c-very-hard{background:#fde3de;color:#8a1c12}
.scale{margin:10px 0 6px}.bands{position:relative;display:flex;height:30px;border-radius:8px;overflow:hidden;font-size:.72rem}
.bands span{display:flex;align-items:center;justify-content:center;color:#24323f;overflow:hidden;white-space:nowrap}
.b-soft{background:#d7efe0}.b-mod{background:#d6e8f4}.b-hard{background:#fbe6b0}.b-very{background:#f7cec6}
.bands .mark{position:absolute;top:0;bottom:0;border:3px solid var(--ink);border-radius:6px;background:rgba(15,39,66,.14)}
.toc{display:flex;flex-wrap:wrap;gap:8px;margin:16px 0 4px}.toc a{border:1px solid var(--line);border-radius:999px;padding:4px 12px;text-decoration:none;font-size:.9rem;color:var(--text)}
.tablewrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
a.card.link{display:block;text-decoration:none;color:var(--text)}a.card.link strong{display:block;color:var(--ink)}a.card.link:hover{border-color:var(--accent)}
@media(min-width:760px){.side>*{position:sticky;top:16px}}
.sticky-cta{position:fixed;left:12px;right:12px;bottom:12px;text-align:center;background:var(--accent);color:#fff;border-radius:10px;padding:14px;font-weight:700;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.2)}@media(min-width:760px){.sticky-cta{display:none}}
.hero{padding:8px 0 4px}.hero p.lead{font-size:1.12rem;max-width:44em}
.zipcheck{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end}.zipcheck input{max-width:11em}
.statgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px;margin:16px 0}.stat{border:1px solid var(--line);border-radius:10px;padding:12px}.stat b{display:block;font-size:1.5rem;color:var(--ink)}
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
<p>${e(brand)} is run by My Home Water System, operated by Aidren LLC. Not a water utility.</p>`
    : `<p><a href="/about/">About</a><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a><a href="/communication-preferences/">Communication preferences</a><a href="/for-dealers/">For dealers</a></p>
<p>My Home Water System helps homeowners request water treatment quotes. The company that performs your installation is named on each service-area page and on the request form before you submit. We are not a water utility; water figures are copied from utility reports with their sources.</p>`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${e(o.title)}</title><meta name="description" content="${e(o.description)}">
<link rel="canonical" href="${e(canonical)}">${o.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="max-snippet:-1, max-image-preview:large">'}
<meta property="og:type" content="website"><meta property="og:site_name" content="${e(brand)}"><meta property="og:title" content="${e(o.title)}">
<meta property="og:description" content="${e(o.description)}"><meta property="og:url" content="${e(canonical)}"><meta name="theme-color" content="#0f7c86">
<link rel="icon" href="data:,">
${o.alternates ?? ''}
${(o.jsonLd ?? []).map(ld).join('')}<style>${CSS}</style></head><body>
${o.banner ? `<div class="banner" role="note"><div class="wrap">${o.banner}</div></div>` : ''}
<header class="site"><div class="wrap"><a class="brand" href="/">${e(brand)}${city ? ' <span class="by">by My Home Water System</span>' : ''}</a>
<nav aria-label="Main">${nav}${phone}</nav></div></header>
<main><div class="wrap">${o.body}</div></main>
<footer><div class="wrap">
${foot}
</div></footer></body></html>`;
}
