# 19 — Deployment (EasyPanel + Docker + GitHub)

## Domains

| App | Domain | Notes |
| --- | --- | --- |
| Frontend | `digi-world.online` | also `www` → apex redirect |
| Backend | `api.digi-world.online` | HTTPS |

DNS: A/CNAME as EasyPanel shows. API CORS = `https://digi-world.online`, `https://www.digi-world.online`.

## Repo layout for GitHub

```
frontend/Dockerfile
frontend/.dockerignore
backend/Dockerfile
backend/.dockerignore
.gitignore
```

Two EasyPanel **App** services from the same repo (root directory override: `frontend` and `backend`).

## Frontend Dockerfile

- `node:22-alpine`
- pnpm install --frozen-lockfile
- `pnpm build`
- `pnpm start` on 3000
- `ENV NEXT_TELEMETRY_DISABLED=1`
- Pass `NEXT_PUBLIC_*` at **build time** (Next inlines them). EasyPanel: build args.

## Backend Dockerfile

- `python:3.12-slim`
- `pip install -r requirements.txt`
- `CMD uvicorn app.main:app --host 0.0.0.0 --port 8000`
- Migrations in lifespan (not a separate release job)

## EasyPanel env

Paste keys from `.env.example`.  

`DATABASE_URL` = EasyPanel internal Postgres URL for db `digi-world`, host like `digi-world_digi-world-database`, `sslmode=disable`.

Do not expose Postgres publicly.

## Health

EasyPanel healthcheck:

- Frontend `/`
- Backend `/health`

## Checklist after first deploy

1. `https://api.digi-world.online/health` → ok  
2. `https://api.digi-world.online/health/db` → ok  
3. `https://digi-world.online/ar` loads RTL  
4. Add to vault opens drawer  
5. Checkout → upsell → thank you  
6. Row in Postgres + Sheet  
7. Meta/TikTok/Snap test events (with test codes)

## Git

`.env` ignored. `.env.example` committed. Never commit the database password.
