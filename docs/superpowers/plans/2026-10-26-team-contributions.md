# Two-Person Contribution and Push Plan

> For implementers: use the existing Superpowers implementation/verification workflows and Impeccable for UI work. Execute only the batch assigned to your side. This schedule refines the existing technical plan; it does not add product scope or authorize one agent to implement the other person's packages.

**Goal:** Mahdi/Codex and Joseph/Claude each implement, test, explain, commit, and
push substantial parts of Taskboard using their own configured identities.

**Technical specification:** docs/superpowers/specs/2026-10-26-taskboard-design.md.
**Technical steps:** docs/superpowers/plans/2026-10-26-taskboard.md.
**Joseph entry point:** docs/team/JOSEPH-CLAUDE-HANDOFF.md.

## Team and actual state

Repository clarification: Transcendence2 is staging/development. The final
contribution-history repository has not been created/provided. The owner permits
staging pushes whenever useful. Exact staged source commits and later owner-side
deliveries are tracked separately in docs/delivery/PUSH-MAP.md. Do not infer the
old Transcendence repository as the destination. The schedule below describes
owner packages, not a claim that staging pushes already satisfy final delivery.

The owner confirmed that the team is Mahdi and Joseph. Codex assists Mahdi;
Claude assists Joseph. This does not establish that either person has already
implemented or understood future features.

Mahdi's GitHub account is MahdiHajjHassan. Joseph's GitHub account must be confirmed
by Joseph/the owner and checked in Joseph's own session. The older project's
jboustan is a 42 login, not a verified GitHub account. Do not infer his email or
configure an account for him using that guess.

At preparation time the repository contains references, skills, and planning
documents only. Existing commits are Mahdi-authored. New feature ownership starts
with the batches below; existing commits are not reassigned to Joseph.

## Ownership

| Area | Mahdi / Codex | Joseph / Claude |
| --- | --- | --- |
| Foundation | Node/Next scaffold, package lock, database, migrations, Docker/Caddy, HTTPS, setup and server-test helpers | Adopt the agreed frontend interfaces; implement the real design system and app shell |
| Identity | Registration/login/session backend, origin checks, rate limits, account service | Registration/login/account forms, errors, keyboard behavior, legal pages |
| Tasks | Validation, ownership, create/update/delete, stale-write protection | Read-query implementation, combined search/filter/sort/pagination, board UI, SSR and metadata |
| Administration/API | Full admin feature including its UI, secured public API, OpenAPI, limits | Review usability and browser behavior; do not preimplement these features |
| Transfers | JSON/CSV parsers, transactional import, filtered export, transfer controls and tests | Cover their translated/RTL and cross-browser behavior |
| Appearance/inclusion | Reuse Joseph's components; supply feature-specific message keys | Design system, light/dark themes, full en/fr/ar translation, Arabic RTL |
| Buffers | Event schema/writer, complete notifications, notification UI and tests | Activity aggregation service, dashboard, chart/table, and tests |
| Verification/docs | Server correctness, security, deployment, final README integration | Browser automation, UI/RTL/theme checks, independent fresh-clone rehearsal |
| Personal records | Own contribution record and explainable changes | Own contribution record and explainable changes |

Proposed planning roles: Mahdi PO/technical lead/developer; Joseph project manager/
UI-and-quality lead/developer. Both implement features, write tests, review each
other's work, and learn the whole application. Record actual responsibilities
rather than treating role labels as proof of work.

There is no target commit count or artificial 50/50 quota. These are comparable
feature responsibilities. A branch pusher, commit author, PR author, merger, and
reviewer are separate facts; preserve their actual identities.

## Module ownership

| Module ID | Points | Primary implementation owner |
| --- | ---: | --- |
| M01 Frameworks | 2 | Shared: Mahdi backend/foundation; Joseph actual React application |
| M02 Advanced permissions | 2 | Mahdi |
| M03 Secured public API | 2 | Mahdi |
| M04 ORM | 1 | Mahdi |
| M05 Advanced search | 1 | Joseph, including query backend |
| M06 Design system | 1 | Joseph |
| M07 Three languages | 1 | Joseph |
| M08 RTL | 1 | Joseph |
| M09 Additional browsers | 1 | Joseph |
| M10 SSR | 1 | Joseph |
| M11 Import/export | 1 | Mahdi |
| B01 Notifications | 1 | Mahdi |
| B02 User activity analytics | 1 | Joseph, including aggregation backend |

The project still targets 14 core points plus 2 buffer points. Module ownership
helps demonstrations; points are awarded to the project, not divided between
individual members. Light/dark themes have no extra points.

## Ordered branches and push checkpoints

Use this order as the default. Merge a dependency before starting the dependent
branch from the latest main. Each batch normally contains one or two coherent
passing commits; split further only for a real independently verifiable change.

| Order | Batch | Owner | Original tasks | Branch | Required merged batches |
| --- | --- | --- | --- | --- | --- |
| 0 | M00 Team planning and handoff | Mahdi | Planning only | main, this documentation update | Existing setup |
| 1 | M01 Application/database/HTTPS foundation | Mahdi | 1 | mahdi/m01-foundation | M00 |
| 2 | J01 Design system, shell, themes | Joseph | 4 foundation, 8 theme foundation | joseph/j01-design-system | M01 |
| 3 | M02 Identity and session backend | Mahdi | 2 | mahdi/m02-auth | M01 |
| 4 | J02 Auth/account UI and legal pages | Joseph | 4 auth/account, 8 legal foundation | joseph/j02-auth-ui | J01, M02 |
| 5 | M03 Task writes and ownership | Mahdi | 3 write side | mahdi/m03-task-writes | M02 |
| 6 | J03 Task board, query/search, SSR | Joseph | 3 read side, 4 board | joseph/j03-task-board | J02, M03 |
| 7 | M04 Admin users and roles | Mahdi | 5 | mahdi/m04-admin | J03 |
| 8 | M05 Five secured API endpoints | Mahdi | 6 | mahdi/m05-public-api | M04 |
| 9 | M06 JSON/CSV import and export | Mahdi | 7 | mahdi/m06-transfers | M05 |
| 10 | J04 Complete translations and RTL | Joseph | 8 completion | joseph/j04-localization | M06 |
| 11 | J05 Actual browser/multi-user verification | Joseph | 9 | joseph/j05-browser-coverage | J04 |
| 12 | M07 Core acceptance and evidence | Mahdi | 10 | mahdi/m07-core-evidence | J05 |
| 13 | M08 Events and complete notifications | Mahdi | 11 | mahdi/m08-notifications | M07 |
| 14 | J06 Activity analytics backend/UI | Joseph | 12 | joseph/j06-activity | M08 |
| 15 | J07 Final UI/locale/browser quality | Joseph | 13 UI | joseph/j07-ui-verification | J06 |
| 16 | M09 Final server/deployment/docs integration | Mahdi | 13 server, 14 integration | mahdi/m09-final-integration | J07 |
| 17 | J08 Independent fresh-clone rehearsal | Joseph | 14 peer rehearsal | joseph/j08-final-rehearsal | M09 |

M00 is the planning handoff, not Joseph's first feature contribution. After it,
use feature branches/PRs for application work. Publishing this schedule does not
start application implementation.

The only routine parallel pairs are J01 with M02 after M01, and J02 with M03
after J01/M02. They touch different files. Default to the table's sequential
order if coordination is inconvenient. Do not invent extra infrastructure to
make the workflow parallel.

## Batch-by-batch deliverables and commits

Commit titles below describe the intended real work, not precreated commits.
Never make an empty commit to satisfy this list. Work locally through a meaningful
failing-test/implementation/pass cycle; push the finished, tested slice.

### M01 — Mahdi foundation

Deliver the exact shared types, errors, service conventions, core models,
migrations, and isolated test helpers from technical Task 1. Pin the complete
agreed initial dependency set so Joseph need not modify the lockfile for J01.
Include the runnable minimal root layouts and routing required for Next to build;
these are scaffolding, not Joseph's finished UI or a claimed design system.

Suggested checkpoints:
- build: scaffold taskboard and shared service contracts
- feat: add SQLite migrations and persistent HTTPS deployment

Before push: build/typecheck and Task 1 readiness, TLS, and persistence checks.
Handoff: exact Node/package versions, boot commands, locale route scaffold, helper
APIs, real DTO fields, and test-isolation behavior. J01 and M02 can now start.

### J01 — Joseph design system and theme foundation

Own DESIGN.md, src/components/ui/, app shell, global tokens, root/locale layouts,
theme and locale control foundations, and reusable UI/appearance tests. Read the
Impeccable task references and implement at least 10 genuinely reusable components
using the spec's 12-component list. Establish light/dark switching with preference
persistence, keyboard focus, and no hydration errors.

Suggested checkpoints:
- feat: add taskboard design system and application shell
- feat: add persistent accessible light and dark themes

Before push: build/typecheck, component/appearance checks, and actual rendered
inspection. Do not implement Mahdi's auth backend or task writes. Handoff the
component props, supported states, dictionary conventions, and layout entry points.

J01 owns the first actual isolated Playwright fixture/configuration alongside its
first browser tests. M01 installs Playwright and provides real-db helpers but does
not prebuild Joseph's unused browser harness. Before running UI cases, implement
the technical plan's guarded test-only Compose project/port/database isolation.
J05 extends the working harness to the complete three-browser coverage.

### M02 — Mahdi identity backend

Implement technical Task 2 with its service and HTTP/security tests. Own auth,
session, origin, limiter, and account backend paths. Do not build Joseph's forms.

Suggested checkpoints:
- feat: add validated registration and secure sessions
- feat: enforce origin checks and persistent authentication rate limits

Before push: auth/session/origin/limiter tests. Handoff auth/account request
shapes, statuses, stable error codes, cookie behavior, and password-change logout
semantics. Joseph can wire real forms without a duplicate authentication system.

### J02 — Joseph auth/account UI and legal pages

Use the merged M02 endpoints and J01 components for registration/login/logout,
account display-name/password forms, navigation, visible authorization state,
and relevant privacy/terms pages. Add the real browser scenarios assigned to
this slice of technical Task 4. Use the established dictionary keys even while
translations are being completed later.

Suggested checkpoints:
- feat: connect account forms to secure authentication
- feat: add accessible account flows and project legal pages

Before push: auth/account browser tests, keyboard operation, HTTPS session flow,
and UI build. Do not modify auth services to bypass a UI problem; report a
contract issue or submit a coordinated fix instead.

### M03 — Mahdi task write backend

Implement task validation, public-safe DTOs, basic read-by-id/list scaffolding,
ownership, create/update/delete, conflict handling, and concurrency tests from
technical Task 3. Reserve the complete search/filter/sort/pagination implementation
for Joseph. A basic default listing can exist for a runnable intermediate app.

Suggested checkpoints:
- feat: add authorized task creation updates and deletion
- fix: reject stale task writes and preserve concurrent-user changes

Before push: task authorization/validation and concurrency tests. Handoff a stable
TaskService and one agreed list delegation seam. J03 may replace the basic list
implementation with a query module without rewriting task writes.

### J03 — Joseph task board, query backend, and SSR

Own src/server/tasks/query.ts and tests/server/task-query.test.ts, the complete
board feature and locale task page, SSR metadata/sitemap/robots, and task/SSR
browser tests. Extract the basic listing behind queryTasks(db, query) and have
TaskService.list delegate to it. Preserve every DTO and write-service invariant.

Suggested checkpoints:
- feat: implement combined task search filters sorting and pagination
- feat: add server-rendered task board and complete task interactions

Before push: 60-task combined-query tests, pagination/tie-breaking, public DTO
checks, task browser flows, keyboard checks, and no-JavaScript SSR proof.
This is Joseph's backend and frontend feature, not only styling.

### M04 — Mahdi complete administration feature

Own technical Task 5, including backend, admin page/controls, and its server and
browser tests. Reuse J01 components and dictionary structure; do not create a
second table/dialog/design system. Keep last-admin and session-revocation checks.

Suggested checkpoints:
- feat: add server-enforced user administration and role management
- feat: add admin controls with transactional deletion safeguards

Before push: direct-request authorization, role changes, last-admin race,
cascade deletion, and admin browser tests.

### M05 — Mahdi secured public API

Own technical Task 6, the external API routes, key/limiter helpers, OpenAPI,
examples, and endpoint tests. Call the same TaskService/query code as the board.

Suggested checkpoints:
- feat: add secured five-endpoint public task API
- docs: document API limits errors and executable examples

Before push: five endpoint lifecycle, invalid keys, member ownership, stale
versions, shared quota/Retry-After, and no browser credential leakage.

### M06 — Mahdi complete import/export feature

Own technical Task 7: format schemas/parsers, transaction boundaries, filtered
exports, import/export controls, and server/browser tests. Reuse Joseph's query
logic and UI components. Put labels/errors in the shared dictionaries.

Suggested checkpoints:
- feat: add transactional validated JSON and CSV task import
- feat: add filtered JSON and spreadsheet-safe CSV export

Before push: invalid/big/broken-file rejection, all-or-nothing batches, ownership,
Unicode/formula handling, all filtered rows exported, and browser transfer flows.

### J04 — Joseph full translations and RTL

Complete technical Task 8 against all merged core features, including admin,
API-facing browser errors, transfers, privacy/terms, pending/empty/error states,
accessible names, and appearance controls.

Suggested checkpoints:
- feat: complete English French and Arabic taskboard translations
- feat: mirror taskboard layouts and controls for Arabic RTL

Before push: dictionary-key parity and actual translations, locale persistence,
LTR email/code isolation, 360/1280px keyboard/RTL/theme checks. Update the
design-system usage inventory to show actual use of 10+ components.

### J05 — Joseph browser and multi-user automation

Own technical Task 9, actual browser configuration/fixtures, console assertions,
multi-user browser scenarios, and browser-version evidence. Do not claim a generic
Chromium run proves Chrome/Edge.

Suggested checkpoints:
- test: cover taskboard flows in Chrome Firefox and Edge
- test: verify simultaneous accounts permissions and responsive states

Before push: all three product runs, real two-context scenarios, labeled automated
CA exceptions, separate verified TLS/manual trust checks. Record only actual results.

### M07 — Mahdi core gate

Run technical Task 10 with Joseph's merged checks. Produce the 14-point core
matrix, mandatory evidence, README draft, and actual fixes within Mahdi's areas.
Send UI-owned findings to Joseph for a focused branch rather than silently
implementing his remaining tasks.

Suggested checkpoint:
- docs: record verified core modules and mandatory acceptance evidence

A documentation checkpoint is meaningful only with actual executed checks and
observations. If a core check fails, fix it under its real owner before B01/B02.

### M08 — Mahdi complete notifications and event writer

Own technical Task 11, buffer schema/migration, src/server/activity/schema.ts and
writer.ts, notification backend/UI, domain mutation instrumentation, tests, and
feature translations. Export recordDomainEvent(tx,event) from writer.ts.
Reserve src/server/activity/service.ts aggregation and dashboard for Joseph.

Suggested checkpoints:
- feat: record transactional domain events for task and account changes
- feat: add complete in-app notifications and unread controls

Before push: every CRUD/import/API/admin/cascade path, rollback safety, recipient
rules, duplicate prevention, private-value exclusion, and UI tests. Publish event
field/action examples and the injected-clock contract needed by J06. Do not build
the activity dashboard on Joseph's behalf.

### J06 — Joseph activity backend and dashboard

Own technical Task 12, src/server/activity/service.ts, dashboard page/features,
activity tests, accessible chart/table, and all three locale messages for this
feature. Consume the merged event schema rather than adding another event store.

Suggested checkpoints:
- feat: aggregate personal seven-day task activity and comparisons
- feat: add localized accessible activity insights dashboard

Before push: UTC boundaries, deleted tasks, repeated status transitions,
per-user isolation, zero data, genuine chart/summary values, themes and RTL.
This is Joseph's second complete server-plus-UI feature.

### J07 — Joseph final UI and browser quality

Own the UI portion of technical Task 13. Extend core locale/browser checks to
the actual notification and activity features. Run Impeccable's required final
detector/audit and fix observed UI findings within scope.

Suggested checkpoint:
- test: verify complete taskboard themes locales and browser behavior

Use a fix commit with its actual description if defects were corrected. Do not
create a cosmetic change just to add a commit. Real test/evidence work counts as
work, but a claimed human review still requires the human to perform it.

### M09 — Mahdi final integration and documentation

Own technical Task 13 server/deployment fixes and Task 14 documentation/integration.
Include both personal contribution records and genuine source commits in the
English README. Preserve Joseph's author history.

Suggested checkpoints:
- docs: complete setup architecture modules and contribution documentation
- fix: describe the actual integration defect if one is found

Before push: fresh complete verification, single-command deployment and
persistence, README command rehearsal, private-value checks, and final module
matrix. No new feature/module is introduced.

### J08 — Joseph independent fresh-clone rehearsal

From the merged M09 revision, clone to a separate directory and run the published
instructions, browsers, and demonstration scenarios. Write observed results
in docs/evaluation/joseph-rehearsal.md, recording tested revision, environment,
commands, and outcomes. Fix actual owned defects with regression tests if found.

Suggested checkpoint:
- docs: record independent fresh-clone evaluation rehearsal

Both people then practice explaining their own features and the overall system.
An agent can prepare questions; it cannot mark a person's understanding complete.
If the first run reveals a defect, rerun the affected checks after the real fix.

## Shared-file and contract rules

- Mahdi owns package.json/package-lock.json, database schema/migrations, server
  composition, containers/setup, common errors, and DTO/type contracts.
- Joseph owns design foundations, reusable components, global/locale layouts,
  task-query implementation, and the browser configuration after its bootstrap.
- New shared dependencies or contract changes are agreed in the active PR/handoff,
  with exact changed shapes and compatibility notes. Package changes are not
  permission to add another skill.
- Feature owners may add keys in all three dictionaries and compose Joseph's UI
  primitives for their assigned screens. Joseph owns full translation/RTL review.
- M03 to J03 is an explicit handoff of listing logic. M08 to J06 is an explicit
  event-writer versus analytics-reader boundary. Do not edit the same module in
  parallel. Tests belong to the feature implementer, not exclusively to one person.
- Changes to another side's area must be an agreed narrow integration fix, or a
  handoff to that owner. Report the actual author; do not reattribute code.
- Separate clones/worktrees have separate working trees, git indexes, .env files,
  databases, certificate volumes, and test Compose project names/ports. Do not run
  both environments against the same local test database or volume.
- Each owner updates only their own contribution record for personal results.
  Whoever integrates updates the central module matrix from verified evidence.

## Every batch follows this push cycle

1. Check the batch's dependencies are merged; read the spec and assigned technical
   steps; fetch main. Do not begin a dependent branch from an unmerged draft branch.
2. Check the authenticated GitHub account and current local Git author. Mahdi's
   environment must be Mahdi's; Joseph/Claude must use Joseph's own environment.
   A repository push by one account does not change another author's old commits.
3. Start the listed fresh branch from current main in a clean independent checkout.
4. Write the meaningful test, observe its intended failure, implement the slice,
   and run the relevant checks. Keep unfinished test-only/red states local.
5. Review the diff, stage explicit owned files, and commit using the acting
   person's normal configured Git identity. Do not use --author overrides,
   fake co-author trailers, empty commits, or another person's account.
6. Push that commit from the same person's authenticated session. A second
   independently passing slice gets its own commit and push on the same branch.
   Do not wait until the entire project is built.
7. Open/update one PR for the batch with owner, batch ID, original task numbers,
   scope, tests/results, screenshots when useful, and exact next handoff contracts.
   Use structured PR fields or --body-file for multiline descriptions.
8. The counterpart reviews the code and tries the documented demo. Record review/
   learning only when it happened. An agent's automated review is useful but is
   labeled separately from the person's own review.
9. After checks/review are satisfied, merge preserving feature commit authors
   (prefer a merge commit). Do not squash mixed-owner work into one person's name.
   Do not rewrite previously pushed history simply to improve the graph.
10. Fetch main on both sides. Update the acting person's record with actual commit/
    PR links, exact tests, behavior demonstrated, and remaining issues. Start only
    the next unlocked batch, or stop and report the next owner.

The owner of a branch normally also opens its PR. A different authorized person
may merge it without becoming the author of its feature commits. GitHub PR
activity helps show who pushed/reviewed; git log shows authorship and code changes.

For a long batch, push each finished passing slice and keep the PR draft until
the batch's required behavior is complete. On a resumed branch, merge updated
origin/main and retest rather than force-pushing. Never publish credentials,
.env files, local DBs, auth state, or actual user data.

## Joseph's first branch example

These are future workflow commands, not commands to run before M01 merges.
The username check is informational and must match Joseph's confirmed account;
do not overwrite credentials or author settings to make a mismatch disappear.

~~~sh
gh api user --jq .login
git config --get user.name
git config --get user.email
git status --short --branch
git switch main
git pull --ff-only origin main
git switch -c joseph/j01-design-system
~~~

After the J01 work and its checks pass, stage the actual J01 files explicitly,
inspect git diff --cached and git diff --cached --check, commit, then run:

~~~sh
git push -u origin joseph/j01-design-system
~~~

Use a GitHub connected tool instead of gh if that is the authenticated surface.
If the actor, repository access, or skill setup is wrong/missing, stop before
committing/pushing and report the specific missing setup. Never ask either person
to share a password/token with the other.

## Contribution records and final evidence

- docs/team/contributions/mahdi.md: Mahdi's actual implemented slices/results.
- docs/team/contributions/joseph.md: Joseph's actual implemented slices/results.
- Each entry: batch ID, date, real commit SHA/PR, what changed, exact checks run,
  observed result, demo/explanation performed, and next-owner handoff.
- Keep planned responsibilities and completed contributions separate. Do not
  precheck future implementation, reviews, learning, or evaluation success.
- Final README references the real feature ownership and Git history, and discloses
  AI assistance. It must not claim that pushing a file proves comprehension.
- Team member 42 logins and Joseph's GitHub identity still need confirmation for
  final attribution; the working split can be used before those fields are filled.

The evaluation asks for meaningful contributions and cross-project understanding,
not merely two names appearing in git log. This plan supplies concrete work for
both sides from the beginning and preserves its actual provenance.

## Plan validation

The 14 technical tasks are fully assigned, with Tasks 3/4/8/13/14 intentionally
split at named boundaries. All core modules and both buffers retain their
original acceptance criteria. No task is handed to both agents as its sole owner.
No application code or future test result is asserted by publishing this plan.
