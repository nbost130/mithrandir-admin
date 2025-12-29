import { apiClient } from '@/lib/apiClient';

/**
 * Services API Client
 *
 * Interfaces with the Unified API (mithrandir-unified-api) on port 8080.
 * The Unified API acts as an API Gateway/BFF (Backend for Frontend) that
 * aggregates data from all backend services.
 *
 * Uses the centralized apiClient which handles:
 * - Authorization header injection
 * - Base URL configuration
 * - Global error handling
 */

export interface ServiceDetails {
  name: string;
  identifier: string;
  status: 'healthy' | 'unhealthy';
  url: string;
  port: number;
  uptime?: number;
  version?: string;
  error?: string;
  details?: Record<string, unknown>;
  lastChecked: string;
}

export interface ServicesSummary {
  total: number;
  healthy: number;
  unhealthy: number;
  healthPercentage: number;
}

export interface ServicesHealthResponse {
  services: ServiceDetails[];
  summary: ServicesSummary;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

export const servicesApi = {
  async getHealth(): Promise<ServicesHealthResponse> {
    const response = await apiClient.get<ApiResponse<ServicesHealthResponse>>('/api/services/health');
    return response.data.data;
  },
};
