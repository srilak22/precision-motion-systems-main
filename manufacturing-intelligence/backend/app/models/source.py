"""
SQLAlchemy ORM models for `sources` (source registry) and `field_evidence` tables.
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------


class VerificationStatus(str, enum.Enum):
    verified = "verified"
    estimated = "estimated"
    unavailable = "unavailable"
    conflicting = "conflicting"


class SourceType(str, enum.Enum):
    government_registry = "government_registry"
    stock_exchange = "stock_exchange"
    trade_directory = "trade_directory"
    news_aggregator = "news_aggregator"
    social_media = "social_media"
    web_crawl = "web_crawl"
    api = "api"
    bulk_download = "bulk_download"
    manual = "manual"


# ---------------------------------------------------------------------------
# Source model
# ---------------------------------------------------------------------------


class Source(Base):
    """Registry of data sources used for company discovery and enrichment."""

    __tablename__ = "sources"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid(),
    )
    name: Mapped[str] = mapped_column(String(128), unique=True, nullable=False)
    country: Mapped[Optional[str]] = mapped_column(String(3), nullable=True, index=True)
    source_type: Mapped[Optional[SourceType]] = mapped_column(
        Enum(SourceType, name="source_type_enum"), nullable=True
    )
    base_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    api_docs_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    license: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    rate_limit_per_minute: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    auth_required: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    bulk_available: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    last_sync_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    field_evidences = relationship(
        "FieldEvidence", back_populates="source", lazy="select"
    )

    def __repr__(self) -> str:
        return f"<Source name={self.name!r} country={self.country!r}>"


# ---------------------------------------------------------------------------
# FieldEvidence model
# ---------------------------------------------------------------------------


class FieldEvidence(Base):
    """
    Provenance record: links a specific field value on a company record to
    the source URL and collection metadata that produced it.
    """

    __tablename__ = "field_evidence"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        server_default=func.gen_random_uuid(),
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    field_name: Mapped[str] = mapped_column(String(128), nullable=False)
    field_value: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("sources.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    source_url: Mapped[Optional[str]] = mapped_column(String(1024), nullable=True)
    collection_timestamp: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    confidence_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    verification_status: Mapped[Optional[VerificationStatus]] = mapped_column(
        Enum(VerificationStatus, name="verification_status_enum"), nullable=True
    )
    extraction_method: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    license_category: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)

    # ── Relationships ─────────────────────────────────────────────────────────
    company = relationship("Company", back_populates="field_evidences")
    source = relationship("Source", back_populates="field_evidences")

    __table_args__ = (
        Index("ix_field_evidence_company_field", "company_id", "field_name"),
    )

    def __repr__(self) -> str:
        return (
            f"<FieldEvidence company_id={self.company_id!s} "
            f"field={self.field_name!r} status={self.verification_status!r}>"
        )
