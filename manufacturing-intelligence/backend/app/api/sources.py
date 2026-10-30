"""
FastAPI Router for Source Connectors Registry and API status monitoring.
"""
from __future__ import annotations

from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.source import Source
from app.schemas.quality import SourceConnectorResponse
from app.connectors.source_registry import SOURCE_REGISTRY
from app.config import settings

router = APIRouter(prefix="/sources", tags=["Sources"])


@router.get("", response_model=List[SourceConnectorResponse])
async def list_sources(db: AsyncSession = Depends(get_db)):
    """Returns all source connectors with rate limits, license terms, and operational status."""
    stmt = select(Source)
    res = await db.execute(stmt)
    db_sources = {s.name: s for s in res.scalars().all()}

    output = []
    for s_meta in SOURCE_REGISTRY:
        db_s = db_sources.get(s_meta["name"])
        collected = db_s.companies_collected if db_s else 0
        last_sync = db_s.last_sync_at if db_s else None
        status = db_s.status if db_s else "active"

        # Check if required api key is configured
        has_key = True
        if s_meta.get("requires_api_key"):
            if "companies_house" in s_meta["id"] and not settings.COMPANIES_HOUSE_API_KEY:
                has_key = False
            elif "census" in s_meta["id"] and not settings.CENSUS_API_KEY:
                has_key = False
            elif "opencorporates" in s_meta["id"] and not settings.OPENCORPORATES_API_TOKEN:
                has_key = False

        output.append(
            SourceConnectorResponse(
                id=s_meta["id"],
                name=s_meta["name"],
                country=s_meta["country"],
                country_code=s_meta["country_code"],
                flag=s_meta.get("flag", "🌐"),
                description=s_meta.get("description"),
                base_url=s_meta.get("base_url"),
                api_docs_url=s_meta.get("api_docs_url"),
                license=s_meta.get("license"),
                rate_limit_per_minute=s_meta.get("rate_limit_per_minute", 60),
                auth_required=s_meta.get("auth_required", False),
                bulk_available=s_meta.get("bulk_available", False),
                last_sync_at=last_sync,
                companies_collected=collected,
                status=status,
                requires_api_key=s_meta.get("requires_api_key", False),
                api_key_configured=has_key,
            )
        )

    return output

