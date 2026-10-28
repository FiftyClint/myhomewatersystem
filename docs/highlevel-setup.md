# HighLevel setup

Clint's choice (2026-10-28): test in the real My Home Water System sub-account through production, with no
test sub-account. Step 1 is done (sub-account made 2026-10-18). Steps 2 and 3 are done by the production
deploy once the token in step 4 is saved. Step 6 runs in production, not staging.

1. Create a "My Home Water System" sub-account in Clint's own agency account (not under CRMX, not inside CGF).
2. Create pipeline "My Home Water System" (Claude can do this through the API if the token has the pipelines create/write permission; otherwise by hand) with stages, exactly: New Inquiry, Assigned, Appointment, Assessed, Quoted, Sold, Installed, Paid, On Hold, Lost.
3. Copy the pipeline ID and each stage ID into the `HIGHLEVEL_PIPELINE_ID` and `HIGHLEVEL_STAGE_MAP` secrets.
4. In the My Home Water System sub-account: Settings > Private Integrations > create a token with contacts, opportunities, pipelines (create/write), custom fields, custom values, tags and calendars. Save it in GitHub as the repository secret `HIGHLEVEL_TOKEN` (Settings > Secrets and variables > Actions). Never paste it into chat or git.
5. Workflows (built in HighLevel, left in draft until launch):
   - Trigger: contact tag added `mhws`. Action: factual acknowledgement by the chosen channel naming the dealer/seller.
   - Follow-up day 1/3/7/14 per the plan. **SMS steps must have the filter "tag is mhws-sms-ok"**.
   - Stop the sequence when the contact replies or an appointment is booked.
   - Trigger: contact DND enabled or reply STOP. Action: Webhook POST to `https://<site>/hooks/crm` with header `X-MHWS-Secret: <CRM_WEBHOOK_SECRET>` and body `{"event":"opt_out","crm_contact_id":"{{contact.id}}","channel":"sms"}`.
6. Integration spike in production, after Clint's go: set `CRM_PROVIDER = "highlevel"` for production and switch the production policy on, open one market, submit one synthetic lead, confirm contact, opportunity, stage moves and task appear, then delete the test contact. Record the result in STATUS.md.

To confirm during the spike: API base URL `https://services.leadconnectorhq.com` and header `Version: 2021-07-28` are what the adapter sends. The operation paths and fields were checked against the HighLevel operation registry; the base URL and version header were not.
