from bs4 import BeautifulSoup
import re
from typing import List, Dict, Any, Optional

US_STATE_NAMES = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
    "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
    "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
    "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
    "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
    "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
}
REVERSE_STATES = {v.lower(): v for k, v in US_STATE_NAMES.items()}
STATE_ABBRS = {k.lower(): v for k, v in US_STATE_NAMES.items()}

class DirectoryHTMLParser:
    """Parser for directory listings and corporate profile pages."""

    @staticmethod
    def parse_listing_page(html: str) -> List[Dict[str, Any]]:
        """Parses company result cards from A3 listing HTML."""
        soup = BeautifulSoup(html, "html.parser")
        items = soup.select(".itemFlex .item")
        results = []

        for item in items:
            name_elem = item.select_one("h3 a")
            if not name_elem:
                name_elem = item.select_one("a[title*='Company Profile']")
            if not name_elem:
                continue

            company_name = name_elem.get_text().strip()
            profile_url = name_elem.get("href", "").strip()
            if not profile_url.startswith("http"):
                profile_url = f"https://www.automate.org{profile_url}" if profile_url.startswith("/") else profile_url

            loc_elem = item.select_one(".companyLocation")
            loc_str = loc_elem.get_text().strip() if loc_elem else ""

            city, state, country = DirectoryHTMLParser.parse_location_string(loc_str)

            # Check category badges or classes
            classes = item.get("class", [])
            tag = "General Automation"
            if any("robotics" in c.lower() for c in classes):
                tag = "Robotics"
            elif any("vision" in c.lower() for c in classes):
                tag = "Vision & Components"
            elif any("motion" in c.lower() for c in classes):
                tag = "Motion Control"
            elif any("ai" in c.lower() for c in classes):
                tag = "Artificial Intelligence"

            results.append({
                "company_name": company_name,
                "company_profile_url": profile_url,
                "city": city,
                "state": state,
                "country": country,
                "raw_location": loc_str,
                "category_tag": tag
            })
        return results

    @staticmethod
    def parse_location_string(loc_str: str) -> tuple[str, str, str]:
        """Parses a location string into (city, state, country)."""
        if not loc_str:
            return "", "", ""

        parts = [p.strip() for p in loc_str.split(",") if p.strip()]
        city = ""
        state = ""
        country = "United States"

        if len(parts) >= 3:
            city = parts[0]
            candidate_state = parts[1].strip()
            country = parts[-1].strip()
            state = DirectoryHTMLParser.normalize_state(candidate_state)
        elif len(parts) == 2:
            candidate_state = parts[0].strip()
            country = parts[1].strip()
            state = DirectoryHTMLParser.normalize_state(candidate_state)
            if not state:
                city = candidate_state
        elif len(parts) == 1:
            state = DirectoryHTMLParser.normalize_state(parts[0])
            if not state:
                city = parts[0]

        return city, state, country

    @staticmethod
    def normalize_state(raw: str) -> str:
        """Normalizes state string or postal code to full canonical state name."""
        if not raw:
            return ""
        clean = raw.strip()
        # Direct full name match
        if clean.lower() in REVERSE_STATES:
            return REVERSE_STATES[clean.lower()]
        # 2-letter abbreviation
        if clean.upper() in US_STATE_NAMES:
            return US_STATE_NAMES[clean.upper()]
        # Contained inside string (e.g. "Orion, MI 48359")
        for abbr, full_name in US_STATE_NAMES.items():
            pattern = rf"\b{abbr}\b"
            if re.search(pattern, clean, re.IGNORECASE):
                return full_name
        for full_name in REVERSE_STATES.values():
            if full_name.lower() in clean.lower():
                return full_name
        return clean

    @staticmethod
    def parse_profile_page(html: str) -> Dict[str, Any]:
        """Extracts deep corporate attributes from individual profile HTML."""
        soup = BeautifulSoup(html, "html.parser")
        details = {
            "official_website": "",
            "contact_phone": "",
            "street_address": "",
            "city": "",
            "state": "",
            "country": "United States",
            "description": "",
            "products_or_services": ""
        }

        # 1. Official Website
        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            txt = a.get_text().strip().lower()
            if "visit website" in txt or "company website" in txt:
                details["official_website"] = href
                break
        if not details["official_website"]:
            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                if href.startswith("http") and not any(d in href for d in ["automate.org", "automateshow.com", "linkedin.com", "twitter.com", "facebook.com", "youtube.com", "aimg.com"]):
                    details["official_website"] = href
                    break

        # 2. Phone Number
        text_content = soup.get_text()
        phone_match = re.search(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text_content)
        if phone_match:
            details["contact_phone"] = phone_match.group(0).strip()

        # 3. Address parsing
        street_suffixes = ["dr", "drive", "rd", "road", "st", "street", "ave", "avenue", "blvd", "boulevard", "way", "pkwy", "parkway", "hwy", "highway", "lane", "ln", "ct", "court", "plz", "plaza", "circle", "cir", "suite", "ste"]
        for elem in soup.find_all(["p", "div", "address"]):
            t = elem.get_text(" ", strip=True)
            if "United States" in t and len(t) < 250:
                if any(x.lower() in t.lower() for x in [" ave", " st", " rd", " blvd", " way", " dr", " suite", " parkway", " hwy", " industrial", " plaza"]):
                    # Extract city, state, zip pattern
                    m = re.search(r"([A-Za-z0-9\s\.\#\-]+),\s*([A-Za-z]{2})\s+(\d{5}(?:-\d{4})?)", t)
                    if m:
                        before_comma = m.group(1).strip()
                        words = before_comma.split()
                        split_idx = -1
                        for i, w in enumerate(words):
                            if w.lower().strip(".,") in street_suffixes:
                                split_idx = i
                        if split_idx != -1 and split_idx < len(words) - 1:
                            details["city"] = " ".join(words[split_idx+1:])
                        elif words:
                            details["city"] = words[-1]

                        abbr = m.group(2).upper()
                        details["state"] = US_STATE_NAMES.get(abbr, abbr)
                    details["street_address"] = t
                    break

        # 4. Description
        desc_candidates = []
        for p in soup.find_all("p"):
            t = p.get_text(" ", strip=True)
            if len(t) > 100 and not any(skip in t.lower() for skip in ["cookie", "privacy", "copyright", "terms of use", "rights reserved"]):
                desc_candidates.append(t)
        if desc_candidates:
            details["description"] = " ".join(desc_candidates[:2])

        # 5. Products / Services / Badges
        tags = []
        for li in soup.find_all(["li", "span", "badge"]):
            txt = li.get_text().strip()
            if txt and 3 < len(txt) < 60 and any(kw in txt.lower() for kw in [
                "robot", "automation", "integrator", "control", "system", "sensor", "vision",
                "motor", "drive", "software", "scara", "cobot", "machine", "linear", "amr"
            ]):
                tags.append(txt)
        if tags:
            # Dedup preserving order
            seen = set()
            clean_tags = [x for x in tags if not (x in seen or seen.add(x))]
            details["products_or_services"] = "; ".join(clean_tags[:6])

        return details
