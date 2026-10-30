"""
FastAPI Router for Collection Jobs management (run, pause, resume, cancel, logs).
"""
from __future__ import annotations

import asyncio
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, BackgroundTasks
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.job import CollectionJob, JobLog, JobStatus
from app.schemas.job import (
    JobResponse,
    JobDetailResponse,
    JobCreateRequest,
    JobLogResponse,
)
from app.workers.collector import CollectionWorker, RUNNING_JOBS, PAUSED_JOBS

router = APIRouter(prefix="/jobs", tags=["Collection Jobs"])


@router.get("", response_model=List[JobResponse])
async def list_jobs(
    status: Optional[str] = Query(None),
    limit: int = 50,
    db: AsyncSession = Depends(get_db),
):
    """Lists collection jobs sorted by most recent."""
    stmt = select(CollectionJob).order_by(desc(CollectionJob.created_at)).limit(limit)
    if status:
        status_list = [s.strip().lower() for s in status.split(",")]
        stmt = stmt.where(CollectionJob.status.in_(status_list))

    res = await db.execute(stmt)
    jobs = res.scalars().all()
    return [_format_job_response(j) for j in jobs]


@router.post("", response_model=JobResponse)
async def create_and_trigger_job(
    req: JobCreateRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Creates a new collection job and launches worker in the background."""
    job = CollectionJob(
        job_name=f"Collection: {req.source_name}",
        source_name=req.source_name,
        status=JobStatus.PENDING,
    )
    db.add(job)
    await db.commit()
    await db.refresh(job)

    # Launch in background
    background_tasks.add_task(
        CollectionWorker.run_collection_job,
        job.id,
        req.source_name,
        req.target_count or 1000,
    )

    return _format_job_response(job)


@router.get("/{job_id}", response_model=JobDetailResponse)
async def get_job_detail(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Retrieves full job details including recent log entries and checkpoints."""
    stmt = (
        select(CollectionJob)
        .options(selectinload(CollectionJob.logs))
        .where(CollectionJob.id == job_id)
    )
    res = await db.execute(stmt)
    job = res.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    resp_dict = _format_job_response(job)
    resp_dict["checkpoint_data"] = job.checkpoint_data or {}
    resp_dict["logs"] = [
        {
            "id": str(log.id),
            "job_id": str(log.job_id),
            "level": log.level,
            "message": log.message,
            "timestamp": log.timestamp,
            "extra_data": log.extra_data,
        }
        for log in sorted(job.logs, key=lambda l: l.timestamp, reverse=True)[:100]
    ]
    return resp_dict


@router.post("/{job_id}/pause", response_model=JobResponse)
async def pause_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Pauses a running job safely at its current batch checkpoint."""
    job = await db.get(CollectionJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    key = str(job_id)
    PAUSED_JOBS[key] = True
    job.status = JobStatus.PAUSED
    await db.commit()
    return _format_job_response(job)


@router.post("/{job_id}/resume", response_model=JobResponse)
async def resume_job(
    job_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Resumes a paused job from its persistent checkpoint."""
    job = await db.get(CollectionJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    key = str(job_id)
    PAUSED_JOBS[key] = False
    RUNNING_JOBS[key] = True

    background_tasks.add_task(
        CollectionWorker.run_collection_job,
        job.id,
        job.source_name,
        1000,
    )

    return _format_job_response(job)


@router.post("/{job_id}/cancel", response_model=JobResponse)
async def cancel_job(
    job_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
):
    """Cancels a running or paused collection job."""
    job = await db.get(CollectionJob, job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found.")

    key = str(job_id)
    RUNNING_JOBS[key] = False
    job.status = JobStatus.CANCELLED
    await db.commit()
    return _format_job_response(job)


@router.get("/{job_id}/logs", response_model=List[JobLogResponse])
async def get_job_logs(
    job_id: uuid.UUID,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
):
    """Returns log entries for a job in chronological order."""
    stmt = (
        select(JobLog)
        .where(JobLog.job_id == job_id)
        .order_by(desc(JobLog.timestamp))
        .limit(limit)
    )
    res = await db.execute(stmt)
    logs = res.scalars().all()
    return [
        JobLogResponse(
            id=str(l.id),
            job_id=str(l.job_id),
            level=l.level,
            message=l.message,
            timestamp=l.timestamp,
            extra_data=l.extra_data,
        )
        for l in logs
    ]


def _format_job_response(j: CollectionJob) -> dict:
    total = j.total_accepted + j.total_rejected + j.total_duplicates
    pct = round((j.total_accepted / max(1, j.total_accepted + 500)) * 100, 1) if j.status == JobStatus.RUNNING else (100.0 if j.status == JobStatus.COMPLETED else 0.0)

    return {
        "id": str(j.id),
        "job_name": j.job_name,
        "source_name": j.source_name,
        "country": j.country,
        "status": j.status.value if hasattr(j.status, "value") else str(j.status),
        "total_discovered": j.total_discovered,
        "total_accepted": j.total_accepted,
        "total_rejected": j.total_rejected,
        "total_duplicates": j.total_duplicates,
        "total_errors": j.total_errors,
        "total_enriched": j.total_enriched,
        "started_at": j.started_at,
        "paused_at": j.paused_at,
        "completed_at": j.completed_at,
        "last_activity_at": j.last_activity_at,
        "error_message": j.error_message,
        "progress_percent": pct,
    }

