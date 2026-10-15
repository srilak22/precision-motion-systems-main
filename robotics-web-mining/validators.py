"""Conservative normalization and validation helpers."""

import re
from urllib.parse import urlsplit, urlunsplit


EMAIL_RE = re.compile(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")


def clean_text(value: object) -> str:
    if value is None:
        return ""
    if isinstance(value, (int, float)):
        return str(value)
    return re.sub(r"\s+", " ", str(value)).strip()


def canonical_url(url: str) -> str:
    parts = urlsplit(url.strip())
    host = (parts.hostname or "").lower().removeprefix("www.")
    if not host:
        return ""
    path = parts.path.rstrip("/")
    return urlunsplit(("https", host, path, "", ""))


def canonical_domain(url: str) -> str:
    return (urlsplit(url).hostname or "").lower().removeprefix("www.")


def normalize_email(value: str) -> str:
    email = clean_text(value).lower().strip(".,;:")
    return email if EMAIL_RE.fullmatch(email) else ""


def normalize_phone(value: str) -> str:
    phone = clean_text(value)
    digits = re.sub(r"\D", "", phone)
    if not 7 <= len(digits) <= 16 or len(set(digits)) == 1:
        return ""
    return phone


def valid_year(value: object) -> str:
    match = re.search(r"\b(18\d{2}|19\d{2}|20[0-2]\d)\b", clean_text(value))
    return match.group(1) if match else ""


def valid_company_record(record: dict) -> bool:
    website = urlsplit(record.get("website_url", ""))
    return bool(record.get("company_name") and website.scheme in {"http", "https"} and website.hostname)