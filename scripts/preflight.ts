// Launch checklist from config. Prints every blocker. Exit code 1 if anything blocks production.
import { readFileSync } from 'node:fs';
import { marketLaunchBlockers, type MarketConfig, type Policy } from '../src/domain/config.ts';

const read = (p: string) => JSON.parse(readFileSync(new URL(`../${p}`, import.meta.url), 'utf8'));
const markets: MarketConfig[] = [read('config/markets/kansas-city.json')];
const policy: Policy = read('config/policies/production.json');
const company = read('config/company.json');
const out: string[] = [];
for (const [k, v] of Object.entries(company)) if (v === null) out.push(`company.${k} not set`);
if (!policy.external_actions_enabled) out.push('policy: external actions disabled');
if (policy.dry_run) out.push('policy: dry_run on');
if (policy.disclosure_version.startsWith('draft')) out.push('policy: consent disclosure is a draft (counsel review needed)');
for (const m of markets) for (const b of marketLaunchBlockers(m)) out.push(`market ${m.id}: ${b}`);
const toml = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
if (toml.includes('00000000-0000-0000-0000-000000000000')) out.push('wrangler: D1 database IDs are placeholders');
console.log(out.length ? `LAUNCH BLOCKED (${out.length}):\n- ${out.join('\n- ')}` : 'No config blockers. Human checklist in docs/launch-checklist.md still applies.');
process.exit(out.length ? 1 : 0);
