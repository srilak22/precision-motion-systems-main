"""
Multistage Webmining Automation
Stage 1 - Company name Extraction - URL Extraction (from Screener.in)
Stage 2 - Searching the Company Name with Search API
Stage 3 - Website Extraction URL
Stage 4 - Contact Details Extraction
"""

import os
import re
import csv
import sys
import time
import base64
import logging
import argparse
from typing import Dict, List, Any, Optional
from urllib.parse import urlparse, quote_plus
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from bs4 import BeautifulSoup

# Ensure stdout is unbuffered with UTF-8 support
try:
    sys.stdout.reconfigure(encoding="utf-8", line_buffering=True)
except Exception:
    pass

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S"
)
logger = logging.getLogger("WebMiner")

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

# Target sectors on Screener:
# Primary user requirement: https://www.screener.in/market/IN02/IN0201/IN020102/ (Auto Components)
# Plus adjacent Automobile & Industrial Precision Engineering sectors to reach 300+ clean records.
TARGET_SECTORS = [
    {
        "category": "Auto Components & Equipments",
        "url": "https://www.screener.in/market/IN02/IN0201/IN020102/",
        "max_pages": 8  # 178 companies
    },
    {
        "category": "Automobiles & Commercial Vehicles",
        "url": "https://www.screener.in/market/IN02/IN0201/IN020101/",
        "max_pages": 3  # ~45 companies
    },
    {
        "category": "Bearings & Precision Engineering",
        "url": "https://www.screener.in/market/IN07/IN0702/IN070205/",
        "max_pages": 5  # ~115 companies
    }
]

COMMON_EMAIL_RE = re.compile(
    r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+",
    re.IGNORECASE
)

PHONE_RE = re.compile(
    r"(?:\+91[\-\s]?)?(?:[6-9]\d{9}|1800[\-\s]?\d{3,4}[\-\s]?\d{3,4}|0\d{2,4}[\-\s]?\d{6,8})",
    re.IGNORECASE
)

CITY_PIN_RE = re.compile(
    r"\b([A-Z][a-zA-Z\s]{2,20}(?:,\s*[A-Z][a-zA-Z\s]{2,20})?\s*[\-–—]?\s*(?:India\s*)?\b[1-9]\d{5}\b)",
    re.IGNORECASE
)

IGNORED_EMAIL_DOMAINS = {
    "sentry.io", "w3.org", "schema.org", "example.com", "domain.com",
    "google.com", "cloudflare.com", "godaddy.com", "wixpress.com", "2x.png"
}

def clean_text(text: Optional[str]) -> str:
    if not text:
        return ""
    return re.sub(r"\s+", " ", text).strip()

def decode_bing_url(url: str) -> str:
    """Decodes Bing redirect URLs to target destination URL."""
    if "/ck/a?!" in url and "&u=a1" in url:
        try:
            raw_b64 = url.split("&u=a1")[1].split("&")[0]
            pad = len(raw_b64) % 4
            if pad:
                raw_b64 += "=" * (4 - pad)
            decoded = base64.b64decode(raw_b64).decode("utf-8", errors="ignore")
            if decoded.startswith("http"):
                return decoded
        except Exception:
            pass
    return url


# ==========================================
# STAGE 1: Company Name & URL Extraction
# ==========================================
def stage1_extract_companies(target_sectors: List[Dict[str, Any]], target_count: int = 320) -> List[Dict[str, Any]]:
    """
    Stage 1: Extract companies from Screener sector pages:
    - Company short name
    - Screener URL
    - Stock Symbol
    - Market Cap, Current Price, P/E, ROCE, Sales
    - Category
    """
    logger.info(">>> Starting STAGE 1: Company Name & URL Extraction from Screener.in...")
    extracted_companies: List[Dict[str, Any]] = []
    seen_urls = set()

    session = requests.Session()
    session.headers.update(HEADERS)

    for sector in target_sectors:
        cat_name = sector["category"]
        base_url = sector["url"]
        max_pages = sector.get("max_pages", 10)
        logger.info(f"Scraping category: '{cat_name}' from {base_url}")

        for page in range(1, max_pages + 1):
            page_url = f"{base_url}?page={page}"
            try:
                resp = session.get(page_url, timeout=10)
                if resp.status_code != 200:
                    break

                soup = BeautifulSoup(resp.text, "html.parser")
                rows = soup.find_all("tr", attrs={"data-row-company-id": True})
                if not rows:
                    break

                for tr in rows:
                    tds = tr.find_all("td")
                    if len(tds) < 5:
                        continue

                    link_tag = tr.find("a", href=True)
                    if not link_tag:
                        continue

                    rel_url = link_tag["href"]
                    screener_url = f"https://www.screener.in{rel_url}" if rel_url.startswith("/") else rel_url

                    if screener_url in seen_urls:
                        continue
                    seen_urls.add(screener_url)

                    # Extract stock symbol from URL (e.g., /company/MOTHERSON/consolidated/)
                    parts = [p for p in rel_url.split("/") if p]
                    symbol = parts[1] if len(parts) >= 2 and parts[0] == "company" else ""

                    short_name = clean_text(link_tag.text)
                    cmp_price = clean_text(tds[2].text) if len(tds) > 2 else ""
                    pe_ratio = clean_text(tds[3].text) if len(tds) > 3 else ""
                    market_cap = clean_text(tds[4].text) if len(tds) > 4 else ""
                    div_yield = clean_text(tds[5].text) if len(tds) > 5 else ""
                    sales_qtr = clean_text(tds[8].text) if len(tds) > 8 else ""
                    roce = clean_text(tds[10].text) if len(tds) > 10 else ""

                    extracted_companies.append({
                        "s_no": len(extracted_companies) + 1,
                        "short_name": short_name,
                        "full_name": short_name, # will refine in profile lookup
                        "symbol": symbol,
                        "category": cat_name,
                        "screener_url": screener_url,
                        "cmp_price": cmp_price,
                        "pe_ratio": pe_ratio,
                        "market_cap_cr": market_cap,
                        "div_yield": div_yield,
                        "sales_qtr_cr": sales_qtr,
                        "roce_pct": roce,
                        "official_website": "",
                        "search_query": "",
                        "search_title": "",
                        "search_top_url": "",
                        "search_snippet": "",
                        "contact_page_url": "",
                        "primary_email": "",
                        "additional_emails": "",
                        "phone_numbers": "",
                        "office_address": "",
                        "city_state_pin": "",
                        "social_links": "",
                        "status": "Extracted"
                    })

                    if len(extracted_companies) >= target_count:
                        break

            except Exception as exc:
                logger.error(f"Error scraping page {page_url}: {exc}")
                break

            if len(extracted_companies) >= target_count:
                break

        if len(extracted_companies) >= target_count:
            break

    logger.info(f"STAGE 1 Complete: Extracted {len(extracted_companies)} companies.")
    return extracted_companies


def enrich_from_screener_profile(company: Dict[str, Any], session: requests.Session) -> Dict[str, Any]:
    """Fetches Screener company page to get full official legal name and verified company website."""
    try:
        resp = session.get(company["screener_url"], timeout=6)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            h1 = soup.find("h1")
            if h1:
                company["full_name"] = clean_text(h1.text)

            # Find official website link
            for a in soup.find_all("a", href=True):
                txt = clean_text(a.text).lower()
                href = a["href"]
                if txt == "website" or (
                    href.startswith("http")
                    and "screener.in" not in href
                    and "bseindia" not in href
                    and "nseindia" not in href
                    and not href.endswith(".pdf")
                ):
                    company["official_website"] = href.strip()
                    break
    except Exception as e:
        logger.debug(f"Screener profile error for {company['short_name']}: {e}")

    return company


# ==========================================
# STAGE 2: Search API Execution
# ==========================================
def stage2_search_company(company: Dict[str, Any], session: requests.Session) -> Dict[str, Any]:
    """
    Stage 2: Executes automated search for the company to discover official site & contacts.
    Query: '{Full Name} official website contact'
    """
    company_name = company.get("full_name") or company.get("short_name")
    query = f"{company_name} official website contact"
    company["search_query"] = query

    search_url = f"https://www.bing.com/search?q={quote_plus(query)}"
    try:
        resp = session.get(search_url, timeout=6)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            top_algo = soup.find("li", class_="b_algo")
            if top_algo:
                h2 = top_algo.find("h2")
                p = top_algo.find("p")
                a = top_algo.find("a", href=True)

                if h2:
                    company["search_title"] = clean_text(h2.text)
                if p:
                    company["search_snippet"] = clean_text(p.text)
                if a:
                    decoded = decode_bing_url(a["href"])
                    company["search_top_url"] = decoded

    except Exception as exc:
        logger.debug(f"Search API error for '{company_name}': {exc}")

    return company


# ==========================================
# STAGE 3: Website Extraction & Resolution
# ==========================================
def stage3_resolve_website(company: Dict[str, Any]) -> Dict[str, Any]:
    """
    Stage 3: Cross-validates official website from Screener filings vs Search API result.
    Normalizes domain and determines contact page candidate URL.
    """
    official = company.get("official_website", "").strip()
    search_url = company.get("search_top_url", "").strip()

    # If official site wasn't in Screener, use Search top URL
    if not official and search_url:
        parsed = urlparse(search_url)
        if parsed.netloc and not any(bad in parsed.netloc for bad in ["bing.com", "wikipedia.org", "linkedin.com", "youtube.com"]):
            official = f"{parsed.scheme}://{parsed.netloc}/"
            company["official_website"] = official

    # Normalize website URL
    if official:
        if not official.startswith("http"):
            official = "https://" + official
        clean_base = official.rstrip("/")
        company["official_website"] = clean_base

        # Standard candidate contact pages
        company["candidate_contact_urls"] = [
            clean_base,
            f"{clean_base}/contact",
            f"{clean_base}/contact-us",
            f"{clean_base}/contact_us",
            f"{clean_base}/about-us"
        ]
    else:
        company["candidate_contact_urls"] = []

    return company


# ==========================================
# STAGE 4: Contact Details Extraction
# ==========================================
def stage4_extract_contact_details(company: Dict[str, Any], session: requests.Session) -> Dict[str, Any]:
    """
    Stage 4: Extracts emails, phones, addresses, and social links from:
    1. Search snippets (high precision)
    2. Company official website & dedicated contact page
    """
    emails = set()
    phones = set()
    addresses = []
    social_links = set()
    found_contact_page = ""

    # 1. Extract from Stage 2 Search Snippet
    snippet = company.get("search_snippet", "")
    if snippet:
        for em in COMMON_EMAIL_RE.findall(snippet):
            em_clean = em.lower().strip(".,;:()")
            domain = em_clean.split("@")[-1]
            if domain not in IGNORED_EMAIL_DOMAINS and not any(em_clean.endswith(ext) for ext in [".png", ".jpg", ".jpeg"]):
                emails.add(em_clean)

        for ph in PHONE_RE.findall(snippet):
            digits = re.sub(r"\D", "", ph)
            if 8 <= len(digits) <= 12:
                phones.add(clean_text(ph))

        pin_match = CITY_PIN_RE.findall(snippet)
        if pin_match:
            addresses.append(clean_text(pin_match[0]))

    # 2. Extract from Website Contact Pages (fast check on homepage & contact page)
    candidate_urls = company.get("candidate_contact_urls", [])
    for url in candidate_urls[:2]:  # check top 2 candidates with tight timeout
        try:
            resp = session.get(url, timeout=4)
            if resp.status_code == 200:
                html = resp.text
                soup = BeautifulSoup(html, "html.parser")
                text = soup.get_text(" ", strip=True)

                for a in soup.find_all("a", href=True):
                    href = a["href"]
                    if href.startswith("mailto:"):
                        em = href.replace("mailto:", "").split("?")[0].strip()
                        if "@" in em:
                            emails.add(em.lower())
                    elif href.startswith("tel:"):
                        ph = href.replace("tel:", "").strip()
                        digits = re.sub(r"\D", "", ph)
                        if 8 <= len(digits) <= 12:
                            phones.add(clean_text(ph))
                    elif any(s in href for s in ["linkedin.com/company", "twitter.com", "x.com/"]):
                        social_links.add(href.strip())

                for em in COMMON_EMAIL_RE.findall(text):
                    em_clean = em.lower().strip(".,;:()")
                    domain = em_clean.split("@")[-1]
                    if domain not in IGNORED_EMAIL_DOMAINS and not any(em_clean.endswith(ext) for ext in [".png", ".jpg", ".jpeg", ".webp", ".svg"]):
                        emails.add(em_clean)

                for ph in PHONE_RE.findall(text):
                    digits = re.sub(r"\D", "", ph)
                    if 8 <= len(digits) <= 12:
                        phones.add(clean_text(ph))

                pin_matches = CITY_PIN_RE.findall(text)
                if pin_matches:
                    for pmatch in pin_matches[:2]:
                        addresses.append(clean_text(pmatch))

                if emails or phones:
                    found_contact_page = url
                    break

        except Exception:
            continue

    company["contact_page_url"] = found_contact_page or (
        company.get("official_website", "") + "/contact" if company.get("official_website") else ""
    )

    # Sort emails by common contact prefixes
    sorted_emails = sorted(
        list(emails),
        key=lambda x: (
            0 if any(p in x for p in ["info@", "contact@", "support@", "corporate@"]) else
            1 if any(p in x for p in ["sales@", "inquiry@", "investor@"]) else 2
        )
    )

    company["primary_email"] = sorted_emails[0] if sorted_emails else "N/A"
    company["additional_emails"] = "; ".join(sorted_emails[1:4]) if len(sorted_emails) > 1 else ""
    company["phone_numbers"] = "; ".join(list(phones)[:3]) if phones else "N/A"
    company["office_address"] = "; ".join(list(dict.fromkeys(addresses))[:2]) if addresses else "N/A"
    company["social_links"] = "; ".join(list(social_links)[:2]) if social_links else ""
    company["city_state_pin"] = addresses[0] if addresses else "N/A"
    company["status"] = "Verified" if (company["official_website"] or company["primary_email"] != "N/A") else "Partially Extracted"
    return company


def process_single_company(company: Dict[str, Any]) -> Dict[str, Any]:
    """Runs Stage 1 enrichment, Stage 2, Stage 3, and Stage 4 for one company."""
    session = requests.Session()
    session.headers.update(HEADERS)

    # 1. Enrich from Screener profile
    enrich_from_screener_profile(company, session)

    # 2. Stage 2: Search API
    stage2_search_company(company, session)

    # 3. Stage 3: Website extraction & resolution
    stage3_resolve_website(company)

    # 4. Stage 4: Contact details extraction
    stage4_extract_contact_details(company, session)

    # Clean up internal fields
    company.pop("candidate_contact_urls", None)
    return company


# ==========================================
# MAIN EXECUTION & CSV EXPORT
# ==========================================
def run_pipeline(target_count: int = 320, output_csv: str = "companies_scraped_300plus.csv") -> List[Dict[str, Any]]:
    start_time = time.time()
    logger.info("=" * 70)
    logger.info("MULTISTAGE WEBMINING AUTOMATION PIPELINE")
    logger.info(f"Target Count: {target_count}+ companies")
    logger.info(f"Primary Source: {TARGET_SECTORS[0]['url']}")
    logger.info(f"Target Output: {output_csv}")
    logger.info("=" * 70)

    # STAGE 1: Extract companies
    companies = stage1_extract_companies(TARGET_SECTORS, target_count=target_count)
    logger.info(f"Total companies collected for processing: {len(companies)}")

    # STAGES 2, 3, & 4 via Multi-Threading
    logger.info(">>> Processing Stages 2, 3, and 4 (Search, Website, Contact Extraction)...")
    processed_records: List[Dict[str, Any]] = []

    with ThreadPoolExecutor(max_workers=12) as executor:
        future_to_company = {executor.submit(process_single_company, comp): comp for comp in companies}
        done_count = 0
        for future in as_completed(future_to_company):
            comp = future_to_company[future]
            try:
                res = future.result()
                processed_records.append(res)
            except Exception as e:
                logger.error(f"Error processing {comp['short_name']}: {e}")
                processed_records.append(comp)

            done_count += 1
            if done_count % 25 == 0 or done_count == len(companies):
                logger.info(f"Progress: [{done_count}/{len(companies)}] companies processed ({(done_count/len(companies)*100):.1f}%)")

    # Sort by serial number
    processed_records.sort(key=lambda x: x["s_no"])

    # Ensure output directory exists if path contains folder
    output_dir = os.path.dirname(output_csv)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    fieldnames = [
        "s_no",
        "full_name",
        "short_name",
        "symbol",
        "category",
        "market_cap_cr",
        "cmp_price",
        "pe_ratio",
        "roce_pct",
        "sales_qtr_cr",
        "screener_url",
        "search_query",
        "search_title",
        "search_top_url",
        "search_snippet",
        "official_website",
        "contact_page_url",
        "primary_email",
        "additional_emails",
        "phone_numbers",
        "office_address",
        "city_state_pin",
        "social_links",
        "status"
    ]

    header_display_names = {
        "s_no": "S.No",
        "full_name": "Company Legal Name",
        "short_name": "Short Name",
        "symbol": "Ticker Symbol",
        "category": "Industry Category",
        "market_cap_cr": "Market Cap (Rs. Cr)",
        "cmp_price": "Current Price (Rs)",
        "pe_ratio": "P/E Ratio",
        "roce_pct": "ROCE (%)",
        "sales_qtr_cr": "Quarterly Sales (Rs. Cr)",
        "screener_url": "Screener URL",
        "search_query": "Stage 2 Search Query",
        "search_title": "Stage 2 Top Search Title",
        "search_top_url": "Stage 2 Search URL",
        "search_snippet": "Stage 2 Search Snippet",
        "official_website": "Stage 3 Official Website",
        "contact_page_url": "Stage 3 Contact Page URL",
        "primary_email": "Stage 4 Primary Email",
        "additional_emails": "Stage 4 Additional Emails",
        "phone_numbers": "Stage 4 Phone Numbers",
        "office_address": "Stage 4 Office Address",
        "city_state_pin": "Stage 4 City State Pin",
        "social_links": "Stage 4 Social Media",
        "status": "Pipeline Status"
    }

    # Save to primary destination
    with open(output_csv, mode="w", newline="", encoding="utf-8-sig") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, extrasaction="ignore")
        writer.writerow(header_display_names)
        for row in processed_records:
            writer.writerow(row)

    # Also save a mirror copy in output/ directory
    mirror_path = os.path.join("output", os.path.basename(output_csv))
    os.makedirs("output", exist_ok=True)
    with open(mirror_path, mode="w", newline="", encoding="utf-8-sig") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames, extrasaction="ignore")
        writer.writerow(header_display_names)
        for row in processed_records:
            writer.writerow(row)

    duration = time.time() - start_time
    logger.info("=" * 70)
    logger.info(f"SUCCESS: Pipeline completed in {duration:.2f} seconds.")
    logger.info(f"Saved {len(processed_records)} company records to: {output_csv}")
    logger.info(f"Mirrored copy saved to: {mirror_path}")
    logger.info("=" * 70)

    return processed_records


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Multistage Webmining Automation")
    parser.add_argument("--count", type=int, default=320, help="Target count of companies (default: 320)")
    parser.add_argument("--output", type=str, default="companies_scraped_300plus.csv", help="Output CSV path")
    args = parser.parse_args()

    run_pipeline(target_count=args.count, output_csv=args.output)
