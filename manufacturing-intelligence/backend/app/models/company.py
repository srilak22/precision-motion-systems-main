"""
SQLAlchemy ORM model for the `companies` table.
The central entity in the Global Manufacturing Company Intelligence Platform.
"""
from __future__ import annotations

import enum
import uuid
from datetime import date, datetime
from typing import Optional, List

from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.compat import GUID, StringListType, JsonCompatible


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class LegalStatus(str, enum.Enum):
    active = "active"
    dissolved = "dissolved"
    inactive = "inactive"
    unknown = "unknown"


class EmployeeCountRange(str, enum.Enum):
    range_1_10 = "1-10"
    range_11_50 = "11-50"
    range_51_200 = "51-200"
    range_201_500 = "201-500"
    range_501_1000 = "501-1000"
    range_1001_5000 = "1001-5000"
    range_5000_plus = "5000+"


# Alias for backward compatibility
EmployeeRange = EmployeeCountRange


class ManufacturingClassification(str, enum.Enum):
    confirmed_manufacturer = "confirmed_manufacturer"
    probable_manufacturer = "probable_manufacturer"
    manufacturer_and_distributor = "manufacturer_and_distributor"
    contract_manufacturer = "contract_manufacturer"
    multi_facility_manufacturer = "multi_facility_manufacturer"
    distributor_only = "distributor_only"
    service_provider_only = "service_provider_only"
    unknown = "unknown"


class ReviewStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    flagged = "flagged"


# ---------------------------------------------------------------------------
# Company Entity Model
# ---------------------------------------------------------------------------

class Company(Base):
    """Central company entity."""

    __tablename__ = "companies"

    # ── Primary key ─────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
    )
    internal_id: Mapped[str] = mapped_column(
        String(32),
        unique=True,
        nullable=False,
        default=lambda: f"MFG-{uuid.uuid4().hex[:12].upper()}",
    )

    # ── Identity ─────────────────────────────────────────────────────────────
    legal_name: Mapped[str] = mapped_column(String(512), nullable=False, index=True)
    trading_name: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    former_name: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    registration_number: Mapped[Optional[str]] = mapped_column(
        String(128), nullable=True, index=True
    )
    legal_entity_type: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    incorporation_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    legal_status: Mapped[Optional[LegalStatus]] = mapped_column(
        Enum(LegalStatus, name="legal_status_enum", native_enum=False), nullable=True
    )

    # ── Geography ────────────────────────────────────────────────────────────
    country: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    state_province: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    city: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    registered_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    headquarters_address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    postal_code: Mapped[Optional[str]] = mapped_column(String(32), nullable=True)
    facility_locations: Mapped[Optional[List[str]]] = mapped_column(
        StringListType, nullable=True
    )

    # ── Web Presence & Digital Footprint ─────────────────────────────────────
    official_website: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    root_domain: Mapped[Optional[str]] = mapped_column(
        String(256), nullable=True, index=True
    )
    linkedin_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    facebook_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    twitter_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    about_page_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    contact_page_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    products_page_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    leadership_page_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # ── Contact Information (Verified Public Business Contacts) ─────────────
    phone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    email: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    sales_email: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    contact_form_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)

    # ── Size & Workforce ─────────────────────────────────────────────────────
    employee_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    employee_count_range: Mapped[Optional[EmployeeCountRange]] = mapped_column(
        Enum(EmployeeCountRange, name="employee_count_range_enum", native_enum=False), nullable=True
    )
    employee_count_source: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    founded_year: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

    # ── Manufacturing Classification & Taxonomy ──────────────────────────────
    manufacturing_classification: Mapped[Optional[ManufacturingClassification]] = mapped_column(
        Enum(ManufacturingClassification, name="manufacturing_classification_enum", native_enum=False),
        nullable=True,
    )
    classification_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    classification_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # ── Industry Codes & Taxonomy ───────────────────────────────────────────
    industry_sector: Mapped[Optional[str]] = mapped_column(
        String(256), nullable=True, index=True
    )
    industry_subsector: Mapped[Optional[str]] = mapped_column(String(256), nullable=True)
    naics_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    sic_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    ssic_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    nic_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)
    isic_code: Mapped[Optional[str]] = mapped_column(String(16), nullable=True)

    # ── Products, Capabilities & Technology ──────────────────────────────────
    main_products: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)
    product_categories: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)
    manufacturing_processes: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)
    certifications: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)
    export_markets: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)
    materials_handled: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)
    capabilities: Mapped[Optional[List[str]]] = mapped_column(StringListType, nullable=True)

    is_oem: Mapped[Optional[bool]] = mapped_column(Boolean, default=False, nullable=True)
    is_odm: Mapped[Optional[bool]] = mapped_column(Boolean, default=False, nullable=True)
    has_contract_manufacturing: Mapped[Optional[bool]] = mapped_column(Boolean, default=False, nullable=True)

    # ── Verification & Quality ───────────────────────────────────────────────
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    verification_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    data_completeness_score: Mapped[Optional[float]] = mapped_column(Float, default=0.0, nullable=True)
    review_status: Mapped[ReviewStatus] = mapped_column(
        Enum(ReviewStatus, name="review_status_enum", native_enum=False),
        default=ReviewStatus.pending,
        nullable=False,
    )
    review_note: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # ── Data Provenance ──────────────────────────────────────────────────────
    discovery_source: Mapped[Optional[str]] = mapped_column(String(128), nullable=True, index=True)
    discovery_timestamp: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=True
    )
    last_enriched_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # ── Deduplication & Relationships ────────────────────────────────────────
    is_duplicate: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)
    duplicate_of_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID,
        ForeignKey("companies.id", ondelete="SET NULL"),
        nullable=True,
    )
    parent_company_id: Mapped[Optional[uuid.UUID]] = mapped_column(
        GUID,
        ForeignKey("companies.id", ondelete="SET NULL"),
        nullable=True,
    )

    # ── Timestamps ───────────────────────────────────────────────────────────
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # ── Relationships ────────────────────────────────────────────────────────
    people = relationship(
        "Person",
        back_populates="company",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    financials = relationship(
        "Financial",
        back_populates="company",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    field_evidences = relationship(
        "FieldEvidence",
        back_populates="company",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    duplicate_of = relationship(
        "Company",
        foreign_keys=[duplicate_of_id],
        remote_side="Company.id",
        lazy="select",
    )
    parent_company = relationship(
        "Company",
        foreign_keys=[parent_company_id],
        remote_side="Company.id",
        lazy="select",
    )

    __table_args__ = (
        UniqueConstraint("registration_number", "country", name="uq_reg_number_country"),
        Index("ix_companies_country_classification", "country", "manufacturing_classification"),
        Index("ix_companies_root_domain_country", "root_domain", "country"),
        Index("ix_companies_reg_number_country", "registration_number", "country"),
    )

    def __repr__(self) -> str:
        return (
            f"<Company id={self.id!s} internal_id={self.internal_id!r} "
            f"legal_name={self.legal_name!r} country={self.country!r}>"
        )
