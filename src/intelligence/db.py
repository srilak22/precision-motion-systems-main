import os
import sqlite3
import json
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone

logger = logging.getLogger("intelligence.db")

DB_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".data"))
DB_PATH = os.path.join(DB_DIR, "us_robotics_intelligence.db")

SCHEMA_SQL = """
PRAGMA foreign_keys = ON;

-- 1. COMPANIES TABLE (Master Firmographic Profile)
CREATE TABLE IF NOT EXISTS companies (
    company_id TEXT PRIMARY KEY,
    legal_name TEXT NOT NULL,
    trading_name TEXT,
    aliases TEXT,                 -- JSON array of known aliases
    parent_company TEXT,
    subsidiaries TEXT,            -- JSON array of subsidiaries
    website TEXT NOT NULL,
    canonical_domain TEXT NOT NULL UNIQUE,
    company_description TEXT,
    core_activities TEXT,
    company_type TEXT,            -- Manufacturer, Integrator, Component Supplier, OEM, Software
    industry_categories TEXT,     -- JSON array
    robotics_categories TEXT,     -- JSON array (Industrial Robotics, Automation, Components, Motion Control, Software)
    primary_products TEXT,        -- Semicolon-separated or JSON
    services TEXT,
    target_industries TEXT,       -- Automotive, Aerospace, Semiconductor, etc.
    hq_country TEXT NOT NULL,
    hq_state TEXT,
    hq_city TEXT,
    address TEXT,
    us_presence_status TEXT,      -- US Headquartered, US Subsidiary, US Operating Facility, US Office
    us_operating_locations TEXT,  -- JSON array of US locations (state, city, type)
    manufacturing_locations TEXT, -- JSON array
    engineering_locations TEXT,   -- JSON array
    distribution_locations TEXT,  -- JSON array
    founded_year INTEGER,
    company_status TEXT DEFAULT 'Active', -- Active, Acquired, Subsidiary, Defunct
    employee_range TEXT,          -- e.g. "50-200", "1,000-5,000"
    revenue_range TEXT,           -- e.g. "$10M-$50M", "$1B+"
    ownership_type TEXT,          -- Private, Public, Subsidiary, Venture-Backed
    stock_ticker TEXT,
    parent_org_url TEXT,
    linkedin_url TEXT,
    social_urls TEXT,             -- JSON object (twitter, youtube, github, etc.)
    contact_page_url TEXT,
    catalog_url TEXT,
    docs_url TEXT,
    careers_page_url TEXT,
    news_page_url TEXT,
    source_references TEXT,       -- JSON array of source names/citations
    date_discovered TEXT,
    last_verified TEXT,
    confidence_score REAL DEFAULT 0.85, -- 0.0 to 1.0
    completeness_score REAL DEFAULT 0.0, -- Percentage 0-100
    verification_status TEXT DEFAULT 'VERIFIED' -- VERIFIED, PARTIAL, REVIEW, REJECTED
);

-- 2. PEOPLE TABLE (Key People & Engineering Leadership)
CREATE TABLE IF NOT EXISTS people (
    person_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    full_name TEXT NOT NULL,
    job_title TEXT NOT NULL,
    role_category TEXT,          -- Executive, Engineering, Manufacturing, Sales, Sourcing
    department TEXT,
    official_bio_url TEXT,
    linkedin_url TEXT,
    business_email TEXT,
    business_phone TEXT,
    is_current BOOLEAN DEFAULT 1,
    confidence_score REAL DEFAULT 0.85,
    verification_notes TEXT,
    source_url TEXT NOT NULL,
    created_at TEXT,
    last_verified TEXT,
    FOREIGN KEY(company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 3. BUSINESS CONTACTS TABLE (Public Corporate Channels)
CREATE TABLE IF NOT EXISTS business_contacts (
    contact_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    contact_type TEXT NOT NULL,   -- General Phone, Sales Phone, Support Phone, Sales Email, Support Email, Contact Form
    contact_value TEXT NOT NULL,
    department TEXT,
    source_url TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT 1,
    last_verified TEXT,
    FOREIGN KEY(company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 4. PRODUCTS TABLE (Product Intelligence & Specifications)
CREATE TABLE IF NOT EXISTS products (
    product_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_family TEXT,
    category TEXT NOT NULL,       -- Articulated Robot, SCARA, Cobot, AMR, Precision Reducer, Servo Drive, etc.
    brand TEXT,
    model_number TEXT,
    product_url TEXT,
    description TEXT,
    product_status TEXT DEFAULT 'Active',
    payload_capacity TEXT,        -- Value with units (e.g. "12 kg")
    reach TEXT,                   -- Value with units (e.g. "1300 mm")
    repeatability TEXT,           -- Value with units (e.g. "±0.03 mm")
    axes_count INTEGER,
    speed TEXT,
    torque TEXT,
    gear_ratio TEXT,
    backlash TEXT,                -- Value with units (e.g. "< 1 arcmin")
    rated_life TEXT,
    operating_temp TEXT,
    protection_rating TEXT,       -- e.g. "IP67"
    mounting_configuration TEXT,
    dimensions TEXT,
    weight TEXT,
    materials TEXT,
    electrical_requirements TEXT,
    communication_interfaces TEXT,-- EtherCAT, Profinet, Modbus, Ethernet/IP, CANopen
    supported_controllers TEXT,
    safety_features TEXT,
    certifications TEXT,          -- CE, UL, ISO 9283, Cleanroom Class
    typical_applications TEXT,    -- Welding, Material Handling, Assembly, Machine Tending
    target_industries TEXT,
    datasheet_url TEXT,
    manual_url TEXT,
    catalog_url TEXT,
    source_evidence TEXT,
    last_verified TEXT,
    FOREIGN KEY(company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 5. APPLICATIONS TABLE (Manufacturing Processes & Use Cases)
CREATE TABLE IF NOT EXISTS applications (
    app_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL,
    application_area TEXT NOT NULL, -- Machine Tending, Palletizing, Arc Welding, Precision Assembly
    manufacturing_process TEXT,
    use_case_description TEXT,
    industry_served TEXT,
    problem_addressed TEXT,
    automation_function TEXT,
    case_study_url TEXT,
    source_evidence TEXT,
    FOREIGN KEY(company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 6. COMPETITIVE INTEL TABLE
CREATE TABLE IF NOT EXISTS competitive_intel (
    intel_id TEXT PRIMARY KEY,
    company_id TEXT NOT NULL UNIQUE,
    main_product_lines TEXT,
    technology_specialization TEXT,
    target_markets TEXT,
    differentiating_features TEXT,
    integration_ecosystem TEXT,
    distribution_model TEXT,
    manufacturing_capabilities TEXT,
    public_partnerships TEXT,
    acquisitions_subsidiaries TEXT,
    certifications TEXT,
    geographic_coverage TEXT,
    pricing_model TEXT,
    strategic_developments TEXT,
    last_updated TEXT,
    FOREIGN KEY(company_id) REFERENCES companies(company_id) ON DELETE CASCADE
);

-- 7. SOURCES TABLE (Configurable Discovery Source Registry)
CREATE TABLE IF NOT EXISTS sources (
    source_id TEXT PRIMARY KEY,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    source_category TEXT NOT NULL, -- Trade Association, Government Census, Supplier Directory, Corporate Portal
    access_method TEXT NOT NULL,   -- HTTP Form POST, Sitemap Crawler, REST API, Public HTML
    last_checked TEXT,
    crawl_status TEXT DEFAULT 'Active',
    records_discovered INTEGER DEFAULT 0,
    records_processed INTEGER DEFAULT 0,
    known_limitations TEXT,
    usage_restrictions TEXT,
    error_history TEXT
);

-- 8. SOURCE EVIDENCE TABLE (Field-by-Field Provenance)
CREATE TABLE IF NOT EXISTS source_evidence (
    evidence_id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,     -- company, product, person, contact
    entity_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    extracted_value TEXT,
    source_url TEXT NOT NULL,
    source_type TEXT,
    page_title TEXT,
    supporting_excerpt TEXT,
    extraction_method TEXT,        -- Deterministic HTML Table, JSON-LD, Meta Tag, Regex, AI Extract
    first_observed TEXT,
    last_checked TEXT,
    publication_date TEXT,
    verification_status TEXT DEFAULT 'VERIFIED',
    confidence_score REAL DEFAULT 0.90,
    conflicting_reference TEXT
);

-- 9. DISCOVERED URLS TABLE (Crawler Frontier & URL Registry)
CREATE TABLE IF NOT EXISTS discovered_urls (
    url_id TEXT PRIMARY KEY,
    domain TEXT NOT NULL,
    url TEXT NOT NULL UNIQUE,
    page_category TEXT,            -- Homepage, About, Leadership, Contact, Products, Specs, Case Studies, Careers
    http_status INTEGER,
    last_crawled TEXT,
    crawl_status TEXT DEFAULT 'DISCOVERED', -- DISCOVERED, CRAWLED, FAILED, BLOCKED
    error_message TEXT
);

-- 10. CRAWL JOBS TABLE (Crawl Job Execution & Status)
CREATE TABLE IF NOT EXISTS crawl_jobs (
    job_id TEXT PRIMARY KEY,
    job_type TEXT NOT NULL,        -- Discovery, Deep Site Crawl, Refresh, Audit
    target_domain TEXT,
    status TEXT DEFAULT 'PENDING', -- PENDING, RUNNING, COMPLETED, FAILED, PAUSED
    pages_crawled INTEGER DEFAULT 0,
    records_extracted INTEGER DEFAULT 0,
    errors_count INTEGER DEFAULT 0,
    started_at TEXT,
    completed_at TEXT,
    log_file TEXT
);

-- 11. CHANGE HISTORY TABLE (Temporal Field Auditing)
CREATE TABLE IF NOT EXISTS change_history (
    change_id TEXT PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at TEXT,
    source_url TEXT
);

-- INDEXES FOR FAST SEARCH, FILTERING & DEDUPLICATION
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(canonical_domain);
CREATE INDEX IF NOT EXISTS idx_companies_name ON companies(legal_name);
CREATE INDEX IF NOT EXISTS idx_companies_state ON companies(hq_state);
CREATE INDEX IF NOT EXISTS idx_companies_country ON companies(hq_country);
CREATE INDEX IF NOT EXISTS idx_companies_us_presence ON companies(us_presence_status);
CREATE INDEX IF NOT EXISTS idx_companies_verification ON companies(verification_status);
CREATE INDEX IF NOT EXISTS idx_people_company ON people(company_id);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON business_contacts(company_id);
CREATE INDEX IF NOT EXISTS idx_products_company ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_evidence_entity ON source_evidence(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_discovered_domain ON discovered_urls(domain);
"""

def get_connection() -> sqlite3.Connection:
    """Returns a thread-safe connection to the SQLite database."""
    os.makedirs(DB_DIR, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

import sys
import io

# Ensure UTF-8 output on Windows consoles
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def initialize_database():
    """Initializes the database schema and indexes."""
    os.makedirs(DB_DIR, exist_ok=True)
    with get_connection() as conn:
        conn.executescript(SCHEMA_SQL)
        try:
            conn.execute("ALTER TABLE people ADD COLUMN last_verified TEXT")
        except sqlite3.OperationalError:
            pass
        conn.commit()
    logger.info(f"Initialized database schema at {DB_PATH}")
    print(f"[OK] Initialized SQLite Database schema at: {DB_PATH}")

if __name__ == "__main__":
    initialize_database()
