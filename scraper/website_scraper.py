from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import requests
from bs4 import BeautifulSoup

from config import DEFAULT_TIMEOUT_SECONDS, DEFAULT_USER_AGENT


@dataclass
class ScrapedPage:
    url: str
    text: str
    status_code: int
    title: str = ""
    soup: Optional[BeautifulSoup] = None


class WebsiteScraper:
    def __init__(self, user_agent: str = DEFAULT_USER_AGENT, timeout: int = DEFAULT_TIMEOUT_SECONDS):
        self.user_agent = user_agent
        self.timeout = timeout

    def scrape(self, url: str, max_pages: int = 1) -> ScrapedPage:
        headers = {"User-Agent": self.user_agent, "Accept-Language": "en-US,en;q=0.9"}
        response = requests.get(url, headers=headers, timeout=self.timeout)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        title = soup.title.get_text(" ", strip=True) if soup.title else ""
        return ScrapedPage(
            url=url,
            text=response.text,
            status_code=response.status_code,
            title=title,
            soup=soup,
        )
