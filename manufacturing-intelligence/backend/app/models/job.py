"""
Collection job and Export job ORM models — tracks discovery, enrichment, and export tasks.
"""
from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import Optional, Any

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.compat import GUID, JsonCompatible


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class CollectionJob(Base):
    """Tracks background data discovery and enrichment jobs."""

    __tablename__ = "collection_jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
    )
    job_name: Mapped[str] = mapped_column(String(300), nullable=False)
    source_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    country: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="job_status_enum", native_enum=False),
        nullable=False,
        default=JobStatus.PENDING,
        index=True,
    )

    # Progress counters
    total_discovered: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_accepted: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_rejected: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_duplicates: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_errors: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_enriched: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    # Resumable state / checkpoints
    checkpoint_data: Mapped[Optional[Any]] = mapped_column(JsonCompatible, nullable=True)

    # Timing
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    paused_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_activity_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    # Error info
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Celery / async task reference
    celery_task_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    # Relationships
    logs = relationship("JobLog", back_populates="job", cascade="all, delete-orphan", lazy="selectin")

    def __repr__(self) -> str:
        return f"<CollectionJob id={self.id} source='{self.source_name}' status='{self.status}'>"


class JobLog(Base):
    """Structured log entries per collection job."""

    __tablename__ = "job_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
    )
    job_id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        ForeignKey("collection_jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
    level: Mapped[str] = mapped_column(String(20), nullable=False, default="INFO")
    message: Mapped[str] = mapped_column(Text, nullable=False)
    extra_data: Mapped[Optional[Any]] = mapped_column(JsonCompatible, nullable=True)

    # Relationships
    job = relationship("CollectionJob", back_populates="logs")

    def __repr__(self) -> str:
        return f"<JobLog job={self.job_id} [{self.level}] '{self.message[:50]}'>"


class ExportJob(Base):
    """Background file export jobs (CSV, Excel, JSON)."""

    __tablename__ = "export_jobs"

    id: Mapped[uuid.UUID] = mapped_column(
        GUID,
        primary_key=True,
        default=uuid.uuid4,
    )
    status: Mapped[JobStatus] = mapped_column(
        Enum(JobStatus, name="export_job_status_enum", native_enum=False),
        nullable=False,
        default=JobStatus.PENDING,
        index=True,
    )
    export_format: Mapped[str] = mapped_column(String(10), nullable=False)  # csv, excel, json
    filter_params: Mapped[Optional[Any]] = mapped_column(JsonCompatible, nullable=True)
    field_selection: Mapped[Optional[Any]] = mapped_column(JsonCompatible, nullable=True)
    record_count: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    file_path: Mapped[Optional[str]] = mapped_column(String(2048), nullable=True)
    file_size_bytes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    download_url: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    celery_task_id: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    error_message: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    def __repr__(self) -> str:
        return f"<ExportJob id={self.id} format='{self.export_format}' status='{self.status}'>"
