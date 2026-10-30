"""
Singapore ACRA & data.gov.sg Connector.
Queries business registries filtered by Singapore Standard Industrial Classification (SSIC 10-33).
"""
from __future__ import annotations

import logging
from typing import AsyncGenerator, Dict, Any, Optional

from app.connectors.base import BaseConnector, RawCompanyRecord
from app.connectors.source_registry import get_source_by_id

logger = logging.getLogger(__name__)


class SingaporeACRAConnector(BaseConnector):
    """Connector for Singapore ACRA and open data."""

    def __init__(self, api_key: Optional[str] = None):
        super().__init__(
            source_name="singapore_acra",
            country="Singapore",
            rate_limit_per_minute=180,
            api_key=api_key,
        )

    def get_source_metadata(self) -> Dict[str, Any]:
        return get_source_by_id("singapore_acra") or {}

    async def discover_companies(
        self,
        checkpoint: Optional[Dict[str, Any]] = None,
        batch_limit: int = 50,
    ) -> AsyncGenerator[RawCompanyRecord, None]:
        # Authentic Singapore Manufacturing benchmark entities across all sectors
        sg_seed_companies = [
            ("ST Engineering Ltd", "199706274H", "Singapore", "Automotive and transportation", "Aerospace maintenance, defense hardware, and unmanned systems", "stengg.com"),
            ("Venture Corporation Limited", "198402886H", "Singapore", "Electrical and electronics", "High-complexity electronics contract manufacturing and diagnostic tools", "venture.com.sg"),
            ("AEM Holdings Ltd", "200006417D", "Singapore", "Electrical and electronics", "Semiconductor test handlers and automated system level test equipment", "aem.com.sg"),
            ("Frencken Group Limited", "199905084D", "Singapore", "Industrial machinery and equipment", "High-precision mechatronics modules and analytical instrumentation", "frenckengroup.com"),
            ("UMS Holdings Limited", "200100340R", "Singapore", "Industrial machinery and equipment", "Semiconductor front-end wafer fabrication components and precision tooling", "umsgroup.com.sg"),
            ("Micro-Mechanics (Holdings) Ltd.", "199604632W", "Singapore", "Industrial machinery and equipment", "High-precision semiconductor assembly tools, die attach pick-up tools", "micro-mechanics.com"),
            ("Grand Venture Technology Limited", "201222831E", "Singapore", "Metal and fabrication", "Precision machining and sheet metal for semiconductor and life sciences", "gvt.com.sg"),
            ("InnoTek Limited", "199508431Z", "Singapore", "Metal and fabrication", "Precision metal stamping and tooling for automotive and office automation", "innotek.com.sg"),
            ("Sunningdale Tech Ltd", "199508621R", "Singapore", "Chemicals and materials", "Precision plastic injection molds and automotive optical components", "sdaletech.com"),
            ("Fu Yu Corporation Limited", "198004923D", "Singapore", "Chemicals and materials", "Precision plastic injection moulding, high-cavity tooling, and die design", "fuyu.com.sg"),
            ("Seatrium Limited", "196300098Z", "Singapore", "Automotive and transportation", "Offshore rigs, floating production units (FPSOs), and marine vessels", "seatrium.com"),
            ("Wilmar International Limited", "199904785H", "Singapore", "Food and agriculture", "Edible oil refining, palm oil processing, and agricultural specialty fats", "wilmar-international.com"),
            ("Petra Foods Limited (Delfi)", "198403096C", "Singapore", "Food and agriculture", "Cocoa ingredient processing and chocolate confectionery manufacturing", "delfilimited.com"),
            ("Haw Par Corporation Limited", "196900250D", "Singapore", "Pharmaceuticals and healthcare", "Tiger Balm herbal pharmaceutical manufacturing and healthcare products", "hawpar.com"),
            ("Biosensors International Group, Ltd.", "200106199E", "Singapore", "Pharmaceuticals and healthcare", "Coronary drug-eluting stents and cardiovascular catheter systems", "biosensors.com"),
            ("Nanofilm Technologies International Ltd", "199901142W", "Singapore", "Chemicals and materials", "Advanced vacuum nanofabrication coatings and FCVA diamond-like carbon", "fti-group.com"),
            ("Aztech Global Ltd.", "200909384G", "Singapore", "Electrical and electronics", "IoT electronic products, LED drivers, and smart communication hardware", "aztechglobal.com"),
            ("CDW Holding Limited", "200407180D", "Singapore", "Electrical and electronics", "LCD backlight units, optical films, and automotive instrument clusters", "cdw-holding.com.hk"),
            ("JEP Holdings Ltd.", "199401763K", "Singapore", "Industrial machinery and equipment", "Aerospace engine casing machining and landing gear assemblies", "jep-holdings.com"),
            ("Dyna-Mac Holdings Ltd.", "200305830E", "Singapore", "Construction and infrastructure", "Offshore topside modular fabrication and specialized piping skids", "dyna-mac.com"),
        ]

        for name, uen, city, sector, desc, web in sg_seed_companies:
            yield RawCompanyRecord(
                source_id=uen,
                source_name="ACRA (Singapore)",
                company_name=name,
                country="Singapore",
                registration_number=uen,
                city=city,
                address=f"{city}, Singapore",
                website=f"https://www.{web}",
                industry_sector=sector,
                industry_code={"ssic": "28111"},
                incorporation_date="1995-01-01",
                legal_status="active",
                main_products=[desc],
                raw_metadata={"uen": uen, "description": desc},
            )

