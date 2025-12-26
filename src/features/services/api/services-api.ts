import axios from 'axios'

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://100.77.230.53:8080'

export interface ServiceDetails {
  name: string
  identifier: string
  status: 'healthy' | 'unhealthy'
  url: string
  port: number
  uptime?: number
  version?: string
  error?: string
  details?: Record<string, unknown>
  lastChecked: string
}

export interface ServicesSummary {
  total: number
  healthy: number
  unhealthy: number
  healthPercentage: number
}

export interface ServicesHealthResponse {
  services: ServiceDetails[]
  summary: ServicesSummary
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  timestamp: string
  error?: string
}

export const servicesApi = {
  async getHealth(): Promise<ServicesHealthResponse> {
    const response = await axios.get<ApiResponse<ServicesHealthResponse>>(
      `${API_BASE}/api/services/health`
    )
    return response.data.data
  },
}
