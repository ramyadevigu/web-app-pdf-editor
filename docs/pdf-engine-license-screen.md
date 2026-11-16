# PDF Engine Commercial License Screen

**Status:** DT-02 complete; preliminary screen for candidate products, not legal advice or a final dependency audit.  
**Reviewed:** 15 November 2026  
**Scope:** Browser-based Release 1 rendering, editing, forms, annotations, page operations, and PDF export. The current direction prefers open-source libraries and excludes commercial SDKs from the initial release.

## Summary

- PDF.js and pdf-lib pass the initial license-compatibility screen for consideration under their published Apache-2.0 and MIT licenses, respectively. Their notices and all bundled/transitive component notices must be retained as required.
- These candidates do not by themselves establish feasibility for the full editor. PDF.js is a renderer/viewer, and pdf-lib's documented modification model draws content onto pages; neither is selected as a solution for in-place editing of existing text.
- MuPDF's AGPL option is not cleared for the current product. Use would require a deliberate AGPL compliance decision; Artifex also offers a commercial license whose exact terms and price require vendor review.
- Apryse WebViewer and Nutrient Web SDK are capable commercial alternatives, but are excluded from the current Release 1 candidate set because the approved direction says no commercial SDK in the initial release. No paid contract has been reviewed or approved.
- No PDF engine is selected by this screen. The exact package versions, bundled dependencies, notices, and any additional fonts or codecs must be checked before adding a dependency or shipping a build.

## Feature and license matrix

| Candidate | Relevant feature coverage documented by vendor/project | License and commercial-use obligations | Screen outcome |
|---|---|---|---|
| [PDF.js](https://github.com/mozilla/pdf.js) | Browser PDF parsing and rendering. Treat forms and annotations as viewer capabilities to verify against required workflows; it is not the PDF content-editing/export engine. | [Apache License 2.0](https://github.com/mozilla/pdf.js/blob/master/LICENSE). Permissive commercial use; retain required license/copyright notices and review notices for bundled components. | **License pass; renderer candidate only.** Not a text-editing or export solution by itself. |
| [pdf-lib](https://github.com/Hopding/pdf-lib) | Browser-capable PDF creation/modification; documented drawing of text, images, and vectors, page add/remove/split/merge, and AcroForm create/fill/read. This supports overlays and utility operations, not a demonstrated in-place editor for existing text or a complete annotation UI. | [MIT License](https://github.com/Hopding/pdf-lib/blob/master/LICENSE.md). Commercial use is permitted; include the copyright and license in copies or substantial portions. Check dependencies and bundled notices separately. | **License pass; utility/overlay candidate.** Scope limitations mean it does not pass the full editor capability gate. |
| [MuPDF](https://mupdf.com/) | PDF rendering and document-processing engine; assess the specific SDK/API and target browser deployment before considering it for any feature. | [Artifex licensing](https://artifex.com/licensing): AGPLv3 community license or a separately negotiated commercial license. Artifex states that its AGPL use in a server-based service requires disclosure of the application's source to users; commercial terms are case-specific. Review the applicable license and architecture with counsel before use. | **Not cleared for the default stack.** Excluded unless AGPL compliance is explicitly approved or a suitable commercial agreement is reviewed and approved. |
| [Apryse WebViewer](https://docs.apryse.com/web/get-started/guides/) | Vendor documents browser-based viewing, annotations, signatures, forms, redaction, page manipulation, and PDF text editing. Capabilities and output still require validation against this product's requirements. | A [commercial license key is required for production](https://docs.apryse.com/web/get-started/faq/add-license); trial keys are not production licenses. Obtain and review the commercial agreement, modules, deployment rights, key handling, and quote with Apryse. | **Excluded from current Release 1 scope.** Revisit only after explicit approval of a commercial SDK and its terms. |
| [Nutrient Web SDK](https://www.nutrient.io/api/web/) | Vendor's Web SDK feature catalogue includes document viewing, editing, annotations, forms, signatures, and other PDF workflows. Confirm exact components and support for each required workflow. | [Subscription licensing](https://www.nutrient.io/guides/web/license/) is based on components, operational mode, server-side needs, and users. Production domains must be agreed and configured; the end-product owner signs a license contract. Review the full contract, components, deployment, and quote with Nutrient. | **Excluded from current Release 1 scope.** Revisit only after explicit approval of a commercial SDK and its terms. |

## Required notices and follow-up

1. Keep the upstream license text, copyright notices, and any required third-party notices for every selected package and shipped component. Do not rely on the top-level package license alone.
2. Before adding any package, record its exact version and transitive dependency/license inventory. Review assets such as fonts, WASM modules, codecs, and worker bundles separately.
3. Before any proprietary SDK evaluation beyond vendor-authorized trial use, review the evaluation terms. Before production, obtain an approved agreement and protect license keys according to vendor guidance.
4. A license pass is not a feature-quality or security pass. The POC and workflow acceptance tests remain required; redaction retains its separate gate.
5. Recheck all terms at the time of dependency selection and release. This screen captures public vendor/project documentation viewed on the review date and is not legal advice.

## Sources

- PDF.js license and project description: [LICENSE](https://github.com/mozilla/pdf.js/blob/master/LICENSE), [project site](https://mozilla.github.io/pdf.js/).
- pdf-lib license and documented features: [LICENSE.md](https://github.com/Hopding/pdf-lib/blob/master/LICENSE.md), [project documentation](https://pdf-lib.js.org/).
- Artifex license options and AGPL/commercial terms: [Licensing](https://artifex.com/licensing).
- Apryse WebViewer capabilities and production key requirement: [WebViewer guides](https://docs.apryse.com/web/get-started/guides/), [license key](https://docs.apryse.com/web/get-started/faq/add-license).
- Nutrient capabilities and licensing: [Web SDK API](https://www.nutrient.io/api/web/), [licensing](https://www.nutrient.io/guides/web/license/), [features](https://www.nutrient.io/sdk/features-list/).
