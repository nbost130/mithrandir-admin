# Story 2.3: Service Restart Operations

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCIES**: These stories must be complete before this story can be implemented.

- [ ] Story 1.3: Service health tiles (to extend with restart action)
- [ ] Story 2.1: Command bus and confirmation modal patterns

## Story

As a dashboard user,
I want to restart transcription worker, unified API, and dashboard process,
So that I can recover services without SSH access.

## Acceptance Criteria

1. **Given** a service tile shows unhealthy status **When** user clicks "Restart Service" **Then** confirmation modal shows: service name, current state, expected downtime **And** warns "Service will be unavailable during restart"

2. **Given** user confirms restart **When** the restart command executes **Then** tile shows "Restarting..." state (indigo, spinning icon) **And** SSE streams: "Stopping service" → "Starting service" → "Health check" **And** post-restart health check runs automatically

3. **Given** restart succeeds **When** health check passes **Then** tile returns to healthy state (emerald) **And** audit log records: actor, service, "restarted", before/after state

4. **Given** restart fails or health check fails **When** error state is reached **Then** tile shows "Restart Failed" (rose) **And** error message with remediation guidance is displayed **And** "View Logs" button shows systemd journal output

5. **Given** user attempts to restart the dashboard itself **When** confirmation modal appears **Then** it warns "You will be disconnected and page will reload" **And** includes 10-second countdown before auto-reconnect attempt

## Tasks / Subtasks

- [ ] Task 1: Add Restart button to Service Tile (AC: #1)
  - [ ] Extend `ServiceHealthTile.tsx` with restart action
  - [ ] Show "Restart Service" option in dropdown or button
  - [ ] Wire to confirmation modal

- [ ] Task 2: Create Service Restart Modal (AC: #1, #5)
  - [ ] Create `src/features/maintenance/components/ServiceRestartModal.tsx`
  - [ ] Show service name, current state, expected downtime
  - [ ] Special handling for dashboard self-restart

- [ ] Task 3: Implement restart state display (AC: #2)
  - [ ] Show "Restarting..." state on tile (indigo color, spinner)
  - [ ] Stream SSE phases: stopping → starting → health check

- [ ] Task 4: Implement post-restart health check (AC: #2, #3, #4)
  - [ ] Automatic health check after restart completes
  - [ ] Update tile to healthy (emerald) or failed (rose)
  - [ ] Record before/after state snapshots (NFR10)

- [ ] Task 5: Handle restart failures (AC: #4)
  - [ ] Show "Restart Failed" state
  - [ ] Display error message with remediation guidance
  - [ ] Add "View Logs" button for systemd journal

- [ ] Task 6: Implement dashboard self-restart (AC: #5)
  - [ ] Special warning about disconnection
  - [ ] 10-second countdown before disconnect
  - [ ] Auto-reconnect attempt after page reload

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test restart flow with mocked SSE
  - [ ] Test health check success/failure paths
  - [ ] Test self-restart special handling

## Dev Notes

### Architecture Compliance

**Implements FR6**: Service Restarts
**Implements NFR10**: Before/after snapshots

Per `architecture.md`:
- Command bus with restart-specific SSE events
- Before/after state snapshots for auditability
- Self-restart with auto-reconnect handling

### Technical Requirements

**Restart Phases**:
1. Show confirmation modal
2. Execute restart command
3. Stream status: "Stopping service" → "Starting service" → "Health check"
4. Verify health post-restart
5. Log before/after states

**Self-Restart Handling** (Approved by Architect):

1. Store `{ restartingDashboard: true, restartTime: Date.now() }` in sessionStorage
2. Send `POST /commands/run` with `type: 'restart-service', target: 'mithrandir-admin'`
3. Show countdown modal: "Dashboard restarting in 10s..."
4. After 10s, `window.location.reload()`
5. On reload:
   - Check sessionStorage for `restartingDashboard` flag
   - If present AND within 2 minutes of `restartTime`: show success toast
   - Clear the flag

**Edge Case Handling** (per architect refinement):
- Store retry counter in sessionStorage
- After 3 reload attempts without success:
  - Show: "Dashboard may not have restarted correctly"
  - Provide link to Unified API Swagger UI as debugging entry point
  - Provide "Go to Unified API" link as escape hatch

### Library/Framework Requirements

- shadcn/ui Dialog, Spinner
- Command bus from Story 2.1
- SSE streaming from Epic 1

### File Structure Requirements

```
src/features/maintenance/
├── components/
│   └── ServiceRestartModal.tsx    # NEW
```

### Dependencies

- **Requires Story 1.3**: Extends ServiceHealthTile
- **Requires Story 2.1**: Uses command bus

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR10]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
