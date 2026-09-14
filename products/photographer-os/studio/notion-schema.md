# Notion schema (build in 30 minutes)

Create a page **Photographer Client Studio**. Inside it, five inline databases. Import CSVs from `boards/` if you prefer not to type properties.

## 1. Clients

Title: Name  
Properties: Phone, Email, City, Source (IG / Google / vendor / repeat), Notes  
Relation: Jobs

## 2. Jobs

Title: Job name (`Chen wedding 2026-06-14`)  
Properties:

- Client (relation)
- Kind (`wedding` / `elopement` / `portrait` / `commercial`)
- Date (date)
- Hours (number)
- Package (text)
- Status (select — exact list in `job-statuses.md`)
- Second shooter (checkbox)
- Venue
- Gallery URL
- Usage_end (date, commercial)
- Next action (date)
- Notes

Views: **Board** by Status · **Calendar** by Date · **Table** filter Status ≠ Archived/Lost · **This week** filter Date this week

## 3. Deliverables

Title: Deliverable  
Job (relation) · Kind (`sneak` / `preview` / `full gallery` / `album` / `commercial selects`) · Due · Done (checkbox)

View: Due in next 14 days, Done = no.

## 4. Invoices

Title: Invoice id  
Job (relation) · Kind (`retainer` / `balance` / `extra_hour` / `usage` / `print` / `rush`) · Amount · Issued · Due · Status (`Draft` / `Sent` / `Paid` / `Overdue`) · Paid on · Link

View: Status = Sent or Overdue.

## 5. Pipeline (optional)

If you want a kanban of inquiries before they are jobs: Name, Date wanted, Budget band, Status (`New` / `Replied` / `Call booked` / `Won` / `Lost`), Job (relation).

## Client-facing page (template)

Duplicate per booked job. Blocks: couple names, date, your timeline PDF, formals list, gallery (empty until paid), your WhatsApp/email. Share as **Can view**.
