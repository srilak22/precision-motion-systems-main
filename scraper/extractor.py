from __future__ import annotations

import re
from typing import Any, Dict

from bs4 import BeautifulSoup

from scraper.discovery import CompanyTarget


def _clean_text(value: str) -> str:
    return re.sub(r"\s+", " ", value or "").strip()


def extract_company_record(html: str, target: CompanyTarget) -> Dict[str, Any]:
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text(" ", strip=True)

    company_name = _clean_text(target.name)
    website = (target.website or "").strip()

    email_candidates = re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", html, flags=re.IGNORECASE)
    phone_candidates = re.findall(r"(?:\+\d{1,3}[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)\d{3}[-.\s]?\d{4}", text)

    record = {
        "company_name": company_name,
        "website": website,
        "industry": target.industry,
        "location": target.location,
        "source": target.source,
        "notes": target.notes,
        "title": _clean_text(soup.title.get_text(" ", strip=True)) if soup.title else "",
        "description": _clean_text(text[:1000]),
        "emails": list(dict.fromkeys(email_candidates))[:5],
        "phones": list(dict.fromkeys(phone_candidates))[:5],
        "confidence": "low",
    }

    if company_name and website:
        record["confidence"] = "medium"
    return record
