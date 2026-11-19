# Known Issues and Open Risks

**Status:** Planning register; no implementation issue is represented as fixed.  
**Source:** [Design review](docs/pdf-editor-design.md), [requirements](docs/requirements/PDF-Editor-Requirements.md), and [test execution report](TEST_EXECUTION_REPORT.md).

## 1. Blockers and technical risks

| ID | Issue / risk | Impact | Current disposition / gate |
|---|---|---|---|
| KI-001 | In-place editing of arbitrary PDF text has not been proven. | Core differentiator may not be feasible across the intended file set. | DT-04 evidence yields NO-GO for the tested overlay candidate: reflow failed and original text remains beneath the overlay. Formal decision remains pending DT-05. No full implementation or arbitrary-PDF support claim before a separate go decision. See [the execution report](TEST_EXECUTION_REPORT.md). |
| KI-002 | No candidate-library feature/license matrix exists. | A technically suitable library may not permit commercial use or required distribution. | Initial screen complete; see [PDF engine license screen](docs/pdf-engine-license-screen.md). Exact dependency/version and transitive notices remain gated. |
| KI-003 | POC results are specific to the five synthetic fixtures and frozen reference environment. | Results do not establish support for arbitrary PDFs or other browsers. | DT-03 procedures are frozen and DT-04 has a valid run; see [the POC protocol](docs/poc-protocol-proposal.md) and [the execution report](TEST_EXECUTION_REPORT.md). |
| KI-004 | Scanned/image-only PDF editing is not in the text-editing POC; OCR path is undecided. | Users may mistake selectable-text support for scanned-document support. | Detect and label scanned files; do not imply OCR or in-place editing for them. |
| KI-005 | Secure redaction has no passing output-level evidence. | Visual covering could leave content recoverable. | Separate redaction gate across all content surfaces; exclude any failing content type and make no secure-redaction claim. |
| KI-006 | Demand evidence for the cloud/account platform is not recorded. | Building storage, accounts, and billing before validating demand adds cost and privacy scope. | Demand gate blocks Release 2 platform work. |
| KI-007 | Server upload lifecycle is incomplete. | Temporary files, backups, logs, or deletion behavior could violate user expectations. | No server file processing until retention, deletion, maximum temp age, logging, backup, residency, and consent rules are approved. Temporary copies must be deleted on success and failure; logs must omit file contents and file names. |
| KI-008 | Proposed quotas, storage limits, and usage counting still need cost/behavior approval. | Product promises and quota enforcement could be wrong or unfair. | Cost model and explicit approval required before implementing plan limits. The three-task anonymous quota direction is approved; detailed OD-006 counting remains a proposal. |
| KI-009 | Auth/payment providers, target markets, and pricing are undecided. | Release 2 account and billing workflows cannot be finalized. | Resolve before Release 2; never store payment-card data. |
| KI-010 | Browser limits, Vercel limits, conversion fidelity, and supported formats are unmeasured. | Large or complex files may fail or require an unapproved server upload. | Benchmark and define support matrix; add async workers only after evidence and a separate decision. |
| KI-011 | The two-release split remains a planning boundary, not a separately resolved product decision. | Team may begin with different release boundaries than planned here. | User approved the planning documents for development on 15 November 2026; retain this split for staged work and confirm any change before altering release scope. |
| KI-012 | Earlier POC documents conflict on whether every caret miss is critical. | The go/no-go result changes depending on whether an out-of-tolerance sample is allowed within the 5% margin. | The user-approved POC protocol resolves this for the POC: isolated misses count toward the 95% criterion; wrong-glyph, missing-text, or wrong-target edits remain critical. |

## 2. Source alignment items

- The design review says FR-041 redaction is Must and gated, while the requirements document's requirement-count summary still lists FR-041 under Should. This document set follows the design decision (Must, separately gated); reconcile the source summary before treating it as authoritative.
- The My Documents roadmap entry has no source ID. Its priority was auto-decided as Should, while US-007 says Must. Keep this conflict visible; do not invent an ID or silently resolve the priority.
- The requirements and design documents identify several provisional numeric values and open decisions. None are promoted to approved release commitments by this planning set.
- The current repository remains a placeholder scaffold with no production PDF engine or editor implementation. A local-only POC harness and its evidence exist; see [test execution report](TEST_EXECUTION_REPORT.md).

## 3. Approval boundary

The user approved the planning documents for development on 15 November 2026. Development may proceed in sequence, subject to the applicable stage gates. Open assumptions and provisional values remain unresolved unless explicitly approved; no library-dependent implementation, infrastructure provisioning, account flow, or server upload may bypass its gate.
