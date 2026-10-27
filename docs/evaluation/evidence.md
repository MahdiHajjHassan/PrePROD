> Superseded Taskboard record. The current product is Tic Tac Toe.
> Start with README.md, AGENTS.md, docs/api/games.md and
> docs/evaluation/tic-tac-toe-evidence.md. The accepted team is Mahdi/Joseph.
> Current game work is uncommitted Mahdi/Codex-assisted source in the managed
> tic-tac-toe worktree. No commits, pushes or publication are authorized.
> Preserve actual authorship; record Joseph review/adaptation only when observed.
> The older Taskboard routes, module counts and checks below are historical.

# Observed staging evidence

Date:2026-10-27. Final application/bootstrap source:cc05a2c0b27c456f37ed253a8aed677389e4f881.
This is automated staging evidence, not an official score or human defense.
Final-history repository writes remain prohibited.

| Check | Observed outcome |
| --- | --- |
| npm run verify | Passed complete ordered pipeline |
| Real SQLite server/HTTP tests |103/103 passed across22 files |
| Typecheck | Passed Prisma+Next route generation and strict TypeScript |
| ESLint | Passed max-warnings0 |
| Production build | Passed locally and in Docker with no build-time .env |
| Browser suite |33/33,11 each actual Chrome/Firefox/Edge |
| Real HTTPS | CA chain/hostname/readiness verified separately from browser exception |
| Auth/task/API smoke | Real HTTPS lifecycle passed, temporary tasks removed, sessions revoked |
| Artifact audit | Both PDF hashes unchanged, no tracked private artifacts, configured secrets absent from public build |
| Fresh-clone rehearsal | Passed at cc05a2c: npm ci/setup/migrate/seed,103 tests/types/lint/build/audit and11 Chrome flows |
| UI review | Rendered AR360/1280 and both themes inspected; no material layout finding |
| Independent review | Four Important findings accepted and fixed, RED→GREEN; full suite green |

## Important review fixes

The independent review covered a0b80e7..4f553df; all four issues were accepted and
fixed in efc86be. API scope is now immutable and rechecked inside the write
transaction even if the actor is promoted while a body is read. Denied private
mutations discard the old document/router state. Lone-surrogate strings reject
before writing. Rehearsal uses an explicit clone-local database and sanitized
child configuration. Focused tests failed first; full103 tests and all33 browser
cases now pass. No independent second review of the fix is claimed.

## Mandatory versus personal gates

Code and automated checks cover frontend/backend/database, validation/security,
multi-user integrity, local HTTPS/container startup, legal pages, responsive/
keyboard UI, current Chrome and complete README/source attribution. Original
M01 evidence proves persistence across app recreation, and the same named volume
has been retained through subsequent builds/migrations; bootstrap never resets
existing credentials. Isolated tests reset only their checked test container.

The selected implementation targets14 core+2 buffer, as mapped in the module
matrix. Actual official assessment, personal understanding, human counterpart
review and a Joseph-authenticated contribution are not manufactured by automated
checks. Manual CA trust on the evaluation computer is documented separately.
All staged source is genuinely Mahdi/Codex-authored under the owner's revised
all-staging instruction; later reuse preserves it.

## Limits/advisories

See decisions.md for exhaustive execution decisions and three pre-existing
nonblocking diagnostics/startup limitations. Impeccable reported one overused
Arial advisory, intentionally retained under the system-font/no-remote-font brief;
no suppression or extra visual dependency was added. See review.md and
browser-matrix.md for exact review boundaries and TLS/console semantics.

## Fresh-clone and bootstrap proof

The complete verify run passed103 server/33 browser cases on the reviewed fixed
business code (efc86be) with the8a54f85 network warmup. Fresh-clone testing then
found a missing ignored-client generation before local seed. Bootstrap fix
cc05a2c makes db:seed generate first. A new clone passed installation, private
setup, migrations/seed, all103 tests, types/lint/build/audit and11 Chrome cases.

The cold Docker build from that clean source also completed. This managed VFS
host then exhausted disk at runtime generation; reclaiming unused builder cache
restored healthy startup. The final successful whole rehearsal reused that exact
freshly built application image within the32GB limit. No claim is made that
the earlier cold combined command returned success before resource recovery.
Normal database/certificate volumes were preserved throughout.

The parent rehearsal was intentionally given unrelated DATABASE_URL and
DOTENV_CONFIG_PATH sentinel paths. Neither was created; child configuration
used only the fresh clone/test volume. Exact revision/commands were retained
in ignored rehearsal artifacts. No human defense or Joseph contribution was
inferred from this automated proof.

Final demo uses the cold-built cc05a2c image. Its app/proxy are healthy; the
original normal-user identifier digest is unchanged across recreation. Verified
CA/hostname HTTPS and real auth/task/allfiveAPI smoke passed again; temporary
tasks were removed and sessions revoked.
