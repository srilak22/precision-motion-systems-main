import apiClient from './client';
import type { SourceConnector } from '../types';

export async function getSources(): Promise<SourceConnector[]> {
  const { data } = await apiClient.get<SourceConnector[]>('/sources');
  return data;
}

