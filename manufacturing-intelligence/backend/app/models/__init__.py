"""
Models package — import all models here so SQLAlchemy / Alembic detects them.
"""
from app.models.compat import GUID, StringListType, JsonCompatible
from app.models.company import (
    Company,
    LegalStatus,
    ManufacturingClassification,
    EmployeeCountRange,
    EmployeeRange,
    ReviewStatus,
)
from app.models.person import Person, RoleType
from app.models.financial import Financial
from app.models.source import Source, DataSource, FieldEvidence, VerificationStatus, SourceType
from app.models.job import CollectionJob, JobLog, ExportJob, JobStatus
from app.models.duplicate import DuplicateCandidate, DuplicateCandidateStatus

__all__ = [
    "GUID",
    "StringListType",
    "JsonCompatible",
    "Company",
    "LegalStatus",
    "ManufacturingClassification",
    "EmployeeCountRange",
    "EmployeeRange",
    "ReviewStatus",
    "Person",
    "RoleType",
    "Financial",
    "Source",
    "DataSource",
    "FieldEvidence",
    "VerificationStatus",
    "SourceType",
    "CollectionJob",
    "JobLog",
    "ExportJob",
    "JobStatus",
    "DuplicateCandidate",
    "DuplicateCandidateStatus",
]
