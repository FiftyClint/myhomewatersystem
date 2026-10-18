import type { ModelResult, TriageInput, TriageModel, TriageOutput } from './triage.ts';

// MOCK. Keyword rules standing in for the model so the pipeline and the eval harness can be tested
// without an API key. Its scores say nothing about how the real model performs.
export class KeywordTriageModel implements TriageModel {
  readonly name = 'mock-keyword';
  failNext: ModelResult | null = null;
  async triage(i: TriageInput): Promise<ModelResult> {
    if (this.failNext) { const f = this.failNext; this.failNext = null; return f; }
    const n = i.note.toLowerCase();
    const has = (...w: string[]) => w.some((x) => n.includes(x));
    const flags: TriageOutput['flags'] = [];
    let category: TriageOutput['category'] = (['hardness', 'taste_odor', 'drinking_water'].includes(i.concern) ? i.concern : 'unclear') as TriageOutput['category'];
    let action: TriageOutput['suggested_next_action'] = 'route_normally';
    if (has('ignore', 'system prompt', 'instruction', 'database', 'api key')) { flags.push('instructions_in_text'); action = 'human_review'; }
    if (has('leak', 'flood', 'no water', 'burst', 'water damage', 'dripping')) { flags.push('mentions_leak_or_water_damage'); category = 'emergency'; action = 'urgent_human_contact'; }
    if (has('sick', 'cancer', 'lead', 'pfas', 'safe to drink', 'baby')) { flags.push('mentions_health_concern'); if (action === 'route_normally') action = 'human_review'; }
    if (has('rent', 'landlord', 'tenant')) { flags.push('not_owner_signal'); if (action === 'route_normally') action = 'human_review'; }
    if (has('my softener', 'existing', 'current system', 'repair', 'broken')) { flags.push('mentions_existing_system'); if (category !== 'emergency') category = 'existing_system_service'; }
    if (has('price', 'cost', 'how much')) flags.push('asks_for_price');
    if (has('seo', 'crypto', 'backlinks', 'casino')) { flags.push('possible_spam'); category = 'out_of_scope'; action = 'close_out_of_scope'; }
    if (i.water_source === 'well' && category !== 'emergency') category = 'well_water';
    return { ok: true, model: this.name, inputTokens: 0, outputTokens: 0, output: {
      category, flags, suggested_next_action: action, confidence: 'medium', summary_for_coordinator: i.note.slice(0, 120) || 'No note.',
    } };
  }
}
