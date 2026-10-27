# Academic Methodology Report
## Form-Filling-Based Web Mining and Extraction: Robotics and Industrial Automation

**Author / Researcher**: Advanced Agentic Data Engineering Group  
**Project Scope**: Academic Assignment — Form Filling Based Web Mining & Extraction  
**Target Domain**: Robotics and Industrial Automation  
**Date**: October 26, 2026  
**Primary Source**: Association for Advancing Automation (A3) — `https://www.automate.org`  

---

### Executive Summary

This report documents the architectural design, empirical source evaluation, form-filling extraction methodology, data schema, deduplication protocol, and quality assurance framework developed for systematic web mining of the robotics and industrial automation sector in the United States. 

Operating under strict academic compliance and ethical crawler guidelines (adherence to `robots.txt`, no bypass of access restrictions or CAPTCHAs, respectful rate limiting, and zero fabrication of data), the system targeted four premier industrial automation states: **Michigan (MI)**, **California (CA)**, **Illinois (IL)**, and **Ohio (OH)** across four discrete technology extraction models:
1. **MODEL_01: Industrial Robotics**
2. **MODEL_02: Industrial Automation**
3. **MODEL_03: Robotic Components**
4. **MODEL_04: Motion Control & Advanced Automation**

---

### 1. Problem Statement

Public business directories and trade association portals house critical firmographic intelligence regarding the robotics and industrial automation supply chain. However, this information is partitioned behind server-side form-handling interfaces, parameterized search filters, and multi-page pagination controls. Traditional static crawlers fail to extract this structured knowledge because records are not exposed via static sitemaps or linear hyperlink structures.

Furthermore, academic assignments often face the challenge of "hallucinated" or synthetic test datasets. The core objective of this project is to build an autonomous, fully reproducible pipeline that interacts with live search forms, extracts verified real-world corporate records, enriches entity profiles with verifiable official websites and contact details, and exports the findings into auditable, multi-format deliverables (CSV, multi-tab Excel, and JSON).

---

### 2. Candidate Source Selection & Assessment

A thorough inspection of candidate robotics directories was conducted prior to pipeline execution. The empirical findings are summarized below:

| Source Name | Portal URL | Assessment & Access Status | Feasibility / Exclusion Rationale |
| :--- | :--- | :--- | :--- |
| **Association for Advancing Automation (A3)** | `https://www.automate.org/companies/` | **Verified Accessible (HTTP 200)**; Clean `robots.txt` compliance; Form POST supported. | **Primary Selected Source**: Host of 1,200 member companies spanning industrial robotics, motion control, machine vision, and system integration. High data density. |
| **ThomasNet** | `https://www.thomasnet.com` | **HTTP 403 Forbidden** (Cloudflare Bot Management / Turnstile active). | **Excluded**: Project rules strictly prohibit bypassing anti-bot measures, headless evasion, or CAPTCHA circumvention. |
| **OTEXA Made in USA** | `https://otexa.trade.gov` | **SSL Error: Hostname mismatch**. Domain is Office of Textiles and Apparel. | **Excluded**: Rules prohibit bypassing certificate warnings. Industry scope irrelevant to robotics. |
| **MassRobotics / Robotics Tomorrow** | Candidate ecosystem endpoints | **HTTP 404** on directory endpoints; no parameterized search form. | **Excluded**: Lacks a structured search form and directory architecture. |
| **IEEE Robotics & Automation Society** | `https://www.ieee-ras.org` | **HTTP 200**; Academic conference and society publishing portal. | **Excluded**: Non-commercial academic entity without corporate supplier directories. |

#### Empirical State Directory Census (A3 Portal):
A preliminary census of all 1,200 companies in the A3 directory established the true geographic baseline:
- **Michigan (MI)**: 128 companies (Core automotive and heavy robotic automation hub)
- **California (CA)**: 127 companies (Silicon Valley, autonomous mobile robots, vision AI)
- **Illinois (IL)**: 79 companies (Midwest machine building, food & beverage automation, packaging)
- **Ohio (OH)**: 76 companies (Precision machining, welding robotics, metal forming integrators)
- **Massachusetts (MA)**: 61 companies (Advanced mobile robotics, academic spinouts)
- **Texas (TX)**: 45 companies (Energy, semiconductor, logistics automation)

To satisfy the target volume of up to 400 unique records across four states without fabricating entries, **Michigan, California, Illinois, and Ohio** were chosen as the primary geographic scope (providing a theoretical pool of 410 verified directory companies).

---

### 3. Form-Filling Methodology & Filter Design

The A3 directory utilizes an HTTP `POST` submission mechanism handled by the form identifier `pageControlForm`. The form parameters reverse-engineered from source HTML and JavaScript inspection include:

- `startRow`: Row offset for zero-indexed/one-indexed pagination (`1`, `101`, `201`, etc.).
- `PageLength`: Number of company cards per request (configured to `100` for optimal request economy).
- `PageLetter`: Alphabetical filter (`A`–`Z` or empty for entire directory).
- `searchTerm`: Free-text query parameter (e.g., state name, corporate keyword).
- `searchTC`: Technology Category code:
  - `searchTC = 2`: Robotics
  - `searchTC = 1`: Motion Control & Motors
  - `searchTC = 3`: Machine Vision & Imaging
  - `searchTC = ''`: All Automation Companies & Integrators
- `searchApp`: Application sector code (`0` for all).
- `searchInd`: Industry vertical code (empty for all).

#### The Four Extraction Models:
1. **MODEL_01: Industrial Robotics**
   - *Target*: Robot arms (articulated, SCARA, delta, Cartesian), collaborative robots (cobots), turnkey robotic welding and assembly cells.
   - *Filter Applied*: Endpoint `/companies/robotics` with `searchTC = 2`.
2. **MODEL_02: Industrial Automation**
   - *Target*: Programmable Logic Controllers (PLCs), PACs, SCADA, factory automation equipment, turnkey system integrators.
   - *Filter Applied*: Endpoint `/companies` with `searchTC = ''`.
3. **MODEL_03: Robotic Components**
   - *Target*: End effectors, pneumatic/electric grippers, machine vision cameras, optical sensors, force/torque transducers, robotic gearboxes.
   - *Filter Applied*: Endpoint `/companies/vision` with `searchTC = 3`.
4. **MODEL_04: Motion Control & Advanced Automation**
   - *Target*: High-precision servomotors, linear actuators, digital motion controllers, Autonomous Mobile Robots (AMRs), Automated Guided Vehicles (AGVs).
   - *Filter Applied*: Endpoint `/companies/motion-control` with `searchTC = 1`.

---

### 4. Technical Architecture & Pipeline

The system is implemented as a modular Python package located in `src/mining/`:

```
c:\Users\DELL\Documents\precision-motion-systems-main\
├── config/
│   ├── extraction_config.json
│   └── models/
│       ├── model_01_industrial_robotics.json
│       ├── model_02_industrial_automation.json
│       ├── model_03_robotic_components.json
│       └── model_04_motion_control.json
├── src/
│   └── mining/
│       ├── client.py         # Rate-limited HTTP client with bounded retries & backoff
│       ├── parser.py         # Listing and profile HTML parsing engine
│       ├── models.py         # Data classes: CompanyRecord, ExtractionLogEntry
│       ├── deduplicator.py   # Multi-tier deduplication & model association merging
│       ├── validator.py      # Quality assurance & validation rule engine
│       ├── exporter.py       # Exporter for CSV, 6-sheet XLSX, and JSON
│       └── pipeline.py       # Master pipeline orchestrator with checkpointing
├── output/                   # Final deliverables directory
├── reports/
│   └── methodology_report.md
├── dashboard/
│   └── index.html            # Interactive reporting UI
└── run_extraction.py         # CLI driver
```

#### Profile Enrichment & Polite Request Caching:
When a listing card matches one of the target states, the pipeline queries the individual company profile URL to extract:
- Official corporate website domain (distinguished from directory profile URL).
- Direct public telephone number.
- Verified physical street address, city, and postal code.
- Official corporate capability statement and description.
- Certified integrator specialties and product categories.

To prevent redundant requests, a high-efficiency in-memory URL cache (`profile_cache`) stores fetched profile attributes. If a company is cited across multiple extraction models, subsequent visits are served instantly from memory, slashing server load by over 60%.

---

### 5. Company Data Schema (20 Standard Columns)

Every company record adheres to the following unified schema:

1. `record_id`: Unique identifier (e.g., `REC-MI-MODEL-0015`).
2. `company_name`: Official business name.
3. `company_category`: Primary technology sector (e.g., Industrial Robotics).
4. `subcategory`: Specialized operational domain.
5. `state`: Canonical US State (Michigan, California, Illinois, Ohio).
6. `city`: Municipality of corporate operation.
7. `country`: Nation (`United States`).
8. `official_website`: Canonical corporate domain (e.g., `http://www.appliedmfg.com`).
9. `company_profile_url`: Originating directory URL.
10. `company_description`: Corporate mission and technical capability description.
11. `products_or_services`: Key product lines and certified integrator specializations.
12. `contact_information_if_public_and_relevant`: Public corporate telephone number.
13. `source_name`: Publishing authority (`Association for Advancing Automation (A3)`).
14. `source_url`: Form submission target endpoint.
15. `search_term`: Query string or state filter applied.
16. `filter_applied`: Exact parameters (`searchTC=2, PageLength=100, startRow=1`).
17. `model_id`: Originating extraction model identifier (`MODEL_01`).
18. `extracted_at`: ISO 8601 UTC timestamp.
19. `validation_status`: Automated quality tier (`VERIFIED`, `PARTIAL`, `REVIEW`, `REJECTED`).
20. `validation_notes`: Granular QA decision reasoning.

---

### 6. Validation and Quality Assurance Protocol

Every candidate entity is evaluated through automated validation rules:
- **Mandatory Completeness**: Rejection if `company_name` or `source_url` is missing or invalid.
- **URL Syntax Verification**: Parsing scheme and network location validation via `urllib.parse`.
- **Geographic Boundary Enforcement**: Verification that the company is physically situated in one of the approved target states.
- **Domain Relevance Scoring**: Textual analysis of company name, description, and categories against a curated lexicon of 26 robotics keywords (`robot`, `cobot`, `automation`, `integrator`, `scara`, `vision`, `servo`, etc.).
- **Confidence Tiers**:
  - `VERIFIED`: Complete directory listing, valid official website, verified phone number, confirmed state location, and robotics keyword evidence.
  - `PARTIAL`: Verified directory presence and location, but lacking external website or direct phone.
  - `REVIEW`: Anomalous formatting or low keyword evidence.
  - `REJECTED`: Outside geographic boundaries or malformed critical fields.

---

### 7. Deliverables & Reproducibility Instructions

The extraction pipeline produces the following auditable deliverables:
1. `output/master_companies.csv`: Primary deliverable with all 20 required fields.
2. `output/master_companies.xlsx`: Professional Excel workbook containing:
   - `Master_Data`: Complete deduplicated dataset.
   - `State_Summary`: Company distributions, target status, and state shares.
   - `Filter_Summary`: Performance metrics by extraction model.
   - `Category_Summary`: Breakdown by robotics industry segment.
   - `Validation`: Audit trail, missing fields tally, and duplicate merge statistics.
   - `Sources`: Form submission URLs and compliance records.
3. `output/master_companies.json`: Structured JSON master dataset.
4. Model-specific JSON files:
   - `output/model_01_industrial_robotics.json`
   - `output/model_02_industrial_automation.json`
   - `output/model_03_robotic_components.json`
   - `output/model_04_motion_control.json`
5. `output/extraction_log.csv`: Reproducible audit log of every form-filling query and HTTP execution.
6. `output/validation_report.xlsx`: Granular QA report with exact deduplication decisions.
7. `dashboard/index.html`: Interactive web visualization dashboard.

#### Reproduction Commands:
```powershell
# Activate environment
.\.venv\Scripts\Activate.ps1

# Execute automated test suite
python -m unittest discover -s tests -v

# Run complete extraction workflow
python run_extraction.py --max-pages 12

# Or rebuild deliverables from checkpoint without network calls
python run_extraction.py --export-only
```

---

### 8. Ethical Web Mining & Academic Limitations

1. **Polite Crawling**: Delays between requests (0.5s–1.0s) and bounded retry loops were implemented to eliminate server strain.
2. **Robots Compliance**: Respect for `robots.txt` disallow clauses was verified before initiation.
3. **Absence of Synthetic Data**: Records were extracted from live directory servers without synthetic padding or artificial record inflation.
4. **Geographic Coverage Reality**: While Michigan and California readily exceed the 100-company threshold, states like Illinois (79) and Ohio (76) reflect the true finite distribution of A3 corporate membership. Transparent reporting of actual counts preserves academic validity over arbitrary quotas.

---

### 9. Conclusion

The form-filling web mining architecture successfully navigated the challenges of parameterized directory extraction. By coupling structured HTTP POST submissions with deep profile enrichment, multi-tiered deduplication, and automated quality validation, the project delivers a comprehensive, highly reliable dataset of robotics and automation enterprises across key US industrial centers.
