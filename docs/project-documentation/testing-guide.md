# Testing Guide

## Stack
- **Runner:** Vitest (`vitest.config.ts` merges Vite config, uses jsdom environment).
- **Helpers:** Testing Library (`@testing-library/react`, `@testing-library/user-event`) wired up via `src/test/setup.ts`.
- **Mocks:** Use Vitest mocks (`vi.mock`) for modules; prefer MSW if we need HTTP interception later.

## Commands
| Scenario | Command |
| --- | --- |
| Watch mode | `npm run test` |
| UI runner | `npm run test:ui` |
| Coverage report | `npm run test:coverage` |

> Run **npm** scripts instead of bun—bun has an open issue with Vitest worker pools.

## Patterns
- Place tests next to the implementation (`component.test.tsx`, `hook.test.ts`).
- Use Testing Library queries (`getByRole`, `findByText`) and avoid DOM class assertions.
- For TanStack Query hooks, wrap in `QueryClientProvider` from `src/test/utils`.
- Mock Unified API calls via `vi.mock('@/lib/apiClient')` or provide fake queryFn data.
- Snapshot only when rendering simple presentational components; prefer explicit assertions for stateful components.

## Coverage Expectations
- Use `npm run test:coverage` before PRs that touch routing, feature APIs, or shared components.
- Keep `lines`/`functions` above 80% for affected files.
- Coverage report lives under `coverage/` and is already gitignored.

## Future Work
- Add MSW or Playwright integration tests per roadmap; track status in GitHub Issues.
