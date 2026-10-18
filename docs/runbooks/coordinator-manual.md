# Coordinator manual

All `/internal/*` calls need `Authorization: Bearer <ADMIN_TOKEN>`. Contact details live in HighLevel, not in these lists.

## Daily routine
1. Open exceptions: `GET /internal/exceptions` (highest severity first). Work every `high` and `critical` today.
2. Work list: `GET /internal/opportunities`. Check anything in `capacity_hold`, `consent_hold`, `duplicate_review`.
3. HighLevel tasks titled "Send new lead to ..." contain the dealer's private link. Send it to the dealer by the agreed channel.
4. Chase dealers with "status update overdue" exceptions.
5. Record money that arrived: `POST /internal/ledger/received {"billing_key": "...", "evidence": "ACH ref"}`.
6. Resolve exceptions with a note: `POST /internal/exceptions/resolve {"id": "...", "resolution": "..."}`.

## What each hold means
| State | Meaning | Action |
|---|---|---|
| capacity_hold | No dealer/installer passes the gates (credentials, agreement, capacity) | Check provider config. Routing retries hourly. |
| consent_hold | Dealer released the lead. Customer agreed to that dealer only | Ask the customer before introducing another dealer. Then `POST /internal/transition {"to":"qualified"}`. |
| duplicate_review | Same person has an open request | Merge in HighLevel; mark `invalid` or `qualified`. |
| unsupported_scope | Well water, not the owner, or concern not offered | Tell the customer honestly. Close. |

## Recording progress yourself
`POST /internal/transition {"opportunity_id":"...","to":"appointment_held","evidence":"calendar event id","expected_version":3}`
Assessment completed, installed and collected need an evidence reference. A 409 means someone else changed it first: reload and retry.

## Direct-sale money
`POST /internal/ledger` with `kind` one of customer_payment, customer_refund, installer_payout, equipment_cost, campaign_spend, dealer_fee_credit. Every entry needs a unique `billing_key` and an `evidence` reference. Refunds are new rows; never edit or delete a payment.

## Never
- Never send a lead to a second dealer while the first holds it.
- Never mark something collected because a dealer said it will pay.
- Never diagnose plumbing. Leaks and loss of water go to the installing company's urgent contact.
