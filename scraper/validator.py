from __future__ import annotations

import re
from typing import Any, Dict, List


def _is_valid_url(value: str) -> bool:
    return bool(value) and bool(re.match(r"^https?://[A-Za-z0-9.-]+\.[A-Za-z]{2,}.*$", value, flags=re.IGNORECASE))


def validate_company_record(record: Dict[str, Any]) -> Dict[str, Any]:
    warnings: List[str] = []

    if not record.get("company_name"):
        warnings.append("Missing company name")
    if not _is_valid_url(record.get("website") or ""):
        warnings.append("Missing or invalid website URL")
    if not record.get("industry"):
        warnings.append("Missing industry")
    if not record.get("location"):
        warnings.append("Missing location")

    email_values = record.get("emails") or []
    phone_values = record.get("phones") or []
    if not email_values and not phone_values:
        warnings.append("No contact information found")

    duplicate_like = record.get("company_name", "").lower().count("company") > 0
    if duplicate_like:
        warnings.append("Company name appears generic or placeholder-like")

    return {
        "is_valid": not warnings,
        "warnings": warnings,
    }
