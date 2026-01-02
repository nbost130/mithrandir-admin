# Contribution & Workflow Guidelines

## Branch & Commit
- Default branch: `main` (auto-deploys on merge).
- Use conventional commits (`feat:`, `fix:`, `docs:`) to unlock semantic changelog + CI filters.
- Keep PRs scoped to a feature/bug; include screenshots for UI tweaks.

## Code Style
- Run `npm run lint` and `npm run format` before pushing.
- Prefer functional, typed React components; avoid default exports for feature modules.
- Use shadcn UI primitives + Tailwind utility classes to maintain styling consistency.

## Testing Expectations
- Add Vitest unit tests for new stores, hooks, and helpers.
- Snapshot or interaction tests for complex UI states using Testing Library.
- For API integrations, mock axios with MSW or jest mocks to avoid live calls.

## Documentation Flow
- Update `docs/project-documentation/` when introducing new APIs, data models, or architectural decisions.
- Mirror key GitHub Issues (open/closed) by exporting them into this docs folder so offline agents keep context.
- Extend README sections (features, roadmap) when a module graduates from placeholder to production-ready.

## Security & Config
- Never commit secrets. `.env` belongs to developer machines only.
- All network calls must point to the Unified API (8080). If you need a new backend endpoint, add it there instead of bypassing the gateway.

## Review Checklist
1. Lint + tests pass locally.
2. Feature toggles or env flags documented.
3. Deployment guide updated if new infra steps are required.
4. GitHub Issue linked in PR description for traceability.
