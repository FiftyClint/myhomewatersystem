# HighLevel setup (to do by hand after approval)

Nothing below has been created. Each step changes the live HighLevel account, so it waits for owner approval.

1. Decide where it lives: a new pipeline in the existing CGF sub-account (no new cost found) or a separate sub-account (separate brand/number, cost unknown).
2. Create pipeline "My Home Water System" with stages, exactly: New Inquiry, Assigned, Appointment, Assessed, Quoted, Sold, Installed, Paid, On Hold, Lost.
3. Copy the pipeline ID and each stage ID into the `HIGHLEVEL_PIPELINE_ID` and `HIGHLEVEL_STAGE_MAP` secrets.
4. Create a Private Integration token with scopes contacts.write, opportunities.write (and the read scopes). Store it as `HIGHLEVEL_TOKEN`. Never paste it into chat or git.
5. Workflows (built in HighLevel, left in draft until launch):
   - Trigger: contact tag added `mhws`. Action: factual acknowledgement by the chosen channel naming the dealer/seller.
   - Follow-up day 1/3/7/14 per the plan. **SMS steps must have the filter "tag is mhws-sms-ok"**.
   - Stop the sequence when the contact replies or an appointment is booked.
   - Trigger: contact DND enabled or reply STOP. Action: Webhook POST to `https://<site>/hooks/crm` with header `X-MHWS-Secret: <CRM_WEBHOOK_SECRET>` and body `{"event":"opt_out","crm_contact_id":"{{contact.id}}","channel":"sms"}`.
6. Integration spike in a test sub-account (not CGF): run staging with `CRM_PROVIDER=highlevel` and `ALLOW_LIVE_CRM_IN_STAGING=yes`, submit one synthetic lead, confirm contact, opportunity, stage moves and task appear. Record the result in STATUS.md.

To confirm during the spike: API base URL `https://services.leadconnectorhq.com` and header `Version: 2021-07-28` are what the adapter sends. The operation paths and fields were checked against the HighLevel operation registry; the base URL and version header were not.
