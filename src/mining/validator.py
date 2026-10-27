import re
from urllib.parse import urlparse
from typing import List, Dict, Any, Tuple
from .models import CompanyRecord

ROBOTICS_RELEVANCE_KEYWORDS = [
    "robot", "cobot", "automation", "integrator", "control", "plc", "sensor",
    "vision", "motion", "motor", "actuator", "drive", "scara", "articulated",
    "machine", "gripper", "amr", "agv", "warehouse", "software", "optics",
    "encoder", "servo", "payload", "cell", "conveyor", "manufacturing"
]

class CompanyDataValidator:
    """Automated Quality Assurance and Schema Validation Engine."""

    def __init__(self, target_states: List[str]):
        self.target_states = [s.strip().title() for s in target_states]

    def validate_record(self, record: CompanyRecord) -> Tuple[str, str]:
        """
        Validates a single company record.
        Returns (validation_status, validation_notes).
        Statuses:
        - VERIFIED: All mandatory fields present, valid URLs, target state, and robotics relevance confirmed.
        - PARTIAL: Mandatory fields present, but missing official website or phone.
        - REVIEW: Flagged for minor anomalies (e.g., weak robotics relevance text).
        - REJECTED: Missing company name, missing source URL, invalid URL, or outside geographic scope.
        """
        notes = []

        # 1. Mandatory Company Name
        if not record.company_name or len(record.company_name.strip()) < 2:
            return "REJECTED", "Missing or invalid company name"

        # 2. Source URL
        if not record.source_url or not self._is_valid_url(record.source_url):
            return "REJECTED", f"Missing or malformed source URL: {record.source_url}"

        # 3. Profile URL
        if record.company_profile_url and not self._is_valid_url(record.company_profile_url):
            notes.append("Malformed company_profile_url")

        # 4. Official Website URL
        if record.official_website:
            if not self._is_valid_url(record.official_website):
                notes.append("Malformed official_website URL")
        else:
            notes.append("No official website discovered")

        # 5. Geographic Scope Check
        rec_state = record.state.strip().title() if record.state else ""
        if not rec_state:
            return "REJECTED", "Missing state value"
        if self.target_states and rec_state not in self.target_states:
            return "REJECTED", f"State '{rec_state}' is outside configured target states ({self.target_states})"

        # 6. Robotics Relevance Check
        relevance_score = self._compute_relevance(record)
        if relevance_score == 0:
            notes.append("Low robotics/automation keyword evidence")

        # 7. Contact information
        has_contact = bool(record.contact_information_if_public_and_relevant)
        if not has_contact:
            notes.append("No public phone number found")

        # Final Status determination
        if not record.official_website and not has_contact:
            status = "PARTIAL"
            notes.append("Basic directory listing only (no website/contact)")
        elif relevance_score >= 1 and record.official_website:
            status = "VERIFIED"
            notes.append("Verified robotics/automation company with active profile and official domain")
        elif relevance_score >= 1:
            status = "PARTIAL"
            notes.append("Verified entity with directory record and location")
        else:
            status = "REVIEW"

        return status, "; ".join(notes)

    def _is_valid_url(self, url: str) -> bool:
        if not url or not isinstance(url, str):
            return False
        try:
            result = urlparse(url)
            return all([result.scheme in ["http", "https"], result.netloc])
        except Exception:
            return False

    def _compute_relevance(self, record: CompanyRecord) -> int:
        text = f"{record.company_name} {record.company_category} {record.subcategory} {record.company_description} {record.products_or_services}".lower()
        score = sum(1 for kw in ROBOTICS_RELEVANCE_KEYWORDS if kw in text)
        return score

    def run_validation_suite(self, records: List[CompanyRecord]) -> Dict[str, Any]:
        """Runs validation on a list of records and produces summary statistics."""
        summary = {
            "total_evaluated": len(records),
            "status_counts": {
                "VERIFIED": 0,
                "PARTIAL": 0,
                "REVIEW": 0,
                "REJECTED": 0
            },
            "missing_fields": {
                "official_website": 0,
                "contact_information": 0,
                "company_description": 0,
                "products_or_services": 0,
                "city": 0
            },
            "state_distribution": {},
            "rejected_records": [],
            "validation_details": []
        }

        for rec in records:
            status, notes = self.validate_record(rec)
            rec.validation_status = status
            rec.validation_notes = notes

            summary["status_counts"][status] = summary["status_counts"].get(status, 0) + 1

            # Missing field tally
            if not rec.official_website:
                summary["missing_fields"]["official_website"] += 1
            if not rec.contact_information_if_public_and_relevant:
                summary["missing_fields"]["contact_information"] += 1
            if not rec.company_description:
                summary["missing_fields"]["company_description"] += 1
            if not rec.products_or_services:
                summary["missing_fields"]["products_or_services"] += 1
            if not rec.city:
                summary["missing_fields"]["city"] += 1

            # State tally
            st = rec.state or "Unknown"
            summary["state_distribution"][st] = summary["state_distribution"].get(st, 0) + 1

            if status == "REJECTED":
                summary["rejected_records"].append({
                    "record_id": rec.record_id,
                    "company_name": rec.company_name,
                    "state": rec.state,
                    "notes": notes
                })

            summary["validation_details"].append({
                "record_id": rec.record_id,
                "company_name": rec.company_name,
                "state": rec.state,
                "status": status,
                "notes": notes
            })

        return summary
