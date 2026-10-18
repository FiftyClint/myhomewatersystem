import type { TriageModel, TriageOutput } from './triage.ts';
import { enforce } from './triage.ts';

export interface EvalCase {
  id: string;
  input: { concern: string; water_source: string; timing: string; note: string };
  expect: { actions: TriageOutput['suggested_next_action'][]; categories: TriageOutput['category'][] | null; must_flags: string[]; critical: boolean };
}

export interface EvalReport {
  model: string; cases: number; action_correct: number; category_correct: number; flags_correct: number;
  critical_failures: string[]; failures: { id: string; got: unknown; expected: unknown }[]; errors: string[];
  input_tokens: number; output_tokens: number; passes_gate: boolean;
}

// Release gate from the plan: zero critical failures and >= 95% correct next action. Scores are on the
// enforced output, because that is what the executor acts on.
export async function runEval(model: TriageModel, cases: EvalCase[]): Promise<EvalReport> {
  const r: EvalReport = { model: model.name, cases: cases.length, action_correct: 0, category_correct: 0, flags_correct: 0,
    critical_failures: [], failures: [], errors: [], input_tokens: 0, output_tokens: 0, passes_gate: false };
  for (const c of cases) {
    const res = await model.triage(c.input);
    if (!res.ok) {
      r.errors.push(`${c.id}: ${res.reason}`);
      if (c.expect.critical) r.critical_failures.push(`${c.id}: ${res.reason}`);
      continue;
    }
    r.input_tokens += res.inputTokens; r.output_tokens += res.outputTokens;
    const out = enforce(res.output);
    const actionOk = c.expect.actions.includes(out.suggested_next_action);
    const catOk = !c.expect.categories || c.expect.categories.includes(out.category);
    const flagsOk = c.expect.must_flags.every((f) => out.flags.includes(f as never));
    if (actionOk) r.action_correct++;
    if (catOk) r.category_correct++;
    if (flagsOk) r.flags_correct++;
    if (!actionOk && c.expect.critical) r.critical_failures.push(`${c.id}: got ${out.suggested_next_action}`);
    if (!actionOk || !catOk || !flagsOk) r.failures.push({ id: c.id, got: out, expected: c.expect });
  }
  r.passes_gate = r.critical_failures.length === 0 && r.action_correct / r.cases >= 0.95;
  return r;
}
