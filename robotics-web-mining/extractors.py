"""Extract public company facts from official HTML and structured metadata."""

import json
import re
from collections.abc import Iterator
from urllib.parse import urljoin, urlsplit

from bs4 import BeautifulSoup

from validators import clean_text, normalize_email, normalize_phone, valid_year


def _walk_json(value: object) -> Iterator[dict]:
    if isinstance(value, dict):
        yield value
        for child in value.values():
            yield from _walk_json(child)
    elif isinstance(value, list):
        for child in value:
            yield from _walk_json(child)


def _organization_nodes(soup: BeautifulSoup) -> list[dict]:
    nodes = []
    for script in soup.select('script[type="application/ld+json"]'):
        try:
            nodes.extend(_walk_json(json.loads(script.string or script.get_text())))
        except (json.JSONDecodeError, TypeError):
            continue
    return [node for node in nodes if any("organization" in str(item).lower() for item in (node.get("@type", []) if isinstance(node.get("@type"), list) else [node.get("@type", "")]))]


def _first_value(nodes: list[dict], key: str) -> str:
    for node in nodes:
        value = node.get(key)
        if isinstance(value, dict):
            value = value.get("name") or value.get("telephone") or value.get("email")
        if value:
            return clean_text(value)
    return ""


def _address_fields(nodes: list[dict]) -> dict[str, str]:
    for node in nodes:
        address = node.get("address")
        if isinstance(address, dict):
            parts = {key: clean_text(address.get(key, "")) for key in ("streetAddress", "addressLocality", "addressRegion", "postalCode", "addressCountry")}
            full = ", ".join(part for part in (parts["streetAddress"], parts["addressLocality"], parts["addressRegion"], parts["postalCode"], parts["addressCountry"]) if part)
            if full:
                return {"address": full, "city": parts["addressLocality"], "state_province": parts["addressRegion"], "country": parts["addressCountry"]}
        elif isinstance(address, str) and address.strip():
            return {"address": clean_text(address), "city": "", "state_province": "", "country": ""}
    return {"address": "", "city": "", "state_province": "", "country": ""}


def extract_page(html: str, page_url: str) -> dict[str, str]:
    soup = BeautifulSoup(html, "html.parser")
    nodes = _organization_nodes(soup)
    title = clean_text(soup.title.get_text(" ", strip=True)) if soup.title else ""
    description_tag = soup.select_one('meta[name="description"], meta[property="og:description"]')
    description = clean_text(description_tag.get("content", "")) if description_tag else ""
    site_name_tag = soup.select_one('meta[property="og:site_name"], meta[name="application-name"]')
    site_name = clean_text(site_name_tag.get("content", "")) if site_name_tag else ""

    emails = []
    phones = []
    for node in nodes:
        email = normalize_email(str(node.get("email", "")))
        phone = normalize_phone(str(node.get("telephone", "")))
        if email:
            emails.append(email)
        if phone:
            phones.append(phone)

    for link in soup.select('a[href^="mailto:"]'):
        email = normalize_email(link.get("href", "").split(":", 1)[-1].split("?", 1)[0])
        if email:
            emails.append(email)
    for link in soup.select('a[href^="tel:"]'):
        phone = normalize_phone(link.get("href", "").split(":", 1)[-1])
        if phone:
            phones.append(phone)

    visible_text = soup.get_text(" ", strip=True)
    for match in re.finditer(r"(?<![\w.+-])[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}(?![\w.-])", visible_text, re.I):
        email = normalize_email(match.group(0))
        if email:
            emails.append(email)

    contact_links = []
    relevant_links = []
    base_host = urlsplit(page_url).hostname
    for link in soup.select("a[href]"):
        href = urljoin(page_url, link.get("href", "")).split("#", 1)[0]
        parsed = urlsplit(href)
        if parsed.scheme not in {"http", "https"} or parsed.hostname != base_host:
            continue
        label = clean_text(link.get_text(" ", strip=True)).lower()
        path = parsed.path.lower()
        if any(word in f"{label} {path}" for word in ("contact", "about", "company", "location", "product", "solution", "industry", "profile", "service")):
            if any(word in f"{label} {path}" for word in ("contact", "location")):
                contact_links.append(href)
            relevant_links.append(href)

    address = _address_fields(nodes)
    founded = ""
    employees = ""
    employee_range = ""
    for node in nodes:
        founded = founded or valid_year(node.get("foundingDate", ""))
        count = node.get("numberOfEmployees")
        if isinstance(count, dict):
            count = count.get("value", "")
        elif count:
            count = clean_text(count)
        if count:
            count_text = clean_text(count)
            if re.fullmatch(r"\d[\d,]*", count_text):
                employees = employees or count_text.replace(",", "")
            elif re.search(r"\d\s*[-–]\s*\d", count_text):
                employee_range = employee_range or count_text

    products = []
    for node in nodes:
        if str(node.get("@type", "")).lower() in {"product", "service"} and node.get("name"):
            products.append(clean_text(node["name"]))
    if description:
        products.append(description)

    return {
        "company_name": _first_value(nodes, "name") or site_name,
        "title": title,
        "description": description,
        "email": "; ".join(dict.fromkeys(emails)),
        "phone_number": "; ".join(dict.fromkeys(phones)),
        **address,
        "founded_year": founded,
        "employee_count": employees,
        "employee_range": employee_range,
        "contact_page_url": next(iter(dict.fromkeys(contact_links)), ""),
        "relevant_links": ";".join(dict.fromkeys(relevant_links)),
        "products_services": "; ".join(dict.fromkeys(products))[:1600],
        "structured_organization": "true" if nodes else "",
    }