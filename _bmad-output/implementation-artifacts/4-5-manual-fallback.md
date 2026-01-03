# Story 4.5: Manual Fallback Controls

Status: future

> [!WARNING]
> **DEFERRED**: This story requires a design session before implementation.
> - Depends on Epic 4 AI infrastructure being defined
> - Design session needed to define AI offline detection and resumption

## Story

As a dashboard user,
I want manual buttons available even if AI workflow fails or is offline,
So that I can still perform maintenance when automation is unavailable.

## Acceptance Criteria

1. **Given** the AI delegation system is offline **When** user opens an issue **Then** "Manual Actions" dropdown is prominently displayed **And** includes: Restart Service, Purge Queue, View Logs, Open in GitHub

2. **Given** an AI delegation fails **When** error state is reached **Then** "Manual Fix" button appears alongside retry option **And** clicking opens the same maintenance controls from Epic 2

3. **Given** user performs a manual action during an active AI delegation **When** the action completes **Then** it is logged as "Manual override during AI delegation" **And** the AI delegation is notified of the intervention

4. **Given** the AI system reconnects after being offline **When** connection is restored **Then** "AI Restored" banner appears **And** pending delegations resume automatically

## Tasks / Subtasks

- [ ] Task 1: Create Manual Actions dropdown (AC: #1)
  - [ ] Add "Manual Actions" dropdown to IssueDrawer
  - [ ] Include: Restart Service, Purge Queue, View Logs, Open in GitHub
  - [ ] Prominently display when AI is offline

- [ ] Task 2: Add "Manual Fix" button to failed delegations (AC: #2)
  - [ ] Add button to DelegationCard on failure
  - [ ] Wire to Epic 2 maintenance controls
  - [ ] Open appropriate maintenance modal

- [ ] Task 3: Implement manual override logging (AC: #3)
  - [ ] Detect when action occurs during active delegation
  - [ ] Log as "Manual override during AI delegation"
  - [ ] Notify AI delegation of intervention

- [ ] Task 4: Monitor AI system health (AC: #4)
  - [ ] Create `useAISystemHealth` hook
  - [ ] Track connected/disconnected state
  - [ ] Trigger UI updates on state change

- [ ] Task 5: Create AI Restored banner (AC: #4)
  - [ ] Show "AI Restored" banner on reconnect
  - [ ] Auto-dismiss after 5 seconds
  - [ ] Resume pending delegations

- [ ] Task 6: Ensure fallback always available (AC: #1, #2)
  - [ ] Manual buttons never disabled
  - [ ] Clear visual hierarchy for fallback actions

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test manual actions during AI offline
  - [ ] Test manual override logging
  - [ ] Test AI reconnection flow

## Dev Notes

### Architecture Compliance

**Implements FR14**: Fallback Path

Per `architecture.md`:
- Manual buttons remain available if AI workflow fails or is offline
- Reuses maintenance controls from Epic 2

### Technical Requirements

**Fallback Priority**:
- Manual controls always available
- Never block on AI system availability
- Clear visual indication of AI state

**Manual Override Audit**:
```typescript
interface ManualOverrideLog {
  timestamp: string;
  actor: string;
  actionType: string;
  target: string;
  delegationId?: string;  // If during active delegation
  overrideReason?: string;
}
```

### Library/Framework Requirements

- Reuses Epic 2 maintenance modals
- Uses SSE for AI system health monitoring

### File Structure Requirements

```
src/features/ai-delegation/
├── components/
│   └── ManualActionsDropdown.tsx  # NEW
├── hooks/
│   └── useAISystemHealth.ts       # NEW
```

### Dependencies

- **Requires Epic 2**: Uses maintenance controls
- **Requires Story 3.2**: Adds to IssueDrawer
- **Requires Story 4.2**: Adds to DelegationCard

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.5]
- [Source: _bmad-output/planning-artifacts/prd.md#FR14]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
