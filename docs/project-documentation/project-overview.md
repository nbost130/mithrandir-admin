# Project Overview

## Mission
Mithrandir Admin is the single-pane dashboard for the Mithrandir homelab. Phase 1 focuses on Palantir transcription monitoring—surfacing job queues, retries, deletes, and SLA health—while the roadmap includes delegation management, n8n workflow control, system metrics, and service toggles.

## Operating Context
- **Environment:** Self-hosted server (`100.77.230.53`), exposed via Tailscale.
- **API Gateway:** All data flows through the Mithrandir Unified API (port 8080). Direct calls to backend services (e.g., 9003) are prohibited.
- **Authentication:** Currently trusts network-level security. Future enhancements should revisit token handling in `apiClient` and `useAuthStore`.
- **Deployment:** GitHub Actions → Tailscale → SSH → systemd service (`mithrandir-admin`). Docs in `docs/CICD_SETUP.md` + `docs/DEPLOYMENT.md` capture the runbooks.

## Current Capabilities
- Live transcription job table with filtering, retry, delete, and priority adjustments.
- Auto-refresh cadence (5s) to keep job statuses current.
- Shadcn-based UI shell (sidebar layout, command palette via `cmdk`, toasts via `sonner`).
- Shared layout with authenticated routes using TanStack Router.

## Roadmap & Risk Notes
- Roadmap items (delegation, n8n, monitoring) live in README + GitHub Issues. Import open/closed issues into this folder before feature planning to capture tribal knowledge.
- Unified API contract is authoritative; verify `/info` endpoint before new integration work.
- Dashboard currently assumes a single Palantir backend. Scaling to multiple services will require schema changes in `TranscriptionJob` and new API surfaces.
