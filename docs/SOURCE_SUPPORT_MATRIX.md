# Source support matrix (release 1.0.0)

| Source | Onboarding sample (skill) | Live connection | Refresh | Notes |
|---|---|---|---|---|
| Google Sheets (native) | Yes — upload an export or paste headers/rows | **Yes** — share with the service account as Viewer, paste the link | Scheduled + manual via GitHub Actions | First and only live connector. Dates may be real dates or ISO/dd-mm text; money may be numbers or "RM 1,200.00" text |
| Excel (.xlsx) | Yes — full inspection of sheets, headers, types | No | Source-specific reviewed JSON update | Either convert to a native Google Sheet (File → Save as Google Sheets) for live refresh, or import reviewed rows as a manual package |
| CSV / TSV | Yes | No | Source-specific reviewed JSON update | As above |
| PDF (text) | Yes — tables and key facts extracted, every value flagged with a page reference and confidence | No | Source-specific reviewed JSON update | Review required; uncertain values are questions, not records |
| PDF (scanned) | Partial — OCR only when available in Claude's environment; otherwise flagged | No | — | Never guessed |
| DOCX | Yes — tables and paragraphs | No | Source-specific reviewed JSON update | Review required |
| Drive-hosted Excel, synced folders | Not yet | Not yet | — | Later connector; needs Drive API scopes and additional sharing steps |
| Databases, POS/marketplace APIs | No | No | — | Export to a Google Sheet first |

**Live means:** the worker reads the file from Google on the schedule using the service
account. A sample uploaded to Claude is never a live connection.

**Manual package means:** the skill embeds reviewed, normalised rows (`records`) in the
setup package; the dashboard imports them once. To refresh one source, follow [Mixed sources](MIXED_SOURCES.md). Row limit 5,000 per entity.
