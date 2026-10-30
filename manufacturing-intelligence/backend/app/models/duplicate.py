"""
SQLAlchemy ORM model for `duplicate_candidates` (deduplication queue).
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import Optional, List

from sqlalchemy import (
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.compat import GUID, StringListType


class DuplicateCandidateStatus(str, enum.Enum):
    pending = "pending"
    resolved = "resolved"
    dismissed = "dismissed"


class DuplicateCandidate(Base):
    """Pair of suspected duplicate companies for human review or automated resolution."""

    __tablename__ = "duplicate_candidates"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
    )
    company_a_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    company_a_name: Mapped[str] = mapped_column(String(512), nullable=False)
    company_a_country: Mapped[str] = mapped_column(String(64), nullable=False)

    company_b_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    company_b_name: Mapped[str] = mapped_column(String(512), nullable=False)
    company_b_country: Mapped[str] = mapped_column(String(64), nullable=False)

    similarity_score: Mapped[float] = mapped_column(Float, nullable=False)
    match_reasons: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)

    status: Mapped[DuplicateCandidateStatus] = mapped_column(
        Enum(DuplicateCandidateStatus, name="duplicate_status_enum", native_enum=False),
        default=DuplicateCandidateStatus.pending,
        nullable=False,
        index=True,
    )
    resolution_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    resolved_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        Index("ix_dup_pair", "company_a_id", "company_b_id"),
    )

    def __repr__(self) -> str:
        return (
            f"<DuplicateCandidate id={self.id} score={self.similarity_score} "
            f"A='{self.company_a_name}' B='{self.company_b_name}'>"
        )

