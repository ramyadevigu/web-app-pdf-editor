# QA Report: localhost

Date: 2026-11-20
Target: http://127.0.0.1:3000/
Mode: Full
Tier: Standard
Branch: main
Platform: Local Next.js application
Duration: Baseline validation

## Summary

QA found 1 issue, fixed 0. The app loads successfully and the tested browser contracts are green. The one finding is a low-severity lint warning outside the browser surface and is deferred under the Standard fix tier.

Health score: 100

PR Summary: QA found 1 issue, fixed 0, health score 100.

## Evidence

- Local route returned HTTP 200.
- Desktop screenshot: `screenshots/initial.jpg`
- Mobile 375x812 screenshot: `screenshots/page-mobile.jpg`
- Browser title: `PDF Editor`
- Browser heading: `PDF Editor`
- Browser body text: `Project skeleton. Tools will be added as feature modules.`
- Browser console errors: 0
- Page errors: 0
- Next.js production build: passed
- Vitest: configured; no test files found
- ESLint: 0 errors, 1 warning

## Top Issues

### ISSUE-001: Unused variable in POC script

- Severity: Low
- Category: Maintainability
- Fix status: Deferred
- Commit SHA: None
- Files changed: None
- Location: `scripts/poc/poc.mjs:391`
- Evidence: ESLint reports `prefix` is assigned a value but never used.
- Impact: No observed user impact; it adds noise to lint output.
- Repro: Run `npm run lint`.

## Health Score

Tested category scores:

| Category | Score | Weight |
| --- | ---: | ---: |
| Console | 100 | 15% |
| Links | 100 | 10% |
| Visual | 100 | 10% |
| Functional | 100 | 20% |
| UX | 100 | 15% |
| Content | 100 | 5% |
| Accessibility | Not scored | 15% |
| Performance | Not scored | 10% |

Computed tested-category score: 100.

## Final Recheck

- HTTP route: passed
- Desktop render: passed
- Mobile 375x812 render: passed
- Build: passed
- Lint: passed with the deferred low-severity warning
- Test suite: no test files to execute

## Remaining Risks

- The app is a project skeleton; core PDF editing features are not implemented.
- The lint warning remains in `scripts/poc/poc.mjs`.
- Browser automation used the integrated browser because Aside was unavailable and the gstack fallback browser setup failed.
