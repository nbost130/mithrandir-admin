# Story 1.3: Service Health Matrix Tiles

Status: ready-for-dev

## Prerequisites

> [!CAUTION]
> **HARD DEPENDENCY**: Story 1.1 must be complete before this story can be implemented.

- [ ] Story 1.1: SSE reconciliation stream infrastructure

## Story

As a dashboard user,
I want health tiles for all registered services (transcription worker, unified API, dashboard),
So that I can see uptime, status, and last check at a glance.

## Acceptance Criteria

1. **Given** services are registered in Unified API **When** the dashboard loads **Then** each service displays as a tile with: name, status icon, uptime percentage, last check timestamp **And** tiles are arranged in a responsive grid (3 columns on desktop, 1 on mobile)

2. **Given** a service's health endpoint returns an error **When** the tile updates **Then** the tile shows "Error" state (rose color) **And** provides a "View Logs" link that opens the diagnostics drawer

3. **Given** a service status changes from healthy to unhealthy **When** the SSE event arrives **Then** the tile animates briefly to draw attention to the change

4. **Given** keyboard navigation is active **When** user tabs to a service tile **Then** focus-visible ring is displayed **And** Enter key opens the service detail view

## Tasks / Subtasks

- [ ] Task 1: Create ServiceHealthTile component (AC: #1, #2, #4)
  - [ ] Create `src/components/reliability/ServiceHealthTile.tsx`
  - [ ] Display: service name, status icon, uptime %, last check timestamp
  - [ ] Implement status states: healthy (emerald), unhealthy (rose), unknown (slate)
  - [ ] Add "View Logs" link for error states
  - [ ] Implement keyboard navigation (focus-visible, Enter to open detail)

- [ ] Task 2: Create Service Health Grid (AC: #1)
  - [ ] Create `src/features/reliability-feed/components/ServiceHealthGrid.tsx`
  - [ ] Responsive grid: 3 cols desktop, 2 cols tablet, 1 col mobile
  - [ ] Use CSS Grid with Tailwind responsive classes

- [ ] Task 3: Create useServiceHealth hook (AC: #1, #3)
  - [ ] Create `src/features/reliability-feed/hooks/useServiceHealth.ts`
  - [ ] Wrap TanStack Query with SSE-driven invalidation
  - [ ] Track per-service health status from reconciliation stream

- [ ] Task 4: Create status change animation (AC: #3)
  - [ ] Add CSS animation for status transitions
  - [ ] Brief pulse/highlight when status changes
  - [ ] Use Framer Motion or CSS transitions

- [ ] Task 5: Wire to Diagnostics Drawer (AC: #2)
  - [ ] Open DiagnosticsDrawer from Story 1.2 on "View Logs" click
  - [ ] Pass service context to drawer

- [ ] Task 6: Write tests (AC: all)
  - [ ] Component tests for ServiceHealthTile
  - [ ] Accessibility tests for keyboard navigation
  - [ ] Animation trigger tests

## Dev Notes

### Architecture Compliance

**Implements FR2**: Service Health Matrix

Per `architecture.md`:
- Shared component in `src/components/reliability/`
- Uses `useReconciliationStream` from Story 1.1
- Tiles subscribe to shared hooks wrapping TanStack Query cache entries

### Technical Requirements

**Accessibility (NFR12)**:
- Keyboard navigation for every control
- Focus-visible states (ring-2 ring-offset-2)
- ARIA labels for status indicators
- Role="button" for clickable tiles

**Semantic Status Colors**:
- Healthy: emerald (`text-emerald-500`, `bg-emerald-100`)
- Unhealthy: rose (`text-rose-500`, `bg-rose-100`)
- Unknown/Initializing: slate (`text-slate-500`, `bg-slate-100`)

### Service Data Endpoint

**EXISTING ENDPOINT - No new development needed:**

The endpoint already exists at `src/features/services/api/services-api.ts`:
- Endpoint: `GET /api/services/health`
- Returns: `{ services: ServiceDetails[], summary: ServicesSummary }`
- Already implemented: `servicesApi.getHealth()`

**ServiceDetails interface** (from existing code):
```typescript
interface ServiceDetails {
  name: string;
  identifier: string;
  status: 'healthy' | 'unhealthy';
  url: string;
  port: number;
  uptime?: number;
  version?: string;
  error?: string;
  details?: Record<string, unknown>;
  lastChecked: string;
}
```

**For Story 5.1 (Auto-Discovery):** A new `/services/registered` endpoint may be needed that includes registration metadata. This story uses the existing health endpoint.

### Library/Framework Requirements

- shadcn/ui Card component as base
- TanStack Query for data
- Optional: Framer Motion for animations (or CSS transitions)

### File Structure Requirements

```
src/components/reliability/
├── ServiceHealthTile.tsx      # NEW
└── ConnectionStatusBadge.tsx  # From Story 1.1

src/features/reliability-feed/
├── components/
│   └── ServiceHealthGrid.tsx  # NEW
└── hooks/
    └── useServiceHealth.ts    # NEW
```

### Responsive Grid Pattern

```tsx
// Example grid implementation
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {services.map(service => (
    <ServiceHealthTile key={service.id} service={service} />
  ))}
</div>
```

### Dependencies

- **Requires Story 1.1**: Uses SSE stream for real-time updates
- **Requires Story 1.2**: Reuses DiagnosticsDrawer component

### References

- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/prd.md#NFR12 - Accessibility]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List
