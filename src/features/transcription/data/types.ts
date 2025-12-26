// Transcription Job Types
export interface TranscriptionJob {
  jobId: string
  fileName: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  priority: number
  progress: number
  createdAt: string
  startedAt: string | null
  completedAt: string | null
  attempts: number
  error: string | null
  fileSize: number
  project?: string
  duration?: number
  transcriptionText?: string
}

export interface TranscriptionStats {
  total: number
  completed: number
  failed: number
  processing: number
  pending: number
}

export interface JobsResponse {
  success: boolean
  data: TranscriptionJob[]
  pagination: {
    page?: number
    pageSize?: number
    total?: number
  }
  timestamp: string
  requestId: string
}
