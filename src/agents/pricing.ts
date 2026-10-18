// USD per million tokens, input / output. Source: Anthropic model pricing table (claude-api skill, cached 2026-10-06).
// Recheck https://platform.claude.com/docs/en/about-claude/pricing before relying on cost figures.
const PRICES: Record<string, [number, number]> = {
  'claude-opus-5-5': [4, 20],
  'claude-sonnet-5-5': [2, 10],
  'claude-haiku-5-5': [0.1, 0.5],
};

// Cost in millionths of a cent, to keep integer math. Unknown model = priced at the most expensive listed rate.
export function costMicrocents(model: string, inputTokens: number, outputTokens: number): number {
  const key = Object.keys(PRICES).find((k) => model.startsWith(k));
  const [i, o] = key ? PRICES[key]! : [4, 20];
  // $X per 1M tokens = X*100 cents per 1M tokens = X*100 millionths of a cent per token.
  return Math.round(inputTokens * i * 100 + outputTokens * o * 100);
}
