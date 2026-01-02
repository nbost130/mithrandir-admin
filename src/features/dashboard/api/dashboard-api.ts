import { apiClient } from '@/lib/apiClient';

/**
 * Dashboard API Client
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

export interface DashboardStats {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  processingJobs: number;
  systemHealth: number;
  uptime: number;
  servicesRunning: number;
  totalServices: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  action: string;
  details: string;
  timestamp: string;
  metadata: {
    duration?: number;
    status: string;
  };
}

export interface TrendDataPoint {
  date: string;
  completed: number;
  failed: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  error?: string;
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<ApiResponse<DashboardStats>>('/api/dashboard/stats');
    return response.data.data;
  },

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    const response = await apiClient.get<ApiResponse<ActivityItem[]>>('/api/dashboard/activity', { params: { limit } });
    return response.data.data;
  },

  async getTrends(days = 7): Promise<TrendDataPoint[]> {
    const response = await apiClient.get<ApiResponse<TrendDataPoint[]>>('/api/dashboard/trends', { params: { days } });
    return response.data.data;
  },
};
