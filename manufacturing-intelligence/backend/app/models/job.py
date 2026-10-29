"""
Collection job ORM models — tracks all discovery and enrichment jobs.
"""
import uuid

from sqlalchemy import (
    Boolean, Column, DateTime, Enum, ForeignKey,
    Integer, String, Text, func
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship

from app.database import Base
import enum


class JobStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    PAUSED = "paused"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"


class CollectionJob(Base):
    __tablename__ = "collection_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_name = Column(String(300), nullable=False)
    source_name = Column(String(200), nullable=False, index=True)
    country = Column(String(100), nullable=True)

    status = Column(
        Enum(JobStatus, name="job_status_enum"),
        nullable=False,
        default=JobStatus.PENDING,
        index=True,
    )

    # Progress counters
    total_discovered = Column(Integer, default=0)
    total_accepted = Column(Integer, default=0)
    total_rejected = Column(Integer, default=0)
    total_duplicates = Column(Integer, default=0)
    total_errors = Column(Integer, default=0)
    total_enriched = Column(Integer, default=0)

    # Resumable state
    checkpoint_data = Column(JSONB, nullable=True)  # cursor, last_page, last_id etc.

    # Timing
    started_at = Column(DateTime, nullable=True)
    paused_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    last_activity_at = Column(DateTime, nullable=True)

    # Error info
    error_message = Column(Text, nullable=True)

    # Celery task reference
    celery_task_id = Column(String(200), nullable=True)

    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

    # Relationships
    logs = relationship("JobLog", back_populates="job", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<CollectionJob id={self.id} source='{self.source_name}' status='{self.status}'>"


class JobLog(Base):
    __tablename__ = "job_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(
        UUID(as_uuid=True),
        ForeignKey("collection_jobs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    timestamp = Column(DateTime, default=func.now(), nullable=False, index=True)
    level = Column(String(20), nullable=False, default="INFO")  # INFO, WARNING, ERROR
    message = Column(Text, nullable=False)
    extra_data = Column(JSONB, nullable=True)

    # Relationships
    job = relationship("CollectionJob", back_populates="logs")

    def __repr__(self) -> str:
        return f"<JobLog job={self.job_id} [{self.level}] '{self.message[:50]}'>"


class ExportJob(Base):
    __tablename__ = "export_jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    status = Column(
        Enum(JobStatus, name="export_job_status_enum"),
        nullable=False,
        default=JobStatus.PENDING,
    )
    export_format = Column(String(10), nullable=False)  # csv, excel, json
    filter_params = Column(JSONB, nullable=True)  # stored filter criteria
    field_selection = Column(JSONB, nullable=True)  # list of selected field names
    record_count = Column(Integer, nullable=True)
    file_path = Column(String(2048), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    celery_task_id = Column(String(200), nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=func.now(), nullable=False)
    completed_at = Column(DateTime, nullable=True)

    def __repr__(self) -> str:
        return f"<ExportJob id={self.id} format='{self.export_format}' status='{self.status}'>"
