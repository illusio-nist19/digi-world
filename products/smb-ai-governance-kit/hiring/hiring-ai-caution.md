# Hiring and people decisions — caution pack

**Default: do not use AI to rank, score, or reject people.**

Employment law and (in the EU) high-risk AI rules are where small companies get hurt. This pack exists to **stop unofficial CV-ChatGPT** — not to certify an ATS.

## Hard rules

1. No Chrome plugin, no “magic rank,” no pasting a CV into ChatGPT unless the **Owner + qualified employment counsel** have approved that **exact** workflow in writing.
2. If a tool scores humans, set `hiring_watch = yes` and `status = paused` until counsel reviews.
3. A human must be able to explain every reject. “The model preferred another profile” is not an explanation.

## If you already did it

- Stop today. Log the tool as `paused`.
- Do not delete records if a process already ran — speak to counsel first.
- Tell the Owner: which roles, which dates, which tool.

## Safer pattern (still not “compliance”)

- Humans screen CVs.
- AI may **help write a job ad** (internal data class) if approved.
- AI may **help the candidate** (your careers chatbot) only with disclosure and no hidden scoring.

## Log (if any hiring AI is later approved)

Keep: job id, tool_id, date, human reviewer name, whether AI output was accepted/overridden, reason.

File in `evidence/06-hiring/`. This section is **not** a lawful hiring system.
