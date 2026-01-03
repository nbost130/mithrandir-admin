# Technology Stack

| Layer | Technology | Version | Notes |
| --- | --- | --- | --- |
| Framework | React 19 | ^19.2.0 | Functional components with hooks; suspense-ready. |
| Build Tool | Vite 7 + React SWC plugin | ^7.1.11 | Configured with TanStack Router plugin and Tailwind integration (`vite.config.ts`). |
| Styling | Tailwind CSS 4 + custom CSS modules | ^4.1.14 | Uses `@tailwindcss/vite` for zero-config pipeline. |
| UI System | shadcn/ui (Radix-based) | latest | Components live under `src/components/ui` with wrappers for forms, dialogs, etc. |
| State Mgmt | TanStack Query 5 + Zustand | ^5.90.2 / ^5.0.8 | Query for server cache, Zustand (`useAuthStore`) for auth cookie + token state. |
| Routing | TanStack Router 1.x | ^1.132.x | File-based routes under `src/routes`, with nested authenticated segments. |
| HTTP Client | Axios | ^1.12.2 | Centralized in `src/lib/apiClient.ts`, enforces Unified API base URL and 10s timeout. |
| Testing | Vitest + Testing Library + jsdom | ^4.0.16 | Configured in `vitest.config.ts`, setup file `src/test/setup.ts`. |
| Forms/Validation | React Hook Form + Zod | ^7.64.0 / ^4.1.12 | Typical usage inside feature screens for filter forms. |
| Charts & Tables | Recharts / TanStack Table | ^3.2.1 / ^8.21.3 | Data visualization + data grid support for dashboards. |
| Icons | lucide-react | ^0.545.0 | Light-weight icon set for nav + status. |
| Notifications | sonner | ^2.0.7 | Toasts for job success/error states. |
| Package Manager | npm (local + CI) | 10.x | Use `npm` for everything (bun has an open Vitest issue and workflows pin to npm as well). |
| Tooling | Biome 2 + Knip | ^2.3.10 | Biome handles lint + format (`npm run biome:*`). Warn rules enforce a11y + unused imports (see biome guide). |
| CI/CD | GitHub Actions + Tailscale + systemd | N/A | Workflows located in `.github/workflows/ci.yml` and `deploy.yml`. |

## External Services
- **Mithrandir Unified API:** Gateway aggregator for dashboard stats (`/api/dashboard/*`), transcription (`/transcription/*`), SSH status, and service health endpoints.
- **Palantir transcription backend:** Reached via Unified API; all `/transcription` routes proxy to Palantir service on 9003.
- **Tailscale:** Provides secure network path for CI deployments and manual SSH.

## Configuration Artifacts
- `.env` (local) defines `VITE_API_BASE_URL`, `VITE_TRANSCRIPTION_API`, `VITE_UNIFIED_API`, `VITE_ALLOWED_HOSTS`.
- `vite.config.ts` whitelists allowed hosts for preview and sets alias `@ -> ./src`.
- `tsconfig*.json` enable strict TypeScript across app + build pipeline.
