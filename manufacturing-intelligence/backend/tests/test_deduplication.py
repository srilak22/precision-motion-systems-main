"""
Automated tests for Deduplication and Entity Resolution Engine.
"""
import pytest
from app.services.deduplication import DeduplicationService


def test_normalize_domain():
    """Tests domain normalization removing protocols, subdomains, queries, and trailing slashes."""
    cases = [
        ("https://www.abb.com/products/robotics", "abb.com"),
        ("http://kuka.com:8080/en/home?ref=google", "kuka.com"),
        ("WWW.RENISHAW.CO.UK/", "renishaw.co.uk"),
        ("fanuc.eu/", "fanuc.eu"),
        (None, None),
        ("", None),
    ]
    for raw, expected in cases:
        assert DeduplicationService.normalize_domain(raw) == expected


def test_normalize_company_name():
    """Tests legal suffix stripping and whitespace cleaning across jurisdictions."""
    cases = [
        ("Caterpillar Inc.", "caterpillar"),
        ("Rolls-Royce plc", "rolls royce"),
        ("Tata Motors Limited", "tata motors"),
        ("Venture Corporation Limited", "venture"),
        ("Ducab (Dubai Cable Company) LLC", "ducab"),
        ("AEM Holdings Ltd.", "aem"),
    ]
    for raw, expected in cases:
        norm = DeduplicationService.normalize_company_name(raw)
        assert expected in norm


def test_name_similarity_scoring():
    """Tests fuzzy string similarity metrics between variations of company names."""
    score_identical = DeduplicationService.calculate_name_similarity(
        "Parker-Hannifin Corp", "Parker Hannifin Corporation"
    )
    assert score_identical >= 0.90

    score_different = DeduplicationService.calculate_name_similarity(
        "Caterpillar Inc", "Boeing Company"
    )
    assert score_different < 0.30


def test_hard_match_registration_number():
    """Tests that identical official registration numbers in the same country trigger hard duplicate match."""
    is_dup, score, reasons = DeduplicationService.check_duplicate(
        candidate_name="Renishaw International",
        candidate_country="United Kingdom",
        candidate_reg_no="01103936",
        candidate_domain="renishaw-global.com",
        existing_name="Renishaw plc",
        existing_country="United Kingdom",
        existing_reg_no="01103936",
        existing_domain="renishaw.com",
    )
    assert is_dup is True
    assert score == 1.0
    assert any("registration number" in r.lower() for r in reasons)


def test_domain_and_country_match():
    """Tests duplicate match on canonical domain within same country."""
    is_dup, score, reasons = DeduplicationService.check_duplicate(
        candidate_name="Rockwell Automation Division",
        candidate_country="United States",
        candidate_reg_no="US-9999",
        candidate_domain="https://www.rockwellautomation.com/products",
        existing_name="Rockwell Automation, Inc.",
        existing_country="United States",
        existing_reg_no="0001024478",
        existing_domain="rockwellautomation.com",
    )
    assert is_dup is True
    assert score >= 0.95

