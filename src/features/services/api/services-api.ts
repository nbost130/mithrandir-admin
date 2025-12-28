import axios from 'axios'

/**
 * Services API Client
 *
 * Interfaces with the Unified API (mithrandir-unified-api) on port 8080.
 * The Unified API acts as an API Gateway/BFF (Backend for Frontend) that
 * aggregates data from all backend services.
 *
 * @requires VITE_API_BASE_URL - Environment variable for the Unified API base URL
 */

// Validate required environment variable - NO hardcoded fallbacks!
if (!import.meta.env.VITE_API_BASE_URL) {
  throw new Error(
    'VITE_API_BASE_URL environment variable is not set. ' +
    'This should point to the Unified API (e.g., http://100.77.230.53:8080)'
  )
}

const API_BASE = import.meta.env.VITE_API_BASE_URL

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
