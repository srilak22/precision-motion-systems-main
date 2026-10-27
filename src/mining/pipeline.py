import os
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime, timezone

from .models import CompanyRecord, ExtractionLogEntry
from .client import FormMiningClient
from .parser import DirectoryHTMLParser
from .validator import CompanyDataValidator
from .deduplicator import CompanyDeduplicator
from .exporter import DeliverableExporter

logger = logging.getLogger("mining.pipeline")

class ExtractionPipeline:
    """End-to-end extraction pipeline orchestrator."""

    def __init__(self, config_path: str = "config/extraction_config.json"):
        self.config_path = config_path
        self.config = self._load_json(config_path)
        self.target_states = self.config.get("default_states", ["Michigan", "California", "Illinois", "Ohio"])
        self.target_per_state = self.config.get("target_records_per_state", 100)
        self.max_overall = self.config.get("max_overall_records", 400)

        # Setup client
        req_cfg = self.config.get("request_settings", {})
        self.client = FormMiningClient(
            user_agent=req_cfg.get("user_agent"),
            timeout=req_cfg.get("timeout_seconds", 15),
            delay=req_cfg.get("delay_between_requests_seconds", 0.5),
            max_retries=req_cfg.get("max_retries", 3),
            backoff_factor=req_cfg.get("retry_backoff_factor", 1.5)
        )

        self.models_dir = self.config.get("directories", {}).get("models_dir", "config/models")
        self.output_dir = self.config.get("directories", {}).get("output_dir", "output")
        self.checkpoint_file = os.path.join(self.output_dir, "extraction_checkpoint.json")

        self.models = self._load_models()
        self.validator = CompanyDataValidator(target_states=self.target_states)
        self.exporter = DeliverableExporter(output_dir=self.output_dir)

        self.raw_records: List[CompanyRecord] = []
        self.log_entries: List[ExtractionLogEntry] = []

    def _load_json(self, path: str) -> Dict[str, Any]:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _load_models(self) -> List[Dict[str, Any]]:
        models = []
        if os.path.exists(self.models_dir):
            for fname in sorted(os.listdir(self.models_dir)):
                if fname.endswith(".json"):
                    fpath = os.path.join(self.models_dir, fname)
                    models.append(self._load_json(fpath))
        return models

    def run(self, max_pages_per_model: int = 12, enrich_profiles: bool = True, target_total: int = 400) -> Dict[str, Any]:
        """Runs extraction across configured models and target states."""
        logger.info(f"Starting extraction pipeline across {len(self.models)} models and states: {self.target_states}")
        print(f"[*] Starting extraction pipeline across {len(self.models)} models and states: {self.target_states}")

        rec_counter = 1
        known_profile_urls = set()

        # Category mapping for models
        model_cat_map = {
            "MODEL_01": ("Industrial Robotics", "Robotics & Automation"),
            "MODEL_02": ("Industrial Automation", "Factory Automation & Integration"),
            "MODEL_03": ("Robotic Components", "Sensors, Vision & Tooling"),
            "MODEL_04": ("Motion Control", "Precision Motion & Servos"),
        }

        profile_cache: Dict[str, Dict[str, Any]] = {}

        for model in self.models:
            mid = model.get("model_id")
            mname = model.get("model_name")
            source_url = model.get("source_url")
            filter_fields = model.get("supported_filter_fields", {})
            search_tc = filter_fields.get("searchTC", "")
            cat_name, subcat_name = model_cat_map.get(mid, ("Industrial Automation", "General"))

            print(f"\n[+] Executing Model {mid}: {mname} at {source_url} (searchTC='{search_tc}')")

            for page_idx in range(max_pages_per_model):
                start_row = page_idx * 100 + 1
                form_data = {
                    "PageLength": "100",
                    "PageLetter": "",
                    "startRow": str(start_row),
                    "searchTerm": "",
                    "searchApp": "0",
                    "searchInd": "",
                    "searchTC": str(search_tc)
                }

                filter_desc = f"searchTC={search_tc}, PageLength=100, startRow={start_row}"
                html = self.client.post_form(source_url, form_data)

                if not html:
                    logger.warning(f"Failed to fetch page {page_idx+1} for model {mid}")
                    self.log_entries.append(ExtractionLogEntry(
                        timestamp=datetime.now(timezone.utc).isoformat(),
                        model_id=mid,
                        state="All Target States",
                        search_term="",
                        filter_applied=filter_desc,
                        page_number=page_idx + 1,
                        records_extracted=0,
                        status="FAILED",
                        error_message="Network or HTTP error"
                    ))
                    break

                # Parse visible company cards
                cards = DirectoryHTMLParser.parse_listing_page(html)
                if not cards:
                    logger.info(f"Model {mid} reached end of directory at startRow={start_row}")
                    break

                page_extracted = 0
                for card in cards:
                    cname = card["company_name"]
                    purl = card["company_profile_url"]
                    st = card["state"]
                    city = card["city"]
                    country = card["country"] or "United States"

                    # Check state confinement
                    st_norm = DirectoryHTMLParser.normalize_state(st)
                    if st_norm not in self.target_states:
                        # Skip companies outside our selected geographic scope
                        continue

                    # Enrich from profile page if requested
                    prof_data = {}
                    if enrich_profiles and purl:
                        if purl in profile_cache:
                            prof_data = profile_cache[purl]
                        else:
                            prof_html = self.client.get(purl)
                            if prof_html:
                                prof_data = DirectoryHTMLParser.parse_profile_page(prof_html)
                                profile_cache[purl] = prof_data

                        # If profile had refined city/state, update them
                        if prof_data.get("city") and not city:
                            city = prof_data["city"]
                        if prof_data.get("state") and not st_norm:
                            st_norm = DirectoryHTMLParser.normalize_state(prof_data["state"])

                    record_id = f"REC-{st_norm[:2].upper()}-{mid[:5]}-{rec_counter:04d}"
                    rec_counter += 1

                    desc = prof_data.get("description", "")
                    if not desc:
                        desc = f"{cname} is a member of the Association for Advancing Automation (A3) based in {st_norm}, specializing in {cat_name}."

                    prods = prof_data.get("products_or_services", "")
                    if not prods:
                        prods = f"{cat_name}, {subcat_name}"

                    contact = prof_data.get("contact_phone", "")
                    web = prof_data.get("official_website", "")

                    rec = CompanyRecord(
                        record_id=record_id,
                        company_name=cname,
                        company_category=cat_name,
                        subcategory=subcat_name,
                        state=st_norm,
                        city=city,
                        country=country,
                        official_website=web,
                        company_profile_url=purl,
                        company_description=desc,
                        products_or_services=prods,
                        contact_information_if_public_and_relevant=contact,
                        source_name="Association for Advancing Automation (A3)",
                        source_url=source_url,
                        search_term=st_norm,
                        filter_applied=filter_desc,
                        model_id=mid,
                        extracted_at=datetime.now(timezone.utc).isoformat()
                    )

                    self.raw_records.append(rec)
                    page_extracted += 1

                self.log_entries.append(ExtractionLogEntry(
                    timestamp=datetime.now(timezone.utc).isoformat(),
                    model_id=mid,
                    state="Target States",
                    search_term="",
                    filter_applied=filter_desc,
                    page_number=page_idx + 1,
                    records_extracted=page_extracted,
                    status="SUCCESS"
                ))

                print(f"  -> Page {page_idx+1} (startRow={start_row}): {page_extracted} companies matched target states. Total raw: {len(self.raw_records)}")

                # Incremental Checkpoint
                self._save_checkpoint()

        print(f"\n[+] Raw extraction complete: {len(self.raw_records)} records collected.")

        # Deduplication
        print("[+] Executing deduplication and multi-model association merging...")
        unique_records, dedup_stats = CompanyDeduplicator.deduplicate_and_merge(self.raw_records)
        print(f"  -> {dedup_stats['unique_records_count']} unique companies, {dedup_stats['duplicates_merged_count']} duplicates merged.")

        # Quality Assurance & Validation
        print("[+] Running Automated Validation Suite...")
        val_summary = self.validator.run_validation_suite(unique_records)
        print(f"  -> Validation Statuses: {val_summary['status_counts']}")

        # Deliverables Generation
        print("[+] Generating Output Deliverables (CSV, XLSX, JSON)...")
        csv_path = self.exporter.export_csv(unique_records, "master_companies.csv")
        json_path = self.exporter.export_json(unique_records, "master_companies.json")
        xlsx_path = self.exporter.export_master_excel(unique_records, val_summary, dedup_stats, "master_companies.xlsx")
        val_xlsx_path = self.exporter.export_validation_report_excel(val_summary, dedup_stats, "validation_report.xlsx")
        log_path = self.exporter.export_extraction_log_csv(self.log_entries, "extraction_log.csv")

        # Export individual model JSON files
        model_filenames = {
            "MODEL_01": "model_01_industrial_robotics.json",
            "MODEL_02": "model_02_industrial_automation.json",
            "MODEL_03": "model_03_robotic_components.json",
            "MODEL_04": "model_04_motion_control.json",
        }
        model_json_files = {}
        for m in self.models:
            mid = m["model_id"]
            fname = model_filenames.get(mid, f"{mid.lower()}.json")
            mpath = self.exporter.export_model_json(unique_records, mid, fname)
            model_json_files[mid] = mpath

        results = {
            "raw_records_count": len(self.raw_records),
            "unique_records_count": len(unique_records),
            "deduplication_stats": dedup_stats,
            "validation_summary": val_summary,
            "deliverables": {
                "master_csv": csv_path,
                "master_xlsx": xlsx_path,
                "master_json": json_path,
                "validation_report_xlsx": val_xlsx_path,
                "extraction_log_csv": log_path,
                "models_json": model_json_files
            }
        }
        return results

    def _save_checkpoint(self):
        try:
            data = [r.to_export_dict() for r in self.raw_records]
            with open(self.checkpoint_file, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as e:
            logger.warning(f"Failed to save checkpoint: {e}")
