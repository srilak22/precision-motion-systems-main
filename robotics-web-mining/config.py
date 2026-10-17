"""Runtime settings for the isolated robotics mining project."""

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
LOG_DIR = BASE_DIR / "logs"
CHECKPOINT_FILE = OUTPUT_DIR / "robotics_checkpoint.json"
LEADS_FILE = OUTPUT_DIR / "robotics_company_leads.csv"
AUDIT_FILE = OUTPUT_DIR / "robotics_extraction_audit.csv"
FAILURES_FILE = OUTPUT_DIR / "robotics_failed_urls.csv"
SUMMARY_FILE = OUTPUT_DIR / "robotics_summary.json"
MISSING_DATA_FILE = OUTPUT_DIR / "robotics_missing_data_report.csv"
DUPLICATES_FILE = OUTPUT_DIR / "robotics_duplicate_decisions.csv"
USER_AGENT = "INDUS-RoboticsCompanyResearch/1.0 (+public business research; contact: info@indusrobotics.com)"
REQUEST_TIMEOUT_SECONDS = 15
MAX_RETRIES = 1
DEFAULT_DELAY_SECONDS = 2.0
MAX_CRAWL_WORKERS = 8
MAX_PAGES_PER_SITE = 2
MAX_SITEMAP_URLS = 40
MAX_SITEMAP_MAPS = 1
MAX_PAGE_BYTES = 2_000_000

LEAD_FIELDS = [
    "company_id", "company_name", "website_url", "email", "phone_number",
    "industry_type", "robotics_specialization", "products_services", "address",
    "city", "state_province", "country", "founded_year", "employee_count",
    "employee_range", "company_type", "parent_company", "contact_page_url",
    "source_url", "source_type", "verification_status", "last_checked",
    "extraction_notes",
]

AUDIT_FIELDS = [
    "source_url", "company_name", "field_name", "extracted_value",
    "verification_result", "retrieval_date",
]

FAILURE_FIELDS = ["url", "http_status_or_error_category", "retry_count", "failure_reason"]
DUPLICATE_FIELDS = ["kept_company", "excluded_company", "reason", "decision_date"]
MISSING_DATA_FIELDS = ["field_name", "records_missing", "total_records", "missing_percentage"]