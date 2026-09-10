# 90-minute setup guide

Print this. Tick as you go. Bracketed text like `[COMPANY]` is for you to replace once.

## Before you start

- [ ] You have edit access to Google Drive, SharePoint, or a shared disk
- [ ] You know who can **approve policies** (founder / GM / ops lead)
- [ ] You will **not** put real client secrets into the example rows of the register

## Minute 0–10 — Owner and home

1. Create a shared folder: `[COMPANY] / AI-Governance /`
2. Copy this entire kit into it.
3. Open `governance/01-appoint-owner.md`. Name:
   - **AI Owner** (one person, not a committee)
   - **Deputy** (covers leave)
4. Put both names in the register header (see CSV instructions).

The owner is not “the IT person by default.” Pick the person who can **say no** to a new tool.

## Minute 10–20 — Register

1. Upload `register/AI-System-Register.csv` to Google Sheets (File → Import) **or** open in Excel.
2. Freeze row 1.
3. Delete the example rows **after** you understand them — or keep them in a tab named `EXAMPLES` and start a clean `LIVE` tab.
4. Protect the `LIVE` tab: only Owner + Deputy can edit classifications.

## Minute 20–30 — Policy skeleton

1. Duplicate `policies/04-acceptable-use-policy.md`.
2. Replace `[COMPANY]`, `[JURISDICTION]`, `[AI OWNER NAME]`, `[EFFECTIVE DATE]`.
3. Do **not** invent extra chapters. Short policies get followed.

Send a calendar invite: “AI policy sign-off — 15 min” for tomorrow. Do not wait for perfect.

## Minute 30–40 — Evidence skeleton

Follow `evidence/FOLDER-MAP.md`. Empty folders still count: they tell you what you are missing.

## Minute 40–50 — Survey

1. Copy `discovery/02-shadow-ai-survey.md` into a Google Form (or email it).
2. Deadline: **tomorrow 17:00**.
3. Promise: answers are used to **protect the company**, not to punish people. If you punish honesty, you will never see the real list.

## Minute 50–90 — First ten tools (do not wait for the survey)

You already know ChatGPT exists. Log the obvious ones now:

Typical first ten: ChatGPT / Claude / Gemini · Microsoft Copilot · Grammarly · Midjourney or similar · Notion AI · meeting notetaker (Otter, Fireflies, Teams Copilot) · translation tool · support chatbot on your site · any HR or ATS “AI screen” · a browser plugin nobody admitted to.

For each, follow `register/03-classify-a-tool.md` (five minutes each after the first two).

**Stop at ten.** Perfection is how kits die.

## Day 2 (after survey returns)

1. Add every named tool. Duplicates: merge, keep the riskier data class.
2. Anything with **client** or **special** data and no approval → **pause use** until Owner says yes or no.
3. Schedule `literacy/training.html` (all-hands, 75 minutes).
4. If you publish ads, blogs, or a site chatbot: apply `transparency/07-copy-deck.md`.
5. Fill `buyer/10-one-pager.md` with counts from the live register (number of tools, owner name, last review date). Export PDF.

## What good looks like on day 7

- Live register ≥ the number of people in the company (shadow AI is real)
- Policy dated and stored in `evidence/02-policies/`
- Attendance CSV has names
- Next quarterly review is on the calendar
- One-pager PDF exists

If you only did a nice policy and no register, you failed the kit. Reverse that.
