# GitHub Issues Snapshot

> **Refresh this snapshot:**
> ```bash
> python3 scripts/update_github_issues_snapshot.py
> ```
> Update whenever you kick off a planning workflow (workflow-init, PRD, sprint planning) or after major GitHub issue churn so offline agents stay in sync with the live backlog.

*Generated:* 2026-01-02T12:39:32Z

## Open Issues
| # | Title | Labels | Created | Notes |
| --- | --- | --- | --- | --- |
| 11 | Doc: clarify dual npm/pnpm workflow | documentation, enhancement | 2026-01-01 | ## Summary Document the workflow for keeping both npm and pnpm lockfiles in sync so dependency changes don't break CI. ## Motivation - Re... |
| 5 | UX Improvements: Search Debouncing & Error Messaging | enhancement | 2025-12-28 | # UX Improvements: Search Debouncing & Error Messaging ## Summary Minor UX improvements to enhance user experience: debounce search input... |
| 4 | Error Tracking & Performance Monitoring | bug | 2025-12-28 | # Error Tracking & Performance Monitoring ## Summary No external error tracking service or performance monitoring. Production errors are ... |
| 3 | Frontend Error Handling & API Response Validation | bug | 2025-12-28 | # Frontend Error Handling & API Response Validation ## Summary Multiple critical error handling gaps in the frontend: unhandled promise r... |
| 2 | File watcher failed silently due to incorrect watch directory path | — | 2025-12-27 | # File Watcher Configuration Issue - Prevention Measures ## Issue Summary The transcription service was configured to watch a macOS path ... |
| 1 | Dashboard shows stale job data due to API rate limiting (500 errors) | bug | 2025-12-27 | ## Summary Dashboard displayed stale transcription job data (showing "7 processing jobs") despite the actual count being 0. The issue per... |

## Recently Closed Issues
| # | Title | Closed | Notes |
| --- | --- | --- | --- |
| 6 | Add Biome linter/formatter with complexity and file size checks | 2026-01-02 | Added comprehensive code quality tooling including Biome linter/formatter, complexity rules (max 15), and file size checks (max 500 lines... |
| 12 | Null Safety Audit: Client-side TypeError crashes | 2026-01-02 | ## Summary The dashboard experienced a 500 error page caused by unhandled `undefined` values being passed to array methods. ## Root Cause... |
| 13 | refactor: remove unused template features | 2026-01-02 | ## Summary Removes unused template features (chats, users, tasks, apps) that were inherited from shadcn-admin but not needed for transcri... |
| 7 | CI Failure: Husky prepare script failing in GitHub Actions | 2026-01-01 | ## Problem CI builds are failing during npm install phase due to husky prepare script. ## Error Details **Run:** https://github.com/nbost... |
| 10 | fix(ci): skip husky prepare hook on CI | 2026-01-01 | No description |
