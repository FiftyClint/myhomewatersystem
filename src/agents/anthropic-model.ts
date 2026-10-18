import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { TRIAGE_SYSTEM, TriageOutput, triageUserMessage, type ModelResult, type TriageInput, type TriageModel } from './triage.ts';

// LIVE model adapter. Needs ANTHROPIC_API_KEY (an Anthropic API account; a Claude chat subscription does not cover it).
export class AnthropicTriageModel implements TriageModel {
  readonly name: string;
  private client: Anthropic;
  private model: string;
  private effort: 'low' | 'medium' | 'high';
  constructor(apiKey: string, model = 'claude-opus-5-5', effort: 'low' | 'medium' | 'high' = 'low') {
    this.client = new Anthropic({ apiKey, maxRetries: 2, timeout: 60_000 });
    this.model = model;
    this.effort = effort;
    this.name = model;
  }

  async triage(input: TriageInput): Promise<ModelResult> {
    try {
      const response = await this.client.messages.parse({
        model: this.model,
        max_tokens: 2000,
        system: [{ type: 'text', text: TRIAGE_SYSTEM, cache_control: { type: 'ephemeral' } }],
        output_config: { effort: this.effort, format: zodOutputFormat(TriageOutput) },
        messages: [{ role: 'user', content: triageUserMessage(input) }],
      });
      if (response.stop_reason === 'refusal') {
        return { ok: false, reason: 'refusal', detail: response.stop_details?.category ?? 'refusal' };
      }
      if (!response.parsed_output) return { ok: false, reason: 'invalid_output', detail: `stop_reason ${response.stop_reason}` };
      return { ok: true, output: response.parsed_output, model: response.model,
        inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens };
    } catch (e) {
      if (e instanceof Anthropic.AuthenticationError) return { ok: false, reason: 'not_configured', detail: 'API key rejected' };
      if (e instanceof Anthropic.BadRequestError) return { ok: false, reason: 'invalid_output', detail: e.message.slice(0, 200) };
      if (e instanceof Anthropic.APIError) return { ok: false, reason: 'unavailable', detail: `API ${e.status}` };
      return { ok: false, reason: 'unavailable', detail: String(e).slice(0, 200) };
    }
  }
}
