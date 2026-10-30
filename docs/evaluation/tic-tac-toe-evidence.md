# Tic-tac-toe evidence — 2026-10-27

This is the replacement in the managed codex/tic-tac-toe worktree,
based on c9df8f81aa79ca8e9dc5fe53cf1bd77b02e1d896. The owner later authorized
staging commit/push on2026-10-27. No external deployment or volume deletion
was authorized. Original subject/evaluation PDFs are unchanged. The owner explicitly accepted Mahdi/Joseph as the two
members; no additional contributor or personal understanding is inferred.

## Observed verification

- Windows Node24/npm native suite:81/81,21files after the fresh review fixes.
- Typecheck and lint: passed after the final user-creation UI type fix.
- Fresh working-source rehearsal: npm ci, own ignored setup, migrations, repeated
  safe seed, native tests/types/lint/build and public-artifact audit. The
  review-fixed fresh-copy retry passed13/13 Chrome cases on9443. A selector-only
  correction followed an initial12/13 run;114 runtime files match the worktree.
- Prior actual Chrome/Edge game run:22/22 before the final review additions.
  Final expanded Chrome/Edge results:26/26 passed (1.7minutes).
  npm run verify passed:81tests,types,lint,build,artifact audit and all26cases.
- Final normal Compose build/recreation and strict TLS/auth/game smoke passed.
  Saved accounts/matches survived, and the original .env remains byte-identical.
- Linux application tests:80/80,20files. The Git-dependent export fixture is
  verified on Windows; the runtime image does not install Git.
- Normal Chrome trusted HTTPS and administrator form checks passed:1280px light,
  360px dark, no overflow or unexpected console errors. Body/muted contrast:
  light13.88/6.45; dark15.85/8.58. Actual form/game captures were inspected.
- Runtime UID1000; only Caddy publishes127.0.0.1:443. Test containers stopped;
  all data/certificate volumes remain.

## Candidate module evidence

G01: Next frontend/backend, production build and actual browser/HTTPS journeys.
G02: eight winning lines/draw, invalid/occupied/terminal board tests, human
win/draw/replay and resignation/cancellation, persistent move rows.
G03: server-side O policy, immediate win/block/center/corner and imperfect branch
with controlled literal fixtures; real browser AI game. No external AI API.
G04: scoped full SSE snapshots, abort release, five-stream bound, revocation,
reconnect, monotonic versions and two actual browser sessions. No presence claim.
G05: real disposable SQLite/Prisma, unique game-cell/ply, independent join/move/
resignation races and account deletion racing a move.
G06: eleven composed shared primitives and consistent tokens; actual Arabic
360px light/dark captures inspected; keyboard activation retains focus.
G07/G08:128 keys/language, English/French/Arabic, Arabic RTL and LTR codes,
localized deleted-player labels, responsive/remembered theme and legal form checks.
G10: real saved board/public rules/metadata rendered with JavaScript disabled.
G11: administrator creation/edit/list/deletion/roles, current-role checks, hashed
passwords, uniqueness/validation, final-administrator race, revocation and
transactional account deletion/anonymized game snapshots.

Current target:13 core +2 advanced-permission buffer =15 candidate points.
G09 is unclaimed: Chrome156.0.8078.47 and Edge156.0.4314.42 were exercised, but
Playwright Firefox157/155 cannot start on this Windows installation because the
SxS loader cannot resolve the bundled mozglue assembly. Elevated diagnostic was
approved. Original binaries were restored after isolated unsuccessful manifest
probes; TLS/browser security settings were never bypassed. Explicit Firefox
project remains available; default verification runs Chrome and Edge. Official
module scoring and human defense remain separate.

## Fresh review and fixes

One fresh gpt-6-astra whole-source read-only review found no Critical issue. Its
Important findings were missing administrative account creation and absent named
failure-path regressions. Its finished-game anonymization finding was re-graded
Important because deleting an account must update an already-open opponent view.

New account-creation and terminal-version tests were observed RED, then GREEN.
The final81-test suite includes deletion/move race, revoked stream/opponent
anonymization and exact losing-join CONFLICT. Expanded browser cases cover a
committed move whose response is lost (no automatic retry), delayed old snapshots,
and administrative account creation. No second review was dispatched.

## Decisions and limits

- Implementation and testing initially prohibited commits/pushes. The subsequent
  owner request authorizes staging Git delivery. Preserve the worktree, actual
  source-copy evidence and the ignored execution ledger.
- Runtime game-data and existing
  Caddy certificate volumes survive recreation.
- Reuse the restrained Operate tokens, without additional skills/assets/fonts.
- Rehearsal uses exact present tracked + nonignored untracked files, excludes
  credentials/databases/builds/Git, and checks a SHA256 manifest. Source-export
  include/omit/tamper behavior is tested. Only its already trusted test CA volume
  is shared with another isolated test project; game databases are separate.
- Windows setup checks actual NTFS ACLs; Linux checks POSIX permissions. Windows
  browser allocation failures were traced to commit exhaustion; closing unused
  apps resolved Chrome/Edge failures. Unexpected browser errors were not hidden.
- The fresh review overlapped read-only platform checks, then fixes received
  renewed full verification. Tests/source copies replace commits per owner rule.
- The original dependency junction was moved intact to ignored scratch, then
  replaced with its own npm ci because Next/Turbopack requires dependencies in
  the workspace. Original Desktop dependencies stayed untouched; cost:disk/time.
- Single application process and one computer/separate sessions are the target.
  No multi-instance broker, remote-play, tournament, public API, statistics,
  notifications module is claimed. AI is intentionally beatable.
- Joseph review/adaptation/contribution and both members' explanation are pending
  actual human work. No score or understanding is inferred from automation.

Private credentials are in the worktree .env. Ignored test logs/traces may contain
private inputs and must not be shared unredacted.

## Product cleanup verification — 2026-10-27

At the owner's request, removed 30 superseded product documents, 53 unused CSS
rules, the unused Tabs component and the CSV parsing/stringifying packages.
Renamed cookies, proxy headers, database cache and CA overrides consistently;
updated all three 404 translations and aligned spec module IDs with this matrix.
Original source authorship remains in Git history; private environment files,
normal runtime data, certificate volumes and reference PDFs were preserved.

- Linux Node 24: 85/85 server tests across 22 files; types and lint passed.
- Production build and managed-cloud Docker build passed. Final unused-selector
  cleanup also received a fresh production build.
- Artifact audit passed; reference PDF SHA-256 values match the originals.
- Current project-source scan found zero retired product identifiers/routes;
  local Markdown links resolve. Only the two CSV dependency entries were removed;
  no other dependency versions changed.
- Cookie/IP and preference-cookie tests were observed RED, then GREEN. A source
  export regression test reproduced ENOTDIR when a tracked route directory was
  replaced by a file; the corrected exporter and full suite passed.
- Isolated HTTPS browser suite: 13/13 passed using system Chromium 154.0.8037.57
  through the chrome project executable override. Chain/hostname verification
  remained enabled. This run used tictactoe-e2e-cleanup, port 8443 and its own
  ignored environment/database/certificate volumes. It does not add evidence
  for the branded Chrome/Edge, Firefox or Safari compatibility claims.
- Direct verified-HTTPS requests confirmed /favicon.ico returns a real ICO with
  16/32/48px images and /icon.svg returns SVG, both matching the authored source.
  Rendered HTML advertises both with versioned URLs. The X/O icon uses #145bb3;
  its 16px rendering and the 360px Arabic light/dark game captures were inspected.
- A fresh independent read-only review found no actionable regressions.

The cookie namespace is now __Host-tictactoe_. Existing users sign in again and
reselect language/theme; saved accounts and games are unaffected. This cleanup
was verified locally; it adds no official points or personal contribution claims.

## Additional-browser verification — 2026-10-29

G09 was previously withheld because Playwright Firefox could not start in the
recorded Windows installation. On the current Linux environment, Firefox starts
successfully. The final full matrix passed **72/72 checks**, with no skips or
retries: 24 each in Google Chrome 156.0.8078.79, Playwright-managed Firefox
157.0, and Microsoft Edge 156.0.4314.56. G09 now contributes one candidate point:
14 core + 2 advanced-permissions points = **16 candidate points**.

The application was built and started in the separate Compose project
`tictactoe-e2e-browser-recovery`, HTTPS port 8643, with its own ignored
`.env.e2e.browser-recovery`, database and certificate volumes. Normal runtime
data and credentials were not reset. Browser and Node certificate/hostname
validation stayed enabled throughout the successful runs.

Linux trust setup: Chrome and Edge use the test public root imported into the
user's NSS store. For Firefox, the existing enterprise-root preference alone
did not trust the local authority in temporary automation profiles. A local
launcher imports only that public root into each Playwright-created Firefox
profile with `certutil`, then starts the original Firefox binary with the
original arguments. A positive HTTPS health check passed; a negative unsupported
hostname check was rejected. No TLS verification bypass was used.

The first trusted Firefox suite passed 23/24 checks. The failing Unicode profile
test immediately reloaded while its save-triggered server refresh was still in
flight, producing `NS_BINDING_ABORTED` and a Next.js fallback navigation. A
focused repeat reproduced the race. The test now reads a fresh server-rendered
account page in another tab while preserving the original page and its console
checks. It still verifies the exact saved accented/Arabic/emoji name. This
correction passed twice in every browser (6/6), followed by the full 72/72 matrix.
Application authentication and game code were unchanged.

Executed commands included `npm test` (116/116, 26 files), `npm run typecheck`,
`npm run lint`, and the three-project Playwright suite. The final browser run
used `.superpowers/browser-recovery/playwright.config.ts`, which extends the
repository configuration with absolute helper/test paths and the Firefox CA
launcher; Chrome and Edge used their existing executable-path overrides. The
same 24 repository tests ran per browser. Local setup, logs and the launcher
remain under ignored `.superpowers/browser-recovery/`; private environments,
test traces and certificate material remain private. Formatting and diff checks
passed, and both reference PDF SHA-256 checksums match the original baselines.

This verifies the current application in this Linux environment; it does not
claim that the earlier Windows loader installation was repaired or that an
official score was awarded. All claimed browsers must be reverified after
adding new modules. The owner added Khalid to the team and made preprod the
default for development; the proposed four new minor points are not implemented
or included in the current total.
