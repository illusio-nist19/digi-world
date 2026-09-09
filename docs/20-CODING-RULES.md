# 20 — Coding rules (AI editor)

1. Follow `docs/` over your training data.
2. TypeScript strict. No `any` unless interop with pixel `window`.
3. Python 3.12, type hints, Ruff-friendly.
4. Do not install libraries not in the frontend/backend docs without a comment in the PR.
5. All user-facing strings through `next-intl` (`messages/ar.json`, `en.json`). No hardcoded English in JSX except brand `Digi World`.
6. Prices from catalog helpers, never magic numbers in random components.
7. Accessible drawers/modals.
8. No `alert()`.
9. No leftover `console.log` of PII.
10. Images: `next/image`, explicit width/height or fill + sizes.
11. Commit-ready `.gitignore`: `node_modules`, `.next`, `.env`, `__pycache__`, `.venv`.
12. README at repo root: 20 lines, link to `docs/README.md`.
13. Seed catalog so production isn’t empty.
14. If a doc conflicts, prefer **CRO + tracking + brand** docs.
15. Do not build a blog, user accounts, or Stripe unless `CHECKOUT_MODE` needs it.
16. Comments only when the why is non-obvious (CAPI hashing, event_id).
17. RTL tested: header circle on the right, cart drawer from the left, email inputs LTR.
18. Mobile first: 375px width must not overflow.
19. Favicon + OG + apple touch from BrandCircle.
20. When done, both folders boot with Docker.
