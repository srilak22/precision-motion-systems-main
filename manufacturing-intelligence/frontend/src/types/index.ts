// src/types/index.ts
// Complete TypeScript type definitions for the Manufacturing Intelligence Platform

export interface Person {
  id: string;
  fullName: string;
  jobTitle: string;
  roleType: string;
  publicProfileUrl?: string;
  linkedinUrl?: string;
  email?: string;
}

export interface Financial {
  id: string;
  revenueAmount?: number;
  revenueCurrency: string;
  financialYear: number;
  isReported: boolean;
  source?: string;
  confidence?: number;
}

export interface FieldEvidence {
  id: string;
  fieldName: string;
  fieldValue: string;
  sourceType: string;
  sourceUrl?: string;
  extractedAt: string;
  confidence: number;
  isVerified: boolean;
  verificationNote?: string;
}

export interface Company {
  id: string;
  internalId: string;
  legalName: string;
  tradingName?: string;
  registrationNumber?: string;
  country: string;
  stateProvince?: string;
  city?: string;
  registeredAddress?: string;
  operationalAddress?: string;
  postalCode?: string;
  officialWebsite?: string;
  rootDomain?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  phone?: string;
  email?: string;
  contactFormUrl?: string;
  employeeCount?: number;
  employeeCountRange?: string;
  foundedYear?: number;
  incorporationDate?: string;
  manufacturingClassification: string;
  classificationConfidence: number;
  industrySector?: string;
  industrySubsector?: string;
  naicsCode?: string;
  sicCode?: string;
  legalStatus: string;
  legalEntityType?: string;
  isVerified: boolean;
  verificationDate?: string;
  dataCompletenessScore: number;
  discoverySource: string;
  discoveryTimestamp: string;
  lastEnrichedAt?: string;
  mainProducts?: string[];
  manufacturingProcesses?: string[];
  certifications?: string[];
  capabilities?: string[];
  isOem?: boolean;
  isOdm?: boolean;
  executives?: Person[];
  financials?: Financial[];
  fieldEvidence?: FieldEvidence[];
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'flagged';
  reviewNote?: string;
}

export interface CompanyStats {
  totalDiscovered: number;
  uniqueCompanies: number;
  verifiedManufacturers: number;
  pendingReview: number;
  withWebsites: number;
  withContacts: number;
  withLeadership: number;
  withFinancials: number;
  duplicateCount: number;
  errorCount: number;
  countryBreakdown: Record<string, number>;
  industryBreakdown: Record<string, number>;
  progressToTarget: number; // 0-100
  targetCount: number;
  gapReport?: Record<string, { target: number; collected: number; gap: number }>;
}

export type JobStatus = 'pending' | 'running' | 'paused' | 'completed' | 'failed' | 'cancelled';

export interface Job {
  id: string;
  jobName: string;
  sourceName: string;
  country: string;
  status: JobStatus;
  totalDiscovered: number;
  totalAccepted: number;
  totalRejected: number;
  totalDuplicates: number;
  totalErrors: number;
  startedAt?: string;
  completedAt?: string;
  lastActivityAt?: string;
  errorMessage?: string;
  progressPercent?: number;
}

export interface JobLog {
  id: string;
  jobId: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
  message: string;
  timestamp: string;
  meta?: Record<string, unknown>;
}

export interface JobDetail extends Job {
  logs: JobLog[];
  config?: Record<string, unknown>;
  checkpointData?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CompanySearchParams {
  q?: string;
  countries?: string[];
  classifications?: string[];
  employeeRanges?: string[];
  legalStatuses?: string[];
  hasWebsite?: boolean;
  isVerified?: boolean;
  industrySector?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

export interface ReviewUpdate {
  reviewStatus: 'approved' | 'rejected' | 'flagged';
  reviewNote?: string;
  manufacturingClassification?: string;
}

export interface DuplicateCandidate {
  id: string;
  companyAId: string;
  companyAName: string;
  companyACountry: string;
  companyBId: string;
  companyBName: string;
  companyBCountry: string;
  similarityScore: number;
  matchReasons: string[];
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface MissingFieldReport {
  byCountry: Array<{
    country: string;
    total: number;
    missingWebsite: number;
    missingPhone: number;
    missingEmail: number;
    missingEmployeeCount: number;
    missingAddress: number;
    missingFinancials: number;
    missingLeadership: number;
    completenessScore: number;
  }>;
  byField: Array<{
    fieldName: string;
    totalRecords: number;
    filledCount: number;
    completionPct: number;
  }>;
}

export interface QualitySummary {
  overallScore: number;
  completenessScore: number;
  accuracyScore: number;
  consistencyScore: number;
  freshnessScore: number;
  duplicateRate: number;
  verifiedRate: number;
  pendingReviewCount: number;
  classificationIssues: number;
  byCountry?: Array<{
    country: string;
    total: number;
    missingWebsite: number;
    missingPhone: number;
    missingEmail: number;
    missingEmployeeCount: number;
    missingAddress: number;
    completenessScore: number;
  }>;
}

export interface ExportParams {
  format: 'csv' | 'excel' | 'json';
  countries?: string[];
  industries?: string[];
  verifiedOnly?: boolean;
  dateFrom?: string;
  dateTo?: string;
  fields?: string[];
}

export interface ExportJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  format: string;
  recordCount: number;
  fileSizeBytes?: number;
  downloadUrl?: string;
  createdAt: string;
  completedAt?: string;
  params: ExportParams;
}

export interface SourceConnector {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  description: string;
  rateLimitPerMinute?: number;
  license?: string;
  lastSyncAt?: string;
  companiesCollected: number;
  status: 'active' | 'idle' | 'error' | 'rate_limited';
  requiresApiKey: boolean;
  apiKeyConfigured: boolean;
}

export interface ApiUsage {
  sourceName: string;
  requestsToday: number;
  requestsLimit: number;
  resetAt: string;
  isRateLimited: boolean;
}
