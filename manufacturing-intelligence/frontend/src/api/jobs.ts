// src/api/jobs.ts
// Collection job management API functions

import apiClient from './client';
import type { Job, JobDetail, JobLog } from '../types';

/**
 * Fetch all jobs (recent first).
 */
export async function getJobs(): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>('/jobs');
  return data;
}

/**
 * Fetch detailed info for a single job including logs.
 */
export async function getJob(id: string): Promise<JobDetail> {
  const { data } = await apiClient.get<JobDetail>(`/jobs/${id}`);
  return data;
}

/**
 * Trigger a new collection run for the given source name.
 * e.g. source = "companies_house_uk", "acra_sg", etc.
 */
export async function triggerJob(source: string): Promise<Job> {
  const { data } = await apiClient.post<Job>('/jobs', { source_name: source });
  return data;
}

/**
 * Pause a running job (graceful checkpoint).
 */
export async function pauseJob(id: string): Promise<Job> {
  const { data } = await apiClient.post<Job>(`/jobs/${id}/pause`);
  return data;
}

/**
 * Resume a paused job from its last checkpoint.
 */
export async function resumeJob(id: string): Promise<Job> {
  const { data } = await apiClient.post<Job>(`/jobs/${id}/resume`);
  return data;
}

/**
 * Cancel a running or paused job.
 */
export async function cancelJob(id: string): Promise<Job> {
  const { data } = await apiClient.post<Job>(`/jobs/${id}/cancel`);
  return data;
}

/**
 * Fetch structured log lines for a job.
 */
export async function getJobLogs(id: string): Promise<JobLog[]> {
  const { data } = await apiClient.get<JobLog[]>(`/jobs/${id}/logs`);
  return data;
}

/**
 * Fetch active (running/paused) jobs only.
 */
export async function getActiveJobs(): Promise<Job[]> {
  const { data } = await apiClient.get<Job[]>('/jobs', {
    params: { status: 'running,paused' },
  });
  return data;
}
