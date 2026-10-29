"""
SQLAlchemy ORM model for the `financials` table.
Stores annual financial data (revenue, P&L) for companies.
"""
from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    String,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Financial(Base):
    """Annual financial record for a company."""

    __tablename__ = "financials"

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

    # ── Revenue ───────────────────────────────────────────────────────────────
    revenue_amount: Mapped[Optional[float]] = mapped_column(
        Numeric(20, 2), nullable=True
    )
    revenue_currency: Mapped[Optional[str]] = mapped_column(
        String(3), nullable=True
    )
    financial_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    reporting_period_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    reporting_period_end: Mapped[Optional[date]] = mapped_column(Date, nullable=True)

    # ── Metadata ──────────────────────────────────────────────────────────────
    is_reported: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False,
        comment="True = officially reported; False = analyst estimate"
    )
    is_consolidated: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    revenue_source_url: Mapped[Optional[str]] = mapped_column(
        String(512), nullable=True
    )
    filing_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # ── Additional financial data ──────────────────────────────────────────────
    profit_loss_amount: Mapped[Optional[float]] = mapped_column(
        Numeric(20, 2), nullable=True
    )
    employee_count_reported: Mapped[Optional[int]] = mapped_column(
        Integer, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    # ── Relationships ─────────────────────────────────────────────────────────
    company = relationship("Company", back_populates="financials")

    __table_args__ = (
        Index("ix_financials_company_year", "company_id", "financial_year"),
    )

    def __repr__(self) -> str:
        return (
            f"<Financial id={self.id!s} company_id={self.company_id!s} "
            f"year={self.financial_year} revenue={self.revenue_amount}>"
        )
