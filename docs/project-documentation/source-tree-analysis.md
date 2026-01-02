# Source Tree Analysis

```
src/
  components/           Reusable UI (shadcn wrappers, layout shell, table helpers)
  config/               Fonts + future theme configuration
  context/              React context utilities (query client wiring)
  features/             Domain modules (transcription, services, dashboard, etc.)
  hooks/                Custom hooks shared across features
  lib/                  Low-level utilities (axios client, cookies, error helpers)
  routes/               TanStack Router file-based routes
  stores/               Zustand stores (auth)
  styles/               Tailwind + global stylesheets
  assets/               Icons + brand illustrations
  test/                 Global Vitest setup
```

## Critical Folders
- `src/features/transcription`: Only fully built feature today; contains API client (`api/transcription-api.ts`), data contracts (`data/types.ts`), and UI components for job tables, filters, and stats.
- `src/routes/_authenticated`: Houses nested routes like `/transcription`, `/services`, `/tasks`, each lazily loading feature entrypoints.
- `src/components/layout`: Sidebar/top-nav layout, navigation data, and team switcher components. Central place to update navigation links when adding new features.
- `src/lib`: `apiClient.ts` enforces environment base URL; `cookies.ts` wraps document cookies for Zustand store; `errorTracking.ts` ready for future observability hooks.
- `docs/`: Existing human-written runbooks (`CICD_SETUP.md`, `DEPLOYMENT.md`).

## Entry Points
- `src/main.tsx`: Bootstraps React root, sets up router and QueryClient provider (not shown above but present in root).
- `src/routes/__root.tsx`: Router root component with error boundaries.
- `src/routes/_authenticated/route.tsx`: Wraps all authenticated pages inside `AuthenticatedLayout`.

## Integration Paths
- Feature entry files (e.g., `src/features/transcription/index.tsx`) are imported by matching route files under `src/routes/_authenticated/...` enabling tree-shaken bundles.
- Shared component libraries used across features via `@/components/...` alias.

## Assets & Static Files
- `public/` holds static assets served by Vite (favicons, manifest).
- `src/assets/brand-icons` & `src/assets/custom` store vector assets for UI (used by cards, charts, etc.).
