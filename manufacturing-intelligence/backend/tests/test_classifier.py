"""
Automated tests for the Manufacturing Classification Engine.
"""
import pytest
from app.models.company import ManufacturingClassification
from app.services.classifier import ManufacturingClassifier, TAXONOMY_SECTORS


def test_taxonomy_sectors_coverage():
    """Verifies that all 10 core taxonomy sectors are configured."""
    required_sectors = [
        "Industrial machinery and equipment",
        "Robotics and automation",
        "Automotive and transportation",
        "Electrical and electronics",
        "Metal and fabrication",
        "Chemicals and materials",
        "Food and agriculture",
        "Pharmaceuticals and healthcare",
        "Textiles and consumer manufacturing",
        "Construction and infrastructure",
    ]
    for s in required_sectors:
        assert s in TAXONOMY_SECTORS
        assert len(TAXONOMY_SECTORS[s]["subsectors"]) > 0
        assert len(TAXONOMY_SECTORS[s]["keywords"]) > 0


def test_confirmed_manufacturer_classification():
    """Tests positive detection of confirmed industrial manufacturers."""
    result = ManufacturingClassifier.classify(
        name="Apex CNC Machine Tool Manufacturing Ltd.",
        description="We operate a factory producing CNC vertical machining centers and precision lathes.",
        products=["CNC Lathes", "Milling Machines"],
        processes=["Precision CNC machining", "Metal casting", "Subassembly"],
        has_facilities=True,
    )
    assert result.classification == ManufacturingClassification.confirmed_manufacturer
    assert result.confidence >= 0.85
    assert result.sector == "Industrial machinery and equipment"


def test_oem_contract_manufacturer_classification():
    """Tests detection of contract and OEM manufacturers."""
    result = ManufacturingClassifier.classify(
        name="Precision Systems OEM Corp",
        description="High-volume contract manufacturing and OEM printed circuit board assembly lines.",
        products=["PCB Assemblies", "Electronic enclosures"],
        is_oem=True,
        has_facilities=True,
    )
    assert result.classification == ManufacturingClassification.contract_manufacturer
    assert result.confidence >= 0.90


def test_distributor_only_disqualification():
    """Tests that pure distributors and wholesalers are classified and disqualified from mfg target."""
    result = ManufacturingClassifier.classify(
        name="Global Industrial Supplies & Wholesale Trading LLC",
        description="Authorized distributor and wholesale stockist of third-party pumps and bearings.",
        products=["Third-party bearings", "Imported valves"],
        processes=[],
        has_facilities=False,
    )
    assert result.classification == ManufacturingClassification.distributor_only
    assert result.confidence >= 0.80


def test_service_provider_disqualification():
    """Tests that consulting and software services are excluded from manufacturing count."""
    result = ManufacturingClassifier.classify(
        name="Industrial Management Advisory Partners",
        description="Strategic consulting, IT services, and financial advisory for factory executives.",
        products=[],
        processes=[],
        has_facilities=False,
    )
    assert result.classification == ManufacturingClassification.service_provider_only


def test_dual_manufacturer_and_distributor():
    """Tests identification of dual operations."""
    result = ManufacturingClassifier.classify(
        name="Hydraulic Dynamics & Tooling Co.",
        description="We manufacture custom hydraulic cylinders and act as regional authorized distributor for partner seals.",
        products=["Hydraulic cylinders", "Partner seals"],
        processes=["Cylinder machining", "Honing"],
        has_facilities=True,
    )
    assert result.classification == ManufacturingClassification.manufacturer_and_distributor

