# Story 2.4: Audit Trail Viewer

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: These stories must be complete before this story can be implemented.

- [ ] Story 0.1: Backend reconciliation module with `/reconciliation/audit` endpoint
- [ ] Story 2.1: Command bus that creates audit entries

## Story

As a dashboard user,
I want to view a log of all maintenance actions,
So that reliability decisions are traceable and I can review what changed.

## Acceptance Criteria

1. **Given** the audit trail panel is opened **When** the view loads **Then** it shows a table with: timestamp, actor, action type, target, outcome **And** entries are sorted newest-first with pagination (50 per page)

2. **Given** user clicks on an audit entry **When** the detail drawer opens **Then** it shows full payload: before/after states, command parameters, execution logs **And** provides "Copy JSON" button for the entry

3. **Given** user applies filters **When** filters include: date range, action type, target service **Then** results update to match filter criteria **And** filter chips show active filters with clear buttons

4. **Given** a new maintenance action occurs **When** the audit trail panel is open **Then** the new entry appears at the top with subtle highlight animation **And** "New entries" badge appears if user has scrolled down

## Tasks / Subtasks

- [ ] Task 1: Create AuditTrailPanel component (AC: #1)
  - [ ] Create `src/features/maintenance/components/AuditTrailPanel.tsx`
  - [ ] Table columns: timestamp, actor, action type, target, outcome
  - [ ] Newest-first sorting
  - [ ] Pagination with 50 items per page

- [ ] Task 2: Create Audit Entry Detail Drawer (AC: #2)
  - [ ] Create `src/features/maintenance/components/AuditDetailDrawer.tsx`
  - [ ] Display full payload: before/after states
  - [ ] Show command parameters and execution logs
  - [ ] Add "Copy JSON" button

- [ ] Task 3: Implement filters (AC: #3)
  - [ ] Date range picker filter
  - [ ] Action type dropdown filter
  - [ ] Target service dropdown filter
  - [ ] Filter chips with clear buttons

- [ ] Task 4: Implement real-time updates (AC: #4)
  - [ ] Subscribe to audit SSE events
  - [ ] Insert new entries at top with highlight animation
  - [ ] Show "New entries" badge when scrolled down

- [ ] Task 5: Implement virtualized list (AC: #1, NFR3)
  - [ ] Use virtualization for performance with 1000+ entries
  - [ ] Maintain scroll position during updates

- [ ] Task 6: Create useAuditTrail hook
  - [ ] Fetch from `/reconciliation/audit` endpoint
  - [ ] Support filtering and pagination
  - [ ] Subscribe to SSE for new entries

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test table rendering and pagination
  - [ ] Test filter application
  - [ ] Test real-time update insertion

## Dev Notes

### Architecture Compliance

**Implements FR7**: Audit Trail

Per `architecture.md`:
- Connects to `/reconciliation/audit` endpoint
- SQLite stores: timestamp, service, checksum, JSON payload, before/after metrics, actor
- Append-only audit table

### Technical Requirements

**Audit Entry Schema**:
```typescript
interface AuditEntry {
  id: string;
  timestamp: string;      // ISO-8601
  actor: string;          // User/system identifier
  actionType: string;     // 'retry-job', 'restart-service', etc.
  target: string;         // Job ID, service name
  outcome: 'success' | 'failure';
  beforeState?: Record<string, unknown>;
  afterState?: Record<string, unknown>;
  commandParams?: Record<string, unknown>;
  logs?: string[];
}
```

**Performance (NFR3)**:
- Tables handle 1000+ entries without lag
- Use virtualized list (react-virtual or similar)
- <16ms frame budget

### Library/Framework Requirements

- @tanstack/react-virtual for list virtualization
- shadcn/ui Table, DatePicker, Select
- TanStack Query for data fetching

### File Structure Requirements

```
src/features/maintenance/
├── components/
│   ├── AuditTrailPanel.tsx     # NEW
│   └── AuditDetailDrawer.tsx   # NEW
├── hooks/
│   └── useAuditTrail.ts        # NEW
```

### Dependencies

- **Requires Story 2.1**: Audit entries created by command bus
- **Builds on Epic 1**: Uses SSE for real-time updates

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR3, #NFR8]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
