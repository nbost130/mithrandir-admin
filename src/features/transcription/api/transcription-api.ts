import { apiClient } from '@/lib/apiClient';
import type { JobsResponse, TranscriptionJob } from '../data/types';

/**
 * Transcription API Client
 *
 * Interfaces with the Unified API (mithrandir-unified-api) on port 8080.
 * The Unified API acts as an API Gateway/BFF (Backend for Frontend) that
 * proxies requests to the transcription-palantir backend service (port 9003).
 *
 * Uses the centralized apiClient which handles:
 * - Authorization header injection
 * - Base URL configuration
 * - Global error handling
 */

export const transcriptionApi = {
  // Fetch jobs by status
  async getJobs(status?: string, limit = 100): Promise<TranscriptionJob[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());

    const response = await apiClient.get<JobsResponse>(`/api/transcription/jobs?${params.toString()}`);
    return response.data.data;
  },

  // Fetch all jobs
  async getAllJobs(): Promise<TranscriptionJob[]> {
    const [pending, processing, completed, failed] = await Promise.all([
      this.getJobs('pending'),
      this.getJobs('processing'),
      this.getJobs('completed'),
      this.getJobs('failed'),
    ]);
    return [...pending, ...processing, ...completed, ...failed];
  },

  // Retry a failed job
  async retryJob(jobId: string): Promise<void> {
    await apiClient.post(`/api/transcription/jobs/${jobId}/retry`);
  },

  // Delete a job
  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/api/transcription/jobs/${jobId}`);
  },

  // Update job priority
  async updateJobPriority(jobId: string, priority: number): Promise<void> {
    await apiClient.patch(`/api/transcription/jobs/${jobId}`, { priority });
  },

  // Get job details
  async getJob(jobId: string): Promise<TranscriptionJob> {
    const response = await apiClient.get<{
      success: boolean;
      data: TranscriptionJob;
    }>(`/api/transcription/jobs/${jobId}`);
    return response.data.data;
  },

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/api/transcription/health');
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  },
};
