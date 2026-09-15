# AGENT PROMPT — Build an HTML Client Tracker CRM (7 windows + CSV export)

Copy everything below the line into a coding agent.

---

## Mission

Build **one self-contained HTML file** (plus optional CSS/JS only if needed) that is a working small-business **Client Tracker CRM**. It must have the **same seven windows** as a typical all-in-one Google Sheets client CRM (Setup, Client Database, Communication Log, Task Tracker, Smart Calendar, Client Overview, Dashboard), with a prominent **Export CSV** button.

This is an **original Digi World product**. Recreate the *windows, data model, and buyer jobs* — do **not** copy Exclusive Design Lab’s copyrighted layout, colors, sample client names, or marketing copy. Do not clone their pastel chart skins pixel-for-pixel. Use Digi World’s calm, professional visual language (ink, cream, sage, terra — similar to Photographer Client Studio).

Deliver a file a buyer can double-click and use **offline in the browser**. No Google account. No build step. Persist data in `localStorage`. Seed 8–12 realistic sample clients so charts are not empty.

**Output path:** `C:\Users\ILLUSIONIST\Projects\digi-world\products\client-tracker\Client-Tracker.html`

---

## Product name

**Digi World Client Tracker**  
Subtitle: *Clients, follow-ups, tasks, invoices — one desk.*

---

## Chrome (every window)

Top bar:
- Product name
- Nav tabs for the 7 windows (active tab highlighted)
- Search (filters the current table)
- **Export CSV** (always visible)
- Add-record button relevant to the current window
- Small hint: “Data stays on this computer.”

Footer: Digi World · personal / one-studio licence · not legal or tax advice.

Keyboard: `N` new row where it makes sense; Escape closes modals.

---

## Export CSV (required)

One primary button **Export CSV** with a dropdown:

1. **This window** — current tab’s table only
2. **All data** — download a zip *or* sequential files:
   - `clients.csv`
   - `communications.csv`
   - `tasks.csv`
   - `setup.csv` (dropdown lists / settings)
3. Include UTF-8 BOM so Excel opens cleanly
4. Proper CSV escaping (quotes, commas, newlines)
5. Export **user data**, not chart SVGs

If zip is hard in a single HTML file, download multiple `.csv` files in sequence. Do not silently fail.

Also add **Import CSV** on Setup (optional but preferred): map columns, skip header, merge by client name.

---

## The 7 windows (same jobs as the listing)

### 1. Setup
Get started in minutes.

- Short numbered start: 1) set dropdowns 2) add first client 3) log a call 4) add a task 5) open Dashboard
- Editable dropdown lists used everywhere:
  - Client status: Lead, Follow-up, Proposal, Negotiation, Closed Won, Closed Lost, Inactive
  - Priority: Very High, High, Medium, Low
  - Type: New business, Existing, Referral, Partner
  - Source: Website, Referral, Instagram, Cold, Event
  - Product / project (free list)
  - Invoice status: Unpaid, Pending, Partial, Paid, Overdue
  - Payment mode: Bank transfer, Card, Cash, PayPal
  - Contact mode: Phone, Email, Meeting, Text, Social
  - Task status: Not started, In progress, Pending, Delayed, On hold, Complete
  - Task category: Project delivery, Billing, Meeting, Admin, Content
  - Task priority: High, Medium, Low
- Business name, currency symbol, week start (Monday / Sunday)
- Reset sample data / clear all (confirm)
- Ethics line: this is a planner, not a lawyer or accountant.

### 2. Client Database
Everything about the client in one table.

**Top mini-dashboard (computed from rows):**
- Status bar chart
- Priority bar chart
- Type donut
- Invoice-status donut + count

**Table — Client / company information**
| Field | Notes |
| --- | --- |
| Client / company name | required, unique key used across tabs |
| Contact name | |
| Phone | |
| Email | |
| Address | |
| Type | dropdown |
| Product / project | |
| Status | dropdown, colored chip |
| Priority | dropdown, colored chip |
| Source | dropdown |

**Communication block (per client, editable here or synced)**
- Last contact date
- Next action
- Next action date

**Contract / money**
- Requirement / deal summary
- Deal value (number)
- Start date, end date
- Payment mode
- Invoice status

**Notes + Custom field 1 + Custom field 2**

Add / edit in a modal or inline. Delete with confirm. Filter by status, priority, invoice.

### 3. Communication Log
Every conversation, so follow-up does not die.

**Counters:** Communications done today · this week

**Table sections**
- Client information (name + contact + phone + email — pull from database; picking a client auto-fills)
- Communication summary: Date, Contact mode, Answered? (Yes/No)
- Next action details: Next action, Next action in days (number), Next action due date (auto = date + days, overridable)
- Notes + custom field

When a row is saved, update that client’s last-contact / next-action on the Database.

### 4. Task Tracker
Stay on top of client work without overwhelm.

**KPI chips (live):** Total · Complete · Incomplete · Due today · Due this week · Overdue  
Overdue rows highlighted (due date < today and status ≠ Complete).

**Charts:** tasks by client (pie) · status bars · priority bars · category pie  
**Filter bar:** client, status, priority, category, assigned to, overdue only

**Table**
| Field |
| --- |
| Client / company name (dropdown from database) |
| Task |
| Category |
| Status |
| Priority |
| Assigned to |
| Due date |
| Days left (computed; negative = overdue) |
| Notes |

### 5. Smart Calendar
Know what is coming.

- Month + year picker
- Week start from Setup (Mon or Sun)
- Month grid: events color-coded
- **View from** toggles: Tasks · Next actions · Contract start/end
- Left/right sidebar **Today:** today’s tasks, next actions, contracts ending
- Click a day → list of items; click item → jump to source row
- Events are generated from data (do not make users double-enter)

### 6. Client Overview (per-client 360°)
Select any client and see the relationship in one screen.

Header: client picker (searchable)

Cards:
- Client information (contact, phone, email, address, product)
- Classification (status, priority, type, source)
- Communication snapshot (last contact, next action, next date)
- Contract (requirement, value, dates, invoice, payment)
- Notes / custom fields

Below:
- Communication log **filtered to this client** (add row here)
- Task tracker **filtered to this client** with the same KPI chips + small charts

Changing fields here writes back to the master tables.

### 7. Dashboard (all-in-one)
The big picture.

Top row:
- Client status bars
- Client priority bars
- Contracts by source (donut + total deal value)
- Total tasks (donut)
- Invoice status (donut)

**Task overview strip:** Total · Complete · Incomplete · Due today · Overdue  
Pies: by client · status · priority · category · assigned to

Right rail **Today:** next actions, due tasks, contracts ending this week.

Empty states: “Add your first client on Database.” Charts must update when data changes (no page reload).

---

## Data model

Use one JS store:

```
settings
clients[]      { id, company, contact, phone, email, address, type, product, status, priority, source, lastContact, nextAction, nextActionDate, requirement, dealValue, startDate, endDate, paymentMode, invoiceStatus, notes, custom1, custom2 }
comms[]        { id, clientId, date, mode, answered, nextAction, nextDays, nextDue, notes, custom }
tasks[]        { id, clientId, title, category, status, priority, assignedTo, dueDate, notes }
```

IDs: `c_`, `m_`, `t_` + timestamp. All charts and calendar **derive** from these arrays.

---

## UI quality

- Single HTML file, modern CSS (no Bootstrap CDN required; Google Fonts OK)
- Spreadsheet-like tables: sticky header, horizontal scroll, zebra rows, compact but readable
- Color chips for status/priority/invoice — original palette, not a clone
- Simple CSS/SVG charts (no Chart.js unless you keep it local/inline). If you use a CDN, the file must still work if the network is down for core CRUD + CSV
- Mobile: tabs collapse; tables scroll; Dashboard stacks
- Sample data: generic agencies (do **not** reuse “Green Wave Industries” or other names from competitor screenshots)

---

## What this is / is not

**Is:** a local CRM desk a freelancer opens tonight.  
**Is not:** Google Sheets clone with their copyrighted theme; not a SaaS; not accounting software; not legal advice.

---

## Definition of done

1. `Client-Tracker.html` opens offline
2. All 7 windows work and share one data store
3. Add/edit/delete clients, comms, and tasks; Dashboard/Calendar/Overview update
4. **Export CSV** downloads usable files for the current window and for all data
5. Sample data makes every chart look alive
6. No competitor trademarks, no copied marketing sentences, no stolen sample rows
