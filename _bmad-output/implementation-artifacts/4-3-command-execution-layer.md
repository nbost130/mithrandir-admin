# Story 4.3: Command Execution Layer

Status: future

> [!WARNING]
> **DEFERRED**: This story requires a design session before implementation.
> - Extends command bus for AI-triggered commands
> - Design session needed to define timeout/queue behavior for AI workflows

## Story

As a dashboard user,
I want the dashboard to send remediation commands to AI workflows,
So that common fixes (restart, purge, config patch) can be automated.

## Acceptance Criteria

1. **Given** a remediation action is needed **When** user or AI triggers a command **Then** command is sent to `/commands/run` with idempotent command ID **And** response streams via SSE: `{eventId, status, logs}`

2. **Given** command is executing **When** logs are streamed **Then** they appear in real-time in the command output panel **And** panel auto-scrolls to newest output

3. **Given** command execution exceeds 5 minutes **When** timeout is reached **Then** status changes to "Timed out" with option to force-cancel **And** partial logs are preserved for debugging

4. **Given** multiple commands are queued **When** execution proceeds **Then** commands run sequentially (no parallel execution) **And** queue position is shown: "Position 2 of 3"

## Tasks / Subtasks

- [ ] Task 1: Extend command bus with timeout handling (AC: #3)
  - [ ] Add 5-minute timeout to command execution
  - [ ] Implement force-cancel option
  - [ ] Preserve partial logs on timeout

- [ ] Task 2: Create CommandOutputPanel component (AC: #2)
  - [ ] Create `src/features/ai-delegation/components/CommandOutputPanel.tsx`
  - [ ] Display streaming logs in terminal-style view
  - [ ] Auto-scroll to newest output
  - [ ] Support manual scroll lock

- [ ] Task 3: Implement command queue (AC: #4)
  - [ ] Track queued commands in state
  - [ ] Execute sequentially, not parallel
  - [ ] Show queue position: "Position N of M"

- [ ] Task 4: Create queue status display (AC: #4)
  - [ ] Show pending commands in queue
  - [ ] Display estimated time to start
  - [ ] Allow queue cancellation

- [ ] Task 5: Enhance command bus for AI integration (AC: #1)
  - [ ] Support AI-triggered commands
  - [ ] Include context in command payload
  - [ ] Return structured results

- [ ] Task 6: Write tests (AC: all)
  - [ ] Test timeout handling
  - [ ] Test queue management
  - [ ] Test log streaming

## Dev Notes

### Architecture Compliance

**Implements FR12**: Command Execution Layer

Per `architecture.md`:
- Extends `src/lib/command-bus.ts` with timeout and queue management
- Command output panel component
- Idempotent command IDs for retry safety

### Technical Requirements

**Command Request Format**:
```typescript
interface CommandRequest {
  commandId: string;          // UUID, idempotent
  type: CommandType;
  target: string;
  params?: Record<string, unknown>;
  timeout?: number;           // Default 5 minutes (300000ms)
  context?: {
    delegationId?: string;
    issueId?: string;
  };
}
```

**SSE Response Format**:
```typescript
interface CommandEvent {
  commandId: string;
  phase: 'queued' | 'running' | 'success' | 'error' | 'timeout';
  queuePosition?: number;     // If queued
  logs: string[];
  result?: unknown;
}
```

**Timeout Handling**:
- 5-minute default timeout
- Show "Timed out" state
- Offer force-cancel
- Preserve logs for debugging

### Library/Framework Requirements

- uuid for command ID generation
- xterm.js or similar for terminal-style output (optional)
- Uses SSE from Epic 1

### File Structure Requirements

```
src/lib/
└── command-bus.ts              # MODIFY - add timeout/queue management

src/features/ai-delegation/
├── components/
│   └── CommandOutputPanel.tsx  # NEW - terminal-style output display
```

> [!NOTE]
> Per architect decision: Queue management (position, concurrency limits, timeouts) lives in `src/lib/command-bus.ts`, **NOT** in feature-specific hooks. The `useCommandBus` hook from Story 2.1 wraps the shared infrastructure. This story extends `command-bus.ts` with timeout and queue features, not creating a separate hook.

### Dependencies

- **Requires Story 2.1**: Extends command bus
- **Requires Story 4.1**: Used by AI delegation

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.3]
- [Source: _bmad-output/planning-artifacts/prd.md#FR12]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
