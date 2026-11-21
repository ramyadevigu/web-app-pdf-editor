<!-- /autoplan restore point: "F:\\RamyaDevi\\web-app-pdf-editor\\.gstack\\tmp\\autoplan\\main-autoplan-restore-20261121-174636.md" -->
## Implementation plan
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
| 1. License screen | Build a feature-by-library/license matrix for candidate rendering, editing, forms, annotations, and export tools, including open-source, commercial SDK, embedded SaaS, and server-processing alternatives. | Stage 0 approved. | Commercial-use constraints, attribution, redistribution obligations, time-to-launch, gross margin, lock-in, fidelity, and total cost are documented; run 2–3 complete vertical prototypes on identical fixtures and score browser, SDK, and server approaches empirically. Candidates that fail are excluded. Evidence: [license screen](docs/pdf-engine-license-screen.md). |
| 2. POC definition and run | The completed DT-04 run used the approved DT-03 fixture set, thresholds, and reference environment. | License screen passed; POC contract approved; DT-04 run complete. | DT-05 explicitly records the NO-GO controlling decision; no POC rerun or in-place-editing commitment is implied. A changed approach or changed criteria requires a newly approved protocol. Freeze a 5–7 day and 40–60 engineering-hour proposal, fixed budget, reference machine profile, fixture set, named approver, and stop rule before reruns. |
| 3. Release 1 foundation | Build the local upload, validation, render, editor shell, shared state/action boundary, and safe export path for one named ICP, workflow, distribution channel, measurable wedge, paid-pilot price/duration, and activation/abandonment success criterion. | Stage 2 decision recorded; architecture approved. | Valid and unsupported input handling, clear states, original preservation, export integrity, named ICP/workflow/channel fit, paid-pilot evidence, measurable differentiation, and explicit stop/abandon triggers pass focused checks. |
| 4. Release 1 tools | Add approved client-side editing, annotation, signature, page, and utility workflows in requirement-priority order. | Foundation passes; each tool has a feasible licensed engine path. | Each included workflow meets its acceptance criteria and supported-PDF matrix. Unsupported conversion/server-only work is disclosed or deferred, not simulated. |
| 5. Release 1 QA and launch gate | Run functional, PDF integrity, privacy, accessibility, compatibility, and performance tests; separately evaluate redaction. | Release 1 scope implemented. | All applicable release checks pass; any unsupported feature or known limitation is documented before launch. |
| 6. Release 2 discovery gate | Validate demand and approve data retention/deletion/backup rules; confirm costs and provider decisions. | Can proceed independently after Stage 0; required before Release 2 implementation. | Document owner-approved target-market segments and demand evidence. Proposed quantitative acceptance evidence is 15 interviews across 2 segments, 3 paid pilots or 10 design-partner commitments, and a repeat-purchase/acquisition threshold; an owner may approve different values. Define interview and segment rules, pilot price/duration, activation/abandonment metrics, repeat-purchase/acquisition threshold, and stop criteria. Then approve the server data-lifecycle policy, cost assumptions, and account/provider choices. |
| 7. Release 2 platform | Add accounts, private cloud library, folders, versions, quotas, and only approved server conversions. | Stage 6 gate passed. | Owner-isolation, deletion/retention, quota, recovery, and consent tests pass. |
| 8. Phase 2 discovery | Prioritize AI/OCR, batch, collaboration, and integrations from usage and user evidence. | Release 1 feedback; no Phase 2 commitment implied. | Separate approved scope and plan. Document the six-month failure scenario and stop/pivot triggers for demand, engineering cost, supported-PDF coverage, export reliability, and incumbent-switch evidence. |

The source design proposes completing the POC within one week after the license screen. Treat that as a proposed planning target, not a delivery commitment, until the dataset and resourcing are approved.

## 3. Release scope

### Release 1: client-first editor and tools

This is the planning interpretation of the design review's auto-decided stage split. It excludes accounts and server dependencies. Start with one approved ICP and a measurable differentiator, then upload, rendering, local processing, and export. Add only workflows with a viable licensed implementation and testable output. The requirements list editing, annotations, signatures, links/forms, page management, merge/split/compress, conversion, and security tools; individual items remain subject to the source requirement status, technical feasibility, and acceptance evidence.

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
- Quota/storage values, cost model, authentication/payment providers, and target markets. Target-market evidence is required before Release 2 provider and pricing decisions.

Until these documents are approved, the only work performed is document preparation and review.

<!-- autoplan-accepted:ceo -->
- Keep client-side processing as the Release 1 boundary until DT-05 formally records the POC decision.
- Do not describe overlay text editing as in-place editing; preserve explicit unsupported-PDF handling.
- Keep server upload, accounts, cloud storage, billing, quotas, and server conversions blocked until the listed demand, lifecycle, cost, and provider gates pass.
- Preserve original files and last-known-good output; export success requires a valid, checked output.
- Keep Release 1 QA covering valid, unsupported, corrupt, encrypted, oversized, and malformed input plus original and export integrity.
- Keep DT-04's NO-GO controlling until DT-05 is recorded or a changed approach is approved through a new POC protocol.
- Require target-market evidence before Release 2 provider and pricing decisions.
- Require a documented demand-evidence method and owner-approved acceptance threshold before the Release 2 discovery gate passes.
- Require 2–3 complete vertical prototypes for browser, SDK, and server approaches before implementation commitment.
- Treat the proposed 5–7 day, 40–60 engineering-hour POC cap and quantitative demand thresholds as owner-approved gates, not assumed commitments.
- Require an ICP, workflow, distribution channel, measurable wedge, and paid-pilot success criterion before Release 1 foundation work.
- Require named POC approver, fixed budget, reference machine, fixture set, and stop rule before any rerun.
- Require a paid-pilot protocol with price/duration, activation/abandonment metrics, repeat/acquisition threshold, segment selection, and stop triggers.
- Document the six-month failure scenario and measurable stop/pivot triggers for demand, engineering cost, PDF coverage, export reliability, and incumbent switching.
<!-- /autoplan-accepted:ceo -->
<!-- autoplan-accepted:dx -->
- Keep PDF rendering, editing, and export behind a typed engine adapter with an explicit supported-PDF matrix and fallback behavior.
- Define copy-paste complete setup and hello-world documentation for the chosen library or SDK integration, with a measured TTHW target.
- Treat invalid input, OCR/scanned status, export failure, engine dependency failure, and server consent failures as agent-ready errors with recovery and stable codes.
- Document upgrade, migration, compatibility, and deprecation behavior before selecting a production PDF dependency.
<!-- /autoplan-accepted:dx -->

<!-- autoplan-accepted:eng -->
- Keep PDF processing behind a typed engine adapter and preserve the original plus last-known-good export across failures.
- Require a complete test matrix for valid, unsupported, encrypted, corrupt, oversized, malformed, scanned, and large PDFs plus export integrity.
- Gate secure redaction on output-level extraction tests across text, images, masks, vectors, metadata, attachments, layers, annotations, forms, and revisions.
- Keep Release 2 server work blocked until demand evidence, owner isolation, lifecycle, logging, consent, and cost controls pass.
- Require error, retry, cleanup, performance, compatibility, deployment, rollback, and observability evidence for each Release 1 workflow.
<!-- /autoplan-accepted:eng -->
## Review record

<!-- autoplan-baseline-edits:ceo {"sourceSha256":"31f4e55f252a0707bcfd4f0fa277e2ebfb2d5fb105840a7294a5dcabb0df89d2","replacements":[{"oldText":"| 1. License screen | Build a feature-by-library/license matrix for candidate rendering, editing, forms, annotations, and export tools. | Stage 0 approved. | Commercial-use constraints, attribution, and redistribution obligations documented; candidates that fail are excluded. Evidence: [license screen](docs/pdf-engine-license-screen.md). |","newText":"| 1. License screen | Build a feature-by-library/license matrix for candidate rendering, editing, forms, annotations, and export tools, including open-source, commercial SDK, embedded SaaS, and server-processing alternatives. | Stage 0 approved. | Commercial-use constraints, attribution, redistribution obligations, time-to-launch, gross margin, lock-in, fidelity, and total cost are documented; run 2–3 complete vertical prototypes on identical fixtures and score browser, SDK, and server approaches empirically. Candidates that fail are excluded. Evidence: [license screen](docs/pdf-engine-license-screen.md). |"},{"oldText":"| 2. POC definition and run | Freeze five named text-PDF fixtures, sampling, renderer, comparison method, and thresholds; implement and evaluate only the POC. | License screen passed; POC contract approved. | Results recorded per file; explicit go/no-go decision. No full editor commitment based solely on a partial pass. |","newText":"| 2. POC definition and run | The completed DT-04 run used the approved DT-03 fixture set, thresholds, and reference environment. | License screen passed; POC contract approved; DT-04 run complete. | DT-05 explicitly records the NO-GO controlling decision; no POC rerun or in-place-editing commitment is implied. A changed approach or changed criteria requires a newly approved protocol. Freeze a 5–7 day and 40–60 engineering-hour proposal, fixed budget, reference machine profile, fixture set, named approver, and stop rule before reruns. |"},{"oldText":"| 3. Release 1 foundation | Build the local upload, validation, render, editor shell, shared state/action boundary, and safe export path. | Stage 2 decision recorded; architecture approved. | Valid and unsupported input handling, clear states, original preservation, and export integrity pass focused tests. |","newText":"| 3. Release 1 foundation | Build the local upload, validation, render, editor shell, shared state/action boundary, and safe export path for one named ICP, workflow, distribution channel, measurable wedge, paid-pilot price/duration, and activation/abandonment success criterion. | Stage 2 decision recorded; architecture approved. | Valid and unsupported input handling, clear states, original preservation, export integrity, named ICP/workflow/channel fit, paid-pilot evidence, measurable differentiation, and explicit stop/abandon triggers pass focused checks. |"},{"oldText":"- Quota/storage values, cost model, authentication/payment providers, and target markets.","newText":"- Quota/storage values, cost model, authentication/payment providers, and target markets. Target-market evidence is required before Release 2 provider and pricing decisions."},{"oldText":"| 6. Release 2 discovery gate | Validate demand and approve data retention/deletion/backup rules; confirm costs and provider decisions. | Can proceed independently after Stage 0; required before Release 2 implementation. | Demand evidence, server data-lifecycle policy, cost assumptions, and account/provider choices are accepted. |","newText":"| 6. Release 2 discovery gate | Validate demand and approve data retention/deletion/backup rules; confirm costs and provider decisions. | Can proceed independently after Stage 0; required before Release 2 implementation. | Document owner-approved target-market segments and demand evidence. Proposed quantitative acceptance evidence is 15 interviews across 2 segments, 3 paid pilots or 10 design-partner commitments, and a repeat-purchase/acquisition threshold; an owner may approve different values. Define interview and segment rules, pilot price/duration, activation/abandonment metrics, repeat-purchase/acquisition threshold, and stop criteria. Then approve the server data-lifecycle policy, cost assumptions, and account/provider choices. |"},{"oldText":"| 8. Phase 2 discovery | Prioritize AI/OCR, batch, collaboration, and integrations from usage and user evidence. | Release 1 feedback; no Phase 2 commitment implied. | Separate approved scope and plan. |","newText":"| 8. Phase 2 discovery | Prioritize AI/OCR, batch, collaboration, and integrations from usage and user evidence. | Release 1 feedback; no Phase 2 commitment implied. | Separate approved scope and plan. Document the six-month failure scenario and stop/pivot triggers for demand, engineering cost, supported-PDF coverage, export reliability, and incumbent-switch evidence. |"},{"oldText":"This is the planning interpretation of the design review's auto-decided stage split. It excludes accounts and server dependencies. Start with upload, rendering, local processing, and export. Add only workflows with a viable licensed implementation and testable output. The requirements list editing, annotations, signatures, links/forms, page management, merge/split/compress, conversion, and security tools; individual items remain subject to the source requirement status, technical feasibility, and acceptance evidence.","newText":"This is the planning interpretation of the design review's auto-decided stage split. It excludes accounts and server dependencies. Start with one approved ICP and a measurable differentiator, then upload, rendering, local processing, and export. Add only workflows with a viable licensed implementation and testable output. The requirements list editing, annotations, signatures, links/forms, page management, merge/split/compress, conversion, and security tools; individual items remain subject to the source requirement status, technical feasibility, and acceptance evidence."}]} -->

<!-- autoplan-accepted:ceo -->
- Keep client-side processing as the Release 1 boundary until DT-05 formally records the POC decision.
- Do not describe overlay text editing as in-place editing; preserve explicit unsupported-PDF handling.
- Keep server upload, accounts, cloud storage, billing, quotas, and server conversions blocked until the listed demand, lifecycle, cost, and provider gates pass.
- Preserve original files and last-known-good output; export success requires a valid, checked output.
- Keep Release 1 QA covering valid, unsupported, corrupt, encrypted, oversized, and malformed input plus original and export integrity.
- Keep DT-04's NO-GO controlling until DT-05 is recorded or a changed approach is approved through a new POC protocol.
- Require target-market evidence before Release 2 provider and pricing decisions.
- Require a documented demand-evidence method and owner-approved acceptance threshold before the Release 2 discovery gate passes.
- Require 2–3 complete vertical prototypes for browser, SDK, and server approaches before implementation commitment.
- Treat the proposed 5–7 day, 40–60 engineering-hour POC cap and quantitative demand thresholds as owner-approved gates, not assumed commitments.
- Require an ICP, workflow, distribution channel, measurable wedge, and paid-pilot success criterion before Release 1 foundation work.
- Require named POC approver, fixed budget, reference machine, fixture set, and stop rule before any rerun.
- Require a paid-pilot protocol with price/duration, activation/abandonment metrics, repeat/acquisition threshold, segment selection, and stop triggers.
- Document the six-month failure scenario and measurable stop/pivot triggers for demand, engineering cost, PDF coverage, export reliability, and incumbent switching.
<!-- /autoplan-accepted:ceo -->

<!-- autoplan-accepted:dx -->
- Keep PDF rendering, editing, and export behind a typed engine adapter with an explicit supported-PDF matrix and fallback behavior.
- Define copy-paste complete setup and hello-world documentation for the chosen library or SDK integration, with a measured TTHW target.
- Treat invalid input, OCR/scanned status, export failure, engine dependency failure, and server consent failures as agent-ready errors with recovery and stable codes.
- Document upgrade, migration, compatibility, and deprecation behavior before selecting a production PDF dependency.
<!-- /autoplan-accepted:dx -->

<!-- autoplan-accepted:eng -->
- Keep PDF processing behind a typed engine adapter and preserve the original plus last-known-good export across failures.
- Require a complete test matrix for valid, unsupported, encrypted, corrupt, oversized, malformed, scanned, and large PDFs plus export integrity.
- Gate secure redaction on output-level extraction tests across text, images, masks, vectors, metadata, attachments, layers, annotations, forms, and revisions.
- Keep Release 2 server work blocked until demand evidence, owner isolation, lifecycle, logging, consent, and cost controls pass.
- Require error, retry, cleanup, performance, compatibility, deployment, rollback, and observability evidence for each Release 1 workflow.
<!-- /autoplan-accepted:eng -->

<!-- autoplan-baseline-edits:dx {"sourceSha256":"f5565dc787b5ab20ec48f784a45a819a6f6e3d9c7226eb1097cf0dd9131b0c40","replacements":[]} -->

<!-- autoplan-baseline-edits:eng {"sourceSha256":"a282c31a973d83b69e546ef355b4ebfac26f040c2546e74bb38754243809330b","replacements":[]} -->

<!-- AUTONOMOUS DECISION LOG -->
## Decision Audit Trail

| # | Phase | Decision | Classification | Principle | Rationale | Rejected |
|---|-------|----------|----------------|-----------|-----------|----------|
| 1 | CEO | Narrow Release 1 to one approved ICP and measurable wedge. | Taste | P1, P2 | Reduces parity risk and gives implementation and QA a concrete success criterion. | Broad Sejda-like launch parity. |
| 2 | CEO | Run customer demand discovery concurrently with the POC. | Taste | P1, P6 | Avoids spending the POC-first window on a product that fails demand validation. | POC-only pre-implementation sequence. |
| 3 | CEO | Compare open-source, commercial SDK, embedded SaaS, and server-processing alternatives in the license and cost screen. | Mechanical | P4, P5 | Existing POC/license gates are incomplete until TCO, lock-in, launch speed, and fidelity are considered. | Library-only comparison. |
| 4 | CEO | Require an owner-approved demand-evidence method and acceptance threshold plus target-market evidence. | Mechanical | P1, P6 | Interest or waitlist counts alone do not demonstrate qualified demand or purchase urgency. | Interest-only demand gate. |
| 5 | CEO | Time-box POC spend and stop broad feature implementation on the controlling NO-GO or investment limit. | Taste | P1, P2 | Prevents expensive over-engineering before product viability is established. | Open-ended POC-first build. |
| 6 | CEO | Require an approved distribution channel and measurable wedge in the Release 1 foundation. | Taste | P1, P6 | Privacy alone is unlikely to overcome incumbent distribution and trust. | Broad feature parity without a wedge. |
| 7 | CEO | Freeze POC time, effort, budget, hardware, and approver before any rerun. | Taste | P1, P5 | Prevents unbounded POC spend after a known NO-GO. | Open-ended retry. |
| 8 | CEO | Require complete vertical prototypes for browser, SDK, and server approaches on identical fixtures. | Mechanical | P4, P5 | Compares end-to-end product approaches instead of library policy matrices. | Library-only comparison. |
| 9 | CEO | Require a narrow ICP, workflow, channel, wedge, and paid-pilot success criterion. | Taste | P1, P6 | Prevents broad PDF parity without a defensible switch reason. | Generic feature launch. |
| 10 | CEO | Mark 15 interviews, paid pilots/design-partner commitments, and repeat thresholds as proposed demand gates requiring owner approval. | Mechanical | P1, P6 | Interest alone does not prove purchase urgency or warrant server investment. | Interest-only Release 2 demand gate. |
| 11 | CEO | Freeze POC approver, budget, machine, fixture set, and stop rule. | Mechanical | P2, P5 | Prevents a NO-GO POC from becoming an open-ended engineering project. | Vague POC governance. |
| 12 | CEO | Add paid-pilot protocol values and repeat/acquisition thresholds. | Mechanical | P1, P6 | Turns demand gates into executable evidence rather than process-only requirements. | Interest-only demand evidence. |
| 13 | CEO | Document the six-month failure scenario and stop/pivot metrics. | Taste | P1, P2 | Prevents late discovery of an uncompetitive or uneconomic product. | Staged work without explicit failure checkpoints. |

REALITY: premise-table finding unverified=12 across POC fallback, target market, demand evidence, server lifecycle, quotas, auth/payment, reference hardware, fixtures, two-release split, and core tool priority IMPLEMENTATION_PLAN.md:61-68
REALITY: already-done pass POC harness and evidence exist in commit 28abfed and TEST_EXECUTION_REPORT.md:1-50
REALITY: surface-check pass current app exposes only the placeholder home route src/app/page.tsx:1-7 and package.json:5-12
REALITY: binding-decisions pass gstack-decision-search branch main returned no stored binding decisions; implementation plan approved-direction context remains in IMPLEMENTATION_PLAN.md:3-14
REALITY: numbers finding POC and quota/storage values are proposed or unapproved in TECHNICAL_ARCHITECTURE.md:35-55 and IMPLEMENTATION_PLAN.md:23-29
REALITY: deferred-asks pass no linked issue or deferred external request is recorded for this branch
REALITY: pr-count pass default PR policy count=1 for this workstream .gstack/ship-policy.json
REALITY: premise-table finding unverified=14 in Eng scope for POC, redaction, browser/memory, Release 2, deployment, and actual test coverage IMPLEMENTATION_PLAN.md:22-29
REALITY: already-done pass POC harness and evidence exist in commit 28abfed and TEST_EXECUTION_REPORT.md:12-37
REALITY: surface-check pass package scripts in package.json:5-10 and placeholder route in src/app/page.tsx:1-7
REALITY: binding-decisions pass no stored branch binding decisions were found; CEO and source-plan decisions remain in IMPLEMENTATION_PLAN.md:72-94
REALITY: numbers finding POC quotas, memory, browser, and POC thresholds are proposed or unapproved in TECHNICAL_ARCHITECTURE.md:35-55 and IMPLEMENTATION_PLAN.md:23-29
REALITY: deferred-asks pass no linked external issue asks are recorded for this branch
REALITY: pr-count pass default PR count=1 in this workstream
REALITY: prior-art finding exact PDF library versions/features/transitives remain unselected and unverified from source docs/pdf-engine-license-screen.md
REALITY: contract-assumptions finding auth, R2/D1, Vercel, payment, quota, and redaction contracts remain unapproved IMPLEMENTATION_PLAN.md:27-31
REALITY: dependency-fallback finding Release 1 and POC stages can proceed independently of Release 2 cloud/provider choices IMPLEMENTATION_PLAN.md:22-29
REALITY: obligation-tiers finding P1 build/test/redaction/deploy findings are required before implementation; P2 migration/observability follow them TECHNICAL_ARCHITECTURE.md:40-57

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope and strategy | 1 | ISSUES OPEN | 5 high concerns resolved into explicit gates |
| DX Review | `/plan-devex-review` | Library/SDK developer experience | 1 | ISSUES OPEN | Overall 3.5/10; TTHW unknown |
| Eng Review | `/plan-eng-review` | Architecture, tests, security, performance | 1 | ISSUES OPEN | 5 critical gaps |
| Design Review | `/plan-design-review` | UI/UX | 0 | SKIPPED | No UI scope detected |
| Outside Review | Codex CLI | Independent second opinion | 0 | UNAVAILABLE | Codex is not installed |

**OUTSIDE COVERAGE:** Codex was unavailable. Native Copilot/SDK in-host reviews completed for CEO, DX, and Eng. No cross-model confirmed consensus.

**VERDICT:** IMPLEMENTATION STARTED for Release 1 foundation. Text editing remains gated by DT-05, secure redaction by DT-12 evidence, and server work by demand/lifecycle/provider gates.

**UNRESOLVED DECISIONS:**
- Exact POC fixture, threshold, reference hardware, named approver, and budget values remain owner decisions.
- The exact Release 1 tool subset and DT-05 text fallback disposition remain pending after the gate recommendation.
- Demand evidence method and numeric acceptance thresholds remain pending.
- Server retention, deletion, temp age, backup, residency, consent, logging, and recovery values remain pending.
- Auth/payment providers, target markets, quotas, storage limits, and pricing remain pending.

## Phase skips
- Phase 2 Design Review skipped: no UI scope detected by the autoplan manifest.

## DX Review Scorecard

Developer Persona: Library/SDK integrator evaluating whether to build on the PDF engine adapter.

TTHW: Unknown. No copy-paste hello-world API or setup exists yet.

Competitive Rank: Red Flag relative to integration-ready SDK/documentation patterns.

| Pass | Score | Principal gap |
|---|---:|---|
| Getting Started | 2/10 | No copy-paste hello world or measured setup flow |
| API/CLI/SDK | 3/10 | Typed adapter required, but interface and defaults are unspecified |
| Error Messages | 2/10 | Stable codes, recovery, retry, side effects, and traces are missing |
| Documentation | 3/10 | License/POC docs are strong, but setup/API/troubleshooting examples are absent |
| Upgrade | 5/10 | Migration and compatibility gates exist but have no concrete procedure |
| Dev Environment | 3/10 | Bootstrap, cross-platform matrix, CI, and runnable fixture commands are unspecified |
| Community | 3/10 | Support channel, issue template, and feedback loop are missing |
| DX Measurement | 6/10 | POC and export evidence is strong, but TTHW and integration telemetry are absent |

Overall DX: 3.5/10.

Developer journey:

| Stage | Developer action | Current friction |
|---|---|---|
| Discover | Compare license and feature matrices | Integration examples and 2–3 concrete SDK/server prototypes are missing |
| Install | Bootstrap a PDF engine | No one-command setup or pinned cross-platform environment |
| Hello World | Open, validate, render, and export a PDF | No runnable adapter contract or expected output |
| Real Usage | Implement supported workflows | Supported-PDF matrix and fallback policy are not defined |
| Debug | Diagnose invalid input or export failure | Agent-ready errors and traces are unspecified |
| Upgrade | Switch engine or dependency version | Migration guide, compatibility fixtures, and rollback are missing |

Priority findings:
- Define the typed engine adapter and supported-matrix lookup.
- Add copy-paste setup, hello-world, and real export examples.
- Add stable, agent-ready error contracts for validation, export, dependency, and server consent failures.
- Add engine migration, lockfile, deprecation, and compatibility fixtures.
- Add POC/CI feedback and TTHW measurement.

Outside DX voice: unavailable because Codex CLI is not installed.

## Implementation Tasks
Synthesized from DX findings.

- [ ] **T1 (P1, human: ~4h / CC: ~45min)** — PDF engine boundary — Define typed `open`, `validate`, `render`, `apply`, `export`, and `describeSupport` operations with discriminated PDF errors.
  - Surfaced by: API/CLI/SDK and Error Messages passes
  - Files: `src/lib/pdf-engine/`, `src/types/`
  - Verify: unit and integration fixtures cover success, invalid input, export failure, and engine fallback.
- [ ] **T2 (P1, human: ~2h / CC: ~20min)** — Developer setup — Add one copy-paste hello-world flow with pinned prerequisites, exact commands, and expected output.
  - Surfaced by: Getting Started and Documentation passes
  - Files: `README.md`, `package.json`, `docs/`
  - Verify: a clean environment completes first export in the measured TTHW target.
- [ ] **T3 (P1, human: ~3h / CC: ~30min)** — Agent-ready errors — Implement the error catalog and recovery contract for validation, OCR, export, dependency, and server consent failures.
  - Surfaced by: Error Messages pass
  - Files: `src/lib/pdf-engine/`, `src/app/`, `src/server/`
  - Verify: each error includes code, fix, recovery, side-effect state, context, redaction, and channel behavior.
- [ ] **T4 (P2, human: ~2h / CC: ~20min)** — Compatibility and migration — Add lockfile, engine swap procedure, migration guide, compatibility fixtures, and rollback.
  - Surfaced by: Upgrade pass
  - Files: `docs/`, `tests/fixtures/`, `package.json`
  - Verify: two-engine or fallback fixture replay is green and migration steps are copy-paste complete.
- [ ] **T5 (P2, human: ~1h / CC: ~15min)** — DX measurement — Instrument setup success, TTHW, first export success, and POC gate evidence.
  - Surfaced by: DX Measurement pass
  - Files: `scripts/`, `tests/fixtures/poc/`, `DEVELOPMENT_TASKS.md`
  - Verify: release QA report includes measured setup, TTHW, and export metrics.

## Eng Review

### Architecture Review

Critical finding: the plan has a sound staged boundary, but implementation is not yet ready. The browser path is not defined by executable interfaces or tests.

```text
User file
  -> signature/size/signature/page/encryption/malformed/scanned validation
     -> in-memory original
        -> PDF.js render view
        -> typed engine adapter
           -> command state + command history
           -> last-known-good export state
           -> export validation
              -> download

Redaction
  -> separate threat-model gate
  -> export
  -> extraction/content-surface verification

Release 2 only after gates
  -> consent
  -> API/job worker
  -> private R2 object + D1 metadata
  -> owner check + cleanup
```

Both shapes were considered:
1. Original staged shape: browser-first adapter, server only after gates.
2. Smaller shape: freeze POC/test infrastructure and implement only upload/render/export foundation first.

Chosen shape: the original staged shape is retained because it prevents server dependencies and preserves a later server boundary. The smaller shape is added as a sequencing constraint: no tool modules or server platform work before foundation test gates pass.

### Code Quality Review

- Critical: the repository has no production PDF engine implementation or application tests. The POC harness is not a product integration.
- Critical: evidence drift is possible because `TEST_EXECUTION_REPORT.md:12-27` says no PDF dependency was added, while `package.json:24-25` pins pdf-lib and PDF.js.
- High: a shallow engine adapter could leak PDF library types, representation, and fallback policy across modules. Parse at the adapter boundary and expose domain capabilities, stable errors, and supported-PDF metadata.
- High: separate ownership for original, command history, last-known-good export, and server object state must remain explicit.
- No standalone shared extraction is justified yet; the PDF engine adapter is the existing reuse boundary because all tools will route through it.

### Test Review

Existing framework: Node/Vitest is declared by `package.json:12`, but Vitest application test files are absent. POC fixtures and scripts exist.

```text
CODE PATHS                                         USER FLOWS
[ ] Upload/validation                              [ ] Valid PDF → render → edit → export
  ├── [GAP] signature/type/size                     ├── [GAP] encrypted/unsupported/scanned
  ├── [GAP] encryption/malformed/scanned            ├── [GAP] oversized or 100 MB
  └── [GAP] page/decompression/OOM budgets          └── [GAP] navigate/retry/cancel
[ ] Render                                       [+] Error states
  ├── [GAP] PDF.js worker success/failure           ├── [GAP] clear recovery
  └── [GAP] page/viewport/cancellation              └── [GAP] last-known-good remains
[ ] Engine adapter/command state                    [+] Redaction
  ├── [GAP] state/undo/redo                        ├── [GAP] text/image/vector
  └── [GAP] fallback and last-known-good           └── [GAP] metadata/layers/revisions
[ ] Export/validation                              [+] Server conversion
  ├── [GAP] page count and PDF.js reopen            ├── [GAP] consent
  └── [GAP] failed export preservation               ├── [GAP] success/failure cleanup
                                                   └── [GAP] owner isolation

COVERAGE: application test paths 0/20+  |  POC evidence 121/121 caret samples
QUALITY: ★★★:0 ★★:0 ★:0  |  GAPS: release, unit, integration, E2E, and browser matrix
```

Test plan artifact: `C:\Users\ramya\.gstack\projects\ramyadevigu-web-app-pdf-editor\ramya-main-eng-review-test-plan-20261121-1800.md`.

### Performance Review

- Critical: no resource budget, decompression budget, page-count cap, worker isolation, cancellation, or OOM recovery for 100 MB PDFs.
- High: PDF.js workers and engine operations must be bounded and isolated from the UI thread; a 10x file and page count case can multiply memory.
- High: export retry and stale state must not duplicate large buffers or revalidate against stale coordinates.
- Medium: server conversions need queue/worker sizing, timeout, temp cap, cleanup, and cost evidence before implementation.

### Failure Modes

- `NO-GO` text scope presented as in-place editing: critical gap; DT-05 controls fallback.
- Redaction output leaks hidden/revision content: critical gap; DT-12 blocks ship.
- Malformed/oversized PDF exhausts memory: critical gap; add budgets and cancellation.
- Export failure destroys or obscures last-known-good output: critical gap; preserve and verify output.
- Server cleanup fails or logs names/content: critical gap; lifecycle gate required.
- Stale package/evidence inventory: critical gap; refresh the license and test reports.

### NOT in scope
- Accounts, storage, billing, quotas, server PDF processing, and auth providers remain blocked by their gates.
- AI/OCR, batch, collaboration, and integrations remain Phase 2 candidates.
- Secure redaction is not approved until the separate output-level gate passes.

### What already exists
- Next.js 16/React 19 scaffold and POC harness.
- Pinned POC dependencies, license matrix, POC fixture manifest, and valid NO-GO execution report.
- Development task and known-issue registers with staged gates.

### Parallelization
Sequential implementation: the POC and foundation gates, test infrastructure, and adapter contract have dependencies. Independent workstreams after the foundation gate: UI shell, adapter unit coverage, and fixture/browser QA can run in separate worktrees if they share no uncommitted adapter API.
