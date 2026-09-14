# Setup guide

You need **one** system of record. Pick A or B. Do not run both for six months.

## A — Google Sheets (fastest)

1. Create a Google Drive folder: `Studio OS — DW-SYS-010`.
2. File → Import each CSV in `boards/` and `pricing/rate-card.csv`, `money/invoice-log.csv`.
3. Freeze row 1. Data → Filter views: `This week`, `Awaiting retainer`, `Balance due`, `Gallery live`.
4. Share the folder with your second shooter as **commenter**, not editor, until you trust the SOP.

Works offline-ish, easy on Etsy buyers, no Notion learning curve.

## B — Notion (best once you have 15+ active jobs)

Follow `studio/notion-schema.md`. Import the same CSVs as databases. Relations:

`Clients 1—n Jobs 1—n Deliverables`  
`Jobs 1—n Invoices`  
`Jobs → Pipeline stage`

Public client portal: **one** Notion page per job, shared as “can view”, containing timeline, shot-list status, and gallery link *after* paid-in-full. Never share the money database.

## Tools this kit assumes (swap freely)

| Job | Typical tool | Where it lives in the OS |
| --- | --- | --- |
| Inquiry | Instagram / email / website form | `inquiry/` |
| Contract + pay | HoneyBook, 17hats, Dubsado, Stripe invoice, or your lawyer’s PDF | `booking/`, `money/` |
| Gallery | Pixieset, Pic-Time, ShootProof, SmugMug | `delivery/` |
| Files | local RAID + offsite (Backblaze / Wasabi) | `delivery/07-gallery-sop.md` backup rule |
| Selects | Lightroom / Capture One | cull SOP in delivery |

The OS does not replace those tools. It tells **when** each one is allowed to move.

## Brand the welcome pack

1. Duplicate `client-facing/welcome-packet.md` into Google Docs or Canva.
2. Replace `[STUDIO]`, `[CITY]`, `[HOURS]`, `[GALLERY_TOOL]`, `[TURNAROUND]`.
3. Export PDF. This is what Etsy competitors never finish.

## Calculator

Open `tools/package-calculator.html` in a browser. It does not upload data. Use it to sanity-check a quote before you send it.
