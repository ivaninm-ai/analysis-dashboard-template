# Google Sheets + saved Excel/PDF/DOCX records

## First setup

Use one onboarding conversation with representative samples from every source.
Decide which source owns each kind of record. Version 1 supports one table each for
customers, sales/orders/jobs, payments and stock. It does not support arbitrary
business document types, multiple sales tables, or supplier invoices as customer
payments. Unsupported documents must be identified before students start setup.

For example: Sales + Customers in live Google Sheets, Payments from a reviewed PDF,
and Stock from a local Excel. The setup includes three source IDs; file sources use
`manual_package`. Their reviewed records are saved in the private Workspace Sheet.
The original Excel/PDF is not uploaded to GitHub or stored by the dashboard.

## When one file changes

1. Open **Data connections** and locate that file source.
2. Click **Download update recipe**. Attach this and the new file to Claude with the
   updated onboarding Skill. Say: “Update this saved dashboard source from this file.”
3. Confirm its data date, row counts/totals and update behaviour with Claude:
   - **Replace:** complete current snapshot. Removes absent records for this source.
   - **Append:** additional records. Identical duplicates are skipped; conflicting
     duplicates are blocked.
   - **Upsert:** full corrected records matched by stable ID. Keeps absent records.
4. Download **source-update.json**. Back in that source card, choose it and click
   **Preview file update**. Check the source, date, mode, before/after counts and
   removals. Click **Save this source only**.
5. Run **Import data** from the link in Data connections (or wait for the schedule),
   then **Reload**. The background worker checks relationships across all sources.

Source links and the business setup are not replaced. Other file records remain
saved, and live Google Sheets continue refreshing. Task decisions and calendar notes
are preserved by stable IDs. Do not update files while an import is running; if the
preview becomes out of date, the app asks you to preview again.

“Saved” means the file records are ready for the next import. It does not mean the
combined dashboard has been refreshed yet. If combined validation fails, inspect
Data connections and correct the file; the worker does not silently drop records.
If a snapshot write is interrupted, figures and AI are blocked until a successful
rebuild. Sheets is not transactional; avoid concurrent setup/file edits and imports.

## Daily briefing and calendar

The worker combines fresh Sheet reads with the last saved file records. It includes
each file's declared data date/upload time and labels unknown dates honestly. Those
caveats remain in the saved AI result even if the AI omits them. A morning Sheet read
does not make an old PDF current.

The calendar displays recorded completion/payment/follow-up dates, accepted dated
tasks, and your notes. Unaccepted AI suggestions do not become appointments. Completed,
dismissed and resolved tasks disappear from the action calendar; recorded source
deadlines remain until the records change. Notes persist through imports. The daily
AI request includes task notes and the calendar for today and the next 14 days (up to
40 entries). No appointment times or external Google Calendar sync are inferred.

## Schedule details

The workflow checks at minute **17** of each UTC hour. Default hour 23 means roughly
**07:17 Malaysia time**, subject to GitHub delays. The AI step only follows a successful
or unchanged import, never a skipped/failed import. `AI_AUTO=off` suppresses automatic
briefs but still allows explicitly queued requests after a refresh. `REFRESH_HOURS_UTC=off`
disables scheduled imports; use manual workflows to process requests.

GitHub can disable public-repository schedules after 60 days without repository
activity. Updating a Google Sheet does not count as repository activity. Check
Actions when imports stop; re-enable the disabled workflow, then run Import data.
Manual workflow dispatch also enters GitHub's queue; it is not an immediate guarantee.
See [GitHub schedule documentation](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

## Storage and backup

Workspace Settings holds the reviewed file rows, so **Export backup includes those
private file records**, alongside settings, links and decisions. It excludes rebuilt
Data_* snapshots and service-account/API keys. Keep backup files private. Original
PDF/Excel files remain wherever the student maintains them.

## Current verification boundary

Mixed-source and recovery checks use a simulated Google API and mocked Claude calls.
A fresh Google OAuth/Sheets installation, actual GitHub scheduled run, paid AI call,
and the updated Skill in Claude still require instructor testing before distribution.
