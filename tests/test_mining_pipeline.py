import unittest
import os
import json
import tempfile
import shutil
from src.mining.models import CompanyRecord
from src.mining.parser import DirectoryHTMLParser
from src.mining.deduplicator import CompanyDeduplicator
from src.mining.validator import CompanyDataValidator
from src.mining.exporter import DeliverableExporter

SAMPLE_LISTING_HTML = """
<div class="itemFlex companyFlex">
  <div class="item informational tc-robotics">
    <div class="companyThumbnail">
      <a href="https://www.automate.org/companies/acme-robotics" title="View Company Profile">Acme Robotics</a>
    </div>
    <div class="item-inner">
      <div class="itemContent">
        <h3><a href="https://www.automate.org/companies/acme-robotics">Acme Robotics Corp</a></h3>
        <p class="companyLocation">Auburn Hills, Michigan, United States</p>
      </div>
    </div>
  </div>
  <div class="item informational tc-vision">
    <div class="companyThumbnail">
      <a href="https://www.automate.org/companies/silicon-optics" title="View Company Profile">Silicon Optics</a>
    </div>
    <div class="item-inner">
      <div class="itemContent">
        <h3><a href="https://www.automate.org/companies/silicon-optics">Silicon Optics Inc</a></h3>
        <p class="companyLocation">San Jose, California, United States</p>
      </div>
    </div>
  </div>
</div>
"""

SAMPLE_PROFILE_HTML = """
<html>
  <body>
    <h1>Acme Robotics Corp</h1>
    <a href="https://www.acmerobotics.com">Visit Website</a>
    <p>Telephone: (248) 555-0199</p>
    <address>123 Automation Way Auburn Hills, MI 48326 United States</address>
    <p>Acme Robotics Corp is a world leader in manufacturing industrial articulated robots and robotic automation workcells for automotive assembly.</p>
    <li>Industrial Robots</li>
    <li>Robotic Welding</li>
    <li>SCARA Robots</li>
  </body>
</html>
"""

class TestMiningPipeline(unittest.TestCase):

    def setUp(self):
        self.test_dir = tempfile.mkdtemp()

    def tearDown(self):
        shutil.rmtree(self.test_dir, ignore_errors=True)

    def test_parse_listing_page(self):
        cards = DirectoryHTMLParser.parse_listing_page(SAMPLE_LISTING_HTML)
        self.assertEqual(len(cards), 2)
        self.assertEqual(cards[0]["company_name"], "Acme Robotics Corp")
        self.assertEqual(cards[0]["state"], "Michigan")
        self.assertEqual(cards[0]["city"], "Auburn Hills")
        self.assertEqual(cards[1]["company_name"], "Silicon Optics Inc")
        self.assertEqual(cards[1]["state"], "California")

    def test_parse_profile_page(self):
        details = DirectoryHTMLParser.parse_profile_page(SAMPLE_PROFILE_HTML)
        self.assertEqual(details["official_website"], "https://www.acmerobotics.com")
        self.assertEqual(details["contact_phone"], "(248) 555-0199")
        self.assertIn("Acme Robotics Corp is a world leader", details["description"])
        self.assertIn("Industrial Robots", details["products_or_services"])

    def test_deduplication_and_merging(self):
        r1 = CompanyRecord(
            record_id="REC-001",
            company_name="Acme Robotics Corp",
            company_category="Industrial Robotics",
            subcategory="Robots",
            state="Michigan",
            city="Auburn Hills",
            country="United States",
            official_website="https://www.acmerobotics.com",
            company_profile_url="https://www.automate.org/companies/acme-robotics",
            source_name="A3",
            source_url="https://www.automate.org/companies/robotics",
            model_id="MODEL_01"
        )
        r2 = CompanyRecord(
            record_id="REC-002",
            company_name="Acme Robotics Inc.",  # Same company, slight suffix variation
            company_category="Industrial Automation",
            subcategory="Integration",
            state="Michigan",
            city="Auburn Hills",
            country="United States",
            official_website="https://acmerobotics.com",  # Same domain
            company_profile_url="https://www.automate.org/companies/acme-robotics",
            source_name="A3",
            source_url="https://www.automate.org/companies",
            model_id="MODEL_02"
        )
        unique, stats = CompanyDeduplicator.deduplicate_and_merge([r1, r2])
        self.assertEqual(len(unique), 1)
        self.assertEqual(stats["duplicates_merged_count"], 1)
        # Check model associations merged
        self.assertIn("MODEL_01", unique[0].associated_models)
        self.assertIn("MODEL_02", unique[0].associated_models)

    def test_validation_rules(self):
        validator = CompanyDataValidator(target_states=["Michigan", "California"])
        valid_rec = CompanyRecord(
            record_id="REC-001",
            company_name="Acme Robotics",
            company_category="Industrial Robotics",
            subcategory="Robotics",
            state="Michigan",
            city="Auburn Hills",
            country="United States",
            official_website="https://www.acmerobotics.com",
            company_profile_url="https://www.automate.org/companies/acme-robotics",
            company_description="Industrial robot integrator specializing in automation.",
            products_or_services="Articulated robots, cobots",
            contact_information_if_public_and_relevant="(248) 555-0199",
            source_url="https://www.automate.org/companies/robotics",
            model_id="MODEL_01"
        )
        status, notes = validator.validate_record(valid_rec)
        self.assertEqual(status, "VERIFIED")

        # Outside state record
        invalid_rec = CompanyRecord(
            record_id="REC-002",
            company_name="Texas Automation",
            company_category="Automation",
            subcategory="PLC",
            state="Texas",  # Texas is outside ["Michigan", "California"] in this test
            city="Austin",
            country="United States",
            source_url="https://www.automate.org/companies",
            model_id="MODEL_02"
        )
        status2, notes2 = validator.validate_record(invalid_rec)
        self.assertEqual(status2, "REJECTED")

    def test_exporter_csv_xlsx_json(self):
        exporter = DeliverableExporter(output_dir=self.test_dir)
        rec = CompanyRecord(
            record_id="REC-001",
            company_name="Acme Robotics",
            company_category="Industrial Robotics",
            subcategory="Robotics",
            state="Michigan",
            city="Auburn Hills",
            country="United States",
            official_website="https://www.acmerobotics.com",
            company_profile_url="https://www.automate.org/companies/acme-robotics",
            company_description="Manufacturer of robotics.",
            products_or_services="Robots",
            contact_information_if_public_and_relevant="(248) 555-0199",
            source_url="https://www.automate.org/companies/robotics",
            model_id="MODEL_01",
            validation_status="VERIFIED"
        )
        csv_p = exporter.export_csv([rec], "test.csv")
        json_p = exporter.export_json([rec], "test.json")
        xlsx_p = exporter.export_master_excel([rec], {"status_counts": {"VERIFIED": 1}}, {"duplicates_merged_count": 0}, "test.xlsx")

        self.assertTrue(os.path.exists(csv_p))
        self.assertTrue(os.path.exists(json_p))
        self.assertTrue(os.path.exists(xlsx_p))

if __name__ == "__main__":
    unittest.main()
