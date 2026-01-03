stepsCompleted:
- 1
- 2
- 3
- 4
- 5
- 6
- 7
inputDocuments:
- _bmad-output/planning-artifacts/prd.md
- _bmad-output/planning-artifacts/ux-design-specification.md
- docs/project-documentation/architecture.md
- docs/project-documentation/technology-stack.md
- docs/project-documentation/component-inventory.md
- docs/project-documentation/development-guide.md
- docs/project-documentation/deployment-guide.md
- docs/project-documentation/github-issues.md
- docs/project-documentation/source-tree-analysis.md
- docs/project-documentation/project-overview.md
- docs/CICD_SETUP.md
- docs/DEPLOYMENT.md
workflowType: architecture
lastStep: 7
documentCounts:
  prd_docs: 1
  ux_docs: 1
  projectDocs: 10
  researchDocs: 0
  projectContextRules: 0
---

# Architecture Decision Record - Mithrandir Admin

**Author:** Nathan
**Date:** 2026-01-02

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
- Reliability telemetry spans transcription state, a service health matrix, and stale/rate-limit messaging so every tile can prove its freshness.
- Maintenance & controls cover job retry/delete, queue hygiene, service restarts, and an auditable command log, forming the “diagnose → act → verify” loop.
- The Issue & Delegation hub ingests GitHub issues across the /dev repos, attaches current telemetry snapshots, and launches/monitors AI dev workflows inline.
- AI-assisted remediation needs a shared command bus plus post-action verification, with manual fallback if automation fails.
- Service onboarding auto-discovers Unified API registrations, validates health before surfacing them, and prompts for custom tasks; roadmap items add delegation prioritization, n8n workflow control, and cross-project incident views.

**Non-Functional Requirements:**
- Performance budgets (≤1 s initial load, <300 ms route swaps) and graceful poll throttling drive data-fetch strategy.
- Reliability mandates “zero silent mismatches,” so discrepancy detection and alerting must run every polling cycle.
- Tailscale-only access removes public auth but requires strict env validation.
- Observability/operability demand before/after snapshots, timestamped logs, feature flags, and reconciled audit trails.
- Accessibility guardrails (keyboard nav, contrast, ARIA) persist despite single-user scope.

**Scale & Complexity:**
- Primary domain: reliability-focused React/Vite dashboard atop TanStack Router/Query and shadcn/ui.
- Complexity level: medium-high—multiple backend integrations, AI delegation, and service automation despite a single primary admin.
- Estimated major components: ~7 (telemetry tiles, reconciler/log feed, maintenance command layer, issue/delegation hub, AI command bus, service onboarding, future automation modules).

### Technical Constraints & Dependencies

- Unified API (port 8080) fronts Palantir, service health, and future modules; it remains the locus for reconciliation logic.
- Tooling stack is fixed: npm workflows, Biome lint/format, Vitest for tests; GitHub Actions deploy via Tailscale.
- Access limited to Tailscale network; no external auth planned.
- GitHub issues sync via `scripts/update_github_issues_snapshot.py`; planning workflows rely on fresh data.
- AI delegation, n8n control, and other automations require structured status exchanges plus audit logging.
- Package-manager mismatch (npm vs pnpm) and Biome documentation gaps are active backlog items that influence onboarding.

### Cross-Cutting Concerns Identified

- Data fidelity & reconciliation: a Unified API reconciler module compares Palantir vs. cached/dashboard data each poll, logs discrepancies (counts, checksums, timestamps, latency), and feeds every surface the same “trust score.”
- Observability & audit: maintenance commands and AI workflows emit structured events with before/after metrics so debugging and replay tests share one source of truth.
- AI delegation orchestration: issue cards, telemetry, and workflow status boards all subscribe to the same discrepancy/audit streams to keep humans aware of AI actions.
- Rate-limit resilience: polling cadence, exponential backoff, and stale messaging ensure 429/5xx states are explicit and guide remediation.
- Service discovery & validation: Unified API onboarding plus feature flags gate new services until health checks pass.
- Environment/tooling guardrails: npm/Biome scripts, env validation, and GitHub snapshot cadence keep agents aligned.

## Starter Template Evaluation

### Primary Technology Domain

Reliability-focused React/Vite web dashboard with TanStack Router/Query and shadcn/ui

### Starter Options Considered

- **create-vite v8.2.0** – React + TypeScript + SWC template that matches the current brownfield stack (Vite 7, Tailwind 4, shadcn/ui, TanStack). Minimal overhead, keeps AI agents productive.
- **create-next-app v16.1.1** – Provides Next.js App Router + SSR, but redundant for a single-tenant Tailscale-only dashboard and would require replacing TanStack Router plus adapting deployments.
- **create-t3-app v7.40.0** – Bundles Next.js + tRPC + Prisma + Auth.js; powerful for SaaS but adds unnecessary services and forces major rewrites away from the established architecture.

### Selected Starter: create-vite (React + TS + SWC)

**Rationale for Selection:**
Maintains complete alignment with the existing React 19 + Vite 7 + TanStack Router/Query codebase, so new reliability features and the Unified API reconciler layer integrate without framework churn. Keeps npm/Biome/Vitest workflows intact and avoids introducing SSR/runtime complexity that doesn’t benefit the Tailscale-only admin console.

**Initialization Command:**

```bash
npm create vite@latest mithrandir-admin -- --template react-swc-ts
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript-first React 19 app compiled via Vite’s SWC pipeline, matching our strict TS configs for telemetry models.

**Styling Solution:**
Tailwind 4 integration ready for shadcn/ui tokens; Radix-based components drop in without extra setup.

**Build Tooling:**
Vite dev server + esbuild/SWC bundling give fast HMR and production builds tuned for TanStack Router file routes.

**Testing Framework:**
Ships with Vitest + jsdom; we extend with Testing Library and snapshot utilities already referenced in docs.

**Code Organization:**
Feature-first `src/` structure with minimal opinions, preserving `features/*`, `components/ui`, `lib`, and TanStack route trees we already maintain.

**Development Experience:**
NPM scripts align with Biome (`npm run biome:*`), Vitest, and GitHub Actions/Tailscale deployment flow; first implementation story remains “initialize Vite scaffold, layer shadcn/TanStack tooling, then wire the reconciler + maintenance modules.”

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Unified API reconciliation module owns the single source of truth: every telemetry poll and maintenance action writes to a SQLite 3.43.2 discrepancy/audit log before UI consumption.
- Tailscale-only boundary with signed service tokens guards dashboard ↔ Unified API calls; no public auth layer, but all actions are authenticated and auditable.
- Server-Sent Events endpoints (`/reconciliation/stream`, `/commands/run`) broadcast verification and command results so the dashboard, maintenance modals, and AI delegation board read the same feed.

**Important Decisions (Shape Architecture):**
- TanStack Query 5.90.16 + Zustand remain the shared state backbone; reconciliation events mutate query cache so reliability tiles, service cards, and issue drawers stay consistent.
- axios 1.13.2 interceptors normalize errors into `{code,message,remediation}` payloads to keep discrepancy banners actionable.
- GitHub Actions + npm + Biome 2.3.10 pipeline continues as-is, templated to run migrations for the reconciliation schema before deploying Unified API.

**Deferred Decisions (Post-MVP):**
- Migrating the discrepancy/audit store from SQLite to Postgres once multi-node Unified API is needed.
- Adding WebSocket mirroring for AI delegation (SSE suffices for single-admin scope today).

### Data Architecture

- Unified API pulls Palantir + service health stats, reconciles payloads, and logs discrepancy + maintenance events in SQLite 3.43.2 with timestamp, service, checksum, JSON payload, before/after metrics, and actor identity.
- Dashboard remains read-only: TanStack Query caches 5 s windows while SSE updates inject verified/stale flags via `queryClient.setQueryData`.
- Zod schemas validate all incoming data at feature boundaries, doubling as Vitest fixtures for replaying incident traces.
- Caching strategy: server deduplicates identical upstream payloads; SSE feed prevents redundant client polling.

### Authentication & Security

- Access restricted to Tailscale; `.env` stores the Unified API service token consumed by axios interceptors and persisted in Zustand memory.
- Unified API checks origin + token signature before executing maintenance commands; commands log actor, inputs, and hashed results in the audit log.
- Sensitive service keys remain server-side; dashboard only sends command requests and receives structured outcomes.
- Append-only audit table enforced with SQLite triggers to meet reliability/auditability goals.

### API & Communication Patterns

- REST JSON remains primary; new reconciliation endpoints return typed payloads with ISO timestamps and signed checksums.
- `/commands/run` issues idempotent command IDs and streams `{eventId,status,logs}` over SSE so UI can show running/success/error.
- Error responses standardized to `{code,message,remediation}`; 429 responses include retry-after data that the dashboard surfaces to users.
- AI delegation board subscribes to the same SSE channel, ensuring human + AI actors share identical context.

### Frontend Architecture

- TanStack Router 1.144.0 defines feature routes; reliability tiles, service cards, and issue drawers subscribe to shared hooks wrapping TanStack Query cache entries.
- Zustand stores auth tokens + feature flags; SSE events write directly into TanStack Query caches instead of duplicating state in components.
- shadcn/ui + Tailwind tokens power consistent status colors (verified/stale/investigating/error) across cards, modals, and banners.
- Performance optimizations: route-level code splitting in `vite.config.ts`, virtualization for log/issue lists, SWC minification for stable bundles.

### Infrastructure & Deployment

- GitHub Actions (npm) pipeline: install → `npm run biome:check` → `npm run test` → build → deploy via Tailscale SSH/systemd; migrations for the SQLite schema run before restarting Unified API.
- SQLite file lives at `/var/lib/mithrandir/reconciler.db` with nightly `sqlite3 .backup` cron jobs; journald/Loki capture reconciliation latency + command duration metrics.
- Monitoring hooks feed discrepancy counts and command outcomes into dashboard tiles; GitHub issue exports attach latest log slices automatically via `scripts/update_github_issues_snapshot.py` cadence.
- Feature flags toggled via env + TanStack query keys so future modules (n8n control, automation board) can roll out safely.

### Decision Impact Analysis

**Implementation Sequence:**
1. Build the reconciliation module + SQLite schema + `/reconciliation/*` endpoints in Unified API.
2. Add the command bus (`/commands/run`) with SSE output and append-only audit logging.
3. Update frontend data layer (TanStack Query hooks + SSE subscriber) to read the reconciliation feed and show verification states.
4. Wire maintenance modals and service cards to the command bus + audit viewer.
5. Extend GitHub issue hub + AI delegation board to attach reconciliation/audit packets automatically.

**Cross-Component Dependencies:**
- Reconciliation schema drives telemetry tiles, maintenance verification, and issue attachments—schema changes must roll out cross-stack.
- Command bus outcomes depend on reconciliation checks; UI expects SSE events to include both command and verification identifiers.
- GitHub issue sync + AI delegation rely on audit retention; backups ensure context survives restarts for AI agents.

## Implementation Patterns & Consistency Rules

### Naming Patterns

- **Persistence vs DTO mapping:** Reconciler SQLite tables use snake_case singular names (`discrepancy_event`, `command_audit`); JSON/SSE payloads use camelCase (`lastVerifiedAt`, `commandId`). Maintain an explicit mapping table whenever new fields are added so backend logs and frontend types stay in sync.
- **Endpoints & events:** REST routes stay kebab-case (`/api/reconciliation/latest`), SSE event types use dot notation (`reconciliation.update`, `command.status`). Event payload fields follow camelCase.
- **Frontend files/components:** Feature directories are kebab-case (`features/reliability-feed`); components/hooks in PascalCase or `use` prefix (`ServiceCard`, `useReliableQuery`). Route files remain under `src/routes/<feature>/$segment.tsx`.

### Structure Patterns

- **Feature-first layout:** Each feature keeps `api`, `components`, `hooks`, `data`, `tests` subfolders. Shared primitives live in `src/components/ui` (shadcn) or `src/lib` (axios client, reconciliation stream helpers).
- **State hooks:** SSE logic lives in `src/lib/reconciliation-stream.ts`; every feature consumes SSE via `useReliableQuery` + helper hooks, never by instantiating `EventSource` directly.
- **Testing:** Vitest files mirror source paths with `.test.ts`; reconciliation contracts live under `src/features/reliability-feed/tests/`.

### Format Patterns

- **API responses:** Unified API returns `{ data, meta }` where `meta` includes `timestamp`, `source`, `checksum`, `traceId`. Errors standardize on `{ code, message, remediation, traceId }`.
- **SSE payloads:** `reconciliation.update` emits `{ eventId, service, status, counts, checksum, latencyMs, discrepancyDetails? }`; `command.status` emits `{ commandId, service, phase, logs, verified }`.
- **Date/time:** All dates transmitted as ISO-8601 UTC strings; frontend converts via Luxon/DateTime utilities in `src/lib/datetime.ts`.

### Communication Patterns

- **State updates:** TanStack Query caches own telemetry/command data; `useReliableQuery` wraps `useQuery` with SSE-driven invalidation. Zustand stores only auth tokens + feature flags; no feature data lives in Zustand or component `useState`.
- **Event/action naming:** Maintenance actions use verb-based ids (`restart-service`, `purge-queue`). Logs prefix with `[reconciler]`, `[command-bus]`, `[ui:<feature>]` for grepability.
- **Status tokens:** Reliability states map to shadcn tokens: verified → `text-emerald-500`/`bg-emerald-100`, stale → `text-amber-500`/`bg-amber-100`, investigating → `text-sky-500`, error → `text-rose-500`. Use consistent badges/cards across features.

### Process Patterns

- **Loading/error handling:** Components expose `isPending`, `isError`, and show Skeletons/Shimmer from shadcn while data loads. Errors route through axios interceptors so banners/toasts always show remediation text from `{code,message,remediation}`.
- **Validation:** Zod schemas validate payloads before writing to cache; failed parse triggers a `reconciliation.update` with `status: 'invalid-payload'` plus a toast.
- **Retries:** `useReliableQuery` handles exponential backoff (5 s base) and surfaces stale indicators; components don’t implement ad-hoc retries.

### Enforcement Guidelines

- All AI agents MUST reuse shared tooling: `src/lib/apiClient.ts` for HTTP, `useReliableQuery`/`useCommandBus` hooks for data/commands, `src/lib/reconciliation-stream.ts` for SSE.
- Run `npm run biome:check` and `npm run test` before submitting changes; Biome enforces naming/formatting and Knip ensures unused exports are caught.
- Update `docs/project-documentation/*` when adding new endpoints, SSE fields, or feature directories; include the snake_case ↔ camelCase mapping in the doc.
- Pattern violations get documented in PR comments + architecture addendum; changes to patterns require updating this section + notifying AI agents.

### Pattern Examples

**Good Example**
```ts
const reconciliationEventSchema = z.object({
  eventId: z.string(),
  service: z.string(),
  status: z.enum(['verified','stale','discrepancy']),
  counts: z.record(z.number()),
  checksum: z.string(),
  latencyMs: z.number(),
});

export function useReconciliationStream() {
  useReliableQuery({
    queryKey: ['reconciliation','services'],
    queryFn: fetchReconciliation,
    onSseEvent: (event) => {
      const parsed = reconciliationEventSchema.parse(event);
      queryClient.setQueryData(['reconciliation','services'], (prev = []) => upsertById(prev, parsed.eventId, parsed));
    },
  });
}
```

**Anti-Patterns**
- Creating raw `fetch`/`axios` calls outside `src/lib/apiClient.ts`.
- Instantiating `new EventSource` inside components or storing reconciliation data in Zustand/component state.
- Emitting SSE payloads with snake_case fields or without `checksum`/`timestamp` in `meta`.

### Error Boundary Strategy

- **Route-level boundaries:** Each TanStack Router route wraps its content in a React Error Boundary that catches component-level exceptions and renders a fallback UI with "Retry" and "Report Issue" CTAs.
- **Global fallback:** `src/components/layout/RootErrorBoundary.tsx` catches unhandled errors at the app root, logs the error stack to the audit trail via `apiClient.post('/audit/client-error')`, and offers a "Reload Dashboard" button.
- **Error recovery:** Non-fatal errors show inline banners (using the `{code,message,remediation}` format); fatal errors trigger the full Error Boundary and preserve recent navigation history in sessionStorage for diagnostic context.
- **Integration with observability:** All caught errors emit a structured log entry `{ timestamp, route, errorType, stack, userId }` for later correlation with server-side discrepancy events.

### SSE Reconnection & Connection Management

- **Reconnection strategy:** `src/lib/reconciliation-stream.ts` implements exponential backoff (initial 1s, max 30s, jitter ±20%) for SSE reconnections. After 5 consecutive failures, switch to polling fallback (10s interval) and show a "Live updates paused" banner.
- **Heartbeat handling:** Server sends `heartbeat` events every 15s; client resets a 30s timeout on each heartbeat. If timeout fires, close and reopen the connection.
- **Connection state management:** A `connectionStatus` atom in TanStack Query tracks `'connected' | 'reconnecting' | 'polling-fallback' | 'offline'`; reliability tiles and banners subscribe to this state for visual cues.
- **Graceful degradation:** If SSE is entirely unavailable (e.g., proxy issues), the dashboard works in polling-only mode with a persistent "Real-time updates unavailable" warning.

### Service Discovery & Health Validation

- **Polling design:** Dashboard polls `/services/registered` every 60s to detect newly registered services. New services trigger a toast notification and auto-add a skeleton tile.
- **Health check retry/timeout:** Before surfacing a new service tile, dashboard calls the service's health endpoint with 3 retries (2s, 4s, 8s backoff) and a 10s per-request timeout. Failure after all retries shows the tile in "unhealthy" state with a "Retry Health Check" button.
- **Validation gate:** Services must pass health validation before maintenance controls are enabled; unhealthy services show read-only status and a link to logs.
- **Service removal:** Services deregistered from Unified API are marked "decommissioned" (grayed tile) for 24h before auto-hiding, allowing investigation of unexpected removals.

### Performance Budgets & Monitoring

- **Bundle budgets:** Production build must stay under 500KB gzipped for initial JS; route-level code splitting enforced via `vite.config.ts` manual chunks. CI fails if bundle size increases >10% without explicit approval.
- **Lighthouse targets:** Aim for Lighthouse Performance score ≥90 on homelab network. Key metrics: LCP <1.2s, FID <100ms, CLS <0.05.
- **Route swap budget:** Client-side route transitions must complete in <300ms (measured via TanStack Router's `onTransitionStart`/`onTransitionEnd` hooks logging to console in dev).
- **Polling efficiency:** TanStack Query deduplicates requests within 5s windows; reconciliation endpoint returns 304 Not Modified for unchanged data to minimize payload.

### Drawer & Modal Component Patterns

- **Diagnostics Drawer:** `src/features/maintenance/components/DiagnosticsDrawer.tsx` slides in from the right (400px width on desktop, full-screen on mobile), contains tabs for Logs, Metrics, and Actions. Always includes a close button and an "Open in New Tab" link.
- **Maintenance Action Modal:** Centered dialog with confirmation step showing before/after preview. Blocks background interaction. Shows inline progress during action execution, then success/error state with "View Audit Log" link.
- **Issue Detail Drawer:** `src/features/issues/components/IssueDrawer.tsx` displays GitHub issue with embedded telemetry cards, AI status chip, and "Launch Admin Dev Team" button at bottom. Maintains scroll position when AI status updates.

### Global Search (Cmd+K)

- **Implementation:** Use `cmdk` component (already in dependencies) to provide a global command palette accessible via `Cmd+K` / `Ctrl+K`.
- **Search scope:** Jobs by ID/name, services by name, GitHub issues by title, and navigation commands (e.g., "Go to Dashboard", "Open Settings").
- **Integration:** `src/components/layout/CommandPalette.tsx` subscribes to TanStack Query caches for instant results; no server round-trip for cached entities.
- **Keyboard navigation:** Full arrow-key support, Enter to select, Escape to close. Recent searches persisted in localStorage (max 10 items).

### OpenAPI Type Generation

- **Palantir types:** `npm run generate:types` pulls OpenAPI spec from Palantir (`/documentation/json`) and writes to `src/types/palantir.d.ts`. Run after any Palantir API changes.
- **Reconciliation types (NEW):** Add a parallel script `npm run generate:types:reconciler` targeting Unified API's `/reconciliation/documentation/json` to generate `src/types/reconciler.d.ts`. This ensures frontend/backend type alignment.
- **Integration with Zod:** Generated types serve as the source of truth; Zod schemas in feature `data/` folders should match these types. Consider using `zod-to-ts` or manual alignment checks in CI.
- **Documentation:** After running type generation, update `docs/project-documentation/api-contracts-admin-dashboard.md` with any new endpoint signatures.

## Project Structure & Boundaries

### Requirements to Structure Mapping

- **Reliability Telemetry (FR1–3):** `src/features/transcription`, `src/features/services`, and the new `src/features/reliability-feed` module (houses reconciler/SSE cards). Shared tiles/badges live under `src/components/reliability`.
- **Maintenance & Controls (FR4–7):** `src/features/maintenance` contains maintenance modals/drawers; `src/lib/command-bus.ts` centralizes Unified API command helpers.
- **Issue & Delegation Hub (FR8–11):** `src/features/issues` (GitHub list/detail) pulls telemetry via hooks in `src/features/reliability-feed` and renders AI delegation board states.
- **AI-Assisted Remediation (FR12–14):** `src/features/ai-delegation` coordinates workflows while backend `/commands/run` SSE stream is documented in `docs/project-documentation/api-contracts-admin-dashboard.md`.
- **Service Onboarding & Automations (FR15–19):** `src/features/services` auto-discovers Unified API registrations; `src/features/automations` (future n8n control) lives behind feature flags defined in `src/lib/feature-flags.ts`.

### Project Directory Structure

The following structure shows both **existing directories** (in production today) and **new directories** (to be created during implementation). New directories should only be created when the corresponding feature work begins—do not scaffold empty directories ahead of time.

```
mithrandir-admin/
├── package.json / package-lock.json / biome.json / tsconfig*.json
├── vite.config.ts / tailwind.config.ts / postcss.config.js
├── .env.example / .env.local
├── docs/
├── .github/workflows/{ci.yml,deploy.yml}
├── scripts/update_github_issues_snapshot.py
├── src/
│   ├── main.tsx / App.tsx
│   ├── routes/                              # EXISTING
│   │   ├── __root.tsx
│   │   ├── dashboard/index.tsx
│   │   ├── transcription/$jobId.tsx
│   │   ├── services/$serviceId.tsx
│   │   ├── maintenance/index.tsx            # NEW - create with maintenance feature
│   │   ├── issues/index.tsx                 # NEW - create with issues feature
│   │   └── ai-delegation/index.tsx          # NEW - create with AI delegation feature
│   ├── features/
│   │   ├── auth/{...}                       # EXISTING
│   │   ├── dashboard/{...}                  # EXISTING
│   │   ├── errors/{...}                     # EXISTING
│   │   ├── services/{...}                   # EXISTING
│   │   ├── settings/{...}                   # EXISTING
│   │   ├── transcription/{...}              # EXISTING
│   │   ├── reliability-feed/{...}           # NEW - create with reconciliation work
│   │   ├── maintenance/{...}                # NEW - create with maintenance controls
│   │   ├── issues/{...}                     # NEW - create with GitHub issue hub
│   │   ├── ai-delegation/{...}              # NEW - create with AI workflow integration
│   │   └── automations/{...}                # FUTURE - behind feature flag
│   ├── components/
│   │   ├── ui/                              # EXISTING - shadcn components
│   │   ├── reliability/                     # NEW - shared reliability tiles/badges
│   │   └── layout/                          # NEW - layout shells, error boundaries
│   ├── context/                             # EXISTING - React context providers
│   │   ├── auth-context.tsx                 # Keep using for auth state
│   │   ├── theme-context.tsx                # Keep using for theme
│   │   └── ...                              # Other existing contexts
│   ├── stores/                              # EXISTING - Zustand stores
│   │   └── ...                              # Keep existing stores here; new stores also go here
│   ├── hooks/                               # EXISTING - shared hooks (3 files)
│   ├── lib/
│   │   ├── apiClient.ts                     # EXISTING
│   │   ├── cookies.ts                       # EXISTING
│   │   ├── errorTracking.ts                 # EXISTING
│   │   ├── handle-server-error.ts           # EXISTING
│   │   ├── utils.ts                         # EXISTING
│   │   ├── reconciliation-stream.ts         # NEW - SSE helper
│   │   ├── command-bus.ts                   # NEW - command execution helper
│   │   ├── feature-flags.ts                 # NEW - feature flag utilities
│   │   └── datetime.ts                      # NEW - date utilities (wraps date-fns)
│   ├── types/
│   │   ├── palantir.d.ts                    # EXISTING - generated
│   │   └── reconciler.d.ts                  # NEW - generated from reconciliation API
│   ├── assets/                              # EXISTING - imported media
│   ├── config/fonts.ts / styles/global.css  # EXISTING
│   └── test/setup.ts                        # EXISTING
├── public/
│   ├── favicon.svg / icons
│   └── manifest.webmanifest
└── vitest.config.ts
```

**Directory Creation Timing:**
- **Epic 1 (Reconciliation):** Create `src/features/reliability-feed/`, `src/lib/reconciliation-stream.ts`, `src/components/reliability/`
- **Epic 2 (Command Bus):** Create `src/lib/command-bus.ts`, `src/features/maintenance/`
- **Epic 3 (Issues Hub):** Create `src/features/issues/`, `src/routes/issues/`
- **Epic 4 (AI Delegation):** Create `src/features/ai-delegation/`, `src/routes/ai-delegation/`
- **Future:** Create `src/features/automations/` when n8n control is ready

### Integration Boundaries

- **API Boundaries:** Dashboard talks only to Unified API endpoints (`/api/dashboard/*`, `/transcription/*`, `/services/*`, `/commands/run`, `/reconciliation/*`) via `src/lib/apiClient.ts`. Unified API alone communicates with Palantir/service health.
- **Component Boundaries:** Feature components communicate via TanStack Router loaders/hooks; shared UI resides in `src/components`. SSE + command logic is centralized in `src/lib/reconciliation-stream.ts` and `src/lib/command-bus.ts`.
- **Service Boundaries:** Unified API reconciliation module owns telemetry truth and command execution; dashboard never bypasses it. AI workflows triggered through `/commands/run`.
- **Data Boundaries:** SQLite discrepancy/audit tables live server-side; frontend stores telemetry and command states only in TanStack Query. Zustand is reserved for auth tokens and feature flags.

### Integration Points

- **Internal Communication:** `useReliableQuery`, `useReconciliationStream`, and `useCommandBus` manage TanStack Query + SSE; feature-level hooks expose selectors for tiles, drawers, and issue attachments.
- **External Integrations:** GitHub issue snapshot script feeds docs + UI; AI delegation endpoints integrate with admin AI workflows managed from `src/features/ai-delegation`; n8n control (future) plugs into `src/features/automations/api`.
- **Data Flow:** Palantir/service health → Unified API reconciler (logs to SQLite) → SSE/REST → TanStack Query cache → UI + GitHub issue attachments.

### File Organization Patterns

- **Configuration:** Root-level `biome.json`, `tsconfig*`, `vite.config.ts`, `.env.*`, `.github/workflows/*`, docs under `docs/`, planning artifacts under `_bmad-output/`.
- **Source:** Feature-first under `src/features`; shared libs in `src/lib`; shadcn primitives in `src/components/ui`; layout shells in `src/components/layout`.
- **Tests:** Colocated `*.test.ts[x]` per feature; test setup at `src/test/setup.ts`; room for future e2e tests under `e2e/` if needed.
- **Assets:** `public/` for static assets (logos, manifest); `src/assets/` for imported media if required.

### Development Workflow Integration

- **Dev Server:** `npm run dev` (Vite) with `.env.local` pointing to Tailscale-accessible Unified API hosts; feature flags set via env + `feature-flags.ts`.
- **Build Process:** `npm run build` (Vite/SWC) outputs `dist/`; GitHub Actions runs Biome/Vitest then uploads artifacts for deployment through Tailscale SSH/systemd scripts.
- **Deployment:** Unified API (with reconciler + SQLite) and dashboard run on Mithrandir host; `.github/workflows/deploy.yml` handles build, migrations, and service restarts.

### Git Workflow & Conventions

- **Commit message format:** Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). Scope is optional but encouraged (e.g., `feat(reliability): add reconciliation stream hook`).
- **Branch naming:** `feature/epic-N-short-description` for epic work (e.g., `feature/epic-1-reconciliation-module`), `fix/issue-N-description` for bug fixes, `chore/description` for maintenance.
- **PR review process:** All PRs run CI (Biome, Vitest, build). Gemini AI performs automated code review in GitHub Actions workflow. Human approval required for architecture-impacting changes.
- **Feature flag naming:** `VITE_FF_<FEATURE_NAME>` in `.env` (e.g., `VITE_FF_N8N_CONTROL=true`). Access via `src/lib/feature-flags.ts` which provides typed helpers.
- **GitHub issue snapshots:** Run `python3 scripts/update_github_issues_snapshot.py` before starting new planning workflows or after major backlog changes. Output stored in `docs/project-documentation/github-issues.md`.

## Architecture Validation & Readiness

**Coherence Checks:** React 19.2.3 + Vite 7.3.0 + TanStack Query 5.90.16/TanStack Router 1.144.0 integrate cleanly with the SSE/command bus model; axios 1.13.2 + Zod validation enforce consistent error/data handling. No contradictory decisions detected.

**Requirements Coverage:** FR buckets (telemetry, maintenance, issues/delegation, AI remediation, onboarding) each map to feature directories and Unified API modules; NFRs (performance, security, observability, accessibility) are addressed via reconciler cadence, Tailscale boundary, audit logs, and shadcn/TanStack UX patterns.

**Implementation Readiness:** Patterns specify naming/state/error conventions, structure defines all files, and enforcement relies on Biome/Vitest/docs. Deferred items (future Postgres migration, optional WebSocket mirror) are noted but non-blocking.

**Validation Checklist:**
- ✅ Technology choices compatible and patterns aligned
- ✅ Requirements fully mapped to architecture
- ✅ Project tree + integration boundaries complete
- ✅ Implementation patterns include examples/anti-patterns

**Architecture Status:** READY FOR IMPLEMENTATION (confidence: high)

**Key Strengths:** Unified reconciliation spine with audit trail, feature-first layout that mirrors FR buckets, and explicit tooling/pattern enforcement for AI agents.

**Areas for Future Enhancement:** Promote reconciler log to Postgres when multi-node Unified API is needed; add WebSocket mirroring if additional clients demand richer streams.

**Next Implementation Steps:**
1. Initialize/confirm the Vite React TS scaffold (`npm create vite@latest mithrandir-admin -- --template react-swc-ts`).
2. Implement the Unified API reconciliation module + `/reconciliation/*` endpoints and SSE feed.
3. Add command bus (`/commands/run`) with SSE output and append-only audit logging.
4. Wire frontend hooks (`useReliableQuery`, `useReconciliationStream`, `useCommandBus`) to consume the new APIs.
5. Extend maintenance modals, service cards, and issue/delegation boards per the implementation sequence.

## Architecture Completion & Handoff

- `architecture.md` now contains context analysis, starter choice, decisions, patterns, structure, and validation.
- `_bmad-output/project-context.md` is generated with 25 rules across tech stack, language, framework, testing, quality, workflow, and anti-pattern sections.
- Implementation priority remains: scaffold → reconciliation module → command bus → frontend wiring → issue/delegation enhancements.
