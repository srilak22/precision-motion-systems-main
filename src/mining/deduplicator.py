import re
from urllib.parse import urlparse
from typing import List, Dict, Any, Tuple
from .models import CompanyRecord

class CompanyDeduplicator:
    """Detects duplicates and merges multi-model associations while preserving source metadata."""

    @staticmethod
    def normalize_company_name(name: str) -> str:
        """Normalizes company name for fuzzy/canonical matching."""
        if not name:
            return ""
        # Lowercase
        clean = name.lower().strip()
        # Remove common legal entity suffixes
        clean = re.sub(r"\b(inc|incorporated|corp|corporation|llc|l\.l\.c\.|ltd|limited|co|company|group|technologies|systems|usa|north america|americas)\b", "", clean)
        # Remove punctuation and excess whitespace
        clean = re.sub(r"[^\w\s]", "", clean)
        clean = " ".join(clean.split())
        return clean

    @staticmethod
    def extract_domain(url: Optional[str]) -> str:
        """Extracts clean registered domain from website URL."""
        if not url:
            return ""
        try:
            parsed = urlparse(url)
            netloc = parsed.netloc.lower()
            if netloc.startswith("www."):
                netloc = netloc[4:]
            return netloc
        except Exception:
            return ""

    @classmethod
    def deduplicate_and_merge(cls, records: List[CompanyRecord]) -> Tuple[List[CompanyRecord], Dict[str, Any]]:
        """
        Deduplicates raw extracted company records.
        Returns:
            - unique_records: Deduplicated list of CompanyRecords with merged models/categories.
            - stats: Deduplication decision log and statistics.
        """
        unique_records: List[CompanyRecord] = []
        name_index: Dict[str, CompanyRecord] = {}
        domain_index: Dict[str, CompanyRecord] = {}
        profile_url_index: Dict[str, CompanyRecord] = {}

        duplicate_decisions = []
        raw_count = len(records)

        for rec in records:
            norm_name = cls.normalize_company_name(rec.company_name)
            domain = cls.extract_domain(rec.official_website)
            profile_url = rec.company_profile_url or ""

            # Check if matching existing record
            existing: Optional[CompanyRecord] = None
            match_reason = ""

            if profile_url and profile_url in profile_url_index:
                existing = profile_url_index[profile_url]
                match_reason = f"Profile URL match: {profile_url}"
            elif domain and domain in domain_index:
                existing = domain_index[domain]
                match_reason = f"Official domain match: {domain}"
            elif norm_name and norm_name in name_index:
                # If name matches and state matches (or one state is empty)
                cand = name_index[norm_name]
                if not cand.state or not rec.state or cand.state.lower() == rec.state.lower():
                    existing = cand
                    match_reason = f"Normalized company name match: '{norm_name}'"

            if existing:
                # Merge metadata
                if rec.model_id and rec.model_id not in existing.associated_models:
                    existing.associated_models.append(rec.model_id)
                if rec.filter_applied and rec.filter_applied not in existing.associated_filters:
                    existing.associated_filters.append(rec.filter_applied)

                # Enrich any missing fields
                if not existing.official_website and rec.official_website:
                    existing.official_website = rec.official_website
                    if domain:
                        domain_index[domain] = existing
                if not existing.contact_information_if_public_and_relevant and rec.contact_information_if_public_and_relevant:
                    existing.contact_information_if_public_and_relevant = rec.contact_information_if_public_and_relevant
                if not existing.company_description and rec.company_description:
                    existing.company_description = rec.company_description
                if not existing.products_or_services and rec.products_or_services:
                    existing.products_or_services = rec.products_or_services
                if not existing.city and rec.city:
                    existing.city = rec.city

                duplicate_decisions.append({
                    "raw_record_id": rec.record_id,
                    "matched_master_record_id": existing.record_id,
                    "company_name": rec.company_name,
                    "state": rec.state,
                    "reason": match_reason,
                    "action": "MERGED"
                })
            else:
                # New unique record
                if rec.model_id:
                    rec.associated_models = [rec.model_id]
                if rec.filter_applied:
                    rec.associated_filters = [rec.filter_applied]

                unique_records.append(rec)
                if norm_name:
                    name_index[norm_name] = rec
                if domain:
                    domain_index[domain] = rec
                if profile_url:
                    profile_url_index[profile_url] = rec

        stats = {
            "raw_records_count": raw_count,
            "unique_records_count": len(unique_records),
            "duplicates_merged_count": len(duplicate_decisions),
            "duplicate_decisions": duplicate_decisions
        }
        return unique_records, stats
