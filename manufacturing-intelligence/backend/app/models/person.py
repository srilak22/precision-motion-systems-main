"""
SQLAlchemy ORM model for the `people` table (executives, board directors, founders).
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
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.compat import GUID


class RoleType(str, enum.Enum):
    ceo = "ceo"
    founder = "founder"
    co_founder = "co_founder"
    managing_director = "managing_director"
    chairman = "chairman"
    board_director = "board_director"
    executive = "executive"
    plant_manager = "plant_manager"
    chief_technology_officer = "chief_technology_officer"


class Person(Base):
    """Executives, directors, and key personnel associated with a company."""

    __tablename__ = "people"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
    )
    company_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("companies.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    full_name: Mapped[str] = mapped_column(String(256), nullable=False)
    job_title: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    role_type: Mapped[Optional[RoleType]] = mapped_column(
        Enum(RoleType, name="role_type_enum", native_enum=False), nullable=True
    )
    appointment_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    public_profile_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    evidence_source_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
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
            f"role={self.role_type} company_id={self.company_id!s}>"
        )
