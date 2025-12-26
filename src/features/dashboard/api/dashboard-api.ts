import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://100.77.230.53:8080'

export interface DashboardStats {
  totalJobs: number
  completedJobs: number
  failedJobs: number
  processingJobs: number
  systemHealth: number
  uptime: number
  servicesRunning: number
  totalServices: number
}

export interface ActivityItem {
  id: string
  type: string
  action: string
  details: string
  timestamp: string
  metadata: {
    duration?: number
    status: string
  }
}

export interface TrendDataPoint {
  date: string
  completed: number
  failed: number
  total: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  error?: string
}

export const dashboardApi = {
  async getStats(): Promise<DashboardStats> {
    const response = await axios.get<ApiResponse<DashboardStats>>(
      `${API_BASE}/api/dashboard/stats`
    )
    return response.data.data
  },

  async getActivity(limit = 10): Promise<ActivityItem[]> {
    const response = await axios.get<ApiResponse<ActivityItem[]>>(
      `${API_BASE}/api/dashboard/activity`,
      { params: { limit } }
    )
    return response.data.data
  },

  async getTrends(days = 7): Promise<TrendDataPoint[]> {
    const response = await axios.get<ApiResponse<TrendDataPoint[]>>(
      `${API_BASE}/api/dashboard/trends`,
      { params: { days } }
    )
    return response.data.data
  },
}
