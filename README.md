# Business Dashboard template

A student-owned business dashboard: static site on GitHub Pages, background jobs in
GitHub Actions, and Google Sheets as the only storage. No database service, no Apps
Script, no server to run. Each student creates their own copy from this template and
configures it through Secrets, Variables, Google screens and forms in the dashboard.

**Students:** start with [`docs/STUDENT_SOP.md`](docs/STUDENT_SOP.md) or the interactive
installation guide your instructor shared. Problems: [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md).

## How it fits together

```
 Your source Google Sheets ──(Viewer, service account)──▶ GitHub Actions worker
        (read-only)                                          │ validate · map · metrics · tasks · AI
                                                              ▼ (Editor, service account)
 Your browser ──(your Google sign-in, drive.file)──▶ Dashboard Workspace (Google Sheet)
   GitHub Pages site: generic code only                       settings · snapshots · tasks · calendar · AI results
```

- The site holds no data and no keys; Google sharing is the access boundary.
- Secrets (`GOOGLE_SERVICE_ACCOUNT_JSON`, `DASHBOARD_WORKSPACE_ID`, optional
  `ANTHROPIC_API_KEY`) live only in GitHub Secrets. Public settings are Variables.
- Task decisions and notes are yours; imported snapshots are rebuilt from your sources.

## Repository layout

| Path | Purpose |
|---|---|
| `app/` | The dashboard site (published to Pages). `app/shared/` holds the modules shared with the worker: canonical model, mapping, metrics, tasks, package validation, Sheets client, workspace layout, schema |
| `worker/` | GitHub Actions jobs: install check, import, AI brief |
| `.github/workflows/` | 1 Install check · 2 Import data · 3 AI brief · 4 Publish dashboard · 5 Update from template · Tests |
| `config/` | Setup-package contract and examples |
| `docs/` | Student SOP, troubleshooting, instructor test script, release notes, limitations, source matrix, backup/update guide |
| `scripts/` | `write-config.mjs` (publish-time config from Variables) |
| `test/` | Simulated Google API, fixtures (BetterSpace B2C/B2B copies, alternative service layout) and 31 tests |

## Maintainers

```bash
npm ci
npm test              # 31 simulated tests (fake Google API, mocked AI provider)
npm run fake-google   # simulation server + dashboard at http://127.0.0.1:8790/ (mock sign-in)
node test/sim/worker.mjs import <workspaceId> [--day day2]   # run the worker against the simulation
```

Publish a release by tagging (`v1.0.0`); students apply it with workflow 5.
The onboarding skill (`business-dashboard-onboarding`) is distributed separately as a
ZIP and shares `app/shared/setup-package.schema.json`.

Release 1.0.0 — see [`docs/RELEASE_NOTES.md`](docs/RELEASE_NOTES.md).
# Local candidate 1.1.0-rc.1

This candidate adds mixed-source file updates and fixes daily AI scheduling.
Read [docs/MIXED_SOURCES.md](docs/MIXED_SOURCES.md) and
[docs/RELEASE_NOTES.md](docs/RELEASE_NOTES.md) before using the setup instructions.
It has passed local simulation; live Google/GitHub/Anthropic installation remains
an instructor acceptance step. Do not label this a student-ready published release.
