import csv
import json
import re
from typing import Dict, List, Optional
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

URLS = [
    'https://www.robotplusplus.com/',
    'https://www.co.bot/',
    'https://www.mech-mind.com/',
    'https://www.sandvik.coromant.com/en-gb',
    'https://kawasakirobotics.com/in/'
]

HEADERS = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'}


def safe_text(value: Optional[str]) -> str:
    if not value:
        return ''
    return re.sub(r'\s+', ' ', value).strip()


def extract_company_name(soup: BeautifulSoup, url: str) -> str:
    candidates = []
    for selector in ['meta[property="og:site_name"]', 'meta[name="application-name"]', 'h1', 'title']:
        tag = soup.select_one(selector)
        if tag:
            value = tag.get('content') or tag.get_text(' ', strip=True)
            if value:
                candidates.append(value)

    for script in soup.select('script[type="application/ld+json"]'):
        raw = script.get_text(' ', strip=True)
        try:
            data = json.loads(raw)
            if isinstance(data, dict):
                name = data.get('name')
                if name:
                    candidates.append(str(name))
            elif isinstance(data, list):
                for item in data:
                    if isinstance(item, dict):
                        name = item.get('name')
                        if name:
                            candidates.append(str(name))
        except Exception:
            pass

    for value in candidates:
        cleaned = safe_text(value)
        if cleaned and not any(token in cleaned.lower() for token in ['search results', 'google', 'page not found', '404', 'robots.txt']):
            result = cleaned.split('|')[0].strip()
            if result:
                return result

    host = urlparse(url).netloc.replace('www.', '').split('.')[0]
    return host.replace('-', ' ').title()


def extract_emails(text: str) -> str:
    emails = re.findall(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}', text)
    return '; '.join(dict.fromkeys(emails)) if emails else ''


def extract_phones(text: str) -> str:
    matches = re.findall(r'(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?){2,3}\d{3,4}', text)
    cleaned = []
    for m in matches:
        m = safe_text(m)
        if len(m.replace('+', '').replace('-', '').replace(' ', '').replace('(', '').replace(')', '').replace('.', '')) >= 7:
            cleaned.append(m)
    return '; '.join(dict.fromkeys(cleaned)) if cleaned else ''


def extract_address(text: str) -> str:
    patterns = [
        r'([A-Za-z0-9 .,-]+(?:Street|St|Road|Rd|Avenue|Ave|Lane|Ln|Drive|Dr|Boulevard|Blvd|Court|Ct|Way|Place|Pl|Sector|Building|Tower|Suite|Floor|Flr|Road|Way|Park|Center|Centre)[A-Za-z0-9 .,-]*)',
        r'([A-Za-z0-9 .,-]+,\s*[A-Za-z .-]+,\s*[A-Za-z .-]+\s*\d{0,5})',
        r'(Address[:\s]+[^\n]{20,200})'
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text, flags=re.I)
        if matches:
            value = safe_text(matches[0] if isinstance(matches[0], str) else ' '.join(map(str, matches[:3])))
            if len(value) > 8:
                return value
    if 'address' in text.lower():
        idx = text.lower().find('address')
        snippet = text[idx:idx+300]
        return safe_text(snippet)
    return ''


def extract_other_info(soup: BeautifulSoup, text: str) -> Dict[str, str]:
    other = {
        'Description': '',
        'Country': '',
        'Main contact page': '',
        'Raw contact snippet': ''
    }

    meta_desc = soup.select_one('meta[name="description"]') or soup.select_one('meta[property="og:description"]')
    if meta_desc:
        other['Description'] = safe_text(meta_desc.get('content') or '')

    text_lower = text.lower()
    if 'india' in text_lower:
        other['Country'] = 'India'
    elif 'united states' in text_lower or 'usa' in text_lower:
        other['Country'] = 'United States'
    elif 'sweden' in text_lower or 'europe' in text_lower:
        other['Country'] = 'Sweden'

    for link in soup.select('a[href]'):
        href = link.get('href', '')
        if any(keyword in href.lower() for keyword in ['contact', 'about', 'company', 'locations', 'support']):
            other['Main contact page'] = href
            break

    snippets = []
    for pattern in [r'Contact[^\n]{0,200}', r'Phone[^\n]{0,200}', r'Email[^\n]{0,200}', r'Address[^\n]{0,200}']:
        for match in re.findall(pattern, text, flags=re.I):
            snippets.append(safe_text(match))
    other['Raw contact snippet'] = ' | '.join(snippets[:3])
    return other


def scrape_url(url: str) -> Dict[str, str]:
    try:
        response = requests.get(url, headers=HEADERS, timeout=25)
        response.raise_for_status()
    except Exception as exc:
        return {
            'Company name': urlparse(url).netloc.replace('www.', '').split('.')[0].replace('-', ' ').title(),
            'Phone number': '',
            'Email': '',
            'Address': '',
            'Website': url,
            'Country': '',
            'Description': '',
            'Notes': f'Fetch error: {exc}',
        }

    soup = BeautifulSoup(response.text, 'html.parser')
    text = soup.get_text(' ', strip=True)
    company_name = extract_company_name(soup, url)
    phone = extract_phones(text)
    email = extract_emails(text)
    address = extract_address(text)
    extra = extract_other_info(soup, text)
    notes = extra['Raw contact snippet'] if extra['Raw contact snippet'] else 'Public website data extracted from homepage.'

    return {
        'Company name': company_name,
        'Phone number': phone,
        'Email': email,
        'Address': address,
        'Website': url,
        'Country': extra['Country'],
        'Description': extra['Description'],
        'Notes': notes,
    }


def main() -> None:
    rows = [scrape_url(url) for url in URLS]
    output_file = 'company_data_output.csv'
    fieldnames = ['Company name', 'Phone number', 'Email', 'Address', 'Website', 'Country', 'Description', 'Notes']

    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f'CSV saved to {output_file}')
    for row in rows:
        print(row)


if __name__ == '__main__':
    main()
