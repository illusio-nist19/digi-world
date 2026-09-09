# Digi World API

FastAPI + Postgres `digi-world`. Migrations run on process start.

```
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health: `GET /health` · `GET /health/db`

`DATABASE_URL` may be EasyPanel `postgres://...`. The app rewrites it to `postgresql+asyncpg://` and Alembic uses `postgresql+psycopg://`.
