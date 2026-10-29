"""
Models package — import all models here so Alembic detects them.
"""
from app.models.company import Company, LegalStatus, ManufacturingClassification, EmployeeRange
from app.models.person import Person, RoleType
from app.models.financial import Financial
from app.models.source import DataSource, FieldEvidence, VerificationStatus
from app.models.job import CollectionJob, JobLog, ExportJob, JobStatus

__all__ = [
    "Company", "LegalStatus", "ManufacturingClassification", "EmployeeRange",
    "Person", "RoleType",
    "Financial",
    "DataSource", "FieldEvidence", "VerificationStatus",
    "CollectionJob", "JobLog", "ExportJob", "JobStatus",
]
