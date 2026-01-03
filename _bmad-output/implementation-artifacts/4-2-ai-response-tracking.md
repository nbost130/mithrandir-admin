# Story 4.2: AI Response Tracking Board

Status: future

> [!WARNING]
> **DEFERRED**: This story requires a design session before implementation.
> - Depends on Story 4.1 (AI delegation mechanism)
> - Design session needed to define SSE events from AI workflow

## Story

As a dashboard user,
I want a board showing all in-progress AI actions,
So that I can monitor multiple delegations and drill into updates.

## Acceptance Criteria

1. **Given** the AI Delegation tab is selected **When** the board loads **Then** it shows cards for each active AI delegation: issue title, status, elapsed time **And** cards are sorted by most recent activity

2. **Given** an AI delegation is in progress **When** SSE events update the status **Then** the card updates in real-time without page refresh **And** status badge updates: "Analyzing" (sky), "Implementing" (indigo), "Testing" (amber)

3. **Given** user clicks on a delegation card **When** the detail view opens **Then** it shows: full issue context, AI action log, code changes proposed **And** provides "View on GitHub" link for any PRs created

4. **Given** an AI delegation completes successfully **When** the completion event arrives **Then** card shows "Completed" (emerald) with summary **And** "Mark Resolved" button appears to close the issue

5. **Given** an AI delegation fails **When** the error event arrives **Then** card shows "Failed" (rose) with error message **And** "Retry" and "Manual Fix" buttons appear

## Tasks / Subtasks

- [ ] Task 1: Create DelegationBoard component (AC: #1, #2)
  - [ ] Create `src/features/ai-delegation/components/DelegationBoard.tsx`
  - [ ] Card layout showing: issue title, status, elapsed time
  - [ ] Sort by most recent activity
  - [ ] Real-time updates via SSE

- [ ] Task 2: Create DelegationCard component (AC: #1, #2, #4, #5)
  - [ ] Create `src/features/ai-delegation/components/DelegationCard.tsx`
  - [ ] Display issue title, status badge, elapsed timer
  - [ ] Animate status transitions
  - [ ] Show action buttons based on state

- [ ] Task 3: Create Delegation Detail View (AC: #3)
  - [ ] Create `src/features/ai-delegation/components/DelegationDetail.tsx`
  - [ ] Show full issue context
  - [ ] Display AI action log with timestamps
  - [ ] Show code changes/PR links

- [ ] Task 4: Implement completion handling (AC: #4)
  - [ ] Show "Completed" state with summary
  - [ ] Add "Mark Resolved" button
  - [ ] Update GitHub issue status on resolution

- [ ] Task 5: Implement failure handling (AC: #5)
  - [ ] Show "Failed" state with error message
  - [ ] Add "Retry" button for re-delegation
  - [ ] Add "Manual Fix" button linking to maintenance controls

- [ ] Task 6: Create AI Delegation route
  - [ ] Create `src/routes/ai-delegation/index.tsx`
  - [ ] Wire to TanStack Router

- [ ] Task 7: Create useDelegationBoard hook
  - [ ] Fetch all active delegations
  - [ ] Subscribe to SSE for updates
  - [ ] Handle filtering and sorting

- [ ] Task 8: Write tests (AC: all)
  - [ ] Test board rendering
  - [ ] Test real-time status updates
  - [ ] Test completion/failure flows

## Dev Notes

### Architecture Compliance

**Implements FR11**: AI Response Tracking

Per `architecture.md`:
- Uses SSE channel shared with maintenance commands
- Status color mapping per UX spec

### Technical Requirements

**Status Badge Colors**:
- Analyzing: sky (`bg-sky-100 text-sky-600`)
- Implementing: indigo (`bg-indigo-100 text-indigo-600`)
- Testing: amber (`bg-amber-100 text-amber-600`)
- Completed: emerald (`bg-emerald-100 text-emerald-600`)
- Failed: rose (`bg-rose-100 text-rose-600`)

**Elapsed Time Display**:
- Show as "Xm Ys" format
- Update every second while active

### Library/Framework Requirements

- shadcn/ui Card, Badge, Button
- TanStack Query for data
- Uses SSE from Epic 1

### File Structure Requirements

```
src/features/ai-delegation/
├── components/
│   ├── DelegationBoard.tsx    # NEW
│   ├── DelegationCard.tsx     # NEW
│   └── DelegationDetail.tsx   # NEW
├── hooks/
│   └── useDelegationBoard.ts  # NEW

src/routes/ai-delegation/
└── index.tsx                  # NEW
```

### Dependencies

- **Requires Story 4.1**: Uses delegation records
- **Requires Epic 1**: Uses SSE infrastructure

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2]
- [Source: _bmad-output/planning-artifacts/prd.md#FR11]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
