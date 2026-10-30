"""
Pydantic schemas for Source Registry and Quality / Deduplication review.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class SourceConnectorResponse(BaseModel):
    id: str
    name: str
    country: Optional[str] = None
    country_code: Optional[str] = None
    flag: Optional[str] = "🌐"
    description: Optional[str] = None
    base_url: Optional[str] = None
    api_docs_url: Optional[str] = None
    license: Optional[str] = None
    rate_limit_per_minute: Optional[int] = 60
    auth_required: bool = False
    bulk_available: bool = False
    last_sync_at: Optional[datetime] = None
    companies_collected: int = 0
    status: str = "active"
    requires_api_key: bool = False
    api_key_configured: bool = True

    model_config = ConfigDict(from_attributes=True)


class DuplicateCandidateResponse(BaseModel):
    id: str
    company_a_id: str
    company_a_name: str
    company_a_country: str
    company_b_id: str
    company_b_name: str
    company_b_country: str
    similarity_score: float
    match_reasons: List[str] = []
    status: str = "pending"
    resolution_note: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class DuplicateResolveRequest(BaseModel):
    action: str  # "merge", "link_duplicate", "dismiss"
    primary_company_id: Optional[str] = None
    note: Optional[str] = None


class MissingFieldItem(BaseModel):
    country: str
    total: int
    missing_website: int
    missing_phone: int
    missing_email: int
    missing_employee_count: int
    missing_address: int
    missing_financials: int
    missing_leadership: int
    completeness_score: float


class QualitySummaryResponse(BaseModel):
    overall_score: float
    completeness_score: float
    accuracy_score: float
    consistency_score: float
    freshness_score: float
    duplicate_rate: float
    verified_rate: float
    pending_review_count: int
    classification_issues: int
    by_country: List[MissingFieldItem]

