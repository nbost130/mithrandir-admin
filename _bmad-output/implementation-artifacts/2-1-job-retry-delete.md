# Story 2.1: Job Retry and Delete Operations

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 1.1 must be complete before this story can be implemented.

- [ ] Story 1.1: SSE infrastructure for command status streaming

## Story

As a dashboard user,
I want to retry and delete transcription jobs directly from the table,
So that I can fix failed jobs without SSH access.

## Acceptance Criteria

1. **Given** a failed job is displayed in the transcription table **When** user clicks "Retry" button **Then** a confirmation modal appears showing job ID and expected action **And** the modal requires explicit "Confirm Retry" button click

2. **Given** user confirms the retry action **When** the command executes via `/commands/run` **Then** SSE streams status updates: "running" → "success" or "error" **And** the job table updates to reflect new status **And** the action is logged to audit trail with actor, job ID, and outcome

3. **Given** user clicks "Delete" on a job **When** the confirmation modal appears **Then** it warns "This action cannot be undone" **And** requires typing job ID to confirm (destructive action safeguard)

4. **Given** user confirms delete **When** the command executes **Then** job is removed from the table **And** audit log records: actor, job ID, "deleted", timestamp

## Tasks / Subtasks

- [ ] Task 1: Create command bus library (AC: #2, #4)
  - [ ] Create `src/lib/command-bus.ts` with SSE command execution
  - [ ] Implement idempotent command ID generation
  - [ ] Track command states: 'pending', 'running', 'success', 'error'
  - [ ] Stream SSE events to UI

- [ ] Task 2: Create useCommandBus hook (AC: #2)
  - [ ] Create `src/features/maintenance/hooks/useCommandBus.ts`
  - [ ] Execute commands via `/commands/run` endpoint
  - [ ] Subscribe to SSE stream for status updates
  - [ ] Integrate with TanStack Query for cache invalidation

- [ ] Task 3: Create confirmation modal component (AC: #1, #3)
  - [ ] Create `src/features/maintenance/components/ConfirmationModal.tsx`
  - [ ] Standard confirmation with "Confirm [Action]" button
  - [ ] Destructive confirmation requiring typed confirmation (job ID)
  - [ ] Show before/after preview

- [ ] Task 4: Add Retry button to job table (AC: #1, #2)
  - [ ] Extend existing transcription job table
  - [ ] Add "Retry" button for failed jobs
  - [ ] Wire to confirmation modal and command bus

- [ ] Task 5: Add Delete button with safeguard (AC: #3, #4)
  - [ ] Add "Delete" button with destructive styling
  - [ ] Implement typed confirmation input
  - [ ] Wire to confirmation modal and command bus

- [ ] Task 6: Implement audit logging (AC: #2, #4)
  - [ ] Log commands to audit trail via API
  - [ ] Include: actor, action, target, outcome, timestamp

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test confirmation modal behavior
  - [ ] Test destructive confirmation safeguard
  - [ ] Test command execution flow
  - [ ] Test audit log creation

## Dev Notes

### Architecture Compliance

**Implements FR4**: Job Operations (retry/delete)
**Implements FR7**: Audit Trail

Per `architecture.md`:
- `/commands/run` issues idempotent command IDs and streams `{eventId, status, logs}` over SSE
- Maintenance actions must either succeed or report failure with remediation guidance (NFR5)
- Append-only audit table enforced with SQLite triggers

### Technical Requirements

**Command Bus Pattern** (from Architecture):
```typescript
// Command request format
interface CommandRequest {
  commandId: string;        // Idempotent UUID
  type: 'retry-job' | 'delete-job' | 'purge-queue' | 'restart-service';
  target: string;           // Job ID, service name, etc.
  params?: Record<string, unknown>;
}

// SSE response format
interface CommandEvent {
  commandId: string;
  phase: 'queued' | 'running' | 'success' | 'error';
  logs: string[];
  result?: unknown;
}
```

**Destructive Action Safeguard**:
- Delete requires user to type the job ID to confirm
- Modal warns "This action cannot be undone"

### Library/Framework Requirements

- shadcn/ui Dialog for modals
- TanStack Query for cache updates
- uuid for command ID generation

### File Structure Requirements

```
src/lib/
├── command-bus.ts          # NEW - command execution + queue management + timeouts

src/features/maintenance/
├── hooks/
│   └── useCommandBus.ts    # NEW - React hook wrapper for command-bus.ts
├── components/
│   └── ConfirmationModal.tsx  # NEW
```

> [!NOTE]
> Per architect decision: Queue management lives in `src/lib/command-bus.ts` (shared infrastructure), not in feature-specific hooks. All queue awareness (position, concurrency, timeouts) is centralized here and consumed by both maintenance (Epic 2) and AI delegation (Epic 4) features.

### Modal Pattern (from Architecture)

Per `architecture.md#Drawer & Modal Component Patterns`:
- Maintenance Action Modal: Centered dialog with confirmation step
- Shows inline progress during action execution
- Success/error state with "View Audit Log" link

### Existing Transcription Table Location

**EXISTING COMPONENT - Extend, don't recreate:**

Location: `src/features/transcription/components/transcription-table.tsx`

The table already has:
- ✅ Retry button for failed jobs (line 265-267)
- ✅ Delete button for all jobs (line 274-276)
- ✅ `handleRetry` and `handleDelete` functions (lines 89-104)
- ❌ **Missing:** Confirmation modals (currently executes immediately)
- ❌ **Missing:** Audit trail logging
- ❌ **Missing:** SSE status streaming

**This story adds:**
1. Confirmation modal before retry/delete
2. Destructive confirmation (type job ID) for delete
3. Route through command bus for SSE streaming
4. Audit trail integration

**NOT creating a new table** - extending the existing one.

### Dependencies

- **Requires Epic 1**: Uses SSE infrastructure from Story 1.1

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Drawer & Modal Component Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
