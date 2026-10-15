from __future__ import annotations

import argparse
import json
from datetime import datetime
from pathlib import Path

from config import (
    DEFAULT_INDUSTRY,
    DEFAULT_LOCATION,
    DEFAULT_TARGET_COUNT,
    INDUSTRY_OUTPUT_DIR,
    RAW_OUTPUT_DIR,
    VERIFIED_OUTPUT_DIR,
    ensure_directories,
)
from scraper.discovery import discover_company_targets
from scraper.extractor import extract_company_record
from scraper.validator import validate_company_record
from scraper.website_scraper import WebsiteScraper


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Company data extraction pipeline")
    parser.add_argument("--industry", default=DEFAULT_INDUSTRY, help="Industry to target")
    parser.add_argument("--location", default=DEFAULT_LOCATION, help="Location to search")
    parser.add_argument("--target-count", type=int, default=DEFAULT_TARGET_COUNT, help="Target number of companies")
    parser.add_argument("--source-file", default=None, help="Optional CSV or JSON file with candidate sources")
    parser.add_argument("--max-pages", type=int, default=1, help="Maximum pages per site to scrape")
    return parser.parse_args()


def write_json(path: Path, payload: object) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, indent=2, ensure_ascii=False)


def main() -> None:
    ensure_directories()
    args = parse_args()

    targets = discover_company_targets(
        industry=args.industry,
        location=args.location,
        target_count=args.target_count,
        source_file=args.source_file,
    )

    scraper = WebsiteScraper()
    verified_records = []
    raw_records = []

    for index, target in enumerate(targets, start=1):
        try:
            page = scraper.scrape(target.website, max_pages=args.max_pages)
            extracted = extract_company_record(page.text or "", target)
            validation = validate_company_record(extracted)

            if validation["is_valid"]:
                verified_records.append(extracted)
            else:
                extracted["validation_warnings"] = validation["warnings"]

            raw_records.append({
                "target": target.model_dump() if hasattr(target, "model_dump") else target.__dict__,
                "record": extracted,
                "validation": validation,
            })
        except Exception as exc:  # pragma: no cover - defensive pipeline behavior
            raw_records.append({
                "target": target.__dict__,
                "error": str(exc),
                "record": {},
                "validation": {"is_valid": False, "warnings": [str(exc)]},
            })

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    write_json(RAW_OUTPUT_DIR / f"raw_{timestamp}.json", raw_records)
    write_json(VERIFIED_OUTPUT_DIR / f"verified_{timestamp}.json", verified_records)

    industry_bucket = {
        "industry": args.industry,
        "location": args.location,
        "count": len(verified_records),
        "companies": verified_records,
    }
    write_json(INDUSTRY_OUTPUT_DIR / f"{args.industry.lower().replace(' ', '_')}_{timestamp}.json", industry_bucket)

    print(f"Processed {len(targets)} targets. Verified {len(verified_records)} records.")
    print(f"Raw output: {RAW_OUTPUT_DIR}")
    print(f"Verified output: {VERIFIED_OUTPUT_DIR}")


if __name__ == "__main__":
    main()
