from __future__ import annotations

import csv
import re
from dataclasses import dataclass, field
from pathlib import Path
from typing import Iterable, List, Optional

from config import DEFAULT_INDUSTRY, DEFAULT_LOCATION, DEFAULT_TARGET_COUNT


@dataclass
class CompanyTarget:
    name: str
    website: str
    industry: str = DEFAULT_INDUSTRY
    location: str = DEFAULT_LOCATION
    source: str = "discovery"
    notes: str = ""
    metadata: dict = field(default_factory=dict)

    def __post_init__(self) -> None:
        self.website = self.website.strip()
        self.name = self.name.strip()
        self.industry = self.industry.strip() or DEFAULT_INDUSTRY
        self.location = self.location.strip() or DEFAULT_LOCATION

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "website": self.website,
            "industry": self.industry,
            "location": self.location,
            "source": self.source,
            "notes": self.notes,
            "metadata": self.metadata,
        }


def _normalize_website(url: str) -> str:
    cleaned = url.strip()
    if not cleaned:
        return ""
    if not re.match(r"^https?://", cleaned, re.IGNORECASE):
        cleaned = "https://" + cleaned
    return cleaned


def _load_candidates_from_csv(path: str | Path) -> List[CompanyTarget]:
    records: List[CompanyTarget] = []
    with open(path, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            name = (row.get("company") or row.get("name") or "").strip()
            website = (row.get("website") or row.get("url") or "").strip()
            if not name or not website:
                continue
            records.append(
                CompanyTarget(
                    name=name,
                    website=_normalize_website(website),
                    industry=row.get("industry") or DEFAULT_INDUSTRY,
                    location=row.get("location") or DEFAULT_LOCATION,
                    source="csv",
                    notes=row.get("notes") or "",
                    metadata={k: v for k, v in row.items() if k not in {"company", "name", "website", "url", "industry", "location", "notes"}},
                )
            )
    return records


def _fallback_company_seed(industry: str, location: str, target_count: int) -> List[CompanyTarget]:
    seed = [
        "Siemens",
        "ABB",
        "Rockwell Automation",
        "Schneider Electric",
        "Mitsubishi Electric",
        "Fanuc",
        "Bosch Rexroth",
        "Yaskawa",
        "KUKA",
        "Omron",
        "Parker Hannifin",
        "Danfoss",
        "Lenze",
        "Festo",
        "Kollmorgen",
        "Dover Motion",
        "SMC",
        "SANYO DENKI",
        "Mecapion",
        "Delta Electronics",
        "Oriental Motor",
        "Ametek",
        "Nidec",
        "Altra Industrial Motion",
        "Thyssenkrupp",
        "FANUC",
        "Adept",
    ]
    results: List[CompanyTarget] = []
    for idx, name in enumerate(seed[: max(1, target_count)]):
        domain = name.lower().replace(" & ", "-").replace(" ", "-")
        results.append(
            CompanyTarget(
                name=name,
                website=f"https://www.{domain}.com",
                industry=industry,
                location=location,
                source="seed",
                notes=f"Fallback seed entry #{idx + 1}",
            )
        )
    return results


def discover_company_targets(
    industry: str = DEFAULT_INDUSTRY,
    location: str = DEFAULT_LOCATION,
    target_count: int = DEFAULT_TARGET_COUNT,
    source_file: Optional[str | Path] = None,
) -> List[CompanyTarget]:
    """Return a list of likely company targets.

    This implementation uses a conservative fallback process: it first reads a CSV
    if provided, otherwise it uses a seeded list of public company names that should
    be checked against public website sources. The data is intentionally simple and
    used as a starter scaffold rather than a production-grade enterprise crawler.
    """
    if source_file:
        source_targets = _load_candidates_from_csv(source_file)
        if source_targets:
            return source_targets[: max(1, target_count)]

    return _fallback_company_seed(industry, location, target_count)
