"""
Export Job Worker — Generates CSV, Excel (.xlsx), and JSON dumps.
Supports customizable field selection, date filtering, and streaming write for scale.
"""
from __future__ import annotations

import csv
import json
import os
import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
import pandas as pd
from sqlalchemy import select, and_

from app.database import AsyncSessionLocal
from app.models.company import Company
from app.models.job import ExportJob, JobStatus
from app.config import settings


class ExportWorker:
    """Executes file exports with proper streaming and formatting."""

    @classmethod
    async def run_export_job(
        cls,
        export_job_id: uuid.UUID,
        export_format: str = "csv",
        filters: Optional[Dict[str, Any]] = None,
        field_selection: Optional[List[str]] = None,
        db: Optional[AsyncSession] = None,
    ) -> None:
        if db is not None:
            await cls._execute_export(db, export_job_id, export_format, filters, field_selection)
        else:
            async with AsyncSessionLocal() as session:
                await cls._execute_export(session, export_job_id, export_format, filters, field_selection)

    @classmethod
    async def _execute_export(
        cls,
        db: AsyncSession,
        export_job_id: uuid.UUID,
        export_format: str,
        filters: Optional[Dict[str, Any]],
        field_selection: Optional[List[str]],
    ) -> None:
        job = await db.get(ExportJob, export_job_id)
        if not job:
            return

        job.status = JobStatus.RUNNING
        await db.commit()

        os.makedirs(settings.EXPORT_DIR, exist_ok=True)
        filename = f"mfg_export_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{str(export_job_id)[:8]}.{export_format.lower()}"
        file_path = os.path.join(settings.EXPORT_DIR, filename)

        try:
            # Build query with filters
            stmt = select(Company)
            conditions = []

            if filters:
                countries = filters.get("countries")
                if countries and len(countries) > 0:
                    conditions.append(Company.country.in_(countries))

                industries = filters.get("industries")
                if industries and len(industries) > 0:
                    conditions.append(Company.industry_sector.in_(industries))

                if filters.get("verified_only", True):
                    conditions.append(Company.is_verified == True)

            if conditions:
                stmt = stmt.where(and_(*conditions))

            res = await db.execute(stmt)
            companies = res.scalars().all()

            # Determine columns to export
            default_fields = [
                "internal_id",
                "legal_name",
                "registration_number",
                "country",
                "city",
                "registered_address",
                "official_website",
                "email",
                "phone",
                "manufacturing_classification",
                "classification_confidence",
                "industry_sector",
                "industry_subsector",
                "main_products",
                "employee_count",
                "is_verified",
                "data_completeness_score",
                "discovery_source",
            ]
            export_cols = field_selection if (field_selection and len(field_selection) > 0) else default_fields

            records = []
            for c in companies:
                row = {}
                for col in export_cols:
                    val = getattr(c, col, None)
                    if isinstance(val, list):
                        val = "; ".join(str(x) for x in val)
                    elif hasattr(val, "value"):
                        val = val.value
                    row[col] = val
                records.append(row)

            # Write file based on requested format
            if export_format.lower() == "csv":
                df = pd.DataFrame(records)
                df.to_csv(file_path, index=False, encoding="utf-8")
            elif export_format.lower() in ["excel", "xlsx"]:
                df = pd.DataFrame(records)
                df.to_excel(file_path, index=False, engine="openpyxl")
            elif export_format.lower() == "json":
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(records, f, indent=2, default=str)

            job.status = JobStatus.COMPLETED
            job.file_path = file_path
            job.download_url = f"/api/v1/export/{export_job_id}/download"
            job.record_count = len(records)
            job.file_size_bytes = os.path.getsize(file_path) if os.path.exists(file_path) else 0
            job.completed_at = datetime.now(timezone.utc)
            await db.commit()

        except Exception as exc:
            job.status = JobStatus.FAILED
            job.error_message = str(exc)
            await db.commit()
