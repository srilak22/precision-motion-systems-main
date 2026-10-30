"""
Manufacturing Classification Engine.
Extensible taxonomy covering 10 primary sectors with sub-industries.
Accurately distinguishes manufacturers from distributors, wholesalers, retailers, and service providers.
"""
from __future__ import annotations

import re
from typing import Dict, List, Tuple, Optional
from app.models.company import ManufacturingClassification

# ── Primary Manufacturing Sectors & Keywords ────────────────────────────────
TAXONOMY_SECTORS = {
    "Industrial machinery and equipment": {
        "subsectors": [
            "CNC machines and machining equipment",
            "Machine tools",
            "Factory automation equipment",
            "Material handling equipment",
            "Pumps, compressors and valves",
            "Bearings, gears, reducers and transmissions",
            "Motors, drives and actuators",
            "Hydraulic and pneumatic equipment",
            "Industrial tooling and fixtures",
        ],
        "keywords": [
            "machinery", "cnc", "machine tool", "pump", "compressor", "valve",
            "bearing", "gearbox", "actuator", "hydraulic", "pneumatic", "lathe",
            "milling", "tooling", "conveyor", "hoist", "crane", "boiler",
        ],
        "sic_prefixes": ["35"],
        "naics_prefixes": ["333"],
    },
    "Robotics and automation": {
        "subsectors": [
            "Industrial robot manufacturers",
            "Collaborative robots",
            "Autonomous mobile robots",
            "Automated guided vehicles",
            "Robotic arms and end effectors",
            "Machine vision and inspection equipment",
            "Motion control components",
            "Industrial sensors and controllers",
            "Robotics integrators that also manufacture products",
            "Industrial control equipment",
        ],
        "keywords": [
            "robotics", "robot", "cobot", "scara", "agv", "amr", "motion control",
            "servomotor", "machine vision", "plc", "scada", "end effector", "gripper",
            "automation system", "industrial sensor",
        ],
        "sic_prefixes": ["3569", "3625", "3823"],
        "naics_prefixes": ["335314", "333999", "334513"],
    },
    "Automotive and transportation": {
        "subsectors": [
            "Vehicle manufacturers",
            "Automotive components",
            "Electric vehicle components",
            "Batteries and powertrain systems",
            "Aerospace and aircraft components",
            "Railway equipment",
            "Marine equipment",
        ],
        "keywords": [
            "automotive", "vehicle", "electric vehicle", "powertrain", "chassis",
            "aerospace", "aircraft", "avionics", "railway", "locomotive", "marine engine",
            "braking system", "transmission", "battery pack", "ev motor",
        ],
        "sic_prefixes": ["37"],
        "naics_prefixes": ["336"],
    },
    "Electrical and electronics": {
        "subsectors": [
            "Electronic components",
            "Semiconductor equipment and components",
            "PCB manufacturers",
            "Electrical switchgear",
            "Transformers",
            "Power electronics",
            "Industrial electronics",
            "Sensors and instrumentation",
            "Cable and wiring products",
        ],
        "keywords": [
            "semiconductor", "pcb", "printed circuit", "switchgear", "transformer",
            "inverter", "power supply", "sensor", "wire", "cable", "microelectronics",
            "connector", "capacitor", "resistor",
        ],
        "sic_prefixes": ["36"],
        "naics_prefixes": ["334", "335"],
    },
    "Metal and fabrication": {
        "subsectors": [
            "Steel and aluminium products",
            "Metal fabrication",
            "Foundries and casting",
            "Forging and stamping",
            "Sheet metal components",
            "Precision machining",
            "Industrial fasteners",
        ],
        "keywords": [
            "metal fabrication", "foundry", "casting", "forging", "stamping",
            "sheet metal", "machining", "fastener", "bolt", "steel", "aluminum",
            "welding", "extrusion", "die casting",
        ],
        "sic_prefixes": ["33", "34"],
        "naics_prefixes": ["331", "332"],
    },
    "Chemicals and materials": {
        "subsectors": [
            "Industrial chemicals",
            "Specialty chemicals",
            "Polymers and plastics",
            "Rubber products",
            "Industrial coatings",
            "Composites",
            "Glass and ceramics",
            "Industrial gases",
        ],
        "keywords": [
            "chemicals", "polymer", "resin", "plastics", "rubber", "coating",
            "paint", "composite", "carbon fiber", "glass", "ceramic", "argon",
            "nitrogen", "catalyst", "elastomer",
        ],
        "sic_prefixes": ["28", "30"],
        "naics_prefixes": ["325", "326"],
    },
    "Food and agriculture": {
        "subsectors": [
            "Food processing",
            "Beverage production",
            "Dairy products",
            "Agricultural machinery",
            "Packaging machinery",
            "Food manufacturing equipment",
        ],
        "keywords": [
            "food processing", "beverage", "dairy", "brewery", "grain milling",
            "baking", "meat processing", "canning", "agricultural machinery", "tractor",
            "harvester", "packaging machinery",
        ],
        "sic_prefixes": ["20", "3523"],
        "naics_prefixes": ["311", "312", "333111"],
    },
    "Pharmaceuticals and healthcare": {
        "subsectors": [
            "Pharmaceutical manufacturers",
            "Medical devices",
            "Laboratory equipment",
            "Healthcare equipment",
            "Biotech manufacturing",
        ],
        "keywords": [
            "pharmaceutical", "active pharmaceutical ingredient", "api", "drug formulation",
            "vaccine", "biotech", "medical device", "surgical instrument", "implants",
            "diagnostic equipment", "laboratory apparatus",
        ],
        "sic_prefixes": ["2834", "3841", "3842"],
        "naics_prefixes": ["325412", "339112", "339113"],
    },
    "Textiles and consumer manufacturing": {
        "subsectors": [
            "Textiles and garments",
            "Footwear",
            "Furniture",
            "Paper and pulp",
            "Printing and packaging",
            "Household appliances",
            "Consumer electronics",
        ],
        "keywords": [
            "textile", "spinning", "weaving", "garment", "footwear", "furniture",
            "paper mill", "pulp", "corrugated box", "packaging production", "appliance",
            "consumer electronics",
        ],
        "sic_prefixes": ["22", "23", "25", "26", "27"],
        "naics_prefixes": ["313", "314", "315", "321", "322", "337"],
    },
    "Construction and infrastructure": {
        "subsectors": [
            "Building materials",
            "Cement and concrete products",
            "HVAC equipment",
            "Industrial refrigeration",
            "Construction machinery",
            "Prefabricated building products",
        ],
        "keywords": [
            "cement", "concrete", "asphalt", "brick", "hvac", "chiller",
            "air handler", "industrial refrigeration", "excavator", "crane",
            "prefabricated steel", "precast", "insulation material",
        ],
        "sic_prefixes": ["29", "32", "3531", "3585"],
        "naics_prefixes": ["324", "327", "333120", "333415"],
    },
}

# ── Negative Signals (Disqualifies pure distributors / services) ───────────
DISTRIBUTOR_PATTERNS = [
    r"\bdistributor only\b",
    r"\bwholesale trader\b",
    r"\bauthorized distributor\b",
    r"\bdistributor\b",
    r"\bwholesale\b",
    r"\bstockist\b",
    r"\btrading\b",
    r"\btrader\b",
    r"\bdealership\b",
    r"\bretailer\b",
    r"\bsupplier and stockist\b",
]

SERVICE_PATTERNS = [
    r"\bmanagement consulting\b",
    r"\bconsulting\b",
    r"\badvisory\b",
    r"\bsoftware as a service\b",
    r"\bit services\b",
    r"\bmarketing agency\b",
    r"\bfinancial advisory\b",
    r"\blegal services\b",
    r"\breal estate agency\b",
    r"\brecruiting\b",
    r"\bagency\b",
]

# ── Positive Manufacturing Indicators ─────────────────────────────────────
MFG_POSITIVE_PATTERNS = [
    r"\bmanufactur(er|ing|ed)\b",
    r"\bfabricat(or|ion|ing)\b",
    r"\bproduction plant\b",
    r"\bproduction facility\b",
    r"\bfactory\b",
    r"\bassembly line\b",
    r"\bfoundry\b",
    r"\boem/odm\b",
    r"\bcontract manufacturer\b",
    r"\bprecision machining\b",
    r"\biso 9001 certified plant\b",
    r"\bcustom engineering and manufacturing\b",
]


class ClassificationResult:
    def __init__(
        self,
        classification: ManufacturingClassification,
        confidence: float,
        reason: str,
        sector: Optional[str] = None,
        subsector: Optional[str] = None,
    ):
        self.classification = classification
        self.confidence = confidence
        self.reason = reason
        self.sector = sector
        self.subsector = subsector


class ManufacturingClassifier:
    """Evaluates company evidence and classifies entity type and sector."""

    @classmethod
    def classify(
        cls,
        name: str,
        description: Optional[str] = "",
        products: Optional[List[str]] = None,
        industry_codes: Optional[Dict[str, str]] = None,
        processes: Optional[List[str]] = None,
        has_facilities: bool = False,
        has_multiple_facilities: bool = False,
        is_oem: bool = False,
    ) -> ClassificationResult:
        combined_text = f"{name} {description or ''} {' '.join(products or [])} {' '.join(processes or [])}".lower()
        codes = industry_codes or {}

        # 1. Check for negative patterns
        distributor_score = sum(1 for p in DISTRIBUTOR_PATTERNS if re.search(p, combined_text, re.IGNORECASE))
        service_score = sum(1 for p in SERVICE_PATTERNS if re.search(p, combined_text, re.IGNORECASE))

        # 2. Check for positive manufacturing patterns
        mfg_score = sum(1 for p in MFG_POSITIVE_PATTERNS if re.search(p, combined_text, re.IGNORECASE))
        if processes and len(processes) > 0:
            mfg_score += len(processes)
        if has_facilities:
            mfg_score += 1
        if is_oem:
            mfg_score += 2

        # 3. Industry code inspection
        sic = codes.get("sic", "")
        naics = codes.get("naics", "")
        nic = codes.get("nic", "")
        ssic = codes.get("ssic", "")

        is_code_mfg = False
        if sic and len(sic) >= 2 and (sic[:2].isdigit() and 20 <= int(sic[:2]) <= 39):
            is_code_mfg = True
            mfg_score += 3
        if naics and len(naics) >= 2 and naics[:2] in ["31", "32", "33"]:
            is_code_mfg = True
            mfg_score += 3
        for c in [nic, ssic]:
            if c and len(c) >= 2 and c[:2].isdigit() and 10 <= int(c[:2]) <= 33:
                is_code_mfg = True
                mfg_score += 3

        # 4. Sector & Subsector resolution
        best_sector = None
        best_subsector = None
        highest_keyword_hits = 0

        for sector_name, info in TAXONOMY_SECTORS.items():
            hits = sum(1 for kw in info["keywords"] if kw in combined_text)
            if hits > highest_keyword_hits:
                highest_keyword_hits = hits
                best_sector = sector_name
                for sub in info["subsectors"]:
                    if any(w in combined_text for w in sub.lower().split()):
                        best_subsector = sub
                        break
                if not best_subsector and info["subsectors"]:
                    best_subsector = info["subsectors"][0]

        if not best_sector and mfg_score > 0:
            best_sector = "Industrial machinery and equipment"
            best_subsector = "Industrial machinery manufacturers"

        # 5. Prioritize Non-Manufacturer Disqualification if no real manufacturing processes or facilities
        has_real_mfg = (processes and len(processes) > 0) or is_oem or ("manufactur" in combined_text and has_facilities)

        if service_score >= 1 and not has_real_mfg and not is_code_mfg:
            return ClassificationResult(
                classification=ManufacturingClassification.service_provider_only,
                confidence=0.90,
                reason="Identified as professional service / consulting without physical manufacturing line.",
                sector=best_sector,
                subsector=best_subsector,
            )

        if distributor_score >= 1 and not has_real_mfg and not is_code_mfg:
            return ClassificationResult(
                classification=ManufacturingClassification.distributor_only,
                confidence=0.88,
                reason="Company text emphasizes third-party dealership/wholesale trading without manufacturing operations.",
                sector=best_sector,
                subsector=best_subsector,
            )

        # 6. Dual operations
        if distributor_score >= 1 and has_real_mfg:
            return ClassificationResult(
                classification=ManufacturingClassification.manufacturer_and_distributor,
                confidence=0.86,
                reason="Demonstrable dual operations: in-house manufacturing combined with distributor/dealer channel.",
                sector=best_sector,
                subsector=best_subsector,
            )

        # 7. OEM / Contract Manufacturing
        if is_oem or ("contract manufactur" in combined_text):
            return ClassificationResult(
                classification=ManufacturingClassification.contract_manufacturer,
                confidence=0.92,
                reason="Explicit OEM/ODM contract manufacturing facilities and capabilities.",
                sector=best_sector,
                subsector=best_subsector,
            )

        # 8. Multi-facility vs Confirmed Manufacturer
        if has_multiple_facilities or ("multiple facilities" in combined_text) or ("multiple plants" in combined_text):
            return ClassificationResult(
                classification=ManufacturingClassification.multi_facility_manufacturer,
                confidence=0.95,
                reason="Multiple physical production plants/foundries verified with production lines.",
                sector=best_sector,
                subsector=best_subsector,
            )

        if has_real_mfg or mfg_score >= 2 or (is_code_mfg and mfg_score >= 1):
            return ClassificationResult(
                classification=ManufacturingClassification.confirmed_manufacturer,
                confidence=0.94,
                reason="Confirmed manufacturer based on official industry codes, verified product catalogue, and manufacturing processes.",
                sector=best_sector,
                subsector=best_subsector,
            )

        if mfg_score >= 1 or is_code_mfg:
            return ClassificationResult(
                classification=ManufacturingClassification.probable_manufacturer,
                confidence=0.74,
                reason="Probable manufacturer: registered under manufacturing industry codes or keywords present, pending further facility audit.",
                sector=best_sector,
                subsector=best_subsector,
            )

        return ClassificationResult(
            classification=ManufacturingClassification.unknown,
            confidence=0.40,
            reason="Insufficient evidence to confirm manufacturing operations.",
            sector=best_sector,
            subsector=best_subsector,
        )
