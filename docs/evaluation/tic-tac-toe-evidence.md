# Tic-tac-toe evidence — 2026-10-27

This is the replacement in the managed codex/tic-tac-toe worktree,
based on c9df8f81aa79ca8e9dc5fe53cf1bd77b02e1d896. The owner later authorized
staging commit/push on2026-10-27. No external deployment or volume deletion
was authorized. Original subject/evaluation PDFs and historical staging
manifests are unchanged. The owner explicitly accepted Mahdi/Joseph as the two
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
- Old product compatibility was waived by the owner. Taskboard routes/services
  are retired; its data volume remains untouched. New game-data and existing
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
  notifications or task module is claimed. AI is intentionally beatable.
- Joseph review/adaptation/contribution and both members' explanation are pending
  actual human work. No score or understanding is inferred from automation.

Private credentials are in the worktree .env. Ignored test logs/traces may contain
private inputs and must not be shared unredacted.
