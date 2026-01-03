# Story 1.4: Stale and Rate-Limit Messaging

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 1.1 must be complete before this story can be implemented.

- [ ] Story 1.1: SSE reconciliation stream with connection status tracking

## Story

As a dashboard user,
I want clear explanations when data can't refresh (429/500/network failure),
So that I understand the issue and can retry or snooze.

## Acceptance Criteria

1. **Given** the dashboard receives a 429 (rate limit) response **When** the stale banner appears **Then** it shows "Rate limited – retry in X seconds" with a live countdown **And** provides a "Snooze 5 min" button to dismiss temporarily **And** the retry-after value from the response is used

2. **Given** a network failure prevents data refresh **When** the stale banner appears **Then** it shows "Connection lost" with network error details **And** provides a "Retry Now" button **And** no blank screens or spinners appear indefinitely (NFR13)

3. **Given** data is older than 15 seconds **When** the UI displays **Then** an "amber" stale indicator appears on affected cards **And** tooltip shows "Last updated X seconds ago"

4. **Given** the user clicks "Retry Now" **When** the retry succeeds **Then** the stale banner dismisses automatically **And** cards update to "Verified" state

## Tasks / Subtasks

- [ ] Task 1: Create StaleBanner component (AC: #1, #2, #4)
  - [ ] Create `src/components/reliability/StaleBanner.tsx`
  - [ ] Implement live countdown timer for 429 responses
  - [ ] Show "Snooze 5 min" button that dismisses temporarily
  - [ ] Show "Retry Now" button for network failures
  - [ ] Auto-dismiss on successful retry

- [ ] Task 2: Implement axios interceptor for error handling (AC: #1, #2)
  - [ ] Extend `src/lib/apiClient.ts` interceptors
  - [ ] Parse 429 responses for retry-after header
  - [ ] Normalize errors to `{code, message, remediation}` format
  - [ ] Emit stale events to trigger banner

- [ ] Task 3: Create stale indicator for cards (AC: #3)
  - [ ] Create `src/components/reliability/StaleIndicator.tsx`
  - [ ] Show amber icon when data > 15s old
  - [ ] Tooltip with relative "Last updated X seconds ago"
  - [ ] Integrate with TanStack Query's `dataUpdatedAt`

- [ ] Task 4: Implement retry logic (AC: #4)
  - [ ] Add exponential backoff retry in `useReliableQuery` hook
  - [ ] Manual retry trigger from banner
  - [ ] Track retry attempts and surface in UI

- [ ] Task 5: Ensure no blank screens (AC: #2, NFR13)
  - [ ] Show skeleton/shimmer during initial load
  - [ ] Show stale data with warning rather than blank
  - [ ] Never show indefinite spinners

- [ ] Task 6: Create datetime utilities (per architecture)
  - [ ] Create `src/lib/datetime.ts`
  - [ ] Wrap date-fns utilities for consistent formatting
  - [ ] Export: `formatRelativeTime`, `formatCountdown`, `formatTimestamp`
  - [ ] Use throughout reliability components for consistent date display

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test 429 countdown timer behavior
  - [ ] Test network error display
  - [ ] Test retry success flow
  - [ ] Test stale indicator threshold

## Dev Notes

### Architecture Compliance

**Implements FR3**: Stale/Rate-limit Messaging
**Implements NFR13**: No blank screens or silent failures

Per `architecture.md`:
- Error responses standardized to `{code, message, remediation}`
- 429 responses include retry-after data that the dashboard surfaces
- `useReliableQuery` handles exponential backoff (5s base)

### Technical Requirements

**Error Format** (from Architecture):
```typescript
interface ApiError {
  code: string;          // e.g., "RATE_LIMITED", "NETWORK_ERROR"
  message: string;       // Human-readable message
  remediation: string;   // Actionable suggestion
  traceId?: string;      // For debugging
}
```

**Stale Threshold**: 15 seconds
**Polling Cadence**: 5s default (per NFR2)

### Library/Framework Requirements

- axios interceptors for error normalization
- date-fns for countdown/relative time
- shadcn/ui Alert, Tooltip components

### File Structure Requirements

```
src/components/reliability/
├── StaleBanner.tsx        # NEW
└── StaleIndicator.tsx     # NEW

src/lib/
├── apiClient.ts           # MODIFY - add 429/error interceptors
```

### Error Interceptor Pattern

```typescript
// In apiClient.ts
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];
      return Promise.reject({
        code: 'RATE_LIMITED',
        message: `Rate limited – retry in ${retryAfter}s`,
        remediation: 'Wait for the countdown or snooze notifications',
        retryAfter: parseInt(retryAfter)
      });
    }
    // ... handle other errors
  }
);
```

### Dependencies

- **Requires Story 1.1**: SSE connection status affects banner
- **Requires Story 1.2/1.3**: Cards integrate StaleIndicator

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR13]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
