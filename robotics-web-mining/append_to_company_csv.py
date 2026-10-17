"""Append successfully mined records to the repository's Excel-compatible CSV."""

import argparse
import csv
from pathlib import Path

from sources import SOURCES
from validators import canonical_domain


ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / "company_data_output.csv"
MINED = Path(__file__).resolve().parent / "output" / "robotics_company_leads.csv"
EXPANDED_TARGET = ROOT / "company_data_output_expanded.csv"
FIELDS = ["Company name", "Phone number", "Email", "Address", "Website", "Country", "Description", "Notes"]


def _values(value: str) -> str:
    return "; ".join(dict.fromkeys(part.strip() for part in value.split(";") if part.strip()))


def append_records(limit: int = 100) -> tuple[int, int, Path]:
    with TARGET.open("r", newline="", encoding="utf-8-sig") as handle:
        reader = csv.DictReader(handle)
        existing = list(reader)
        fields = reader.fieldnames
    if fields != FIELDS:
        raise ValueError(f"Unexpected target CSV schema: {fields}")

    existing_domains = {canonical_domain(row.get("Website", "")) for row in existing}
    existing_names = {" ".join(row.get("Company name", "").lower().split()) for row in existing}
    source_by_domain = {canonical_domain(source.url): source for source in SOURCES}
    with MINED.open("r", newline="", encoding="utf-8-sig") as handle:
        candidates = list(csv.DictReader(handle))

    additions = []
    for row in candidates:
        domain = canonical_domain(row.get("website_url", ""))
        name_key = " ".join(row.get("company_name", "").lower().split())
        if row.get("verification_status") not in {"verified", "partially_verified"}:
            continue
        if not domain or domain in existing_domains or not name_key or name_key in existing_names:
            continue
        seed = source_by_domain.get(domain)
        description = _values(row.get("products_services", ""))[:1000]
        notes = " | ".join(filter(None, [
            f"Industry: {row.get('industry_type', '')}",
            f"Specialization: {row.get('robotics_specialization', '')}",
            f"Verification: {row.get('verification_status', '')}",
            f"Source: {row.get('source_url', '')}",
            f"Contact page: {row.get('contact_page_url', '')}" if row.get("contact_page_url") else "",
            f"Last checked: {row.get('last_checked', '')}",
            f"Founded: {row.get('founded_year', '')}" if row.get("founded_year") else "",
            f"Employee count: {row.get('employee_count', '')}" if row.get("employee_count") else "",
            f"Employee range: {row.get('employee_range', '')}" if row.get("employee_range") else "",
            f"Parent company: {row.get('parent_company', '')}" if row.get("parent_company") else "",
        ]))
        email = _values(row.get("email", ""))
        email = "; ".join(value for value in email.split("; ") if value.lower() not in {"name@domain.com", "email@example.com"})
        additions.append({
            "Company name": row.get("company_name", ""),
            "Phone number": _values(row.get("phone_number", "")),
            "Email": email,
            "Address": row.get("address", ""),
            "Website": row.get("website_url", ""),
            "Country": row.get("country", ""),
            "Description": description,
            "Notes": notes or f"Industry: {seed.industry if seed else ''}",
        })
        existing_domains.add(domain)
        existing_names.add(name_key)
        if len(additions) >= limit:
            break

    destination = TARGET
    if additions:
        try:
            with TARGET.open("a", newline="", encoding="utf-8") as handle:
                writer = csv.DictWriter(handle, fieldnames=FIELDS, extrasaction="ignore")
                writer.writerows(additions)
        except PermissionError:
            destination = EXPANDED_TARGET
            with destination.open("w", newline="", encoding="utf-8-sig") as handle:
                writer = csv.DictWriter(handle, fieldnames=FIELDS, extrasaction="ignore")
                writer.writeheader()
                writer.writerows(existing)
                writer.writerows(additions)
    return len(existing), len(additions), destination


def main() -> None:
    parser = argparse.ArgumentParser(description="Append mined robotics companies to company_data_output.csv")
    parser.add_argument("--limit", type=int, default=200, help="Maximum new records to append (1-200)")
    args = parser.parse_args()
    if not 1 <= args.limit <= 200:
        parser.error("--limit must be between 1 and 200")
    old_count, added, destination = append_records(args.limit)
    print(f"Existing rows: {old_count}; new rows appended: {added}; total rows: {old_count + added}")
    print(f"Updated: {destination}")
    if destination == EXPANDED_TARGET:
        print("The original CSV is locked; the expanded copy includes all original and new rows.")


if __name__ == "__main__":
    main()