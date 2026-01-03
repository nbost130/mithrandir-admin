---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/architecture.md
  - _bmad-output/planning-artifacts/ux-design-specification.md
workflowType: epics-and-stories
lastStep: 4
---

# Mithrandir Admin - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for Mithrandir Admin, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

---

## Story Validation Summary

**Last Validated:** 2026-01-03 | **Status:** ✅ APPROVED FOR IMPLEMENTATION

### Implementation Readiness

| Epic | Stories | Status | Notes |
|------|---------|--------|-------|
| Epic 0 | 2 | Ready | Backend prerequisites (blocking) |
| Epic 1 | 4 | Ready | Reliability foundation |
| Epic 2 | 4 | Ready | Maintenance command center |
| Epic 3 | 2 | Ready | GitHub issue hub |
| Epic 4 | 5 | **Deferred** | Needs design session for AI workflow |
| Epic 5 | 3 | Ready | Service discovery |
| Epic 6 | 3 | Future | Advanced automation |

**Total:** 20 stories created, 15 ready for implementation

### Dependency Chain

```
Epic 0 (Backend) → Epic 1 (Telemetry) → Epic 2 (Maintenance) → Epic 3 (Issues) → Epic 5 (Discovery)
                                                            ↘ Epic 4 (AI) [deferred]
```

### Key Architectural Decisions (2026-01-03)

1. **Command Bus:** Queue management in `src/lib/command-bus.ts` (shared infrastructure)
2. **Stuck Job Detection:** Palantir calculates, Unified API proxies
3. **Self-Restart:** sessionStorage + countdown with 3-retry escape hatch
4. **Epic 4 Deferral:** Requires Epic 6 (n8n) foundation + design session
5. **Prerequisites:** All stories have explicit "Prerequisites" sections for hard blockers

### Cross-Repository Work

- **mithrandir-unified-api:** Story 0.1 (reconciliation module, SSE, command bus)
- **transcription-palantir:** Story 0.2 (stuck job endpoint)
- **mithrandir-admin:** All other stories

---

## Requirements Inventory

### Functional Requirements

**Reliability Telemetry:**
- FR1: Transcription State View – Dashboard shows Palantir + Unified API job stats (counts, status breakdowns, last updated). Any mismatch triggers a discrepancy banner with diagnostics.
- FR2: Service Health Matrix – Tiles/cards for transcription worker, unified API, dashboard, and other registered services showing uptime, status, last check, and quick links to logs.
- FR3: Stale/Ratelimit Messaging – If data can't be refreshed (429/500, network failure), the UI explains the reason and offers retry/snooze.

**Maintenance & Controls:**
- FR4: Job Operations – Retry and delete jobs directly from the table, with confirmation modals and audit logging.
- FR5: Queue Hygiene – Purge stuck queues or clear old jobs from the UI with status feedback.
- FR6: Service Restarts – Restart transcription worker, unified API, and the dashboard process itself; surface success/failure + post-action health check.
- FR7: Audit Trail – Log every maintenance action (who/what/when/outcome) so reliability decisions are traceable.

**Issue & Delegation Hub:**
- FR8: GitHub Issue Feed – In-dashboard list of open issues (all /dev repos), filterable and searchable.
- FR9: Issue Detail & Telemetry Attachments – Each issue view shows logs/metrics relevant to that issue (recent discrepancy data, service statuses, job history).
- FR10: Issue-to-AI Delegation – "Launch admin dev team" button per issue that packages telemetry and kicks off the AI workflow; show current status (analyzing, resolving, done).
- FR11: AI Response Tracking – Board showing in-progress AI actions, with the ability to drill into updates and mark the issue as resolved when done.

**AI-Assisted Remediation:**
- FR12: Command Execution Layer – Dashboard sends remediation commands (restart, purge, apply config patch) to AI workflows and receives structured results.
- FR13: Health Verification – After AI action completes, dashboard automatically re-checks telemetry to confirm the health improved; highlight if further steps are needed.
- FR14: Fallback Path – Manual buttons remain available even if AI workflow fails or is offline.

**Service Onboarding:**
- FR15: Auto-Discovery – When a new service registers in the Unified API, the dashboard picks it up, adds a tile with default telemetry, and prompts for custom actions if needed.
- FR16: Validation Gate – New services must pass a basic health endpoint check before they appear on the dashboard; errors produce a warning so misconfigured services are obvious.

**Future Modules & Growth:**
- FR17: Delegation Enhancements – Ability to assign prioritization to AI dev tasks, track SLAs, and push updates back into GitHub automatically.
- FR18: n8n Workflow Control – Monitor and control n8n automations (start/stop workflows, view recent runs, see failures).
- FR19: Cross-Project Ops View – Aggregated feed for reliability incidents across all homelab services.

### Non-Functional Requirements

**Performance & Responsiveness:**
- NFR1: Dashboard loads interactive UI in ≤1s on homelab network; subsequent route changes under 300 ms.
- NFR2: Polling cadence default 5 s; system must throttle gracefully to avoid Unified API rate limits.
- NFR3: Tables and cards handle 1,000+ jobs without noticeable lag (<16 ms frame budget).

**Reliability & Accuracy:**
- NFR4: Zero silent discrepancies: any mismatch between dashboard data and Palantir/Unified API is detected, logged, and surfaced within one polling cycle.
- NFR5: Maintenance actions must either succeed or report failure with remediation guidance—no silent failures.

**Availability & Security:**
- NFR6: Accessible only via Tailscale; requests from non-Tailscale networks must be rejected.
- NFR7: Environment variables, secrets, and service tokens remain local; dashboard should warn if expected env vars are missing.

**Observability & Logging:**
- NFR8: All maintenance actions, discrepancy detections, and AI delegation events are logged with timestamps and payload references for future audits.
- NFR9: Logs must include enough context to reproduce incidents (job IDs, service names, API responses).

**Operability & Maintainability:**
- NFR10: After any automated action (AI workflow or manual command), system re-checks health and records "before/after" snapshots.
- NFR11: Configurable feature flags so new modules (e.g., n8n control) can roll out gradually without code redeploy.

**Accessibility & UX Safeguards:**
- NFR12: Keyboard navigation for every control; focus-visible states and ARIA labels for discrepancy alerts.
- NFR13: Graceful messaging whenever data is stale or unavailable (no "blank" screens or silent failures).

### Additional Requirements

**From Architecture:**
- **BROWNFIELD PROJECT**: Existing React 19 + Vite 7 + TanStack scaffold already in place. No new project initialization needed.
- Unified API reconciliation module owns the single source of truth with SQLite 3.43.x audit log
- Server-Sent Events endpoints (`/reconciliation/stream`, `/commands/run`) for real-time updates
- SSE reconnection with exponential backoff (1s initial, 30s max, 5 failures → polling fallback)
- Error boundaries: route-level + global RootErrorBoundary with audit logging
- Service discovery polling every 60s with 3-retry health checks (2s, 4s, 8s backoff)
- Performance budgets: 500KB gzipped bundle, LCP <1.2s, FID <100ms, CLS <0.05
- Global search (Cmd+K) using cmdk component
- OpenAPI type generation for both Palantir and reconciliation endpoints
- Git workflow: Conventional Commits, epic-based branches, Gemini AI PR review

**Implementation Sequence (from Architecture):**
1. Build reconciliation module + SQLite schema + `/reconciliation/*` endpoints in Unified API
2. Add command bus (`/commands/run`) with SSE output and append-only audit logging
3. Update frontend data layer (TanStack Query hooks + SSE subscriber)
4. Wire maintenance modals and service cards to command bus + audit viewer
5. Extend GitHub issue hub + AI delegation board

**From UX Design:**
- Semantic status colors: verified=emerald, stale=amber, investigating=sky, error=rose, AI running=indigo
- Drawer patterns: Diagnostics (400px right), Issue Detail (with AI status chip), Maintenance Modal (centered with confirmation)
- Desktop-first responsive design with 12-column grid
- Skeleton/shimmer loading states for all data-dependent components
- Accessibility: ≥4.5:1 contrast, focus-visible rings, ARIA labels

### FR Coverage Map

| FR | Epic | Description |
|----|------|-------------|
| FR1 | Epic 1 | Transcription State View with discrepancy detection |
| FR2 | Epic 1 | Service Health Matrix tiles |
| FR3 | Epic 1 | Stale/rate-limit messaging |
| FR4 | Epic 2 | Job Operations (retry/delete) |
| FR5 | Epic 2 | Queue Hygiene (purge) |
| FR6 | Epic 2 | Service Restarts |
| FR7 | Epic 2 | Audit Trail |
| FR8 | Epic 3 | GitHub Issue Feed |
| FR9 | Epic 3 | Issue Detail with Telemetry Attachments |
| FR10 | Epic 4 | Issue-to-AI Delegation |
| FR11 | Epic 4 | AI Response Tracking |
| FR12 | Epic 4 | Command Execution Layer |
| FR13 | Epic 4 | Health Verification |
| FR14 | Epic 4 | Fallback Path |
| FR15 | Epic 5 | Auto-Discovery |
| FR16 | Epic 5 | Validation Gate |
| FR17 | Epic 6 | Delegation Enhancements |
| FR18 | Epic 6 | n8n Workflow Control |
| FR19 | Epic 6 | Cross-Project Ops View |

## Epic List

### Epic 1: Reliability Telemetry Foundation
Nathan can see real-time, trustworthy transcription stats and service health with clear indicators when data is stale or rate-limited.

**FRs covered:** FR1, FR2, FR3

**Scope:** Establishes the SSE/reconciliation foundation. Delivers complete visibility into system health with discrepancy detection and graceful degradation.

---

### Epic 2: Maintenance Command Center
Nathan can perform routine maintenance (retry jobs, purge queues, restart services) directly from the dashboard with full audit trail.

**FRs covered:** FR4, FR5, FR6, FR7

**Scope:** Complete maintenance capability with auditing. Uses Epic 1's telemetry to show before/after states.

---

### Epic 3: GitHub Issue Hub
Nathan can view, filter, and search GitHub issues from all /dev repos in the dashboard, with relevant telemetry attached to each issue.

**FRs covered:** FR8, FR9

**Scope:** Complete issue visibility without requiring AI features. Manual triage capability.

---

### Epic 4: AI-Powered Remediation
Nathan can delegate issues to the AI dev team, track their progress, and receive structured remediation results with automatic health verification.

**FRs covered:** FR10, FR11, FR12, FR13, FR14

**Scope:** Complete AI workflow loop with fallback to manual controls.

---

### Epic 5: Service Onboarding & Discovery
Nathan's dashboard automatically discovers new services registered in Unified API, validates their health, and surfaces them with appropriate tiles.

**FRs covered:** FR15, FR16

**Scope:** Seamless service integration without manual configuration.

---

### Epic 6: Advanced Automation Hub (Future)
Nathan can manage AI delegation priorities, control n8n workflows, and view cross-project reliability incidents from a unified command center.

**FRs covered:** FR17, FR18, FR19

**Scope:** Advanced features behind feature flags. Builds on all previous epics for complete ops copilot.

---

## Epic 1: Reliability Telemetry Foundation

Nathan can see real-time, trustworthy transcription stats and service health with clear indicators when data is stale or rate-limited.

### Story 1.1: SSE Reconciliation Stream Integration

As a dashboard user,
I want real-time updates from the Unified API reconciliation stream,
So that I see the latest telemetry without manual refresh.

**Acceptance Criteria:**

**Given** the dashboard is loaded
**When** the Unified API emits a reconciliation event
**Then** the event is received via SSE within 1 second
**And** connection status shows "connected" in the UI

**Given** SSE connection fails
**When** 5 consecutive reconnection attempts fail (exponential backoff: 1s, 2s, 4s, 8s, 16s)
**Then** system falls back to 10s polling
**And** a "Live updates paused" banner appears with "Reconnect" button

**Given** the server sends a heartbeat event
**When** 30 seconds pass without a heartbeat
**Then** the connection is closed and reopened automatically

**Technical Notes:**
- Creates `src/lib/reconciliation-stream.ts` with EventSource wrapper
- Creates `useReconciliationStream` hook in `src/features/reliability-feed/hooks/`
- Tracks connection status in TanStack Query: `'connected' | 'reconnecting' | 'polling-fallback' | 'offline'`

---

### Story 1.2: Transcription State View with Discrepancy Detection

As a dashboard user,
I want to see Palantir + Unified API job stats with mismatch detection,
So that I immediately know when data is inconsistent.

**Acceptance Criteria:**

**Given** the dashboard loads transcription data from both APIs
**When** job counts match between Palantir and Unified API
**Then** card shows "Verified" badge (emerald color)
**And** last-updated timestamp is visible
**And** job counts by status (completed, failed, processing) are displayed

**Given** job counts differ between sources
**When** the reconciliation module detects a mismatch
**Then** a discrepancy banner appears with diagnostic details (expected vs actual counts)
**And** the card shows "Investigating" badge (sky color)
**And** the discrepancy is logged to the audit trail

**Given** the user clicks the discrepancy banner
**When** the diagnostics drawer opens
**Then** it shows detailed comparison: Palantir counts, Unified API counts, and mismatched job IDs

**Technical Notes:**
- Creates `src/features/reliability-feed/` feature module structure
- Creates `TranscriptionTelemetryCard` component with status badges
- Uses semantic colors from shadcn tokens: verified=emerald, investigating=sky

---

### Story 1.3: Service Health Matrix Tiles

As a dashboard user,
I want health tiles for all registered services (transcription worker, unified API, dashboard),
So that I can see uptime, status, and last check at a glance.

**Acceptance Criteria:**

**Given** services are registered in Unified API
**When** the dashboard loads
**Then** each service displays as a tile with: name, status icon, uptime percentage, last check timestamp
**And** tiles are arranged in a responsive grid (3 columns on desktop, 1 on mobile)

**Given** a service's health endpoint returns an error
**When** the tile updates
**Then** the tile shows "Error" state (rose color)
**And** provides a "View Logs" link that opens the diagnostics drawer

**Given** a service status changes from healthy to unhealthy
**When** the SSE event arrives
**Then** the tile animates briefly to draw attention to the change

**Given** keyboard navigation is active
**When** user tabs to a service tile
**Then** focus-visible ring is displayed
**And** Enter key opens the service detail view

**Technical Notes:**
- Creates `src/components/reliability/ServiceHealthTile.tsx`
- Creates `useServiceHealth` hook wrapping TanStack Query
- Implements NFR12 accessibility requirements

---

### Story 1.4: Stale and Rate-Limit Messaging

As a dashboard user,
I want clear explanations when data can't refresh (429/500/network failure),
So that I understand the issue and can retry or snooze.

**Acceptance Criteria:**

**Given** the dashboard receives a 429 (rate limit) response
**When** the stale banner appears
**Then** it shows "Rate limited – retry in X seconds" with a live countdown
**And** provides a "Snooze 5 min" button to dismiss temporarily
**And** the retry-after value from the response is used

**Given** a network failure prevents data refresh
**When** the stale banner appears
**Then** it shows "Connection lost" with network error details
**And** provides a "Retry Now" button
**And** no blank screens or spinners appear indefinitely (NFR13)

**Given** data is older than 15 seconds
**When** the UI displays
**Then** an "amber" stale indicator appears on affected cards
**And** tooltip shows "Last updated X seconds ago"

**Given** the user clicks "Retry Now"
**When** the retry succeeds
**Then** the stale banner dismisses automatically
**And** cards update to "Verified" state

**Technical Notes:**
- Creates `StaleBanner` component with countdown timer
- Implements retry logic in `apiClient` interceptors
- Uses error format: `{code, message, remediation}`

---

## Epic 2: Maintenance Command Center

Nathan can perform routine maintenance (retry jobs, purge queues, restart services) directly from the dashboard with full audit trail.

### Story 2.1: Job Retry and Delete Operations

As a dashboard user,
I want to retry and delete transcription jobs directly from the table,
So that I can fix failed jobs without SSH access.

**Acceptance Criteria:**

**Given** a failed job is displayed in the transcription table
**When** user clicks "Retry" button
**Then** a confirmation modal appears showing job ID and expected action
**And** the modal requires explicit "Confirm Retry" button click

**Given** user confirms the retry action
**When** the command executes via `/commands/run`
**Then** SSE streams status updates: "running" → "success" or "error"
**And** the job table updates to reflect new status
**And** the action is logged to audit trail with actor, job ID, and outcome

**Given** user clicks "Delete" on a job
**When** the confirmation modal appears
**Then** it warns "This action cannot be undone"
**And** requires typing job ID to confirm (destructive action safeguard)

**Given** user confirms delete
**When** the command executes
**Then** job is removed from the table
**And** audit log records: actor, job ID, "deleted", timestamp

**Technical Notes:**
- Creates `src/lib/command-bus.ts` with SSE command execution
- Creates `useCommandBus` hook for component integration
- Creates confirmation modal component with destructive action pattern

---

### Story 2.2: Queue Hygiene Operations

As a dashboard user,
I want to purge stuck queues or clear old jobs from the UI,
So that I can maintain system health without manual intervention.

**Acceptance Criteria:**

**Given** the queue management panel is displayed
**When** user clicks "Purge Stuck Jobs"
**Then** modal shows count of jobs in "stuck" state (processing > 1 hour)
**And** lists affected job IDs (max 10, with "and X more" overflow)

**Given** user confirms purge operation
**When** command executes
**Then** SSE streams progress: "Purging job 1 of N..."
**And** each job result (success/failure) is displayed inline
**And** summary shows: "Purged X jobs, Y failed"

**Given** user clicks "Clear Completed Jobs Older Than 7 Days"
**When** modal appears
**Then** it shows count of jobs to be cleared
**And** provides date range selector for custom retention

**Given** queue operation is in progress
**When** user attempts another queue operation
**Then** button is disabled with "Operation in progress" tooltip

**Technical Notes:**
- Creates queue management panel in maintenance feature
- Reuses `useCommandBus` for SSE command streaming
- Implements operation locking to prevent concurrent queue modifications

---

### Story 2.3: Service Restart Operations

As a dashboard user,
I want to restart transcription worker, unified API, and dashboard process,
So that I can recover services without SSH access.

**Acceptance Criteria:**

**Given** a service tile shows unhealthy status
**When** user clicks "Restart Service"
**Then** confirmation modal shows: service name, current state, expected downtime
**And** warns "Service will be unavailable during restart"

**Given** user confirms restart
**When** the restart command executes
**Then** tile shows "Restarting..." state (indigo, spinning icon)
**And** SSE streams: "Stopping service" → "Starting service" → "Health check"
**And** post-restart health check runs automatically

**Given** restart succeeds
**When** health check passes
**Then** tile returns to healthy state (emerald)
**And** audit log records: actor, service, "restarted", before/after state

**Given** restart fails or health check fails
**When** error state is reached
**Then** tile shows "Restart Failed" (rose)
**And** error message with remediation guidance is displayed
**And** "View Logs" button shows systemd journal output

**Given** user attempts to restart the dashboard itself
**When** confirmation modal appears
**Then** it warns "You will be disconnected and page will reload"
**And** includes 10-second countdown before auto-reconnect attempt

**Technical Notes:**
- Extends command bus with restart-specific SSE events
- Implements before/after state snapshots (NFR10)
- Special handling for self-restart with auto-reconnect

---

### Story 2.4: Audit Trail Viewer

As a dashboard user,
I want to view a log of all maintenance actions,
So that reliability decisions are traceable and I can review what changed.

**Acceptance Criteria:**

**Given** the audit trail panel is opened
**When** the view loads
**Then** it shows a table with: timestamp, actor, action type, target, outcome
**And** entries are sorted newest-first with pagination (50 per page)

**Given** user clicks on an audit entry
**When** the detail drawer opens
**Then** it shows full payload: before/after states, command parameters, execution logs
**And** provides "Copy JSON" button for the entry

**Given** user applies filters
**When** filters include: date range, action type, target service
**Then** results update to match filter criteria
**And** filter chips show active filters with clear buttons

**Given** a new maintenance action occurs
**When** the audit trail panel is open
**Then** the new entry appears at the top with subtle highlight animation
**And** "New entries" badge appears if user has scrolled down

**Technical Notes:**
- Creates `src/features/maintenance/components/AuditTrailPanel.tsx`
- Connects to `/reconciliation/audit` endpoint
- Implements virtualized list for performance with 1000+ entries (NFR3)

---

## Epic 3: GitHub Issue Hub

Nathan can view, filter, and search GitHub issues from all /dev repos in the dashboard, with relevant telemetry attached to each issue.

### Story 3.1: GitHub Issue Feed

As a dashboard user,
I want an in-dashboard list of open issues from all /dev repos,
So that I can see project status without leaving the dashboard.

**Acceptance Criteria:**

**Given** the Issues tab is selected
**When** the view loads
**Then** it displays a table of open GitHub issues with: title, repo, labels, created date, assignee
**And** issues are sorted by most recent activity

**Given** issues are loaded
**When** user types in the search box
**Then** issues filter by title and body content (client-side for cached data)
**And** search is debounced (300ms)

**Given** user clicks a label chip
**When** filter is applied
**Then** only issues with that label are shown
**And** filter chip appears in active filters area

**Given** user clicks repo dropdown
**When** repos are listed
**Then** user can select one or more repos to filter
**And** "All repos" option clears repo filter

**Given** keyboard navigation is active
**When** user presses Cmd+K
**Then** global search opens with "Issues" option
**And** user can type to search issues directly

**Technical Notes:**
- Creates `src/features/issues/` feature module
- Uses GitHub issue snapshot from `scripts/update_github_issues_snapshot.py`
- Integrates with global search (Cmd+K) via cmdk

---

### Story 3.2: Issue Detail with Telemetry Attachments

As a dashboard user,
I want each issue view to show logs/metrics relevant to that issue,
So that I have full context when triaging.

**Acceptance Criteria:**

**Given** user clicks on an issue in the list
**When** the Issue Detail drawer opens (400px from right)
**Then** it shows: issue title, body (rendered markdown), labels, assignees, timeline

**Given** the issue has associated telemetry (mentioned service name or job ID)
**When** the drawer loads
**Then** relevant telemetry cards are embedded: recent discrepancies, service status, job history
**And** cards are collapsible with "Show more" links

**Given** the issue body contains a job ID pattern (e.g., `job-12345`)
**When** the drawer parses the body
**Then** the job ID becomes a clickable link to the transcription detail view
**And** inline preview shows job status on hover

**Given** the issue mentions a service name
**When** the drawer parses the body
**Then** the current health status of that service is shown inline
**And** clicking shows the full service tile

**Given** user scrolls within the drawer
**When** new telemetry updates arrive via SSE
**Then** scroll position is preserved
**And** "New data available" indicator appears at top if updates occurred

**Technical Notes:**
- Creates `src/features/issues/components/IssueDrawer.tsx`
- Implements body parsing for job IDs and service names
- Maintains scroll position during SSE updates per Architecture spec

---

## Epic 4: AI-Powered Remediation

Nathan can delegate issues to the AI dev team, track their progress, and receive structured remediation results with automatic health verification.

### Story 4.1: Issue-to-AI Delegation

As a dashboard user,
I want a "Launch Admin Dev Team" button on each issue,
So that I can delegate remediation to AI with packaged telemetry context.

**Acceptance Criteria:**

**Given** an issue is open in the detail drawer
**When** user clicks "Launch Admin Dev Team"
**Then** a confirmation modal shows: issue summary, attached telemetry, estimated scope
**And** provides "Confirm Delegation" button

**Given** user confirms delegation
**When** the AI workflow starts
**Then** the button changes to "AI Working..." with spinner (indigo color)
**And** a delegation record is created with: issue ID, telemetry snapshot, start time
**And** audit log records: actor, issue ID, "delegated to AI", timestamp

**Given** the AI workflow is running
**When** SSE events arrive from `/commands/run`
**Then** status updates appear: "Analyzing...", "Implementing...", "Testing..."
**And** the Issue Drawer shows live status chip

**Given** an issue was previously delegated
**When** user views that issue
**Then** delegation history is shown: previous attempts, outcomes, timestamps

**Technical Notes:**
- Creates `src/features/ai-delegation/` feature module
- Integrates with existing `/commands/run` SSE stream
- Creates delegation record schema for tracking

---

### Story 4.2: AI Response Tracking Board

As a dashboard user,
I want a board showing all in-progress AI actions,
So that I can monitor multiple delegations and drill into updates.

**Acceptance Criteria:**

**Given** the AI Delegation tab is selected
**When** the board loads
**Then** it shows cards for each active AI delegation: issue title, status, elapsed time
**And** cards are sorted by most recent activity

**Given** an AI delegation is in progress
**When** SSE events update the status
**Then** the card updates in real-time without page refresh
**And** status badge updates: "Analyzing" (sky), "Implementing" (indigo), "Testing" (amber)

**Given** user clicks on a delegation card
**When** the detail view opens
**Then** it shows: full issue context, AI action log, code changes proposed
**And** provides "View on GitHub" link for any PRs created

**Given** an AI delegation completes successfully
**When** the completion event arrives
**Then** card shows "Completed" (emerald) with summary
**And** "Mark Resolved" button appears to close the issue

**Given** an AI delegation fails
**When** the error event arrives
**Then** card shows "Failed" (rose) with error message
**And** "Retry" and "Manual Fix" buttons appear

**Technical Notes:**
- Creates `src/features/ai-delegation/components/DelegationBoard.tsx`
- Uses SSE channel shared with maintenance commands
- Implements status color mapping per UX spec

---

### Story 4.3: Command Execution Layer

As a dashboard user,
I want the dashboard to send remediation commands to AI workflows,
So that common fixes (restart, purge, config patch) can be automated.

**Acceptance Criteria:**

**Given** a remediation action is needed
**When** user or AI triggers a command
**Then** command is sent to `/commands/run` with idempotent command ID
**And** response streams via SSE: `{eventId, status, logs}`

**Given** command is executing
**When** logs are streamed
**Then** they appear in real-time in the command output panel
**And** panel auto-scrolls to newest output

**Given** command execution exceeds 5 minutes
**When** timeout is reached
**Then** status changes to "Timed out" with option to force-cancel
**And** partial logs are preserved for debugging

**Given** multiple commands are queued
**When** execution proceeds
**Then** commands run sequentially (no parallel execution)
**And** queue position is shown: "Position 2 of 3"

**Technical Notes:**
- Extends `src/lib/command-bus.ts` with timeout and queue management
- Creates command output panel component
- Implements idempotent command IDs for retry safety

---

### Story 4.4: Health Verification After AI Actions

As a dashboard user,
I want automatic health verification after AI actions complete,
So that I know if the fix actually worked.

**Acceptance Criteria:**

**Given** an AI remediation action completes
**When** the completion event is received
**Then** automatic health verification starts within 5 seconds
**And** status shows "Verifying health..."

**Given** health check runs
**When** all monitored metrics return to healthy thresholds
**Then** status shows "Health Verified" (emerald)
**And** before/after comparison is recorded (NFR10)

**Given** health check runs
**When** some metrics remain unhealthy
**Then** status shows "Partial Recovery" (amber)
**And** list of remaining issues is displayed
**And** "Further Action Needed" flag is set

**Given** health verification is complete
**When** user views the delegation detail
**Then** before/after telemetry snapshots are displayed side-by-side
**And** delta highlighting shows what changed

**Technical Notes:**
- Creates health verification polling logic
- Implements before/after snapshot comparison
- Integrates with Epic 1 telemetry feeds

---

### Story 4.5: Manual Fallback Controls

As a dashboard user,
I want manual buttons available even if AI workflow fails or is offline,
So that I can still perform maintenance when automation is unavailable.

**Acceptance Criteria:**

**Given** the AI delegation system is offline
**When** user opens an issue
**Then** "Manual Actions" dropdown is prominently displayed
**And** includes: Restart Service, Purge Queue, View Logs, Open in GitHub

**Given** an AI delegation fails
**When** error state is reached
**Then** "Manual Fix" button appears alongside retry option
**And** clicking opens the same maintenance controls from Epic 2

**Given** user performs a manual action during an active AI delegation
**When** the action completes
**Then** it is logged as "Manual override during AI delegation"
**And** the AI delegation is notified of the intervention

**Given** the AI system reconnects after being offline
**When** connection is restored
**Then** "AI Restored" banner appears
**And** pending delegations resume automatically

**Technical Notes:**
- Reuses maintenance controls from Epic 2
- Adds AI-aware logging for manual overrides
- Implements AI system health monitoring

---

## Epic 5: Service Onboarding & Discovery

Nathan's dashboard automatically discovers new services registered in Unified API, validates their health, and surfaces them with appropriate tiles.

### Story 5.1: Auto-Discovery of New Services

As a dashboard user,
I want the dashboard to automatically detect new services registered in Unified API,
So that new services appear without manual configuration.

**Acceptance Criteria:**

**Given** the dashboard is running
**When** a new service registers in Unified API
**Then** the dashboard detects it within 60 seconds (next polling cycle)
**And** a toast notification appears: "New service detected: [name]"

**Given** a new service is detected
**When** the dashboard creates a tile
**Then** a skeleton tile appears immediately with "Initializing..." state
**And** the tile includes the service name and default metadata

**Given** multiple services register simultaneously
**When** discovery runs
**Then** all new services are detected in the same cycle
**And** toast shows: "X new services detected"

**Given** a service name conflicts with an existing service
**When** discovery runs
**Then** the conflict is logged
**And** admin notification suggests manual resolution

**Technical Notes:**
- Creates service discovery hook polling `/services/registered` every 60s
- Implements toast notification system
- Handles edge cases: duplicates, conflicts, rapid registration

---

### Story 5.2: Health Validation Gate for New Services

As a dashboard user,
I want new services to pass a health check before appearing with full controls,
So that misconfigured services are obvious and don't clutter the healthy view.

**Acceptance Criteria:**

**Given** a new service is discovered
**When** health validation runs
**Then** the service's health endpoint is called with 3 retries (2s, 4s, 8s backoff)
**And** each retry logs: attempt number, response code, latency

**Given** health check passes on any attempt
**When** validation completes
**Then** tile transitions to healthy state (emerald)
**And** full maintenance controls are enabled

**Given** all 3 health check attempts fail
**When** validation completes
**Then** tile shows "Unhealthy" state (rose) with warning icon
**And** maintenance controls are disabled (read-only view)
**And** "Retry Health Check" button is displayed

**Given** a service fails health validation
**When** user clicks "Retry Health Check"
**Then** a new validation cycle starts immediately
**And** button shows spinner during validation

**Given** a service remains unhealthy for 24 hours
**When** the threshold is reached
**Then** admin notification suggests reviewing service configuration

**Technical Notes:**
- Implements health check retry logic with exponential backoff
- Creates "unhealthy" tile variant with disabled controls
- Tracks health validation history per service

---

### Story 5.3: Service Decommissioning Flow

As a dashboard user,
I want deregistered services to be marked clearly before disappearing,
So that I can investigate unexpected removals.

**Acceptance Criteria:**

**Given** a service is deregistered from Unified API
**When** the next discovery cycle runs
**Then** the tile is marked "Decommissioned" (grayed out)
**And** timestamp shows when deregistration was detected

**Given** a service is marked decommissioned
**When** 24 hours pass without re-registration
**Then** the tile auto-hides from the main view
**And** moves to "Archived Services" section (behind "Show archived" toggle)

**Given** a decommissioned service re-registers
**When** discovery detects the re-registration
**Then** the tile returns to normal state
**And** "Service restored" notification appears

**Given** user manually archives a healthy service
**When** archive action is confirmed
**Then** the service is hidden immediately (doesn't wait 24h)
**And** can be restored from "Archived Services"

**Technical Notes:**
- Tracks service lifecycle states: active, decommissioned, archived
- Implements 24-hour decommission window
- Creates archived services toggle/section

---

## Epic 6: Advanced Automation Hub (Future)

Nathan can manage AI delegation priorities, control n8n workflows, and view cross-project reliability incidents from a unified command center.

### Story 6.1: AI Delegation Priority Management

As a dashboard user,
I want to assign priorities to AI dev tasks and track SLAs,
So that critical issues are addressed first.

**Acceptance Criteria:**

**Given** an issue is delegated to AI
**When** delegation modal appears
**Then** priority selector is shown: Critical, High, Normal, Low
**And** estimated SLA is displayed based on priority

**Given** multiple delegations are active
**When** the AI board loads
**Then** cards are sorted by priority (Critical first), then by age
**And** priority badge is prominent on each card

**Given** an SLA is approaching deadline
**When** 80% of time has elapsed
**Then** card shows "SLA Warning" indicator (amber)
**And** notification is sent (if notifications are enabled)

**Given** an SLA is breached
**When** deadline passes
**Then** card shows "SLA Breached" indicator (rose)
**And** auto-escalation option appears

**Given** user changes priority of an active delegation
**When** priority is updated
**Then** delegation queue re-sorts immediately
**And** AI workflow is notified of priority change

**Technical Notes:**
- Feature flagged: `VITE_FF_DELEGATION_PRIORITIES`
- Creates priority management UI and SLA tracking
- Integrates with notification system

---

### Story 6.2: n8n Workflow Monitoring and Control

As a dashboard user,
I want to monitor and control n8n automations from the dashboard,
So that automation tasks live alongside transcription monitoring.

**Acceptance Criteria:**

**Given** the Automations tab is selected
**When** the view loads
**Then** it shows a list of n8n workflows with: name, status, last run, next scheduled
**And** workflows are grouped by category (transcription, maintenance, reporting)

**Given** user clicks on a workflow
**When** the detail panel opens
**Then** it shows: workflow diagram preview, recent runs (last 10), error rate
**And** provides "View in n8n" link

**Given** user clicks "Start" on a workflow
**When** execution begins
**Then** status updates to "Running" with live progress
**And** run output is displayed in collapsible panel

**Given** user clicks "Stop" on a running workflow
**When** confirmation modal appears
**Then** it warns of potential data inconsistency
**And** force-stop cancels immediately

**Given** a workflow fails
**When** error event is received
**Then** failure notification appears
**And** "View Error" button shows error details and stack trace

**Technical Notes:**
- Feature flagged: `VITE_FF_N8N_CONTROL`
- Creates n8n integration via Unified API proxy
- Implements workflow status polling and control

---

### Story 6.3: Cross-Project Reliability Ops View

As a dashboard user,
I want an aggregated feed for reliability incidents across all homelab services,
So that I have a unified command center for all systems.

**Acceptance Criteria:**

**Given** the Ops Center tab is selected
**When** the view loads
**Then** it shows a timeline of reliability events across all projects
**And** events are color-coded by severity: critical (rose), warning (amber), info (sky)

**Given** an event is displayed
**When** user hovers over it
**Then** preview shows: source system, event type, timestamp, quick summary

**Given** user clicks on an event
**When** detail panel opens
**Then** it shows full event context with links to relevant system's detailed view
**And** provides "Jump to [System] Dashboard" button

**Given** user applies filters
**When** filters include: severity, system, date range, event type
**Then** timeline updates to match criteria
**And** filter state is preserved in URL for sharing

**Given** a new critical event occurs
**When** the Ops Center is open
**Then** event appears at top of timeline with attention animation
**And** browser notification is triggered (if permissions granted)

**Technical Notes:**
- Feature flagged: `VITE_FF_CROSS_PROJECT_OPS`
- Creates cross-project event aggregation endpoint
- Implements timeline visualization component

