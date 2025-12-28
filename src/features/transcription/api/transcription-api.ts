import axios from 'axios'
import type { JobsResponse, TranscriptionJob } from '../data/types'

/**
 * Transcription API Client
 *
 * Interfaces with the Unified API (mithrandir-unified-api) on port 8080.
 * The Unified API acts as an API Gateway/BFF (Backend for Frontend) that
 * proxies requests to the transcription-palantir backend service (port 9003).
 *
 * Architecture:
 * Frontend → Unified API (8080) → Transcription Palantir (9003)
 *
 * @requires VITE_TRANSCRIPTION_API - Environment variable for the Unified API transcription endpoint
 */

// Validate required environment variable - NO hardcoded fallbacks!
if (!import.meta.env.VITE_TRANSCRIPTION_API) {
  throw new Error(
    'VITE_TRANSCRIPTION_API environment variable is not set. ' +
    'This should point to the Unified API transcription endpoint ' +
    '(e.g., http://100.77.230.53:8080/transcription)'
  )
}

const API_BASE = import.meta.env.VITE_TRANSCRIPTION_API

export const transcriptionApi = {
  // Fetch jobs by status
  async getJobs(status?: string, limit = 100): Promise<TranscriptionJob[]> {
    const params = new URLSearchParams()
    if (status) params.append('status', status)
    params.append('limit', limit.toString())

    const response = await axios.get<JobsResponse>(
      `${API_BASE}/jobs?${params.toString()}`
    )
    return response.data.data
  },

  // Fetch all jobs
  async getAllJobs(): Promise<TranscriptionJob[]> {
    const [pending, processing, completed, failed] = await Promise.all([
      this.getJobs('pending'),
      this.getJobs('processing'),
      this.getJobs('completed'),
      this.getJobs('failed'),
    ])
    return [...pending, ...processing, ...completed, ...failed]
  },

  // Retry a failed job
  async retryJob(jobId: string): Promise<void> {
    await axios.post(`${API_BASE}/jobs/${jobId}/retry`)
  },

  // Delete a job
  async deleteJob(jobId: string): Promise<void> {
    await axios.delete(`${API_BASE}/jobs/${jobId}`)
  },

  // Update job priority
  async updateJobPriority(jobId: string, priority: number): Promise<void> {
    await axios.patch(`${API_BASE}/jobs/${jobId}`, { priority })
  },

  // Get job details
  async getJob(jobId: string): Promise<TranscriptionJob> {
    const response = await axios.get<{
      success: boolean
      data: TranscriptionJob
    }>(`${API_BASE}/jobs/${jobId}`)
    return response.data.data
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${API_BASE.replace('/api/v1', '')}/api/v1/health`
      )
      return response.data.status === 'healthy'
    } catch {
      return false
    }
  },
}
