# Development Tasks

**Status:** Approved development backlog as of 15 November 2026. Tasks remain subject to their listed dependencies and exit evidence.  
**Source of truth:** [Implementation plan](IMPLEMENTATION_PLAN.md), [technical architecture](TECHNICAL_ARCHITECTURE.md), [requirements](docs/requirements/PDF-Editor-Requirements.md), and [design review](docs/pdf-editor-design.md).

## Current checkpoint (16 November 2026)

- DT-01 is approved; DT-02's commercial license screen is complete.
- DT-03 is complete. Five synthetic fixtures are generated and inspected, the user approved the protocol on 16 November 2026, and the procedures are frozen in [the POC protocol](docs/poc-protocol-proposal.md) (Section 6). Caret samples are in [caret_samples.json](tests/fixtures/poc/caret_samples.json).
- DT-04 is complete. The five-fixture POC ran in the verified reference environment and returned NO-GO: caret anchors and export fidelity passed, but all fixtures failed reflow and the output retained original text beneath an overlay. See [the execution report](TEST_EXECUTION_REPORT.md) and [valid run summary](tests/fixtures/poc/results/20261116T170536Z/summary.json).
- The initial run used an invalid viewport and is retained as evidence but excluded from the decision. No production PDF dependency, server-processing workflow, or deployment has been added; the POC used pinned development dependencies and a local-only server.

**Next steps:** Complete DT-05 by recording approval of the evidence-based NO-GO and explicitly deciding whether any overlay-only text editing is in scope; do not treat it as in-place editing. Once DT-05 is recorded, proceed to DT-06, then DT-07. Keep DT-08 blocked until its text-editing scope follows the approved DT-05 decision. Any new editing approach or changed criteria requires a separately approved protocol before another POC run.

## 1. Ordered task list

| ID | Task | Dependencies | Exit evidence | State |
|---|---|---|---|---|
| DT-01 | Review and approve the planning documents | None | User approval and disposition of open assumptions | Done |
| DT-02 | Complete commercial license screen | DT-01 | Feature-by-library matrix; excluded candidates and obligations recorded | Done |
| DT-03 | Freeze POC dataset, thresholds, and test procedure | DT-01, DT-02 | Five named PDFs, page counts, font lists, sampling plan, reference renderer, and approved thresholds recorded | Done |
| DT-04 | Implement and run the in-place text-editing POC | DT-02, DT-03 | Results for caret placement, font handling, reflow, and output fidelity for each fixture | Done |
| DT-05 | Make and record the POC go/no-go decision | DT-04 | Decision follows the approved gate; supported scope and fallback are explicit | Pending |
| DT-06 | Build Release 1 upload, validation, rendering, and export foundation | DT-01, DT-05 | Focused tests for valid, unsupported, corrupt, encrypted, and oversized inputs; original preserved; valid export | Pending |
| DT-07 | Implement shared document state, commands, selection, and undo/redo | DT-06 | Cross-tool state/history behavior tested; no assumed persistence across reloads | Pending |
| DT-08 | Implement approved text and image editing | DT-05, DT-06, DT-07 | Text scope follows POC decision; insert/manipulate/export tests pass | Pending |
| DT-09 | Implement approved annotations, shapes, and signatures | DT-06, DT-07 | Create/edit/delete/undo/export tests pass; signature data protected if stored | Pending |
| DT-10 | Implement supported forms, links, and page operations | DT-06, DT-07 | Supported AcroForm, link, reorder/rotate/delete/extract/insert tests pass | Pending |
| DT-11 | Implement approved client-side PDF utilities and conversions | DT-02, DT-06 | Merge/split/compress/convert output and performance evidence; unsupported formats disclosed | Pending |
| DT-12 | Evaluate and implement redaction only for passing content types | DT-02, DT-06 | Threat model and exported-file extraction/content-surface tests pass; unsupported types excluded | Pending |
| DT-13 | Run Release 1 compatibility, accessibility, reliability, and performance QA | DT-06 through DT-12 | QA report, supported-PDF/browser matrix, and launch-gate disposition | Pending |
| DT-14 | Validate demand and approve cloud data lifecycle and cost model | DT-01 | Demand evidence; retention/deletion/backup/residency policy and cost assumptions approved | Pending |
| DT-15 | Select auth/payment providers and finalize plan/usage rules | DT-14 | Provider decisions, target markets, quota and storage rules approved | Pending |
| DT-16 | Implement Release 2 accounts, library, folders, versions, and quotas | DT-13, DT-14, DT-15 | Cross-account isolation, save/recovery, quota, and lifecycle tests pass | Pending |
| DT-17 | Implement approved server conversion workflows | DT-14, DT-15, DT-16 | Per-job consent, size/format validation, success/failure cleanup, and non-sensitive logging verified | Pending |

## 2. Dependency notes

- DT-01 is the hard implementation gate. No feature or infrastructure task may start before approval.
- DT-02 is a prerequisite to the POC and to any library-dependent feature.
- DT-02's preliminary matrix and dispositions are recorded in [the PDF engine license screen](docs/pdf-engine-license-screen.md). Recheck exact versions and transitive notices when dependencies are selected.
- DT-03 records the fixed POC contract. Dataset or threshold changes after a run starts require a new approved test plan.
- DT-03's approved protocol is in [the POC protocol](docs/poc-protocol-proposal.md). Five generated fixtures are present and inspected; DT-04 results are recorded in [the execution report](TEST_EXECUTION_REPORT.md).
- DT-05 gates in-place text editing. A no-go does not imply the server-first architecture; it limits text editing to the explicitly approved fallback.
- DT-14 and DT-15 are independent of the client-side Release 1 work after DT-01, but block Release 2.
- DT-12 is independent of the POC result except where text removal depends on it. It still requires a separate redaction gate.
- DT-17 must not upload documents until the approved server data-lifecycle and consent controls exist.

## 3. Deferred / not in this backlog

Phase 2 candidates (AI chat, summarization, extraction, OCR enhancements, translation, comparison, batch, cloud integrations, and collaboration) are not implementation commitments. Add them only after a separate scope decision based on Release 1 evidence.
