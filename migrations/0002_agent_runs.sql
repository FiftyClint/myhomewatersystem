-- Every model call is recorded: which model, which prompt version, tokens, cost and the proposal it made.
CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  agent TEXT NOT NULL,
  opportunity_id TEXT REFERENCES opportunities(id),
  model TEXT NOT NULL,
  prompt_version TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('ok','refusal','invalid_output','unavailable','not_configured','skipped_cap')),
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  cost_microcents INTEGER NOT NULL DEFAULT 0,
  output_json TEXT,
  applied_action TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX agent_runs_month ON agent_runs(created_at);
