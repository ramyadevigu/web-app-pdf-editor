# Technical Architecture

**Status:** Approved for development on 15 November 2026. Open technical choices remain subject to the gates below and in the implementation plan.  
**Planning basis:** The approved direction is Approach C (client-first, then server capabilities when justified) in [the design review](docs/pdf-editor-design.md). The detailed release split below is a planning assumption recorded as an auto-decision in that review, not an independently confirmed decision.  
**Requirements source:** [PDF Editor requirements](docs/requirements/PDF-Editor-Requirements.md)

## 1. Architecture goals

- Process documents in the browser by default; do not upload private PDFs unless a user explicitly chooses an approved server-side workflow.
- Make PDF rendering, editing, and export separate concerns. PDF.js is a rendering candidate, not an assumed editing engine.
- Keep the editing engine behind an adapter so a different open-source library or a commercial SDK can be evaluated later.
- Preserve the original input and make export/save failures visible. Never report success until a valid output exists.
- Defer accounts, cloud storage, billing, quotas, and server-side conversion until their product and privacy gates are met.
- Do not claim arbitrary-PDF text editing, OCR, or secure redaction until the corresponding gates pass.

## 2. Current repository baseline

The repository is a Next.js 16 / React 19 TypeScript scaffold. `src/app/page.tsx` is a placeholder, and the planned `src/components`, `src/lib`, and `src/server` areas contain no feature implementation. `package.json` does not yet include a PDF renderer or editing library. The architecture below is therefore a target, not a description of shipped behavior.

## 3. Logical components and data flow

### Release 1 planning assumption: browser-only editor and tools

```text
Next.js application shell
  ├─ Upload / tool selection / status feedback
  ├─ Editor workspace
  │    ├─ Page renderer (PDF.js candidate)
  │    ├─ Selection and tool interactions
  │    └─ Shared document state and command history
  └─ Tool modules
       └─ PDF engine adapter
            └─ Candidate PDF libraries (license- and POC-gated)

Local file → validate → render → edit/process in browser → generate PDF → download
```

- The UI owns workflow state and delegates PDF operations through a typed engine boundary.
- A shared document state and command/action model is the intended basis for selection, undo/redo, and export consistency. Its exact API is open (TR-010).
- Rendering and editing must remain distinct: the renderer displays pages and supports coordinate interaction; it does not establish that the editing engine can modify original PDF content.
- Page operations and supported tools should stay modular. Do not select or add a library until the feature-by-library license screen and required POC are complete.
- Keep the original file separate from modified output. Preserve a last known-good output when an operation or save fails.
- Anonymous recent-file behavior and browser persistence need an approved retention policy before implementation. Do not imply durable cloud storage in Release 1.

### Release 2 planning assumption: accounts and cloud services

Release 2 is planned only after demand evidence and the server data-lifecycle policy are approved. This staged release is an auto-decision in the design review and remains subject to review with this document set.

```text
Next.js UI → Next.js API routes / Vercel Functions
                  ├─ Auth provider (TBD)
                  ├─ Cloudflare D1: metadata, folders, plans, usage
                  └─ Cloudflare R2: private PDF objects and derived files
```

- Next.js API routes / Vercel Functions are the agreed backend direction; validate limits and cost against real workloads.
- Cloudflare R2 is the agreed object-storage direction; buckets remain private, access is owner-checked, and signed URLs (if used) are short-lived.
- Cloudflare D1 is the agreed metadata direction. Do not store PDF binaries in D1.
- Auth and payment providers, target markets, quota values, retention, residency, and backup/recovery objectives are not finalized.
- Heavy or long-running conversions must not be forced into a serverless request. An async queue/worker is a future option, introduced only after workload evidence and an explicit design decision.
- Any server-side file processing remains blocked until retention, deletion, temporary-file, logging, and backup treatment are resolved. Server logs must not contain file contents or original file names.

## 4. PDF editing feasibility and product gates

### In-place text editing POC

The highest-risk operation is editing existing selectable text with a caret and preserving typography and layout. The POC must follow the design review's order: complete a commercial-license screen first, then test text-based PDFs. A five-fixture proposal and inspected metadata are recorded in [the POC protocol](docs/poc-protocol-proposal.md); its dataset, thresholds, and sampling plan must be approved before execution.

The proposed POC contract is:

- At least five named text PDFs, including contract, form, multi-column report, and embedded-font examples. Record page count and fonts for each. Scanned PDFs are excluded.
- Sample every page, or at least ten pages for files longer than 50 pages.
- Caret placement within 2 pt of the intended character at 95% or more of sampled positions.
- Preserve an embedded original font; flag any fallback in the UI.
- Keep edits within the paragraph box without overlap with the next block on every test PDF.
- Reopen exports in the same PDF.js renderer and compare unedited pages at 150 dpi; proposed maximum visual pixel-difference ratio is 0.5% per page.
- Go only if all criteria pass on at least four of five files and no file has a critical failure. A caret miss, unflagged font substitution, paragraph overlap, or changed text layer on an unedited page is critical.

These numeric thresholds are proposed in the design review and must be confirmed before the POC. A go supports continued in-place text editing for the tested scope; it does not prove arbitrary-PDF support. A no-go means text is overlay-only and must be described that way. It does not select the larger server-first architecture.

### Redaction gate

Redaction is separate from the text-editing POC. Ship only a validated implementation that removes content from the exported file, rather than covering it visually. Validate the output against text, images (including masks/smask data), vector paths, metadata, attachments, hidden layers, annotations, form values, and incremental revisions. A failed content type or surface is excluded and must not be marketed as secure redaction. If text removal cannot be proven, restrict the feature to the content types that pass and disclose that limit.

## 5. Conceptual data boundaries

The Release 1 document representation is in-memory and local-first. Its final schema is open; it must support the shared selection, command history, and export behavior without treating rendered pixels as the source of truth.

For a future cloud release, the requirements describe conceptual `User`, `Folder`, `Document`, `DocumentVersion`, `UsageEvent`, `Subscription`, and optional `Signature` records. These are not approved database schemas. Enforce ownership from the authenticated session, prevent folder cycles, keep object keys private, and do not store payment-card data. Signature images are sensitive and require owner-only access and deletion.

## 6. Decisions and constraints still open

| Topic | Current direction | Not finalized |
|---|---|---|
| Rendering | PDF.js candidate; initial license pass recorded in [the license screen](docs/pdf-engine-license-screen.md) | Compatibility and supported-PDF matrix |
| Editing/export | Open-source libraries behind an adapter; pdf-lib is only a utility/overlay candidate | Exact library selection, dependency notices, and POC outcome |
| Server hosting | Next.js on Vercel | Plan, function limits, and workload fit |
| Cloud storage/database | R2 / D1 direction | Retention, cost, recovery, residency, and final schema |
| Accounts/payments | Integrate providers later | Provider, markets, and pricing |
| Usage/storage values | Direction exists in design review | Proposed quotas and metering require cost check and approval |
| Browser support/performance | Must be tested | Browser matrix and approved targets |

## 7. Implementation boundary

The user approved this document set for development on 15 November 2026. Proceed in the implementation-plan sequence: the commercial license screen and POC gates still precede library selection or feature implementation, and server upload paths remain blocked by the data-lifecycle gate. This approval does not resolve open technical choices or approve provisional values.
