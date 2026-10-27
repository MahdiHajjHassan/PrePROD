# Observed staging evidence

Date:2026-10-27. Application source:efc86be989eec0edbc1f7c02a2df7da8d65ea870.
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
| Fresh-clone rehearsal | In progress; exact revision/results appended below |
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
