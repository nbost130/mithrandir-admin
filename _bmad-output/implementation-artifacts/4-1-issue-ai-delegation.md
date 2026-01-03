# Story 4.1: Issue-to-AI Delegation

Status: future

> [!WARNING]
> **DEFERRED**: This story requires a design session before implementation.
> - AI workflow mechanism is not yet defined (n8n webhook? Gemini CLI? Custom orchestration?)
> - Requires Epic 6 (n8n integration) to establish automation foundation
> - Design session needed to define: command type, payload format, AI orchestration layer

## Story

As a dashboard user,
I want a "Launch Admin Dev Team" button on each issue,
So that I can delegate remediation to AI with packaged telemetry context.

## Acceptance Criteria

1. **Given** an issue is open in the detail drawer **When** user clicks "Launch Admin Dev Team" **Then** a confirmation modal shows: issue summary, attached telemetry, estimated scope **And** provides "Confirm Delegation" button

2. **Given** user confirms delegation **When** the AI workflow starts **Then** the button changes to "AI Working..." with spinner (indigo color) **And** a delegation record is created with: issue ID, telemetry snapshot, start time **And** audit log records: actor, issue ID, "delegated to AI", timestamp

3. **Given** the AI workflow is running **When** SSE events arrive from `/commands/run` **Then** status updates appear: "Analyzing...", "Implementing...", "Testing..." **And** the Issue Drawer shows live status chip

4. **Given** an issue was previously delegated **When** user views that issue **Then** delegation history is shown: previous attempts, outcomes, timestamps

## Tasks / Subtasks

- [ ] Task 1: Create AI Delegation module (AC: all)
  - [ ] Create `src/features/ai-delegation/` directory structure
  - [ ] Create `api/`, `components/`, `hooks/`, `data/`, `tests/` subdirectories

- [ ] Task 2: Add "Launch Admin Dev Team" button (AC: #1)
  - [ ] Add button to IssueDrawer (from Story 3.2)
  - [ ] Style with indigo accent color

- [ ] Task 3: Create Delegation Confirmation Modal (AC: #1)
  - [ ] Create `src/features/ai-delegation/components/DelegationModal.tsx`
  - [ ] Show issue summary and attached telemetry
  - [ ] Estimate scope based on issue labels/complexity
  - [ ] "Confirm Delegation" button

- [ ] Task 4: Implement delegation execution (AC: #2, #3)
  - [ ] Create delegation record via API
  - [ ] Include telemetry snapshot
  - [ ] Subscribe to SSE for status updates
  - [ ] Log to audit trail

- [ ] Task 5: Create AI Status Chip (AC: #3)
  - [ ] Create `src/features/ai-delegation/components/AIStatusChip.tsx`
  - [ ] States: "Analyzing" (sky), "Implementing" (indigo), "Testing" (amber), "Complete" (emerald), "Failed" (rose)
  - [ ] Show in IssueDrawer

- [ ] Task 6: Implement delegation history (AC: #4)
  - [ ] Show previous delegation attempts on issue
  - [ ] Display: outcome, timestamp, AI notes

- [ ] Task 7: Create useIssueDelegation hook
  - [ ] Create `src/features/ai-delegation/hooks/useIssueDelegation.ts`
  - [ ] Execute delegation via `/commands/run`
  - [ ] Subscribe to SSE for updates

- [ ] Task 8: Write tests (AC: all)
  - [ ] Test delegation flow
  - [ ] Test status chip updates
  - [ ] Test delegation history display

## Dev Notes

### Architecture Compliance

**Implements FR10**: Issue-to-AI Delegation
**Implements FR12**: Command Execution Layer (partial)

Per `architecture.md`:
- Integrates with existing `/commands/run` SSE stream
- AI delegation board subscribes to same SSE channel
- Delegation record schema for tracking

### Technical Requirements

**Delegation Record Schema**:
```typescript
interface DelegationRecord {
  id: string;
  issueId: string;
  issueTitle: string;
  status: 'pending' | 'analyzing' | 'implementing' | 'testing' | 'complete' | 'failed';
  startTime: string;
  endTime?: string;
  telemetrySnapshot: {
    services: ServiceStatus[];
    recentDiscrepancies: DiscrepancyEvent[];
    relatedJobs: JobSummary[];
  };
  actor: string;
  notes?: string[];
}
```

**Status Colors** (from UX):
- Analyzing: sky (`bg-sky-100 text-sky-600`)
- Implementing: indigo (`bg-indigo-100 text-indigo-600`)
- Testing: amber (`bg-amber-100 text-amber-600`)
- Complete: emerald (`bg-emerald-100 text-emerald-600`)
- Failed: rose (`bg-rose-100 text-rose-600`)

### Library/Framework Requirements

- shadcn/ui Dialog, Badge
- Command bus from Story 2.1
- Reuses SSE infrastructure from Epic 1

### File Structure Requirements

```
src/features/ai-delegation/
├── api/
│   └── delegation.ts          # NEW
├── components/
│   ├── DelegationModal.tsx    # NEW
│   └── AIStatusChip.tsx       # NEW
├── hooks/
│   └── useDelegation.ts       # NEW
└── data/
    └── schemas.ts             # NEW
```

### Dependencies

- **Requires Story 3.2**: Adds button to IssueDrawer
- **Requires Story 2.1**: Uses command bus

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1]
- [Source: _bmad-output/planning-artifacts/prd.md#FR10]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
