# Story 0.1: Backend Reconciliation Module & SSE Endpoints

Status: ready-for-dev

## Story

As a dashboard developer,
I want the Unified API to expose reconciliation and command endpoints with SSE streaming,
So that the frontend can consume real-time telemetry and execute maintenance commands.

## Acceptance Criteria

1. **Given** the Unified API starts up **When** the reconciliation module initializes **Then** SQLite schema is created/migrated with tables: `discrepancy_event`, `command_audit` **And** tables use snake_case column names with timestamp defaults

2. **Given** a client connects to `/reconciliation/stream` **When** the SSE connection is established **Then** server sends heartbeat events every 15 seconds **And** reconciliation events are broadcast when telemetry is polled/verified

3. **Given** a client calls `GET /reconciliation/audit` **When** the request includes pagination params **Then** returns paginated audit entries sorted newest-first **And** supports filters: `actionType`, `target`, `startDate`, `endDate`

4. **Given** a client calls `POST /commands/run` **When** a valid command payload is sent **Then** command is executed and SSE streams status updates: `queued` → `running` → `success`/`error` **And** command is logged to `command_audit` table with before/after state

5. **Given** a reconciliation poll completes **When** discrepancy is detected between Palantir and cached data **Then** discrepancy is logged to `discrepancy_event` table **And** SSE broadcasts `reconciliation.update` event with `status: 'discrepancy'`

## Tasks / Subtasks

- [ ] Task 1: Create SQLite schema and migrations
  - [ ] Create `discrepancy_event` table: id, timestamp, service, status, counts_json, checksum, latency_ms, discrepancy_details_json
  - [ ] Create `command_audit` table: id, timestamp, actor, action_type, target, outcome, before_state_json, after_state_json, command_params_json, logs_json
  - [ ] Add SQLite triggers for append-only enforcement on audit tables
  - [ ] Create migration script that runs on API startup

- [ ] Task 2: Implement SSE streaming endpoint
  - [ ] Create `GET /reconciliation/stream` SSE endpoint
  - [ ] Implement heartbeat every 15 seconds
  - [ ] Broadcast `reconciliation.update` events on telemetry changes
  - [ ] Handle client disconnection gracefully

- [ ] Task 3: Implement reconciliation polling logic
  - [ ] Poll Palantir for job counts every 5 seconds
  - [ ] Compare with cached/known state
  - [ ] Detect discrepancies (count mismatches)
  - [ ] Log discrepancies to `discrepancy_event` table
  - [ ] Broadcast to SSE subscribers

- [ ] Task 4: Implement audit endpoint
  - [ ] Create `GET /reconciliation/audit` REST endpoint
  - [ ] Pagination: `page`, `limit` params (default limit 50)
  - [ ] Sorting: `sortBy`, `sortOrder` params (default: timestamp, desc)
  - [ ] Filters: `actionType`, `target`, `startDate`, `endDate`
  - [ ] Response format: `{ data: AuditEntry[], meta: { page, limit, total, totalPages }}`

- [ ] Task 5: Implement command execution endpoint
  - [ ] Create `POST /commands/run` endpoint
  - [ ] Accept command payload with idempotent `commandId`
  - [ ] Execute commands: `retry-job`, `delete-job`, `purge-queue`, `restart-service`
  - [ ] Stream SSE status updates during execution
  - [ ] Log to `command_audit` with before/after state

- [ ] Task 6: Create services registry endpoint
  - [ ] Create `GET /services/registered` endpoint
  - [ ] Return list of all registered services with health status
  - [ ] Include: id, name, type, healthEndpoint, registeredAt, metadata

- [ ] Task 7: Write tests
  - [ ] Unit tests for reconciliation logic
  - [ ] Integration tests for SSE streaming
  - [ ] API contract tests for all endpoints

## Dev Notes

### Architecture Compliance

**CRITICAL** - This story creates the backend infrastructure required by ALL frontend stories in Epics 1-5.

Per `architecture.md`:
- Unified API reconciliation module owns the single source of truth
- SQLite 3.43.x stores discrepancy/audit data
- Append-only audit table enforced with SQLite triggers
- SSE endpoints: `/reconciliation/stream`, `/commands/run`

### Technical Requirements

**SQLite Table Schemas**:
```sql
-- Discrepancy events (reconciliation results)
CREATE TABLE discrepancy_event (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  service TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('verified', 'stale', 'discrepancy')),
  counts_json TEXT NOT NULL,
  checksum TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  discrepancy_details_json TEXT
);

-- Command audit log (append-only)
CREATE TABLE command_audit (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL DEFAULT (datetime('now')),
  actor TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK(outcome IN ('success', 'failure', 'timeout')),
  before_state_json TEXT,
  after_state_json TEXT,
  command_params_json TEXT,
  logs_json TEXT
);

-- Append-only trigger
CREATE TRIGGER command_audit_append_only
BEFORE DELETE ON command_audit
BEGIN
  SELECT RAISE(ABORT, 'Audit log entries cannot be deleted');
END;
```

**SSE Event Schemas**:
```typescript
// reconciliation.update
{
  eventId: string;
  service: string;
  status: 'verified' | 'stale' | 'discrepancy';
  counts: Record<string, number>;
  checksum: string;
  latencyMs: number;
  discrepancyDetails?: {
    expected: Record<string, number>;
    actual: Record<string, number>;
    missingJobIds: string[];
  };
}

// command.status
{
  commandId: string;
  service: string;
  phase: 'queued' | 'running' | 'success' | 'error' | 'timeout';
  logs: string[];
  verified?: boolean;
}
```

**API Endpoints**:
| Method | Path | Description |
|--------|------|-------------|
| GET | /reconciliation/stream | SSE stream for real-time updates |
| GET | /reconciliation/audit | Paginated audit log (supports sortBy, sortOrder) |
| POST | /commands/run | Execute maintenance command |
| GET | /services/registered | List all registered services |
| GET | /api/jobs/stuck | **Proxy** to Palantir `/api/v1/jobs/stuck` (see Story 0.2) |

### File Structure Requirements (Unified API)

```
mithrandir-unified-api/src/
├── modules/
│   └── reconciliation/
│       ├── reconciliation.service.ts    # Business logic
│       ├── reconciliation.controller.ts # REST/SSE endpoints
│       ├── schemas/
│       │   └── reconciliation.schema.ts # SQLite schema
│       └── types/
│           └── reconciliation.types.ts  # TypeScript types
├── modules/
│   └── commands/
│       ├── commands.service.ts
│       └── commands.controller.ts
```

### Repository

**This story is implemented in `mithrandir-unified-api`, NOT `mithrandir-admin`.**

### Dependencies

- **Blocks ALL frontend stories** until complete
- No external dependencies

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Data Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Sequence]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
