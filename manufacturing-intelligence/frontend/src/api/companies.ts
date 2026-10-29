// src/api/companies.ts
// Company-related API functions

import apiClient from './client';
import type {
  Company,
  CompanySearchParams,
  CompanyStats,
  PaginatedResponse,
  ReviewUpdate,
} from '../types';

/** Build query params from CompanySearchParams, stripping undefined values */
function buildParams(params: CompanySearchParams): Record<string, string | number | boolean | string[]> {
  const out: Record<string, string | number | boolean | string[]> = {};
  if (params.q)                out.q                = params.q;
  if (params.countries?.length)out.countries        = params.countries;
  if (params.classifications?.length) out.classifications = params.classifications;
  if (params.employeeRanges?.length)  out.employee_ranges = params.employeeRanges;
  if (params.legalStatuses?.length)   out.legal_statuses  = params.legalStatuses;
  if (params.hasWebsite !== undefined) out.has_website    = params.hasWebsite;
  if (params.isVerified  !== undefined) out.is_verified   = params.isVerified;
  if (params.industrySector) out.industry_sector = params.industrySector;
  if (params.page)     out.page      = params.page;
  if (params.pageSize) out.page_size = params.pageSize;
  if (params.sortBy)   out.sort_by   = params.sortBy;
  if (params.sortDir)  out.sort_dir  = params.sortDir;
  return out;
}

/**
 * Fetch a paginated, filtered list of companies.
 */
export async function getCompanies(
  params: CompanySearchParams = {},
): Promise<PaginatedResponse<Company>> {
  const { data } = await apiClient.get<PaginatedResponse<Company>>('/companies', {
    params: buildParams(params),
  });
  return data;
}

/**
 * Fetch a single company by UUID.
 */
export async function getCompany(id: string): Promise<Company> {
  const { data } = await apiClient.get<Company>(`/companies/${id}`);
  return data;
}

/**
 * Fetch aggregate statistics across all collected companies.
 */
export async function getCompanyStats(): Promise<CompanyStats> {
  const { data } = await apiClient.get<CompanyStats>('/companies/stats');
  return data;
}

/**
 * Quick search for companies by name (used in global search bar).
 */
export async function searchCompanies(q: string): Promise<Company[]> {
  const { data } = await apiClient.get<Company[]>('/companies/search', {
    params: { q, limit: 10 },
  });
  return data;
}

/**
 * Update the human-review status / classification of a company.
 */
export async function updateCompanyReview(
  id: string,
  reviewData: ReviewUpdate,
): Promise<Company> {
  const { data } = await apiClient.patch<Company>(`/companies/${id}/review`, reviewData);
  return data;
}

/**
 * Export a filtered set of companies (triggers download).
 * Returns the blob URL for download.
 */
export async function exportCompanies(
  params: CompanySearchParams,
  format: 'csv' | 'excel' | 'json' = 'csv',
): Promise<string> {
  const response = await apiClient.get('/companies/export', {
    params: { ...buildParams(params), format },
    responseType: 'blob',
  });
  const blob = new Blob([response.data as BlobPart]);
  return URL.createObjectURL(blob);
}
