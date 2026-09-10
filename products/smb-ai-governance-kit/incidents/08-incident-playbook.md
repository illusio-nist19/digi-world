# Incident playbook — first hour

**Incident** = client or special data in the wrong tool, a customer-facing AI error that caused harm or a complaint, a notetaker on a call that should not have been recorded, credentials pasted into a prompt, or a suspected prompt-injection / leaked thread.

## Minute 0–15 — contain

1. **Stop using** the tool for that workflow (`paused` if needed).
2. **Do not** mass-delete threads until the Owner says so (you may need the evidence).
3. If a live site bot is misbehaving: take it offline or disable the integration.
4. If passwords leaked: rotate them. If a client is affected: Owner decides who calls them — **do not wait a week**.

## Minute 15–45 — record

Fill one row in `incidents/incident-log.csv` and a short note:

- What happened (facts, not blame)
- Tool and data class
- Who knows
- Customer impact: none / possible / confirmed
- What you already did

## Minute 45–60 — Owner actions

- [ ] Notify policy approver if customer or special data
- [ ] Check vendor: can we delete the conversation / workspace?
- [ ] Decide: inform customer now or after facts (when in doubt, sooner)
- [ ] Decide: counsel / DPO / insurer — **yes if personal data of many people, health, children, or a likely complaint**

## After

- Quarterly review includes open incidents
- Fix the register (wrong class? unofficial tool?)
- If it was a training gap, re-run literacy for that team

**You will not be punished for reporting the same day. Hiding it is the fireable version of this story.**

Store packed notes in `evidence/07-incidents/[YYYY-MM-DD-short-name]/`.
