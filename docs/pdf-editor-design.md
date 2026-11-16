# Design: Browser PDF Editor Web App

Status: Approved for development on 15 November 2026, with concerns and gates retained. The user approved the recommendations listed under "Decisions > Approved". Approval covers the direction only. Numbers marked "proposed" are provisional and are not approved. Items under "Parked" and "Pending" are not approved.
Source spec: `docs/requirements/PDF-Editor-Requirements.md` (from `PDF_Editor_SaaS_Complete_Requirements_v0.6.xlsx`)
Mode: Startup (assumed; the spec describes a commercial SaaS with accounts, quotas, and billing)
Stage: Pre-product (assumed; no code exists yet, git has no commits)

## Problem

Users need to view, edit, annotate, sign, and manage PDFs in a browser without installing desktop software. The spec targets Sejda-like parity with Phase 1 covering editing, annotations, signatures, forms, page management, merge/split/compress/convert, accounts, quotas, and a cloud library. Phase 2 (AI, OCR, translation, collaboration) is candidate-only.

## Premises (to confirm)

1. The core differentiator is true in-place text editing. It is also the highest technical risk (OD-001). It cannot be promised until a POC on representative PDFs passes.
2. Most Phase 1 tools (annotate, sign, merge, split, reorder, compress, forms) can run client-side in the browser. Server processing is needed only for storage, accounts, quotas, and heavy conversions.
3. Private PDFs must not leave the device unless the user saves to the cloud library or explicitly submits a file for a server-side conversion. A server conversion uploads the file, requires per-job user consent, and deletes the temporary copy after the job completes or fails. The exact retention window is part of parked NFR-004 / OD-013.
4. Anonymous users get 3 completed tasks before a registration prompt (DEC-003). What counts as a task is still open (OD-006), so the metering definition must be settled before quotas are built.
5. The 3-task limit, pricing, and plan matrix (OD-005, OD-010) are not needed to start building the editor core.

## Approaches

**A. Minimal viable (client-only, no accounts)**
- Summary: Next.js UI, PDF.js for rendering, pdf-lib for merge, split, and page management, and an overlay model for annotations, signatures, and redaction. Files stay in the browser. No cloud storage or accounts.
- Effort: M. Risk: Low.
- Pros: fastest to ship, no server cost, strong privacy story, avoids Vercel limits (OD-004).
- Cons: no in-place text editing, no cross-device library, no quotas or billing, so no revenue path.
- Reuses: existing Next.js scaffold (`src/app/page.tsx`, `src/app/layout.tsx`), vitest.

**B. Ideal architecture (spec as written)**
- Summary: Next.js on Vercel for API routes and UI. PDF.js for rendering. A modular editing adapter behind which open-source libraries sit. Cloudflare R2 for private storage with signed URLs. Cloudflare D1 for metadata, folders, and usage. Async workers for CPU-heavy jobs (NFR-002). Auth and billing providers chosen later (TR-008).
- Effort: XL. Risk: High (in-place editing, Vercel limits, quota and billing scope).
- Pros: matches the full requirements and the commercial model.
- Cons: a lot of unvalidated surface before the POC answers the critical question.
- Reuses: the directory layout already scaffolded under `src/` (`components/editor`, `lib/pdf-engine`, `lib/storage`, `lib/quota`, `server/jobs`).

**C. Lateral: client-first, then server for accounts and heavy jobs (recommended)**
- Summary: Make the browser the processing engine wherever possible (WASM PDF tooling). Run the in-place text editing POC first and only then decide how far the editor goes. Add the server in two stages: stage 1 is storage and accounts for the cloud library, and stage 2 is the async worker for conversions and OCR. Files are processed locally by default, so privacy and cost are both helped.
- Effort: L. Risk: Medium, mainly in the POC.
- Pros: cuts server cost and privacy exposure, sidesteps Vercel memory and duration limits for most tasks, and makes the POC a go/no-go gate instead of a late surprise.
- Cons: client-side processing of big files depends on device memory. Conversions still need a server.

**RECOMMENDATION:** Choose C because it sequences the highest-risk item (OD-001) first and keeps server cost and privacy exposure low until the product is validated. It also produces a working editor sooner than B.

## Gates before core editing

0. Demand gate: before account, storage, and billing work starts, get evidence that target users want the editor and would pay for it. Evidence can be a short user interview set or a waitlist. Until it exists, only the client-side work in approach C proceeds.
1. Feature-by-library licence screen (OD-003). Run it first, so the POC does not depend on a library that cannot be used commercially.
2. Run the technical POC (DEV-02, OD-001, REL-002) on text-based PDFs only: the contract, form, multi-column report, and embedded-font files. Scanned files are excluded here and handled by gate 4.
   - Eligible set: at least 5 text PDFs, each with a stated page count and font list.
   - Caret placement: a click lands within 2 pt of the intended character on at least 95% of test positions.
   - Font matching: an edited run uses the original font family when it is embedded; otherwise the fallback is flagged in the UI.
   - Reflow: an edit in a paragraph keeps line breaks within the paragraph box and never overlaps the next block, measured on every test PDF.
   - Export fidelity: re-opening the exported file in PDF.js shows the same text and layout for all unedited pages, with a visual diff under an agreed threshold.
   - Dataset is fixed before the run: 5 named files, each with a page count, font list, and sampling plan (every page, or at least 10 pages for files longer than 50 pages).
   - Visual diff threshold is fixed before the run: a pixel-difference ratio of at most 0.5% per page at 150 dpi, measured with the same renderer for both sides.
   - Must-pass cases: a caret miss, a font substitution without the UI flag, a paragraph overlap, or a changed text layer on an unedited page is a critical failure. Any critical failure on any file is a no-go for that file.
   - Go: all criteria pass on at least 4 of 5 files and no file has a critical failure. No-go: otherwise.
   - Outcome (single decision tree): Go means approach C continues with in-place text editing. No-go means approach C continues with overlay text only, and the product says so. The POC does not select approach B. Choosing B needs a separate decision after the demand gate.
   - These thresholds are proposals made in the review (not user-approved numbers). They can be changed only before the POC runs.
3. Benchmark large files against browser and Vercel limits (OD-004). Proposed thresholds, to be confirmed in this gate: client-side processing must stay under 10 s and 1 GB of browser memory for a 100 MB file on a reference laptop with 8 GB RAM. Larger files go to the server path, which needs per-job consent (Premise 3).
4. Detect scanned PDFs and label them (OD-002).

True redaction has its own gate, separate from the POC. Redaction ships only if a threat-model review and tests show removed content is not recoverable. The threat model covers the text layer, images (including image masks and smask data), vector paths, document metadata (XMP, info dictionary), embedded attachments, optional content (hidden layers), annotations, form field values, and incremental revisions (earlier xref sections). Tests run on the exported file, not the editor state, and check each content type (text, image, vector) and each surface above. A content type or surface that fails is excluded from redaction and is not described as secure redaction in the product.

## Decisions

Approved (user said "go ahead with recommendation"). Approval covers the direction. Numeric values stay provisional until the cost model is checked:

- **OD-005 Feature matrix (direction approved; numbers provisional):**
  - Anonymous: 3 completed tasks total, no cloud library, no account. Registration prompt on the 4th task (DEC-003, FR-024).
  - Free (registered): cloud library, 10 completed tasks per calendar month, storage cap in OD-007 below.
  - Pro: higher task and storage limits. Exact prices are parked with OD-010.
- **OD-006 What counts as one task (proposed):**
  - A task is one workflow run that produces a downloadable or saved output. Each run of a batch job counts once per input file.
  - Retries of a failed job do not count. Previewing, editing without export, and downloading the same output again do not count.
  - Anonymous limit is lifetime. Free limit resets on the first day of each calendar month. Anonymous counting is per browser, so it can be bypassed by clearing storage; accepted for Phase 1, and the limit is enforced server-side for registered users.
- **OD-007 Storage and versions (proposed):** Free 1 GB, Pro 20 GB, per-file upload limit 100 MB for Phase 1. Keep 5 versions per file. Retention of deleted files is 30 days in trash. Final numbers come after R2 cost estimation.
- **OD-008 Deleting a non-empty folder (proposed):** Block deletion until the folder is empty. The user must move or delete the contents first. This avoids silent data loss and avoids a second trash mechanism in Phase 1.
- **OD-009 Maximum folder depth (proposed):** 5 levels. Confirm in UX design.
- **FR-041 vs AC-012 Redaction:** True redaction ships in Phase 1 and FR-041 is raised to Must. AC-012 already tests it, and the Security sheet requires it to be true redaction (content removed, not covered). This depends on the in-place editing POC for text removal; if the POC cannot remove text cleanly, redaction ships for image and vector regions only and that limit is stated in the product.
- **Source fixes (spec §17), confirmed as recorded here:**
  1. Roadmap "My Documents" row: values realigned to their columns in the workbook. The ID is not in the source and was not invented, so the cell reads "(missing - not in source)" until the owner supplies it.
  2. Missing AC-005: confirm it was removed on purpose and leave the gap, so existing references keep their numbers.
    3. Mixed column layout in Acceptance Criteria: not applied. Not in the user's explicit list; still open.
    4. Stray seventh column in Technical Requirements: not applied. Not in the user's explicit list; still open. TR-009 to TR-011 keep their current columns.
  5. Duplicate stories: US-012 is merged into US-006 and US-013 into US-007.
  6. FR-024 / FR-030 / OD-006: the 3-task anonymous limit is final (DEC-003). Metering is defined by OD-006 above.
  7. FR-028 / DEC-005: align FR-028 to "Agreed direction" and include recent uploads in Phase 1.
  8. Redaction priority: see FR-041 above.

Pending (not approved; the numbers above need a cost model check before launch):

- Storage and task numeric values in OD-005, OD-007 are proposals until R2 cost estimation and the feature matrix are checked.
- Redaction scope (FR-041) depends on the redaction gate above.
Auto-decided (user said "go ahead with recommendation"; the user was unavailable for follow-up, so these are flagged for review):

- **Server conversion deletion rules (auto-decided, blocks any server upload):** the temp copy is deleted on success and on failure; logs and error reports must not contain file contents or file names; temp storage has a hard maximum age; and backup treatment follows NFR-004 / OD-013. The server path stays blocked until that item is decided.
- **Stage split (auto-decided):** Phase 1 ships in two releases. Release 1 is the client-side editor and tools (no accounts, no server). Release 2 adds the cloud library, quotas, and server conversions, and needs the demand gate and the deletion rules above first.
- **Roadmap row priority (auto-decided):** "Should", to match FR-029 and FR-031. US-007 says Must, so this is a known conflict to resolve.

Still pending:

- Numeric values in OD-005 and OD-007 need a cost model check before launch.
- Redaction scope (FR-041) depends on the redaction gate above.
- The POC has not been run.

Parked (user will decide later):

- **TR-008 / OD-010:** auth provider, payment provider, target markets.
- **NFR-004 / OD-013:** retention, deletion, backup (RTO/RPO), data residency.

Note: the source workbook (`docs/requirements/PDF_Editor_SaaS_Complete_Requirements_v0.6.xlsx`) has these edits: roadmap "My Documents" row realigned (ID still missing); FR-024, FR-030, and FR-041 statuses updated; Decision Log notes for DEC-003, 004, 005, 011, and 014; OD-005 to OD-009 marked decided or provisional; OD-010 and OD-013 marked Parked. US-012 and US-013 already read as merged into US-006 and US-007, and their rows are kept. A backup is at `PDF_Editor_SaaS_Complete_Requirements_v0.6.backup.xlsx`. Still open: the roadmap ID, the AC-005 gap, and the TR-009 to TR-011 status column.

## Assignment

Within one week, after the licence screen (gate 1), run the in-place text editing POC (DEV-02) on the fixed five-file dataset described in gate 2. Scanned PDFs are excluded and tracked under OD-002. Score each file against the predefined criteria. The result decides between in-place editing and overlay-only text, as described in gate 2. It does not select approach B.

## Out of scope for this doc

No code, scaffolding, or repo changes beyond this file. The spec in `docs/requirements/` is unchanged apart from the §17 resolutions noted there.

## GSTACK REVIEW REPORT

Runs / Status / Findings

| Item | Result |
|---|---|
| Skill | /gstack-plan-ceo-review (condensed pass; the full 11-section procedure was not run) |
| Mode | SCOPE REDUCTION (auto-decided; more than 15 planned changed files; user unavailable for the mode question) |
| Outside voice | GitHub Copilot CLI v1.0.112 (replaces Codex CLI, as the user requested). Run by file-path reference; 7 findings. Process exit code was 1 after valid output, so the output was used and the exit code was not treated as a failure. |
| Findings applied | 7 of 7 (listed below) |
| Open risks | No demand evidence yet; the POC has not been run; redaction has no passing evidence; numeric limits have no cost model |

Outside-voice findings and how they were applied:
- Redaction threat model (High): per content type and surface gate, tested on the exported file.
- Server deletion and backup rules (High): auto-decided, listed under Decisions.
- POC criteria undefined (High): dataset, thresholds, and go/no-go fixed before the run.
- Approval vs provisional numbers (Medium): approval covers direction only; numbers marked provisional.
- POC outcome vs continue-with-C gate (Medium): single decision tree in gate 2.
- No device or latency thresholds (Medium): gate 3 thresholds, marked proposed.
- Phase 1 needs staged gates (Medium): two-release stage split.

Auto-decisions to review (the user said "go ahead with recommendation" but was not available for follow-up):
- Roadmap row priority "Should" (US-007 says Must; conflict left visible).
- DEC-005: recent uploads in Phase 1.
- OD-005 to OD-009 statuses: decided or provisional, as recorded in the workbook.
- FR-024, FR-030, FR-041 statuses in the workbook.
- Server deletion rules and the two-release stage split.
- Report location: this design doc (not the gstack ceo-plans archive).

VERDICT: READY FOR THE POC STEP ONLY. Platform work (accounts, storage, billing) is blocked by the demand gate, and the server path is blocked by NFR-004 / OD-013.

NO UNRESOLVED DECISIONS


