"""
Application configuration using Pydantic Settings.
All settings are read from environment variables or a .env file.
"""
from __future__ import annotations

import logging
from functools import lru_cache
from typing import Optional

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Global application settings."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Database ──────────────────────────────────────────────────────────────
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///./manufacturing_intel.db",
        description="Async SQLAlchemy database URL (PostgreSQL for prod, SQLite for dev/test).",
    )

    # Sync URL derived for Alembic (uses psycopg2 instead of asyncpg)
    @property
    def sync_database_url(self) -> str:
        url = self.DATABASE_URL
        if "asyncpg" in url:
            return url.replace("postgresql+asyncpg://", "postgresql+psycopg2://")
        if "aiosqlite" in url:
            return url.replace("sqlite+aiosqlite://", "sqlite://")
        return url

    # ── Redis / Celery ─────────────────────────────────────────────────────────
    REDIS_URL: str = Field(
        default="redis://localhost:6379/0",
        description="Redis connection URL.",
    )

    # ── Security ───────────────────────────────────────────────────────────────
    SECRET_KEY: str = Field(
        default="change-me-in-production-use-a-long-random-string",
        description="Secret key for signing tokens / sessions.",
    )

    # ── External API keys (optional) ──────────────────────────────────────────
    COMPANIES_HOUSE_API_KEY: Optional[str] = Field(
        default=None,
        description="UK Companies House REST API key.",
    )
    CENSUS_API_KEY: Optional[str] = Field(
        default=None,
        description="US Census Bureau API key.",
    )
    OPENCORPORATES_API_TOKEN: Optional[str] = Field(
        default=None,
        description="OpenCorporates API token.",
    )

    # ── App behaviour ─────────────────────────────────────────────────────────
    ENVIRONMENT: str = Field(
        default="development",
        description="Runtime environment (development | staging | production).",
    )
    LOG_LEVEL: str = Field(
        default="INFO",
        description="Python logging level.",
    )
    MAX_WORKERS: int = Field(
        default=4,
        description="Maximum number of parallel worker processes.",
    )
    CRAWL_DELAY_SECONDS: float = Field(
        default=2.0,
        ge=0.5,
        description="Minimum delay between outbound HTTP requests (polite crawling).",
    )

    # ── CORS ──────────────────────────────────────────────────────────────────
    CORS_ORIGINS: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:5173"],
        description="Allowed CORS origins.",
    )

    # ── Exports ───────────────────────────────────────────────────────────────
    EXPORT_DIR: str = Field(
        default="/tmp/mfg_exports",
        description="Directory where export files are written.",
    )

    @field_validator("LOG_LEVEL")
    @classmethod
    def validate_log_level(cls, v: str) -> str:
        allowed = {"DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"}
        upper = v.upper()
        if upper not in allowed:
            raise ValueError(f"LOG_LEVEL must be one of {allowed}")
        return upper

    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        allowed = {"development", "staging", "production"}
        lower = v.lower()
        if lower not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {allowed}")
        return lower


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached Settings instance (singleton)."""
    settings = Settings()
    logging.basicConfig(level=settings.LOG_LEVEL)
    return settings


# Module-level convenience alias
settings = get_settings()
