"""Fast, network-free tests for the robotics mining extraction core."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from config import LEAD_FIELDS
from deduplication import deduplicate
from extractors import extract_page
from validators import normalize_email, normalize_phone, valid_year


class ExtractionTests(unittest.TestCase):
    def test_jsonld_and_public_contact_extraction(self):
        html = '''
        <html><head><title>Acme Robotics</title>
        <script type="application/ld+json">
        {"@type":"Organization","name":"Acme Robotics","email":"INFO@ACME.EXAMPLE",
         "telephone":"+1 212 555 0100","foundingDate":"1998-04-01",
         "numberOfEmployees":{"@type":"QuantitativeValue","value":250},
         "address":{"@type":"PostalAddress","streetAddress":"1 Main Street",
          "addressLocality":"New York","addressRegion":"NY","addressCountry":"US"}}
        </script></head><body><a href="/contact">Contact</a>
        <a href="mailto:sales@acme.example">Email sales</a></body></html>
        '''
        result = extract_page(html, "https://acme.example/")
        self.assertEqual(result["company_name"], "Acme Robotics")
        self.assertIn("info@acme.example", result["email"])
        self.assertIn("sales@acme.example", result["email"])
        self.assertEqual(result["founded_year"], "1998")
        self.assertEqual(result["employee_count"], "250")
        self.assertEqual(result["city"], "New York")
        self.assertEqual(result["country"], "US")
        self.assertTrue(result["contact_page_url"].endswith("/contact"))

    def test_normalizers_do_not_guess_or_accept_malformed_values(self):
        self.assertEqual(normalize_email(" SALES@Example.COM "), "sales@example.com")
        self.assertEqual(normalize_email("not-an-email"), "")
        self.assertEqual(normalize_phone("+1 212 555 0100"), "+1 212 555 0100")
        self.assertEqual(normalize_phone("123456"), "")
        self.assertEqual(valid_year("Founded in 2008"), "2008")
        self.assertEqual(valid_year("Product launched in 2025"), "2025")

    def test_schema_and_conservative_duplicate_rules(self):
        self.assertEqual(len(LEAD_FIELDS), 23)
        same_domain = [
            {"company_name": "Acme, Inc.", "website_url": "https://www.acme.example/", "email": ""},
            {"company_name": "Acme Inc", "website_url": "https://acme.example/about", "email": "sales@acme.example"},
        ]
        unique, decisions = deduplicate(same_domain)
        self.assertEqual(len(unique), 1)
        self.assertEqual(unique[0]["email"], "sales@acme.example")
        self.assertEqual(len(decisions), 1)
        separate_domains, decisions = deduplicate([
            {"company_name": "Acme", "website_url": "https://acme-one.example"},
            {"company_name": "Acme", "website_url": "https://acme-two.example"},
        ])
        self.assertEqual(len(separate_domains), 2)
        self.assertEqual(decisions, [])


if __name__ == "__main__":
    unittest.main()