"""
FastAPI Router for Async Export Jobs and File Downloads (CSV, Excel, JSON).
"""
from __future__ import annotations

import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.job import ExportJob, JobStatus
from app.schemas.job import ExportRequest, ExportJobResponse
from app.workers.exporter import ExportWorker

router = APIRouter(prefix="/export", tags=["Exports"])


@router.post("", response_model=ExportJobResponse)
async def trigger_export_job(
    req: ExportRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Schedules background file generation based on filters and chosen format."""
    job = ExportJob(
        export_format=req.format.lower(),
        filter_params=req.model_dump(),
        status=JobStatus.PENDING,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    background_tasks.add_task(
        ExportWorker.run_export_job,
        job.id,
        req.format,
        {
            "countries": req.countries,
            "industries": req.industries,
            "verified_only": req.verified_only,
        },
        req.fields,
    )

    return _format_export_response(job)


@router.get("", response_model=List[ExportJobResponse])
async def list_export_jobs(
    limit: int = 20,
    db: AsyncSession = Depends(get_db),
):
    """Lists recent export jobs and their download status."""
    stmt = select(ExportJob).order_by(desc(ExportJob.created_at)).limit(limit)
    res = await db.execute(stmt)
    jobs = res.scalars().all()
    return [_format_export_response(j) for j in jobs]


@router.get("/{job_id}", response_model=ExportJobResponse)
async def get_export_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retrieves export job status and file size."""
    job = await db.get(ExportJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Export job not found.")
    return _format_export_response(job)


@router.get("/{job_id}/download")
async def download_export_file(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Downloads the generated CSV, Excel, or JSON file."""
    job = await db.get(ExportJob, job_id)
    if not job or not job.file_path or not os.path.exists(job.file_path):
        raise HTTPException(status_code=404, detail="Export file not ready or not found.")

    ext = job.export_format.lower()
    media_types = {
        "csv": "text/csv",
        "excel": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "json": "application/json",
    }
    filename = os.path.basename(job.file_path)

    return FileResponse(
        path=job.file_path,
        media_type=media_types.get(ext, "application/octet-stream"),
        filename=filename,
    )


def _format_export_response(j: ExportJob) -> dict:
    return {
        "id": str(j.id),
        "status": j.status.value if hasattr(j.status, "value") else str(j.status),
        "export_format": j.export_format,
        "record_count": j.record_count or 0,
        "file_size_bytes": j.file_size_bytes or 0,
        "download_url": f"/api/v1/export/{j.id}/download" if j.status == JobStatus.COMPLETED else None,
        "created_at": j.created_at,
        "completed_at": j.completed_at,
        "error_message": j.error_message,
    }

