> Also run the mixed-source acceptance trial in [MIXED_SOURCES.md](MIXED_SOURCES.md): replace Excel, retain PDF and live Sheet; repeat upload; reject conflicting duplicate; check saved task/calendar decisions and AI source dates. Test a full live installation before distribution.

# Instructor test script — fresh student simulation

You act as a student with a fresh GitHub account, a fresh Google Cloud project and the
synthetic BetterSpace records. Follow **only** `STUDENT_SOP.md` (or the installation
guide). Record every extra instruction, error, and support intervention in the table at
the end; each is a usability defect to fix in the template or guide.

Estimated time: 45–60 minutes. Synthetic data only.

## Preparation (instructor, before acting as a student)

1. Publish the template repository (public) with a release tag `v1.0.0` and enable
   "Template repository" in its settings.
2. Upload `01_B2C_Retail/BetterSpace_B2C.xlsx` to Google Drive **as a native Google Sheet**
   (File → Save as Google Sheets). Keep General access Restricted. Do not modify the
   original file.
3. Have `business-dashboard-onboarding.zip` and the sample workbook ready.

## Part A — Installation (SOP steps 1–6)

| # | Action | Expected | Result / time |
|---|---|---|---|
| A1 | Create repository from template | Repo with `app/`, `worker/`, `docs/` | |
| A2 | Google Cloud project + Sheets API + consent screen (Testing, self as test user) + OAuth web client with origin `https://<name>.github.io` + service account + JSON key | Client ID, SA e-mail, key file | |
| A3 | Secrets `GOOGLE_SERVICE_ACCOUNT_JSON`; variable `GOOGLE_OAUTH_CLIENT_ID` | Saved | |
| A4 | Pages → GitHub Actions; run **4 · Publish dashboard** | Summary shows site URL; site shows *Connect Google* | |
| A5 | Connect Google with the test-user account | Consent shows only "See, edit, create, and delete only the specific Google Drive files you use with this app" | |
| A6 | Create workspace | Data connections shows Workspace ID; a "Dashboard Workspace" Sheet exists in Drive with 15 tabs | |
| A7 | Save SA e-mail; add secret `DASHBOARD_WORKSPACE_ID`; share workspace with SA as Editor | — | |
| A8 | Run **1 · Install check** | All ✅ except Setup package (not imported yet) and sources | |
| A9 | **Denial test:** open the site in a private window and sign in with a *different* Google account (not a test user) | Google blocks sign-in (Testing audience) — no data visible. Then add that account as a test user, sign in, paste the workspace ID → *Google did not allow access* — still no data | |

## Part B — Onboarding skill (SOP step 7)

| # | Action | Expected | Result |
|---|---|---|---|
| B1 | Install the skill ZIP in claude.ai | Skill listed | |
| B2 | New chat, attach `BetterSpace_B2C.xlsx`, "Set up my business dashboard from this sample." | Skill inspects the four sheets, states row meanings, asks ≤ 3 questions at a time | |
| B3 | Answer: one row = one order; total_amount is booked value excl. tax; Day 1 reporting date is in the records; statuses as documented | It produces a confirmed package; shows counts 120/320/300/12 and totals 82,990 / 82,990 | |
| B4 | Download `setup-package.json` | File saved | |
| B5 | Negative test: ask it to "add a formula that doubles the amount" | It refuses (the contract has no expressions) and explains | |

## Part C — Import and live connection (SOP step 8)

| # | Action | Expected | Result |
|---|---|---|---|
| C1 | Settings → import the package → preview | Preview lists 4 tables, sample counts/totals; no errors | |
| C2 | Import an intentionally broken copy (delete the `amount` field mapping) | Rejected before saving: *required field sales.amount is not mapped* | |
| C3 | Data connections → paste the live Sheet link → Save; share the Sheet with SA as Viewer | *connected* | |
| C4 | Run **2 · Import data** → Reload | Badge *data as of 30 Aug 2026*; Overview: RM 25,650 August order value, 104 orders, outstanding RM 0, 3 low-stock items, 8 overdue completions | |
| C5 | Data connections → Reconciliation | Sample rows = live rows for all four tables | |
| C6 | Remove the SA's Viewer permission on the source; run import | Run fails with the *share as Viewer* message; badge *stale — last import failed*; figures unchanged | |
| C7 | Restore Viewer; run import | *unchanged* or *success*; badge green | |

## Part D — Tasks, calendar, refresh (SOP step 9)

| # | Action | Expected | Result |
|---|---|---|---|
| D1 | Tasks: accept `completion_overdue:RS-001`, complete `review_replenishment:R003` with a note, dismiss one, edit one date | Toast *Saved to your workspace*; Task_Decisions tab in the workbook has the rows | |
| D2 | Sign out, close browser, reopen, reconnect | Decisions unchanged; no business text visible before sign-in | |
| D3 | Calendar | Recorded deadlines (orange), accepted task dates (blue), overdue (red); no invented times | |
| D4 | In the source Sheet change Stock R003 on_hand 8 → 33; run import; Reload | Low-stock 3 → 2; R003 task shows *resolved by data* with your note kept; no duplicate tasks | |
| D5 | Replace all four tabs with the Day 2 workbook contents (full replacement); import | Badge *data as of 31 Aug 2026*; 105 orders, RM 25,735; overdue completions 10; RS-001 completion task resolved; decisions kept | |
| D6 | Rename header `total_amount` to `Total (RM)` in the source; import | Failed with *Column "total_amount" … Headers found: … "Total (RM)"*; previous data still shown | |
| D7 | Rename it back; import | Success | |

## Part E — AI worker

| # | Action | Expected | Result |
|---|---|---|---|
| E1 | Without `ANTHROPIC_API_KEY`: AI insights → Request analysis → run **3 · AI brief** | History shows *failed · ANTHROPIC_API_KEY secret is not set*; queue cleared; metrics unaffected | |
| E2 | Add the key; run **3 · AI brief** | A complete brief with headline, priorities referencing existing task keys, data caveats; snapshot/model/rules shown | |
| E3 | Enter a wrong key; run | *rejected the API key (401)*; earlier brief still readable, labelled *older snapshot* only if data changed | |

## Part F — Backup, update, second layout

| # | Action | Expected | Result |
|---|---|---|---|
| F1 | Settings → Export backup | JSON file downloads; contains no source records and no keys | |
| F2 | Create a second workspace on the same account; Restore from backup; run import | Decisions and links restored; data re-imported | |
| F3 | Run **5 · Update from template** with the current tag | *Already up to date* or a commit; workspace untouched; Install check ✅ | |
| F4 | Repeat B–C with `BetterSpace_B2B.xlsx` in a new workspace | Overview: RM 231,060; outstanding RM 91,090; overdue RM 30,515; follow-ups 5 | |
| F5 | (Optional) Repeat with `test/fixtures/alt-service-studio` CSVs pasted into a Sheet | Stock section hidden; RM 1,910 August; overdue RM 800 | |

## Obstacles log

| Step | What happened | Extra instruction needed | Fix (template / guide / SOP) |
|---|---|---|---|
| | | | |

Acceptance: every checkpoint met; the obstacles log contains no item that requires a
terminal, code editing, or a step missing from the SOP.
