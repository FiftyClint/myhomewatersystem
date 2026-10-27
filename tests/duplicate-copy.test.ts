import { describe, expect, it } from 'vitest';
import { check, crawl, mainText, WINDOW, type Page } from '../scripts/check-duplicate-copy.ts';

// The Powered Land Co duplicate copy rules, applied to every water site (scripts/check-duplicate-copy.ts).
describe('duplicate copy', () => {
  it('no shared 40-word passage across sites or within a site, and syndicated pages are noindex off the hub', async () => {
    const r = check(await crawl());
    const show = (xs: { a: string; b: string; phrase: string }[]) => xs.slice(0, 5).map((x) => `${x.a} | ${x.b}: "${x.phrase}"`);
    expect(r.unguarded).toEqual([]);
    expect(show(r.sameSite)).toEqual([]);
    expect(show(r.crossSite)).toEqual([]);
    expect(r.sites).toBeGreaterThan(10);
  }, 300_000);

  // A check that is supposed to fail needs a test that makes it fail.
  it('catches a shared passage, skips the form and source lists, and flags an indexable syndicated page', () => {
    const prose = Array.from({ length: WINDOW + 5 }, (_, i) => `word${i}`).join(' ');
    const pg = (site: string, path: string, body: string, noindex = false): Page => ({ site, path, html: `<main>${body}</main>`, noindex });
    expect(check([pg('a.com', '/', `<p>${prose}</p>`), pg('b.com', '/', `<p>${prose}</p>`)]).crossSite).toHaveLength(1);
    expect(check([pg('a.com', '/', `<p>${prose}</p>`), pg('a.com', '/x/', `<p>${prose}</p>`)]).sameSite).toHaveLength(1);
    expect(check([pg('a.com', '/', `<p>${prose}</p>`), pg('a.com', '/x/', `<p>${prose}</p>`, true)]).sameSite).toHaveLength(0);
    expect(check([pg('a.com', '/', `<form data-boilerplate><p>${prose}</p></form>`), pg('b.com', '/', `<div data-boilerplate><div>${prose}</div></div>`)]).crossSite).toHaveLength(0);
    expect(check([pg('a.com', '/', `<ul data-citations><li>${prose}</li></ul>`), pg('b.com', '/', `<ul data-citations><li>${prose}</li></ul>`)]).crossSite).toHaveLength(0);
    expect(check([pg('a.com', '/about/', '<p>x</p>')]).unguarded).toEqual(['a.com/about/']);
    expect(mainText('<header>nav</header><main><p>One &amp; two</p><script>x</script></main><footer>f</footer>')).toBe('One & two');
  });
});
