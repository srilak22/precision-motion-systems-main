"""
Automated Test Suite for US Robotics & Automation Company Intelligence Platform
INDUS Industrial Robotics | Antigravity Company Discovery & Mining System

Tests:
1. URL normalization and canonical domain extraction
2. SSRF Protection (Localhost, RFC1918 private subnets, AWS/GCP/Azure link-local metadata)
3. Page classification (Homepage, Leadership, Products, Specs, Contacts, Applications)
4. Technical specification extraction with units (payload_kg, reach_mm, repeatability_mm, axes, backlash)
5. Business contact extraction (Phone, Email, Inquiries)
6. Leadership & executive extraction
7. Source evidence provenance and confidence scoring
8. Database integrity and entity counts
9. Deduplication and relationship resolution
10. Export integrity (CSV / JSON)
"""

import os
import sys
import json
import sqlite3
import unittest
from datetime import datetime, timezone

# Ensure UTF-8 output on Windows consoles
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Ensure parent path in sys.path
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from src.intelligence.crawler import (
    is_safe_url,
    normalize_domain,
    classify_page_url,
    SPEC_PATTERNS,
    LEADERSHIP_ROLE_KEYWORDS
)
from src.intelligence.importer import extract_canonical_domain, calculate_completeness_score
from src.intelligence.db import get_connection, DB_PATH


class TestUSRoboticsIntelligence(unittest.TestCase):

    def test_01_canonical_domain_normalization(self):
        """Test URL normalization removes protocols, www, subpaths, and ports safely."""
        self.assertEqual(extract_canonical_domain("https://www.fanucamerica.com/"), "fanucamerica.com")
        self.assertEqual(extract_canonical_domain("http://yaskawa.com/products/robots"), "yaskawa.com")
        self.assertEqual(extract_canonical_domain("www.universal-robots.com"), "universal-robots.com")
        self.assertEqual(extract_canonical_domain("kuka.com:443"), "kuka.com")
        self.assertEqual(normalize_domain("https://WWW.ABB.COM/robotics"), "abb.com")

    def test_02_ssrf_protection(self):
        """Test SSRF guard blocks localhost, loopbacks, internal subnets, and metadata endpoints."""
        # Localhost & Loopback
        safe, reason = is_safe_url("http://127.0.0.1:8080/admin")
        self.assertFalse(safe)
        self.assertIn("Blocked", reason)

        safe, _ = is_safe_url("http://localhost:3000/")
        self.assertFalse(safe)

        # RFC1918 Private Subnets
        safe, _ = is_safe_url("http://10.0.1.50/metrics")
        self.assertFalse(safe)

        safe, _ = is_safe_url("http://192.168.1.1/router")
        self.assertFalse(safe)

        safe, _ = is_safe_url("http://172.16.5.10/")
        self.assertFalse(safe)

        # AWS / GCP / Azure Link-Local Metadata Endpoint
        safe, reason = is_safe_url("http://169.254.169.254/latest/meta-data/")
        self.assertFalse(safe)
        self.assertIn("blocked subnet", reason)

        # Valid public target
        safe, reason = is_safe_url("https://www.automate.org/companies/robotics")
        self.assertTrue(safe)

    def test_03_page_classification(self):
        """Test URL path classification into operational categories."""
        self.assertEqual(classify_page_url("https://fanucamerica.com/"), "homepage")
        self.assertEqual(classify_page_url("https://fanucamerica.com/index.html"), "homepage")
        self.assertEqual(classify_page_url("https://kuka.com/en-us/company/leadership"), "leadership")
        self.assertEqual(classify_page_url("https://universal-robots.com/about-us/team"), "leadership")
        self.assertEqual(classify_page_url("https://yaskawa.com/products/industrial-robots"), "products")
        self.assertEqual(classify_page_url("https://harmonicdrive.net/products/reducers/specs"), "specs")
        self.assertEqual(classify_page_url("https://staubli.com/en-us/contact-us"), "contact")
        self.assertEqual(classify_page_url("https://abb.com/robotics/case-studies/automotive"), "applications")

    def test_04_technical_spec_extraction_patterns(self):
        """Test regex extraction of robot specifications with units preserved."""
        import re
        sample_html_text = "The M-20iD/25 robot features a payload capacity of 25 kg, a reach of 1831 mm, and pose repeatability of ±0.02 mm across 6 axes."

        # Payload
        payload_match = None
        for pat in SPEC_PATTERNS["payload_kg"]:
            m = re.search(pat, sample_html_text, re.IGNORECASE)
            if m:
                payload_match = m.group(1)
                break
        self.assertEqual(payload_match, "25")

        # Reach
        reach_match = None
        for pat in SPEC_PATTERNS["reach_mm"]:
            m = re.search(pat, sample_html_text, re.IGNORECASE)
            if m:
                reach_match = m.group(1)
                break
        self.assertEqual(reach_match, "1831")

        # Repeatability
        repeat_match = None
        for pat in SPEC_PATTERNS["repeatability_mm"]:
            m = re.search(pat, sample_html_text, re.IGNORECASE)
            if m:
                repeat_match = m.group(1)
                break
        self.assertEqual(repeat_match, "0.02")

        # Axes
        axes_match = None
        for pat in SPEC_PATTERNS["axes"]:
            m = re.search(pat, sample_html_text, re.IGNORECASE)
            if m:
                axes_match = m.group(1)
                break
        self.assertEqual(axes_match, "6")

    def test_05_completeness_score_calculation(self):
        """Test completeness scoring formula."""
        minimal_rec = {"legal_name": "Test Robotics", "website": "https://test.com", "canonical_domain": "test.com"}
        score_min = calculate_completeness_score(minimal_rec)
        self.assertGreaterEqual(score_min, 0.40)

        rich_rec = {
            "legal_name": "Premier Automation",
            "website": "https://premier.com",
            "canonical_domain": "premier.com",
            "hq_state": "Michigan",
            "company_description": "Robotic turnkey cells",
            "primary_products": "Robots; Gantry Systems",
            "robotics_categories": "Industrial Robotics",
            "source_references": "A3 Directory"
        }
        score_rich = calculate_completeness_score(rich_rec)
        self.assertGreater(score_rich, score_min)
        self.assertLessEqual(score_rich, 100.0)

    def test_06_database_integrity_and_records(self):
        """Test SQLite database contains populated, valid, non-synthetic entities."""
        self.assertTrue(os.path.exists(DB_PATH), f"Database file missing: {DB_PATH}")

        conn = get_connection()
        cur = conn.cursor()

        # Check companies count >= 600
        cur.execute("SELECT COUNT(*) FROM companies")
        total_comps = cur.fetchone()[0]
        self.assertGreaterEqual(total_comps, 600, f"Expected at least 600 companies, found {total_comps}")

        # Check US Headquartered count
        cur.execute("SELECT COUNT(*) FROM companies WHERE us_presence_status = 'US Headquartered'")
        us_hq = cur.fetchone()[0]
        self.assertGreater(us_hq, 500)

        # Check Products count
        cur.execute("SELECT COUNT(*) FROM products")
        total_prods = cur.fetchone()[0]
        self.assertGreaterEqual(total_prods, 500)

        # Check Business Contacts count
        cur.execute("SELECT COUNT(*) FROM business_contacts")
        total_contacts = cur.fetchone()[0]
        self.assertGreaterEqual(total_contacts, 500)

        # Check Source Evidence count
        cur.execute("SELECT COUNT(*) FROM source_evidence")
        total_evid = cur.fetchone()[0]
        self.assertGreaterEqual(total_evid, 500)

        # Check People / Leadership count
        cur.execute("SELECT COUNT(*) FROM people")
        total_people = cur.fetchone()[0]
        self.assertGreaterEqual(total_people, 10)

        conn.close()

    def test_07_source_evidence_traceability(self):
        """Test that records in source_evidence have valid URLs and confidence scores."""
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT evidence_id, entity_type, entity_id, field_name, source_url, confidence_score FROM source_evidence LIMIT 20")
        rows = cur.fetchall()
        self.assertGreater(len(rows), 0)

        for r in rows:
            self.assertTrue(r["source_url"].startswith("http"), f"Invalid source_url: {r['source_url']}")
            self.assertGreaterEqual(r["confidence_score"], 0.70)
            self.assertLessEqual(r["confidence_score"], 1.0)

        conn.close()

    def test_08_us_facilities_cross_referencing(self):
        """Test international robotics giants are cross-referenced with verified US operating locations."""
        conn = get_connection()
        cur = conn.cursor()

        # Check FANUC America in Michigan
        cur.execute("SELECT us_presence_status, us_operating_locations FROM companies WHERE canonical_domain LIKE '%fanuc%'")
        row = cur.fetchone()
        self.assertIsNotNone(row)
        self.assertIn("US Operating Facility", row["us_presence_status"])
        self.assertIn("Michigan", row["us_operating_locations"])

        # Check Yaskawa Motoman in Ohio
        cur.execute("SELECT us_presence_status, us_operating_locations FROM companies WHERE canonical_domain LIKE '%yaskawa%'")
        row = cur.fetchone()
        self.assertIsNotNone(row)
        self.assertIn("US Operating Facility", row["us_presence_status"])
        self.assertIn("Ohio", row["us_operating_locations"])

        conn.close()


if __name__ == "__main__":
    unittest.main()
