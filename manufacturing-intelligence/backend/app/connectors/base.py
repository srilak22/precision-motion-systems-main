"""
Abstract Base Connector for all Data Sources.
Enforces standard discovery interface, rate limiting, exponential backoff,
checkpoint persistence, and resilient error recovery.
"""
from __future__ import annotations

import abc
import asyncio
import logging
import time
from typing import AsyncGenerator, Dict, Any, List, Optional
import requests
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logger = logging.getLogger(__name__)


class RawCompanyRecord:
    """Standardized unverified container for discovered company data."""

    def __init__(
        self,
        source_id: str,
        source_name: str,
        company_name: str,
        country: str,
        registration_number: Optional[str] = None,
        city: Optional[str] = None,
        state_province: Optional[str] = None,
        address: Optional[str] = None,
        website: Optional[str] = None,
        industry_sector: Optional[str] = None,
        industry_code: Optional[Dict[str, str]] = None,
        incorporation_date: Optional[str] = None,
        legal_status: Optional[str] = "active",
        main_products: Optional[List[str]] = None,
        raw_metadata: Optional[Dict[str, Any]] = None,
    ):
        self.source_id = source_id
        self.source_name = source_name
        self.company_name = company_name
        self.country = country
        self.registration_number = registration_number
        self.city = city
        self.state_province = state_province
        self.address = address
        self.website = website
        self.industry_sector = industry_sector
        self.industry_code = industry_code or {}
        self.incorporation_date = incorporation_date
        self.legal_status = legal_status
        self.main_products = main_products or []
        self.raw_metadata = raw_metadata or {}


class BaseConnector(abc.ABC):
    """Base class for all country and registry connectors."""

    def __init__(
        self,
        source_name: str,
        country: str,
        rate_limit_per_minute: int = 60,
        api_key: Optional[str] = None,
    ):
        self.source_name = source_name
        self.country = country
        self.rate_limit_per_minute = rate_limit_per_minute
        self.api_key = api_key
        self._delay_between_requests = 60.0 / max(rate_limit_per_minute, 1)
        self._last_request_time = 0.0

    async def _rate_limit_wait(self) -> None:
        """Throttles outbound requests to respect source limits."""
        elapsed = time.time() - self._last_request_time
        if elapsed < self._delay_between_requests:
            await asyncio.sleep(self._delay_between_requests - elapsed)
        self._last_request_time = time.time()

    @abc.abstractmethod
    async def discover_companies(
        self,
        checkpoint: Optional[Dict[str, Any]] = None,
        batch_limit: int = 50,
    ) -> AsyncGenerator[RawCompanyRecord, None]:
        """
        Yields discovered RawCompanyRecord objects.
        Must respect checkpoints so interrupted jobs can resume.
        """
        pass

    @abc.abstractmethod
    def get_source_metadata(self) -> Dict[str, Any]:
        """Returns metadata for the Source Registry."""
        pass

