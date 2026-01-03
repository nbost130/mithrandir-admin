# Story 5.2: Health Validation Gate for New Services

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 5.1 must be complete before this story can be implemented.

- [ ] Story 5.1: Service auto-discovery (creates skeleton tiles to validate)

## Story

As a dashboard user,
I want new services to pass a health check before appearing with full controls,
So that misconfigured services are obvious and don't clutter the healthy view.

## Acceptance Criteria

1. **Given** a new service is discovered **When** health validation runs **Then** the service's health endpoint is called with 3 retries (2s, 4s, 8s backoff) **And** each retry logs: attempt number, response code, latency

2. **Given** health check passes on any attempt **When** validation completes **Then** tile transitions to healthy state (emerald) **And** full maintenance controls are enabled

3. **Given** all 3 health check attempts fail **When** validation completes **Then** tile shows "Unhealthy" state (rose) with warning icon **And** maintenance controls are disabled (read-only view) **And** "Retry Health Check" button is displayed

4. **Given** a service remains unhealthy for 24 hours **When** the threshold is reached **Then** admin notification suggests reviewing service configuration

## Tasks / Subtasks

- [ ] Task 1: Implement health check with retries (AC: #1)
  - [ ] Call service health endpoint
  - [ ] Retry with exponential backoff (2s, 4s, 8s)
  - [ ] Log each attempt with response code and latency

- [ ] Task 2: Create healthy tile transition (AC: #2)
  - [ ] Transition skeleton tile to healthy state
  - [ ] Enable full maintenance controls
  - [ ] Show emerald status indicator

- [ ] Task 3: Create unhealthy tile variant (AC: #3)
  - [ ] Show "Unhealthy" state with rose color
  - [ ] Add warning icon
  - [ ] Disable maintenance controls
  - [ ] Add "Retry Health Check" button

- [ ] Task 4: Implement manual retry (AC: #3)
  - [ ] "Retry Health Check" triggers new validation
  - [ ] Show spinner during retry
  - [ ] Update tile based on result

- [ ] Task 5: Implement 24-hour notification (AC: #4)
  - [ ] Track time since first unhealthy detection
  - [ ] Send admin notification at 24h threshold
  - [ ] Suggest configuration review

- [ ] Task 6: Create useHealthValidation hook
  - [ ] Manage validation lifecycle
  - [ ] Track retry attempts
  - [ ] Report results

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test retry logic
  - [ ] Test healthy/unhealthy transitions
  - [ ] Test 24-hour notification

## Dev Notes

### Architecture Compliance

**Implements FR16**: Validation Gate

Per `architecture.md#Service Discovery & Health Validation`:
- Health check retry: 3 attempts (2s, 4s, 8s backoff)
- 10s per-request timeout
- Failure shows tile in "unhealthy" state with "Retry Health Check" button
- Services must pass health validation before maintenance controls enabled

### Technical Requirements

**Health Check Protocol**:
- Endpoint: `{service.healthEndpoint}` (typically `/health`)
- Timeout: 10s per request
- Retry backoff: 2s, 4s, 8s
- Max attempts: 3

> [!NOTE]
> **Different Retry Patterns in System:**
> - **Health validation (this story):** 2s, 4s, 8s backoff – for service health checks
> - **SSE reconnection (Story 1.1):** 1s, 2s, 4s, 8s, 16s backoff – for real-time stream
> 
> These are intentionally different: SSE reconnection is more aggressive because real-time updates are critical; health validation is more patient to avoid false negatives.

**Logging Per Attempt**:
```typescript
interface HealthCheckAttempt {
  serviceId: string;
  attemptNumber: 1 | 2 | 3;
  timestamp: string;
  responseCode: number | null;
  latencyMs: number;
  error?: string;
}
```

### Library/Framework Requirements

- Uses apiClient with timeout configuration
- TanStack Query for state management

### File Structure Requirements

```
src/features/services/
├── hooks/
│   └── useHealthValidation.ts   # NEW
├── components/
│   └── UnhealthyServiceTile.tsx # NEW (or extend ServiceHealthTile)
```

### Dependencies

- **Requires Story 5.1**: Triggered by new service discovery
- **Requires Story 1.3**: Extends ServiceHealthTile

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Service Discovery & Health Validation]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2]
- [Source: _bmad-output/planning-artifacts/prd.md#FR16]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
