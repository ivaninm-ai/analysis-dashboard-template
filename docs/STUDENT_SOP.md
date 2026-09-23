# Student SOP — install your own business dashboard

Release 1.0.0 · no terminal, no code editing. Every step is a web page, a form in the
dashboard, or a value pasted into GitHub's Secrets/Variables screens. The interactive
version of this SOP (with copy buttons and checkpoints) is the installation guide your
instructor shares; this file is the same procedure in plain text.

**What you will end up with:** a private dashboard at `https://<your-github-name>.github.io/<repo>/`
that reads your own Google Sheets through your own Google account, stores its settings
and tasks in a workbook in your own Google Drive, and refreshes on a schedule from your
own GitHub repository. Nothing is shared with the instructor.

## Before you start — accounts (all free unless noted)

| Account | Used for | Cost |
|---|---|---|
| GitHub | Your copy of the template, scheduled jobs, the website | Free (the repository must be **public** for GitHub Pages on the free plan; it contains only generic code) |
| Google account | Your source Sheets, the Dashboard Workspace, sign-in | Free |
| Google Cloud project | Sheets API, a service account, a browser sign-in client | Free (no billing needed) |
| Anthropic Console (optional) | The AI brief; separate from a Claude subscription | Pay-per-use API |
| Claude (claude.ai) | Running the onboarding skill once | Your existing plan |

Keep a private notepad for values you will paste. Never paste keys into chat, e-mail or the guide.

## Step 1 — Copy the template into your GitHub account

1. Open the template link your instructor gave you → **Use this template → Create a new repository**.
2. Owner: yourself. Name: `my-business-dashboard` (any name). Visibility: **Public**. Create.
3. ✅ Checkpoint: your repository opens and shows folders `app`, `worker`, `docs`.

## Step 2 — Google Cloud: one project, one API, one sign-in client, one service account

1. console.cloud.google.com → project selector → **New project** → name `dashboard` → Create → select it.
2. **APIs & Services → Library** → search **Google Sheets API** → Enable. ✅ Checkpoint: "API enabled".
3. **APIs & Services → OAuth consent screen** (also called *Google Auth Platform*):
   - User type **External** → app name `Business Dashboard`, your e-mail as support and developer contact → Save.
   - **Audience**: keep **Testing** and add **your own Google e-mail** as a test user. (Only test users can sign in while the app is in Testing. The dashboard asks only for the `drive.file` permission, which is not a sensitive scope.)
4. **APIs & Services → Credentials → Create credentials → OAuth client ID** → type **Web application** → name `dashboard-browser`.
   - **Authorized JavaScript origins → Add URI**: `https://<your-github-name>.github.io` (all lowercase; no path, no trailing slash).
   - Create → copy the **Client ID** (ends with `.apps.googleusercontent.com`) into your notepad. Do not use the client secret; the dashboard never needs it.
5. **IAM & Admin → Service Accounts → Create service account** → name `dashboard-worker` → Create → skip the optional roles → Done.
   - Open it → **Keys → Add key → Create new key → JSON** → the key file downloads. Keep it private.
   - Copy the service account's **e-mail** (`dashboard-worker@….iam.gserviceaccount.com`) into your notepad.
6. ✅ Checkpoint: you have a Client ID, a service-account e-mail, and a downloaded JSON key file.

## Step 3 — GitHub Secrets and Variables

In your repository: **Settings → Secrets and variables → Actions**.

**Secrets tab → New repository secret** (paste the value exactly):

| Name | Value |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_JSON` | The entire contents of the downloaded JSON key file (open it in Notepad, select all, copy) |
| `ANTHROPIC_API_KEY` | (optional, for the AI brief) your Anthropic API key |

**Variables tab → New repository variable**:

| Name | Value |
|---|---|
| `GOOGLE_OAUTH_CLIENT_ID` | The Client ID from step 2.4 |
| `BUSINESS_LABEL` | (optional) the name to show on the sign-in page |
| `REFRESH_HOURS_UTC` | (optional) hours to import, e.g. `23` (= 07:00 Malaysia) or `1,7` ; `off` disables the schedule |
| `AI_MODEL` | (optional) defaults to `claude-opus-5` |
| `AI_AUTO` | (optional) `off` to stop the automatic brief after each import |

`DASHBOARD_WORKSPACE_ID` is added in step 6. ✅ Checkpoint: two secrets (or one) and at least one variable saved.

## Step 4 — Publish the dashboard site

1. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. **Actions** tab → if asked, **I understand my workflows, go ahead and enable them**.
3. Left list → **4 · Publish dashboard** → **Run workflow** → Run. Wait for the green tick (about one minute).
4. Open the run → the summary shows **Open: https://<your-github-name>.github.io/<repo>/**. Bookmark it.
5. ✅ Checkpoint: the page shows *Connect Google*. (If it says *Not configured yet*, the variable in step 3 is missing or misspelled.)

## Step 5 — Sign in and create your Dashboard Workspace

1. Open your dashboard → **Connect Google** → choose the e-mail you added as a test user → **Continue** → allow.
   - If Google says *Access blocked*: add that e-mail as a test user (step 2.3) and try again.
   - If Google says *origin not allowed* / *redirect_uri_mismatch*: check the Authorized JavaScript origin (step 2.4) matches your site address up to `.github.io`.
2. **Create a new Dashboard Workspace**. The dashboard creates a Google Sheet in your Drive and opens **Data connections**.
3. ✅ Checkpoint: **Data connections** shows a Workspace ID and an *Open workspace* link.

## Step 6 — Share the workspace with your worker and save its ID

1. In **Data connections**, paste your service-account e-mail into the field and **Save** (it is shown so you can copy it later).
2. Click **Copy** next to the Workspace ID → GitHub → **Settings → Secrets and variables → Actions → Secrets → New repository secret**: name `DASHBOARD_WORKSPACE_ID`, value = the ID.
3. Click **Open workspace ↗** → Google Sheets **Share** → add the service-account e-mail as **Editor** → Send (untick *Notify* if offered). Keep *General access* **Restricted**.
4. GitHub → **Actions → 1 · Install check → Run workflow**. ✅ Checkpoint: account key, workspace and write-access checks pass. A missing setup package is expected until steps 7–8; rerun the check after those steps.

## Step 7 — Describe your business once (Claude skill)

1. claude.ai → Settings → Capabilities → Skills → upload `business-dashboard-onboarding.zip` (once).
2. Start a chat, attach a **sample** of your records (Excel/CSV, or a PDF/DOCX report) and write: *"Set up my business dashboard from this sample."*
3. Answer its questions (at most three at a time) about what a row means, dates, amounts, statuses, and who owns follow-ups.
4. When it says the package is confirmed, download **setup-package.json**.
5. ✅ Checkpoint: the file is on your computer and Claude showed a summary of counts and totals it found in the sample.

## Step 8 — Import the setup package and connect the live source

1. Dashboard → **Settings → Import your setup package** → choose the file → **Validate and preview** → read the preview → **Import this package**.
2. **Data connections → Sources**: for each **Google Sheet source**, paste the **link of your live Google Sheet** → **Save link**.
   - Your source must be a native Google Sheet (File → Save as Google Sheets if it is an uploaded Excel file).
   - In that Sheet: **Share** → service-account e-mail as **Viewer**. General access stays Restricted.
3. GitHub → **Actions → 2 · Import data → Run workflow**. Wait for the green tick.
4. Dashboard → **Reload**. ✅ Checkpoint: the badge at the top reads *data as of <date>* and the Overview shows your figures. **Data connections → Reconciliation** compares sample rows with live rows.

A sample uploaded to Claude is *not* a live connection; only the Sheet link saved in step 8.2 is.

## Step 9 — Prove it works (5 minutes)

1. **Tasks**: accept one suggestion, complete one, dismiss one, edit one (date/owner/note).
2. Close the browser. Open the dashboard again, reconnect. ✅ Your decisions are still there.
3. Change one value in your source Sheet (for the training pack: Stock R003 on-hand 8 → 33). Run **2 · Import data** again → Reload. ✅ The figure changed, your decisions are kept, no duplicate tasks appeared.
4. Restore the value; import again. ✅ The figure returns.

## Daily use

- The import runs automatically at the hours in `REFRESH_HOURS_UTC` (default 23:17 UTC ≈ 07:17 Malaysia). GitHub may delay or skip scheduled runs; to request a refresh use **Data connections → Run "Import data" now**.
- The AI brief is generated after each import (if you set `ANTHROPIC_API_KEY`) and on **AI insights → Request analysis** (processed on the next worker run, or request a manual run with **3 · AI brief → Run workflow**).
- Your Google session lasts about an hour. When asked, click **Reconnect**. **Sign out** clears all data from the page.
- Back up: **Settings → Export backup** (settings, links, decisions, notes). Restore into a new workspace with **Restore from backup**.
- Update: when the instructor announces a release, **Actions → 5 · Update from template → Run workflow** with the tag, then **4 · Publish dashboard** and **1 · Install check**. Your workspace is untouched.

## What is not automatic (honest limits)

- Excel/CSV/PDF/DOCX files are imported through a package produced with the skill; to refresh one file, follow [Mixed sources](MIXED_SOURCES.md): source recipe → Claude → source-update.json → preview → save that source → import. Only native Google Sheets refresh on the schedule.
- The AI brief needs an Anthropic API key with billing; a Claude subscription does not include one.
- One person editing tasks at a time is assumed. Up to 5,000 rows per table.
- Nothing is sent to external calendars or messaging; the calendar is inside the dashboard.

## Mixed files and daily operations — release candidate

Read [MIXED_SOURCES.md](MIXED_SOURCES.md) for selective file updates, duplicate handling, calendar behaviour, data freshness, backup contents and the GitHub 60-day inactivity rule. This local candidate still needs a live instructor installation before student distribution.
