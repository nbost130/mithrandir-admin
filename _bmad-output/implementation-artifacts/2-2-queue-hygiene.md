# Story 2.2: Queue Hygiene Operations

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCIES**: These stories must be complete before this story can be implemented.

- [ ] Story 0.2: Palantir stuck job endpoint (`GET /api/v1/jobs/stuck`)
- [ ] Story 2.1: Command bus and confirmation modal patterns

## Story

As a dashboard user,
I want to purge stuck queues or clear old jobs from the UI,
So that I can maintain system health without manual intervention.

## Acceptance Criteria

1. **Given** the queue management panel is displayed **When** user clicks "Purge Stuck Jobs" **Then** modal shows count of jobs in "stuck" state (processing > 1 hour) **And** lists affected job IDs (max 10, with "and X more" overflow)

2. **Given** user confirms purge operation **When** command executes **Then** SSE streams progress: "Purging job 1 of N..." **And** each job result (success/failure) is displayed inline **And** summary shows: "Purged X jobs, Y failed"

3. **Given** user clicks "Clear Completed Jobs Older Than 7 Days" **When** modal appears **Then** it shows count of jobs to be cleared **And** provides date range selector for custom retention

4. **Given** queue operation is in progress **When** user attempts another queue operation **Then** button is disabled with "Operation in progress" tooltip

## Tasks / Subtasks

- [ ] Task 1: Create Queue Management Panel (AC: #1)
  - [ ] Create `src/features/maintenance/components/QueueManagementPanel.tsx`
  - [ ] Show queue statistics: total, stuck, completed, failed
  - [ ] Display "Purge Stuck Jobs" and "Clear Old Jobs" buttons

- [ ] Task 2: Create Purge Modal (AC: #1, #2)
  - [ ] Create `src/features/maintenance/components/PurgeModal.tsx`
  - [ ] Show stuck job count (processing > 1 hour threshold)
  - [ ] List affected job IDs (max 10, overflow indicator)
  - [ ] Wire to command bus for execution

- [ ] Task 3: Implement progress streaming (AC: #2)
  - [ ] Display SSE progress: "Purging job 1 of N..."
  - [ ] Show per-job success/failure inline
  - [ ] Display final summary: "Purged X jobs, Y failed"

- [ ] Task 4: Create Clear Old Jobs Modal (AC: #3)
  - [ ] Create `src/features/maintenance/components/ClearOldJobsModal.tsx`
  - [ ] Show count of jobs to clear
  - [ ] Add date range selector for custom retention window
  - [ ] Default: 7 days

- [ ] Task 5: Implement operation locking (AC: #4)
  - [ ] Track active queue operations in state
  - [ ] Disable buttons during active operation
  - [ ] Show "Operation in progress" tooltip

- [ ] Task 6: Write tests (AC: all)
  - [ ] Test stuck job detection threshold
  - [ ] Test progress streaming display
  - [ ] Test operation locking behavior

## Dev Notes

### Architecture Compliance

**Implements FR5**: Queue Hygiene

Per `architecture.md`:
- Reuses `useCommandBus` from Story 2.1
- Command types: 'purge-stuck', 'clear-old-jobs'
- Operations log to audit trail

### Technical Requirements

**Stuck Job Definition**:
- Status = "processing"
- Age > 1 hour (3600 seconds)
- **Data source**: Unified API proxies `GET /api/jobs/stuck` from Palantir (see Story 0.2)
- Dashboard calls Unified API, never Palantir directly

**Clear Old Jobs**:
- Default retention: 7 days
- Custom range via date picker
- Only clears completed/failed jobs (not active)

**Operation Locking**:
- Prevent concurrent queue modifications
- Lock at queue level, not global

### Library/Framework Requirements

- shadcn/ui Dialog, Button, Tooltip
- date-fns or DatePicker for custom retention
- Reuses command bus from Story 2.1

### File Structure Requirements

```
src/features/maintenance/
├── components/
│   ├── QueueManagementPanel.tsx   # NEW
│   ├── PurgeModal.tsx             # NEW
│   └── ClearOldJobsModal.tsx      # NEW
```

### Dependencies

- **Requires Story 2.1**: Uses command bus and confirmation modal patterns

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2]
- [Source: _bmad-output/planning-artifacts/prd.md#FR5]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
