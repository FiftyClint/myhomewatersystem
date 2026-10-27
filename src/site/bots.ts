// robots.txt for every host. Search engines and AI assistants are both welcome on public pages;
// a named group replaces the * group for that crawler, so each group repeats the private paths.
// Staging blocks everything. Cloudflare's own AI-crawler setting on each zone can still block these
// crawlers before robots.txt is read; that setting is checked separately (docs/runbooks).
const PRIVATE = ['/p/', '/internal/', '/api/'];
export const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User'];

export function robotsTxt(base: string, staging: boolean): string {
  if (staging) return 'User-agent: *\nDisallow: /\n';
  const block = PRIVATE.map((p) => `Disallow: ${p}`).join('\n');
  return `User-agent: *\n${block}\n\n# AI assistants and answer engines may read and cite every public page.\n${AI_CRAWLERS.map((b) => `User-agent: ${b}`).join('\n')}\nAllow: /\n${block}\n\nSitemap: ${base}/sitemap.xml\n`;
}
