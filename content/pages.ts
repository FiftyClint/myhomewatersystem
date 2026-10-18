// Reviewed-content registry. Every page lists its status and reviewer.
// Status "draft" pages are general education with no local water, price, health or certification claims.
// Product claims, prices and local water facts may only be added with evidence IDs and a named reviewer.
export interface StaticPage {
  path: string; title: string; description: string; status: 'draft' | 'approved';
  reviewer: string | null; evidence_ids: string[]; html: string; noindex?: boolean;
}

export const STATIC_PAGES: StaticPage[] = [
  {
    path: '/water-softeners/', title: 'Water softeners | My Home Water System', status: 'draft', reviewer: null, evidence_ids: [],
    description: 'What a water softener does, what it does not do, and what upkeep to expect.',
    html: `<h1>Water softeners</h1>
<p>Hard water carries dissolved calcium and magnesium. Over time those minerals can leave scale on fixtures, glass and the inside of water-using appliances. A water softener is meant to reduce that hardness for the water it treats.</p>
<h2>How most softeners work</h2>
<p>Most home softeners use ion exchange. Water passes through resin that holds onto hardness minerals. The unit periodically flushes the resin with a salt solution, called regeneration, so it can keep working.</p>
<h2>What a softener does not do</h2>
<ul><li>It is not a general drinking-water filter. It is not designed to remove chlorine taste or most other contaminants.</li>
<li>It needs salt refills and occasional service.</li><li>It uses some water during regeneration, and it needs a drain and an electrical outlet near the install location.</li></ul>
<h2>Questions to ask before you buy</h2>
<ul><li>What is the hardness of my water, and how was it measured?</li><li>What size unit fits my household and why?</li>
<li>What is included in the installed price, and what would count as extra work?</li><li>What is the ongoing salt and service cost?</li>
<li>Who do I call if there is a leak, and what does the warranty cover for labor?</li></ul>
<p><a class="btn" href="/#request">Check availability</a></p>`,
  },
  {
    path: '/whole-home-filtration/', title: 'Whole-home filtration | My Home Water System', status: 'draft', reviewer: null, evidence_ids: [],
    description: 'What whole-home filters are for and how to compare them.',
    html: `<h1>Whole-home filtration</h1>
<p>A whole-home filter treats water where it enters the house, so every tap gets filtered water. Many homeowners consider one for chlorine taste and odor.</p>
<h2>What to know</h2>
<ul><li>Different filter media target different things. A filter only does what its specific certification says it does.</li>
<li>Media and cartridges wear out and must be replaced on a schedule.</li>
<li>A filter is not a softener. If scale is your main issue, ask about softening.</li></ul>
<h2>How to check a claim</h2>
<p>Ask for the exact model number and look it up in the <a href="https://info.nsf.org/Certified/DWTU/" rel="noopener">NSF certified product listings</a> or the <a href="https://find.wqa.org/find-products" rel="noopener">WQA product search</a>. Check that the listing covers the specific thing you care about.</p>
<p><a class="btn" href="/#request">Check availability</a></p>`,
  },
  {
    path: '/reverse-osmosis/', title: 'Reverse osmosis drinking water | My Home Water System', status: 'draft', reviewer: null, evidence_ids: [],
    description: 'Under-sink reverse osmosis systems: what they are, upkeep and questions to ask.',
    html: `<h1>Reverse osmosis for drinking water</h1>
<p>A reverse osmosis (RO) system usually sits under the kitchen sink and supplies a separate drinking-water faucet. It pushes water through a fine membrane plus pre- and post-filters.</p>
<h2>What to know</h2>
<ul><li>RO treats water at one tap, not the whole house.</li><li>Filters and the membrane need periodic replacement.</li>
<li>RO systems send some water to the drain as part of normal operation.</li>
<li>What a specific unit reduces depends on its certification. Ask for the model number and check it.</li></ul>
<p>The U.S. EPA explains how to find filters certified for specific contaminants: <a href="https://www.epa.gov/water-research/identifying-drinking-water-filters-certified-reduce-pfas" rel="noopener">EPA guidance on certified filters</a>.</p>
<p><a class="btn" href="/#request">Check availability</a></p>`,
  },
  {
    path: '/how-it-works/', title: 'How it works | My Home Water System', status: 'draft', reviewer: null, evidence_ids: [],
    description: 'From request to installation: what happens after you contact us.',
    html: `<h1>How it works</h1>
<ol class="steps"><li><strong>You send a request.</strong> Tell us your ZIP code, your main concern and how you want to be contacted.</li>
<li><strong>We confirm we can help.</strong> We check that your address is in an area we serve and that the request fits what is offered there.</li>
<li><strong>In-home assessment.</strong> The installing company named on your service-area page reviews your home and water and recommends options.</li>
<li><strong>Written quote.</strong> You get the price, what is included, what is extra, and the upkeep plan in writing.</li>
<li><strong>Installation and service.</strong> If you accept, the work is scheduled and the warranty and service contact are given to you in writing.</li></ol>
<p>Booking an assessment is not a purchase. You can say no at any point before signing a contract.</p>`,
  },
  {
    path: '/for-dealers/', title: 'For water treatment dealers | My Home Water System', status: 'draft', reviewer: null, evidence_ids: [],
    description: 'Partner criteria for local water treatment dealers.',
    html: `<h1>For water treatment dealers</h1>
<p>My Home Water System is a new pilot. We are looking for one established local dealer per service area that sells, installs and services residential water treatment.</p>
<h2>What we look for</h2>
<ul><li>Current licenses and insurance that we can independently verify.</li><li>Capacity to contact new requests promptly during business hours.</li>
<li>Willingness to report each request's outcome: appointment, quote, install and payment.</li><li>Written, transparent offers and a clear warranty and service process.</li></ul>
<p>We do not promise lead volume. Terms are agreed in writing before any homeowner is introduced.</p>`,
  },
];
