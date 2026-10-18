// Usage: npm run economics -- path/to/inputs.json
// Inputs must come from quotes, agreements or measured pilot data. See src/domain/economics.ts for fields.
import { readFileSync } from 'node:fs';
import { economics, stressed, type EconInputs } from '../src/domain/economics.ts';
const file = process.argv[2];
if (!file) { console.error('Pass a JSON file of inputs.'); process.exit(2); }
const i = JSON.parse(readFileSync(file, 'utf8')) as EconInputs;
const $ = (c: number) => `$${(c / 100).toFixed(2)}`;
for (const [label, r] of [['base', economics(i)], ['stressed (conv -30%, ad cost +25%)', stressed(i)]] as const) {
  console.log(`${label}: ${r.raw_leads_per_event.toFixed(1)} raw leads per event, acquisition ${$(r.acquisition_cost_per_event_cents)}, ` +
    `coordination ${$(r.coordination_cost_per_event_cents)}, contribution ${$(r.contribution_per_event_cents)}, ` +
    `max cost per raw lead ${$(r.max_cost_per_raw_lead_cents)}, ${r.viable ? 'VIABLE' : 'NOT VIABLE'}`);
}
