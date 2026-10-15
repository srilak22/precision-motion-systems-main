"""Write stable CSV and JSON deliverables from the resumable checkpoint."""

import csv
import json
from collections import Counter
from datetime import datetime, timezone

from config import (
    AUDIT_FIELDS, AUDIT_FILE, CHECKPOINT_FILE, DUPLICATES_FILE, DUPLICATE_FIELDS,
    FAILURE_FIELDS, FAILURES_FILE, LEAD_FIELDS, LEADS_FILE, MISSING_DATA_FIELDS,
    MISSING_DATA_FILE, OUTPUT_DIR, SUMMARY_FILE,
)
from deduplication import deduplicate
from sources import SOURCES


def _write_csv(path, fields, rows):
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def export_results(checkpoint_data: dict | None = None) -> dict:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    if checkpoint_data is not None:
        checkpoint = checkpoint_data
    elif CHECKPOINT_FILE.exists():
        checkpoint = json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8"))
    else:
        checkpoint = {"completed": {}, "audit": [], "failures": []}

    raw_records = [entry["record"] for entry in checkpoint.get("completed", {}).values() if entry.get("record")]
    records, decisions = deduplicate(raw_records)
    _write_csv(LEADS_FILE, LEAD_FIELDS, records)
    _write_csv(AUDIT_FILE, AUDIT_FIELDS, checkpoint.get("audit", []))
    _write_csv(FAILURES_FILE, FAILURE_FIELDS, checkpoint.get("failures", []))
    _write_csv(DUPLICATES_FILE, DUPLICATE_FIELDS, decisions)

    missing = Counter()
    for field in LEAD_FIELDS:
        if field in {"company_id", "company_name", "website_url", "last_checked", "verification_status", "source_type", "extraction_notes"}:
            continue
        missing[field] = sum(not row.get(field) for row in records)
    missing_rows = [
        {
            "field_name": field,
            "records_missing": count,
            "total_records": len(records),
            "missing_percentage": round(count * 100 / len(records), 2) if records else 0,
        }
        for field, count in missing.items()
    ]
    _write_csv(MISSING_DATA_FILE, MISSING_DATA_FIELDS, missing_rows)
    accessible = sum(bool(entry.get("accessible")) for entry in checkpoint.get("completed", {}).values())
    processed = len(checkpoint.get("completed", {}))
    summary = {
        "total_seed_websites": len(SOURCES),
        "processed_seed_websites": processed,
        "accessible_websites": accessible,
        "companies_identified": len(raw_records),
        "successful_records": len(records),
        "verified_records": sum(row.get("verification_status") == "verified" for row in records),
        "records_with_source_verification": sum(bool(row.get("source_url")) for row in records),
        "missing_field_counts": dict(missing),
        "duplicates_removed": len(decisions),
        "failures": len(checkpoint.get("failures", [])),
        "failed_urls": [failure["url"] for failure in checkpoint.get("failures", [])],
        "last_exported": datetime.now(timezone.utc).isoformat(),
    }
    SUMMARY_FILE.write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    return {"records": len(records), "summary": summary, "files": [str(LEADS_FILE), str(AUDIT_FILE), str(FAILURES_FILE), str(SUMMARY_FILE), str(MISSING_DATA_FILE), str(DUPLICATES_FILE)]}