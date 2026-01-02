# API Contracts – admin-dashboard part

All requests go through the Mithrandir Unified API (`VITE_API_BASE_URL`, default `http://100.77.230.53:8080`). Do **not** point to Palantir or other backend ports directly.

## Transcription Service
| Endpoint | Method | Description | Handler |
| --- | --- | --- | --- |
| `/transcription/jobs?status=<status>&limit=<n>` | GET | Returns filtered transcription jobs. Omit `status` to fetch all. | `transcriptionApi.getJobs/getAllJobs` |
| `/transcription/jobs/:id` | GET | Detail view for a single job. | `transcriptionApi.getJob` |
| `/transcription/jobs/:id/retry` | POST | Retries failed job. | `transcriptionApi.retryJob` |
| `/transcription/jobs/:id` | DELETE | Deletes a job permanently. | `transcriptionApi.deleteJob` |
| `/transcription/jobs/:id` | PATCH | Updates job priority. Body: `{ priority: number }`. | `transcriptionApi.updateJobPriority` |
| `/transcription/health` | GET | Returns `{ status: 'healthy' | 'unhealthy' }`. | `transcriptionApi.healthCheck` |

## Dashboard / Services (Planned)
- `/api/dashboard/*`: Aggregated system KPIs for widgets. (API client scaffolding in `features/dashboard/api`).
- `/services/*`: Health + control endpoints for services view.
- `/ssh-status`: Exposes server resource stats.

> 🔔 **GitHub Issues Reminder:** Review open/closed issues for additional planned endpoints (delegation, n8n, tasks) before implementing. Add exports to this doc when endpoints are formalized.

## Client Configuration
- Shared axios instance `apiClient` injects base URL + timeout.
- Query keys should always include route names (e.g., `['transcription-jobs', status]`).

## Error Handling
- Errors propagate through TanStack Query; `show-submitted-data.tsx` + `handle-server-error.ts` provide helpers.
- Unified API centralizes auth/CORS/ratelimiting; client currently trusts environment-level security.
