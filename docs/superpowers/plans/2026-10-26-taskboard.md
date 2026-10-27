# Minimal Taskboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans for the assigned batch. Read docs/superpowers/plans/2026-10-26-team-contributions.md first: Codex/Mahdi and Claude/Joseph implement separate packages. Do not execute the entire plan on one side or preimplement the other person's features. Steps use checkbox syntax for tracking.

**Goal:** Deliver one understandable task board with all mandatory requirements, 14 core module points, and a 2-point buffer, then stop.

**Architecture:** A Next.js application implements both the React frontend and the backend. All entry points share authorized task/user services, using Prisma and a single SQLite database. Caddy terminates HTTPS; the app and database require no external service.

**Tech Stack:** Node.js 24 LTS, Next.js 16 App Router, React, TypeScript, Tailwind CSS 4, Prisma 7/SQLite, Caddy; Zod, Argon2id, csv-parse/csv-stringify; Vitest and Playwright. Verify compatible supported patch releases before locking dependencies.

**Spec:** docs/superpowers/specs/2026-10-26-taskboard-design.md. Read PRODUCT.md, AGENTS.md, and both reference PDFs as well.

## Team schedule and ownership

The contribution plan controls chronological batch order and handoffs; this file
retains the technical acceptance steps. Some technical tasks are deliberately
split so both people implement substantial real features.

| Technical task | Acting owner/batch |
| --- | --- |
| 1 Foundation | Mahdi M01 |
| 2 Identity backend | Mahdi M02; Joseph implements the UI under Task 4 |
| 3 Task services | Mahdi M03 writes/validation; Joseph J03 query/search |
| 4 UI and SSR | Joseph J01/J02/J03 |
| 5 Administration | Mahdi M04, including its composed UI |
| 6 Public API | Mahdi M05 |
| 7 Transfers | Mahdi M06, including transfer controls |
| 8 Themes/languages/RTL/legal | Joseph J01/J02 foundations and J04 completion |
| 9 Browser coverage | Joseph J05 |
| 10 Core gate | Mahdi M07 using both sides' merged checks |
| 11 Events/notifications | Mahdi M08; event writes in activity/writer.ts |
| 12 Activity aggregation/dashboard | Joseph J06; reads in activity/service.ts |
| 13 Final verification | Joseph J07 UI; Mahdi M09 server/deployment |
| 14 Docs/rehearsal | Mahdi M09 integration; Joseph J08 independent repetition |

Joseph reads docs/team/JOSEPH-CLAUDE-HANDOFF.md; both sides maintain their own
docs/team/contributions/ record. Existing Mahdi-authored planning commits are
not reassigned. No application implementation starts from this schedule update.

## Global Constraints

- Proposed product: one shared public task board; guest, MEMBER, and ADMIN access.
- Core module total: 14. Target including B01 and B02: 16. No further feature work.
- Support light/dark themes; no separate theme points.
- Support en, fr, ar, Arabic RTL, stable Chrome, Firefox, and branded Microsoft Edge.
- Tasks: title 1–120 characters; description 0–1,000; LOW/NORMAL/HIGH priority;
  OPEN/DONE status; positive version starting at 1.
- Passwords: 12–128 characters, Argon2id >=19 MiB, 2 iterations, parallelism 1.
- Sessions: random 32-byte token, only SHA-256 hash stored, 7-day expiration;
  __Host-taskboard_session cookie is Secure, HttpOnly, SameSite=Lax, Path=/.
- Page size: 25. page 1–100,000. q <=100 characters. Four explicit sort values.
- Imports: UTF-8 JSON/CSV only, <=256 KiB, <=200 rows, all-or-nothing transaction.
- External API: five task endpoints, X-API-Key, 60 requests/minute/key.
- Deploy: docker compose up --build -d --force-recreate after one-time environment/CA setup; retain data/certificate volumes.
- All browser, script, and external API connections use HTTPS. No app host port.
- Preserve reference PDFs and vendored Impeccable. No additional skills without approval.
- The commands below are planned interfaces, not commands already present or verified.
- No implementation begins as a side effect of writing this plan.

## Planned command and test environments

Create these package scripts in Task 1: typecheck (tsc --noEmit), lint (eslint .),
test:server (vitest run), build (prisma generate followed by next build),
test:e2e (playwright test), smoke (node scripts/smoke.mjs), rehearse
(node scripts/rehearse.mjs), and verify (node scripts/verify.mjs).

All Playwright runs use a separate Compose project, default taskboard-e2e and
port 8443, generated ignored .env.e2e, and its own database/certificate volumes.
Support per-checkout TASKBOARD_E2E_PROJECT and TASKBOARD_E2E_PORT overrides. When
sharing a Docker host, Mahdi uses taskboard-e2e-mahdi/8443 and Joseph uses
taskboard-e2e-joseph/9443. Derive the HTTPS base URL and test APP_ORIGIN from that
port; normal demonstrations use port 443. Permit database reset only for the
explicit test environment and validated taskboard-e2e project prefix.
Compose exposes only 127.0.0.1:{HTTPS_PORT}:443, with HTTPS_PORT defaulting to 443.
Environment settings are explicitly mapped into the app from the selected env
file. Never reset or delete normal project volumes during automated tests.

Playwright global setup builds/starts the isolated project and waits for healthy
HTTPS. Fixtures reset only its database using a direct local script with an
explicit test-project/path guard; no unauthenticated reset HTTP route exists.
Run shared-database browser scenarios serially and reset before each scenario.
The verify script runs typecheck, lint, server tests, production build, the
isolated TLS checks, and browser tests, failing immediately on any failed check.
The rehearsal script is a separate explicit clean-install demonstration.

## Review Focus

1. A user bypasses the UI and changes another user's task or role: reject on every
   server entry point. Pin in Tasks 3, 5, 6, and 7.
2. Two requests edit a task or remove the last admin at the same time: preserve
   version/administrator invariants. Pin in Tasks 3 and 5.
3. An import or export contains malformed Unicode, oversized data, or spreadsheet
   formula prefixes: reject safely or neutralize output without partial writes.
   Pin in Task 7.
4. A signed-in admin is demoted, changes their password, logs out, or deletes an
   account: stale sessions and rendered private data must not retain access.
   Pin in Tasks 2, 5, and 10.
5. Arabic, long content, empty data, or dark mode makes a control unusable:
   all routes remain readable, keyboard-operable, correctly mirrored, and free
   of private-data leaks or hydration errors. Pin in Tasks 4, 8, 9, and 13.

## Files and responsibilities

- PRODUCT.md: durable product facts and explicitly proposed decisions.
- DESIGN.md: implementation-time Impeccable visual foundations and component rules.
- AGENTS.md: current repository commands, conventions, and required skills.
- package.json/package-lock.json, tsconfig.json, next.config.ts, eslint.config.mjs:
  pinned tooling, strict TypeScript, and explicit script interfaces.
- prisma/schema.prisma, prisma/migrations/: models, relations, indexes, migrations.
- src/generated/prisma/: generated client, regenerated by build, not hand-edited.
- src/server/db.ts, config.ts, errors.ts, services.ts: database/config/error
  primitives and composition of feature services. Never import into client bundles.
- src/server/auth/{service,session,policy}.ts: auth, secure sessions, authorization.
- src/server/security/{rate-limit,origin}.ts: persistent limits and origin checks.
- src/server/tasks/{schema,service}.ts: task validation, reads, ownership, and writes.
- src/server/users/{schema,service}.ts: profile and admin mutations and role guards.
- src/server/transfers/{schema,service}.ts: portable formats and validated bulk writes.
- src/server/api/{http,api-key}.ts: response mapping and external authentication.
- src/shared/{tasks,errors}.ts: public DTOs/types/error-code contracts only.
- src/i18n/{config,dictionary}.ts and src/i18n/messages/{en,fr,ar}.json:
  locale selection and complete typed message catalogs.
- src/components/ui/: the 12 named reusable components.
- src/components/{app-shell,theme-toggle,locale-switcher}.tsx and
  src/features/{tasks,auth,users,transfers}/: composed application controls.
- src/app/[locale]/{layout,page}.tsx, tasks/page.tsx, login/page.tsx,
  register/page.tsx, account/page.tsx, admin/users/page.tsx,
  privacy/page.tsx, terms/page.tsx: actual pages. The locale root redirects to tasks.
- src/app/{layout,page}.tsx, globals.css, robots.ts, sitemap.ts: root shell,
  redirect, semantic tokens, public-only discovery metadata.
- src/app/api/health/route.ts: readiness without credentials or stack traces.
- src/app/api/auth/{register,login,logout}/route.ts.
- src/app/api/tasks/route.ts and tasks/[id]/route.ts.
- src/app/api/account/route.ts and account/password/route.ts.
- src/app/api/admin/users/route.ts and users/[id]/route.ts.
- src/app/api/transfers/{import,export}/route.ts.
- src/app/api/public/v1/tasks/route.ts and tasks/[id]/route.ts.
- Joseph-owned read queries: src/server/tasks/query.ts; TaskService.list delegates
  to queryTasks(db, query) after the agreed M03/J03 handoff.
- Buffer: src/server/activity/{schema,writer,service}.ts,
  src/server/notifications/service.ts, src/features/{activity,notifications}/,
  src/app/[locale]/{activity,notifications}/page.tsx,
  src/app/api/notifications/route.ts and notifications/[id]/route.ts.
- Dockerfile, compose.yaml, Caddyfile, .dockerignore, .gitignore, .env.example:
  reproducible single-host deployment.
- scripts/{setup.sh,seed.ts,verify-tls.sh,smoke.mjs,test-db.ts,verify.mjs,rehearse.mjs}:
  bootstrap, safe local data, TLS checks, and verification. No hidden test backdoors.
- tests/helpers/{db,fixtures,e2e-setup}.ts, tests/server/, tests/browser/,
  vitest.config.ts, playwright.config.ts: real-db tests and browser demonstrations.
- docs/requirements/module-matrix.md, docs/api/{openapi.yaml,examples.sh},
  docs/evaluation/{rehearsal,evidence}.md, README.md: traceability and honest evidence.

## Shared interfaces

Define these once; later tasks must use the same names.

~~~ts
type Role = "MEMBER" | "ADMIN";
type Actor = { id: string; role: Role };
type TaskInput = {
  title: string; description: string;
  status: "OPEN" | "DONE"; priority: "LOW" | "NORMAL" | "HIGH";
};
type TaskPatch = Partial<TaskInput>;
type TaskDTO = TaskInput & {
  id: string; owner: { id: string; displayName: string };
  version: number; createdAt: string; updatedAt: string;
};
type TaskQuery = {
  q?: string; status?: TaskInput["status"]; priority?: TaskInput["priority"];
  ownerId?: string;
  sort: "created_desc" | "created_asc" | "updated_desc" | "title_asc";
  page: number;
};
type PaginatedTasks = { items: TaskDTO[]; total: number; page: number; pageSize: 25 };
~~~

Service factories receive a PrismaClient so tests use disposable real databases.
src/server/services.ts composes production instances. A DomainError has one of
VALIDATION, UNAUTHENTICATED, FORBIDDEN, NOT_FOUND, CONFLICT, RATE_LIMITED and optional
field errors; one HTTP adapter maps these to the spec's status codes and JSON shape.
Errors from unknown causes become a generic 500 response with a safe server log.
No server service imports a browser component or returns a complete User row.

### Task 1: Capture the baseline and prove HTTPS/database deployment

**Files:** Root configuration and container files, Prisma schema/migrations,
src/server/{config,db,errors}.ts, src/shared/{tasks,errors}.ts, health route,
scripts/{setup.sh,seed.ts,smoke.mjs,verify-tls.sh}, tests/helpers/,
tests/server/readiness.test.ts, and the backend/build tooling configs. The first
actual Playwright harness is owned by Joseph J01 and extended in J05.

**Interfaces:** createTestDb(): Promise<{db: PrismaClient; close(): Promise<void>}>;
seedUser(db, input): Promise<{actor: Actor; email: string; password: string}>;
readiness(): Promise<{status: "ok"; database: "ok"}>.

- [x] Confirm the planning baseline and remaining team identity information when
  available. The setup/plans are already committed; review the latest main and
  preserve that baseline before isolating the assigned implementation with
  superpowers:using-git-worktrees. Do not lose local files or forge contributors.
- [x] Verify framework/ORM/Node compatibility, pin exact patch versions, scaffold
  only required tooling, and establish test helpers with isolated temporary DBs.
- [x] Add readiness and persistence checks that initially fail: /api/health must
  return exactly {status:"ok",database:"ok"} over the TLS proxy, and a row written
  to the database must survive recreating the app container.
- [x] Implement core User, Session, Task, and RateLimitBucket models, migrations,
  indexes, foreign keys, WAL/busy-timeout configuration, and the shared contracts.
- [x] Implement setup.sh using umask 077 and cryptographic randomness to write an
  ignored .env without overwriting an existing file. Variables: DATABASE_URL,
  APP_ORIGIN, ADMIN_EMAIL, ADMIN_PASSWORD, API_ACTOR_EMAIL, PUBLIC_API_KEY.
  Seed admin and API-demo member only on a fresh database; never reset their
  passwords or resurrect deleted accounts on restart.
- [x] Implement the app/proxy containers, persistent data/certificate volumes,
  migration-before-start, health checks, and loopback-only HTTPS host binding.
  Document copying/trusting Caddy's local CA in evaluation browsers.
- [x] Run npm run test:server -- tests/server/readiness.test.ts, npm run build,
  docker compose up --build -d, npm run smoke, and ./scripts/verify-tls.sh.
  Expect successful migrations, verified TLS, 200 readiness, persistence, and
  no published app HTTP port. Review and commit the deployable foundation.

### Task 2: Implement secure signup, login, sessions, and account changes

**Files:** Auth/security services, auth/account routes, user schema/service,
tests/server/{auth,sessions,origin,rate-limit}.test.ts.

**Interfaces:** createAuthService(db) exposes register(input), login(input, clientKey),
resolveSession(rawToken): Promise<Actor|null>, logout(rawToken), changePassword(actor,input).
Login returns the token only to its route handler for Set-Cookie. Shared
consumeLimit(scope,key,limit,windowSeconds) returns {allowed,retryAfterSeconds}.

- [x] Write failing tests: signup cannot set ADMIN; invalid email/password fails;
  stored password differs from plaintext and verifies with Argon2id; the session
  database stores a hash rather than the cookie token.
- [x] Add expiration/logout/password-change tests: a 7-day-expired token resolves
  to null, logout revokes access, and a password change revokes all prior sessions.
- [x] Add HTTP tests: cross-origin mutation returns 403, secure-cookie attributes
  are present, login errors are generic, and simultaneous limiter requests never
  exceed a configured allowance.
- [x] Run the named tests and confirm their intended failures, then implement the
  services, constant-shape errors, trusted-proxy client identification, and policy.
  Login limits: 5 attempts/15 minutes/email+client and 10/15 minutes/client;
  registration: 5/15 minutes/client. Expired limiter rows are periodically pruned.
- [x] Implement own-display-name and own-password changes. Never permit a client
  to change email, role, owner, or another account through the account endpoint.
- [x] Run npm run test:server -- tests/server/auth.test.ts tests/server/sessions.test.ts
  tests/server/origin.test.ts tests/server/rate-limit.test.ts; expect all pass.
  Review and commit the identity layer.

### Task 3: Implement task rules, combined search, and concurrency controls

**Files:** Task schema/service, task routes, production service composition,
tests/server/{tasks,task-query,task-concurrency}.test.ts.

**Interfaces:** createTaskService(db) exposes list(query), read(id), create(actor,input),
update(actor,id,patch,expectedVersion), remove(actor,id,expectedVersion).
Returns are PaginatedTasks, TaskDTO, TaskDTO, TaskDTO, and void respectively.

- [x] Write failing tests for title/description boundaries, role and ownership,
  anonymous writes, and strict rejection of extra owner/role fields.
  Representative assertion:
  ~~~ts
  await expect(tasks.update(memberB, taskA.id, {status:"DONE"}, taskA.version))
    .rejects.toMatchObject({code:"FORBIDDEN"});
  ~~~
- [x] Test two simultaneous updates with the same version: exactly one succeeds;
  the other returns CONFLICT; the final version increments once. Test independent
  users creating tasks simultaneously without missing/corrupt records.
- [ ] Seed 60 tasks; test combined query/status/priority/owner filters, deterministic
  sorting, total count, and page boundaries. Query strings and punctuation must
  not become SQL instructions; invalid sort/query values return validation errors.
- [x] Confirm failures, then implement basic parameterized reads, public DTO projection,
  owner/admin write checks, atomic version predicates, and bounded lock retry.
  Reject stale deletes with 409 as well as stale updates.
- M03 completes the write/validation/concurrency steps above. The 60-row query
  cases and complete query backend/final combined check remain Joseph J03;
  current reads intentionally provide only the newest first page. See
  docs/api/tasks.md for the precise replacement boundary.
- [ ] Run npm run test:server -- tests/server/tasks.test.ts tests/server/task-query.test.ts
  tests/server/task-concurrency.test.ts; expect all pass and no private fields in
  returned DTOs. Review and commit the task backend.

### Task 4: Establish the design system and server-rendered application

**Files:** DESIGN.md, root/locale pages and styles, components/ui/, app shell,
task/auth/account feature components, i18n foundation, robots/sitemap,
tests/browser/{auth,tasks,ssr,components}.spec.ts.

**Interfaces:** getDictionary(locale) returns the typed message dictionary;
resolveLocale(value) returns en/fr/ar; reusable controls accept accessible names,
state, and event handlers. Server pages call the services from Task 3 directly.

- [ ] Follow the already-loaded Impeccable context and proposed PRODUCT.md.
  At execution, resolve approved product facts, read the applicable new-work
  guidance, and establish a restrained Operate-mode DESIGN.md. Immediately before
  UI edits read reference/craft-floor.md. Do not commission images or add skills.
- [ ] Specify and write failing browser checks for registration/login/logout,
  task creation/completion/edit/delete, forbidden-action visibility, and stale
  conflict recovery. Controls must also work using the keyboard.
- [ ] Implement the 12 reusable components named in the spec and shared semantic
  tokens/type/icon rules. Compose public tasks, auth, and account pages from them.
  Include meaningful empty, pending, success, validation, and failure states.
- [ ] Implement SSR of actual task text and useful metadata, a public-only sitemap
  and robots behavior, no-store responses, public-data disclosure, and safe text
  rendering. No database code or API key may enter client bundles.
- [ ] Add a browser test with JavaScript disabled that still finds the seeded task
  title and usable filter links in the initial HTML. Add an XSS payload title and
  assert it is displayed as text with no script execution.
- [ ] Run npm run test:e2e -- --project=chrome tests/browser/auth.spec.ts
  tests/browser/tasks.spec.ts tests/browser/ssr.spec.ts tests/browser/components.spec.ts.
  Expect all pass, no console/hydration errors, and at least 10 components used
  in real flows. Run npm run build, review the rendered results, and commit.

### Task 5: Complete administrator user and role management

**Files:** User service, admin routes/page/features, shared policy,
tests/server/admin-users.test.ts, tests/browser/admin.spec.ts.

**Interfaces:** createUserService(db) exposes listUsers(actor,query),
updateUser(actor,id,{displayName?,role?}), deleteUser(actor,id).
Only authorized admins can use these methods; public DTOs omit credentials.

- [ ] Write failing tests for admin viewing/editing/deleting users and assigning/
  revoking roles; direct MEMBER requests must be FORBIDDEN even if UI is bypassed.
- [ ] Add a concurrent test with two administrators: competing demotions/deletions
  cannot leave zero admins. Test current-role lookup immediately after demotion.
- [ ] Test account deletion: sessions and owned tasks disappear atomically; an
  old cookie loses access; other users' tasks remain. Test private admin data is
  never rendered for a non-admin request.
- [ ] Confirm failures, then implement the transactional last-admin guard,
  user/role operations, route checks, current-role session resolution, and
  translated-ready admin interface with deletion consequences and confirmation.
- [ ] Run npm run test:server -- tests/server/admin-users.test.ts and
  npm run test:e2e -- --project=chrome tests/browser/admin.spec.ts.
  Demonstrate guest/member/admin differences and immediate role revocation.
  Review and commit. M02 is not earned merely by hiding buttons.

### Task 6: Add the five secured public API endpoints

**Files:** External API route files, api-key/http helpers, OpenAPI document,
tests/server/public-api.test.ts, docs/api/examples.sh.

**Interfaces:** authenticateApiKey(request): Promise<Actor>; uses the current
API_ACTOR_EMAIL member and PUBLIC_API_KEY; all CRUD calls use TaskService.
Public endpoint and response contracts are exactly those in the design spec.

- [ ] Write failing HTTP tests for all five endpoints: missing/bad key ->401,
  valid key plus deleted actor ->403, valid reads ->200, create ->201,
  update ->200, delete ->204. Wrong ownership ->403 and stale version ->409.
- [ ] Test the 61st request in one minute returns 429 with Retry-After, shared
  across all five routes. Invalid-key attempts are capped at 20/minute/client
  without consuming the legitimate key's quota.
- [ ] Confirm failures, implement key-hash constant-time comparison, shared
  persistent limits, strict JSON validation and TaskService delegation.
  Require expectedVersion in PUT and DELETE request bodies.
- [ ] Document authentication, request/response shapes, pagination, validation,
  rate limits, ownership, and all error statuses in OpenAPI and runnable curl
  examples using the local CA. Never hardcode the generated key into docs.
- [ ] Run npm run test:server -- tests/server/public-api.test.ts and
  ./docs/api/examples.sh; expect the complete lifecycle and rejection cases.
  Inspect client build output for credential leaks; review and commit M03.

### Task 7: Add validated JSON/CSV import and export

**Files:** Transfer schema/service/routes/features, TaskService import method,
tests/server/transfers.test.ts, tests/browser/transfers.spec.ts.

**Interfaces:** parseTaskImport(bytes,format): TaskInput[];
tasks.importMany(actor,rows): Promise<{created:number}>;
transfers.export(query,format): Promise<{bytes:Uint8Array; contentType:string}>;
format is json or csv. Export reads the entire filtered result set.

- [ ] Write failing tests: 201 rows or >256 KiB is rejected; malformed UTF-8,
  malformed formats, extra owner/role fields, missing columns, and invalid enums
  produce row/field errors and zero new tasks.
- [ ] Test a batch with one bad row leaves the database unchanged. Test valid
  records become the importing user's tasks; imported duplicates append.
- [ ] Test Unicode/quotes/newlines, formula-safe CSV, JSON preservation of original
  text, and export of all 60 matching tasks while the UI displays only 25.
  Assert exports never contain user email or password/session fields.
- [ ] Confirm failures; implement parsers, full prevalidation, transactional bulk
  writes reusing task validation/authorization, both exports, and import feedback.
- [ ] Run npm run test:server -- tests/server/transfers.test.ts and
  npm run test:e2e -- --project=chrome tests/browser/transfers.spec.ts.
  Demonstrate both formats and a rejected batch. Review and commit M11.

### Task 8: Finish localization, true RTL, and both themes

**Files:** Complete en/fr/ar dictionaries, locale/theme controls, cookies,
all application components/pages including legal pages, shared CSS,
tests/server/dictionaries.test.ts, tests/browser/appearance.spec.ts.

**Interfaces:** All UI error codes resolve through the selected dictionary;
theme is light or dark, default light; validated preference cookies preserve
theme/locale across navigation, reload, and new sessions.

- [ ] Write a dictionary parity test comparing complete nested key sets across
  en/fr/ar; missing strings must fail. Write browser checks for localized forms,
  errors, admin controls, import feedback, and legal content.
- [ ] Test theme persistence across reload and SSR/client agreement without
  hydration errors. Test an invalid theme/locale cookie falls back safely.
- [ ] Test Arabic html lang/dir, mirrored structural alignment and logical spacing,
  correct directional controls, and LTR email/API examples at 360px and 1280px.
  Both themes must remain keyboard-operable with visible focus and readable contrast.
- [ ] Confirm failures; finish complete translations, RTL behavior, theme tokens/
  toggle and secure preference cookies, and relevant privacy/terms content.
  Never translate user-entered task descriptions or fabricate a legal operator.
- [ ] Run npm run test:server -- tests/server/dictionaries.test.ts and
  npm run test:e2e -- --project=chrome tests/browser/appearance.spec.ts.
  Inspect long Arabic content in both themes. Review and commit M07/M08 and theme work.

### Task 9: Verify actual Chrome, Firefox, and Microsoft Edge

**Files:** Playwright configuration, browser fixtures, tests/browser/multiuser.spec.ts,
docs/evaluation/browser-matrix.md.

**Interfaces:** Playwright projects chrome (channel chrome), firefox, edge
(channel msedge). Record actual product versions, viewport, locale, and theme.

- [ ] Configure and install the actual browsers; do not substitute a generic
  Chromium run for Chrome and Edge. Establish clean isolated sessions per account.
- [ ] Run core auth, task, search, admin, import/export, theme, locale, RTL, SSR,
  keyboard, and responsive scenarios in all three browser projects.
- [ ] Add a two-context test: A and B sign in simultaneously; each creates a task;
  refresh shows both; B cannot change A's task. Add role-revocation coverage with
  already-open contexts. No synchronization infrastructure is needed.
- [ ] Fail tests for unexpected console errors, hydration failures, unhandled page
  errors, and leaked credentials. For automation, a local-CA exception must be
  explicitly labeled; separately prove TLS verification with the CA and perform
  the manual trusted-browser checks without certificate bypass.
- [ ] Run npm run test:e2e and ./scripts/verify-tls.sh; all three projects and TLS
  checks pass. Record evidence/limitations honestly, fix findings, review and commit M09.

### Task 10: Audit the 14-point core and mandatory requirements

**Files:** README draft, module matrix, evaluation evidence/rehearsal,
scripts/rehearse.mjs, any fixes required by evidence.

**Interfaces:** npm run verify runs typecheck, lint, server tests, production build,
and browser verification in their documented order. npm run rehearse exercises a
fresh local install and records the demonstrated module states.

- [ ] Build the traceability matrix with M01–M11, mandatory requirements, exact
  source references, implementation locations, demonstrations, and status.
  Planned and implemented entries are not marked demonstrated.
- [ ] Run npm run verify and a clean-volume install using generated demo credentials.
  Verify one-command startup, browser-trusted HTTPS, secure cookies, persistent
  database data, API limits, authorization, and invalid-input behavior.
- [ ] Inspect repository/build output for real secrets, stale copied content,
  nonexistent commands, fabricated claims, and accidental private-page indexing.
- [ ] Rehearse every module: framework frontend/backend, full admin CRUD/roles,
  five API operations, migrations/relations, combined search/pagination, 10+
  actual components, three languages, RTL, three browsers, SSR, both import/export
  formats. A failed module is fixed before moving on.
- [ ] Draft all chapter VI README sections and the schema diagram. Obtain actual
  team/42 logins and task ownership from the owner before final attribution.
  Describe Superpowers/Impeccable/AI use and require team understanding.
- [ ] Review fixes and commit evidence. Continue to buffer only when the mandatory
  core is working. No estimated point total is a substitute for this gate.

### Task 11: Add complete domain notifications as the first buffer point

**Files:** Buffer schema/migration, activity/event writer, notification service/
routes/page/components, changes to auth/user/task/import transactions and
dictionaries, tests/server/{events,notifications}.test.ts,
tests/browser/notifications.spec.ts.

**Interfaces:** recordDomainEvent(tx,event): Promise<{id:string}>;
createNotificationService(db) exposes list(actor), unreadCount(actor),
markRead(actor,id), markAllRead(actor). The event and recipient rules are in the spec.

- [ ] Write a table-driven failing test covering task/user CREATE/UPDATE/DELETE
  through browser, external API, admin, import, and cascade paths. Every success
  emits one safe event and the required recipient records; failures/rollbacks
  emit none. Password values and session/API tokens must never appear in payloads.
- [ ] Test account deletion, zero recipients, duplicate retries, mark-all-read,
  another user's notification access, and session/limiter/event operations not
  recursively creating notifications.
- [ ] Confirm failures; implement transactional events and recipient fan-out,
  unread count, list, mark-one/all-read, and complete translated UI.
  Ordinary refresh is sufficient; no WebSocket/SSE service is introduced.
- [ ] Run npm run test:server -- tests/server/events.test.ts
  tests/server/notifications.test.ts and npm run test:e2e -- --project=chrome
  tests/browser/notifications.spec.ts. Recheck all original mutation tests,
  review the full event matrix and commit B01.

### Task 12: Derive the personal activity dashboard as the second buffer point

**Files:** Activity service/page/features, translated messages,
tests/server/activity.test.ts, tests/browser/activity.spec.ts.

**Interfaces:** activity.getSummary(actor,now) returns current/previous 7-day
UTC totals for created/completed/deleted tasks, seven daily buckets, and deltas.
Counts derive from the immutable events added in Task 11.

- [ ] Write failing tests using a fixed clock: events on either side of midnight
  and the 7-day boundary fall into the right buckets; other users' events never
  contribute; deleted tasks still count; zero history gives zero totals.
- [ ] Test repeated DONE edits do not count twice; DONE->OPEN->DONE is explicitly
  counted as two completion actions and labeled as actions rather than unique tasks.
- [ ] Confirm failures; implement aggregation and a compact dashboard with totals,
  previous-period comparisons, one seven-day chart, and an accessible data table.
  Keep chart labels and empty/error states translated; do not invent insights.
- [ ] Run npm run test:server -- tests/server/activity.test.ts and
  npm run test:e2e -- --project=chrome tests/browser/activity.spec.ts.
  Demonstrate real actions changing the totals; review and commit B02.
  The selected scope is now 16 points. Add no further module.

### Task 13: Final Impeccable, browser, and regression pass

**Files:** Existing UI/services as findings require, final evidence.

- [ ] Read the applicable Impeccable audit/polish guidance and inspect completed
  UI at 360px and 1280px, all locales, both themes, and zero/long-content states.
  Run .agents/skills/impeccable/scripts/impeccable detect --json src once after
  UI work is complete; fix actual findings rather than adding unrelated features.
- [ ] Repeat dictionary parity and all three actual-browser suites including the
  notification/activity routes. Recheck focus, contrast, chart alternatives,
  dialogs, overflow, and console cleanliness. Record observed outcomes.
- [ ] Run npm run verify. Repeat only checks affected by subsequent fixes.
  Reconfirm PDFs' baseline hashes and that .env, databases, cookies, and generated
  secrets are ignored. Review and commit the verified final changes.

### Task 14: Finish documentation and run the defense rehearsal

**Files:** README.md, module matrix, OpenAPI/examples, rehearsal and evidence,
AGENTS.md with real commands, actual test/build results.

- [ ] Finish the English README with the exact prescribed italicized opening
  using actual 42 logins, description, setup instructions/prerequisites, resources/
  AI use, team roles, management, justified stack, schema, features, module
  calculations/ownership, individual contributions, and known limitations.
- [ ] Document one-time .env generation and trusted local CA setup; then prove
  docker compose up --build -d works from a fresh clone/environment. Show data
  survives restart and all configuration/credential steps match the README.
- [ ] Rehearse with guest, member A, member B, and admin sessions on one computer.
  Show public SSR content, permissions, role changes, API/limits, both transfer
  formats, combined search/pagination, themes, languages/RTL, notifications, and
  event-derived activity. Show actual Chrome, Firefox, and Edge evidence.
- [ ] Have actual team members explain the architecture, their own work, and
  another member's work. Preserve genuine contributions; do not manufacture commits
  or rehearse answers as substitutes for understanding.
- [ ] Complete the evidence matrix: mandatory pass/fail separately; M01–M11
  demonstrated =14; B01/B02 demonstrated =2; selected total =16. If an interpretation
  or failure changes that count, fix it or agree a replacement rather than
  inventing points. Light/dark remains included with no separate points.
- [ ] Run the final fresh verification, review git status/diff, and prepare the
  requested integration/release using the applicable Superpowers finishing
  workflow. Hosting, publication, or merging is outside this planning request.
  Stop development at the agreed scope.

## Self-review of this plan

- All 11 core modules and 2 buffer modules have explicit deliverables and proof.
- Mandatory frontend/backend/database, multi-user behavior, HTTPS, validation,
  legal pages, single-command containers, credentials, Chrome/console checks,
  README, actual contributions, and understanding each have an owning task.
- Cross-entry-point permissions, stale writes, last-admin races, unsafe transfers,
  session revocation, private SSR, translations, RTL, themes, and empty/long content
  have named verification steps.
- Buffer is built after the core. There is no claim of separate points for theme
  switching, mandatory authentication, or basic accessibility.
- Current application/test scripts do not exist. Their listed commands are the
  interfaces the implementer must create and subsequently verify.
- The owner confirmed Mahdi and Joseph as the team and josephboustany as Joseph's
  GitHub account. Remaining facts are 42 logins, local author-email choices,
  repository access setup, and campus clarifications; no old identity is guessed.
- Execution is split by the contribution schedule: each agent implements only
  the acting person's unlocked batch using Superpowers, with Impeccable for UI.
  No additional skill is needed. Publishing the split is not application execution.
