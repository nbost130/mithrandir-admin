# Story 5.1: Auto-Discovery of New Services

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 1.3 must be complete before this story can be implemented.

- [ ] Story 1.3: Service health tiles to extend with discovery

## Story

As a dashboard user,
I want the dashboard to automatically detect new services registered in Unified API,
So that new services appear without manual configuration.

## Acceptance Criteria

1. **Given** the dashboard is running **When** a new service registers in Unified API **Then** the dashboard detects it within 60 seconds (next polling cycle) **And** a toast notification appears: "New service detected: [name]"

2. **Given** a new service is detected **When** the dashboard creates a tile **Then** a skeleton tile appears immediately with "Initializing..." state **And** the tile includes the service name and default metadata

3. **Given** multiple services register simultaneously **When** discovery runs **Then** all new services are detected in the same cycle **And** toast shows: "X new services detected"

4. **Given** a service name conflicts with an existing service **When** discovery runs **Then** the conflict is logged **And** admin notification suggests manual resolution

## Tasks / Subtasks

- [ ] Task 1: Create service discovery polling (AC: #1)
  - [ ] Create polling hook for `/services/registered` endpoint
  - [ ] Poll every 60 seconds
  - [ ] Compare current vs previous service list

- [ ] Task 2: Implement toast notifications (AC: #1, #3)
  - [ ] Create toast notification system (if not exists)
  - [ ] Show "New service detected: [name]"
  - [ ] Handle multiple services: "X new services detected"

- [ ] Task 3: Create skeleton tile (AC: #2)
  - [ ] Create `ServiceSkeletonTile.tsx`
  - [ ] Show "Initializing..." state
  - [ ] Display service name and default metadata

- [ ] Task 4: Handle service conflicts (AC: #4)
  - [ ] Detect duplicate service names
  - [ ] Log conflict to audit trail
  - [ ] Show admin notification for manual resolution

- [ ] Task 5: Create useServiceDiscovery hook
  - [ ] Manage polling lifecycle
  - [ ] Track discovered services
  - [ ] Emit discovery events

- [ ] Task 6: Write tests (AC: all)
  - [ ] Test polling detection
  - [ ] Test toast notifications
  - [ ] Test conflict handling

## Dev Notes

### Architecture Compliance

**Implements FR15**: Auto-Discovery

Per `architecture.md#Service Discovery & Health Validation`:
- Dashboard polls `/services/registered` every 60s
- New services trigger toast notification
- Auto-add skeleton tile

### Technical Requirements

**Polling Interval**: 60 seconds
**Detection Logic**:
- Compare service IDs between polls
- New ID = new service
- Missing ID = decommissioned (see Story 5.3)

**Service Registry Schema**:
```typescript
interface RegisteredService {
  id: string;
  name: string;
  type: 'worker' | 'api' | 'dashboard' | 'automation';
  healthEndpoint: string;
  registeredAt: string;
  metadata?: Record<string, unknown>;
}
```

### Library/Framework Requirements

- sonner or shadcn/ui toast for notifications
- TanStack Query for polling
- Uses Epic 1 tile components

### File Structure Requirements

```
src/features/services/
├── hooks/
│   └── useServiceDiscovery.ts   # NEW
├── components/
│   └── ServiceSkeletonTile.tsx  # NEW
```

### Dependencies

- **Requires Story 1.3**: Extends ServiceHealthTile pattern

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Service Discovery & Health Validation]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1]
- [Source: _bmad-output/planning-artifacts/prd.md#FR15]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
