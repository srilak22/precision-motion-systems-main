"""
FastAPI Router for Company Discovery, Explorer, Profile, Stats, and Review.
"""
from __future__ import annotations

import io
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from fastapi.responses import StreamingResponse
import pandas as pd
from sqlalchemy import select, func, and_, or_, desc, asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.company import Company, ManufacturingClassification, ReviewStatus, LegalStatus
from app.models.person import Person
from app.models.financial import Financial
from app.models.source import FieldEvidence
from app.schemas.company import (
    CompanyResponse,
    PaginatedCompaniesResponse,
    CompanyStatsResponse,
    ReviewUpdateRequest,
)

router = APIRouter(prefix="/companies", tags=["Companies"])


@router.get("/stats", response_model=CompanyStatsResponse)
async def get_company_stats(db: AsyncSession = Depends(get_db)):
    """Computes high-level KPIs, progress toward 50k unique target, and country gap report."""
    total_disc = await db.scalar(select(func.count(Company.id))) or 0
    unique_cos = await db.scalar(select(func.count(Company.id)).where(Company.is_duplicate == False)) or 0
    verified_mfgs = await db.scalar(
        select(func.count(Company.id)).where(
            and_(Company.is_verified == True, Company.is_duplicate == False)
        )
    ) or 0
    pending_rev = await db.scalar(
        select(func.count(Company.id)).where(Company.review_status == ReviewStatus.pending)
    ) or 0
    with_web = await db.scalar(
        select(func.count(Company.id)).where(Company.official_website != None)
    ) or 0
    with_contact = await db.scalar(
        select(func.count(Company.id)).where(or_(Company.email != None, Company.phone != None))
    ) or 0
    with_lead = await db.scalar(
        select(func.count(func.distinct(Person.company_id)))
    ) or 0
    with_fin = await db.scalar(
        select(func.count(func.distinct(Financial.company_id)))
    ) or 0
    dup_count = await db.scalar(
        select(func.count(Company.id)).where(Company.is_duplicate == True)
    ) or 0

    # Country breakdown
    country_rows = (await db.execute(
        select(Company.country, func.count(Company.id))
        .where(Company.is_duplicate == False)
        .group_by(Company.country)
    )).all()
    country_breakdown = {row[0]: row[1] for row in country_rows if row[0]}

    # Industry breakdown
    ind_rows = (await db.execute(
        select(Company.industry_sector, func.count(Company.id))
        .where(Company.is_duplicate == False)
        .group_by(Company.industry_sector)
    )).all()
    industry_breakdown = {row[0]: row[1] for row in ind_rows if row[0]}

    # Country-wise targets and gap report
    # Target allocations: US 15000, India 15000, UK 8000, Middle East 8000, SG 4000
    targets = {
        "United States": 15000,
        "India": 15000,
        "United Kingdom": 8000,
        "Middle East": 8000,
        "Singapore": 4000,
    }
    # Aggregate Middle East nations
    gcc_countries = ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Bahrain", "Kuwait"]
    me_count = sum(country_breakdown.get(c, 0) for c in gcc_countries)

    gap_report = {
        "United States": {
            "target": 15000,
            "collected": country_breakdown.get("United States", 0),
            "gap": max(0, 15000 - country_breakdown.get("United States", 0)),
        },
        "India": {
            "target": 15000,
            "collected": country_breakdown.get("India", 0),
            "gap": max(0, 15000 - country_breakdown.get("India", 0)),
        },
        "United Kingdom": {
            "target": 8000,
            "collected": country_breakdown.get("United Kingdom", 0),
            "gap": max(0, 8000 - country_breakdown.get("United Kingdom", 0)),
        },
        "Middle East": {
            "target": 8000,
            "collected": me_count,
            "gap": max(0, 8000 - me_count),
        },
        "Singapore": {
            "target": 4000,
            "collected": country_breakdown.get("Singapore", 0),
            "gap": max(0, 4000 - country_breakdown.get("Singapore", 0)),
        },
    }

    target_count = 50000
    progress = round(min(100.0, (verified_mfgs / target_count) * 100), 2)

    return CompanyStatsResponse(
        total_discovered=total_disc,
        unique_companies=unique_cos,
        verified_manufacturers=verified_mfgs,
        pending_review=pending_rev,
        with_websites=with_web,
        with_contacts=with_contact,
        with_leadership=with_lead,
        with_financials=with_fin,
        duplicate_count=dup_count,
        error_count=0,
        target_count=target_count,
        progress_to_target=progress,
        country_breakdown=country_breakdown,
        industry_breakdown=industry_breakdown,
        gap_report=gap_report,
    )


@router.get("/search", response_model=List[CompanyResponse])
async def search_companies(
    q: str = Query(..., min_length=1),
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
):
    """Autocomplete / quick search across company names and domains."""
    term = f"%{q.strip()}%"
    stmt = (
        select(Company)
        .where(
            and_(
                Company.is_duplicate == False,
                or_(
                    Company.legal_name.ilike(term),
                    Company.root_domain.ilike(term),
                    Company.registration_number.ilike(term),
                ),
            )
        )
        .limit(limit)
    )
    res = await db.execute(stmt)
    companies = res.scalars().all()
    return [_format_company_response(c) for c in companies]


@router.get("", response_model=PaginatedCompaniesResponse)
async def list_companies(
    q: Optional[str] = None,
    countries: Optional[List[str]] = Query(None),
    classifications: Optional[List[str]] = Query(None),
    employee_ranges: Optional[List[str]] = Query(None),
    legal_statuses: Optional[List[str]] = Query(None),
    has_website: Optional[bool] = None,
    is_verified: Optional[bool] = None,
    industry_sector: Optional[str] = None,
    page: int = Query(1, ge=1),
    page_size: int = Query(25, ge=1, le=200),
    sort_by: str = Query("created_at"),
    sort_dir: str = Query("desc"),
    db: AsyncSession = Depends(get_db),
):
    """Server-side paginated & multi-filtered company explorer query."""
    conditions = [Company.is_duplicate == False]

    if q:
        term = f"%{q.strip()}%"
        conditions.append(
            or_(
                Company.legal_name.ilike(term),
                Company.city.ilike(term),
                Company.registration_number.ilike(term),
                Company.root_domain.ilike(term),
            )
        )

    if countries and len(countries) > 0:
        # Handle 'Middle East' selection group
        if "Middle East" in countries:
            gcc = ["United Arab Emirates", "Saudi Arabia", "Qatar", "Oman", "Bahrain", "Kuwait"]
            expanded = [c for c in countries if c != "Middle East"] + gcc
            conditions.append(Company.country.in_(expanded))
        else:
            conditions.append(Company.country.in_(countries))

    if classifications and len(classifications) > 0:
        conditions.append(Company.manufacturing_classification.in_(classifications))

    if employee_ranges and len(employee_ranges) > 0:
        conditions.append(Company.employee_count_range.in_(employee_ranges))

    if legal_statuses and len(legal_statuses) > 0:
        conditions.append(Company.legal_status.in_(legal_statuses))

    if has_website is True:
        conditions.append(Company.official_website != None)
    elif has_website is False:
        conditions.append(Company.official_website == None)

    if is_verified is not None:
        conditions.append(Company.is_verified == is_verified)

    if industry_sector:
        conditions.append(Company.industry_sector == industry_sector)

    # Count total matching
    count_stmt = select(func.count(Company.id)).where(and_(*conditions))
    total_records = await db.scalar(count_stmt) or 0

    # Build sorting
    sort_column = getattr(Company, sort_by, Company.created_at)
    order_clause = desc(sort_column) if sort_dir.lower() == "desc" else asc(sort_column)

    # Query items with relations
    stmt = (
        select(Company)
        .options(
            selectinload(Company.people),
            selectinload(Company.financials),
            selectinload(Company.field_evidences),
        )
        .where(and_(*conditions))
        .order_by(order_clause)
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    res = await db.execute(stmt)
    companies = res.scalars().all()

    items = [_format_company_response(c) for c in companies]
    total_pages = max(1, (total_records + page_size - 1) // page_size)

    return PaginatedCompaniesResponse(
        items=items,
        total=total_records,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get("/export")
async def export_companies_quick(
    format: str = Query("csv"),
    countries: Optional[List[str]] = Query(None),
    industry_sector: Optional[str] = None,
    is_verified: Optional[bool] = True,
    db: AsyncSession = Depends(get_db),
):
    """Direct stream download for company exports."""
    conditions = [Company.is_duplicate == False]
    if countries:
        conditions.append(Company.country.in_(countries))
    if industry_sector:
        conditions.append(Company.industry_sector == industry_sector)
    if is_verified is not None:
        conditions.append(Company.is_verified == is_verified)

    stmt = select(Company).where(and_(*conditions)).limit(10000)
    res = await db.execute(stmt)
    companies = res.scalars().all()

    data = [
        {
            "Internal ID": c.internal_id,
            "Legal Name": c.legal_name,
            "Registration No": c.registration_number,
            "Country": c.country,
            "City": c.city,
            "Official Website": c.official_website,
            "Industry Sector": c.industry_sector,
            "Classification": c.manufacturing_classification.value if hasattr(c.manufacturing_classification, "value") else c.manufacturing_classification,
            "Employee Count": c.employee_count,
            "Phone": c.phone,
            "Email": c.email,
            "Verified": c.is_verified,
        }
        for c in companies
    ]
    df = pd.DataFrame(data)

    if format.lower() == "json":
        buf = io.BytesIO()
        buf.write(df.to_json(orient="records", indent=2).encode("utf-8"))
        buf.seek(0)
        return StreamingResponse(
            buf,
            media_type="application/json",
            headers={"Content-Disposition": "attachment; filename=manufacturing_companies.json"},
        )
    elif format.lower() in ["excel", "xlsx"]:
        buf = io.BytesIO()
        df.to_excel(buf, index=False, engine="openpyxl")
        buf.seek(0)
        return StreamingResponse(
            buf,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=manufacturing_companies.xlsx"},
        )
    else:
        buf = io.StringIO()
        df.to_csv(buf, index=False)
        return Response(
            content=buf.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=manufacturing_companies.csv"},
        )


@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company_profile(
    company_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Returns single company profile with people, financials, and provenance audit trail."""
    stmt = (
        select(Company)
        .options(
            selectinload(Company.people),
            selectinload(Company.financials),
            selectinload(Company.field_evidences),
        )
        .where(Company.id == company_id)
    )
    res = await db.execute(stmt)
    company = res.scalar_one_or_none()
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")
    return _format_company_response(company)


@router.patch("/{company_id}/review", response_model=CompanyResponse)
async def update_company_review(
    company_id: uuid.UUID,
    review_data: ReviewUpdateRequest,
    db: AsyncSession = Depends(get_db),
):
    """Updates human-review status and classification override for ambiguous records."""
    company = await db.get(Company, company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found.")

    if review_data.review_status:
        try:
            company.review_status = ReviewStatus(review_data.review_status.lower())
        except ValueError:
            pass

    if review_data.review_note:
        company.review_note = review_data.review_note

    if review_data.manufacturing_classification:
        try:
            company.manufacturing_classification = ManufacturingClassification(
                review_data.manufacturing_classification
            )
        except ValueError:
            pass

    await db.commit()
    return await get_company_profile(company_id, db)


def _format_company_response(c: Company) -> Dict[str, Any]:
    """Helper to serialize Company ORM into response schema."""
    return {
        "id": str(c.id),
        "internal_id": c.internal_id,
        "legal_name": c.legal_name,
        "trading_name": c.trading_name,
        "former_name": c.former_name,
        "registration_number": c.registration_number,
        "legal_entity_type": c.legal_entity_type,
        "incorporation_date": c.incorporation_date,
        "legal_status": c.legal_status.value if hasattr(c.legal_status, "value") else c.legal_status,
        "country": c.country,
        "state_province": c.state_province,
        "city": c.city,
        "registered_address": c.registered_address,
        "headquarters_address": c.headquarters_address,
        "postal_code": c.postal_code,
        "facility_locations": c.facility_locations or [],
        "official_website": c.official_website,
        "root_domain": c.root_domain,
        "linkedin_url": c.linkedin_url,
        "facebook_url": c.facebook_url,
        "twitter_url": c.twitter_url,
        "about_page_url": c.about_page_url,
        "contact_page_url": c.contact_page_url,
        "products_page_url": c.products_page_url,
        "leadership_page_url": c.leadership_page_url,
        "phone": c.phone,
        "email": c.email,
        "sales_email": c.sales_email,
        "contact_form_url": c.contact_form_url,
        "employee_count": c.employee_count,
        "employee_count_range": c.employee_count_range.value if hasattr(c.employee_count_range, "value") else c.employee_count_range,
        "employee_count_source": c.employee_count_source,
        "founded_year": c.founded_year,
        "manufacturing_classification": c.manufacturing_classification.value if hasattr(c.manufacturing_classification, "value") else c.manufacturing_classification,
        "classification_confidence": c.classification_confidence or 0.0,
        "classification_reason": c.classification_reason,
        "industry_sector": c.industry_sector,
        "industry_subsector": c.industry_subsector,
        "naics_code": c.naics_code,
        "sic_code": c.sic_code,
        "ssic_code": c.ssic_code,
        "nic_code": c.nic_code,
        "isic_code": c.isic_code,
        "main_products": c.main_products or [],
        "product_categories": c.product_categories or [],
        "manufacturing_processes": c.manufacturing_processes or [],
        "certifications": c.certifications or [],
        "export_markets": c.export_markets or [],
        "materials_handled": c.materials_handled or [],
        "capabilities": c.capabilities or [],
        "is_oem": c.is_oem or False,
        "is_odm": c.is_odm or False,
        "has_contract_manufacturing": c.has_contract_manufacturing or False,
        "is_verified": c.is_verified,
        "verification_date": c.verification_date,
        "data_completeness_score": c.data_completeness_score or 0.0,
        "review_status": c.review_status.value if hasattr(c.review_status, "value") else c.review_status,
        "review_note": c.review_note,
        "discovery_source": c.discovery_source,
        "discovery_timestamp": c.discovery_timestamp,
        "last_enriched_at": c.last_enriched_at,
        "is_duplicate": c.is_duplicate,
        "duplicate_of_id": str(c.duplicate_of_id) if c.duplicate_of_id else None,
        "parent_company_id": str(c.parent_company_id) if c.parent_company_id else None,
        "people": [
            {
                "id": str(p.id),
                "company_id": str(p.company_id),
                "full_name": p.full_name,
                "job_title": p.job_title,
                "role_type": p.role_type.value if hasattr(p.role_type, "value") else p.role_type,
                "appointment_date": p.appointment_date,
                "public_profile_url": p.public_profile_url,
                "linkedin_url": p.linkedin_url,
                "email": p.email,
                "evidence_source_url": p.evidence_source_url,
                "verification_date": p.verification_date,
            }
            for p in (c.people or [])
        ],
        "financials": [
            {
                "id": str(f.id),
                "company_id": str(f.company_id),
                "revenue_amount": f.revenue_amount,
                "revenue_currency": f.revenue_currency,
                "financial_year": f.financial_year,
                "reporting_period_start": f.reporting_period_start,
                "reporting_period_end": f.reporting_period_end,
                "is_reported": f.is_reported,
                "is_consolidated": f.is_consolidated,
                "confidence": f.confidence,
                "source": f.source,
                "revenue_source_url": f.revenue_source_url,
                "filing_url": f.filing_url,
                "profit_loss_amount": f.profit_loss_amount,
                "employee_count_reported": f.employee_count_reported,
            }
            for f in (c.financials or [])
        ],
        "field_evidences": [
            {
                "id": str(e.id),
                "field_name": e.field_name,
                "field_value": e.field_value,
                "source_url": e.source_url,
                "collection_timestamp": e.collection_timestamp,
                "confidence_score": e.confidence_score,
                "verification_status": e.verification_status.value if hasattr(e.verification_status, "value") else e.verification_status,
                "extraction_method": e.extraction_method,
                "license_category": e.license_category,
            }
            for e in (c.field_evidences or [])
        ],
    }

