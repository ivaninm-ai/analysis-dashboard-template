# Release notes

## 1.1.0-rc.1 — local candidate, 23 September 2026

- Source-specific reviewed file updates: replace / append / full-record upsert, with
  preview, stable IDs, duplicate checks, data dates and pending-import messaging.
- Daily AI includes business profile, task notes, upcoming calendar and explicit
  source freshness. Completed/dismissed/resolved task references are filtered out.
- Skipped or failed scheduled imports no longer trigger automatic paid AI runs.
  AI_AUTO=off still permits queued requests after successful refreshes.
- Reporting dates advance in business timezone; changed policies invalidate the
  import cache even when source rows are identical.
- Interrupted snapshot writes block figures and AI until rebuilt. Task date/owner
  clearing is preserved. Import/AI public summaries no longer print record details.
- Updated local installation guide and onboarding Skill file-update instructions.
  Saved-file data in backups is now disclosed.
- Real Google OAuth/Sheets, GitHub scheduling, Anthropic calls and Skill use in
  Claude remain unverified. No release has been published.

## 1.0.0 — 22 September 2026 (first release; build verified in simulation only)

**Architecture:** static dashboard on GitHub Pages + GitHub Actions worker + student-owned
Google Sheets (source workbooks read-only; one managed *Dashboard Workspace* for
settings, snapshots, tasks, calendar, AI results). No database service, no Apps Script,
no proxy. Browser authorisation uses Google Identity Services with the `drive.file`
scope; the workspace is created by the app so no Google Picker or browser API key is
needed.

**Included**
- Dashboard: Overview, Sales, Customers, Payments, Stock, Tasks, Calendar, AI insights,
  Data connections, Settings. Sections without a mapped table are hidden.
- Deterministic metrics (METRIC_RULES generalised): booked order value, cash by payment
  date, outstanding/overdue balances, pending/overdue completions, stock availability,
  follow-ups, repeat customers, prior-period comparison, monthly trend.
- Task engine: seven catalogue rules, stable keys (`rule:record_id`), recorded deadlines
  separate from suggested dates, decisions preserved across refreshes, resolved-by-data
  reconciliation, stale flag, custom tasks, in-app calendar with notes.
- AI worker (Anthropic Messages API, structured JSON output, default model
  `claude-opus-5`, configurable through `AI_MODEL`): brief with headline, priorities that
  reference existing task keys only, watch items and data caveats; queued requests from
  the dashboard; failures recorded, never affecting metrics.
- Worker: install check, scheduled/manual import with full validation before any write,
  snapshot history, lease + workflow concurrency group, retention limits.
- Setup-package contract v1.0 with schema, validator (JS + Python mirror) and three
  examples (B2C retail, B2B furniture, service clinic without stock).
- Prepared workflows: 1 Install check · 2 Import data · 3 AI brief · 4 Publish dashboard ·
  5 Update from template (+ maintainer tests).
- Student SOP, troubleshooting by symptom, instructor test script, limitations,
  backup/restore, update guide, source-support matrix.

**Verified (simulated Google API and mocked AI provider — see `../EVIDENCE.md`)**
- 31 automated tests: fixture reconciliation for BetterSpace B2C/B2B Day 1 and Day 2
  (all totals and alert-ID sets), second header layout, service layout with text
  dates/money and no stock, changed headers, duplicate/blank IDs, partial failure,
  permission removal, lease, invalid package rejection, backup/restore, template-update
  safety, AI success/failure/missing-key/queue.
- Browser walkthrough of the first complete path in the built-in browser against the
  simulation: sign-in → create workspace → import package → connect source → worker
  import → dashboard → three task decisions → Day 2 refresh → reload → decisions kept,
  no duplicates → AI request queued → failure labelled → sign-out clears data.

**Not verified in this release (requires the owner's accounts)**
- Live Google OAuth consent/Testing-audience behaviour, Sheets API calls, Pages
  deployment, Actions schedule, Anthropic API call, GitHub template flow. The instructor
  test script covers these.

**Known limitations** — see `LIMITATIONS.md`.
