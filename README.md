# Form-Filling-Based Web Mining & Extraction
## Robotics & Industrial Automation Companies

An academic data-engineering system designed to systematically query, extract, normalize, and validate structured company records from public robotics and industrial automation directories via parameterized HTTP search forms and pagination controls.

---

## 1. Project Overview

- **Academic Assignment Title**: Form Filling Based Web Mining & Extraction
- **Target Domain**: Robotics and Industrial Automation
- **Primary Source**: Association for Advancing Automation (A3) — [automate.org](https://www.automate.org/companies/)
- **Geographic Scope**: Four U.S. States: **Michigan (MI)**, **California (CA)**, **Ohio (OH)**, and **Illinois (IL)**
- **Target Volume**: 100 unique company records per state, up to 400 unique records overall
- **Extraction Models**: Four configured JSON models targeting specific industry categories
- **Deliverables Produced**: `master_companies.csv`, `master_companies.xlsx` (with 6 worksheets), `master_companies.json`, 4 model-specific JSON files, `extraction_log.csv`, `validation_report.xlsx`, `methodology_report.md`, and an interactive reporting dashboard.

---

## 2. Architecture & Pipeline Structure

```
precision-motion-systems-main/
├── config/
│   ├── extraction_config.json          # Master configuration (states, rate limits, timeouts)
│   └── models/
│       ├── model_01_industrial_robotics.json
│       ├── model_02_industrial_automation.json
│       ├── model_03_robotic_components.json
│       └── model_04_motion_control.json
├── src/
│   └── mining/
│       ├── client.py                    # Polite HTTP client with retries and exponential backoff
│       ├── parser.py                    # HTML parser for form cards and rich corporate profiles
│       ├── models.py                    # 20-column CompanyRecord and ExtractionLogEntry schemas
│       ├── deduplicator.py              # Fuzzy company name & domain matching with model merging
│       ├── validator.py                 # Multi-tier QA engine (relevance, URL, geographic scope)
│       ├── exporter.py                  # Multi-format exporter (CSV, openpyxl XLSX, JSON)
│       └── pipeline.py                  # End-to-end extraction orchestrator
├── tests/
│   └── test_mining_pipeline.py          # Automated unit test suite
├── output/                              # Generated deliverables
│   ├── master_companies.csv             # Unified CSV dataset (20 columns)
│   ├── master_companies.xlsx            # Multi-sheet Excel workbook (6 sheets)
│   ├── master_companies.json            # Master JSON format
│   ├── model_01_industrial_robotics.json
│   ├── model_02_industrial_automation.json
│   ├── model_03_robotic_components.json
│   ├── model_04_motion_control.json
│   ├── extraction_log.csv               # Complete audit trail of form queries
│   └── validation_report.xlsx           # Dedicated QA and deduplication audit
├── reports/
│   └── methodology_report.md            # Comprehensive academic methodology report
├── dashboard/
│   └── index.html                       # Modern interactive reporting UI
└── run_extraction.py                    # Main CLI entry point
```

---

## 3. Installation & Setup

Requires Python 3.10+ (tested on Python 3.14).

```powershell
# 1. Activate virtual environment
.\.venv\Scripts\Activate.ps1

# 2. Install dependencies
python -m pip install -r requirements.txt
python -m pip install openpyxl
```

### Dependencies
- `requests`: HTTP session management and POST form submission.
- `beautifulsoup4` & `lxml`: Resilient DOM parsing for directory result cards and profile pages.
- `openpyxl`: Excel workbook formatting, cell styling, and formula support.
- `python-dotenv`: Environment configuration handling.

---

## 4. How to Run the System

### Run Complete Extraction Pipeline
```powershell
python run_extraction.py --max-pages 12
```

### Run in Fast Test Mode (1 Page per Model)
```powershell
python run_extraction.py --test
```

### Rebuild Deliverables from Checkpoint (Without Sending Network Requests)
```powershell
python run_extraction.py --export-only
```

### Override Configured Target States
```powershell
python run_extraction.py --states "Michigan" "California" "Ohio" "Texas"
```

### Execute Automated Unit Tests
```powershell
python -m unittest discover -s tests -v
```

---

## 5. The Four Extraction Models

The system implements four distinct extraction models defined in `config/models/`:

| Model ID | Model Name | Source Endpoint | Filter Parameter | Target Categories |
| :--- | :--- | :--- | :--- | :--- |
| **`MODEL_01`** | **Industrial Robotics** | `/companies/robotics` | `searchTC=2` | Articulated, SCARA, delta, cobots, robotic cells |
| **`MODEL_02`** | **Industrial Automation** | `/companies` | `searchTC=''` | PLC/PAC controls, machine automation, system integration |
| **`MODEL_03`** | **Robotic Components** | `/companies/vision` | `searchTC=3` | Vision sensors, grippers, end-effectors, optics, tooling |
| **`MODEL_04`** | **Motion Control** | `/companies/motion-control` | `searchTC=1` | Servomotors, motion controllers, linear actuators, AMRs |

---

## 6. Company Data Schema (20 Columns)

Each company record contains the following standard attributes:
1. `record_id`: Formatted alphanumeric identifier (e.g., `REC-MI-MODEL-0015`).
2. `company_name`: Official business name.
3. `company_category`: Industry classification.
4. `subcategory`: Domain specialty.
5. `state`: Target US State.
6. `city`: Municipality.
7. `country`: Nation (`United States`).
8. `official_website`: Canonical company website (distinguished from profile URL).
9. `company_profile_url`: Originating directory link.
10. `company_description`: Corporate capabilities overview.
11. `products_or_services`: Certified integrator categories and product offerings.
12. `contact_information_if_public_and_relevant`: Public phone number.
13. `source_name`: Publishing directory authority.
14. `source_url`: Form query endpoint.
15. `search_term`: Query string or state filter applied.
16. `filter_applied`: Exact form parameters used.
17. `model_id`: Extraction model identifier.
18. `extracted_at`: ISO 8601 UTC timestamp.
19. `validation_status`: `VERIFIED`, `PARTIAL`, or `REVIEW`.
20. `validation_notes`: Granular QA audit details.

---

## 7. Quality Assurance & Validation Rules

- **Duplicate Detection**: Matches on normalized company names, registered domains, and profile URLs. Cross-model associations are merged to prevent duplicate records while preserving multi-model citations.
- **Geographic Boundary Enforcement**: All records are strictly validated against target states.
- **Robotics Relevance**: Evaluated against a 26-keyword lexicon of industrial robotics and automation terminology.
- **Strict Academic Integrity**: No synthetic data or fabricated records are generated. Missing optional fields (e.g. phone or website if unpublished) remain empty.

---

## 8. Excel Workbook Deliverable Structure

The exported `output/master_companies.xlsx` workbook contains six dedicated worksheets:
1. **`Master_Data`**: Full deduplicated dataset with all 20 columns.
2. **`State_Summary`**: Company counts, percentages, and target volume status by state.
3. **`Filter_Summary`**: Results and records collected by extraction model.
4. **`Category_Summary`**: Industry distribution by technology segment.
5. **`Validation`**: Comprehensive QA audit trail and missing field counts.
6. **`Sources`**: Source URLs, access protocols, and ethical compliance notes.

---

## 9. Summary Reporting Dashboard

Open `dashboard/index.html` in any modern web browser or serve locally:
```powershell
python -m http.server 8080 --directory .
```
Navigate to `http://localhost:8080/dashboard/` to view interactive KPI cards, filter by state and extraction model, search records in real time, and trigger deliverable downloads.

---

## 10. Known Limitations & Ethical Compliance

- **Polite Crawling**: Delays (0.5s–1.0s) and bounded retries prevent server degradation.
- **Access Restrictions**: ThomasNet was excluded due to active Cloudflare bot protection; OTEXA was excluded due to an SSL certificate mismatch and non-robotics scope.
- **Coverage Realities**: Michigan and California exceed 100 companies. Illinois (79) and Ohio (76) reflect the true population of A3 directory members in those states. Counts are reported transparently without artificial inflation.
