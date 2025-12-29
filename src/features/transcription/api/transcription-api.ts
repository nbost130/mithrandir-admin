import { apiClient } from '@/lib/apiClient';
import type { JobsResponse, TranscriptionJob } from '../data/types';

/**
 * Transcription API Client
 *
 * ⚠️  CRITICAL: Endpoints are /transcription/*, NOT /api/transcription/*
 *
 * This client interfaces with the Mithrandir Unified API (port 8080) which acts
 * as an API Gateway/BFF (Backend for Frontend) and proxies requests to the
 * transcription-palantir backend service (port 9003).
 *
 * 📚 API Documentation Sources:
 * - Live endpoint list: http://100.77.230.53:8080/info
 * - GitHub README: https://github.com/nbost130/mithrandir-unified-api#api-endpoints
 * - Server location: http://100.77.230.53:8080
 *
 * Always check the /info endpoint for the current canonical list of available
 * endpoints and their exact paths. The Unified API uses /transcription/* paths
 * (without the /api prefix) for all transcription-related operations.
 *
 * Uses the centralized apiClient which handles:
 * - Authorization header injection
 * - Base URL configuration
 * - Global error handling
 */

export const transcriptionApi = {
  /**
   * Fetch transcription jobs with optional filtering
   *
   * Endpoint: GET /transcription/jobs?status=X&limit=N
   *
   * @param status - Optional filter by job status (pending, processing, completed, failed)
   * @param limit - Maximum number of jobs to return (default: 100)
   * @returns Array of transcription jobs
   */
  async getJobs(status?: string, limit = 100): Promise<TranscriptionJob[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    params.append('limit', limit.toString());

    const response = await apiClient.get<JobsResponse>(`/transcription/jobs?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Fetch all transcription jobs (no status filter)
   *
   * Endpoint: GET /transcription/jobs
   *
   * This makes a single API call to fetch all jobs. More efficient than
   * making multiple parallel requests for each status type.
   *
   * @returns Array of all transcription jobs
   */
  async getAllJobs(): Promise<TranscriptionJob[]> {
    return this.getJobs();
  },

  /**
   * Retry a failed transcription job
   *
   * Endpoint: POST /transcription/jobs/:id/retry
   *
   * @param jobId - ID of the job to retry
   */
  async retryJob(jobId: string): Promise<void> {
    await apiClient.post(`/transcription/jobs/${jobId}/retry`);
  },

  /**
   * Delete a transcription job
   *
   * Endpoint: DELETE /transcription/jobs/:id
   *
   * @param jobId - ID of the job to delete
   */
  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/transcription/jobs/${jobId}`);
  },

  /**
   * Update job priority (partial update)
   *
   * Endpoint: PATCH /transcription/jobs/:id
   *
   * @param jobId - ID of the job to update
   * @param priority - New priority value
   */
  async updateJobPriority(jobId: string, priority: number): Promise<void> {
    await apiClient.patch(`/transcription/jobs/${jobId}`, { priority });
  },

  /**
   * Get detailed information about a specific job
   *
   * Endpoint: GET /transcription/jobs/:id
   *
   * @param jobId - ID of the job to retrieve
   * @returns Detailed job information
   */
  async getJob(jobId: string): Promise<TranscriptionJob> {
    const response = await apiClient.get<{
      success: boolean;
      data: TranscriptionJob;
    }>(`/transcription/jobs/${jobId}`);
    return response.data.data;
  },

  /**
   * Check transcription service health status
   *
   * Endpoint: GET /transcription/health
   *
   * @returns true if service is healthy, false otherwise
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await apiClient.get('/transcription/health');
      return response.data.status === 'healthy';
    } catch {
      return false;
    }
  },
};
