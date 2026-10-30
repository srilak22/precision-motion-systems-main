import apiClient from './client';
import type {
  QualitySummary,
  DuplicateCandidate,
} from '../types';

export async function getQualitySummary(): Promise<QualitySummary> {
  const { data } = await apiClient.get<QualitySummary>('/quality/summary');
  return data;
}

export async function getDuplicateCandidates(status = 'pending'): Promise<DuplicateCandidate[]> {
  const { data } = await apiClient.get<DuplicateCandidate[]>('/quality/duplicates', {
    params: { status },
  });
  return data;
}

export async function resolveDuplicateCandidate(
  candidateId: string,
  action: 'merge' | 'dismiss',
  note?: string,
): Promise<{ status: string }> {
  const { data } = await apiClient.post<{ status: string }>(
    `/quality/duplicates/${candidateId}/resolve`,
    { action, note },
  );
  return data;
}

