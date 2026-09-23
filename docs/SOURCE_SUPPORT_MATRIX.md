# Source support matrix (release 1.1.0-rc.1)

**Record types.** The dashboard maps exactly four kinds of record, one authoritative table
each: **customers**, **sales/orders/jobs**, **received payments**, **stock**. "Multiple
formats" is not "every document". Supplier invoices and liabilities, quotations, contracts,
payroll, bank statements and general business documents have no table here and must not be
forced into one; identify them as unsupported before a student starts setup.

| Source | Onboarding sample (skill) | Live connection | Refresh | Notes |
|---|---|---|---|---|
| Google Sheets (native) | Yes — upload an export or paste headers/rows | **Yes** — share with the service account as Viewer, paste the link | Scheduled + manual via GitHub Actions | First and only live connector. Dates may be real dates or ISO/dd-mm text; money may be numbers or "RM 1,200.00" text |
| Excel (.xlsx) | Yes — full inspection of sheets, headers, types | No | Source-specific reviewed JSON update | Either convert to a native Google Sheet (File → Save as Google Sheets) for live refresh, or import reviewed rows as a manual package |
| CSV / TSV | Yes | No | Source-specific reviewed JSON update | As above |
| PDF (text) | Yes — tables and key facts extracted, every value flagged with a page reference and confidence | No | Source-specific reviewed JSON update | Review required; uncertain values are questions, not records |
| PDF (scanned) | **No** — reported as `scanned: true` with nothing extracted | No | — | No OCR is performed. Export the data from the system that produced the PDF, or type the few numbers needed. Never guessed |
| DOCX | Yes — tables and paragraphs | No | Source-specific reviewed JSON update | Review required |
| Drive-hosted Excel, synced folders | Not yet | Not yet | — | Later connector; needs Drive API scopes and additional sharing steps |
| Databases, POS/marketplace APIs | No | No | — | Export to a Google Sheet first |

**Live means:** the worker reads the file from Google on the schedule using the service
account. A sample uploaded to Claude is never a live connection.

**Manual package means:** the skill embeds reviewed, normalised rows (`records`) in the
setup package; the dashboard imports them once. To refresh one source, follow [Mixed sources](MIXED_SOURCES.md). Row limit 5,000 per entity.
