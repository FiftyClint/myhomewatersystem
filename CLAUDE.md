# Project rules for coding agents

Read `STATUS.md` first. Update it at the end of every work block.

Hard rules:
- n8n is excluded. Do not add orchestration vendors.
- HighLevel owns contacts, conversations and follow-up sequences. Do not build messaging in code. Exactly one system owns each scheduled action.
- The D1 ledger owns consent proof, assignments, state history and money. Fees and contribution are computed in code from recorded events, never estimated by a model.
- Never invent a dealer, license, price, water fact, review, certification or API path. Unknown stays null and shows up in `npm run preflight`.
- Customer data never goes in git. Fixtures are synthetic and marked SYNTHETIC.
- Staging must never write to the production HighLevel location (`config/protected.json`). Production live CRM requires `external_actions_enabled: true` and `dry_run: false` in the production policy, which needs owner approval recorded in `docs/decisions.md`.
- Do not deploy, buy, send outreach or contact anyone without explicit owner approval.
- A model may summarize or draft. It may not route, price, change policy, change spend or mark money collected.

Definition of done for any change: `npm run typecheck` and `npm test` pass, new behavior has a test, STATUS.md updated, mocks labeled as mocks.
