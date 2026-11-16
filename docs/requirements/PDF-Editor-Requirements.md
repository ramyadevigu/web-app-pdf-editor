# PDF Editor SaaS: Requirements Documentation

| Item | Value |
|---|---|
| Project | PDF-editor (PDF Editor SaaS) |
| Source | `PDF_Editor_SaaS_Complete_Requirements_v0.6.xlsx` (repository root, 19 sheets) |
| Baseline version | v0.6, consolidated requirements workbook |
| Session date | 13 November 2026 |
| Status | Approved for development on 15 November 2026, subject to the staged implementation gates. Open and proposed requirements remain unresolved unless explicitly approved; this is not a technical feasibility certification. |

---

## 1. Product Overview

### 1.1 Purpose

Build a commercial, browser-based PDF productivity application inspired by [Sejda](https://sejda.com). Phase 1 covers the essential PDF editor and utility toolset, delivered incrementally. Phase 2 adds differentiating enhancements.

Primary objective: a reliable, production-grade PDF workspace, not a demo. It must offer working tools, trustworthy exports, clear usage limits, secure file handling, and recoverable saves.

### 1.2 Scope

| Phase | Scope |
|---|---|
| **Phase 1** | Core PDF editing and utilities: text, images, annotations, shapes, signatures, links, forms, page management, merge, split, compression, conversion, export, accounts, and subscription limits. Also My Documents with cloud storage and folders, and a scalable modular architecture. |
| **Phase 2** | Candidates only, not commitments: AI chat with PDF, summarisation, structured extraction, OCR enhancements, translation, PDF comparison, batch workflows, cloud integrations, and collaboration. |

### 1.3 Important Scope Notes

- The reference product is **Sejda** (sejda.com), not ChatGPT.
- Exact feature parity, licensing, and technical feasibility must be validated before implementation.
- Phase 1 targets **close functional and interaction parity** with Sejda's core workflows. Pixel parity is not verified.

### 1.4 Key Technical Caveat

True in-place editing of arbitrary PDF text, with Word-like paragraph reflow, is a **critical feasibility risk**. A working proof-of-concept (POC) must be built before universal support is promised.

---

## 2. Glossary and Status Definitions

### 2.1 Priority

| Value | Meaning |
|---|---|
| **Must** | Required for launch. |
| **Should** | Important, but can follow core Must work. |
| **Could** | Optional if time and feasibility allow. |

Priority labels are planning guidance, not proof of feasibility.

### 2.2 Status

| Value | Meaning |
|---|---|
| **Agreed / Agreed direction** | The user selected this direction. |
| **Draft** | Requirement captured but not fully validated. |
| **Open** | A decision is still required. |
| **Proposed** | Suggested, not yet agreed. |
| **POC required** | Feasibility must be demonstrated before commitment. |

### 2.3 Terms

| Term | Meaning |
|---|---|
| **Anonymous user** | A visitor who has not registered or signed in. |
| **Registered (free) user** | An account holder on the free tier. |
| **Pro user** | An account holder on the paid tier. |
| **Task** | A completed PDF workflow. Exact counting rules are still open (see OD-006). |
| **In-place text editing** | Editing existing selectable PDF text with a caret, rather than placing an overlay text box. |
| **Whiteout** | A visual covering tool. It is not secure removal of content. |
| **Redaction** | Permanent removal of underlying content from the output. |
| **Electronic signature** | A drawn, typed, or uploaded signature image. It is not a certificate-based digital signature. |

---

## 3. Decision Log

| ID | Topic | Decision / current direction | Status | Remaining question |
|---|---|---|---|---|
| DEC-001 | Homepage navigation | Clean top navigation bar and prominent upload button. | Agreed | Final navigation labels and information architecture. |
| DEC-002 | Authentication | Login is optional. Anonymous users can use permitted functionality. | Agreed | Which events should trigger a sign-in prompt? |
| DEC-003 | Anonymous limits | Anonymous users get 3 PDF tasks before being asked to create a free account. | Agreed | Task counting proposed in OD-006 (decided). Abuse controls still open. |
| DEC-004 | Feature gating | Anonymous users may have selected editor capabilities restricted. | Agreed direction | Define the anonymous, free, and Pro feature matrix. |
| DEC-005 | Recent uploads | Anonymous users can access recent uploads, with limits. | Agreed direction | Phase 1 inclusion agreed (auto-decided). Retention period still open. |
| DEC-006 | Upgrade path | Prompt users to register for more access. Offer Pro for expanded limits and features. | Agreed direction | Define Pro entitlements, pricing, and prompt timing. |
| DEC-007 | Editor scope | Phase 1 editor includes the complete agreed essential toolbar and toolset, not a demo or reduced placeholder. | Agreed | Validate the exact tool inventory against Sejda's current product. |
| DEC-008 | Editor UX reference | Keep the editor close to Sejda while maintaining a scalable architecture. | Agreed | Confirm panel layout, toolbar grouping, and responsive behaviour. |
| DEC-009 | Homepage IA | Essential PDF tools shown as categorised, clickable tiles, with a prominent upload action and clean navigation. | Agreed | Final category names and launch tool inventory. |
| DEC-010 | Quality and trust | Feel production-ready, reliable, and trustworthy. Avoid demo-like UI, incomplete workflows, and misleading claims. | Agreed | Define measurable quality, security, privacy, and reliability criteria. |
| DEC-011 | Document library storage | Registered users' documents are stored in Cloudflare R2. D1 stores metadata and references. | Agreed | Proposed: 1 GB free / 20 GB Pro, 5 versions, 30-day trash (OD-007, provisional until cost model). |
| DEC-012 | Backend and hosting | Next.js + TypeScript on Vercel, using API routes and serverless functions. No separate Python backend in Phase 1. | Agreed direction | Validate Vercel function limits against PDF workloads and plan requirements. |
| DEC-013 | PDF editing engine | Start with open-source libraries to minimise licensing cost. Keep the engine modular so a commercial SDK or processing service can be added later. | Agreed direction | Run a POC for in-place text editing, reflow, font fidelity, and export quality. |
| DEC-014 | Document folders | My Documents supports user-created folders and subfolders, with the ability to move PDFs between them. | Agreed direction | Proposed: depth 5; non-empty folder deletion blocked (OD-008, OD-009; provisional). |

---

## 4. Architecture and Technology

### 4.1 Technical Decisions

| ID | Component | Decision | Status |
|---|---|---|---|
| TR-001 | Frontend | Browser-based application using **Next.js + TypeScript**. | Agreed direction |
| TR-002 | PDF rendering | **PDF.js** for rendering and interaction. Validate separately for editing. | Agreed direction |
| TR-003 | PDF editing | Open-source libraries initially. Keep the engine modular. Validate in-place text editing, images, annotations, forms, and export fidelity before committing. No commercial SDK in the initial release. | Agreed direction; POC required |
| TR-004 | Backend | Next.js API routes / Vercel serverless functions (TypeScript). No separate Python backend in Phase 1. | Agreed direction |
| TR-005 | Processing | Browser-side processing and Vercel functions where suitable. Add asynchronous/background processing when workload justifies it. | Agreed direction; validate limits |
| TR-006 | Storage | **Cloudflare R2** for PDFs. Private buckets, scoped access, signed URLs, lifecycle rules. | Agreed direction |
| TR-007 | Database | **Cloudflare D1** for user metadata, document records, folder hierarchy, plans, and usage. | Agreed direction |
| TR-008 | Billing | Payment provider compatible with target markets. | **Open (TBD)** |
| TR-009 | Extensibility | Modular tool registry, shared document model, and engine adapter boundary, so new tools can be added without restructuring the editor. | Agreed direction; open detail |
| TR-010 | Editor state | Consistent document state, selection, undo/redo, and export across tools. Shared command/action model. | **Open (TBD)**, Must |
| TR-011 | QA | Regression tests for editing and PDF processing across representative PDFs: text, images, annotations, forms, fonts, page sizes, scanned files, and malformed PDFs. | **Open (TBD)**, Must |

### 4.2 Layer Architecture

| Layer | Phase 1 decision | Responsibility | Notes / constraints | Status |
|---|---|---|---|---|
| Frontend | Next.js + TypeScript | PDF workspace, homepage, My Documents, account UI | Hosted on Vercel; responsive web app. | Agreed direction |
| Hosting | Vercel | Deploy frontend and API/serverless functions | Commercial launch needs a plan that permits commercial use. Validate function limits and cost. | Agreed; plan to validate |
| API / backend | Next.js API routes / Vercel Functions | Application APIs, auth integration, orchestration, metadata | No separately maintained Python backend in Phase 1. | Agreed direction |
| Database | Cloudflare D1 | Metadata, document records, folders, usage counters, subscription references | Do not store large PDF binaries in D1. Plan for per-database limits. | Agreed direction |
| Object storage | Cloudflare R2 | Original PDFs, edited PDFs, exports, thumbnails | Private buckets. Short-lived signed or backend-mediated access. Per-user ownership checks. | Agreed direction |
| PDF rendering | PDF.js (candidate) | Render pages; support text and coordinate interaction | Not a complete editing engine. | Candidate |
| PDF editing engine | Open-source libraries | Text, image, annotation, form, page, and export operations | Modular adapter boundary. POC before locking library choice. | Agreed; POC required |
| Processing model | Browser-first, plus Vercel Functions where suitable | Client-side processing for lightweight work; serverless for suitable backend tasks | Large or CPU-heavy jobs may need a queue and workers. Do not assume all workloads fit Vercel Functions. | Agreed direction |
| Future scaling | Queue + dedicated workers | Large conversions, OCR, batch, high-volume jobs | Introduce only when measured workload or limits justify it. | Future option |
| Authentication | Provider TBD | Registration, login, sessions, per-user ownership | Choose after evaluating Next.js integration, cost, and account deletion support. | **Open** |

### 4.3 Storage Abstraction

Keep the storage provider behind an abstraction (*Read Me & Scope*, "Agreed cloud direction").

---

## 5. Core Data Model

These fields are illustrative. Final design is pending.

| Entity | Key fields | Relationships / purpose | Security / integrity notes |
|---|---|---|---|
| **User** | id, auth_subject, email, display_name, created_at, plan_id | Owns documents, folders, usage records. | Use a stable internal ID. Never trust client-supplied owner IDs. |
| **Folder** | id, user_id, parent_folder_id, name, created_at, updated_at | Nested folders and navigation. | Unique-name policy per parent is TBD. Enforce ownership and prevent cycles. |
| **Document** | id, user_id, folder_id, original_object_key, current_object_key, filename, mime_type, size_bytes, page_count, created_at, updated_at | A PDF and its current saved output. | R2 keys must not be guessable public URLs. Verify ownership on every operation. |
| **DocumentVersion** | id, document_id, object_key, version_number, created_at, created_by, operation_summary | Original and prior saved versions. | Retention policy and storage quota accounting required. |
| **UsageEvent** | id, user_id / session_id, task_type, status, counted, created_at | Auditable task metering for anonymous, free, and Pro quotas. | Define "completed". Avoid double-counting retries. |
| **Subscription** | id, user_id, provider_customer_id, plan_id, status, current_period_start, current_period_end | Entitlement reference and billing state. | Payment provider TBD. **Do not store card data.** |
| **Signature** | id, user_id, storage_key or encrypted_payload, created_at | Optional reusable signatures. | Sensitive personal data. Explicit user action, access controls, and deletion required. |

---

## 6. Homepage and Information Architecture

### 6.1 Homepage Sections

| Order | Section | Proposed content | Purpose | Status |
|---|---|---|---|---|
| 1 | Top navigation | Logo, All Tools, Edit PDF, Pricing, Log in, Sign up | Simple, consistent navigation and account access. | Direction agreed; labels to confirm |
| 2 | Hero | Headline "Everything you need to work with PDFs", supporting line, prominent **Upload PDF** button | Explain value and drive the primary action. | Draft copy |
| 3 | Tool categories | Edit & Annotate; Organise PDF; Convert PDF; Optimise PDF; Security; Other Tools. Each tool is a tile with icon, name, and short description. | Make the full toolset discoverable. | Agreed |
| 4 | Recent documents | Recent uploads for anonymous sessions. Document history for signed-in users, with retention and delete controls. | Help users resume work. | Retention open |
| 5 | Trust and reassurance | Privacy and security info, file handling explanation, transparent limits, processing feedback. | Show this is a real production tool. | Proof points must be genuine |
| 6 | Pricing / upgrade | Free and Pro summary, transparent limits, upgrade CTA. | Explain value and the upgrade path. | Pricing open |
| 7 | Footer | All tools, About, Contact, Help, Privacy, Terms. | Support and policy navigation. | Content to be defined |

### 6.2 UI/UX Requirements

| ID | Area | Requirement | Initial direction | Open question | Status |
|---|---|---|---|---|---|
| UX-001 | Landing page | Present PDF tools and a primary upload action clearly. | Simple, modern SaaS tool directory. | Brand name and visual references? | Open |
| UX-002 | Editor workspace | Document canvas, page navigation, and editing toolbar. | Sejda-inspired; responsive. | Toolbar placement and panels? | Open |
| UX-003 | Feedback | Upload, processing, success, and error states. | Progress indicator for long tasks. | Background job notifications needed? | Open |
| UX-004 | Responsive design | Desktop and mobile support. | Prioritise desktop editing; mobile-friendly utility flows. | Essential mobile editing features? | Open |
| UX-005 | Access | Login is optional. | Visitors can use permitted tools without an account. | Prompt at upload, export, or only at gates? | Agreed direction |
| UX-006 | Upload CTA | Prominent upload action in the hero. | Keep it in the hero area. | Route to action selector or open editor directly? | Agreed |
| UX-007 | Limit prompt | Non-disruptive sign-up prompt at anonymous limit. | Clear and non-disruptive. | Preserve file and edits through sign-up? | Proposed |
| UX-008 | Upgrade prompt | Show Pro benefits when a Pro-only feature or higher limit is needed. | Contextual. | Benefits and comparison layout? | Proposed |
| UX-009 | Recent uploads | Recent uploads for anonymous users within a defined window. | Clearly defined session or retention window. | Current session only or persistent browser history? | Open |
| UX-010 | Navigation | Clean, consistent top navigation with logo, All Tools, Edit PDF, Pricing, and account actions. | Minimal, consistent across public and authenticated pages. | Final labels and responsive menu behaviour. | Agreed direction |
| UX-011 | Tool discovery | Essential tools as categorised, clickable tiles with clear names and short descriptions. | Categories: Edit & Annotate, Organise, Convert, Optimise, Security, Other Tools. | Validate tools and category assignments. | Agreed direction |
| UX-012 | Primary action | Prominent Upload PDF action in the hero. | Guide the user into an appropriate workflow. | Action selector first, or open editor by default? | Agreed direction |
| UX-013 | Trust and quality | Production-quality design, clear processing states, useful errors, transparent limits. | Avoid placeholder controls, fake actions, demo labels, and unsupported claims. | Trust indicators and quality targets. | **Must** |
| UX-014 | Editor layout | Dedicated editor workspace with familiar toolbar, canvas, page navigation, contextual controls. | Close to Sejda; allow future expansion. | Panel arrangement and mobile behaviour. | Agreed direction |
| UX-015 | My Documents | Folder and subfolder navigation. | File-manager style: root/all-documents view, folder tree or navigation, breadcrumbs, move actions. | Nesting depth and folder deletion behaviour. | Agreed direction |
| UX-016 | My Documents | Cross-device continuity. | Show saved PDFs and latest versions after sign-in on another device. | Autosave indicator, version history, retention. | Agreed direction |

---

## 7. User Journeys

| ID | Journey | Steps | Expected outcome | Open decisions |
|---|---|---|---|---|
| UJ-001 | Anonymous visitor edits a PDF | Homepage → Edit PDF or Upload PDF → upload → use tools → export/download → continue until 3-task quota → registration prompt | Visitor completes a real PDF task without an account, within stated limits. | Does upload ask for an action first, or open the editor? |
| UJ-002 | Visitor discovers a tool | Homepage → category → tool tile → upload → complete workflow → download | Each tile opens a dedicated, understandable workflow. | Launch tool inventory and upload flow. |
| UJ-003 | User resumes a document | Recent uploads / history → select document → resume if retained | User finds eligible recent work easily. | Session persistence and retention period. |
| UJ-004 | User upgrades | Reach free limit or pick a Pro feature → view benefits and price → register / sign in → upgrade | User understands the reason and value before subscribing. | Billing provider, pricing, plan limits. |

### 7.1 User Stories

| ID | As a | I want to | So that | Related Requirement | Priority | Status |
|---|---|---|---|---|---|---|
| US-001 | Visitor | upload a PDF | I can begin editing it online. | FR-001 | Must | Draft |
| US-002 | User | add and format text | I can update document content. | FR-003 | Must | Draft |
| US-003 | User | insert and resize an image | I can add visual content to a document. | FR-005 | Must | Draft |
| US-004 | User | reorder and delete pages | I can organise a document before exporting. | FR-012 | Must | Draft |
| US-005 | Free user | see my remaining usage allowance | I understand when I may need to upgrade. | FR-021 | Must | Draft |
| US-006 | Registered user | create folders and subfolders and move PDFs between them | I can organise my document library by project or category. | FR-031 | Should | Agreed direction |
| US-007 | Registered user | open my cloud-stored PDF from another device and continue editing | I can work on my documents across devices. | FR-029 | Must | Agreed direction |
| US-008 | PDF editor user | click within selectable text and edit it directly with a caret | I can edit a PDF naturally without placing overlay text boxes. | FR-004 | Must | Draft |
| US-009 | PDF editor user | insert a new text box and choose its font and formatting | I can add styled text where I need it. | FR-003 | Must | Draft |
| US-010 | PDF editor user | replace, move, resize, rotate or delete an existing image | I can update PDF images without recreating the page. | FR-005 | Must | Draft |
| US-011 | PDF editor user | create a signature by typing, drawing or uploading an image | I can sign a PDF using my preferred method. | FR-008 | Must | Draft |
| US-012 | Registered user | *(merged into US-006)* | | | | |
| US-013 | Registered user | *(merged into US-007)* | | | | |
| US-014 | Anonymous user | complete three PDF tasks before registration is required | I can try the product before creating an account. | FR-024 | Must | Agreed quota |

Note: US-006 and US-012 are duplicates, as are US-007 and US-013 (see Section 17).

---

## 8. Phase 1 Roadmap

### 8.1 Roadmap Items

| ID | Phase | Workstream | Scope / outcome | Priority | Status | Dependencies |
|---|---|---|---|---|---|---|
| RM-01 | 1 | PDF editing | Core Sejda-style editing and annotations | Must | Proposed | PDF rendering/editing engine |
| RM-02 | 1 | PDF utilities | Page tools, merge, split, compress, convert | Must | Proposed | PDF processing services |
| RM-03 | 1 | Accounts & plans | Registration, login, usage quotas, subscriptions | Must | Proposed | Identity, billing, usage metering |
| RM-04 | 2 | AI document tools | Chat, summarise, extract information | Should | Proposed | AI orchestration, OCR/text extraction |
| RM-05 | 2 | Advanced platform | Batch jobs, cloud storage, collaboration | Could | Proposed | Storage, permissions, job queue |
| RM-06 | 1 | Anonymous access | Visitors can use selected tools without registration, subject to quotas and restrictions. | Must | Agreed direction | Usage metering; session management |
| RM-07 | 1 | Conversion prompts | Prompt anonymous users to register at a quota or gated feature. | Must | Agreed direction | Quota enforcement; account flow |
| RM-08 | 1 | Pro upgrade path | Pro upgrade messaging for expanded limits and premium capabilities. | Should | Agreed direction | Plan definition; billing |
| *(missing - not in source)* | Phase 1 | My Documents | Cloud-backed document library with folders and subfolders. Registered users can organise and reopen PDFs across devices. | Should (auto-decided, matches FR-029/FR-031; US-007 says Must) | Agreed direction | Cloudflare D1; Cloudflare R2; authentication |

> **Note:** This row has no ID in the source, so none is invented. Its values are realigned to their columns in the workbook. See Section 17.

### 8.2 Development Plan

| ID | Increment | Deliverable | Exit criteria | Dependencies | Status |
|---|---|---|---|---|---|
| DEV-01 | 1 | Product scope and UX decisions | Phase 1 requirements approved; key workflows mapped | Brainstorming | In progress |
| DEV-02 | 2 | Technical proof of concept | Prove PDF rendering and reliable editing/export for representative PDFs | TR-002, TR-003 | Not started |
| DEV-03 | 3 | Application foundation | Authentication, upload, storage, job status, basic editor shell | Architecture | Not started |
| DEV-04 | 4 | Core editing | Text, image, annotation, shape, and signature workflows pass acceptance tests | DEV-03 | Not started |
| DEV-05 | 5 | PDF utilities | Page management, merge, split, compression, conversion work end-to-end | Processing engine | Not started |
| DEV-06 | 6 | Commercial foundation | Plans, quotas, billing, usage dashboard, privacy lifecycle | Identity, billing, storage | Not started |
| DEV-07 | 7 | QA and launch | Security, performance, compatibility, functional testing complete | All Phase 1 modules | Not started |
| DEV-08 | 8 | Phase 2 discovery | AI and advanced capabilities prioritised using user feedback | Phase 1 launch/feedback | Not started |

---

## 9. Functional Requirements

All items are Phase 1 unless noted. Full acceptance criteria and open questions are in the source workbook (sheet *Functional Requirements*).

### 9.1 Upload, Viewing, and Export

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-001 | Upload | Upload PDF | Upload from device. Validate file type and size. Show progress and actionable errors. Homepage upload selects a file first, then the user chooses an action. Tool tiles launch their own workflow. | Must | Draft |
| FR-002 | Editor | View PDF | Render pages in a central workspace with navigation, zoom, fit-to-width and fit-page. Use a rendering layer such as PDF.js. Rendering is not editing. | Must | Draft |
| FR-019 | Export | Export / download | Download the edited document and utility outputs. Show progress, success or failure, and filename. Never report success before the file is generated and verified. | Must | Draft |
| FR-034 | Editor | Autosave and save state | Show a visible save state (saving / saved / failed). Users must not mistake unsaved edits for committed cloud documents. | Must | Draft |
| FR-035 | Editor | Document integrity and recovery | Keep the original upload separate from edited output, or keep recoverable versions. Never overwrite the only source on failure. | Must | Draft |
| FR-036 | Editor | Unsupported PDF handling | Detect encrypted, malformed, scanned, complex, or unsupported PDFs. Explain actions and limits. No silent corruption. | Must | Draft |

### 9.2 Text and Editing

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-003 | Text | Insert text boxes | New text box, positioned and resizable. Toolbar: font family, size, colour, bold, italic, underline, alignment. Distinct from editing original text. | Must | Draft |
| FR-004 | Text | True in-place text editing | Click within selectable text to place a caret. Select, insert, replace, and delete. Default to matching font, size, colour, weight, spacing, alignment. Paragraph reflow desired where feasible. **Must not be an overlay text box.** Scanned PDFs need OCR and a separate workflow. | Must | Draft (**critical POC**) |
| FR-005 | Images | Insert and manipulate images | Insert new images and select existing ones. Move, resize (aspect lock), rotate, replace, and delete. Replacement keeps prior position and size by default. | Must | Draft |
| FR-032 | Editor | Undo and redo | Consistent undo/redo for text, images, annotations, shapes, and page operations. History is not assumed to persist across reloads. | Must | Draft |
| FR-033 | Editor | Keyboard shortcuts | Ctrl/Cmd+Z, Ctrl/Cmd+Y or Shift+Ctrl/Cmd+Z, copy, cut, paste, select all, Backspace, Delete. Must not hijack browser or system shortcuts. | Should | Draft |
| FR-037 | Editor | Tool selection and properties | Sejda-inspired toolbar and direct page interaction. Selecting an object exposes relevant controls. Validate layout against the live reference. | Must | Draft |

### 9.3 Annotations, Shapes, Signatures, Links, Forms

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-006 | Annotations | Annotations | Text highlight, underline, strikethrough (highest priority), freehand drawing, sticky-note comments. Colour, edit, delete, undo/redo, persistence on export. | Must | Draft |
| FR-007 | Shapes | Shapes and whiteout | Rectangles, ellipses, lines. Stroke, fill, width. Move, resize, delete. Whiteout is labelled as visual concealment only. | Must | Draft |
| FR-008 | Signature | Electronic signatures | Create a reusable signature by typing (handwriting styles), drawing, or uploading an image. Place, move, resize. Do not claim legal validity without assessment. | Must | Draft |
| FR-009 | Links | Hyperlinks | Add to text or a page area. Edit destination. Remove. External URLs and internal page destinations where supported. Validate destinations. | Should | Draft |
| FR-010 | Forms | Fill existing forms | Fill AcroForm text, checkbox, radio, and dropdown fields. Save and export with values retained. XFA not assumed. | Must | Draft |
| FR-011 | Forms | Create form fields | Text, checkbox, radio, dropdown, and signature fields. Configure names, options, and basic properties. | Should | Draft |
| FR-012 | Pages | Manage pages | Reorder, rotate, delete, extract, insert pages. Thumbnails and selection feedback. Undo where supported. | Must | Draft |

### 9.4 PDF Utilities and Conversion

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-013 | Organisation | Merge PDFs | Combine multiple PDFs in a user-defined order. Progress shown. | Must | Draft |
| FR-014 | Organisation | Split PDF | By page ranges, individual pages, or defined ranges. Preview results. Each output downloadable. | Must | Draft |
| FR-015 | Optimisation | Compress PDF | Compression levels or presets. Communicate quality and size trade-offs. Tell the user if size cannot be reduced. | Must | Draft |
| FR-016 | Conversion | Convert PDF | PDF to Word, Excel, PowerPoint, and image formats. Report unsupported or imperfect content honestly. | Must | Draft |
| FR-017 | Conversion | Convert to PDF | From Word, Excel, PowerPoint, JPG/PNG (initial candidates). Check layout against source where practical. | Must | Draft |

### 9.5 Security and Privacy Features

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-018 | Security | Protect PDF | Password protection and supported permission restrictions. Password never logged or stored in plaintext. | Should | Draft |
| FR-040 | Security | Unlock PDF | Unlock supported password-protected PDFs with the correct password. Subject to legal and technical constraints. | Should | Draft |
| FR-041 | Security | Redact PDF | True redaction removes underlying text/content from output. Distinct from whiteout. Includes a confirmation or preview step. Must not be recoverable by copy, search, or extraction. | Must | Agreed direction; Phase 1, gated on redaction POC (see design doc) |
| FR-042 | Security | Watermark PDF | Text or image watermarks with position, opacity, scale, page range. | Could | Draft |
| FR-043 | Security | Secure processing and isolation | Isolated, least-privilege processing. Validate signature, size, and content. Prevent cross-user access and unsafe execution. No public object access by default. | Must | Draft |
| FR-022 | Privacy | File lifecycle | Secure upload, processing, storage, versioning, retention, deletion, backup and recovery. Private object storage, per-user access. | Must | Draft |

### 9.6 Accounts, Plans, and Access

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-020 | Account | Accounts | Registration, sign-in, sign-out, password recovery, session management via a selected auth provider. | Must | Draft |
| FR-044 | Account | Profile and account settings | Manage display name, email, password and security settings, and account deletion requests. | Should | Draft |
| FR-021 | Billing | Plans and quotas | Anonymous, free-account, and Pro entitlements. Limit tasks, features, file size, page count, and storage separately. Enforce in UI and API. | Must | Draft |
| FR-023 | Access | Anonymous usage | Use supported tools without mandatory sign-in, subject to quota and temporary session history. | Must | Draft |
| FR-024 | Usage limits | Anonymous quota | 3 completed PDF tasks before a registration prompt. The next task then triggers the prompt. Preferred definition: one completed document workflow, not each edit. | Must | Agreed (DEC-003); task metering per OD-006 proposal |
| FR-030 | Usage limits | Task metering | Count a completed workflow as one task. Exceptions for failed jobs, retries, batch operations, and recurring quotas. Must resist accidental double counting. | Must | Agreed direction; OD-006 proposal |
| FR-025 | Feature gating | Feature gating | Define tool availability for anonymous, free, and Pro users. Show clear locked-feature explanations. No misleading non-functional controls. Server enforces entitlements. | Must | Open |
| FR-026 | Registration | Registration prompt | Prompt at quota threshold and at relevant save or cross-device moments. Preserve current work where possible. | Must | Draft |
| FR-027 | Subscription | Pro upgrade | Contextual upgrade prompts and plan comparison. No misleading claims. | Should | Open |

### 9.7 Recent Documents and My Documents

| ID | Module | Requirement | Description | Priority | Status |
|---|---|---|---|---|---|
| FR-028 | Recent documents | Anonymous recent uploads | Recently used anonymous documents within the session or temporary retention window. Reopen where still available. Show expiry. | Should | Agreed direction (in Phase 1, per DEC-005) |
| FR-029 | Recent documents | Registered document library | Persistent cloud-backed My Documents. View, search, sort, rename, download, delete, and reopen. Continue editing the latest saved version across devices. Users only access their own documents. | Should | Agreed direction |
| FR-031 | Organisation | Folders and subfolders | Create, rename, delete folders. Move PDFs between folders. Organise by project or category. All-documents / root view and breadcrumbs. Deletion never silently destroys documents. | Should | Agreed direction |
| FR-038 | Library | Search and sort | Search by filename. Sort by name, last modified, date created. Respect folder scope. | Should | Draft |
| FR-039 | Library | Thumbnails and metadata | Show filename, preview thumbnail, size, last modified. Fallback if thumbnail fails. | Should | Draft |

### 9.8 Requirement Count

| Priority | Count | IDs |
|---|---|---|
| Must | 30 | FR-001 to FR-008, FR-010, FR-012 to FR-017, FR-019 to FR-024, FR-025, FR-026, FR-030, FR-032, FR-034 to FR-037, FR-043 |
| Should | 13 | FR-009, FR-011, FR-018, FR-027, FR-028, FR-029, FR-031, FR-033, FR-038, FR-039, FR-040, FR-041, FR-044 |
| Could | 1 | FR-042 |
| **Total** | **44** | FR-001 to FR-044 |

---

## 10. Acceptance Criteria

| ID | Requirement | Given | When | Then | Status |
|---|---|---|---|---|---|
| AC-001 | FR-001 | User is on the upload page | Selects a valid PDF within limits | Accepted and opened for editing | Draft |
| AC-002 | FR-001 | User selects an unsupported or oversized file | Attempts upload | Clear validation message with next step | Draft |
| AC-003 | FR-019 | Document has valid pending edits | User chooses export / download | Valid PDF with edits is generated and downloadable | Draft |
| AC-004 | FR-021 | User has used their full plan quota | Starts a quota-limited task | Blocked before processing; upgrade or reset info shown | Draft |
| AC-006 | Direct text editing | PDF has selectable text | User clicks within a text run and edits | Caret or selection available; surrounding typography and layout preserved as far as supported | POC required |
| AC-007 | Text box formatting | User inserts a text box | Text box is selected | Font family, size, colour, bold, italic, underline, alignment controls available | Draft |
| AC-008 | Image manipulation | PDF contains an image | User selects it | Move, resize, rotate, replace, delete available where supported | Draft |
| AC-009 | Cloud access | Registered user saved a PDF | Signs in on another device | Document appears in My Documents at latest saved version | Draft |
| AC-010 | Folders | Registered user is in My Documents | Creates folders and moves PDFs | Hierarchy and locations persist across sessions | Draft |
| AC-011 | Anonymous quota | Anonymous user completed 3 counted tasks | Attempts another task | Registration prompt; current document kept where feasible | Metering open |
| AC-012 | Secure redaction | User redacts text | Output validated | Redacted content not recoverable by text extraction or search | Technical validation required |
| AC-013 | Save failure safety | Document has a last known-good saved version | A later save fails | Previous version remains available; failure clearly shown | Draft |

> Note: The workbook has no AC-005, and AC-006 to AC-013 put a feature name in the Requirement column instead of an FR ID. See Section 17.

---

## 11. Non-Functional Requirements

| ID | Area | Requirement | Initial target / question | Priority | Status |
|---|---|---|---|---|---|
| NFR-001 | Performance | Editor load time | Set a measurable target after choosing the renderer and test document sizes. | Must | Open |
| NFR-002 | Scalability | Concurrent processing | Async jobs or queues for CPU-heavy conversion and compression. | Must | Proposed |
| NFR-003 | Security | Transport and storage | HTTPS, encryption at rest, access controls, secure temporary URLs. | Must | Proposed |
| NFR-004 | Privacy | Data retention | Publish retention policy and automated deletion schedule. | Must | Open |
| NFR-005 | Reliability | Job recovery | Show job status, recover gracefully from failures. | Must | Proposed |
| NFR-006 | Compatibility | Browser support | Define supported desktop and mobile browsers and minimum versions. | Must | Open |
| NFR-007 | Accessibility | Editor usability | Keyboard navigation, labels, contrast, accessible controls. | Should | Proposed |
| NFR-008 | Observability | Operational monitoring | Track errors, processing time, queue depth, service health. | Must | Proposed |

---

## 12. Security and Privacy

| Area | Requirement | Implementation direction | Validation / acceptance | Status |
|---|---|---|---|---|
| Transport | Encrypt all traffic in transit. | HTTPS/TLS for app, APIs, storage access. | No insecure HTTP endpoints in production. | Must |
| Storage | Keep PDF objects private by default. | R2 private bucket; signed short-lived access or server-mediated retrieval. | Unauthenticated users cannot fetch private documents. | Must |
| Authorization | Enforce ownership on every document and folder API. | Resolve owner from authenticated session. Never accept owner identity from the request body. | Cross-account tests return denied or not found. | Must |
| Upload validation | Validate extension, MIME type, and file signature. Enforce file and page limits. | Reject malformed or unsupported input. Consider malware scanning as needs mature. | Test spoofed MIME, oversized, corrupt, and encrypted files. | Must |
| Secrets | Never expose API secrets or storage credentials in frontend bundles or logs. | Server-side environment secrets and rotation. | Automated secret scanning and deployment review. | Must |
| Retention | Define anonymous temporary retention and registered-user deletion lifecycle. | Delete versions, thumbnails, and derived artifacts per policy. | Deletion and retention tests pass. | **Open policy** |
| Backups / recovery | Define D1 recovery, object versioning or backups, recovery objectives. | Document backup scope, RTO, RPO. | Restore test before commercial launch. | **Open policy** |
| Redaction | True redaction removes underlying content. Whiteout is visual only. | Validated redaction implementation and post-export extraction checks. | Redacted text and images not recoverable in tests. | Must if redaction ships |
| Signatures | Treat saved signature images as sensitive data. | Store privately. Allow deletion. Do not log or expose. | Only owner can access. Deletion removes stored signature. | Must |
| Privacy disclosure | Explain processing, storage, retention, deletion, and third-party processors. | Publish privacy policy and terms before launch. | Policies reviewed for launch markets. | Must |

---

## 13. Subscription and Pricing

| ID | Plan | Feature / limit | Proposed policy | Value | Status |
|---|---|---|---|---|---|
| PL-001 | Free | Usage quota | Limited tasks per time window | TBD | Open |
| PL-002 | Free | Max file size / pages | Restrict size and page count | TBD | Open |
| PL-003 | Paid | Usage quota | Higher monthly or daily allowance | TBD | Open |
| PL-004 | Paid | Processing priority | Priority queue subject to capacity | TBD | Open |
| PL-005 | All | Transparent usage | Show remaining quota and reset time | Required | Proposed |
| PL-006 | All | Abuse prevention | Rate limits, file validation, automated safeguards | Required | Proposed |
| PL-007 | Anonymous | Task quota | 3 PDF tasks before sign-up prompt | 3 tasks | Agreed |
| PL-008 | Anonymous | Feature access | Selected basic editing available; advanced may be gated. | TBD | Open |
| PL-009 | Free account | Registered free tier | More generous limits and/or more tools than anonymous. | TBD | Open |
| PL-010 | Pro | Premium access | Higher limits and additional premium editor capabilities. | TBD | Open |

---

## 14. Phase 1 Release Checklist

| ID | Area | Release gate | How to verify | Priority | Status |
|---|---|---|---|---|---|
| REL-001 | Core editor | Upload, render, page navigation, and download work reliably. | Test valid, large, corrupt, encrypted, multi-page PDFs. | Must | Not started |
| REL-002 | Text editing | Direct in-place editing of selectable text works on a defined supported-PDF matrix. | Caret, selection, insertion, deletion, replacement, font matching, paragraph behaviour, export tests. | Must, critical feasibility gate | POC required |
| REL-003 | Text boxes | Font family, size, colour, and basic formatting controls. | Create, format, move, resize, export. | Must | Not started |
| REL-004 | Images | Insert and manipulate existing and new images. | Move, resize, rotate, replace, delete, export. | Must | Not started |
| REL-005 | Annotations | Highlight, underline, strikethrough, drawing, comments export correctly. | Create, recolour, edit, delete, reopen. | Should | Not started |
| REL-006 | Signatures | Type, draw, upload workflows work. Reusable storage protected. | Create, place, reopen, delete saved signature. | Must | Not started |
| REL-007 | Links and forms | Hyperlinks and supported form filling and creation survive export. | External and internal links, AcroForm fields, viewer compatibility. | Should | Not started |
| REL-008 | Page and utility tools | Page management, merge, split, compression produce valid output. | Validate page count, order, rotation, integrity. | Must | Not started |
| REL-009 | My Documents | Save, search, reopen, rename, download, delete across devices. | Account ownership, latest version, recovery after failed save. | Must | Not started |
| REL-010 | Folders | Nested folders, moving documents, persistence. | Navigation, breadcrumbs, moving, safe folder deletion. | Should | Not started |
| REL-011 | Usage and plans | Anonymous users complete 3 counted tasks before prompt. | Metering, failures, retries, threshold behaviour. | Must | Rules open |
| REL-012 | Security | Private documents not accessible to other users or anonymous visitors. | Cross-user access, signed URL expiry, upload validation, deletion tests. | Must | Not started |
| REL-013 | Reliability | Save and export failures visible; last known-good version preserved. | Simulate network and processing failures. | Must | Not started |
| REL-014 | Commercial readiness | No non-functional controls. Limits, terms, privacy, pricing transparent. | Release audit and policy review. | Must | Not started |

---

## 15. Open Decisions and Risks

| ID | Type | Question / risk | Why it matters | Recommended next action | Status |
|---|---|---|---|---|---|
| OD-001 | Technical risk | Can an open-source stack deliver genuine in-place text editing with caret placement, font matching, and paragraph reflow? | Most demanding core differentiator. Cannot be assumed from PDF.js. | Build a POC against representative PDFs before committing to a library. | **Critical open** |
| OD-002 | Technical risk | How are scanned or image-only PDFs handled? | True text editing needs OCR and reconstruction. Overlay text is not equivalent. | Defer full OCR editing if needed. Detect and label scanned PDFs clearly. | Open |
| OD-003 | Technical risk | Which libraries cover editing, forms, annotations, conversion, export? | No single library covers all Sejda-like capabilities. | Preliminary feature/license screen is recorded in [the PDF engine license screen](../pdf-engine-license-screen.md); choose dependencies only after the POC and version-specific notice review. | Screen complete; selection open |
| OD-004 | Technical risk | Can workloads fit Vercel Functions and browser limits? | Large files and conversions may exceed memory, duration, or CPU limits. | Benchmark representative files. Design an async processing seam. | Open |
| OD-005 | Product decision | Exact feature matrix for anonymous, free, and Pro plans? | Needed for quota enforcement and pricing. | Define after cost and usage modelling. | Direction approved; numbers provisional |
| OD-006 | Product decision | What counts as one PDF task, and when does quota reset? | Affects the 3-task limit and fairness. | Count completed workflows. Define retries, batch jobs, reset period. | Decided (proposal; see design doc) |
| OD-007 | Product decision | Storage quotas, retention, version limits? | Affects cost, expectations, privacy. | Set initial quotas after estimating R2 usage and processing cost. | Decided (proposal; provisional until cost model) |
| OD-008 | Product decision | What happens when a folder containing PDFs is deleted? | Prevent accidental loss. | Block deletion until contents are moved, or move to parent or trash. | Decided (proposal: block non-empty deletion) |
| OD-009 | Product decision | Maximum folder nesting depth? | Navigation clarity and data complexity. | Start with a bounded depth. Confirm in UX design. | Decided (proposal: 5 levels) |
| OD-010 | Commercial | Pricing, payment provider, supported markets? | Launch, taxes, payment methods depend on markets. | Research India-first and international requirements. | Parked (user decision) |
| OD-011 | UX | Capture current Sejda screenshots and workflow references. | Parity is functional and interaction-based, not pixel-verified. | Reference checklist for toolbar, selection, save/apply, download. | Open |
| OD-012 | Scope | Which conversion formats are launch-critical? | Office fidelity may need external engines or paid infrastructure. | Prioritise after feasibility testing. | Open |
| OD-013 | Security | Privacy, data residency, retention commitments? | PDFs may contain sensitive data. | Threat model and legal review before launch. | Parked (user decision) |

---

## 16. Development Dependencies

The Development Plan (Section 8.2) lists these explicit dependencies:

- **DEV-02** (technical POC) depends on TR-002 and TR-003.
- **DEV-03** (foundation) depends on the architecture.
- **DEV-04** (core editing) depends on DEV-03.
- **DEV-05** (utilities) depends on the processing engine.
- **DEV-06** (commercial) depends on identity, billing, and storage.
- **DEV-07** (QA and launch) depends on all Phase 1 modules.
- **DEV-08** (Phase 2 discovery) depends on Phase 1 launch and feedback.

The workbook marks the POC as a required feasibility check (TR-003, DEC-013, OD-001). The POC is therefore recommended before core editing is committed, but the workbook does not list it as a formal dependency of DEV-04.

---

## 17. Source Inconsistencies to Resolve

These issues were found while reading the workbook. Resolution status is noted per item. The workbook (.xlsx) has been updated to match these decided values (backup kept as PDF_Editor_SaaS_Complete_Requirements_v0.6.backup.xlsx).

1. **Roadmap row without ID.** Partly resolved: values are realigned to their columns, and Priority is "Should" (auto-decided). The ID is missing from the source and was not invented, so it stays "(missing - not in source)" until the owner supplies it.
2. **Missing AC-005.** Resolved: the gap is intentional. Do not renumber, so existing references stay valid.
3. **Mixed column layout.** Not applied. Not in the user's explicit list; still open.
4. **Stray column.** Not applied. Not in the user's explicit list; still open. TR-010 and TR-011 "Must" still need reconciling against "Open".
5. **Duplicate user stories.** Resolved: US-012 is merged into US-006, and US-013 into US-007.
6. **Anonymous quota status.** Resolved: the 3-task limit is final (DEC-003). FR-030 metering follows the OD-006 proposal in the design doc.
7. **Recent uploads status.** Resolved: FR-028 is "Agreed direction" and is included in Phase 1, per DEC-005.
8. **Redaction priority.** Resolved: true redaction ships in Phase 1, FR-041 is Must, and it is gated per content type (see design doc).


---

## 18. Recommended Next Steps

1. Build the **technical POC** (DEV-02), focusing on in-place text editing, font matching, and export fidelity (OD-001, REL-002).
2. Confirm the provisional Phase 1 numbers (OD-005 feature matrix, OD-007 quotas) against a cost model, and confirm the OD-006/008/009 proposals. Parked: TR-008/OD-010 (auth, payments, markets) and NFR-004/OD-013 (retention, residency).
3. Resolve the source inconsistencies in Section 17.
4. Choose the authentication provider and payment provider (Section 4.2, TR-008).
5. Define the retention, deletion, and backup policy (NFR-004, Section 12).
6. Capture the Sejda reference checklist (OD-011).

---

*Source: `PDF_Editor_SaaS_Complete_Requirements_v0.6.xlsx`, 19 sheets. Update this document when the workbook changes.*
