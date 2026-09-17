# Digi World Client Tracker

Offline life-and-studio desk — double-click `Client-Tracker.html`, or install it as a phone app.

## Phone app (PWA)
Serve the folder over HTTPS (or localhost), open `Client-Tracker.html` on your phone, then install:

- **iPhone (Safari):** Share → Add to Home Screen  
- **Android (Chrome):** Install banner, or menu → Install app / Add to Home screen  

Once installed it opens full-screen with bottom tabs (Home, Clients, Tasks, Money, More), a + button, and works offline via the service worker. Same private desk — data stays on the device.

For a quick local test: `npx --yes serve .` in this folder, then open the URL on your phone (same Wi‑Fi).

## Windows / desktop
1. Dashboard — morning briefing: budget, invoices, calendar reminders  
2. Client Database  
3. Invoices — paid, unpaid, partial, overdue  
4. Budget — monthly income, household expenses, savings (2026 sheet rhythm)  
5. Important Files — drag and drop, stored on this computer  
6. Communication Log  
7. Task Tracker  
8. Smart Calendar  
9. Client Overview  
10. Setup  

## Features
- localStorage for clients, tasks, invoices, and budget
- IndexedDB for dropped files (never uploaded)
- Sample desk so charts are not empty
- Export CSV (this window or all 7 files)
- Import clients CSV from Setup
- Press `N` to add a record; `Esc` closes modals
- Installable PWA (`manifest.webmanifest` + `sw.js` + `icons/`)

## Licence
Personal / one-studio. Not legal or tax advice.
