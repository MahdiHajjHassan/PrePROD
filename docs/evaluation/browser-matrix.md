# Actual browser verification

Observed 2026-10-27 on application source efc86be, with the committed
initial-Docker-network warmup in the test harness. The complete run passed
33/33 scenarios (11 per product), with retries=0 for test scenarios.

| Product | Actual version | Scenarios | Viewports/locales/themes |
| --- | --- | ---: | --- |
| Google Chrome stable | 156.0.8078.47 | 11 passed | 1280x900,360x900; en/fr/ar; light/dark |
| Mozilla Firefox | 157.0 | 11 passed | 1280x900,360x900; en/fr/ar; light/dark |
| Microsoft Edge stable | 156.0.4314.50 | 11 passed | 1280x900,360x900; en/fr/ar; light/dark |

Chrome/Edge are the official branded binaries, extracted locally because the
host has no root/sudo; Firefox is Playwright's actual Firefox product. No generic
Chromium result is substituted for either branded product. Executable overrides
are supported for this host; normal machines can install channels with Playwright.

Coverage includes register/login/account/password/logout; task CRUD; combined
filters/page2; no-JS SSR; private-data removal after401/403; admin roles/cascade/
last-admin guard; simultaneous users/foreign writes/stale edits/XSS; JSON/CSV
imports/downloads/rejected batches; language/theme persistence; RTL/responsiveness;
keyboard/Tabs/Dialog behavior; notifications and event-derived personal activity.
The console fixture fails unexpected browser warnings/errors/page errors and
allows only exact negative-case API paths/statuses declared by that test.

Automation explicitly permits the locally generated development CA. Before the
suite, global setup separately verifies the actual certificate chain and hostname
with that CA and strict TLS. Normal manual browser use imports the public CA and
uses no certificate bypass. A human trusted-browser interaction is not inferred.

One earlier run passed32/33: Chrome's first GET saw ERR_NETWORK_CHANGED while
Docker's new bridge was settling. The harness now waits for an actual browser
health navigation and retries only that one initial idempotent GET for this
specific error. It never retries test actions/assertions; the following complete
run passed33/33. No product exception or console-warning suppression was added.

Actual Arabic360/1280 dark/light captures were inspected by the frontend worker
and controller. No clipping/overflow/RTL defect was found. Source/static contrast
checks cover16 text-token pairs. The Impeccable audit is recorded separately.
