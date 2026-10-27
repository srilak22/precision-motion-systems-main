from dataclasses import dataclass, field, asdict
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone

@dataclass
class CompanyRecord:
    record_id: str
    company_name: str
    company_category: str
    subcategory: str
    state: str
    city: str
    country: str
    official_website: Optional[str] = None
    company_profile_url: Optional[str] = None
    company_description: Optional[str] = None
    products_or_services: Optional[str] = None
    contact_information_if_public_and_relevant: Optional[str] = None
    source_name: str = "Association for Advancing Automation (A3)"
    source_url: str = ""
    search_term: str = ""
    filter_applied: str = ""
    model_id: str = ""
    extracted_at: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    validation_status: str = "PENDING"
    validation_notes: str = ""
    # Metadata for multi-model association
    associated_models: List[str] = field(default_factory=list)
    associated_filters: List[str] = field(default_factory=list)

    def to_dict(self) -> Dict[str, Any]:
        d = asdict(self)
        # Exclude internal metadata from base schema dictionary
        d.pop('associated_models', None)
        d.pop('associated_filters', None)
        return d

    def to_export_dict(self) -> Dict[str, Any]:
        """Returns standard 20-column dictionary format required by schema."""
        return {
            "record_id": self.record_id,
            "company_name": self.company_name,
            "company_category": self.company_category,
            "subcategory": self.subcategory,
            "state": self.state,
            "city": self.city,
            "country": self.country,
            "official_website": self.official_website or "",
            "company_profile_url": self.company_profile_url or "",
            "company_description": self.company_description or "",
            "products_or_services": self.products_or_services or "",
            "contact_information_if_public_and_relevant": self.contact_information_if_public_and_relevant or "",
            "source_name": self.source_name,
            "source_url": self.source_url,
            "search_term": self.search_term,
            "filter_applied": self.filter_applied,
            "model_id": self.model_id,
            "extracted_at": self.extracted_at,
            "validation_status": self.validation_status,
            "validation_notes": self.validation_notes
        }

@dataclass
class ExtractionLogEntry:
    timestamp: str
    model_id: str
    state: str
    search_term: str
    filter_applied: str
    page_number: int
    records_extracted: int
    status: str  # SUCCESS, RETRY, FAILED, SKIPPED
    error_message: Optional[str] = None

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)
