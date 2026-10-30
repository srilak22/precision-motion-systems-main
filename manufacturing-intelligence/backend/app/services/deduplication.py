"""
Deduplication and Entity Resolution Engine.
Implements domain normalization, legal name cleaning, registration number matching,
and fuzzy matching for duplicate detection.
"""
from __future__ import annotations

import re
import urllib.parse
from difflib import SequenceMatcher
from typing import Optional, Tuple, List, Dict

LEGAL_SUFFIXES = [
    r"\binc\.?\b",
    r"\bincorporated\b",
    r"\bllc\.?\b",
    r"\bl\.l\.c\.?\b",
    r"\bcorp\.?\b",
    r"\bcorporation\b",
    r"\bltd\.?\b",
    r"\blimited\b",
    r"\bco\.?\b",
    r"\bcompany\b",
    r"\bpte\.?\s*ltd\.?\b",
    r"\bpvt\.?\s*ltd\.?\b",
    r"\bprivate\s*limited\b",
    r"\bplc\.?\b",
    r"\bgmbh\b",
    r"\bag\b",
    r"\bsa\b",
    r"\bsas\b",
    r"\bsrl\b",
    r"\bw\.?l\.?l\.?\b",
    r"\bb\.?s\.?c\.?\b",
    r"\bfze\b",
    r"\bfzco\b",
    r"\bholding(s)?\b",
    r"\bgroup\b",
]


class DeduplicationService:
    """Methods for normalizing entities and evaluating duplicate candidates."""

    @staticmethod
    def normalize_domain(url_or_domain: Optional[str]) -> Optional[str]:
        """
        Normalizes a website URL into a canonical root domain.
        e.g. 'https://www.abb.com/products/robotics' -> 'abb.com'
        """
        if not url_or_domain:
            return None

        raw = url_or_domain.strip().lower()
        if not raw.startswith(("http://", "https://")):
            raw = "https://" + raw

        try:
            parsed = urllib.parse.urlparse(raw)
            netloc = parsed.netloc.split(":")[0]  # remove port if any
            if netloc.startswith("www."):
                netloc = netloc[4:]
            return netloc if netloc else None
        except Exception:
            # Fallback simple regex
            cleaned = re.sub(r"^https?://(www\.)?", "", raw).split("/")[0].split(":")[0]
            return cleaned if cleaned else None

    @staticmethod
    def normalize_company_name(name: Optional[str]) -> str:
        """
        Normalizes legal business name for matching:
        strips legal suffixes, punctuation, excessive spaces, and lowers case.
        """
        if not name:
            return ""

        cleaned = name.lower()
        # Remove parentheses contents (e.g. '(India)', '(Holdings)')
        cleaned = re.sub(r"\([^)]*\)", "", cleaned)

        # Remove legal suffixes
        for suffix_pat in LEGAL_SUFFIXES:
            cleaned = re.sub(suffix_pat, " ", cleaned, flags=re.IGNORECASE)

        # Remove special characters
        cleaned = re.sub(r"[^\w\s]", " ", cleaned)

        # Collapse whitespace
        cleaned = " ".join(cleaned.split())
        return cleaned

    @classmethod
    def calculate_name_similarity(cls, name_a: str, name_b: str) -> float:
        """
        Computes string similarity score [0.0 - 1.0] between two normalized names.
        Combines standard sequence matcher with token-set intersection.
        """
        norm_a = cls.normalize_company_name(name_a)
        norm_b = cls.normalize_company_name(name_b)

        if not norm_a or not norm_b:
            return 0.0

        if norm_a == norm_b:
            return 1.0

        seq_ratio = SequenceMatcher(None, norm_a, norm_b).ratio()

        tokens_a = set(norm_a.split())
        tokens_b = set(norm_b.split())
        if tokens_a and tokens_b:
            intersection = tokens_a.intersection(tokens_b)
            union = tokens_a.union(tokens_b)
            jaccard = len(intersection) / len(union)
        else:
            jaccard = 0.0

        # Weighted composite score
        composite = (seq_ratio * 0.6) + (jaccard * 0.4)
        return round(composite, 3)

    @classmethod
    def check_duplicate(
        cls,
        candidate_name: str,
        candidate_country: str,
        candidate_reg_no: Optional[str],
        candidate_domain: Optional[str],
        existing_name: str,
        existing_country: str,
        existing_reg_no: Optional[str],
        existing_domain: Optional[str],
    ) -> Tuple[bool, float, List[str]]:
        """
        Evaluates whether a candidate is a duplicate of an existing record.
        Returns: (is_duplicate, similarity_score, match_reasons)
        """
        match_reasons = []

        # 1. Official Registration Number match in same jurisdiction (Hard Match)
        if (
            candidate_reg_no
            and existing_reg_no
            and candidate_reg_no.strip().upper() == existing_reg_no.strip().upper()
            and candidate_country.strip().upper() == existing_country.strip().upper()
        ):
            match_reasons.append(f"Exact match on official registration number '{candidate_reg_no}' in {candidate_country}")
            return True, 1.0, match_reasons

        # 2. Canonical Domain Match (Hard Match if same country or global parent)
        norm_domain_cand = cls.normalize_domain(candidate_domain)
        norm_domain_exist = cls.normalize_domain(existing_domain)

        domain_matched = False
        if norm_domain_cand and norm_domain_exist and norm_domain_cand == norm_domain_exist:
            domain_matched = True
            match_reasons.append(f"Identical official root domain '{norm_domain_cand}'")

        # 3. Normalized Name Similarity
        name_sim = cls.calculate_name_similarity(candidate_name, existing_name)
        same_country = candidate_country.strip().upper() == existing_country.strip().upper()

        if domain_matched and same_country:
            match_reasons.append(f"Same root domain and operating country ({candidate_country})")
            return True, 0.98, match_reasons

        if domain_matched and name_sim >= 0.85:
            match_reasons.append(f"Matching domain and high name similarity ({name_sim:.2f})")
            return True, 0.95, match_reasons

        if same_country and name_sim >= 0.92:
            match_reasons.append(f"Very high name similarity ({name_sim:.2f}) in same country ({candidate_country})")
            return True, name_sim, match_reasons

        if name_sim >= 0.80 and same_country:
            # Borderline candidate for manual review
            match_reasons.append(f"Potential duplicate: name similarity {name_sim:.2f} in {candidate_country}")
            return False, name_sim, match_reasons

        return False, name_sim, match_reasons

