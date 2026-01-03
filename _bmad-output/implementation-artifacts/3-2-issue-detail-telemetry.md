# Story 3.2: Issue Detail with Telemetry Attachments

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 3.1 must be complete before this story can be implemented.

- [ ] Story 3.1: GitHub issue feed and IssueTable component

## Story

As a dashboard user,
I want each issue view to show logs/metrics relevant to that issue,
So that I have full context when triaging.

## Acceptance Criteria

1. **Given** user clicks on an issue in the list **When** the Issue Detail drawer opens (400px from right) **Then** it shows: issue title, body (rendered markdown), labels, assignees, timeline

2. **Given** the issue has associated telemetry (mentioned service name or job ID) **When** the drawer loads **Then** relevant telemetry cards are embedded: recent discrepancies, service status, job history **And** cards are collapsible with "Show more" links

3. **Given** the issue body contains a job ID pattern (e.g., `job-12345`) **When** the drawer parses the body **Then** the job ID becomes a clickable link to the transcription detail view **And** inline preview shows job status on hover

4. **Given** the issue mentions a service name **When** the drawer parses the body **Then** the current health status of that service is shown inline **And** clicking shows the full service tile

5. **Given** user scrolls within the drawer **When** new telemetry updates arrive via SSE **Then** scroll position is preserved **And** "New data available" indicator appears at top if updates occurred

## Tasks / Subtasks

- [ ] Task 1: Create IssueDrawer component (AC: #1)
  - [ ] Create `src/features/issues/components/IssueDrawer.tsx`
  - [ ] 400px width, slides from right (per UX spec)
  - [ ] Render issue: title, markdown body, labels, assignees, timeline

- [ ] Task 2: Implement telemetry card embedding (AC: #2)
  - [ ] Detect service names and job IDs in issue body
  - [ ] Embed relevant telemetry cards
  - [ ] Make cards collapsible with "Show more"

- [ ] Task 3: Implement job ID linking (AC: #3)
  - [ ] Parse job ID patterns (e.g., `job-12345`, `JOB#12345`)
  - [ ] Make clickable links to transcription detail
  - [ ] Add hover preview with job status

- [ ] Task 4: Implement service name detection (AC: #4)
  - [ ] Detect known service names in body
  - [ ] Show inline health status badge
  - [ ] Click to expand full service tile

- [ ] Task 5: Preserve scroll position on updates (AC: #5)
  - [ ] Track scroll position in state
  - [ ] Restore after SSE updates
  - [ ] Show "New data available" indicator

- [ ] Task 6: Create useIssueDetail hook
  - [ ] Fetch full issue detail
  - [ ] Parse body for telemetry references
  - [ ] Subscribe to SSE for related services

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test drawer rendering
  - [ ] Test job ID and service name detection
  - [ ] Test scroll preservation

## Dev Notes

### Architecture Compliance

**Implements FR9**: Issue Detail & Telemetry Attachments

Per `architecture.md#Drawer & Modal Component Patterns`:
- Issue Detail Drawer: displays GitHub issue with embedded telemetry cards
- AI status chip at top (for Story 4.1)
- "Launch Admin Dev Team" button at bottom (for Story 4.1)
- Maintains scroll position when AI status updates

### Technical Requirements

**Body Parsing Patterns**:
- Job ID: `/job[-#]?\d+/gi` matches `job-12345`, `job#12345`, `JOB 12345`
- Service names: Match against known service registry

**Telemetry Cards**:
- Reuse components from Epic 1 (TranscriptionTelemetryCard, ServiceHealthTile)
- Make collapsible with expand/collapse state

**Scroll Preservation**:
- Use `useRef` for scroll container
- Restore position after data updates

### Library/Framework Requirements

- shadcn/ui Drawer
- react-markdown for rendering issue body
- Reuses Epic 1 telemetry components

### File Structure Requirements

```
src/features/issues/
├── components/
│   ├── IssueDrawer.tsx         # NEW
│   └── TelemetryAttachment.tsx # NEW
├── hooks/
│   └── useIssueDetail.ts       # NEW
└── utils/
    └── parseIssueBody.ts       # NEW - pattern matching
```

### Dependencies

- **Requires Story 3.1**: Extends issue list functionality
- **Requires Epic 1**: Uses telemetry components

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Drawer & Modal Component Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2]
- [Source: _bmad-output/planning-artifacts/prd.md#FR9]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
