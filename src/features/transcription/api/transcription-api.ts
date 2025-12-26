import axios from "axios"
import type { JobsResponse, TranscriptionJob } from "../data/types"

const API_BASE = import.meta.env.VITE_TRANSCRIPTION_API || "http://100.77.230.53:8080/transcription"

export const transcriptionApi = {
  // Fetch jobs by status
  async getJobs(status?: string, limit = 100): Promise<TranscriptionJob[]> {
    const params = new URLSearchParams()
    if (status) params.append("status", status)
    params.append("limit", limit.toString())
    
    const response = await axios.get<JobsResponse>(
      `${API_BASE}/jobs?${params.toString()}`
    )
    return response.data.data
  },

  // Fetch all jobs
  async getAllJobs(): Promise<TranscriptionJob[]> {
    const [pending, processing, completed, failed] = await Promise.all([
      this.getJobs("pending"),
      this.getJobs("processing"),
      this.getJobs("completed"),
      this.getJobs("failed"),
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

  // Get job details
  async getJob(jobId: string): Promise<TranscriptionJob> {
    const response = await axios.get<{ success: boolean; data: TranscriptionJob }>(
      `${API_BASE}/jobs/${jobId}`
    )
    return response.data.data
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE.replace("/api/v1", "")}/api/v1/health`)
      return response.data.status === "healthy"
    } catch {
      return false
    }
  },
}
