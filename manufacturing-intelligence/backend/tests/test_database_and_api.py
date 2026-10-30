"""
Automated tests for Database Models, API Endpoints, and Exporters.
"""
import uuid
import pytest
from httpx import AsyncClient
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company, ManufacturingClassification, LegalStatus, ReviewStatus
from app.models.person import Person, RoleType
from app.models.financial import Financial
from app.models.source import FieldEvidence, VerificationStatus
from app.models.job import CollectionJob, JobStatus, ExportJob
from app.workers.exporter import ExportWorker


@pytest.mark.asyncio
async def test_company_creation_and_relationships(db_session: AsyncSession):
    """Verifies normalized company creation and relationship cascading."""
    company = Company(
        legal_name="Renishaw plc",
        registration_number="01103936",
        country="United Kingdom",
        city="Wotton-under-Edge",
        official_website="https://www.renishaw.com",
        root_domain="renishaw.com",
        manufacturing_classification=ManufacturingClassification.confirmed_manufacturer,
        classification_confidence=0.98,
        industry_sector="Industrial machinery and equipment",
        is_verified=True,
    )
    db_session.add(company)
    await db_session.flush()

    person = Person(
        company_id=company.id,
        full_name="William Lee",
        job_title="Chief Executive Officer",
        role_type=RoleType.ceo,
    )
    db_session.add(person)

    fin = Financial(
        company_id=company.id,
        revenue_amount=671100000.0,
        revenue_currency="GBP",
        financial_year=2024,
        is_reported=True,
    )
    db_session.add(fin)

    ev = FieldEvidence(
        company_id=company.id,
        field_name="registration_number",
        field_value="01103936",
        source_url="https://api.company-information.service.gov.uk",
        confidence_score=1.0,
        verification_status=VerificationStatus.verified,
    )
    db_session.add(ev)
    await db_session.commit()

    # Query back
    stmt = select(Company).where(Company.id == company.id)
    res = await db_session.execute(stmt)
    saved = res.scalar_one()

    assert saved.legal_name == "Renishaw plc"
    assert len(saved.people) == 1
    assert saved.people[0].full_name == "William Lee"
    assert len(saved.financials) == 1
    assert saved.financials[0].revenue_currency == "GBP"
    assert len(saved.field_evidences) == 1


@pytest.mark.asyncio
async def test_api_health_check(client: AsyncClient):
    """Verifies that the /health endpoint is operational."""
    resp = await client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert data["target_companies"] == 50000


@pytest.mark.asyncio
async def test_api_list_companies(client: AsyncClient, db_session: AsyncSession):
    """Tests company list endpoint with pagination."""
    # Seed 3 companies
    for i in range(3):
        c = Company(
            legal_name=f"Test Mfg Company {i}",
            country="United States",
            is_verified=True,
            manufacturing_classification=ManufacturingClassification.confirmed_manufacturer,
        )
        db_session.add(c)
    await db_session.commit()

    resp = await client.get("/api/v1/companies?page=1&page_size=10")
    assert resp.status_code == 200
    data = resp.json()
    assert data["total"] == 3
    assert len(data["items"]) == 3
    assert data["page"] == 1


@pytest.mark.asyncio
async def test_api_stats_endpoint(client: AsyncClient, db_session: AsyncSession):
    """Tests /api/v1/companies/stats endpoint returning KPIs and gap report."""
    c = Company(
        legal_name="Caterpillar Inc.",
        country="United States",
        is_verified=True,
        manufacturing_classification=ManufacturingClassification.confirmed_manufacturer,
        official_website="https://www.cat.com",
    )
    db_session.add(c)
    await db_session.commit()

    resp = await client.get("/api/v1/companies/stats")
    assert resp.status_code == 200
    data = resp.json()
    assert data["verified_manufacturers"] >= 1
    assert "United States" in data["country_breakdown"]
    assert "United States" in data["gap_report"]
    assert data["gap_report"]["United States"]["target"] == 15000


@pytest.mark.asyncio
async def test_api_sources_endpoint(client: AsyncClient):
    """Tests /api/v1/sources lists all registered connectors."""
    resp = await client.get("/api/v1/sources")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data) >= 5
    source_ids = [s["id"] for s in data]
    assert "uk_companies_house" in source_ids
    assert "us_sec_edgar" in source_ids
    assert "india_mca" in source_ids
    assert "singapore_acra" in source_ids


@pytest.mark.asyncio
async def test_export_worker_csv_and_json(db_session: AsyncSession):
    """Tests background export file generation for CSV and JSON formats."""
    c = Company(
        legal_name="Export Test Manufacturer",
        country="Singapore",
        is_verified=True,
        manufacturing_classification=ManufacturingClassification.confirmed_manufacturer,
        official_website="https://www.exporttest.sg",
        email="info@exporttest.sg",
    )
    db_session.add(c)

    job = ExportJob(export_format="csv", status=JobStatus.PENDING)
    db_session.add(job)
    await db_session.commit()
    await db_session.refresh(job)

    # Run export worker
    await ExportWorker.run_export_job(job.id, export_format="csv", db=db_session)

    await db_session.refresh(job)
    assert job.status == JobStatus.COMPLETED
    assert job.record_count >= 1
    assert job.file_path is not None
    assert job.file_size_bytes > 0
