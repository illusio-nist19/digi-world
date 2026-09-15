# AGENT PROMPT — Add Key Fob Programming Mastery to Digi World store

Copy everything below the line into a coding agent (Cursor / Claude / etc.).

---

## Mission

Add the existing professional training e-book **Key Fob Programming Mastery** to the live Digi World store as a purchasable digital product — catalog entry, product page, high-quality marketing images, downloadable delivery zip, social proof, FAQs, SEO copy, and checkout wiring — matching Digi World’s existing product patterns (see Photographer Client Studio / `DW-SYS-010`).

Do **not** invent theft, bypass, stolen-vehicle, or immobilizer-attack content. This product is **authorized automotive key-fob work for verified vehicle owners only**.

---

## Source of truth (do not relocate without updating paths)

| Asset | Path |
| --- | --- |
| Print-ready PDF | `C:\Users\ILLUSIONIST\Projects\digi-world\learning\car-key-programming\Key-Fob-Programming-Mastery.pdf` |
| HTML source | `C:\Users\ILLUSIONIST\Projects\digi-world\learning\car-key-programming\Key-Fob-Programming-Mastery.html` |
| Figures | `C:\Users\ILLUSIONIST\Projects\digi-world\learning\car-key-programming\images\` (`kfm-*.png`) |
| README | `C:\Users\ILLUSIONIST\Projects\digi-world\learning\car-key-programming\README.md` |

Also present (older cousin — do **not** sell as the main SKU unless asked): `Car-Key-Programming-Pro.pdf`.

Read the HTML cover + chapter map before writing copy. The book subtitle is: **“From First Remote to Immobilizer Expert.”**

### What’s inside (use in “contents” / bullets)

22 chapters including: the profession; law/ethics/paperwork; fob anatomy; immobilizers; RKE vs smart vs blade+chip; transponders; reading the car; machines & kits (with prices); consumables; master workflow; workshop prep; Procedure A (Add a spare); Procedure B (lost remote, car present); Procedure C (All Keys Lost); cutting the blade; programming discipline; testing; fault-finding; luxury limits & referral; pricing & the customer; 90-day path to competence; glossary, checklists, packing list.

Tone of the book: teal/coral illustrated field manual, step numbers, warn/ok/info/stop callouts, ownership verification first — never “hack a car.”

---

## Product identity (propose, then implement)

| Field | Value |
| --- | --- |
| Suggested SKU | `DW-EBK-001` (ebook line) **or** next free `DW-SYS-0xx` if catalog treats all paid products as systems — check `docs/04-PRODUCT-CATALOG.md` and existing SKUs; do not collide with `DW-SYS-009` / `DW-SYS-010` |
| Slug | `key-fob-programming-mastery` |
| Serial | Match SKU |
| Type | `ebook` if supported, else `system` |
| Collection | Prefer a new `trades-lab` / `auto-trades` collection **or** place under closest existing collection only if creating a collection is out of scope — document the choice |
| Price | **$67** solo (recommend) · optional duo/shop seat **$97** for 2 techs — premium illustrated training, not a $9 PDF dump |
| License | One technician / one shop seat; personal use; no redistribution; no marketplace dump of the PDF |
| Delivery | Instant zip after checkout (same pattern as photographer-os vault) |

Update `docs/04-PRODUCT-CATALOG.md` with a full product row.

---

## Store implementation checklist

1. **Catalog**
   - Add product to `frontend/src/lib/fallback-catalog.ts` (and any DB/seed/API catalog source of truth used in production).
   - Full bilingual set: **en, ar, fr, es** for `name`, `headline`, `sub`, `description`, `contents`, and every FAQ.
   - Add 4–6 **reviews** (honest “studio brief” / field-preview style like photographer-os — **not fake celebrity quotes**). Frame as training-desk briefs from locksmith / mobile auto-key contexts. Locales: at least en + ar + one of fr/es.

2. **Homepage / discovery**
   - Surface the product on the home page or collection page so it is not orphaned (mirror how `photographer-os` is featured if the catalog is currently thin).
   - Product URL: `/[locale]/systems/key-fob-programming-mastery` (or `/ebooks/...` if that route exists — prefer existing `[slug]` systems route).

3. **Product page UX**
   - Hero: brand-first Digi World, product name as hero signal, one sharp headline, one supporting sentence, one CTA.
   - Sections: What’s inside · Who it’s for · Who it’s not for · How you’ll use it in 90 days · Ethics / legal boundary · What’s in the zip · FAQ · Reviews.
   - **Who it’s for:** mobile locksmiths, shop techs expanding into remotes, serious apprentices building a legal Add-Key practice.
   - **Who it’s not for:** anyone wanting theft/bypass shortcuts; people who will not verify ownership; buyers expecting a dealer login dump or EEPROM attack guide.

4. **Download / fulfillment**
   - Package zip, e.g. `products/releases/DW-EBK-001-key-fob-programming-mastery.zip` **and** copy into the store’s public vault path used by thank-you / email delivery (match photographer-os pattern).
   - Zip contents:
     - `00-START-HERE.pdf` or `.txt` (how to study, ethics reminder, licence)
     - `Key-Fob-Programming-Mastery.pdf` (the ebook)
     - Optional: licence / one-sheet packing checklist excerpt if already in the book
   - Wire SKU → zip so paid checkout delivers the file. Do not leave a dead download button.

5. **Images (high quality — required)**
   Create a product image set under `frontend/public/images/products/key-fob-programming-mastery/` (at least **6–10** PNGs, 1600×1600 or 2000×2000 square + optional 16:9 hero):

   | # | Shot brief |
   | --- | --- |
   | 01 | Hero: ebook cover / title treatment on a clean workshop desk (teal–coral brand colors from the HTML), Digi World present |
   | 02 | “What’s inside” — chapter map or stacked chapter cards |
   | 03 | Ownership verification scene (ID + registration desk — **legal framing**) |
   | 04 | Procedure A — Add a spare (step strip / numbered workflow) |
   | 05 | Tools & kits overview (illustrated, not a stolen-tool flex) |
   | 06 | Immobilizer / OBD discipline callout (power support, don’t panic) |
   | 07 | Pricing & customer chapter teaser |
   | 08 | 90-day competence calendar |
   | 09 | Inside-page collage using real `images/kfm-*.png` figures |
   | 10 | Closing seal: Legal · Ethical · Illustrated · Field procedures |

   Use existing `kfm-*.png` figures where strong; generate lifestyle/mockup frames around them (laptop or tablet showing a page, not a cheap Canva clutter collage). Avoid purple-glow AI defaults; follow Digi World visual language. No fake “dealer login hacked” imagery.

6. **Copy quality bar (English first, then localize)**

   **Headline options (pick one sharp line):**
   - “Program the spare. Prove the owner. Leave the shortcuts alone.”
   - “From first remote to immobilizer discipline — without becoming a thief’s tutorial.”
   - “The apprenticeship PDF shops actually need before the tablet does.”

   **Sub:** Complete visual apprenticeship for authorized key-fob and immobilizer work: verify the owner, quote the job, prep the remote, run the procedure, test the finish, refer what you cannot support.

   **Social proof style (examples — rewrite to feel real, not hype):**
   - “I stopped treating All Keys Lost like a YouTube dare. Add Key first. Paperwork first.”
   - “The callout colors alone saved a job — weak battery, not ‘bricked module.’”
   - “Finally a guide that tells you when to refer luxury platforms instead of inventing a miracle.”

   **Trust lines to include:** Instant download · Illustrated field procedures · Ethics & paperwork before OBD · 90-day practice path · One-technician licence · Not legal advice / not a theft guide.

7. **SEO / meta**
   - Title: `Key Fob Programming Mastery | Automotive Remote & Immobilizer Training E-Book`
   - Meta description (~155 chars): visual locksmith training for authorized Add Key / remote programming — ownership verification, procedures, testing, 90-day path. Digi World.
   - Keywords in body (natural): key fob programming, car remote programming, immobilizer training, add key procedure, automotive locksmith ebook — **never** “how to steal a car,” “bypass immobilizer for free,” etc.

8. **Checkout / offers**
   - Solo `$67`; optional duo `$97` if the offer ladder supports it.
   - Cross-sell only if another trades/auto product exists; otherwise leave empty or soft-link photographer-os only if it hurts brand — prefer no forced unrelated cross-sell.
   - Post-checkout: thank-you page shows zip; email the same inbox (existing Digi World flow).

9. **Compliance copy (mandatory on page + START-HERE)**
   - Program/cut keys only for the verified owner or documented authorized agent.
   - Photo ID + registration/title; log the job; walk away from bad stories.
   - This product does **not** teach theft, skipped paperwork, stolen-vehicle starts, undocumented immobilizer bypass, EEPROM attacks, or dealer-login abuse.

10. **QA before claiming done**
    - Product appears in catalog API / fallback.
    - `/en/systems/key-fob-programming-mastery` loads with images.
    - Zip opens; PDF matches source.
    - ar/fr/es strings present (not empty English duplicates unless intentionally deferred — prefer real translations).
    - No claims of “guaranteed dealer access,” “works on every car,” or illegal capability.
    - Commit only if the user asks; otherwise leave working tree ready.
    - Deploy notes: EasyPanel **API then store** if that is still the ops rule for this repo.

---

## Brand voice

Digi World: **digital systems, not files.** For this SKU, sell a **serious trade apprenticeship**, not a beige Notion aesthetic and not a crime tutorial. Short sentences. Specific verbs. Respect locksmith craft. Prefer “verify → quote → prepare → program → test → refer” over hype adjectives.

---

## Out of scope

- Do not list the full PDF on Etsy in this task unless separately requested.
- Do not merge `Car-Key-Programming-Pro` into the zip unless it adds unique value without confusing the buyer.
- Do not weaken ethics chapters to “sell more.”

---

## Definition of done

A shopper can discover **Key Fob Programming Mastery** on digi-world.online, understand what they get and what they will never get, see professional images, read social-proof briefs and FAQs, buy at the set price, and instantly download a clean zip containing the PDF + START-HERE — with catalog, docs, and locales updated to Digi World standards.
