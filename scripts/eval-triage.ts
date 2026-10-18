// Runs the triage eval. Default uses the MOCK keyword model (free, says nothing about real quality).
//   npm run eval:triage                      -> mock
//   ANTHROPIC_API_KEY=... npm run eval:triage -- --live --confirm [--model claude-haiku-5-5]
// Live runs cost money: 40 short calls. The report prints tokens and estimated cost.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { runEval, type EvalCase } from '../src/agents/eval.ts';
import { KeywordTriageModel } from '../src/agents/mock-model.ts';
import { AnthropicTriageModel } from '../src/agents/anthropic-model.ts';
import { costMicrocents } from '../src/agents/pricing.ts';

const args = process.argv.slice(2);
const live = args.includes('--live');
const modelArg = args[args.indexOf('--model') + 1];
const modelId = args.includes('--model') && modelArg ? modelArg : 'claude-opus-5-5';
if (live && !args.includes('--confirm')) { console.error('Live eval spends API credit. Re-run with --confirm.'); process.exit(2); }
if (live && !process.env.ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY is not set.'); process.exit(2); }
const cases: EvalCase[] = readFileSync(new URL('../fixtures/evals/triage.jsonl', import.meta.url), 'utf8')
  .trim().split('\n').map((l) => JSON.parse(l));
const model = live ? new AnthropicTriageModel(process.env.ANTHROPIC_API_KEY!, modelId, 'low') : new KeywordTriageModel();
const report = await runEval(model, cases);
const cents = costMicrocents(model.name, report.input_tokens, report.output_tokens) / 1_000_000;
console.log(`model ${report.model}${live ? '' : ' (MOCK)'}: action ${report.action_correct}/${report.cases}, category ${report.category_correct}/${report.cases}, flags ${report.flags_correct}/${report.cases}`);
console.log(`critical failures: ${report.critical_failures.length ? report.critical_failures.join('; ') : 'none'}`);
console.log(`errors: ${report.errors.length}; tokens in/out ${report.input_tokens}/${report.output_tokens}; est cost $${(cents / 100).toFixed(4)}`);
console.log(`release gate (0 critical, >=95% action): ${report.passes_gate ? 'PASS' : 'FAIL'}`);
if (live) {
  mkdirSync(new URL('../docs/evals/', import.meta.url), { recursive: true });
  writeFileSync(new URL(`../docs/evals/triage-${new Date().toISOString().slice(0, 10)}-${report.model}.json`, import.meta.url), JSON.stringify(report, null, 2));
}
process.exit(report.passes_gate ? 0 : 1);
