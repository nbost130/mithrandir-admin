# Biome Guide

Biome replaces ESLint + Prettier for linting, formatting, and code checks.

## Commands
| Purpose | Command |
| --- | --- |
| Lint (CI default) | `npm run biome:lint` (alias of `npm run lint`) |
| Format in-place | `npm run biome:format` |
| Full check (lint + format + fix) | `npm run biome:check` |

> Always run via **npm**—bun currently breaks Vitest/biome integration and CI workflows pin to npm as well.

## Warn-Level Rules
Configured in `biome.json`:
- `complexity.noExcessiveCognitiveComplexity` (warn when functions exceed complexity 15).
- `correctness.noUnusedVariables` / `noUnusedImports` to keep bundles lean.
- Accessibility rules: `useButtonType`, `useSemanticElements`, `noSvgWithoutTitle`.
- Suspicious code: `noArrayIndexKey`, `noExplicitAny`.
- Style guard: `noNonNullAssertion`.

These rules surface as warnings locally and in CI; fix or justify them before merging.

## Formatter Settings
- 2 spaces, width 120, single quotes, semicolons "as needed". Formatter runs automatically when you execute `npm run biome:format` or the combined `biome:check`.

## Tips
- Keep import/export order clean—Biome fixes unused imports but not reordering automatically, so prefer `import type { ... }` for types.
- Add folder exclusions in `biome.json` if you generate code (currently ignoring `.gen.ts`).
- Husky `prepare` hook ensures Biome is installed for commit hooks if you add them later.
