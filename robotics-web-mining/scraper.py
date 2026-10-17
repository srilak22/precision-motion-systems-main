"""Rate-limited, robots-aware crawl of official company websites."""

import json
import logging
import re
import time
import urllib.robotparser
import xml.etree.ElementTree as ET
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from urllib.parse import urljoin, urlsplit

import requests

from config import (
    CHECKPOINT_FILE, DEFAULT_DELAY_SECONDS, LOG_DIR, MAX_PAGE_BYTES,
    MAX_CRAWL_WORKERS, MAX_PAGES_PER_SITE, MAX_RETRIES, MAX_SITEMAP_MAPS,
    MAX_SITEMAP_URLS, REQUEST_TIMEOUT_SECONDS,
    USER_AGENT,
)
from exporter import export_results
from extractors import extract_page
from sources import SeedSource
from validators import canonical_domain, canonical_url, valid_company_record


LOG_DIR.mkdir(parents=True, exist_ok=True)
logging.basicConfig(
    filename=LOG_DIR / "robotics_mining.log",
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
)


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


class PoliteCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.5"})
        self.robots: dict[str, urllib.robotparser.RobotFileParser | None] = {}
        self.cache: dict[str, tuple[requests.Response | None, str]] = {}
        self.last_request = 0.0

    def _get(self, url: str) -> tuple[requests.Response | None, str]:
        if url in self.cache:
            return self.cache[url]
        delay = DEFAULT_DELAY_SECONDS - (time.monotonic() - self.last_request)
        if delay > 0:
            time.sleep(delay)
        last_error = "request failed"
        for attempt in range(MAX_RETRIES + 1):
            try:
                response = self.session.get(url, timeout=REQUEST_TIMEOUT_SECONDS, allow_redirects=True, stream=True)
                self.last_request = time.monotonic()
                if int(response.headers.get("Content-Length", "0") or 0) > MAX_PAGE_BYTES:
                    response.close()
                    result = (None, "page exceeds configured size limit")
                else:
                    response.raw.decode_content = True
                    body = response.raw.read(MAX_PAGE_BYTES + 1)
                    if len(body) > MAX_PAGE_BYTES:
                        response.close()
                        result = (None, "page exceeds configured size limit")
                    else:
                        response._content = body
                        response._content_consumed = True
                        result = (response, "")
                self.cache[url] = result
                return result
            except requests.RequestException as exc:
                last_error = f"{type(exc).__name__}: {exc}"
                self.last_request = time.monotonic()
                if attempt < MAX_RETRIES:
                    time.sleep(DEFAULT_DELAY_SECONDS * (attempt + 1))
        result = (None, last_error)
        self.cache[url] = result
        return result

    def _robots_parser(self, url: str) -> urllib.robotparser.RobotFileParser | None:
        parts = urlsplit(url)
        origin = f"{parts.scheme}://{parts.netloc}"
        if origin in self.robots:
            return self.robots[origin]
        robots_url = f"{origin}/robots.txt"
        response, error = self._get(robots_url)
        parser = urllib.robotparser.RobotFileParser(robots_url)
        if response is not None and response.status_code == 404:
            parser.parse([])
        elif response is not None and response.status_code == 200:
            parser.parse(response.text.splitlines())
        else:
            parser = None
            logging.warning("robots policy unavailable for %s: %s", origin, error or (response.status_code if response else "no response"))
        self.robots[origin] = parser
        return parser

    def allowed(self, url: str) -> bool:
        parser = self._robots_parser(url)
        return bool(parser and parser.can_fetch(USER_AGENT, url))

    def get_page(self, url: str) -> tuple[requests.Response | None, str]:
        if not self.allowed(url):
            return None, "robots_disallowed_or_policy_unavailable"
        return self._get(url)


def _sitemap_urls(crawler: PoliteCrawler, seed_url: str) -> list[str]:
    parts = urlsplit(seed_url)
    origin = f"{parts.scheme}://{parts.netloc}"
    parser = crawler._robots_parser(seed_url)
    candidates = list(parser.site_maps() or []) if parser else []
    candidates.append(f"{origin}/sitemap.xml")
    urls = []
    visited_maps = set()
    while candidates and len(urls) < MAX_SITEMAP_URLS and len(visited_maps) < MAX_SITEMAP_MAPS:
        sitemap = candidates.pop(0)
        if sitemap in visited_maps or not crawler.allowed(sitemap):
            continue
        visited_maps.add(sitemap)
        response, _ = crawler._get(sitemap)
        if not response or response.status_code != 200:
            continue
        try:
            root = ET.fromstring(response.content)
        except ET.ParseError:
            continue
        for element in root.iter():
            if element.tag.rsplit("}", 1)[-1] != "loc" or not element.text:
                continue
            location = element.text.strip()
            sitemap_name = urlsplit(location).path.lower().rsplit("/", 1)[-1]
            if location.endswith(".xml") and len(candidates) < MAX_SITEMAP_MAPS and not any(term in sitemap_name for term in ("product", "image", "video", "news")):
                candidates.append(location)
            elif canonical_domain(location) == canonical_domain(seed_url):
                path = urlsplit(location).path.lower()
                if not path.endswith((".pdf", ".xml", "/feed", "/feed/")) and any(term in path for term in ("about", "contact", "company", "product", "solution", "industry", "location", "profile", "service")):
                    urls.append(location)
            if len(urls) >= MAX_SITEMAP_URLS:
                break
    return urls


def _preferred_page(linked: str, base: str) -> bool:
    link_parts = urlsplit(linked)
    return link_parts.scheme in {"http", "https"} and canonical_domain(linked) == canonical_domain(base)


def _robots_failure(seed: SeedSource, reason: str) -> dict:
    return {"url": seed.url, "http_status_or_error_category": "robots_policy", "retry_count": 0, "failure_reason": reason}


def _record_from_pages(seed: SeedSource, pages: list[tuple[str, dict]], fetched_at: str) -> tuple[dict, list[dict]]:
    merged = {}
    audit = []
    for page_url, data in pages:
        for field, value in data.items():
            if field in {"relevant_links", "title"} or not value:
                continue
            old_value = merged.get(field, "")
            merged[field] = "; ".join(dict.fromkeys(filter(None, [old_value, value]))) if field in {"email", "phone_number", "products_services"} else old_value or value
            if merged[field] == value or merged[field] == old_value:
                audit.append({
                    "source_url": page_url,
                    "company_name": data.get("company_name") or seed.name,
                    "field_name": field,
                    "extracted_value": value,
                    "verification_result": "official_site_page",
                    "retrieval_date": fetched_at,
                })
    company_name = merged.get("company_name") or seed.name
    if not merged.get("products_services"):
        merged["products_services"] = ""
    page_urls = [url for url, _ in pages]
    verified_key_fields = sum(bool(merged.get(field)) for field in ("email", "phone_number", "address", "founded_year", "employee_count", "employee_range", "products_services"))
    has_structured_identity = any(data.get("structured_organization") for _, data in pages)
    record = {
        "company_id": re.sub(r"[^a-z0-9]+", "-", canonical_domain(seed.url).lower()).strip("-"),
        "company_name": company_name,
        "website_url": seed.url,
        "email": merged.get("email", ""),
        "phone_number": merged.get("phone_number", ""),
        "industry_type": seed.industry,
        "robotics_specialization": seed.specialization,
        "products_services": merged.get("products_services", ""),
        "address": merged.get("address", ""),
        "city": merged.get("city", ""),
        "state_province": merged.get("state_province", ""),
        "country": merged.get("country", ""),
        "founded_year": merged.get("founded_year", ""),
        "employee_count": merged.get("employee_count", ""),
        "employee_range": merged.get("employee_range", ""),
        "company_type": seed.company_type,
        "parent_company": seed.parent_company,
        "contact_page_url": merged.get("contact_page_url", ""),
        "source_url": page_urls[0] if page_urls else seed.url,
        "source_type": "official_website",
        "verification_status": "verified" if has_structured_identity and verified_key_fields >= 2 else "partially_verified" if pages else "unavailable",
        "last_checked": fetched_at,
        "extraction_notes": "Seed identity and classification from configured catalog; extracted values are linked in robotics_extraction_audit.csv.",
    }
    return record, audit


def _crawl_seed(crawler: PoliteCrawler, seed: SeedSource) -> tuple[dict | None, list[dict], list[dict], bool]:
    failed = []
    robots = crawler._robots_parser(seed.url)
    if robots is None:
        return None, [], [_robots_failure(seed, "robots.txt could not be checked; crawl skipped conservatively")], False

    page_candidates = [seed.url]
    page_candidates.extend(_sitemap_urls(crawler, seed.url))
    fetched_pages = []
    visited = set()
    while page_candidates and len(fetched_pages) < MAX_PAGES_PER_SITE:
        url = page_candidates.pop(0)
        normalized = canonical_url(url)
        if not normalized or normalized in visited or not _preferred_page(url, seed.url):
            continue
        visited.add(normalized)
        if not crawler.allowed(url):
            continue
        response, error = crawler._get(url)
        if response is None:
            failed.append({"url": url, "http_status_or_error_category": "request_error", "retry_count": MAX_RETRIES, "failure_reason": error})
            continue
        if response.status_code != 200:
            failed.append({"url": url, "http_status_or_error_category": response.status_code, "retry_count": 0, "failure_reason": response.reason})
            continue
        content_type = response.headers.get("Content-Type", "").lower()
        if "html" not in content_type and "xhtml" not in content_type:
            continue
        data = extract_page(response.text, response.url)
        if response.url != url and not _preferred_page(response.url, seed.url):
            failed.append({"url": url, "http_status_or_error_category": "external_redirect", "retry_count": 0, "failure_reason": f"redirected outside official seed domain to {response.url}"})
            continue
        fetched_pages.append((response.url, data))
        for linked in data.get("relevant_links", "").split(";"):
            if linked and linked not in visited and _preferred_page(linked, seed.url):
                page_candidates.append(linked)

    fetched_at = _now()
    if not fetched_pages:
        return None, [], failed or [_robots_failure(seed, "No permitted, successful HTML pages were retrieved")], False
    record, audit = _record_from_pages(seed, fetched_pages, fetched_at)
    if not valid_company_record(record):
        record["verification_status"] = "unverified"
    return record, audit, failed, True


def run_sources(sources: list[SeedSource], checkpoint: bool = True, export: bool = True) -> dict:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    CHECKPOINT_FILE.parent.mkdir(parents=True, exist_ok=True)
    state = {"completed": {}, "audit": [], "failures": []}
    if checkpoint and CHECKPOINT_FILE.exists():
        try:
            loaded = json.loads(CHECKPOINT_FILE.read_text(encoding="utf-8"))
            if isinstance(loaded, dict):
                state.update(loaded)
        except (OSError, json.JSONDecodeError):
            logging.exception("Ignoring invalid checkpoint %s", CHECKPOINT_FILE)

    pending = []
    for index, seed in enumerate(sources, start=1):
        domain = canonical_domain(seed.url)
        prior_internal_failures = [
            failure for failure in state["failures"]
            if failure.get("url") == seed.url
            and failure.get("http_status_or_error_category") in {"TypeError", "MemoryError"}
        ]
        if checkpoint and domain in state["completed"] and not prior_internal_failures:
            print(f"[{index}/{len(sources)}] checkpoint: {seed.name}")
            continue
        print(f"[{index}/{len(sources)}] checking {seed.name}")
        pending.append((seed, domain, prior_internal_failures))

    with ThreadPoolExecutor(max_workers=MAX_CRAWL_WORKERS) as executor:
        future_sources = {
            executor.submit(_crawl_seed, PoliteCrawler(), seed): (seed, domain, prior_failures)
            for seed, domain, prior_failures in pending
        }
        for future in as_completed(future_sources):
            seed, domain, prior_internal_failures = future_sources[future]
            key = domain or seed.url
            try:
                record, audit, failures, accessible = future.result()
                if prior_internal_failures:
                    state["failures"] = [failure for failure in state["failures"] if failure not in prior_internal_failures]
                state["completed"][key] = {"record": record, "accessible": accessible, "checked_at": _now()}
                state["audit"].extend(audit)
                state["failures"].extend(failures)
            except Exception as exc:
                logging.exception("Unexpected crawl error for %s", seed.url)
                state["completed"][key] = {"record": None, "accessible": False, "checked_at": _now()}
                state["failures"].append({"url": seed.url, "http_status_or_error_category": type(exc).__name__, "retry_count": 0, "failure_reason": str(exc)})
            if checkpoint:
                CHECKPOINT_FILE.write_text(json.dumps(state, indent=2, ensure_ascii=False), encoding="utf-8")

    records = sum(bool(entry.get("record")) for entry in state["completed"].values())
    if export:
        result = export_results() if checkpoint else export_results(state)
        records = result["records"]
    result = {"records": records, "failures": len(state["failures"])}
    print(f"Collected {records} records; {len(state['failures'])} failed URLs.")
    return result