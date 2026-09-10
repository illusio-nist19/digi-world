# AI system register — how to use the CSV

## Import

- **Google Sheets:** File → Import → Upload `AI-System-Register.csv` → Replace current sheet.
- **Excel:** Data → From Text/CSV.

Create two tabs: `LIVE` and `EXAMPLES`. Move `EX-01` … `EX-06` to EXAMPLES. Never mix example IDs into LIVE.

## Columns (do not rename)

| Column | What to put |
| --- | --- |
| `tool_id` | `AI-001`, `AI-002` … never reuse |
| `tool_name` | What staff call it |
| `vendor` | Legal vendor name |
| `version_or_plan` | Free / Plus / Enterprise / self-hosted |
| `owner_name` | Accountable human for **this tool** (can be same as AI Owner) |
| `users_or_team` | Who is allowed to use it |
| `role` | `deployer` / `provider` / `both` |
| `purpose` | One sentence, real use, not marketing |
| `data_class` | `none` / `internal` / `client` / `special` |
| `customer_facing` | `yes` / `no` |
| `gpai_or_foundation_model` | `yes` if it is or wraps ChatGPT, Claude, Gemini, Llama, etc. |
| `hiring_watch` | `yes` if it touches applications, interviews, promotion, firing |
| `high_risk_watch` | `yes` if credit, insurance, biometrics, critical infrastructure, etc. — then call counsel |
| `human_oversight_name` | A person, not “team” |
| `status` | `approved` / `conditional` / `review` / `paused` / `retired` |
| `conditions` | The if-and-only-if limits |
| `legal_basis_or_notes` | Optional: “vendor DPA signed”, “works council informed” |
| `dpa_on_file` | `yes` / `no` |
| `literacy_trained` | `yes` if users of **this tool** completed kit training |
| `approved_date` | ISO date `YYYY-MM-DD` |
| `next_review` | ISO date |
| `last_updated` | ISO date |
| `source_of_truth_link` | Admin console or contract URL |

## Header block (put above the table in Sheets)

In the first rows of the Sheet (insert rows above the CSV header):

- Company: `[COMPANY]`
- AI Owner: `[NAME]`
- Register version: `1.0`
- Classification scheme version: `kit-2026-09`

## Access

The LIVE register can contain process information attackers would like. Restrict sharing. Do not publish it on the website.

## Retention

Keep retired rows **3 years** (or longer if counsel says). Do not delete history; set status `retired`.
