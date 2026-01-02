# Architecture

## High-Level View
```
React Client (Mithrandir Admin @ port 3000)
        │  HTTPS via Tailscale / LAN
        ▼
Mithrandir Unified API (port 8080)
        │  Internal routing / auth / rate limiting
        ├─→ /api/dashboard/* → Service telemetry aggregations
        ├─→ /transcription/* → Palantir transcription service (9003)
        ├─→ /ssh-status → Host monitoring
        └─→ /services/* → Health checks + control
```

## Client Layers
1. **Routing Shell** (`src/routes/__root.tsx`)
   - Wraps app with navigation progress, toast provider, TanStack devtools.
   - Authenticated routes nest inside `/_authenticated` with `AuthenticatedLayout`.

2. **UI Layout** (`src/components/layout/*`)
   - Sidebar + top-nav components parameterized by `sidebar-data.ts`.
   - `NavigationProgress` renders top loading bar for route transitions.

3. **Feature Modules** (`src/features/*`)
   - Each domain (transcription, dashboard, tasks, services, etc.) isolates API adapters, data shapes, and UI components.
   - Shared libs under `src/lib` provide API client, cookie utilities, error reporting.

4. **State + Data Fetching**
   - TanStack Query handles server cache (QueryClient passed through router context).
   - Zustand store `useAuthStore` persists token-like data in cookies for compatibility.

## Backend Contracts
- **Transcription:** `src/features/transcription/api/transcription-api.ts` defines CRUD + health endpoints. All endpoints map to `/transcription/*` under Unified API.
- **Dashboard Stats:** `src/features/dashboard/api` (placeholder) will call `/api/dashboard/*` once implemented.
- **Services/Tasks:** `features/services` and `features/tasks` structure future API adapters (currently scaffolding).

## Data Flow
1. UI triggers Query action (e.g., refresh jobs).
2. Query uses `apiClient` (axios) with `VITE_API_BASE_URL` → Unified API.
3. Unified API proxies to Palantir service or aggregated endpoints.
4. Response data normalized into TypeScript interfaces (`TranscriptionJob`, etc.).
5. Zustand store updates per authentication or cross-feature state, while component-level state manages filters/forms.

## Cross-Cutting Concerns
- **Error Handling:** `GeneralError` and `NotFoundError` components defined under `features/errors` tie into router error boundaries.
- **Theming:** `src/styles` + Tailwind config manage design tokens. Fonts defined by `src/config/fonts.ts`.
- **Command Palette:** `cmdk` integration offers quick navigation (hooked into `components/command-menu`).
- **Loading States:** `react-top-loading-bar` and skeleton components in each feature keep UX responsive.

## Pending Integrations
- Delegation, n8n, monitoring modules exist as directories but require API contract definition.
- GitHub Issues are the canonical backlog for missing modules—important to sync into docs before planning sessions.
