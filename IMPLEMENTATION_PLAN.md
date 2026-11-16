# Implementation Plan

**Status:** Approved for development on 15 November 2026. Work remains subject to the sequence and exit gates below.  
**Basis:** Client-first Approach C is the approved direction in [the design review](docs/pdf-editor-design.md). This plan treats the two-release split as a reviewable planning assumption because the source marks it as auto-decided. See [the requirements](docs/requirements/PDF-Editor-Requirements.md) for requirement IDs and open decisions.

## 1. Delivery rules

1. The user reviews and approves this document set before any feature implementation starts.
2. Resolve the commercial-license screen before selecting a PDF library or building the POC.
3. Run the in-place text-editing POC before committing to that capability in the editor. Its numeric dataset and thresholds are proposed and must be frozen before the run.
4. Keep Release 1 client-side. Do not start accounts, cloud storage, quota enforcement, billing, or server file processing in that release.
5. Start Release 2 only after demand evidence and the file-lifecycle rules required for server uploads are approved. Provider and cost decisions remain separate gates.
6. Every shipped workflow must have real processing, clear failure states, and valid-output checks. Do not expose placeholder controls or unsupported privacy/security claims.

## 2. Sequence and exit gates

| Stage | Work | Entry conditions | Exit criteria |
|---|---|---|---|
| 0. Plan approval | Review and approve these six documents; resolve or explicitly defer marked assumptions. | Draft set delivered. | User approval recorded on 15 November 2026; remaining assumptions and open decisions stay subject to their stated gates. |
| 1. License screen | Build a feature-by-library/license matrix for candidate rendering, editing, forms, annotations, and export tools. | Stage 0 approved. | Commercial-use constraints, attribution, and redistribution obligations documented; candidates that fail are excluded. Evidence: [license screen](docs/pdf-engine-license-screen.md). |
| 2. POC definition and run | Freeze five named text-PDF fixtures, sampling, renderer, comparison method, and thresholds; implement and evaluate only the POC. | License screen passed; POC contract approved. | Results recorded per file; explicit go/no-go decision. No full editor commitment based solely on a partial pass. |
| 3. Release 1 foundation | Build the local upload, validation, render, editor shell, shared state/action boundary, and safe export path. | Stage 2 decision recorded; architecture approved. | Valid and unsupported input handling, clear states, original preservation, and export integrity pass focused tests. |
| 4. Release 1 tools | Add approved client-side editing, annotation, signature, page, and utility workflows in requirement-priority order. | Foundation passes; each tool has a feasible licensed engine path. | Each included workflow meets its acceptance criteria and supported-PDF matrix. Unsupported conversion/server-only work is disclosed or deferred, not simulated. |
| 5. Release 1 QA and launch gate | Run functional, PDF integrity, privacy, accessibility, compatibility, and performance tests; separately evaluate redaction. | Release 1 scope implemented. | All applicable release checks pass; any unsupported feature or known limitation is documented before launch. |
| 6. Release 2 discovery gate | Validate demand and approve data retention/deletion/backup rules; confirm costs and provider decisions. | Can proceed independently after Stage 0; required before Release 2 implementation. | Demand evidence, server data-lifecycle policy, cost assumptions, and account/provider choices are accepted. |
| 7. Release 2 platform | Add accounts, private cloud library, folders, versions, quotas, and only approved server conversions. | Stage 6 gate passed. | Owner-isolation, deletion/retention, quota, recovery, and consent tests pass. |
| 8. Phase 2 discovery | Prioritize AI/OCR, batch, collaboration, and integrations from usage and user evidence. | Release 1 feedback; no Phase 2 commitment implied. | Separate approved scope and plan. |

The source design proposes completing the POC within one week after the license screen. Treat that as a proposed planning target, not a delivery commitment, until the dataset and resourcing are approved.

## 3. Release scope

### Release 1: client-first editor and tools

This is the planning interpretation of the design review's auto-decided stage split. It excludes accounts and server dependencies. Start with upload, rendering, local processing, and export. Add only workflows with a viable licensed implementation and testable output. The requirements list editing, annotations, signatures, links/forms, page management, merge/split/compress, conversion, and security tools; individual items remain subject to the source requirement status, technical feasibility, and acceptance evidence.

- If the text-editing POC passes, implement in-place editing for the supported matrix and retain explicit unsupported-file handling.
- If it fails, implement overlay text only if approved as scope; do not describe it as in-place editing.
- Redaction is a separately gated feature. A visual whiteout is never secure redaction.
- Client-side conversion may be included only where quality and performance are demonstrated. Do not silently substitute server upload for a failing browser workflow.
- Anonymous task limits and persistent recent-document behavior must not be represented as implemented until their counting and retention rules are approved.

### Release 2: accounts and cloud services

This is blocked on demand evidence and approved data-lifecycle rules. The planned direction is Next.js API routes/Vercel Functions, Cloudflare R2 for private objects, and Cloudflare D1 for metadata. Auth and billing providers remain TBD. Proposed storage/task limits require a cost model and approval. Server conversions require per-job consent, temporary-file deletion on success and failure, non-sensitive logs, a hard maximum temp age, and approved backup/retention treatment.

## 4. Cross-cutting acceptance gates

- Preserve the original; failed edits, saves, and exports do not destroy the last known-good file.
- Validate file signature, size, and supported/encrypted/malformed/scanned status; return actionable errors.
- Report success only after generating and validating output.
- Keep PDF processing local by default. Clearly disclose any explicitly chosen server workflow.
- Do not claim secure redaction without output-level removal tests.
- Confirm browser support, performance limits, and quota numbers before using them as product commitments.

## 5. Decisions required during document approval

The following are not silently resolved by this plan:

- Whether the proposed two-release split is approved as a delivery boundary.
- The final POC thresholds and reference hardware, plus the names of the fixed test PDFs.
- Whether a no-go text-editing outcome permits overlay-only text in Release 1.
- Which Release 1 tools and conversion formats are essential after the license/feasibility screen.
- Demand evidence acceptable to start Release 2.
- Server retention, deletion, backup, residency, and consent rules.
- Quota/storage values, cost model, authentication/payment providers, and target markets.

Until these documents are approved, the only work performed is document preparation and review.
