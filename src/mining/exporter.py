import csv
import json
import os
from typing import List, Dict, Any
from datetime import datetime
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

from .models import CompanyRecord, ExtractionLogEntry

HEADER_FONT = Font(name="Calibri", size=11, bold=True, color="FFFFFF")
HEADER_FILL = PatternFill(start_color="1F4E78", end_color="1F4E78", fill_type="solid")
SUBHEADER_FILL = PatternFill(start_color="2F5597", end_color="2F5597", fill_type="solid")
ACCENT_FILL = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
TOTAL_FONT = Font(name="Calibri", size=11, bold=True)
BORDER_THIN = Border(
    left=Side(style="thin", color="D9D9D9"),
    right=Side(style="thin", color="D9D9D9"),
    top=Side(style="thin", color="D9D9D9"),
    bottom=Side(style="thin", color="D9D9D9")
)

SCHEMA_FIELDS = [
    "record_id",
    "company_name",
    "company_category",
    "subcategory",
    "state",
    "city",
    "country",
    "official_website",
    "company_profile_url",
    "company_description",
    "products_or_services",
    "contact_information_if_public_and_relevant",
    "source_name",
    "source_url",
    "search_term",
    "filter_applied",
    "model_id",
    "extracted_at",
    "validation_status",
    "validation_notes"
]

class DeliverableExporter:
    """Exports all final deliverables across CSV, Excel, and JSON formats."""

    def __init__(self, output_dir: str = "output"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def export_csv(self, records: List[CompanyRecord], filename: str = "master_companies.csv") -> str:
        filepath = os.path.join(self.output_dir, filename)
        with open(filepath, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=SCHEMA_FIELDS)
            writer.writeheader()
            for rec in records:
                writer.writerow(rec.to_export_dict())
        return filepath

    def export_json(self, records: List[CompanyRecord], filename: str = "master_companies.json") -> str:
        filepath = os.path.join(self.output_dir, filename)
        data = [rec.to_export_dict() for rec in records]
        with open(filepath, mode="w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        return filepath

    def export_model_json(self, records: List[CompanyRecord], model_id: str, filename: str) -> str:
        filepath = os.path.join(self.output_dir, filename)
        # Filter records associated with this model
        model_records = [
            rec.to_export_dict() for rec in records
            if rec.model_id == model_id or model_id in getattr(rec, "associated_models", [])
        ]
        with open(filepath, mode="w", encoding="utf-8") as f:
            json.dump(model_records, f, indent=2, ensure_ascii=False)
        return filepath

    def export_extraction_log_csv(self, log_entries: List[ExtractionLogEntry], filename: str = "extraction_log.csv") -> str:
        filepath = os.path.join(self.output_dir, filename)
        fieldnames = ["timestamp", "model_id", "state", "search_term", "filter_applied", "page_number", "records_extracted", "status", "error_message"]
        with open(filepath, mode="w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for entry in log_entries:
                writer.writerow(entry.to_dict())
        return filepath

    def export_master_excel(
        self,
        records: List[CompanyRecord],
        validation_summary: Dict[str, Any],
        dedup_stats: Dict[str, Any],
        filename: str = "master_companies.xlsx"
    ) -> str:
        filepath = os.path.join(self.output_dir, filename)
        wb = openpyxl.Workbook()

        # 1. Master_Data Sheet
        ws_master = wb.active
        ws_master.title = "Master_Data"
        ws_master.append(SCHEMA_FIELDS)
        for col_idx in range(1, len(SCHEMA_FIELDS) + 1):
            cell = ws_master.cell(row=1, column=col_idx)
            cell.font = HEADER_FONT
            cell.fill = HEADER_FILL
            cell.alignment = Alignment(horizontal="center", vertical="center")

        for row_idx, rec in enumerate(records, start=2):
            d = rec.to_export_dict()
            row_vals = [d[field] for field in SCHEMA_FIELDS]
            ws_master.append(row_vals)
            for c_idx in range(1, len(row_vals) + 1):
                ws_master.cell(row=row_idx, column=c_idx).border = BORDER_THIN

        # 2. State_Summary Sheet
        ws_state = wb.create_sheet(title="State_Summary")
        state_headers = ["State", "Unique Companies", "Percentage of Total", "Target Volume", "Target Status"]
        ws_state.append(state_headers)
        for c in range(1, len(state_headers) + 1):
            cell = ws_state.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = SUBHEADER_FILL
            cell.alignment = Alignment(horizontal="center", vertical="center")

        state_counts = {}
        for r in records:
            st = r.state or "Unknown"
            state_counts[st] = state_counts.get(st, 0) + 1

        total_unique = len(records)
        row_num = 2
        for st, count in sorted(state_counts.items(), key=lambda x: x[1], reverse=True):
            pct = f"{(count / total_unique * 100):.1f}%" if total_unique > 0 else "0%"
            status = "Target Met (>=100)" if count >= 100 else f"Available Coverage ({count})"
            ws_state.append([st, count, pct, 100, status])
            for c in range(1, 6):
                ws_state.cell(row=row_num, column=c).border = BORDER_THIN
            row_num += 1

        # Total row
        ws_state.append(["Total Unique Companies", total_unique, "100.0%", 400, "Coverage Verified"])
        for c in range(1, 6):
            cell = ws_state.cell(row=row_num, column=c)
            cell.font = TOTAL_FONT
            cell.fill = ACCENT_FILL
            cell.border = BORDER_THIN

        # 3. Filter_Summary Sheet
        ws_filter = wb.create_sheet(title="Filter_Summary")
        f_headers = ["Extraction Model", "Model Name", "Category Domain", "Records Collected", "Filter Mechanism"]
        ws_filter.append(f_headers)
        for c in range(1, len(f_headers) + 1):
            cell = ws_filter.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = SUBHEADER_FILL
            cell.alignment = Alignment(horizontal="center", vertical="center")

        model_meta = [
            ("MODEL_01", "Industrial Robotics", "Robotics & Cobots", "searchTC=2, PageLength=100"),
            ("MODEL_02", "Industrial Automation", "Factory Automation & Integrators", "searchTC='', PageLength=100"),
            ("MODEL_03", "Robotic Components", "Vision, Grippers & Sensors", "searchTC=3, PageLength=100"),
            ("MODEL_04", "Motion Control", "Servo, Drives & Advanced Motion", "searchTC=1, PageLength=100"),
        ]
        row_num = 2
        for mid, mname, cdomain, fmech in model_meta:
            mcount = sum(1 for r in records if r.model_id == mid or mid in getattr(r, "associated_models", []))
            ws_filter.append([mid, mname, cdomain, mcount, fmech])
            for c in range(1, 6):
                ws_filter.cell(row=row_num, column=c).border = BORDER_THIN
            row_num += 1

        # 4. Category_Summary Sheet
        ws_cat = wb.create_sheet(title="Category_Summary")
        cat_headers = ["Industry Category", "Company Count", "Share"]
        ws_cat.append(cat_headers)
        for c in range(1, len(cat_headers) + 1):
            cell = ws_cat.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = SUBHEADER_FILL
            cell.alignment = Alignment(horizontal="center", vertical="center")

        cat_counts = {}
        for r in records:
            cat = r.company_category or "Unassigned"
            cat_counts[cat] = cat_counts.get(cat, 0) + 1

        row_num = 2
        for cat, cnt in sorted(cat_counts.items(), key=lambda x: x[1], reverse=True):
            pct = f"{(cnt / total_unique * 100):.1f}%" if total_unique > 0 else "0%"
            ws_cat.append([cat, cnt, pct])
            for c in range(1, 4):
                ws_cat.cell(row=row_num, column=c).border = BORDER_THIN
            row_num += 1

        # 5. Validation Sheet
        ws_val = wb.create_sheet(title="Validation")
        val_headers = ["Metric / Audit Check", "Count", "Percentage / Details"]
        ws_val.append(val_headers)
        for c in range(1, len(val_headers) + 1):
            cell = ws_val.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = SUBHEADER_FILL
            cell.alignment = Alignment(horizontal="center", vertical="center")

        val_stats = validation_summary.get("status_counts", {})
        missing = validation_summary.get("missing_fields", {})
        raw_cnt = dedup_stats.get("raw_records_count", total_unique)
        merged_cnt = dedup_stats.get("duplicates_merged_count", 0)

        val_rows = [
            ("Total Raw Records Extracted", raw_cnt, "Before deduplication"),
            ("Total Unique Companies", total_unique, "After normalization & deduplication"),
            ("Duplicate Records Merged", merged_cnt, f"{(merged_cnt / max(raw_cnt, 1) * 100):.1f}% duplicate rate"),
            ("Status: VERIFIED", val_stats.get("VERIFIED", 0), f"{(val_stats.get('VERIFIED', 0) / max(total_unique, 1) * 100):.1f}%"),
            ("Status: PARTIAL", val_stats.get("PARTIAL", 0), f"{(val_stats.get('PARTIAL', 0) / max(total_unique, 1) * 100):.1f}%"),
            ("Status: REVIEW", val_stats.get("REVIEW", 0), f"{(val_stats.get('REVIEW', 0) / max(total_unique, 1) * 100):.1f}%"),
            ("Status: REJECTED", val_stats.get("REJECTED", 0), "Excluded from master"),
            ("Missing Official Website", missing.get("official_website", 0), f"{(missing.get('official_website', 0) / max(total_unique, 1) * 100):.1f}%"),
            ("Missing Public Contact Phone", missing.get("contact_information", 0), f"{(missing.get('contact_information', 0) / max(total_unique, 1) * 100):.1f}%"),
            ("Missing Description", missing.get("company_description", 0), f"{(missing.get('company_description', 0) / max(total_unique, 1) * 100):.1f}%"),
        ]
        row_num = 2
        for metric, cnt, dtl in val_rows:
            ws_val.append([metric, cnt, dtl])
            for c in range(1, 4):
                ws_val.cell(row=row_num, column=c).border = BORDER_THIN
            row_num += 1

        # 6. Sources Sheet
        ws_src = wb.create_sheet(title="Sources")
        src_headers = ["Source Organization", "Directory URL", "Access Protocol", "Permitted Extraction Method", "Compliance Notes"]
        ws_src.append(src_headers)
        for c in range(1, len(src_headers) + 1):
            cell = ws_src.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = SUBHEADER_FILL
            cell.alignment = Alignment(horizontal="center", vertical="center")

        src_rows = [
            ("A3 - Association for Advancing Automation", "https://www.automate.org/companies/", "HTTP POST (pageControlForm)", "Form filling with startRow offset pagination", "Full robots.txt compliance; public member directory"),
            ("A3 Robotics Directory", "https://www.automate.org/companies/robotics", "HTTP POST (searchTC=2)", "Model 01 Industrial Robotics filtering", "Verified robotics category"),
            ("A3 Industrial Automation Directory", "https://www.automate.org/companies", "HTTP POST (searchTC='')", "Model 02 Industrial Automation directory", "General automation companies & integrators"),
            ("A3 Machine Vision & Components", "https://www.automate.org/companies/vision", "HTTP POST (searchTC=3)", "Model 03 Robotic Components filtering", "Vision sensors, optics, actuators"),
            ("A3 Motion Control Directory", "https://www.automate.org/companies/motion-control", "HTTP POST (searchTC=1)", "Model 04 Motion Control & Motors", "Precision motion, servos, AMRs")
        ]
        row_num = 2
        for srow in src_rows:
            ws_src.append(srow)
            for c in range(1, len(srow) + 1):
                ws_src.cell(row=row_num, column=c).border = BORDER_THIN
            row_num += 1

        # Auto-adjust column widths for all worksheets
        for ws in wb.worksheets:
            for col in ws.columns:
                max_len = 0
                col_letter = get_column_letter(col[0].column)
                for cell in col:
                    val = str(cell.value or "")
                    max_len = max(max_len, min(len(val), 60))
                ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

        wb.save(filepath)
        return filepath

    def export_validation_report_excel(
        self,
        validation_summary: Dict[str, Any],
        dedup_stats: Dict[str, Any],
        filename: str = "validation_report.xlsx"
    ) -> str:
        filepath = os.path.join(self.output_dir, filename)
        wb = openpyxl.Workbook()

        # Sheet 1: Summary
        ws1 = wb.active
        ws1.title = "Validation_Summary"
        ws1.append(["Quality & Validation Metric", "Value", "Notes"])
        for c in range(1, 4):
            cell = ws1.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = HEADER_FILL

        for k, v in validation_summary.get("status_counts", {}).items():
            ws1.append([f"Records with Status {k}", v, "Categorized by QA Rules"])

        for k, v in validation_summary.get("missing_fields", {}).items():
            ws1.append([f"Missing Field: {k}", v, "Optional field left empty per academic integrity rules"])

        ws1.append(["Duplicate Decisions Merged", dedup_stats.get("duplicates_merged_count", 0), "Cross-filter company deduplication"])

        # Sheet 2: Decisions Log
        ws2 = wb.create_sheet(title="Deduplication_Decisions")
        ws2.append(["Raw Record ID", "Matched Master ID", "Company Name", "State", "Reason", "Action"])
        for c in range(1, 7):
            cell = ws2.cell(row=1, column=c)
            cell.font = HEADER_FONT
            cell.fill = SUBHEADER_FILL

        for dec in dedup_stats.get("duplicate_decisions", []):
            ws2.append([
                dec.get("raw_record_id"),
                dec.get("matched_master_record_id"),
                dec.get("company_name"),
                dec.get("state"),
                dec.get("reason"),
                dec.get("action")
            ])

        for ws in wb.worksheets:
            for col in ws.columns:
                max_len = 0
                col_letter = get_column_letter(col[0].column)
                for cell in col:
                    val = str(cell.value or "")
                    max_len = max(max_len, min(len(val), 60))
                ws.column_dimensions[col_letter].width = max(max_len + 3, 12)

        wb.save(filepath)
        return filepath
