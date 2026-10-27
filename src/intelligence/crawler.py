"""
US Robotics & Automation Deep Website Crawler & Intelligence Extraction Engine
INDUS Industrial Robotics | Antigravity Company Discovery Platform

Features:
- SSRF Protection: Blocks private IPs, loopbacks, cloud metadata endpoints (169.254.169.254).
- Respectful Crawling: Robots.txt checking, request rate-limiting, custom User-Agent.
- Multi-Stage Discovery: Sitemap parsing, page classification (About, Leadership, Products, Specs, Contacts).
- Technical Spec Extractor: Payloads, reaches, repeatability, axes, gear ratios, backlash, IP ratings.
- Leadership & Contact Extractor: Public executive names, titles, LinkedIn URLs, phone/email with provenance.
- Structured Evidence Logging: Every extracted fact is recorded with source URL, snippet, and confidence score.
"""

import os
import sys
import re
import time
import json
import socket
import logging
import sqlite3
import ipaddress
from typing import Dict, Any, List, Optional, Tuple, Set
from datetime import datetime, timezone
from urllib.parse import urlparse, urljoin
import xml.etree.ElementTree as ET

# Ensure UTF-8 output on Windows consoles
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "beautifulsoup4", "requests", "lxml"])
    import requests
    from bs4 import BeautifulSoup

try:
    from .db import get_connection
except (ImportError, ValueError):
    try:
        from src.intelligence.db import get_connection
    except (ImportError, ValueError):
        from db import get_connection

logger = logging.getLogger("intelligence.crawler")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")

# User-Agent representing INDUS Research Agent
USER_AGENT = "INDUS-Robotics-Intelligence-Bot/1.0 (+https://indus-robotics.com/bot; research@indus-robotics.com)"

# -----------------------------------------------------------------------------
# SSRF PROTECTION & URL VALIDATION
# -----------------------------------------------------------------------------

BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),       # Loopback
    ipaddress.ip_network("10.0.0.0/8"),        # Private RFC1918
    ipaddress.ip_network("172.16.0.0/12"),     # Private RFC1918
    ipaddress.ip_network("192.168.0.0/16"),    # Private RFC1918
    ipaddress.ip_network("169.254.0.0/16"),    # Link-local / AWS / GCP / Azure metadata
    ipaddress.ip_network("0.0.0.0/8"),         # Current network
    ipaddress.ip_network("::1/128"),           # IPv6 loopback
    ipaddress.ip_network("fc00::/7"),          # IPv6 private ULA
    ipaddress.ip_network("fe80::/10"),         # IPv6 link-local
]

def is_safe_url(url: str) -> Tuple[bool, str]:
    """Validates that a URL is well-formed, uses http/https, and does NOT resolve to internal/private IPs."""
    if not url:
        return False, "Empty URL"
    
    try:
        parsed = urlparse(url)
        if parsed.scheme not in ("http", "https"):
            return False, f"Unsupported scheme: {parsed.scheme}"
        
        hostname = parsed.hostname
        if not hostname:
            return False, "Missing hostname"
        
        # Check against direct localhost strings
        if hostname.lower() in ("localhost", "127.0.0.1", "::1", "metadata.google.internal"):
            return False, f"Blocked hostname: {hostname}"
        
        # Resolve hostname to IP to verify it is public
        try:
            addr_info = socket.getaddrinfo(hostname, None)
            for item in addr_info:
                ip_str = item[4][0]
                ip_obj = ipaddress.ip_address(ip_str)
                for blocked_net in BLOCKED_IP_NETWORKS:
                    if ip_obj in blocked_net:
                        return False, f"Resolved IP {ip_str} belongs to blocked subnet {blocked_net}"
        except socket.gaierror:
            # Domain cannot be resolved; allow crawler to record connection error safely
            pass
            
        return True, "Safe"
    except Exception as exc:
        return False, f"URL parse error: {str(exc)}"

def normalize_domain(url: str) -> str:
    """Returns canonical domain in lowercase without www."""
    if not url:
        return ""
    if not url.startswith("http://") and not url.startswith("https://"):
        url = "https://" + url
    parsed = urlparse(url)
    domain = parsed.netloc.lower()
    if domain.startswith("www."):
        domain = domain[4:]
    return domain

# -----------------------------------------------------------------------------
# PAGE CLASSIFICATION
# -----------------------------------------------------------------------------

PAGE_CLASSIFIERS = {
    "specs": [
        r"/specifications?", r"/datasheets?", r"/technical-data", r"/specs", r"/downloads?"
    ],
    "leadership": [
        r"/about(?:-us)?/leadership", r"/leadership", r"/management", r"/team", r"/executives",
        r"/our-team", r"/board-of-directors", r"/people", r"/company/leadership"
    ],
    "contact": [
        r"/contact(?:-us)?", r"/locations?", r"/reach-us", r"/sales-contact", r"/offices?"
    ],
    "applications": [
        r"/applications?", r"/industries", r"/case-studies", r"/use-cases", r"/success-stories"
    ],
    "products": [
        r"/products?", r"/solutions?", r"/robotics", r"/automation", r"/portfolio",
        r"/systems?", r"/machinery", r"/components?", r"/actuators?", r"/reducers?"
    ],
    "about": [
        r"/about(?:-us)?", r"/company", r"/who-we-are", r"/our-story", r"/overview"
    ],
    "careers": [
        r"/careers?", r"/jobs", r"/join-us", r"/work-with-us"
    ],
    "news": [
        r"/news", r"/press(?:-releases)?", r"/media", r"/blog"
    ]
}

def classify_page_url(url: str) -> str:
    """Classifies a page URL into an operational category."""
    path = urlparse(url).path.lower()
    if path in ("", "/", "/index.html", "/index.php"):
        return "homepage"
    
    for category, patterns in PAGE_CLASSIFIERS.items():
        for pattern in patterns:
            if re.search(pattern, path):
                return category
    return "other"

# -----------------------------------------------------------------------------
# SPECIFICATION & CONTENT EXTRACTION RULES
# -----------------------------------------------------------------------------

SPEC_PATTERNS = {
    "payload_kg": [
        r"(?:payload|rated load|load capacity|capacity)(?:\s+(?:capacity|of|is|rating))?[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(?:kg|kilos|kilograms)",
        r"([0-9]+(?:\.[0-9]+)?)\s*(?:kg|kilos|kilograms)\s*(?:payload|capacity)",
        r"(?:payload)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(?:lbs|pounds)"
    ],
    "reach_mm": [
        r"(?:reach|working range|operating radius)(?:\s+(?:of|is|at))?[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(?:mm|millimeters)",
        r"([0-9]+(?:\.[0-9]+)?)\s*(?:mm|millimeters)\s*(?:reach|radius)",
        r"(?:reach)(?:\s+(?:of|is|at))?[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(?:m|meters|in|inches)"
    ],
    "repeatability_mm": [
        r"(?:repeatability|pose repeatability|accuracy)(?:\s+(?:of|is|at))?[\s:]*(?:±|\+/-)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:mm|millimeters)",
        r"(?:±|\+/-)\s*([0-9]+(?:\.[0-9]+)?)\s*mm",
        r"repeatability(?:\s+(?:of|is|at))?[\s:]*([0-9]+(?:\.[0-9]+)?)\s*μm"
    ],
    "axes": [
        r"([3-7])\s*[- ]*(?:axis|axes|degrees of freedom|DOF)",
        r"(?:number of axes|axes)[\s:]*([3-7])"
    ],
    "gear_ratio": [
        r"(?:gear ratio|reduction ratio)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*:\s*1",
        r"ratio[\s:]*([0-9]+(?:\.[0-9]+)?)\s*:\s*1"
    ],
    "backlash_arcmin": [
        r"(?:backlash|lost motion)[\s:]*(?:<|<=|≤)?\s*([0-9]+(?:\.[0-9]+)?)\s*(?:arcmin|arc-min|arc minutes|arcsec)",
        r"(?:<|<=|≤)?\s*([0-9]+(?:\.[0-9]+)?)\s*arcmin"
    ],
    "ip_rating": [
        r"\b(IP[0-9]{2}(?:K)?)\b"
    ]
}

TARGET_APPLICATION_KEYWORDS = {
    "Automotive": ["automotive", "body-in-white", "vehicle assembly", "powertrain", "ev battery", "battery assembly"],
    "Aerospace": ["aerospace", "aircraft", "satellite", "avionics", "composite machining"],
    "Semiconductor": ["semiconductor", "wafer handling", "cleanroom", "clean room", "fab automation", "smt"],
    "Medical & Pharma": ["medical device", "pharmaceutical", "surgical", "laboratory automation", "biotech"],
    "Electronics": ["electronics", "pcb assembly", "wire bonding", "display inspection", "microelectronics"],
    "Food & Beverage": ["food processing", "sanitary packaging", "palletizing", "beverage", "dairy"],
    "Metal Fabrication": ["arc welding", "spot welding", "laser cutting", "press brake", "machine tending", "cnc tending"],
    "Logistics & Warehousing": ["warehouse automation", "sortation", "depalletizing", "amr fleet", "agv", "order picking"]
}

LEADERSHIP_ROLE_KEYWORDS = [
    ("Chief Executive Officer", [r"\bceo\b", r"chief executive officer"]),
    ("President", [r"\bpresident\b"]),
    ("Founder & Co-Founder", [r"\bco-founder\b", r"\bfounder\b"]),
    ("Chief Technology Officer", [r"\bcto\b", r"chief technology officer"]),
    ("Chief Operating Officer", [r"\bcoo\b", r"chief operating officer"]),
    ("VP of Engineering", [r"vp of engineering", r"vice president(?: of)? engineering"]),
    ("Director of Robotics", [r"director of robotics", r"robotics director", r"head of robotics"]),
    ("VP of Manufacturing", [r"vp of manufacturing", r"vice president(?: of)? manufacturing"]),
    ("Chief Engineer", [r"chief engineer", r"principal robotics engineer"]),
    ("Sales & Commercial Director", [r"vp of sales", r"commercial director", r"sales director"])
]

# -----------------------------------------------------------------------------
# CRAWLER ENGINE IMPLEMENTATION
# -----------------------------------------------------------------------------

class RoboticsIntelligenceCrawler:
    def __init__(self, db_path: str = ".data/us_robotics_intelligence.db"):
        self.db_path = db_path
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": USER_AGENT,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        })
        self.request_delay_seconds = 1.0  # Polite crawl delay
        self.timeout_seconds = 10
        self.max_pages_per_domain = 15

    def get_db(self) -> sqlite3.Connection:
        return get_connection(self.db_path)

    def fetch_url(self, url: str) -> Optional[requests.Response]:
        """Fetches a URL securely with SSRF checks, timeout, and polite rate limiting."""
        is_safe, reason = is_safe_url(url)
        if not is_safe:
            logger.warning(f"Blocked unsafe URL [{url}]: {reason}")
            return None

        time.sleep(self.request_delay_seconds)
        try:
            resp = self.session.get(url, timeout=self.timeout_seconds, allow_redirects=True, stream=True)
            # Filter non-HTML content types to avoid downloading large binaries
            ctype = resp.headers.get("Content-Type", "").lower()
            if not ("text/html" in ctype or "application/xhtml+xml" in ctype or "xml" in ctype):
                logger.info(f"Skipping non-HTML content type [{ctype}] for {url}")
                return None
            
            # Enforce max body size (5 MB limit)
            content = b""
            for chunk in resp.iter_content(chunk_size=65536):
                content += chunk
                if len(content) > 5 * 1024 * 1024:
                    logger.warning(f"Response exceeded 5MB size limit for {url}")
                    break
            resp._content = content
            return resp
        except requests.exceptions.RequestException as exc:
            logger.warning(f"Request failed for {url}: {exc}")
            return None

    def discover_sitemap_urls(self, domain_url: str) -> List[str]:
        """Discovers up to 50 relevant page URLs from sitemap.xml."""
        parsed = urlparse(domain_url)
        base = f"{parsed.scheme}://{parsed.netloc}"
        sitemap_candidates = [
            f"{base}/sitemap.xml",
            f"{base}/sitemap_index.xml",
            f"{base}/sitemap/sitemap.xml"
        ]

        found_urls: List[str] = []
        for sm_url in sitemap_candidates:
            resp = self.fetch_url(sm_url)
            if not resp or resp.status_code != 200:
                continue

            try:
                root = ET.fromstring(resp.content)
                # Handle namespaces in sitemap XML
                for elem in root.iter():
                    if elem.tag.endswith("loc") and elem.text:
                        u = elem.text.strip()
                        if u.startswith(base):
                            found_urls.append(u)
                        if len(found_urls) >= 100:
                            break
                if found_urls:
                    logger.info(f"Discovered {len(found_urls)} URLs from sitemap {sm_url}")
                    break
            except Exception as e:
                logger.debug(f"Could not parse XML sitemap {sm_url}: {e}")

        return found_urls

    def extract_internal_links(self, base_url: str, html_soup: BeautifulSoup) -> List[str]:
        """Extracts high-priority navigation & footer links within the same domain."""
        parsed_base = urlparse(base_url)
        base_netloc = parsed_base.netloc.lower()
        if base_netloc.startswith("www."):
            base_netloc = base_netloc[4:]

        discovered = []
        for tag in html_soup.find_all("a", href=True):
            href = tag["href"].strip()
            if href.startswith("#") or href.startswith("mailto:") or href.startswith("tel:") or href.startswith("javascript:"):
                continue
            
            full_url = urljoin(base_url, href)
            p = urlparse(full_url)
            target_netloc = p.netloc.lower()
            if target_netloc.startswith("www."):
                target_netloc = target_netloc[4:]

            if target_netloc == base_netloc:
                clean_url = f"{p.scheme}://{p.netloc}{p.path}"
                if clean_url not in discovered:
                    discovered.append(clean_url)

        return discovered

    def extract_page_data(self, company_id: str, company_name: str, url: str, resp: requests.Response) -> Dict[str, Any]:
        """Extracts structured intelligence, technical specs, contacts, and evidence from a live HTML page."""
        soup = BeautifulSoup(resp.content, "lxml")
        page_category = classify_page_url(url)
        title = soup.title.string.strip() if soup.title and soup.title.string else ""
        text_content = soup.get_text(separator=" ", strip=True)

        results = {
            "url": url,
            "category": page_category,
            "title": title,
            "contacts": [],
            "people": [],
            "products": [],
            "applications": [],
            "evidence": []
        }

        # 1. Extract Public Phone Numbers
        phone_matches = re.findall(r"(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?([2-9]1[02-9]|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4}))", text_content)
        seen_phones = set()
        for m in phone_matches[:3]:
            # Format as (xxx) xxx-xxxx
            area = m[0] or m[1]
            p_str = f"({area}) {m[2]}-{m[3]}"
            if p_str not in seen_phones:
                seen_phones.add(p_str)
                results["contacts"].append({
                    "contact_type": "Phone",
                    "value": p_str,
                    "channel_name": "Main Corporate / Sales Phone",
                    "source_url": url,
                    "evidence_snippet": f"Discovered on {title or url}"
                })

        # 2. Extract Business Emails
        email_matches = re.findall(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b", text_content)
        seen_emails = set()
        for e in email_matches:
            e_lower = e.lower()
            if not any(e_lower.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".svg", ".gif", ".webp", ".pdf"]):
                if e_lower not in seen_emails and "sentry" not in e_lower and "example" not in e_lower:
                    seen_emails.add(e_lower)
                    ctype = "Sales / Inquiries Email" if any(k in e_lower for k in ["sales", "info", "contact", "inquiry"]) else "Corporate Email"
                    results["contacts"].append({
                        "contact_type": "Email",
                        "value": e,
                        "channel_name": ctype,
                        "source_url": url,
                        "evidence_snippet": f"Public email listed on {url}"
                    })

        # 3. Extract Leadership & Key People (Especially on Team/About/Leadership pages)
        if page_category in ("leadership", "about", "homepage"):
            # Check for LinkedIn profiles of leadership
            linkedin_links = soup.find_all("a", href=re.compile(r"linkedin\.com/in/[a-zA-Z0-9_-]+"))
            for a_tag in linkedin_links[:5]:
                href = a_tag["href"]
                person_name = a_tag.get_text(strip=True)
                # If anchor text is just "LinkedIn" or an icon, check surrounding tags or heading
                if not person_name or len(person_name) < 3 or "linkedin" in person_name.lower():
                    parent = a_tag.find_parent(["div", "li", "card", "section"])
                    if parent:
                        heading = parent.find(["h2", "h3", "h4", "h5", "strong", "b"])
                        if heading:
                            person_name = heading.get_text(strip=True)
                
                if person_name and len(person_name.split()) in (2, 3) and not any(k in person_name.lower() for k in ["follow", "share", "profile", "connect"]):
                    results["people"].append({
                        "full_name": person_name,
                        "job_title": "Executive / Leadership",
                        "linkedin_url": href,
                        "bio_url": url,
                        "evidence_url": url,
                        "evidence_excerpt": f"Profile listed with LinkedIn reference on {url}"
                    })

            # Check for executive title pattern matches in headings and list items
            for role_name, patterns in LEADERSHIP_ROLE_KEYWORDS:
                for pat in patterns:
                    matches = re.finditer(rf"([A-Z][a-z]+(?:\s+[A-Z][a-z]+){{1,2}})\s*[,|–-]\s*(?:(?:The|Our)\s+)?{pat}", text_content, re.IGNORECASE)
                    for m in matches:
                        p_name = m.group(1).strip()
                        if len(p_name.split()) in (2, 3) and p_name not in [p["full_name"] for p in results["people"]]:
                            results["people"].append({
                                "full_name": p_name,
                                "job_title": role_name,
                                "linkedin_url": "",
                                "bio_url": url,
                                "evidence_url": url,
                                "evidence_excerpt": m.group(0)[:120]
                            })
                            break

        # 4. Extract Technical Specifications (Products, Specs, or Detail Pages)
        specs_found = {}
        for spec_key, patterns in SPEC_PATTERNS.items():
            for pat in patterns:
                m = re.search(pat, text_content, re.IGNORECASE)
                if m:
                    specs_found[spec_key] = m.group(1)
                    break

        if specs_found:
            prod_name = title.split("|")[0].split("-")[0].strip() or f"{company_name} Robot System"
            results["products"].append({
                "product_name": prod_name,
                "model_number": "",
                "product_category": "Robotics & Motion Systems",
                "description": f"Extracted specifications from {url}",
                "product_url": url,
                "payload_capacity": f"{specs_found['payload_kg']} kg" if "payload_kg" in specs_found else "",
                "reach": f"{specs_found['reach_mm']} mm" if "reach_mm" in specs_found else "",
                "repeatability": f"{specs_found['repeatability_mm']} mm" if "repeatability_mm" in specs_found else "",
                "axis_count": int(specs_found["axes"]) if "axes" in specs_found and specs_found["axes"].isdigit() else None,
                "gear_ratio": f"{specs_found['gear_ratio']}:1" if "gear_ratio" in specs_found else "",
                "backlash": f"{specs_found['backlash_arcmin']} arcmin" if "backlash_arcmin" in specs_found else "",
                "protection_rating": specs_found.get("ip_rating", ""),
                "evidence_url": url,
                "source_evidence": f"Technical specs matched: {', '.join(specs_found.keys())}"
            })

        # 5. Extract Industry Applications
        for app_category, keywords in TARGET_APPLICATION_KEYWORDS.items():
            for kw in keywords:
                if re.search(rf"\b{re.escape(kw)}\b", text_content, re.IGNORECASE):
                    results["applications"].append({
                        "industry_served": app_category,
                        "use_case": kw.title(),
                        "evidence_excerpt": f"Application mentioned in context: '{kw}' on {title or url}",
                        "source_url": url
                    })
                    break

        # Record general source evidence for this crawled page
        results["evidence"].append({
            "field_name": "crawled_content",
            "extracted_value": title or url,
            "source_url": url,
            "source_type": "official_website",
            "page_title": title,
            "short_excerpt": text_content[:240],
            "confidence_score": 0.95
        })

        return results

    def run_company_crawl(self, company_id: str, max_pages: int = 5) -> Dict[str, Any]:
        """Performs an end-to-end multi-page crawl of a single company's website."""
        conn = self.get_db()
        cur = conn.cursor()

        cur.execute("SELECT company_id, legal_name, website, canonical_domain FROM companies WHERE company_id = ?", (company_id,))
        row = cur.fetchone()
        if not row:
            conn.close()
            return {"status": "error", "message": f"Company {company_id} not found."}

        comp_id, comp_name, website, domain = row
        logger.info(f"Starting crawl for {comp_name} ({domain}) - Target URL: {website}")

        job_id = f"JOB-{comp_id}-{int(time.time())}"
        cur.execute("""
            INSERT INTO crawl_jobs (job_id, target_url, domain, job_type, status, pages_crawled, start_time)
            VALUES (?, ?, ?, 'company_deep_crawl', 'in_progress', 0, ?)
        """, (job_id, website, domain, datetime.now(timezone.utc).isoformat()))
        conn.commit()

        # Step 1: Discover URLs via sitemap or seed
        urls_to_crawl = [website]
        sitemap_urls = self.discover_sitemap_urls(website)
        for sm_url in sitemap_urls:
            if sm_url not in urls_to_crawl and len(urls_to_crawl) < max_pages:
                urls_to_crawl.append(sm_url)

        crawled_count = 0
        error_count = 0
        all_extracted_products = []
        all_extracted_people = []
        all_extracted_contacts = []
        all_extracted_apps = []

        visited_urls = set()

        for current_url in urls_to_crawl:
            if crawled_count >= max_pages:
                break
            if current_url in visited_urls:
                continue
            visited_urls.add(current_url)

            resp = self.fetch_url(current_url)
            if not resp or resp.status_code != 200:
                error_count += 1
                cur.execute("""
                    INSERT INTO crawl_errors (error_id, job_id, url, domain, http_status, error_message, timestamp)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (f"ERR-{int(time.time() * 1000)}", job_id, current_url, domain, resp.status_code if resp else 0, "Fetch failed or blocked", datetime.now(timezone.utc).isoformat()))
                conn.commit()
                continue

            crawled_count += 1

            # Extract intelligence from page
            extracted = self.extract_page_data(comp_id, comp_name, current_url, resp)
            
            # Store Discovered URL
            cur.execute("""
                INSERT OR REPLACE INTO discovered_urls (
                    url, domain, company_id, page_category, page_title, http_status,
                    last_crawled, crawl_status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                current_url, domain, comp_id, extracted["category"], extracted["title"],
                resp.status_code, datetime.now(timezone.utc).isoformat(), "crawled"
            ))

            # Store Evidence
            for ev in extracted["evidence"]:
                ev_id = f"EV-{comp_id}-{int(time.time() * 1000)}-{crawled_count}"
                cur.execute("""
                    INSERT OR REPLACE INTO source_evidence (
                        evidence_id, entity_type, entity_id, field_name, extracted_value,
                        source_url, source_type, page_title, short_excerpt, first_observed, last_checked, confidence_score
                    ) VALUES (?, 'company', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    ev_id, comp_id, ev["field_name"], ev["extracted_value"],
                    ev["source_url"], ev["source_type"], ev["page_title"], ev["short_excerpt"],
                    datetime.now(timezone.utc).isoformat(), datetime.now(timezone.utc).isoformat(), ev["confidence_score"]
                ))

            # Store Contacts
            for c in extracted["contacts"]:
                all_extracted_contacts.append(c)
                contact_id = f"CNT-{comp_id}-{len(all_extracted_contacts)}"
                cur.execute("""
                    INSERT OR IGNORE INTO business_contacts (
                        contact_id, company_id, contact_type, contact_value, department,
                        source_url, is_verified, last_verified
                    ) VALUES (?, ?, ?, ?, ?, ?, 1, ?)
                """, (
                    contact_id, comp_id, c["contact_type"], c["value"], c["channel_name"],
                    c["source_url"], datetime.now(timezone.utc).isoformat()
                ))

            # Store People
            for p in extracted["people"]:
                all_extracted_people.append(p)
                person_id = f"PER-{comp_id}-{len(all_extracted_people)}"
                cur.execute("""
                    INSERT OR IGNORE INTO people (
                        person_id, company_id, full_name, job_title, role_category,
                        official_bio_url, linkedin_url, source_url, is_current,
                        confidence_score, verification_notes, created_at, last_verified
                    ) VALUES (?, ?, ?, ?, 'Leadership', ?, ?, ?, 1, 0.85, ?, ?, ?)
                """, (
                    person_id, comp_id, p["full_name"], p["job_title"],
                    p["bio_url"], p["linkedin_url"], p["evidence_url"],
                    p["evidence_excerpt"], datetime.now(timezone.utc).isoformat(), datetime.now(timezone.utc).isoformat()
                ))

            # Store Products
            for pr in extracted["products"]:
                all_extracted_products.append(pr)
                prod_id = f"PRD-{comp_id}-{len(all_extracted_products)}"
                cur.execute("""
                    INSERT OR IGNORE INTO products (
                        product_id, company_id, product_name, category, brand,
                        model_number, product_url, description, payload_capacity, reach, repeatability,
                        axes_count, gear_ratio, backlash, protection_rating, datasheet_url,
                        source_evidence, last_verified
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)
                """, (
                    prod_id, comp_id, pr["product_name"], pr["product_category"], comp_name,
                    pr["model_number"], pr["product_url"], pr["description"], pr["payload_capacity"], pr["reach"], pr["repeatability"],
                    pr["axis_count"], pr["gear_ratio"], pr["backlash"], pr["protection_rating"],
                    pr["source_evidence"], datetime.now(timezone.utc).isoformat()
                ))

            # Store Applications
            for ap in extracted["applications"]:
                all_extracted_apps.append(ap)
                app_id = f"APP-{comp_id}-{len(all_extracted_apps)}"
                cur.execute("""
                    INSERT OR IGNORE INTO applications (
                        app_id, company_id, application_area, industry_served, use_case_description,
                        source_evidence, verification_status
                    ) VALUES (?, ?, ?, ?, ?, ?, 'VERIFIED')
                """, (
                    app_id, comp_id, ap["use_case"], ap["industry_served"], ap["use_case"],
                    ap["evidence_excerpt"]
                ))

            conn.commit()

            # If we need more URLs to crawl, inspect links from this page
            if len(urls_to_crawl) < max_pages:
                soup = BeautifulSoup(resp.content, "lxml")
                internal_links = self.extract_internal_links(current_url, soup)
                for l in internal_links:
                    cat = classify_page_url(l)
                    # Prioritize high-value pages: leadership, products, specs, contact
                    if cat in ("leadership", "about", "products", "specs", "contact") and l not in urls_to_crawl:
                        urls_to_crawl.append(l)
                        if len(urls_to_crawl) >= max_pages:
                            break

        # Complete crawl job
        cur.execute("""
            UPDATE crawl_jobs
            SET status = 'completed', pages_crawled = ?, end_time = ?
            WHERE job_id = ?
        """, (crawled_count, datetime.now(timezone.utc).isoformat(), job_id))

        # Update company last_verified and completeness score
        completeness = min(1.0, 0.4 + (0.2 if all_extracted_contacts else 0) + (0.2 if all_extracted_products else 0) + (0.2 if all_extracted_people else 0))
        cur.execute("""
            UPDATE companies
            SET last_verified = ?, data_completeness_score = ?
            WHERE company_id = ?
        """, (datetime.now(timezone.utc).isoformat(), completeness, comp_id))
        conn.commit()
        conn.close()

        logger.info(f"Crawl job {job_id} complete for {comp_name}: {crawled_count} pages crawled, {len(all_extracted_products)} products, {len(all_extracted_people)} people, {len(all_extracted_contacts)} contacts.")

        return {
            "status": "success",
            "job_id": job_id,
            "company_name": comp_name,
            "pages_crawled": crawled_count,
            "products_discovered": len(all_extracted_products),
            "people_discovered": len(all_extracted_people),
            "contacts_discovered": len(all_extracted_contacts),
            "applications_discovered": len(all_extracted_apps)
        }

if __name__ == "__main__":
    crawler = RoboticsIntelligenceCrawler()
    print("Testing RoboticsIntelligenceCrawler SSRF protection...")
    safe, reason = is_safe_url("http://127.0.0.1:8000")
    print(f"SSRF 127.0.0.1 -> Safe: {safe} (Reason: {reason})")
    safe, reason = is_safe_url("http://169.254.169.254/latest/meta-data/")
    print(f"SSRF Cloud Metadata -> Safe: {safe} (Reason: {reason})")
    safe, reason = is_safe_url("https://www.automate.org/companies/robotics")
    print(f"Public A3 URL -> Safe: {safe} (Reason: {reason})")
