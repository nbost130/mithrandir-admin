# Data Models – admin-dashboard part

## TranscriptionJob
Defined in `src/features/transcription/data/types.ts`.

```ts
interface TranscriptionJob {
  jobId: string;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  progress: number;
  createdAt: string;
  startedAt: string | null;
  completedAt: string | null;
  attempts: number;
  error: string | null;
  fileSize: number;
  project?: string;
  duration?: number;
  transcriptionText?: string;
}
```

- **status** drives badge styling + filter chips.
- **priority** is mutable via PATCH endpoint.
- **progress** (0–100) powers progress indicators.
- Optional fields (`project`, `duration`, `transcriptionText`) are ready for future UI expansion.

## TranscriptionStats
Used for cards at top of transcription dashboard.

```ts
interface TranscriptionStats {
  total: number;
  completed: number;
  failed: number;
  processing: number;
  pending: number;
}
```

## JobsResponse
Represents API payload returned by `/transcription/jobs`.

```ts
interface JobsResponse {
  success: boolean;
  data: TranscriptionJob[];
  pagination: {
    page?: number;
    pageSize?: number;
    total?: number;
  };
  timestamp: string;
  requestId: string;
}
```

## Additional Models (scaffolding)
- `features/users`, `features/services`, `features/tasks` include placeholder constants ready for real models once APIs exist.
- GitHub issues describing future schemas should be imported to this folder when available.
