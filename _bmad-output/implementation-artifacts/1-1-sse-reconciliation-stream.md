# Story 1.1: SSE Reconciliation Stream Integration

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 0.1 (Backend Reconciliation Module) must be complete before this story can be implemented.

- [ ] Story 0.1: Unified API exposes `/reconciliation/stream` SSE endpoint
- [ ] Story 0.1: Unified API exposes `/reconciliation/audit` REST endpoint  
- [ ] Story 0.1: SQLite reconciliation schema is migrated

## Story

As a dashboard user,
I want real-time updates from the Unified API reconciliation stream,
So that I see the latest telemetry without manual refresh.

## Acceptance Criteria

1. **Given** the dashboard is loaded **When** the Unified API emits a reconciliation event **Then** the event is received via SSE within 1 second **And** connection status shows "connected" in the UI

2. **Given** SSE connection fails **When** 5 consecutive reconnection attempts fail (exponential backoff: 1s, 2s, 4s, 8s, 16s) **Then** system falls back to 10s polling **And** a "Live updates paused" banner appears with "Reconnect" button

3. **Given** the server sends a heartbeat event **When** 30 seconds pass without a heartbeat **Then** the connection is closed and reopened automatically

## Tasks / Subtasks

- [ ] Task 1: Create SSE stream wrapper (AC: #1, #2, #3)
  - [ ] Create `src/lib/reconciliation-stream.ts` with EventSource wrapper
  - [ ] Implement exponential backoff reconnection (1s initial, 30s max, jitter ±20%)
  - [ ] Add heartbeat timeout handler (30s threshold)
  - [ ] Implement polling fallback after 5 consecutive failures

- [ ] Task 2: Create React hook for stream consumption (AC: #1)
  - [ ] Create `src/features/reliability-feed/hooks/useReconciliationStream.ts`
  - [ ] Integrate with TanStack Query via `queryClient.setQueryData`
  - [ ] Track connection status: 'connected' | 'reconnecting' | 'polling-fallback' | 'offline'

- [ ] Task 3: Create `useReliableQuery` hook (AC: all)
  - [ ] Create `src/features/reliability-feed/hooks/useReliableQuery.ts`
  - [ ] Wrap TanStack Query's `useQuery` with SSE-driven invalidation
  - [ ] Handle stale/error states per architecture patterns
  - [ ] Expose `isStale`, `lastUpdatedAt`, `connectionStatus` in return value
  - [ ] Integrate with `reconciliation-stream.ts` for cache updates

- [ ] Task 4: Create connection status UI (AC: #1, #2)
  - [ ] Create `src/components/reliability/ConnectionStatusBadge.tsx`
  - [ ] Show "connected" (emerald), "reconnecting" (amber), "polling" (sky), "offline" (rose)
  - [ ] Add "Reconnect" button for manual reconnection

- [ ] Task 5: Create feature module structure
  - [ ] Create `src/features/reliability-feed/` directory structure
  - [ ] Create `api/`, `components/`, `hooks/`, `data/`, `tests/` subdirectories
  - [ ] Create `src/components/reliability/` shared component directory

- [ ] Task 6: Create RootErrorBoundary (required by architecture)
  - [ ] Create `src/components/layout/RootErrorBoundary.tsx`
  - [ ] Wrap app root with error boundary
  - [ ] Post client errors to `/audit/client-error` via apiClient
  - [ ] Show "Reload Dashboard" button on fatal errors
  - [ ] NOTE: Existing `src/components/ErrorBoundary.tsx` handles component-level errors; this is the app-level fallback

- [ ] Task 7: Create feature flags utility
  - [ ] Create `src/lib/feature-flags.ts`
  - [ ] Read flags from `VITE_FF_*` env variables
  - [ ] Export typed helpers: `isFeatureEnabled('AI_DELEGATION')`, etc.
  - [ ] Gate Epic 4+ features behind appropriate flags

- [ ] Task 8: Write tests (AC: all)
  - [ ] Unit tests for `reconciliation-stream.ts` reconnection logic
  - [ ] Integration tests for `useReconciliationStream` hook
  - [ ] Mock SSE events for testing

## Dev Notes

### Architecture Compliance

**CRITICAL** - This story establishes the SSE foundation used by ALL subsequent stories.

Per `architecture.md`:
- SSE endpoints: `/reconciliation/stream` broadcasts verification events
- Connection state management: Track status in TanStack Query, not Zustand
- `connectionStatus` atom tracks: `'connected' | 'reconnecting' | 'polling-fallback' | 'offline'`

### Endpoint Details

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/reconciliation/stream` | GET (SSE) | Real-time updates stream |
| `/reconciliation/audit` | GET | Paginated audit log |

- **Full SSE path:** `${VITE_API_BASE_URL}/reconciliation/stream`
- **No query parameters** for MVP
- **No auth headers** – Tailscale-only access (per architecture)
- **Response format:** Server-Sent Events with `event: reconciliation.update` and `event: heartbeat`

### Technical Requirements

**SSE Reconnection Strategy** (from Architecture):
- Initial delay: 1s
- Max delay: 30s
- Jitter: ±20%
- After 5 consecutive failures → switch to polling fallback (10s interval)
- Show "Live updates paused" banner

**Heartbeat Handling**:
- Server sends heartbeat every 15s
- Client timeout: 30s without heartbeat → close and reopen

### Library/Framework Requirements

- Use native `EventSource` API (no external library needed)
- TanStack Query 5.90.16 for cache integration
- Zod for event payload validation

### File Structure Requirements

```
src/
├── lib/
│   └── reconciliation-stream.ts    # NEW - SSE wrapper with reconnection
├── features/
│   └── reliability-feed/
│       ├── hooks/
│       │   └── useReconciliationStream.ts  # NEW
│       └── tests/
│           └── reconciliation-stream.test.ts  # NEW
└── components/
    └── reliability/
        └── ConnectionStatusBadge.tsx  # NEW
```

### Testing Requirements

- Unit tests for reconnection logic with mock timers
- Test exponential backoff timing
- Test polling fallback trigger after 5 failures
- Test heartbeat timeout handling

### SSE Event Schema

```typescript
// Per architecture.md patterns
const reconciliationEventSchema = z.object({
  eventId: z.string(),
  service: z.string(),
  status: z.enum(['verified', 'stale', 'discrepancy']),
  counts: z.record(z.number()),
  checksum: z.string(),
  latencyMs: z.number(),
  discrepancyDetails: z.optional(z.object({
    expected: z.record(z.number()),
    actual: z.record(z.number()),
    missingJobIds: z.array(z.string())
  }))
});
```

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#SSE Reconnection & Connection Management]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
