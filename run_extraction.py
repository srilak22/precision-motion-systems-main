import argparse
import sys
import json
import os
import io

# Ensure UTF-8 output on Windows consoles
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

from src.mining.pipeline import ExtractionPipeline
from src.mining.models import CompanyRecord
from src.mining.deduplicator import CompanyDeduplicator
from src.mining.validator import CompanyDataValidator
from src.mining.exporter import DeliverableExporter

def main():
    parser = argparse.ArgumentParser(description="Form Filling Based Web Mining & Extraction - Robotics & Automation")
    parser.add_argument("--test", action="store_true", help="Run in test mode with small page sample (1 page per model)")
    parser.add_argument("--export-only", action="store_true", help="Rebuild deliverables from existing checkpoint without HTTP requests")
    parser.add_argument("--no-enrich", action="store_true", help="Skip secondary profile page enrichment for fast crawling")
    parser.add_argument("--max-pages", type=int, default=12, help="Max pages per model to crawl (default 12)")
    parser.add_argument("--states", nargs="+", help="Override target states (e.g. --states Michigan California Illinois Ohio)")

    args = parser.parse_args()

    print("======================================================================")
    print("  FORM-FILLING-BASED WEB MINING & EXTRACTION ENGINE")
    print("  Target Domain: Robotics and Industrial Automation")
    print("  Source: Association for Advancing Automation (A3)")
    print("======================================================================\n")

    pipeline = ExtractionPipeline("config/extraction_config.json")

    if args.states:
        pipeline.target_states = args.states
        pipeline.validator = CompanyDataValidator(target_states=args.states)
        print(f"[*] Overridden target states: {args.states}")

    if args.export_only:
        print("[*] Rebuilding deliverables from checkpoint...")
        if not os.path.exists(pipeline.checkpoint_file):
            print(f"[!] Checkpoint file not found: {pipeline.checkpoint_file}")
            sys.exit(1)
        with open(pipeline.checkpoint_file, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
        raw_records = [CompanyRecord(**r) for r in raw_data]
        unique_records, dedup_stats = CompanyDeduplicator.deduplicate_and_merge(raw_records)
        val_summary = pipeline.validator.run_validation_suite(unique_records)
        exporter = DeliverableExporter("output")
        csv_path = exporter.export_csv(unique_records)
        xlsx_path = exporter.export_master_excel(unique_records, val_summary, dedup_stats)
        json_path = exporter.export_json(unique_records)
        val_xlsx = exporter.export_validation_report_excel(val_summary, dedup_stats)
        model_filenames = {
            "MODEL_01": "model_01_industrial_robotics.json",
            "MODEL_02": "model_02_industrial_automation.json",
            "MODEL_03": "model_03_robotic_components.json",
            "MODEL_04": "model_04_motion_control.json",
        }
        for mid, fname in model_filenames.items():
            exporter.export_model_json(unique_records, mid, fname)
        print(f"[✓] Rebuilt deliverables successfully:")
        print(f"    - CSV:  {csv_path}")
        print(f"    - XLSX: {xlsx_path}")
        print(f"    - JSON: {json_path}")
        print(f"    - QA:   {val_xlsx}")
        print(f"    - Model JSONs: {list(model_filenames.values())}")
        sys.exit(0)

    max_pages = 1 if args.test else args.max_pages
    enrich = not args.no_enrich

    print(f"[*] Execution Parameters:")
    print(f"    - Target States: {pipeline.target_states}")
    print(f"    - Max Pages per Model: {max_pages}")
    print(f"    - Profile Enrichment: {enrich}")
    print(f"    - Test Mode: {args.test}\n")

    results = pipeline.run(
        max_pages_per_model=max_pages,
        enrich_profiles=enrich
    )

    print("\n======================================================================")
    print("  EXTRACTION SUMMARY & AUDIT RESULTS")
    print("======================================================================")
    print(f"  Raw Records Extracted:       {results['raw_records_count']}")
    print(f"  Unique Deduplicated Records: {results['unique_records_count']}")
    print(f"  Duplicates Merged:           {results['deduplication_stats']['duplicates_merged_count']}")
    print(f"  Validation Statuses:         {results['validation_summary']['status_counts']}")
    print(f"\n  State Distribution:")
    for st, cnt in sorted(results['validation_summary']['state_distribution'].items(), key=lambda x: x[1], reverse=True):
        print(f"    - {st}: {cnt} companies")

    print(f"\n  Generated Deliverables:")
    for k, v in results['deliverables'].items():
        if isinstance(v, dict):
            for mk, mv in v.items():
                print(f"    - {k} ({mk}): {mv}")
        else:
            print(f"    - {k}: {v}")
    print("======================================================================\n")

if __name__ == "__main__":
    main()
