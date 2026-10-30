"""
Automated tests for Source Connectors and Registry.
"""
import pytest
from app.connectors.source_registry import SOURCE_REGISTRY, get_source_by_id
from app.connectors.uk_companies_house import UKCompaniesHouseConnector
from app.connectors.us_sec_edgar import USSecEdgarConnector
from app.connectors.india_mca import IndiaMCAConnector
from app.connectors.singapore_acra import SingaporeACRAConnector
from app.connectors.middle_east_gcc import MiddleEastGCCConnector


def test_source_registry_completeness():
    """Verifies that all 5 target regions have registered connectors with documentation and licenses."""
    target_countries = {"United Kingdom", "United States", "India", "Singapore", "United Arab Emirates", "Saudi Arabia"}
    registered_countries = {s["country"] for s in SOURCE_REGISTRY}
    for tc in target_countries:
        assert tc in registered_countries

    for s in SOURCE_REGISTRY:
        assert s["id"]
        assert s["name"]
        assert s["license"]
        assert s["rate_limit_per_minute"] > 0
        assert s["base_url"]


@pytest.mark.asyncio
async def test_uk_connector_discovery():
    """Tests that the UK connector discovers manufacturing entities."""
    conn = UKCompaniesHouseConnector()
    records = []
    async for rec in conn.discover_companies(batch_limit=10):
        records.append(rec)
        if len(records) >= 5:
            break

    assert len(records) >= 5
    first = records[0]
    assert first.country == "United Kingdom"
    assert first.registration_number is not None
    assert first.industry_sector is not None


@pytest.mark.asyncio
async def test_us_connector_discovery():
    """Tests that the US SEC EDGAR connector discovers US manufacturing entities."""
    conn = USSecEdgarConnector()
    records = []
    async for rec in conn.discover_companies(batch_limit=5):
        records.append(rec)
        if len(records) >= 5:
            break

    assert len(records) >= 5
    assert any("cat.com" in (r.website or "") or "deere.com" in (r.website or "") for r in records)


@pytest.mark.asyncio
async def test_india_connector_discovery():
    """Tests India MCA connector discovery."""
    conn = IndiaMCAConnector()
    records = []
    async for rec in conn.discover_companies(batch_limit=5):
        records.append(rec)
        if len(records) >= 5:
            break

    assert len(records) >= 5
    assert records[0].country == "India"


@pytest.mark.asyncio
async def test_middle_east_connector_discovery():
    """Tests GCC regional connector discovering UAE, KSA, Qatar, Oman, Bahrain, Kuwait companies."""
    conn = MiddleEastGCCConnector()
    records = []
    async for rec in conn.discover_companies(batch_limit=15):
        records.append(rec)
        if len(records) >= 15:
            break

    assert len(records) >= 15
    gcc_found = {r.country for r in records}
    assert "United Arab Emirates" in gcc_found or "Saudi Arabia" in gcc_found

