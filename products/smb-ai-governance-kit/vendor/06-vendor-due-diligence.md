# Vendor due diligence (before you approve a tool)

Complete **once per vendor** (not per staff member). File the PDF/export in `evidence/04-vendors/[VENDOR]/`.

**Vendor:** _________________ **Tool:** _________________ **Date:** ________  
**Completed by:** _________________

## Must-answer (if they refuse, do not approve `client` or `special`)

| # | Question | Answer | Evidence link |
| --- | --- | --- | --- |
| 1 | Do you train your models on our prompts/uploads by default? | yes / no / unclear | |
| 2 | Can we turn training-on-our-data **off**? How? | | |
| 3 | Where is content stored (regions)? | | |
| 4 | Is there a DPA / Data Processing Addendum? | yes / no | |
| 5 | Subprocessors list published? | yes / no | |
| 6 | Retention: can we delete a workspace and is it actually deleted? | | |
| 7 | Is this a consumer app or a **business** plan with admin controls? | | |
| 8 | Do they log prompts for abuse, and who can see our logs? | | |
| 9 | Security page / SOC 2 / ISO 27001 claim — **link**, not a vibe | | |
| 10 | If the tool joins meetings: is consent/disclosure documented? | | |

## Scoring (Owner)

- **Approve internal only** if 1–2 are acceptable and no client data.
- **Approve client class** only if DPA exists, training-off is confirmed, business plan (not a random plugin).
- **Never approve special class** on a consumer chatbot.

## Email you can send

Subject: Data processing questions — [COMPANY] evaluating [TOOL]

Hello,

We are a small company evaluating [TOOL] for [PURPOSE]. Please confirm in writing:

1. Whether customer content is used to train models (default on or off).
2. How we disable training on our data.
3. Storage regions and subprocessors.
4. Link to your DPA and deletion process.
5. Whether a business admin role can export/delete our workspace.

We need this to complete our internal AI register. Thank you.

[AI OWNER NAME] · [COMPANY] · [EMAIL]
