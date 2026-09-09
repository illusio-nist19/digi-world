# Digi World

Premium DTC store — https://digi-world.online · API https://api.digi-world.online

- Spec: [docs/README.md](./docs/README.md)
- Store: `frontend/` (Next.js 15, locales `ar` `en` `fr` `es`)
- API: `backend/` (FastAPI, Postgres `digi-world`, Alembic on boot)
- Local API: `docker compose up` then `cd frontend && npm run dev`

Do not commit `.env`. Copy `frontend/.env.example` and `backend/.env.example` into EasyPanel. EasyPanel deploys each Dockerfile separately.
