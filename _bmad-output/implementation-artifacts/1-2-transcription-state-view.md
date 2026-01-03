# Story 1.2: Transcription State View with Discrepancy Detection

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 1.1 must be complete before this story can be implemented.

- [ ] Story 1.1: SSE reconciliation stream and `useReconciliationStream` hook

## Story

As a dashboard user,
I want to see Palantir + Unified API job stats with mismatch detection,
So that I immediately know when data is inconsistent.

## Acceptance Criteria

1. **Given** the dashboard loads transcription data from both APIs **When** job counts match between Palantir and Unified API **Then** card shows "Verified" badge (emerald color) **And** last-updated timestamp is visible **And** job counts by status (completed, failed, processing) are displayed

2. **Given** job counts differ between sources **When** the reconciliation module detects a mismatch **Then** a discrepancy banner appears with diagnostic details (expected vs actual counts) **And** the card shows "Investigating" badge (sky color) **And** the discrepancy is logged to the audit trail

3. **Given** the user clicks the discrepancy banner **When** the diagnostics drawer opens **Then** it shows detailed comparison: Palantir counts, Unified API counts, and mismatched job IDs

## Tasks / Subtasks

- [ ] Task 1: Create feature module structure (AC: all)
  - [ ] Create `src/features/reliability-feed/` directory structure
  - [ ] Create `api/`, `components/`, `hooks/`, `data/`, `tests/` subdirectories

- [ ] Task 2: Create Transcription Telemetry Card (AC: #1, #2)
  - [ ] Create `src/features/reliability-feed/components/TranscriptionTelemetryCard.tsx`
  - [ ] Display job counts by status (completed, failed, processing, pending)
  - [ ] Show last-updated timestamp with relative time
  - [ ] Implement status badges: verified (emerald), investigating (sky), stale (amber), error (rose)

- [ ] Task 3: Create Discrepancy Banner (AC: #2)
  - [ ] Create `src/components/reliability/DiscrepancyBanner.tsx`
  - [ ] Show expected vs actual counts
  - [ ] Make banner clickable to open diagnostics drawer
  - [ ] Log discrepancy to audit trail via API

- [ ] Task 4: Create Diagnostics Drawer (AC: #3)
  - [ ] Create `src/features/reliability-feed/components/DiagnosticsDrawer.tsx`
  - [ ] 400px width, slides from right (per UX spec)
  - [ ] Show tabbed view: Palantir counts, Unified API counts, Mismatched IDs
  - [ ] Implement close button and "Open in New Tab" link

- [ ] Task 5: Create data hooks (AC: all)
  - [ ] Create `useTranscriptionTelemetry` hook using `useReconciliationStream`
  - [ ] Parse SSE events for transcription service data
  - [ ] Handle verified/stale/discrepancy states

- [ ] Task 6: Write tests (AC: all)
  - [ ] Component tests for TranscriptionTelemetryCard
  - [ ] Test discrepancy detection and banner display
  - [ ] Test drawer open/close behavior

## Dev Notes

### Architecture Compliance

**Implements FR1**: Transcription State View with discrepancy detection

Per `architecture.md`:
- Feature-first layout: `src/features/reliability-feed/`
- Uses SSE events from Story 1.1's `useReconciliationStream`
- Status colors from shadcn tokens: verified=emerald, stale=amber, investigating=sky, error=rose

### Technical Requirements

**Discrepancy Detection Logic**:
- Compare `counts.completed`, `counts.failed`, `counts.processing` between Palantir and reconciled data
- ANY mismatch triggers discrepancy state
- Log discrepancy event with: timestamp, expected counts, actual counts, service name

**Semantic Status Colors** (from UX Design):
- Verified: `text-emerald-500`/`bg-emerald-100`
- Stale: `text-amber-500`/`bg-amber-100`
- Investigating: `text-sky-500`/`bg-sky-100`
- Error: `text-rose-500`/`bg-rose-100`

### Discrepancy Logging Flow

Per `architecture.md` line 126: "Unified API reconciliation module owns the single source of truth: every telemetry poll and maintenance action writes to a SQLite discrepancy/audit log before UI consumption."

**Recommendation based on architecture:**
- The **Unified API (backend)** logs discrepancies to the SQLite audit table when detected during reconciliation polling
- The **frontend displays** discrepancy events but does NOT write to the audit trail directly
- Audit entries arrive via SSE `reconciliation.update` events with `status: 'discrepancy'`
- The Audit Trail Viewer (Story 2-4) displays these logged events

### Library/Framework Requirements

- TanStack Query for data fetching
- shadcn/ui for Card, Badge, Drawer components
- Zod for data validation
- date-fns for relative timestamps

### File Structure Requirements

```
src/features/reliability-feed/
├── api/
│   └── transcription.ts           # API client functions
├── components/
│   ├── TranscriptionTelemetryCard.tsx
│   └── DiagnosticsDrawer.tsx
├── hooks/
│   └── useTranscriptionTelemetry.ts
├── data/
│   └── schemas.ts                 # Zod schemas
└── tests/
    └── transcription-telemetry.test.ts
```

### Drawer Pattern (from Architecture)

Per `architecture.md#Drawer & Modal Component Patterns`:
- Diagnostics Drawer: 400px width desktop, full-screen mobile
- Slides from right
- Contains tabs for Logs, Metrics, Actions
- Always includes close button and "Open in New Tab" link

### Dependencies

- **Requires Story 1.1**: Uses `useReconciliationStream` hook for SSE data

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Drawer & Modal Component Patterns]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Semantic Status Colors]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2]
- [Source: _bmad-output/planning-artifacts/prd.md#FR1]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
