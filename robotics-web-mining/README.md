# Robotics Company Web Mining

A conservative, resumable crawler for public business facts on the 50 official robotics and industrial-technology seed websites. It does not bypass access controls, submit forms, or guess contact details. Crawling is limited by robots.txt, a 2-second request interval, bounded retries and page sizes, and a maximum of six HTML pages per source. An inaccessible robots policy causes that source to be skipped.

## Install

From this directory, use Python 3.10 or later:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

## Commands

```powershell
python main.py --list-sources
python main.py --test
python main.py --run
python main.py --run --limit 10
python main.py --export
python -m unittest -v test_mining.py
```

`--test` runs the first two configured sources without changing the main output files or checkpoint. `--run` saves a checkpoint after every seed; rerunning skips completed seeds. `--export` rebuilds output files from the checkpoint without sending network requests. Delete `output/robotics_checkpoint.json` manually to request a fresh full crawl.

## Outputs

- `output/robotics_company_leads.csv`: normalized records using the required 24-column schema.
- `output/robotics_extraction_audit.csv`: source URL and retrieval timestamp for each extracted field.
- `output/robotics_failed_urls.csv`: robots, HTTP, redirect, and network failures.
- `output/robotics_summary.json`: counts, failure list, and missing-field report.
- `output/robotics_missing_data_report.csv`: missing count and percentage for each optional field.
- `output/robotics_duplicate_decisions.csv`: explicit same-domain duplicate decisions.
- `output/robotics_checkpoint.json`: resumable crawl state; retain for resume, protect as operational data.
- `logs/robotics_mining.log`: crawl diagnostics.

## Data and verification notes

Industry, specialization, entity type, and known parent relationships are catalog classifications, not facts inferred from page text. Extracted contact, address, founding, employee, product, and organization information is sourced to official HTML/JSON-LD pages in the audit file. Employee counts/ranges and founding years remain empty unless explicitly published in structured metadata. `partially_verified` means an official-domain HTML page was retrieved; this crawler does not claim legal-entity or field-by-field external verification. The ROS project and NVIDIA robotics division are represented as project/division entities, not independent companies. Subsidiary and division rows remain distinct from parent records.

Automated checks can evaluate robots.txt but cannot establish that every page complies with terms of service or jurisdiction-specific rules. Review site terms and the generated failure/audit files before using the database. A syntactically valid public email is not evidence of deliverability. Missing data is intentionally not guessed.

## Troubleshooting

- `robots_policy`: robots.txt could not be checked or denied crawling; skipped by design.
- `403`, `429`, or anti-bot response: the source is not retried beyond the configured limit; do not attempt to evade it.
- No record for a source: inspect the failure CSV and log; a source can be processed without yielding a usable page.
- To resume, rerun `--run`; completed source domains are skipped. Use `--export` to rebuild deliverables from existing checkpoint data.