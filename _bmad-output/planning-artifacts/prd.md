---
stepsCompleted:
- step-01-init
- step-02-discovery
- step-03-success
- step-04-journeys
- step-06-innovation
- step-07-project-type
- step-08-scoping
- step-09-functional
- step-10-nonfunctional
- step-11-complete
inputDocuments:
- docs/project-documentation/api-contracts-admin-dashboard.md
- docs/project-documentation/architecture.md
- docs/project-documentation/biome-guide.md
- docs/project-documentation/component-inventory.md
- docs/project-documentation/contribution-guidelines.md
- docs/project-documentation/data-models-admin-dashboard.md
- docs/project-documentation/deployment-guide.md
- docs/project-documentation/development-guide.md
- docs/project-documentation/existing-docs.md
- docs/project-documentation/github-issues.md
- docs/project-documentation/index.md
- docs/project-documentation/project-overview.md
- docs/project-documentation/project-parts-metadata.md
- docs/project-documentation/project-structure.md
- docs/project-documentation/source-tree-analysis.md
- docs/project-documentation/technology-stack.md
- docs/project-documentation/testing-guide.md
- docs/CICD_SETUP.md
- docs/DEPLOYMENT.md
workflowType: prd
lastStep: 11
documentCounts:
  productBriefs: 0
  researchDocs: 0
  brainstormingDocs: 0
  projectDocs: 19
---

# Product Requirements Document - Mithrandir Admin

**Author:** Nathan
**Date:** 2026-01-02
## Executive Summary

Mithrandir Admin is evolving from a transcription-first view into the single command surface for the entire homelab. The next milestone is **reliability**—ensuring transcription stats, service health, and maintenance controls all reflect the live truth across Palantir, the Unified API, and every dashboard module. With rate-limit awareness, debounced polling, and alerts when data goes stale, you’ll finally trust the dashboard to show what’s actually happening and kick off fixes fast. Because every new service registers through the Unified API and surfaces here immediately, this becomes the “one stop shop” you always wanted.

### What Makes This Special

- **Reliability-first UX**: Accurate, fresh telemetry with resilience features (debounced polling, error handling, rate-limit and stale-data awareness) so transcription metrics never drift.
- **End-to-end visibility**: Transcription KPIs, service health, and one-click maintenance tools live side-by-side, tuned for a single homelab admin.
- **AI-native workflow**: Built hand-in-hand with Claude/Codex/Antigravity tooling, so insights from GitHub issues and runtime signals convert quickly into fixes.

## Project Classification

**Technical Type:** web_app  
**Domain:** general (homelab administration)  
**Complexity:** medium – web dashboard orchestrating Unified API, Palantir, and future modules  
**Project Context:** Brownfield – extending existing system

- **Signals:** React/Vite dashboard with service modules; GitHub issues identify reliability gaps and UX polish needs.
- **Primary goals:** Make transcription metrics and service health data trustworthy; surface maintenance tasks wherever new services appear.
- **Constraints:** Runs behind Tailscale (no external auth), integrates multiple backend services via the Unified API, developed via AI-assisted “vibe coding.”
## Success Criteria

### User Success
- **Always-trustworthy telemetry:** The dashboard must match Palantir + Unified API counts 1:1. Any variance triggers a “data integrity alert” that explains the culprit (e.g., API failure, queue mismatch) and suggests the right maintenance action.
- **No-CLI maintenance:** Routine ops stay in the UI—retry jobs, purge queues, restart transcription/unified API/dashboard services—with clear success/failure states and health re-checks.
- **Centralized issue triage:** The dashboard aggregates GitHub issues across your /dev repos and lets you launch the admin AI team straight from the issue, automatically attaching the latest logs/metrics.

### Business Success
- **Single source of truth:** You can administer the entire Mithrandir homelab from this dashboard. If something breaks, you discover it and fix it here—no SSH unless there’s true infrastructure failure.
- **AI-assisted remediation loop:** Reliability incidents flow from dashboard alerts → GitHub issues → AI dev team with full context, so you “close the loop” without leaving the app.

### Technical Success
- **Zero silent mismatches:** Every data discrepancy is detected/logged with timestamps and remediation hints; repairs prove the numbers realign afterward.
- **Diagnosable incidents:** Each screen surfaces recent logs, queue stats, and service health so you can pinpoint root cause in minutes (homelab-grade MTTR).
- **One-click maintenance durability:** UI actions succeed end-to-end and write an audit trail (what ran, when, and outcome) so you trust the tooling.

### Measurable Outcomes
- 0 undetected transcription mismatches (all discrepancies raise alerts with context).
- 100% of core maintenance tasks executable in-dashboard, with success confirmations.
- Every issue card can launch the admin AI dev team with embedded telemetry.
- Post-incident verification shows data realignment (no lingering divergences).

## Product Scope

### MVP – Minimum Viable Product
- Reliability dashboard with data-integrity alerts and discrepancy logging.
- Maintenance controls (retry job, purge queue, restart services) + success/failure health checks.
- GitHub issue feed inside the dashboard with “launch admin dev team” action that attaches context.
- Basic audit log for every maintenance action and discrepancy alert.

### Growth Features (Post-MVP)
- Cross-repo issue consolidation with filtering and AI-suggested remediations.
- Health timeline + SLA tracking for transcription and services.
- Auto-attachments (logs/metrics) when filing new issues from the dashboard.
- Config/secret refresh workflows and env diff checks.

### Vision (Future)
- Full homelab ops copilot: every new service registers, gains telemetry, and wires into the AI remediation loop automatically.
- AI-driven reliability assistant that spots patterns, opens issues, and proposes fixes proactively.
## User Journeys

### Journey 1: Nathan monitors reliability
1. **Trigger:** Daily admin check-in or alert notification.
2. **Steps:**
   - Open dashboard home.
   - Review transcription KPIs + discrepancy banner.
   - If discrepancy exists, drill into job details to see root cause and suggested maintenance action.
   - Execute the recommended maintenance (retry job, purge queue, restart service).
   - Verify metrics realign and log the incident via GitHub issue link.
3. **System Responses:**
   - Displays real-time metrics sourced from Unified API + Palantir.
   - Highlights any data mismatches with diagnostics.
   - Provides one-click maintenance controls and confirms success.
   - Logs actions + links to GitHub issue feed.
4. **Success Signals:** Nathan sees accurate numbers, resolves issues without SSH, and confidence is restored.

### Journey 2: AI Dev Team handles issue analysis
1. **Trigger:** Nathan or system opens a GitHub issue from the dashboard, requesting analysis.
2. **Steps:**
   - Dashboard surfaces issue card with embedded telemetry.
   - Nathan clicks “Launch Admin Dev Team.”
   - AI Dev Team receives the issue context (logs, metrics, service health snapshots).
   - Team analyzes root cause, proposes fix, and updates GitHub issue.
3. **System Responses:**
   - Issue card collects telemetry and passes it to AI workflow.
   - Maintains a log of AI actions/updates.
4. **Success Signals:** AI dev team diagnoses the problem quickly, GitHub issue is updated/resolved without manual copy/paste.

### Journey 3: AI Dev Team executes maintenance
1. **Trigger:** Nathan or system requests a remediation run (e.g., restart transcription worker).
2. **Steps:**
   - Dashboard sends specific maintenance command to AI dev workflow.
   - AI team executes script (restart, purge queue, config refresh).
   - Dashboard receives status + health check confirmation.
   - Issue/alert automatically updates with resolution details.
3. **System Responses:**
   - Orchestrates maintenance command with proper logging/authed channel.
   - Verifies service health post-action.
4. **Success Signals:** Maintenance tasks succeed end-to-end, status clears, and Nathan sees confirmation + audit entry.
## Innovation & Novel Patterns

### Detected Innovation Areas
- **AI-assisted ops console:** Reliability issues flow directly from dashboard alerts to GitHub issues and trigger the admin AI dev team with embedded telemetry—turning the dashboard into an Ops copilot, not just a read-only panel.
- **Unified “issue-to-remediation” loop:** Every discrepancy can auto-generate issues, attach context, and kick off remediation scripts, so homelab administration behaves like a lightweight SRE workflow.
- **Service onboarding pipeline:** Any new homelab service registered in the Unified API is auto-discovered, gains telemetry, and exposes maintenance controls without extra wiring.

### Market Context & Competitive Landscape
- Traditional homelab dashboards (e.g., Grafana, Heimdall) focus on metrics or launchers but rarely orchestrate remediation workflows.
- Enterprise SRE tools (PagerDuty, Opsgenie) offer DI → alert → runbook loops but are overkill for single-operator homelabs.
- Mithrandir Admin bridges the gap: reliability telemetry + issue triage + AI-triggered remediation, tuned for a single-owner environment.

### Validation Approach
- Pilot features by attaching telemetry + AI launch buttons to the transcription dashboard first (highest pain point).
- Measure success by reduction in manual SSH interventions and time-to-fix logs stored in GitHub issues.
- Dogfood with real incidents: whenever a discrepancy alert fires, use the dashboard path to resolve it and inspect usability gaps.

### Risk Mitigation
- **AI workflow failures:** Always provide manual fallback buttons (retry job, restart service) so Nathan isn’t blocked if an AI workflow stalls.
- **Telemetry drift:** Maintain audit trails for each discrepancy and maintenance action to ensure we can verify AI/automation decisions.
- **Service onboarding errors:** Require basic validation (health endpoints responding) before auto-adding new services to the dashboard.
## Project-Type Requirements (Web App)

### Architecture & Browser Support
- SPA built with React 19 + TanStack Router, delivered via Vite. Runs inside Tailscale, so modern Chromium/Firefox are the primary targets; Safari is “best effort.”
- Desktop-first layout (sidebars, data tables). The UI remains responsive thanks to shadcn + Tailwind, but mobile/tablet validation is a stretch goal rather than MVP.

### Real-Time & Performance Targets
- Polling-based real-time updates must stay within rate-limit budgets (Unified API + Palantir). Target: steady 5s refresh bursts without hitting 429/500 errors.
- Lighthouse-style performance targets: <1s interactive load on homelab network, smooth UI for 1,000+ jobs.

### Accessibility Expectations
- Practical keyboard navigation: all maintenance actions must be reachable via keyboard and provide focus-visible states.
- Screen-reader hints for discrepancy alerts and maintenance buttons. Full WCAG AA compliance is not required (single-user private app), but usability for “future Nathan” is critical.

### SEO Strategy
- None required. This is a Tailscale-only homelab dashboard with no public indexing.

### Additional Web-Specific Notes
- Ensure fallback messaging when data is stale or rate-limited so the UX remains trustworthy.
- Continue to lean on TanStack’s responsive components for tablet/mobile users, but ship desktop polish first.
## Scope & Release Boundaries

### Baseline (already shipping)
- Mithrandir Admin dashboard (React SPA) with transcription job table, service tiles, and maintenance controls (retry/delete).
- Unified API telemetry feed with 5s polling; version 1 discrepancy handling done ad hoc via CLI.
- Deployment + CI/CD pipeline (GitHub Actions → Tailscale → systemd) with reliability docs.

### Reliability Increment (current scope)
- Data-integrity alerts and discrepancy logging (Unified API ↔ Palantir cross-checks).
- In-dashboard maintenance actions: retry job, purge queue, restart transcription/unified API/dashboard services, with success confirmation and audit trail.
- GitHub issue feed + “launch admin AI dev team” action that passes telemetry context.
- Stale/rate-limit messaging, so the UX explains why data might be wrong.

### Growth & Vision
- Cross-repo issue consolidation with filtering, auto-attachments, and AI-suggested remediation steps.
- Health timeline/SLA tracking for transcription and services.
- Auto-onboarding pipeline for new services registered in Unified API.
- AI-driven reliability assistant that notices patterns and opens issues proactively.
## Functional Requirements

### Reliability Telemetry
1. **Transcription State View** – Dashboard shows Palantir + Unified API job stats (counts, status breakdowns, last updated). Any mismatch triggers a discrepancy banner with diagnostics.
2. **Service Health Matrix** – Tiles/cards for transcription worker, unified API, dashboard, and other registered services showing uptime, status, last check, and quick links to logs.
3. **Stale/Ratelimit Messaging** – If data can’t be refreshed (429/500, network failure), the UI explains the reason and offers retry/snooze.

### Maintenance & Controls
4. **Job Operations** – Retry and delete jobs directly from the table, with confirmation modals and audit logging.
5. **Queue Hygiene** – Purge stuck queues or clear old jobs from the UI with status feedback.
6. **Service Restarts** – Restart transcription worker, unified API, and the dashboard process itself; surface success/failure + post-action health check.
7. **Audit Trail** – Log every maintenance action (who/what/when/outcome) so reliability decisions are traceable.

### Issue & Delegation Hub
8. **GitHub Issue Feed** – In-dashboard list of open issues (all /dev repos), filterable and searchable.
9. **Issue Detail & Telemetry Attachments** – Each issue view shows logs/metrics relevant to that issue (recent discrepancy data, service statuses, job history).
10. **Issue-to-AI Delegation** – “Launch admin dev team” button per issue that packages telemetry and kicks off the AI workflow; show current status (e.g., analyzing, resolving, done).
11. **AI Response Tracking** – Board showing in-progress AI actions, with the ability to drill into updates and mark the issue as resolved when done.

### AI-Assisted Remediation
12. **Command Execution Layer** – Dashboard sends remediation commands (restart, purge, apply config patch) to AI workflows and receives structured results.
13. **Health Verification** – After AI action completes, dashboard automatically re-checks telemetry to confirm the health improved; highlight if further steps are needed.
14. **Fallback Path** – Manual buttons remain available even if AI workflow fails or is offline.

### Service Onboarding
15. **Auto-Discovery** – When a new service registers in the Unified API, the dashboard picks it up, adds a tile with default telemetry, and prompts for custom actions if needed.
16. **Validation Gate** – New services must pass a basic health endpoint check before they appear on the dashboard; errors produce a warning so misconfigured services are obvious.

### Future Modules & Growth
17. **Delegation Enhancements** – Ability to assign prioritization to AI dev tasks, track SLAs, and push updates back into GitHub automatically.
18. **n8n Workflow Control** – Monitor and control n8n automations (start/stop workflows, view recent runs, see failures) so automation tasks live alongside transcription monitoring.
19. **Cross-Project Ops View** – Aggregated feed for reliability incidents across all homelab services, with quick links to each system’s service tiles and AI playbooks.
## Non-Functional Requirements

### Performance & Responsiveness
- Dashboard loads interactive UI in ≤1s on homelab network; subsequent route changes under 300 ms.
- Polling cadence default 5 s; system must throttle gracefully to avoid Unified API rate limits.
- Tables and cards handle 1,000+ jobs without noticeable lag (<16 ms frame budget).

### Reliability & Accuracy
- Zero silent discrepancies: any mismatch between dashboard data and Palantir/Unified API is detected, logged, and surfaced within one polling cycle.
- Maintenance actions must either succeed or report failure with remediation guidance—no silent failures.

### Availability & Security
- Accessible only via Tailscale; requests from non-Tailscale networks must be rejected.
- Environment variables, secrets, and service tokens remain local; dashboard should warn if expected env vars are missing.

### Observability & Logging
- All maintenance actions, discrepancy detections, and AI delegation events are logged with timestamps and payload references for future audits.
- Logs must include enough context to reproduce incidents (job IDs, service names, API responses).

### Operability & Maintainability
- After any automated action (AI workflow or manual command), system re-checks health and records “before/after” snapshots.
- Configurable feature flags so new modules (e.g., n8n control) can roll out gradually without code redeploy.

### Accessibility & UX Safeguards
- Keyboard navigation for every control; focus-visible states and ARIA labels for discrepancy alerts.
- Graceful messaging whenever data is stale or unavailable (no “blank” screens or silent failures).
