import apiClient from './client';
import type { ExportJob, ExportParams } from '../types';

export async function triggerExportJob(params: ExportParams): Promise<ExportJob> {
  const { data } = await apiClient.post<ExportJob>('/export', params);
  return data;
}

export async function getExportJobs(): Promise<ExportJob[]> {
  const { data } = await apiClient.get<ExportJob[]>('/export');
  return data;
}

export async function getExportJob(id: string): Promise<ExportJob> {
  const { data } = await apiClient.get<ExportJob>(`/export/${id}`);
  return data;
}

