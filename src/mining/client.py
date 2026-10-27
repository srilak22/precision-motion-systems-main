import requests
import time
import logging
from typing import Optional, Dict, Any

logger = logging.getLogger("mining.client")

class FormMiningClient:
    """Robust, polite HTTP client for form-based web mining."""

    def __init__(
        self,
        user_agent: Optional[str] = None,
        timeout: int = 15,
        delay: float = 0.6,
        max_retries: int = 3,
        backoff_factor: float = 1.5
    ):
        self.timeout = timeout
        self.delay = delay
        self.max_retries = max_retries
        self.backoff_factor = backoff_factor
        self.session = requests.Session()
        self.headers = {
            "User-Agent": user_agent or (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36 (Robotics Research Bot)"
            ),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
        }
        self.session.headers.update(self.headers)
        self.last_request_time = 0.0

    def _throttle(self):
        elapsed = time.time() - self.last_request_time
        if elapsed < self.delay:
            time.sleep(self.delay - elapsed)
        self.last_request_time = time.time()

    def get(self, url: str, params: Optional[Dict[str, Any]] = None) -> Optional[str]:
        for attempt in range(1, self.max_retries + 1):
            self._throttle()
            try:
                response = self.session.get(url, params=params, timeout=self.timeout)
                if response.status_code == 200:
                    return response.text
                elif response.status_code in [403, 429]:
                    logger.warning(f"Rate limited / blocked ({response.status_code}) on {url}. Backing off.")
                    time.sleep(self.delay * (self.backoff_factor ** attempt) * 2)
                else:
                    logger.warning(f"GET {url} failed with status {response.status_code} (attempt {attempt}/{self.max_retries})")
            except Exception as e:
                logger.warning(f"Network error on GET {url}: {e} (attempt {attempt}/{self.max_retries})")
                time.sleep(self.delay * (self.backoff_factor ** attempt))
        return None

    def post_form(self, url: str, data: Dict[str, Any]) -> Optional[str]:
        for attempt in range(1, self.max_retries + 1):
            self._throttle()
            try:
                response = self.session.post(url, data=data, timeout=self.timeout)
                if response.status_code == 200:
                    return response.text
                elif response.status_code in [403, 429]:
                    logger.warning(f"Rate limited / blocked ({response.status_code}) on POST {url}. Backing off.")
                    time.sleep(self.delay * (self.backoff_factor ** attempt) * 2)
                else:
                    logger.warning(f"POST {url} failed with status {response.status_code} (attempt {attempt}/{self.max_retries})")
            except Exception as e:
                logger.warning(f"Network error on POST {url}: {e} (attempt {attempt}/{self.max_retries})")
                time.sleep(self.delay * (self.backoff_factor ** attempt))
        return None
