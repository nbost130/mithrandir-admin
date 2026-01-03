# Story 5.3: Service Decommissioning Flow

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 5.1 must be complete before this story can be implemented.

- [ ] Story 5.1: Service auto-discovery (tracks service lifecycle)

## Story

As a dashboard user,
I want deregistered services to be marked clearly before disappearing,
So that I can investigate unexpected removals.

## Acceptance Criteria

1. **Given** a service is deregistered from Unified API **When** the next discovery cycle runs **Then** the tile is marked "Decommissioned" (grayed out) **And** timestamp shows when deregistration was detected

2. **Given** a service is marked decommissioned **When** 24 hours pass without re-registration **Then** the tile auto-hides from the main view **And** moves to "Archived Services" section (behind "Show archived" toggle)

3. **Given** a decommissioned service re-registers **When** discovery detects the re-registration **Then** the tile returns to normal state **And** "Service restored" notification appears

4. **Given** user manually archives a healthy service **When** archive action is confirmed **Then** the service is hidden immediately (doesn't wait 24h) **And** can be restored from "Archived Services"

## Tasks / Subtasks

- [ ] Task 1: Detect service deregistration (AC: #1)
  - [ ] Compare service lists between polls
  - [ ] Identify services no longer in registry
  - [ ] Mark as "Decommissioned"

- [ ] Task 2: Create decommissioned tile state (AC: #1)
  - [ ] Gray out tile styling
  - [ ] Show "Decommissioned" badge
  - [ ] Display detection timestamp

- [ ] Task 3: Implement 24-hour auto-archive (AC: #2)
  - [ ] Track time since decommissioning
  - [ ] Auto-hide after 24 hours
  - [ ] Move to archived services list

- [ ] Task 4: Create Archived Services section (AC: #2, #4)
  - [ ] Create expandable "Show archived" toggle
  - [ ] List archived services
  - [ ] Provide restore action

- [ ] Task 5: Handle service re-registration (AC: #3)
  - [ ] Detect re-registration during discovery
  - [ ] Restore tile to normal state
  - [ ] Show "Service restored" notification

- [ ] Task 6: Implement manual archiving (AC: #4)
  - [ ] Add "Archive" action to healthy service tiles
  - [ ] Confirmation modal
  - [ ] Immediate hide (no 24h wait)

- [ ] Task 7: Track service lifecycle states
  - [ ] States: active, decommissioned, archived
  - [ ] Persist state in local storage or API

- [ ] Task 8: Write tests (AC: all)
  - [ ] Test decommission detection
  - [ ] Test 24-hour auto-archive
  - [ ] Test re-registration restore
  - [ ] Test manual archive flow

## Dev Notes

### Architecture Compliance

**Extends FR15/FR16**: Service Onboarding (Auto-Discovery + Validation Gate)

This story handles the lifecycle after discovery and validation, specifically the decommissioning flow.

Per `architecture.md#Service Discovery & Health Validation`:
- Services deregistered from Unified API marked "decommissioned" (grayed tile)
- 24h before auto-hiding
- Investigation window for unexpected removals

### Technical Requirements

**Service Lifecycle States**:
```typescript
type ServiceLifecycleState = 'active' | 'decommissioned' | 'archived';

interface ServiceLifecycle {
  serviceId: string;
  state: ServiceLifecycleState;
  decommissionedAt?: string;
  archivedAt?: string;
  archivedBy?: 'auto' | 'manual';
}
```

**Decommission Grace Period**: 24 hours

### Library/Framework Requirements

- localStorage for lifecycle state persistence (or API)
- Uses service discovery from Story 5.1

### File Structure Requirements

```
src/features/services/
├── components/
│   ├── DecommissionedServiceTile.tsx  # NEW
│   └── ArchivedServicesPanel.tsx      # NEW
├── hooks/
│   └── useServiceLifecycle.ts         # NEW
```

### Dependencies

- **Requires Story 5.1**: Uses service discovery
- **Requires Story 1.3**: Extends ServiceHealthTile

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Service Discovery & Health Validation]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.3]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
