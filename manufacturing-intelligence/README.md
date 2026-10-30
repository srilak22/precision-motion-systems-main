# Global Manufacturing Company Intelligence Platform

A scalable, production-grade web mining, entity resolution, and intelligence platform designed to discover, collect, verify, enrich, store, and export at least **50,000 unique manufacturing companies** from scratch across 5 key target regions:

1. **United States** (Target: 15,000)
2. **United Kingdom** (Target: 8,000)
3. **Middle East (GCC)**: UAE, Saudi Arabia, Qatar, Oman, Bahrain, Kuwait (Target: 8,000)
4. **Singapore** (Target: 4,000)
5. **India** (Target: 15,000)

---

## 1. System Architecture

```
                  ┌──────────────────────────────────────────────┐
                  │    React + Vite + TypeScript Dashboard      │
                  │  (Overview, Explorer, Profile, Collection,  │
                  │          Quality, Export Center)             │
                  └──────────────────────┬───────────────────────┘
                                         │  Axios HTTP / REST
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │           FastAPI REST API (/api/v1)         │
                  │   - /companies (Explorer, Profile, Stats)    │
                  │   - /jobs (Run, Pause, Resume, Logs)         │
                  │   - /sources (Connector Registry)            │
                  │   - /quality (Audit & Deduplication Queue)   │
                  │   - /export (CSV, Excel xlsx, JSON streaming)│
                  └───────────────┬──────────────┬───────────────┘
                                  │              │
                   ┌──────────────┴───┐    ┌─────┴─────────────┐
                   │ Discovery Engine │    │ Enrichment Engine │
                   └──────┬───────────┘    └─────┬─────────────┘
                          │                      │
        ┌─────────────────┴──────────────────────┴──────────────────┐
        │  Multi-Country Source Connectors                          │
        │  - UK: Companies House API (SIC 10000 - 33200)            │
        │  - US: SEC EDGAR & Census Bureau (SIC 2000-3999, NAICS 31)│
        │  - India: Ministry of Corporate Affairs (NIC 10-33)       │
        │  - Singapore: ACRA & Data.gov.sg (SSIC 10-33)             │
        │  - Middle East: UAE, Saudi, Qatar, Oman, Bahrain, Kuwait  │
        │  - Cross-Country: OpenCorporates                          │
        └─────────────────────────────┬─────────────────────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   │ Classification & Deduplication      │
                   │ - 10-Sector Manufacturing Taxonomy  │
                   │ - Negative Pattern Disqualification │
                   │ - Canonical Domain Normalization    │
                   │ - Multi-Signal Entity Matching      │
                   └──────────────────┬──────────────────┘
                                      │
                   ┌──────────────────┴──────────────────┐
                   │ Normalized Database (SQLAlchemy)    │
                   │ PostgreSQL (Prod) / SQLite (Dev)    │
                   │ - companies                         │
                   │ - people (CEOs, Directors)          │
                   │ - financials (Turnover, Currency)   │
                   │ - sources (Source Registry)         │
                   │ - field_evidence (Provenance Trail) │
                   │ - collection_jobs & job_logs        │
                   │ - export_jobs                       │
                   │ - duplicate_candidates              │
                   └─────────────────────────────────────┘
```

---

## 2. Manufacturing Industry Taxonomy

The classification engine accurately evaluates company evidence against 10 primary sectors and filters out non-manufacturers (distributors only, service-only, retailers, brokers):

- **A. Industrial machinery and equipment**: CNC machines, machine tools, automation equipment, material handling, pumps, valves, bearings, transmissions, actuators.
- **B. Robotics and automation**: Industrial robots, cobots, autonomous mobile robots (AMRs), automated guided vehicles (AGVs), robotic arms, end effectors, machine vision, motion control.
- **C. Automotive and transportation**: Commercial vehicles, electric vehicle powertrains, battery packs, aerospace components, railway rolling stock, marine engines.
- **D. Electrical and electronics**: Semiconductors, PCB fabrication, electrical switchgear, transformers, power electronics, sensors, industrial cabling.
- **E. Metal and fabrication**: Steel and aluminium smelting, foundries, casting, forging, stamping, sheet metal, precision machining, industrial fasteners.
- **F. Chemicals and materials**: Specialty chemicals, engineering polymers, plastics, elastomers, industrial coatings, carbon composites, glass, ceramics, technical gases.
- **G. Food and agriculture**: Industrial food processing, beverage manufacturing, grain milling, agricultural tractors, packaging machinery.
- **H. Pharmaceuticals and healthcare**: Active pharmaceutical ingredients (APIs), sterile injectables, medical devices, implants, surgical diagnostics.
- **I. Textiles and consumer manufacturing**: Technical textiles, precision joinery, industrial paper/pulp, sustainable packaging, electronics hardware.
- **J. Construction and infrastructure**: Structural steel fabrication, cement, ready-mix concrete, HVAC commercial chillers, precast modular systems.

---

## 3. Official Source Registry

| Region | Source Name | Permitted Method | License | Rate Limit |
|---|---|---|---|---|
| **United Kingdom** | Companies House | REST API & Permitted Bulk | Open Government Licence v3.0 | 600 req/min |
| **United States** | SEC EDGAR | Submissions REST API | Public Domain (US Work) | 600 req/min |
| **United States** | US Census Bureau | ASM / CBP Public API | US Census Open Data | 500 req/min |
| **India** | Ministry of Corporate Affairs | MCA Master & Data.gov.in | Government Open Data License (GODL) | 120 req/min |
| **Singapore** | ACRA / Data.gov.sg | CKAN Datastore API | Singapore Open Data Licence | 180 req/min |
| **United Arab Emirates** | UAE National Economic Register & Free Zones | Official Commercial Search | UAE Federal Open Data Policy | 60 req/min |
| **Saudi Arabia** | Ministry of Industry & MISA | Open Data Industrial Portal | Saudi Open Data License | 60 req/min |
| **Qatar** | Ministry of Commerce & Industry | MOCI Open Data API | Qatar Government Open Data | 60 req/min |
| **Oman** | Invest Easy / MOCIIP | Open Commercial Data Portal | Oman Open Data Policy | 60 req/min |
| **Bahrain** | Sijilat Commercial Registry | Sijilat Open Portal | Bahrain Open Data Policy | 60 req/min |
| **Kuwait** | Ministry of Commerce & Industry | PAI Open Data Portal | Kuwait Open Data Policy | 60 req/min |
| **Global** | OpenCorporates | REST API v0.4 | Open Database License (ODbL) | 100 req/min |

---

## 4. Deduplication & Provenance Architecture

- **Domain Normalization**: Strips protocols (`http`, `https`), `www.` subdomains, URL parameters, and ports to index canonical root domains.
- **Company Name Normalization**: Strips regional corporate suffixes (`LLC`, `Inc`, `Ltd`, `plc`, `Pte. Ltd.`, `Pvt. Ltd.`, `PJSC`, `W.L.L.`, `B.S.C.`, `FZE`), special symbols, and performs token-set Levenshtein comparisons.
- **Official Registration Keying**: Enforces unique jurisdiction constraints (`registration_number`, `country`).
- **Data Provenance**: Every field is linked to `field_evidence` records storing the source URL, extraction method, confidence score (0.0 to 1.0), and verification timestamp.

---

## 5. Getting Started & Execution

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### Quick Start (Unified Dashboard + API)

1. Launch the platform:
```bash
python run_platform.py
```
2. Open your browser:
- **Interactive Industrial Research Dashboard**: `http://localhost:8000/`
- **Interactive Swagger REST API Docs**: `http://localhost:8000/docs`
- **ReDoc Technical Schema**: `http://localhost:8000/redoc`

### Development Mode (Frontend Hot-Reloading)

If modifying frontend code with live reload:
```bash
cd frontend
npm run dev
```

### Running Automated Test Suite

```bash
pytest backend/tests -v
```
All 22 unit and integration tests execute against an in-memory SQLite fixture covering API endpoints, pagination, deduplication, classifier accuracy, and export workers.

---

## 6. Dashboard Capabilities

- **Overview Page**: Progress tracker toward 50,000 entities, KPI cards, Recharts geographic distribution bar charts, taxonomy sector pie charts, and regional gap analysis reports.
- **Company Explorer**: Multi-facet filter by country, classification, sector, employee scale, website, verification; sortable server-side paginated data grid; quick exports.
- **Company Profile**: Deep inspection with tabs for Corporate Overview, Technical Products & Capabilities, Leadership & Board, Financials & Revenues, Field Provenance Audit Trail, and Human Review Queue.
- **Data Collection Center**: Live connector cards, background job controls (Run, Pause, Resume, Cancel), and real-time execution logs.
- **Data Quality Hub**: Quality scorecard (Completeness, Accuracy, Consistency, Freshness), country missing-fields matrix, and interactive duplicate review workbench with 1-click Merge or Dismiss actions.
- **Export Center**: Custom export wizard supporting CSV, Excel (.xlsx), and JSON formats with custom field selection and date filtering.

