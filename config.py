from __future__ import annotations

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "output"
RAW_OUTPUT_DIR = OUTPUT_DIR / "raw"
VERIFIED_OUTPUT_DIR = OUTPUT_DIR / "verified"
INDUSTRY_OUTPUT_DIR = OUTPUT_DIR / "by_industry"
LOGS_DIR = BASE_DIR / "logs"

DEFAULT_INDUSTRY = "industrial automation"
DEFAULT_LOCATION = "United States"
DEFAULT_TARGET_COUNT = 25
DEFAULT_TIMEOUT_SECONDS = 20
DEFAULT_USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/124.0.0.0 Safari/537.36"
)

PUBLIC_SOURCE_URLS = [
    "https://www.google.com/search",
    "https://www.bing.com/search",
    "https://www.yellowpages.com",
]


def ensure_directories() -> None:
    for directory in (RAW_OUTPUT_DIR, VERIFIED_OUTPUT_DIR, INDUSTRY_OUTPUT_DIR, LOGS_DIR):
        directory.mkdir(parents=True, exist_ok=True)
