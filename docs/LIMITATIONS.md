# Limitations and tested limits (release 1.0.0)

**Storage and concurrency**
- Google Sheets has no transactions or row locks. Writes locate rows by stable key before
  updating, worker runs are serialised (workflow concurrency group + 10-minute lease), and
  a failed import leaves the previous snapshot in place. A write that fails half-way
  through the *write phase* (after all validation) leaves `last_import_status = writing`
  and the dashboard shows a warning; re-run the import.
- Assumed: one person editing tasks/notes at a time. Two people editing the same task in
  the same minute: last save wins.
- Limits enforced by the worker: 5,000 rows per table, 2,000 task suggestions, 2,000
  calendar entries; history retention 30 snapshots, 100 AI results, 200 sync-log rows.
  Cells over 40,000 characters are chunked automatically (setup package, metrics).
- Tested sizes in simulation: 320 sales / 300 payments / 120 customers (B2C pack).
  Larger course datasets have not been benchmarked; Sheets API quotas (per-minute
  request limits) may slow imports of several thousand rows.

**Sources**
- Live refresh: native Google Sheets only. Excel/CSV/PDF/DOCX enter through a manual
  package (reviewed rows) and refresh through source-specific reviewed JSON updates; see MIXED_SOURCES.md. Drive-hosted
  Office files and synced folders are not connectors in this release.
- One table per canonical entity; duplicate exports of the same records must not be
  mapped twice. Multi-item orders need one row per order in this release (or an
  order-level export).
- No OCR; scanned PDFs are flagged by the skill as requiring manual review.

**Authorisation**
- The browser uses `drive.file`: it can open only workspaces it created for the signed-in
  Google account. Another device or account must paste the ID *and* be the same Google
  account; otherwise create a new workspace and restore from backup.
- Access tokens last about one hour; there is no permanent browser sign-in. While the
  OAuth consent screen is in *Testing*, only listed test users can sign in (up to 100).
  Publishing the consent screen to *Production* is possible without verification for the
  `drive.file` scope but has not been tested in this release.
- Signing out revokes the token and clears the page; the browser's own cache is not a
  data store (only the workspace ID and display preferences are kept locally).

**Scheduling**
- GitHub scheduled workflows can be delayed or dropped, especially at busy hours; the
  hourly cron gated by `REFRESH_HOURS_UTC` is a best-effort schedule, not a guarantee.
  Manual runs request a job and can also queue. Public schedules stop after 60 days without repository activity.
- Public repositories have free Actions minutes; the hourly skip run costs seconds.

**AI**
- One supported provider (Anthropic Messages API). Requires an API key with billing —
  not included in a Claude subscription. Data sent: business profile, calculated
  metrics and open task lines (which include customer names from your records). No
  streaming chat; requests are queued and processed by the worker.
- The brief can only reference task keys that exist; anything else is dropped and
  counted in `dropped_references`.

**Dashboard**
- Metrics are computed from the current snapshot only; the period filter is an analysis
  filter, not time travel. Only the reporting date in the snapshot is a supported
  as-of state.
- No external calendar, e-mail or messaging integration.
- Money is displayed with the configured symbol; multi-currency is not supported.

**Template updates**
- `5 · Update from template` replaces `app/`, `worker/`, `config/`, `docs/`, `scripts/`
  and package files. GitHub does not allow it to change `.github/workflows/`; changed
  workflow files must be re-copied by hand (the run summary lists them).
- Workspace schema migrations are additive (missing tabs/keys added; nothing cleared).

## Candidate changes

The mixed-source workflow, AI calendar context and schedule gating are described in [MIXED_SOURCES.md](MIXED_SOURCES.md). A partial snapshot write now blocks figures/AI until a successful rebuild; it does not guarantee an atomic rollback. File updates and setup edits must not overlap worker imports. No new cloud service was added.
