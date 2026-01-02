import axios from 'axios'

// Validate API base URL is configured
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL environment variable is not set. Please check your .env file.')
}

/**
 * Centralized axios instance for all API requests.
 *
 * This provides a single source of truth for API configuration.
 * The backend (mithrandir-unified-api) relies on Tailscale network-level
 * security and does NOT validate authentication headers.
 *
 * Features:
 * - Base URL configuration from environment variable
 * - Global timeout configuration
 * - Consistent request/response handling
 *
 * Usage:
 * ```typescript
 * import { apiClient } from '@/lib/apiClient'
 *
 * // GET request
 * const response = await apiClient.get('/api/endpoint')
 *
 * // POST request
 * const response = await apiClient.post('/api/endpoint', data)
 * ```
 */
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
})
