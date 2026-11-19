# QA Test Plan

**Status:** Approved test plan; the DT-04 POC ran on 16 November 2026. Broader application QA and release targets remain unverified.
**Applies to:** The staged approach in [the implementation plan](IMPLEMENTATION_PLAN.md). Requirement IDs refer to [PDF Editor requirements](docs/requirements/PDF-Editor-Requirements.md).

## 1. Test objectives

- Prove that supported PDFs render, process, and export without silent corruption.
- Verify that failures preserve the original or last known-good output and are explained to the user.
- Establish the supported-PDF and browser matrices with evidence rather than universal claims.
- Verify local-first privacy and block cloud/server claims until their gates are implemented and tested.
- Treat in-place editing and redaction as separate high-risk gates.

## 2. Test environments and inputs

### POC fixture set

The five-file dataset and inspected metadata are recorded in [the POC protocol](docs/poc-protocol-proposal.md). It includes a synthetic contract, a fillable form, a multi-column report, an embedded-font specimen, and a single-column reference. The user approved and froze the protocol on 16 November 2026. Scanned PDFs are excluded from this POC and tracked separately (OD-002).

Use the approved PDF.js version, browser, viewport, rendering settings, and 150 dpi output comparison for original and exported pages as specified in the frozen protocol. The DT-04 execution evidence is recorded in [the test execution report](TEST_EXECUTION_REPORT.md).

### General fixture coverage

Build a separate regression corpus covering selectable text, images, annotations, AcroForms, embedded and missing fonts, varied page sizes, scanned/image-only files, encrypted files, malformed files, and large files. Record fixture provenance and avoid including private user documents without explicit permission.

### Browser and performance matrix

Supported browsers, versions, operating systems, and minimum device capabilities are TBD (NFR-006). The design review proposes a 100 MB file benchmark under 10 seconds and under 1 GB browser memory on an 8 GB reference laptop. These are not approved release targets; confirm the measurement procedure and threshold before using them as pass/fail criteria.

## 3. In-place editing POC gate

| Check | Approved pass condition | Severity / decision |
|---|---|---|
| Caret placement | Within 2 pt of intended character for at least 95% of sampled positions | Isolated out-of-tolerance positions count as misses but are not independently critical. Wrong-glyph, missing-text, or wrong-target edits are critical. |
| Font matching | Preserve original embedded font; otherwise flag fallback in UI | Unflagged substitution is critical |
| Paragraph reflow | Edited paragraph remains inside its paragraph box and does not overlap the next block on every fixture | Any overlap is critical |
| Export fidelity | Reopen output with the same renderer; unedited pages retain text and layout; visual diff no greater than 0.5% per page at 150 dpi | Changed text layer on an unedited page is critical |
| Overall decision | All criteria pass on at least 4 of 5 files and no file has a critical failure | Go supports tested scope; otherwise no-go and overlay-only fallback if approved |

The user approved these POC criteria on 16 November 2026, and the procedures are frozen in [the POC protocol](docs/poc-protocol-proposal.md). The valid DT-04 run passed 121/121 caret samples and export fidelity, but reflow failed on all five fixtures and every output retained original text beneath an overlay, producing a NO-GO. See [the execution report](TEST_EXECUTION_REPORT.md) for run IDs and evidence. Do not infer universal PDF support from this synthetic fixture set.

## 4. Functional and regression coverage

| Area | Representative checks | Requirement references |
|---|---|---|
| Upload/render/export | Valid and invalid type, spoofed MIME, size/page limit, corrupt/encrypted/scanned inputs; page navigation/zoom; output opens and has expected pages | FR-001, FR-002, FR-019, FR-036; AC-001–004 |
| Text/images | Insert text box; POC-gated direct edit; image insert, select, move, resize, rotate, replace, delete | FR-003–005; AC-006–008 |
| State/history | Undo/redo after supported actions; mixed operation order; failed operation does not corrupt prior state | FR-032, FR-034, FR-035; AC-013 |
| Annotation/signature/forms/links | Create/edit/remove, undo, export/reopen; supported AcroForm values persist; external links validated; signatures remain private if stored | FR-006–011 |
| Pages/utilities | Reorder, rotate, delete, extract, insert; merge ordering; split ranges; compression reports when size does not shrink; conversion fidelity/limitations | FR-012–017 |
| Redaction | Inspect exported file for recoverable text, images, vector content, metadata, attachments, hidden layers, annotations, form values, and prior revisions | FR-041; AC-012 |
| Account/library (Release 2 only) | Owner-only access, cross-account denial, folder ownership/cycles, versions, delete/restore/expiry, cross-device latest save | FR-020–031, FR-038–039; AC-009–011 |
| Quotas (Release 2 only) | Boundary at three anonymous tasks; failed jobs/retries do not count per approved policy; repeated download does not count; reset and batch rules | FR-021, FR-024, FR-030 |

## 5. Security, privacy, accessibility, and reliability checks

- No client-side bundle contains storage or provider secrets.
- Local-first workflows make no network upload of document contents without an explicit user action and approved server workflow.
- For any approved server workflow, test authorization on every document operation, private object access, short-lived URL expiry, user consent, temporary file deletion on success and failure, hard maximum age, and logs free of content and file names.
- Test file-signature validation, size/page limits, encrypted/malformed input handling, and safe failure.
- Test keyboard access, visible focus, labels, contrast, and shortcuts without hijacking browser/system shortcuts (NFR-007).
- Simulate render, processing, export, storage, and network failures; confirm useful errors and no false success.
- Test retention/deletion and restore behavior only after the policy is approved. Do not define an implied retention period in test fixtures.

## 6. Execution and release evidence

For each run, record commit/build identifier, environment, browser and OS, test command or manual procedure, fixture IDs, actual results, pass/fail/block status, defects, and evidence location. No planned or unexecuted check may be reported as passed.

Release 1 exit requires all in-scope release checks and a supported-PDF/browser matrix. Redaction has its own pass/fail scope decision. Release 2 exit additionally requires account isolation, quota, privacy lifecycle, and recovery evidence. A failed gate blocks the related feature, not just the report.
