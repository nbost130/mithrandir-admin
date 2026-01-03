---
project_name: mithrandir-admin
user_name: Nathan
date: 2026-01-03T02:36:00Z
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - quality_rules
  - workflow_rules
  - anti_patterns
status: complete
rule_count: 32
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- React 19.2.x + React DOM 19.2.x, bundled with Vite 7.1.11 (`@vitejs/plugin-react-swc`)
- TypeScript 5.9.x (strict) with path aliases from `tsconfig.json` / `vite.config.ts`
- TanStack Router 1.132.x + TanStack Query 5.90.2, paired with Zustand 5.0.8 (auth + flags only)
- Tailwind CSS 4.1.14 + shadcn/ui (Radix) components; lucide-react icons
- axios 1.12.x via `src/lib/apiClient.ts`, Zod 4.1.12 schemas, date-fns 4.1.0 utilities
- Vitest 4.0.16 + Testing Library + jsdom; Biome 2.3.10 + Knip 5.64.x for lint/format/dead-code
- Unified API exposes `/reconciliation/*`, `/commands/run`, `/services/*`; reconciliation log currently SQLite 3.43.x with SSE streams

## Critical Implementation Rules

### Language-Specific Rules

- Respect TypeScript strictness: declare discriminated unions for statuses (`'verified' | 'stale' | …`) and never fall back to `any`.
- Use `@/` alias imports instead of deep relative paths; keep cross-feature imports limited to shared libs/components.
- Always normalize axios errors through `apiClient` interceptors so downstream UI receives `{code,message,remediation,traceId}`.
- Mutate TanStack Query cache using updater functions (`queryClient.setQueryData`)—never mutate arrays/objects in place.

### Framework-Specific Rules

- All data fetching flows through `useReliableQuery` (TO BE CREATED); SSE updates must route through `useReconciliationStream` (TO BE CREATED) with Zod validation before cache writes.
- Zustand stores only auth tokens/flags; existing stores live in `src/stores/`, new stores should also go there. Do not duplicate state management patterns.
- Feature components live under `src/features/<feature>/{api,components,data,hooks,tests}`. Shared UI sits in `src/components/ui` or `src/components/reliability`. Existing contexts in `src/context/` should continue to be used.
- Command execution must reuse `src/lib/command-bus.ts` (TO BE CREATED) and `useCommandBus` hook; never call Unified API command endpoints directly from components.

### Testing Rules

- Co-locate Vitest specs as `*.test.ts[x]` next to their source files; integration tests use Testing Library + jsdom.
- Mock HTTP via `vi.spyOn(apiClient, 'get'|'post')` or MSW; do not hit live Unified API in unit tests.
- When adding new payload shapes, define Zod schemas in `data/` and reuse them in both runtime guards and test fixtures.
- CI parity: `npm run biome:check` + `npm run test` must pass locally before PRs; coverage runs via `npm run test:coverage` when requested.

### Code Quality & Style Rules

- Run Biome format/lint commands (`npm run biome:check`) and Knip before committing; repo enforces these in CI.
- Naming: snake_case for database/audit columns; camelCase for JSON and SSE; kebab-case for directories; PascalCase/`useX` for components/hooks.
- Update `docs/project-documentation/*` and `_bmad-output` planning docs when adding endpoints, SSE fields, or feature directories; include field mapping tables.
- All HTTP access goes through `src/lib/apiClient.ts`; no raw `fetch`/new axios instances anywhere else.

### Development Workflow Rules

- `.env.local` must point to Tailscale-only Unified API hosts; use `src/lib/feature-flags.ts` to gate experimental modules (e.g., automations).
- Refresh GitHub issue snapshots via `python3 scripts/update_github_issues_snapshot.py` whenever kicking off planning workflows or after major backlog churn.
- Follow the implementation sequence from `_bmad-output/planning-artifacts/architecture.md`; do not add new modules without updating that document.
- Deploy exclusively through GitHub Actions (`ci.yml`, `deploy.yml`); ensure reconciler schema migrations run before restarting Unified API services.

### Critical Don't-Miss Rules

- Never bypass the reconciliation module: telemetry must come from `/reconciliation/*` + SSE; do not infer “verified/stale” client-side.
- Do not store reliability/service data in Zustand or local state when it needs to reflect SSE updates—always persist in TanStack Query caches.
- Wait for `command.status` SSE payloads before marking maintenance actions complete; optimistic UI updates are forbidden for reliability cards.
- When extending SSE payloads or audit logs, add snake_case fields in SQLite, camelCase DTOs in `data/types.ts`, and document the mapping.
- Reliability status colors are fixed (verified→emerald, stale→amber, investigating→sky, error→rose) using shadcn tokens; do not introduce ad-hoc palettes.

### Git Workflow Rules

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. Scope encouraged (e.g., `feat(reliability): add stream hook`).
- Branch names: `feature/epic-N-short-description` for epics, `fix/issue-N-description` for bugs, `chore/description` for maintenance.
- All PRs run CI (Biome, Vitest, build). Gemini AI performs automated code review. Human approval required for architecture changes.
- Feature flags: `VITE_FF_<FEATURE_NAME>` in `.env`, accessed via `src/lib/feature-flags.ts`.
- Run `python3 scripts/update_github_issues_snapshot.py` before planning workflows or after major backlog changes.
- OpenAPI types: Run `npm run generate:types` after Palantir API changes; add `npm run generate:types:reconciler` for reconciliation types.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any story.
- Follow every rule exactly; when unsure, choose the more restrictive option.
- Update this file (and architecture docs) if you introduce new patterns.

**For Humans:**

- Keep the file lean—only include rules agents might forget.
- Update after stack/version changes or new reliability patterns.
- Review quarterly to prune obvious rules and add new edge cases.

Last Updated: 2026-01-03T02:36:00Z
