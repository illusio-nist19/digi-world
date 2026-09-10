# How to classify a tool (5 minutes)

Use this **every time** a new AI tool appears. Do not invent a new scheme.

## Step A — Is it AI for our purposes?

Treat it as in-scope if it **generates, classifies, recommends, transcribes, translates, or scores** using a model (including “smart” features inside Notion, Google, Microsoft, Canva, your CRM, or a browser plugin).

If you are unsure: **put it on the register** with status `review`. Missing a tool is worse than over-listing.

## Step B — Role

| You are a… | When |
| --- | --- |
| **Deployer (user)** | You use ChatGPT, Copilot, a vendor chatbot, Midjourney. Most SMBs, most rows. |
| **Provider** | You **sell or put on the market** an AI system (your own model or a wrapped model as a product). |
| **Both** | You use Copilot internally **and** ship an AI feature to customers. Two rows, or one row with role `both`. |

## Step C — Data class (this is the money column)

Pick the **highest** class of data that ever goes in.

| Class | Meaning | Default rule |
| --- | --- | --- |
| `none` | No business data (personal experiments, public facts) | Allowed |
| `internal` | Company-only: drafts, process, non-client metrics | Allowed if tool is approved |
| `client` | Anything that identifies a customer or their work product | **Owner approval required** |
| `special` | Health, HR/performance, passwords, payment data, children’s data, government IDs, unpublished financials, privileged legal | **Default deny** on consumer chatbots |

If someone *might* paste client data, class is `client`. Do not play dumb.

## Step D — Customer-facing?

- `no` — staff only
- `yes` — website bot, AI in the product, AI images/text published as yours, AI voices, AI avatars

If `yes`, you need a line in `transparency/07-copy-deck.md`.

## Step E — Watch flags (tick in the register)

- **Hiring / promotion / firing** involved → `hiring_watch = yes` (use the hiring pack; get counsel)
- **Credit, insurance, housing, biometric ID** → `high_risk_watch = yes` (this kit is not enough)
- **Prohibited-feeling uses** (scraping faces to identify people in the wild, social scoring, exploiting vulnerability) → **stop** and call counsel. Do not “iterate.”

## Step F — Status

| Status | Meaning |
| --- | --- |
| `approved` | Owner said yes for this data class |
| `conditional` | Yes, but only with named limits (e.g. “anonymise first”) |
| `review` | In use or requested; not yet decided |
| `paused` | Must not be used until decided |
| `retired` | Was used; no longer |

**Anything `client` or `special` without `approved` or `conditional` must be `paused`.**

## Step G — Human oversight

Name a **human** who can override outputs before they hit a customer, a hire, or a regulator. “The team” is not a name.

## After classification

- Set `next_review` to **90 days** from today (or next quarterly, whichever is sooner).
- File vendor DPA / security page in `evidence/04-vendors/` when status becomes approved.
