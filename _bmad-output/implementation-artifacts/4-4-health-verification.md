# Story 4.4: Health Verification After AI Actions

Status: future

> [!WARNING]
> **DEFERRED**: This story requires a design session before implementation.
> - Depends on Stories 4.1-4.3
> - Design session needed to define health verification criteria for AI actions

## Story

As a dashboard user,
I want automatic health verification after AI actions complete,
So that I know if the fix actually worked.

## Acceptance Criteria

1. **Given** an AI remediation action completes **When** the completion event is received **Then** automatic health verification starts within 5 seconds **And** status shows "Verifying health..."

2. **Given** health check runs **When** all monitored metrics return to healthy thresholds **Then** status shows "Health Verified" (emerald) **And** before/after comparison is recorded (NFR10)

3. **Given** health check runs **When** some metrics remain unhealthy **Then** status shows "Partial Recovery" (amber) **And** list of remaining issues is displayed **And** "Further Action Needed" flag is set

4. **Given** health verification is complete **When** user views the delegation detail **Then** before/after telemetry snapshots are displayed side-by-side **And** delta highlighting shows what changed

## Tasks / Subtasks

- [ ] Task 1: Implement automatic health verification trigger (AC: #1)
  - [ ] Hook into AI action completion events
  - [ ] Start health check within 5 seconds
  - [ ] Show "Verifying health..." status

- [ ] Task 2: Create health verification logic (AC: #2, #3)
  - [ ] Define healthy thresholds for monitored metrics
  - [ ] Check service health endpoints
  - [ ] Compare against pre-action snapshot

- [ ] Task 3: Implement before/after snapshots (AC: #2, #4)
  - [ ] Capture telemetry before AI action
  - [ ] Capture telemetry after verification
  - [ ] Store snapshots for comparison

- [ ] Task 4: Create comparison visualization (AC: #4)
  - [ ] Create `src/features/ai-delegation/components/HealthComparison.tsx`
  - [ ] Side-by-side before/after display
  - [ ] Delta highlighting for changes

- [ ] Task 5: Handle partial recovery (AC: #3)
  - [ ] Identify remaining unhealthy metrics
  - [ ] Display list of issues
  - [ ] Set "Further Action Needed" flag

- [ ] Task 6: Create useHealthVerification hook
  - [ ] Execute health checks
  - [ ] Compare before/after states
  - [ ] Determine verification outcome

- [ ] Task 7: Write tests (AC: all)
  - [ ] Test automatic verification trigger
  - [ ] Test healthy/partial/failed outcomes
  - [ ] Test comparison display

## Dev Notes

### Architecture Compliance

**Implements FR13**: Health Verification
**Implements NFR10**: Before/after snapshots

Per `architecture.md`:
- After any automated action, system re-checks health
- Records before/after snapshots

### Technical Requirements

**Health Verification States**:
- Verifying: sky (`bg-sky-100`)
- Verified: emerald (`bg-emerald-100`)
- Partial Recovery: amber (`bg-amber-100`)
- Failed: rose (`bg-rose-100`)

**Snapshot Schema**:
```typescript
interface HealthSnapshot {
  timestamp: string;
  services: Array<{
    name: string;
    status: 'healthy' | 'unhealthy' | 'unknown';
    metrics: Record<string, number>;
  }>;
  discrepancies: number;
  activeJobs: number;
  failedJobs: number;
}
```

### Library/Framework Requirements

- Uses Epic 1 telemetry infrastructure
- TanStack Query for caching
- Custom diff visualization

### File Structure Requirements

```
src/features/ai-delegation/
├── components/
│   └── HealthComparison.tsx    # NEW
├── hooks/
│   └── useHealthVerification.ts # NEW
```

### Dependencies

- **Requires Story 4.1-4.3**: Triggered by AI action completion
- **Requires Epic 1**: Uses telemetry data

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.4]
- [Source: _bmad-output/planning-artifacts/prd.md#FR13, NFR10]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
