# Development Guide

## Prerequisites
- Node 20+
- **npm only** (pnpm/yarn disabled and bun currently breaks Vitest + Biome). GitHub Actions also uses npm for install/test.
- Access to Mithrandir Unified API over LAN/Tailscale (port 8080)

## Environment Setup
1. Copy `.env.example` → `.env` and set:
   ```bash
   VITE_APP_TITLE="Mithrandir Admin"
   VITE_API_BASE_URL=http://100.77.230.53:8080
   VITE_TRANSCRIPTION_API=http://100.77.230.53:8080/transcription
   VITE_UNIFIED_API=http://100.77.230.53:8080
   VITE_ALLOWED_HOSTS=dashboard.shire,admin.shire,mithrandir-admin.shire,localhost,100.77.230.53
   ```
2. `npm install`
3. `npm run dev` → http://localhost:5173 (default Vite port)

## Common Commands
| Task | Command |
| --- | --- |
| Start dev server | `npm run dev` |
| Build production bundle | `npm run build` |
| Preview prod build | `npm run preview` |
| Lint (Biome) | `npm run lint` / `npm run biome:lint` |
| Auto-fix + format | `npm run biome:format` |
| Full check (lint + format + autofix) | `npm run biome:check` |
| Unit/UI tests (Vitest) | `npm run test`, `npm run test:ui` |
| Coverage run | `npm run test:coverage` |
| Dependency hygiene | `npm run knip` |
| File size budget check | `npm run check:size` |

## Project Conventions
- Use `@` alias for imports (`@/features/...`).
- Feature folders follow `api/`, `components/`, `data/`, `index.tsx` pattern.
- Keep new Zustand stores in `src/stores` and export typed hooks.
- Use TanStack Router `createFileRoute` to add pages; update `sidebar-data.ts` for navigation entry.
- All API calls must go through `apiClient` to enforce Unified API base URL and error handling.
- Biome replaces ESLint/Prettier; see [Biome Guide](./biome-guide.md) for rule details and scripts.

## Testing Notes
- Vitest uses `jsdom` with `src/test/setup.ts` for Testing Library globals. Always run via `npm run test*` (bun is unsupported).
- Place component tests next to the feature (`Component.test.tsx`) and keep integration fixtures under `src/test`.
- Use `npm run test:coverage` before PRs touching core screens to ensure thresholds stay healthy. See [Testing Guide](./testing-guide.md) for patterns.

## Observability & Errors
- `NavigationProgress` + toast notifications provide runtime feedback.
- Future logging hooks can go into `src/lib/errorTracking.ts`.

## GitHub Issues Workflow
- Issues drive roadmap; import latest issue data before major planning.
- Link issues in PR descriptions to maintain traceability.
