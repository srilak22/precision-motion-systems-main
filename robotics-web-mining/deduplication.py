"""Deduplicate identical entities without merging divisions into parent companies."""

import re
from datetime import datetime, timezone

from validators import canonical_domain


def _name_key(name: str) -> str:
    return re.sub(r"[^a-z0-9]", "", name.lower())


def deduplicate(records: list[dict]) -> tuple[list[dict], list[dict]]:
    kept = []
    decisions = []
    by_name: dict[str, dict] = {}
    for record in records:
        name_key = _name_key(record.get("company_name", ""))
        existing = by_name.get(name_key) if name_key else None
        if existing:
            left_domain = canonical_domain(existing.get("website_url", ""))
            right_domain = canonical_domain(record.get("website_url", ""))
            if left_domain and left_domain == right_domain:
                for key, value in record.items():
                    if not existing.get(key) and value:
                        existing[key] = value
                decisions.append({
                    "kept_company": existing.get("company_name", ""),
                    "excluded_company": record.get("company_name", ""),
                    "reason": "Normalized company name matched; same entity retained and missing fields merged.",
                    "decision_date": datetime.now(timezone.utc).date().isoformat(),
                })
                continue
        by_name[name_key] = record
        kept.append(record)
    return kept, decisions