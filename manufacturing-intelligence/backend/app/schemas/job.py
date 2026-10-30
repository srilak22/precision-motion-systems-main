"""
Pydantic schemas for Collection Jobs, Job Logs, and Exports.
"""
from __future__ import annotations

from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, ConfigDict


class JobCreateRequest(BaseModel):
    source_name: str
    target_count: Optional[int] = 1000
    parameters: Optional[Dict[str, Any]] = None


class JobLogResponse(BaseModel):
    id: str
    job_id: str
    level: str
    message: str
    timestamp: datetime
    extra_data: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(from_attributes=True)


class JobResponse(BaseModel):
    id: str
    job_name: str
    source_name: str
    country: Optional[str] = None
    status: str
    total_discovered: int
    total_accepted: int
    total_rejected: int
    total_duplicates: int
    total_errors: int
    total_enriched: int
    started_at: Optional[datetime] = None
    paused_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    last_activity_at: Optional[datetime] = None
    error_message: Optional[str] = None
    progress_percent: float = 0.0

    model_config = ConfigDict(from_attributes=True)


class JobDetailResponse(JobResponse):
    logs: List[JobLogResponse] = []
    checkpoint_data: Optional[Dict[str, Any]] = None


class ExportRequest(BaseModel):
    format: str = "csv"  # csv, excel, json
    countries: Optional[List[str]] = None
    industries: Optional[List[str]] = None
    verified_only: Optional[bool] = True
    fields: Optional[List[str]] = None
    date_from: Optional[str] = None
    date_to: Optional[str] = None


class ExportJobResponse(BaseModel):
    id: str
    status: str
    export_format: str
    record_count: Optional[int] = 0
    file_size_bytes: Optional[int] = 0
    download_url: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

