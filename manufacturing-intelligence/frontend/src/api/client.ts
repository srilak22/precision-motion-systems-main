// src/api/client.ts
// Configured Axios instance for the Manufacturing Intelligence Platform API

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  timeout: 30_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Attach any auth token stored in sessionStorage (if/when auth is added)
    const token = sessionStorage.getItem('mfg_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      console.debug(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.params ?? '');
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.debug(`[API] ← ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    const status = error.response?.status;
    const detail =
      error.response?.data?.detail ??
      error.response?.data?.message ??
      error.message ??
      'Unknown error';

    // Log structured error
    console.error(`[API Error] ${status ?? 'network'}: ${detail}`, {
      url: error.config?.url,
      method: error.config?.method,
    });

    // Normalise the error so consumers can read error.message reliably
    const normalised = new Error(detail) as Error & { status?: number };
    normalised.status = status;
    return Promise.reject(normalised);
  },
);

export default apiClient;
