# Component Inventory

| Category | Component | Location | Purpose |
| --- | --- | --- | --- |
| Layout | `AuthenticatedLayout` | `src/components/layout/authenticated-layout.tsx` | Wraps authenticated routes with sidebar + top nav + outlet. |
| Layout | `AppSidebar`, `TopNav`, `TeamSwitcher` | `src/components/layout/*` | Provide navigation tree, org context, and responsive shell. |
| Feedback | `NavigationProgress` | `src/components/navigation-progress.tsx` | Shows top loading bar tied to TanStack Router progress events. |
| UI Kit | `components/ui/*` | `src/components/ui` | shadcn/ui wrappers for buttons, dialogs, dropdowns, etc. |
| Data Table | `DataTable` helpers | `src/components/data-table` | Column definitions, view toggles, and pagination scaffolding for TanStack Table. |
| Feature | `features/transcription/components/*` | `src/features/transcription/components` | Cards, status badges, toolbar, and detail panels for transcription jobs. |
| Errors | `GeneralError`, `NotFoundError` | `src/features/errors` | Bound to router’s `errorComponent` and `notFoundComponent`. |
| Auth | `features/auth/*` | `src/features/auth` | Clerk/TanStack router integration (login/register flows). |
| Settings | `features/settings` | Contains placeholder cards for user/org preferences; ready for wiring to API. |
| Dashboard Widgets | `features/dashboard/components` | Stats cards, charts scaffolding (uses Recharts + custom skeletons). |

## Notes
- Components follow `index.tsx` entry pattern, enabling lazy imports from routes.
- Keep new UI primitives inside `components/ui` to maintain design consistency.
- When adding new nav items, update `src/components/layout/data/sidebar-data.ts` and ensure matching route + feature exist.
