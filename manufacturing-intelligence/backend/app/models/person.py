"""
SQLAlchemy ORM model for the `people` table (executives and directors).
"""
from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    ForeignKey,
    Index,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RoleType(str, enum.Enum):
    ceo = "ceo"
    founder = "founder"
    co_founder = "co_founder"
    managing_director = "managing_director"
    chairman = "chairman"
    board_director = "board_director"
    executive = "executive"


class Person(Base):
    """Executives, directors, and key personnel associated with a company."""

    __tablename__ = "people"

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
    full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    job_title: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    role_type: Mapped[Optional[RoleType]] = mapped_column(
        Enum(RoleType, name="role_type_enum"), nullable=True
    )
    appointment_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    public_profile_url: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True
    )
    evidence_source_url: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True
    )
    verification_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    company = relationship("Company", back_populates="people")

    __table_args__ = (
        Index("ix_people_company_id_role", "company_id", "role_type"),
    )

    def __repr__(self) -> str:
        return (
            f"<Person id={self.id!s} full_name={self.full_name!r} "
            f"company_id={self.company_id!s}>"
        )
