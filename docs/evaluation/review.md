# Independent review and resolutions

Reviewed immutable range a0b80e7..4f553df. All four reported issues were accepted
and addressed in efc86be. Focused backend regressions and full103-test suite,
typecheck and lint pass. The private-UI regression was observed failing in the
old real Chrome build; rebuilt browser validation is recorded in evidence.md.
No independent re-review of the fixed diff is claimed.

## Resolution map

| Finding | Fix | Regression |
| --- | --- | --- |
| P1 API member capability race | Captured memberOnly policy, enforced inside each write transaction | public-api.test.ts delayed-body promotion for PUT/DELETE |
| P2 stale private UI | Hard navigation discards old document/router cache after401/403 outside auth forms | admin.spec.ts stale role/session private-data removal |
| P2 malformed Unicode | Task title/description must be well-formed Unicode before writes | transfers.test.ts lone-surrogate rejection and valid Unicode preservation |
| P2 rehearsal DB target | Child app/dotenv/preload settings sanitized; explicit clone-local DB | rehearsal-env.test.ts and actual fresh-clone rehearsal |

## Original independent report

# Fresh whole-branch review

Reviewed 2026-10-27. Base `a0b80e75ff164b786e394b419fff7daf6891046e`; head `4f553dfcab15df16746ef155f9df43e0d6d2517d`. HEAD and clean tracked status were independently checked during review. Patch SHA-256: `46ab5a118f2b6fe2b54f1f9d7a3cafb2fbdb5810904b89c99702e1752421e27c`.

Binding context: latest AGENTS override, taskboard design specification and plan review focus, execution decisions, frontend brief. All original M/J packages are authorized in Transcendence2 staging and retain actual Mahdi/Codex authorship. No final-history push is authorized. Scope remains one public task board, 14 core +2 buffer.

## Verdicts

- **Spec: changes required.** Member-only external API scope, malformed-Unicode handling and stale private-page cleanup have concrete gaps. The architecture and implemented feature set otherwise track the small agreed scope.
- **Quality: changes required.** One P1 and three P2 findings below. The shared write services, transactional events, bounded input readers, deterministic queries and real-DB tests are strong foundations, but the uncovered boundaries need regressions.
- **Staging integration readiness:** do not mark this revision reviewed/passing or integrate it as the completed delivery. Fix the findings, run focused regressions and complete the pending browser/rehearsal gates. Preservation as a clearly unfinished staging checkpoint is a separate delivery decision. This review authorizes no push.

Severity below uses engineering review priority: P1 important defect to fix before integration; P2 meaningful correctness/safety/spec gap; P3 minor. No P0 found.

## Findings

### P1 — A promoted API actor elevates an already authenticated key request

**Locations:** `src/server/api/public.ts:18` and `:22`; `src/server/tasks/service.ts:14`–`:17`; `src/server/auth/policy.ts:16`–`:20`. Initial MEMBER check is `src/server/api/api-key.ts:18`–`:20`.

The public handlers authenticate the configured actor as MEMBER, then await the request body. TaskService later reloads the actor's current role inside its write transaction and permits ADMIN to modify foreign tasks. If an administrator promotes the API actor during that interval, the existing key request inherits the newly granted administrator authority. Checking only the role at initial authentication does not enforce the documented permanent ordinary-member capability of the key.

**Independent reproduction:** created a disposable migrated SQLite database containing an API MEMBER and another owner’s task. Called the real `createPublicApiHandlers().update` with a valid key and version, wrapping its request-body reader to commit an API-actor promotion on the first read (after authentication). Observed:

```json
{"status":200,"title":"Changed via promoted API key","nextRequestStatus":403}
```

The foreign task was actually modified. The subsequent request being rejected does not repair the first unauthorized write. DELETE has the same path; POST can also succeed after the key should have become disabled.

**Required fix:** carry an explicit immutable API credential scope into the service and enforce both MEMBER eligibility and owner-only authority within the same write transaction. Do not solve this with only a second role lookup outside the transaction, or by trusting a caller-supplied role. Preserve ordinary session ADMIN behavior.

**Regression:** delay valid-key bodies, promote the API actor before releasing them, and assert create/update/delete reject without task/event/notification changes. Include foreign-owner update/delete. Then demonstrate normal member-key and browser-admin writes still work.

### P2 — Known session/role revocation leaves rendered private data on screen

**Locations:** `src/features/api.ts:20`–`:23`, `src/components/feedback.tsx:10`–`:13`, `src/features/users.tsx:11`–`:17`; affected private table at `src/app/[locale]/admin/users/page.tsx:15`.

`useMutation` catches 401/403 and only sets an error. Refresh/navigation occurs solely after a successful operation. Feedback offers refresh only for 409/404; a 401 merely adds a login link and a 403 has no recovery. Thus an admin can open the users page, be demoted in another session, submit a user edit and receive 403 while the entire previously rendered email/user table and controls remain present. The same failure path retains an account page after another session changes its password, logs out the shared session, or deletes the account. This violates the explicit plan requirement for stale rendered private data, even though the server correctly denies subsequent operations.

**Evidence:** source-confirmed control flow, not an independently executed browser reproduction. The supplied browser admin test only checks the second session's direct API status; it never opens that session's private UI. No claim of new private data being returned after revocation is made. Previously disclosed data cannot be made unknowable; the fix concerns visible/cached private UI after revocation becomes known.

**Required fix:** on an authenticated-page 401/403, invalidate the private view and re-resolve identity/permissions; navigate to the appropriate public/login page or otherwise remove the private subtree immediately. Preserve generic invalid-credential feedback on the login form. Cover browser back/cache restoration and navigation after logout/password change as applicable, without adding polling or realtime scope.

**Regression:** render admin users in session B, demote B through session A, trigger a rejected B mutation, and assert emails/admin controls disappear. Repeat a private account action after session revocation and deletion, and check browser history does not restore authorized private controls/content.

### P2 — Escaped lone surrogates import successfully and are silently changed in storage

**Locations:** `src/server/transfers/schema.ts:13`, `:17`, `:25`; shared text validation at `src/server/tasks/schema.ts:4`–`:5`.

Fatal UTF-8 decoding validates input bytes, but a valid UTF-8 JSON document can contain an escaped lone surrogate. `JSON.parse` produces an ill-formed JavaScript string and the shared schema accepts it. The SQLite write converts it to U+FFFD, so the import reports success while changing the original text. This is the malformed-Unicode boundary named in the plan and contradicts JSON preservation of the original text. The pre-existing task text schema becomes a new bulk-import consequence here.

**Independent reproduction:** imported the following bytes through the real TransferService into a disposable migrated database:

```json
[{"title":"\ud800","description":"","status":"OPEN","priority":"NORMAL"}]
```

Observed `{created:1}` and stored title codepoints `[65533]` (replacement character), rather than rejection. No original taskboard data was touched.

**Required fix:** validate Unicode string well-formedness for title/description before persistence, preferably in the shared task schemas so JSON task writes and imports agree. Reject the entire invalid import with row/field validation errors. Keep valid surrogate pairs, Arabic and ordinary Unicode intact.

**Regression:** a valid row followed by an isolated high/low surrogate in either text field must reject with zero task/event/notification writes. Valid supplementary-plane characters must round-trip unchanged.

### P2 — Clean-clone rehearsal inherits an arbitrary database target

**Locations:** `scripts/rehearse.mjs:18`–`:19`, `:27`–`:30`; consumers `scripts/migrate.mjs:1`, `:7`–`:15` and `scripts/seed.ts:1`, `:6`–`:9`.

The rehearsal creates a clone-local `.env`, but all its migration/seed commands inherit `process.env`. Dotenv does not override already exported variables. A caller that has exported an absolute DATABASE_URL for their normal instance therefore runs the supposed fresh-clone migration/seed against that other database. On a nonempty database seeding preserves users, but migrations can still alter its schema; on an empty target it creates demonstration accounts there. The local clean-install path was not exercised at all. The separate browser reset guard does not cover this earlier host-side step.

**Evidence:** source-confirmed environment flow and dotenv default behavior. I did not execute a rehearsal against an external database or inspect the real environment/credentials.

**Required fix:** construct a controlled child environment for the rehearsal, remove inherited application/database/dotenv overrides and explicitly pin its database under the new checkout. Retain only needed host tooling/proxy/browser settings. Ensure the later build and audit use that same intended generated configuration.

**Regression:** run the rehearsal command orchestration with an exported absolute DATABASE_URL pointing to a disposable sentinel database and a conflicting dotenv configuration; verify every host DB command targets the fresh checkout and the sentinel remains untouched. A command-stub harness can cover routing without repeating expensive Docker/browser work.

## Other review observations

No additional blocker was found in the reviewed implementations of the last-admin transaction, task version predicates, current-role checks for browser mutations, notification recipient filtering, transactional domain/event writes, activity UTC boundaries, allowlisted combined query/sort, filtered all-row export, streamed byte limits or CSV spreadsheet neutralization. The existing tests meaningfully cover these cases; this statement is a static review assessment, not an independent rerun of their passing suite.

The explicit test-reset guard checks project prefix/argument, localhost high port and fixed container DB path; the harness checks the container Compose-project label before reset. No reset route is exposed. `verify` fails on nonzero child status and its browser setup independently verifies the CA chain/hostname. The inherited-environment finding above remains a separate gap in the rehearsal path.

Known baseline minors remain nonblocking by their actual effects: failed first `getDb` promise remains cached (`src/server/db.ts:20`, restart required after repair); logout accepts unused fields in bounded valid JSON (`src/server/auth/http.ts:27`); exceptional temporary-task cleanup can skip subsequent logout (`scripts/smoke-tasks.mjs:53`–`:57`). I found no additional escalation of those effects within this branch.

UI source uses reusable labeled controls, logical spacing, mirrored tab keys, native modal focus return, safe React text rendering, dark/light tokens and complete dictionary key parity. The Impeccable context and source detector were run. Detector returned only `overused-font` for Arial in `src/app/globals.css:4`; rejected as a blocking recommendation because the agreed restrained utility uses system fonts. No aesthetic redesign is warranted. The context tool also reported missing optional buildPath metadata; it was left unchanged under this read-only task. This is a source review, so a rendered accessibility/visual health score would be unjustified.

## Evidence and limits

**Independently executed:** API promotion race on disposable migrated SQLite; malformed JSON-surrogate import on a second disposable migrated SQLite; immutable head/clean-status check; `git diff --check` (passed); Impeccable context/source detection; PDF SHA-256 checks (both match AGENTS); review-patch hash above. Both temporary databases were disconnected and removed. Source/index/HEAD/refs/dependencies/Docker were not modified. Only this report artifact was written.

**Supplied by controller, not rerun:** 98 passing server tests, separately passing reset-guard subprocess test, passing typecheck/lint, credential-free container build after dynamic metadata repair, real rebuild/TLS/auth/task/all-five-API smoke. Initial Chrome run reached nine successful behavioral flows but failed fixture cleanliness on favicon 404, and JS-disabled SSR exposed hidden loading-boundary content. Those fixes are included in the reviewed head. The full post-fix 30 branded-browser cases and rebuild were still pending in the supplied brief; this report does not claim them green. Actual reported product launches: Chrome 156.0.8078.47, Firefox 157.0, Edge 156.0.4314.50.

**Not independently verified:** current rendered browser/viewport/contrast/long-content state; cross-tab/private-history cleanup; fresh-clone full rehearsal; persistence after container recreation; complete final 16-point demonstration; human imported-CA browser setup, personal understanding, Joseph review/authorship, or final-history delivery. I did not rerun expensive shared checks, interact with shared test containers, read `.env`/credentials/traces/logged network payloads, dispatch agents, or push anything. No unavailable human evidence is inferred from automation.

The fixes above should be reviewed at their new immutable revision. This report remains the review of `4f553df`, even if the controller later appends additional passing evidence.
