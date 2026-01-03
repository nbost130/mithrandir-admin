---
stepsCompleted:
- step-01-init
- step-02-discovery
- step-03-core-experience
- step-04-emotional-response
- step-05-inspiration
- step-06-design-system
- step-07-defining-experience
- step-08-visual-foundation
- step-09-design-directions
- step-10-user-journeys
- step-11-component-strategy
- step-12-ux-patterns
- step-13-responsive-accessibility
- step-14-complete
inputDocuments:
- _bmad-output/planning-artifacts/prd.md
- docs/project-documentation/architecture.md
- docs/project-documentation/technology-stack.md
- docs/project-documentation/component-inventory.md
- docs/project-documentation/development-guide.md
- docs/project-documentation/deployment-guide.md
- docs/project-documentation/github-issues.md
- docs/project-documentation/index.md
- docs/project-documentation/source-tree-analysis.md
- docs/project-documentation/project-overview.md
- docs/CICD_SETUP.md
- docs/DEPLOYMENT.md
workflowType: ux-design
lastStep: 14
documentCounts:
  prd_docs: 1
  productBriefs: 0
  otherDocs: 11
---

# UX Design Specification - Mithrandir Admin

**Author:** Nathan
**Date:** 2026-01-02
## Project Understanding

### What We're Building
Mithrandir Admin is the reliability control surface for the Mithrandir homelab: a React/Vite dashboard that keeps transcription telemetry, service health, and maintenance controls in one place so the owner (you) can trust the numbers and fix issues without leaving the UI.

### Target Users
- **Primary Admin (Nathan):** Desktop-first, homelab power user who wants accurate telemetry and one-click remediation instead of manual SSH.
- **AI Dev Team Helpers:** Agents you delegate to for issue analysis and scripted fixes; they need clear context and feedback loops.

### What Makes It Special
- Reliability-first UX—every data point proves it matches Palantir + Unified API, or the dashboard explains why not.
- In-dashboard issue-to-remediation loop: detect discrepancy → view logs → launch AI dev workflow → confirm fix.
- Auto-onboarding of new services via Unified API, so the dashboard evolves as the homelab grows.

### Design Challenges
1. Conveying data trust: show live status vs. stale/uncertain states without overwhelming the user.
2. Surfacing deep operational context (logs, queue metrics, service health) in a digestible way.
3. Making AI delegation transparent—show what the AI is doing, what stage it’s in, and the outcome.

### Design Opportunities
- Timeline or alert ribbons that emphasize when and why the dashboard trusts (or distrusts) its data.
- Issue cards that bundle telemetry + “launch AI dev team” buttons so troubleshooting feels like a guided experience.
- Dashboard tiles that auto-appear when new services register, prompting you to configure maintenance tasks.
### Core Experience
- **Primary loop:** Scan dashboards to verify transcription health, service status, and issue queue at a glance. The first screens must immediately confirm “is everything accurate?”
- **Effortless interactions:** Discrepancy banners, maintenance controls, and AI delegation buttons should feel one-click and self-explanatory. The UI should telegraph what’s healthy vs. needs attention without extra digging.
- **Platform context:** Desktop web (mouse/keyboard) is the main target. The existing responsive framework covers basic mobile use, but polish and layout decisions prioritize widescreen workflows.
- **Polish expectation:** Even though this is a homelab tool, it should feel like a professional ops console—clean typography, consistent spacing, obvious icons/states.
### Emotional Response Goals
- **Initial state:** Calm confidence. When the dashboard opens and everything is normal, it should feel like a steady control tower—no noise, just quiet assurance that systems are healthy.
- **During incidents:** Stay in control. Alerts should be clear without being alarming, guiding you through diagnosis and action so you never feel overwhelmed.
- **After resolving:** Satisfaction. Post-action confirmations should celebrate that you’ve brought the system back into alignment.
- **Return visits:** Ongoing trust. Each time you come back, the UI should reinforce that Mithrandir Admin is reliable and ready.
## UX Pattern Analysis & Inspiration

### Inspiring Products
- **shadcn/ui demo dashboards:** clean component library with great spacing, predictable motion, and consistent color tokens. Cards feel calm yet informative—exactly the vibe Mithrandir Admin needs.
- **TanStack Router/Query devtools (internal inspiration):** the inspector panels are dense but still legible; they prove we can show advanced state without overwhelming users.

### Transferable Patterns
- Card-based layouts with bold headers + subtle status indicators so telemetry is glanceable.
- Skeleton/loading states that keep the UI feeling alive even when data is refreshing.
- Layered panels/drawers for deep context (logs, job details) without forcing a full page switch.

### Anti-Patterns to Avoid
- Overly glossy widgets or gradients that distract from data fidelity.
- Collapsing everything behind accordions—admins need at-a-glance visibility.
- Hidden icons or ambiguous colors that could make alerts feel like noise.

### Inspiration Strategy
- Adopt shadcn’s spacing, typography, and subtle border treatments for a polished ops console.
- Adapt TanStack-style inspector panels for issue detail drawers and AI delegation status.
- Avoid novelty controls; stick to familiar buttons, switches, tabs that keep confidence high.
## Design System Foundation

### Design System Choice
- **shadcn/ui + Tailwind (themeable system):** Keep the existing template as the foundation. It already ships with Radix primitives, strong accessibility defaults, and matches the “calm ops console” aesthetic.

### Rationale for Selection
- Proven components we already run in production; no time lost rebuilding basics.
- Easy to customize tokens (colors, spacing, typography) to emphasize reliability cues.
- Radix-based interactions give us keyboard support and predictable focus management out of the box.

### Implementation Approach
- Continue using the current shadcn component library + Tailwind tokens; centralize design tokens (colors, spacing, shadows) in one config.
- Layer brand-specific states (discrepancy alerts, AI status chips) as reusable components.
- Document component usage patterns in this UX spec so dev + AI agents follow the same playbook.

### Customization Strategy
- Keep structural elements (sidebar, cards, tables) from the template, but add reliability-specific states (verified, stale, investigating) using consistent color roles.
- Introduce a minimal icon set + motion guidelines for alert banners and issue drawers.
- Plan incremental theming passes rather than a big redesign—each new module inherits the same tokens.
## Core User Experience

### Defining Experience
- “Open the dashboard, immediately trust what it shows, and act on anything that’s off.” That single loop—scan, detect discrepancy, kick off maintenance—is the defining interaction.

### User Mental Model
- Today you SSH or run scripts to verify transcription/state; Mithrandir Admin should feel like the same truth surface without the CLI.
- The expectation: if the dashboard says something is wrong, it really is wrong; no second guessing with scripts.

### Success Criteria
- Counts on the dashboard match Palantir/Unified API (or the UI explains why not).
- Maintenance actions (retry, purge, restart) confirm success and your issue backlog reflects the fix.
- You spend less time hopping between CLI/logs and more time staying in the dashboard.

### Patterns & Novelty
- Core loop is familiar (scan dashboards, fix red tiles) but the AI delegation layer is novel—make it intuitive with clear status chips and logs.
- Use established controls (cards, buttons, drawers) so the novelty is in automation, not the UI surface.

### Experience Mechanics
1. **Initiation:** Dashboard home loads with telemetry cards and issue panel.
2. **Interaction:** You click on any tile or alert to see root cause (logs, queues) and choose an action (retry, run fix, launch AI dev team).
3. **Feedback:** Banners confirm accuracy; AI actions show status (“running”, “completed”) with logs.
4. **Completion:** Tile returns to healthy state; issue card updates/archives; you’re ready for the next scan.
## Visual Design Foundation

### Color System
- Keep the existing shadcn palette (neutral grays + accent primaries) and layer semantic states on top: verified (calm green), investigating (amber), error (desaturated red), AI running (indigo).
- Use subtle gradient overlays or glow only to highlight anomalies; otherwise maintain flat, confident fills.

### Typography System
- Continue with the template’s Inter-based stack: `Inter, system-ui, sans-serif` for headings and body text.
- Type scale: H1 28px, H2 22px, H3 18px, body 14px; emphasize strong contrast in headings so telemetry panels feel structured.

### Spacing & Layout
- Stick with the 8px spacing grid. Cards get 24px padding; tables have 16px vertical spacing.
- Layout is dense-but-clear: enough white space to breathe, but telemetry stays visible above the fold.
- Use the sidebar + top-nav shell already deployed; dashboards rely on 12-column responsive grid.

### Accessibility Considerations
- Ensure discrepancy banners and buttons maintain ≥4.5:1 contrast, especially for red/amber states.
- Focus-visible rings for every action, with screen-reader labels explaining state (e.g., “Transcription jobs verified”).
## Design Direction Decision

### Design Directions Explored
- Variations of the existing shadcn-based layout (denser telemetry view, alert-heavy view, drawer-first layout). After reviewing them informally, we’re keeping the current direction as the base.

### Chosen Direction
- **Maintain the current dashboard layout**: sidebar + top bar + grid of cards/tables, with reliability states layered on top (verified/stale/investigating banners, issue drawer).

### Design Rationale
- Already in production and aligned with the calm, professional ops tone.
- Users (you + AI assistants) are comfortable with the structure; we just need clearer state cues.
- Extending the existing system is faster than inventing a new visual language.

### Implementation Approach
- Add semantic states to existing cards (badge, color accent, icon) for reliability status.
- Introduce an issue drawer/panel anchored to the right to review AI actions without leaving the dashboard.
- Spark joy through micro-interactions (hover, skeletons) rather than major layout changes.
## User Journey Flows

### Reliability Scan & Maintenance
- Flow: detect alert → inspect diagnostics → choose action → run action → verify recovery → log resolution.
```mermaid
flowchart TD
    A[Open Dashboard] --> B{Is there an alert?}
    B -- No --> C[Scan telemetry cards]
    C --> D[Dashboard confirms all healthy]
    B -- Yes --> E[Click alert]
    E --> F[See diagnostics + suggested actions]
    F --> G{Choose action}
    G --> H[Action runs (retry/purge/restart/AI)]
    H --> I[System re-checks stats]
    I --> J{Counts realigned?}
    J -- Yes --> K[Dashboard logs resolution]
    J -- No --> E
```

### Issue Delegation to AI Dev Team
- Flow: issue surfaces → Nathan launches AI dev workflow → AI analyzes → status updates back into dashboard/GitHub.
```mermaid
flowchart TD
    L[Alert or Nathan opens issue] --> M[Issue card shows telemetry]
    M --> N[Click "Launch Admin Dev Team"]
    N --> O[AI dev team receives context]
    O --> P[AI analyzes + runs scripts]
    P --> Q{Resolved?}
    Q -- Yes --> R[Dashboard updates issue as resolved]
    Q -- No --> S[AI posts findings + next steps]
    S --> N
```

### Journey Patterns & Optimizations
- Navigation: home dashboard → alert drawer → action drawers, so context stays visible.
- Decision pattern: “diagnose → pick action → verify” repeats; ensure each state has a unique badge/color.
- Feedback: banners + log entries confirm every action with timestamps and status chips.
## Component Strategy

### Design System Components
- Leverage shadcn/x Radix primitives for cards, tables, tabs, drawers, alerts, buttons, and inputs.
- Use TanStack Table/Router components for data-heavy areas; wrap them with shadcn-styled shells for consistency.

### Custom Components
1. **Reliability Tile**
   - Purpose: show transcription/service status with verified/stale/investigating states.
   - Content: title, status badge, last check timestamp, quick actions.
   - Actions: view details drawer, launch action.
   - States: verified, stale, investigating, error.
   - Accessibility: ARIA labels like “Transcription jobs verified at HH:MM.”
2. **Alert Drawer / Diagnostics Panel**
   - Purpose: single place to see discrepancy details, logs, suggested actions.
   - Actions: pick retry/purge/restart/AI, view logs.
   - States: info, warning, error, loading, success.
3. **Issue Card + AI Status Chip**
   - Purpose: show GitHub issue summary, telemetry, AI workflow status.
   - Actions: launch AI dev team, mark resolved, view history.
4. **Maintenance Action Modal**
   - Purpose: confirm actions and show output inline.
   - States: idle, running, success, failure.

### Component Implementation Strategy
- Build custom components as wrappers around existing shadcn primitives; all states use semantic color tokens defined in the visual foundation.
- Ensure every component emits structured events/log entries so AI workflows and audit trails stay in sync.
- Keep all components documented in Storybook (or similar) so AI agents can reuse them with confidence.

### Implementation Roadmap
- **Phase 1 (Reliability):** build reliability tile, alert drawer, maintenance action modal.
- **Phase 2 (Delegation):** issue cards with AI status chip + log panel.
- **Phase 3 (Growth):** service onboarding wizard, n8n workflow cards, cross-project ops view components.
## UX Consistency Patterns

### Button Hierarchy
- Primary: solid buttons with color-coded state (verified = green, investigate = amber, risky = red). Secondary: ghost buttons for info-only actions.
- Loading state = spinner + “Running…” label; disabled state keeps label visible so you know what action is waiting.

### Feedback Patterns
- Alerts/banners always show icon + title + timestamp; success = soft green, warning = amber, error = desaturated red.
- Toasts reserved for confirmations and AI workflow updates; they include “View logs” links when available.

### Form & Action Patterns
- Use drawers/modals for maintenance actions; every action requires confirmation with summary of what will happen.
- Validation: inline messages near fields; critical errors send user to alert drawer with remediation steps.

### Navigation Patterns
- Left sidebar for primary sections (Dashboard, Issues, Services, Automations). Right drawer for contextual details (alerts, AI status).
- Breadcrumbs unnecessary; focus on anchor cards + drawers so you never lose context.

### Additional Patterns
- Loading states: skeleton lines for cards/tables, shimmer effect for tiles to signal “checking.”
- Empty states: friendly icon + one-line explanation + CTA (“No issues open. Go enjoy your day.”).
- Search/filter: global search bar (Ctrl+K) plus per-table filters with chips.
## Responsive Design & Accessibility

### Responsive Strategy
- Desktop-first layouts (cards + tables + drawers). Tablet/mobile collapse to single-column view with key stats at top; maintenance actions become drawers to avoid accidental taps.
- Sidebar stays docked on desktop, becomes off-canvas on tablet/mobile; bottom nav not needed (rare mobile use).

### Breakpoint Strategy
- Use standard breakpoints: <768 (mobile), 768–1023 (tablet), ≥1024 (desktop). Desktop-first CSS but ensure mobile-friendly collapse so the existing template keeps working.
- Tablet tweaks: enlarge touch targets, reduce data density, keep AI status chips legible.

### Accessibility Strategy
- Target practical WCAG AA behaviors: contrast ≥4.5:1, keyboard navigation for all controls, ARIA labels for tiles (“Transcription jobs verified at …”), focus-visible rings.
- Maintain screen-reader cues for discrepancy banners/alerts and ensure drawers announce themselves when opened.

### Testing Strategy
- Responsive: test on actual desktop + one tablet + one phone (through Tailscale) to ensure data remains visible and actions still work.
- Accessibility: automated checks (axe, Lighthouse) + keyboard-only sweeps + VoiceOver spot checks on critical flows.

### Implementation Guidelines
- Continue mobile-first CSS (Tailwind makes this easy) and use relative units (rem/%) so layouts scale.
- Keep button hit areas ≥44px, avoid hover-only cues (also show state via text/icon).
- Provide “skip to main content” and maintain focus order so admin workflows are efficient even without a mouse.
