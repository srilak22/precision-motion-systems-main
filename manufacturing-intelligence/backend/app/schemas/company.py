"""
Pydantic v2 schemas for Company, Person, Financial, and Evidence.
"""
from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict, Field

from app.models.company import LegalStatus, ManufacturingClassification, EmployeeCountRange, ReviewStatus
from app.models.person import RoleType
from app.models.source import VerificationStatus, SourceType


class PersonBase(BaseModel):
    full_name: str
    job_title: Optional[str] = None
    role_type: Optional[str] = None
    appointment_date: Optional[date] = None
    public_profile_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    email: Optional[str] = None
    evidence_source_url: Optional[str] = None


class PersonResponse(PersonBase):
    id: str
    company_id: str
    verification_date: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class FinancialBase(BaseModel):
    revenue_amount: Optional[float] = None
    revenue_currency: Optional[str] = "USD"
    financial_year: Optional[int] = None
    reporting_period_start: Optional[date] = None
    reporting_period_end: Optional[date] = None
    is_reported: bool = True
    is_consolidated: bool = True
    confidence: Optional[float] = 1.0
    source: Optional[str] = None
    revenue_source_url: Optional[str] = None
    filing_url: Optional[str] = None
    profit_loss_amount: Optional[float] = None
    employee_count_reported: Optional[int] = None


class FinancialResponse(FinancialBase):
    id: str
    company_id: str

    model_config = ConfigDict(from_attributes=True)


class FieldEvidenceResponse(BaseModel):
    id: str
    field_name: str
    field_value: Optional[str] = None
    source_url: Optional[str] = None
    collection_timestamp: Optional[datetime] = None
    confidence_score: Optional[float] = 1.0
    verification_status: Optional[str] = None
    extraction_method: Optional[str] = None
    license_category: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class CompanyBase(BaseModel):
    legal_name: str
    trading_name: Optional[str] = None
    former_name: Optional[str] = None
    registration_number: Optional[str] = None
    legal_entity_type: Optional[str] = None
    incorporation_date: Optional[date] = None
    legal_status: Optional[str] = "active"

    country: str
    state_province: Optional[str] = None
    city: Optional[str] = None
    registered_address: Optional[str] = None
    headquarters_address: Optional[str] = None
    postal_code: Optional[str] = None
    facility_locations: Optional[List[str]] = []

    official_website: Optional[str] = None
    root_domain: Optional[str] = None
    linkedin_url: Optional[str] = None
    facebook_url: Optional[str] = None
    twitter_url: Optional[str] = None
    about_page_url: Optional[str] = None
    contact_page_url: Optional[str] = None
    products_page_url: Optional[str] = None
    leadership_page_url: Optional[str] = None

    phone: Optional[str] = None
    email: Optional[str] = None
    sales_email: Optional[str] = None
    contact_form_url: Optional[str] = None

    employee_count: Optional[int] = None
    employee_count_range: Optional[str] = None
    employee_count_source: Optional[str] = None
    founded_year: Optional[int] = None

    manufacturing_classification: Optional[str] = "unknown"
    classification_confidence: Optional[float] = 0.0
    classification_reason: Optional[str] = None

    industry_sector: Optional[str] = None
    industry_subsector: Optional[str] = None
    naics_code: Optional[str] = None
    sic_code: Optional[str] = None
    ssic_code: Optional[str] = None
    nic_code: Optional[str] = None
    isic_code: Optional[str] = None

    main_products: Optional[List[str]] = []
    product_categories: Optional[List[str]] = []
    manufacturing_processes: Optional[List[str]] = []
    certifications: Optional[List[str]] = []
    export_markets: Optional[List[str]] = []
    materials_handled: Optional[List[str]] = []
    capabilities: Optional[List[str]] = []

    is_oem: Optional[bool] = False
    is_odm: Optional[bool] = False
    has_contract_manufacturing: Optional[bool] = False


class CompanyCreate(CompanyBase):
    discovery_source: Optional[str] = "system"


class CompanyResponse(CompanyBase):
    id: str
    internal_id: str
    is_verified: bool = False
    verification_date: Optional[datetime] = None
    data_completeness_score: float = 0.0
    review_status: str = "pending"
    review_note: Optional[str] = None

    discovery_source: Optional[str] = None
    discovery_timestamp: Optional[datetime] = None
    last_enriched_at: Optional[datetime] = None

    is_duplicate: bool = False
    duplicate_of_id: Optional[str] = None
    parent_company_id: Optional[str] = None

    people: Optional[List[PersonResponse]] = []
    financials: Optional[List[FinancialResponse]] = []
    field_evidences: Optional[List[FieldEvidenceResponse]] = []

    model_config = ConfigDict(from_attributes=True)


class PaginatedCompaniesResponse(BaseModel):
    items: List[CompanyResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class CompanyStatsResponse(BaseModel):
    total_discovered: int
    unique_companies: int
    verified_manufacturers: int
    pending_review: int
    with_websites: int
    with_contacts: int
    with_leadership: int
    with_financials: int
    duplicate_count: int
    error_count: int
    target_count: int = 50000
    progress_to_target: float = 0.0
    country_breakdown: Dict[str, int]
    industry_breakdown: Dict[str, int]
    gap_report: Dict[str, Dict[str, int]]


class ReviewUpdateRequest(BaseModel):
    review_status: str
    review_note: Optional[str] = None
    manufacturing_classification: Optional[str] = None

