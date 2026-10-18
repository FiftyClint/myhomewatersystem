# Business models

Both are built. A market picks one in `config/markets/<market>.json` (`business_mode`). Neither is approved for any market yet.

| | Dealer partner | Direct sale with subcontracted install |
|---|---|---|
| Customer buys from | The dealer | My Home Water System |
| Who installs | The dealer | Licensed subcontractor (installer) |
| Our revenue | Fee per agreed event, or dealer-funded monthly fee | Customer payment minus equipment, installer payout, refunds, ad spend |
| Routing | Lead goes to the named dealer once qualified | Installer is assigned after the customer accepts our quote |
| Who updates status | Dealer via single-job link | Coordinator for sales steps; installer marks "installed"; only we mark "collected" |
| Disclosure on the form | Names the dealer as estimator, contractor and service provider | Names My Home Water System as seller and says a licensed partner installs |
| Extra launch requirements | Signed dealer agreement, dealer credentials, reporting commitment | Contractor licensing for our role, distributor terms, installer agreements, customer contract, payments, sales tax, warranty and callback reserve, insurance |

Fee options for dealer mode (`dealer_partner.commercial_model`):
- `install_referral` / `appointment_fee`: per-event fee, earned when the opportunity reaches `fee_trigger_state` with evidence.
- `dealer_funded`: monthly fee billed outside the per-event ledger; set `fee_trigger_state` to null.

The $600 fee in the synthetic fixture market is the plan's illustration, used only to test the math. It is not a proposed price.
