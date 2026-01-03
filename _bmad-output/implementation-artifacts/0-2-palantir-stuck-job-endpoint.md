# Story 0.2: Palantir Stuck Job Detection Endpoint

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **REPOSITORY**: This story is implemented in `transcription-palantir`, NOT `mithrandir-admin` or `mithrandir-unified-api`.

None - this is a foundational Palantir enhancement.

## Story

As an API consumer,
I want Palantir to expose an endpoint that returns jobs stuck in processing state,
So that the dashboard can display and manage stuck jobs without client-side calculation.

## Acceptance Criteria

1. **Given** a client calls `GET /api/v1/jobs/stuck` **When** thresholdSeconds is provided **Then** returns jobs where status='processing' AND (now - startedAt) > threshold

2. **Given** jobs are in processing state **When** they exceed the threshold **Then** each returned job includes: jobId, fileName, status, startedAt, stuckDurationSeconds

3. **Given** no jobs exceed threshold **When** endpoint is called **Then** returns empty array with 200 OK

4. **Given** thresholdSeconds is not provided **When** endpoint is called **Then** defaults to 3600 (1 hour)

## Tasks / Subtasks

- [ ] Task 1: Create stuck jobs endpoint
  - [ ] Add `GET /api/v1/jobs/stuck` route to jobs.ts
  - [ ] Query param: `thresholdSeconds` (default: 3600)
  - [ ] Query BullMQ for jobs in 'active' state (processing)
  - [ ] Filter by startedAt timestamp comparison

- [ ] Task 2: Implement stuck job detection logic
  - [ ] Get all active jobs from queue
  - [ ] Calculate duration: `now() - startedAt`
  - [ ] Filter jobs where duration > threshold
  - [ ] Return sorted by stuck duration (longest first)

- [ ] Task 3: Define response schema
  - [ ] Match existing job response shape
  - [ ] Add `stuckDurationSeconds` field
  - [ ] Add endpoint to OpenAPI docs

- [ ] Task 4: Write tests
  - [ ] Test threshold filtering
  - [ ] Test default threshold
  - [ ] Test empty response

## Dev Notes

### Architecture Compliance

Per architect decision: "Palantir owns job state (BullMQ queues). Duplicating 'stuck' logic in Unified API violates single-source-of-truth principle."

### Technical Requirements

**Endpoint Specification:**
```
GET /api/v1/jobs/stuck?thresholdSeconds=3600

Response:
{
  "jobs": [
    {
      "jobId": "abc123",
      "fileName": "recording-001.mp3",
      "status": "processing",
      "startedAt": "2026-01-03T07:00:00Z",
      "stuckDurationSeconds": 5400
    }
  ],
  "count": 1,
  "thresholdSeconds": 3600
}
```

**Stuck Job Definition:**
- Status = 'processing' (BullMQ 'active' state)
- Duration = now() - startedAt
- Stuck = duration > thresholdSeconds

### File Structure Requirements (Palantir)

```
transcription-palantir/src/api/routes/
└── jobs.ts    # MODIFY - add /stuck endpoint
```

### Dependencies

- **Blocks Story 2.2**: Queue Hygiene needs stuck job data
- **Proxied by Story 0.1**: Unified API proxies this endpoint

### References

- [Source: Architect Review Response - Question 2]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
