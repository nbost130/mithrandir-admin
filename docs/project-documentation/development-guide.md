# Development Guide

## Prerequisites
- Node 20+
- npm (preferred package manager; `pnpm`/`yarn` are disabled)
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
| Lint | `npm run lint` or `npm run biome:lint` |
| Format | `npm run format` |
| Unit/UI tests | `npm run test`, `npm run test:ui`, `npm run test:coverage` |
| Dependency hygiene | `npm run knip` |
| File size budget check | `npm run check:size` |

## Project Conventions
- Use `@` alias for imports (`@/features/...`).
- Feature folders follow `api/`, `components/`, `data/`, `index.tsx` pattern.
- Keep new Zustand stores in `src/stores` and export typed hooks.
- Use TanStack Router `createFileRoute` to add pages; update `sidebar-data.ts` for navigation entry.
- All API calls must go through `apiClient` to enforce Unified API base URL and error handling.

## Testing Notes
- Vitest uses `jsdom` environment with global test utilities configured via `src/test/setup.ts`.
- Add component tests next to features using `*.test.tsx` for UI, `*.test.ts` for logic.
- For integration tests (planned), leverage Playwright or Cypress once configured.

## Observability & Errors
- `NavigationProgress` + toast notifications provide runtime feedback.
- Future logging hooks can go into `src/lib/errorTracking.ts`.

## GitHub Issues Workflow
- Issues drive roadmap; import latest issue data before major planning.
- Link issues in PR descriptions to maintain traceability.
