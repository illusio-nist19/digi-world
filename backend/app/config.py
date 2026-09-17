from functools import lru_cache
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit

from pydantic_settings import BaseSettings, SettingsConfigDict


def to_async_dsn(url: str) -> str:
    raw = url.strip()
    if raw.startswith("postgres://"):
        raw = "postgresql://" + raw[len("postgres://") :]
    if raw.startswith("postgresql://") and "+asyncpg" not in raw:
        raw = "postgresql+asyncpg://" + raw[len("postgresql://") :]
    parts = urlsplit(raw)
    query = [(k, v) for k, v in parse_qsl(parts.query, keep_blank_values=True) if k.lower() != "sslmode"]
    return urlunsplit((parts.scheme, parts.netloc, parts.path, urlencode(query), parts.fragment))


def to_sync_dsn(url: str) -> str:
    async_url = to_async_dsn(url)
    return async_url.replace("postgresql+asyncpg://", "postgresql+psycopg://", 1)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_env: str = "production"
    app_version: str = "1.0.0"
    database_url: str = "postgres://postgres:CHANGE_ME@localhost:5432/digi-world"
    frontend_origins: str = "https://digi-world.online,https://www.digi-world.online,http://localhost:3000,http://localhost:3002"
    checkout_mode: str = "lead"
    delivery_mode: str = "instant"
    store_url: str = "https://digi-world.online"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    proof_mode: str = "studio"
    sheet_webhook_url: str = ""
    sheet_webhook_secret: str = ""
    meta_pixel_id: str = ""
    meta_capi_access_token: str = ""
    meta_test_event_code: str = ""
    tiktok_pixel_id: str = ""
    tiktok_access_token: str = ""
    tiktok_test_event_code: str = ""
    snap_pixel_id: str = ""
    snap_capi_token: str = ""
    snap_test_mode: bool = False
    capi_require_consent: bool = False
    resend_api_key: str = ""
    resend_from: str = "Digi World <hello@digi-world.online>"
    admin_token: str = ""
    checkout_rate_per_min: int = 10

    @property
    def async_database_url(self) -> str:
        return to_async_dsn(self.database_url)

    @property
    def sync_database_url(self) -> str:
        return to_sync_dsn(self.database_url)

    @property
    def origins(self) -> list[str]:
        return [o.strip() for o in self.frontend_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
