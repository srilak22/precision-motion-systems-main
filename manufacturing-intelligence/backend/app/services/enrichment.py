"""
Company Website and Public Data Enrichment Engine.
Inspects public websites, parses structured JSON-LD data, extracts leadership,
validates public contact coordinates, and calculates field completeness and data provenance.
"""
from __future__ import annotations

import json
import re
import urllib.parse
from typing import Dict, Any, List, Optional, Tuple
from bs4 import BeautifulSoup

from app.services.deduplication import DeduplicationService


class EnrichmentResult:
    def __init__(self):
        self.root_domain: Optional[str] = None
        self.phone: Optional[str] = None
        self.email: Optional[str] = None
        self.sales_email: Optional[str] = None
        self.contact_form_url: Optional[str] = None
        self.about_url: Optional[str] = None
        self.products_url: Optional[str] = None
        self.leadership_url: Optional[str] = None
        self.linkedin_url: Optional[str] = None
        self.facebook_url: Optional[str] = None
        self.twitter_url: Optional[str] = None
        self.executives: List[Dict[str, Any]] = []
        self.main_products: List[str] = []
        self.certifications: List[str] = []
        self.manufacturing_processes: List[str] = []
        self.field_provenance: List[Dict[str, Any]] = []


class DataEnrichmentService:
    """Extracts verifiable corporate data from public static HTML and schema.org markup."""

    @classmethod
    def enrich_from_html(
        cls,
        base_url: str,
        html_content: str,
        source_name: str = "official_website_crawl",
    ) -> EnrichmentResult:
        result = EnrichmentResult()
        result.root_domain = DeduplicationService.normalize_domain(base_url)

        if not html_content:
            return result

        soup = BeautifulSoup(html_content, "html.parser")

        # 1. Parse JSON-LD Structured Data
        for script in soup.find_all("script", type="application/ld+json"):
            try:
                data = json.loads(script.string or "")
                if isinstance(data, list):
                    for item in data:
                        cls._extract_from_json_ld(item, result, base_url, source_name)
                elif isinstance(data, dict):
                    cls._extract_from_json_ld(data, result, base_url, source_name)
            except Exception:
                continue

        # 2. Extract Navigation & Page URLs
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            text = a.get_text(strip=True).lower()
            full_url = urllib.parse.urljoin(base_url, href)

            if "about" in text or "/about" in href.lower():
                if not result.about_url:
                    result.about_url = full_url
            elif "contact" in text or "/contact" in href.lower():
                if not result.contact_page_url:
                    result.contact_page_url = full_url
            elif "product" in text or "/products" in href.lower() or "/catalog" in href.lower():
                if not result.products_url:
                    result.products_url = full_url
            elif "leadership" in text or "management" in text or "directors" in text or "/leadership" in href.lower():
                if not result.leadership_url:
                    result.leadership_url = full_url
            elif "linkedin.com/company" in href:
                result.linkedin_url = full_url
            elif "facebook.com" in href and "share" not in href:
                result.facebook_url = full_url
            elif "twitter.com" in href or "x.com" in href:
                result.twitter_url = full_url

        # 3. Extract Public Phone Numbers
        if not result.phone:
            # Look for tel: links
            tel_link = soup.find("a", href=re.compile(r"^tel:", re.IGNORECASE))
            if tel_link and tel_link.get("href"):
                raw_phone = tel_link["href"].replace("tel:", "").strip()
                result.phone = cls._normalize_phone(raw_phone)
                result.field_provenance.append({
                    "field": "phone",
                    "value": result.phone,
                    "url": base_url,
                    "method": "tel_anchor",
                })
            else:
                # Regex phone scan
                phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}", soup.text)
                if phone_match:
                    match_str = phone_match.group(0).strip()
                    if len(re.sub(r"\D", "", match_str)) >= 7:
                        result.phone = cls._normalize_phone(match_str)

        # 4. Extract Public Business Emails (no personal emails / no guessed emails)
        if not result.email:
            mailto = soup.find("a", href=re.compile(r"^mailto:", re.IGNORECASE))
            if mailto and mailto.get("href"):
                email_val = mailto["href"].replace("mailto:", "").split("?")[0].strip().lower()
                if cls._is_valid_business_email(email_val):
                    result.email = email_val
                    result.field_provenance.append({
                        "field": "email",
                        "value": email_val,
                        "url": base_url,
                        "method": "mailto_anchor",
                    })

        # 5. Extract Certifications (ISO 9001, AS9100, IATF 16949, CE, RoHS, etc.)
        text_lower = soup.text.lower()
        certs_found = set()
        for cert in ["iso 9001", "iso 14001", "iso 13485", "iso 45001", "iatf 16949", "as9100", "ce mark", "rohs", "reach", "ul certified"]:
            if cert in text_lower:
                certs_found.add(cert.upper())
        result.certifications = list(certs_found)

        return result

    @classmethod
    def _extract_from_json_ld(cls, item: Dict[str, Any], result: EnrichmentResult, url: str, source: str):
        type_val = item.get("@type", "")
        types = [type_val] if isinstance(type_val, str) else type_val
        if any(t in types for t in ["Organization", "Corporation", "LocalBusiness"]):
            if "telephone" in item and not result.phone:
                result.phone = cls._normalize_phone(str(item["telephone"]))
                result.field_provenance.append({"field": "phone", "value": result.phone, "url": url, "method": "json_ld"})
            if "email" in item and not result.email:
                em = str(item["email"]).strip().lower()
                if cls._is_valid_business_email(em):
                    result.email = em
                    result.field_provenance.append({"field": "email", "value": em, "url": url, "method": "json_ld"})
            if "founder" in item or "employee" in item or "alumni" in item:
                people = item.get("founder") or item.get("employee")
                if isinstance(people, list):
                    for p in people:
                        if isinstance(p, dict) and "name" in p:
                            result.executives.append({
                                "name": p["name"],
                                "job_title": p.get("jobTitle", "Executive"),
                                "role_type": "founder" if "founder" in item else "executive",
                            })
                elif isinstance(people, dict) and "name" in people:
                    result.executives.append({
                        "name": people["name"],
                        "job_title": people.get("jobTitle", "Executive"),
                        "role_type": "founder" if "founder" in item else "executive",
                    })

    @staticmethod
    def _normalize_phone(phone: str) -> str:
        cleaned = re.sub(r"[^\d+()-\s]", "", phone).strip()
        return " ".join(cleaned.split())

    @staticmethod
    def _is_valid_business_email(email: str) -> bool:
        if not email or "@" not in email:
            return False
        # Disqualify common placeholder / invalid emails
        invalid_patterns = ["example.com", "domain.com", "yourname@", "email@address.com", "test@"]
        if any(p in email for p in invalid_patterns):
            return False
        # Simple regex check
        return bool(re.match(r"^[\w\.-]+@[\w\.-]+\.\w{2,}$", email))

    @classmethod
    def calculate_completeness_score(cls, company_data: Dict[str, Any]) -> float:
        """
        Calculates field completeness score (0.0 - 1.0) based on weighted essential fields.
        """
        weights = {
            "legal_name": 0.15,
            "country": 0.10,
            "registration_number": 0.10,
            "official_website": 0.10,
            "city": 0.05,
            "industry_sector": 0.10,
            "manufacturing_classification": 0.10,
            "main_products": 0.10,
            "email": 0.05,
            "phone": 0.05,
            "employee_count": 0.05,
            "has_leadership": 0.05,
            "has_financials": 0.05,
        }

        score = 0.0
        for field, weight in weights.items():
            if field == "main_products":
                val = company_data.get("main_products")
                if val and len(val) > 0:
                    score += weight
            elif field == "has_leadership":
                people = company_data.get("people") or []
                if len(people) > 0:
                    score += weight
            elif field == "has_financials":
                fins = company_data.get("financials") or []
                if len(fins) > 0:
                    score += weight
            else:
                val = company_data.get(field)
                if val:
                    score += weight

        return round(min(score, 1.0), 3)

