# Minimal Taskboard Design — Proposed for Review

## Goal and decision

Deliver a small, understandable ft_transcendence web application with a
demonstrable 14-point core and 2 additional module points. This document and its
implementation plan are proposals for review; no application has been built.
Working product name: Taskboard.

The chosen planning baseline is one shared public task list. This uses ordinary
database operations and reuses the same task logic for browser actions, imports,
and the secured public API. A tic-tac-toe product would add game states, AI or
other game features to earn enough points. A booking product would add schedule
and overlap rules. The task board best fits the owner's stated priority of
minimum overall work and a simple explanation.

## Governing sources

- docs/reference/en.subject.pdf, v21.1: chapters III, IV, VI, VII, and VIII.
- docs/reference/EVALUATION-SHEET.pdf: mandatory checks, module demonstrations,
  collaboration, README completeness, and bonus conditions.
- PRODUCT.md and AGENTS.md: confirmed owner constraints and project workflow.
- docs/superpowers/plans/2026-10-26-team-contributions.md: two-person ownership,
  branch/push sequence, and Claude handoff. Feature acceptance criteria below
  remain unchanged; agents implement only their assigned batches.

Both PDFs remain unchanged. Only fully functional modules count. A buffer cannot
compensate for a failed mandatory requirement. Extra points count as bonus only
when the mandatory part is fully satisfied.

## Module contract

| ID | Selected module | Points | Required proof |
| --- | --- | ---: | --- |
| M01 | Frameworks for frontend and backend | 2 | Next.js renders React pages and implements the backend routes and services. |
| M02 | Advanced permissions | 2 | Admin can view, edit, delete users and assign/revoke MEMBER/ADMIN roles; different views and server-enforced actions for guests, members, and admins. |
| M03 | Secured public API | 2 | API key, rate limiting, documentation, and five working task endpoints covering GET/POST/PUT/DELETE. |
| M04 | ORM | 1 | Prisma models, relations, migrations, and actual application queries. |
| M05 | Advanced search | 1 | Text query, status/priority/owner filters, allowlisted sorting, and pagination working together. |
| M06 | Custom design system | 1 | Shared color/type/icon foundations and at least 10 reusable components actually used. |
| M07 | Three languages | 1 | Complete English, French, and Arabic UI, language switcher, and translated visible errors and states. |
| M08 | RTL | 1 | Arabic direction, mirrored layout, logical spacing, and correct mixed-direction content. |
| M09 | Additional browsers | 1 | Latest stable Chrome plus fully tested Firefox and Microsoft Edge. |
| M10 | SSR | 1 | Public task content and metadata present in the initial server HTML; indexed filter links and usable server-rendered content before JavaScript. |
| M11 | Import/export | 1 | JSON and CSV export; validated, transactional bulk imports. |
| | Core | 14 | Mandatory requirements and every core demonstration pass. |
| B01 | Complete notifications | 1 | In-app notifications for every defined domain create/update/delete action, including admin and import paths. |
| B02 | User activity analytics and insights | 1 | Personal activity dashboard with accurate metrics, a trend chart, and useful comparisons derived from recorded events. |
| | Target with buffer | 16 | All 13 selected modules demonstrated. |

Theme switching contributes to M06 and is not counted again. No separate points
are claimed for mandatory login, generic accessibility, or merely installing a
library. This plan does not claim the separate real-time or standard user
management modules.

## Product scope

One global board; one task belongs to its creator. All task titles, descriptions,
and creator display names are public, with this disclosure shown before signup
and task submission. Emails, password hashes, sessions, and admin data are private.
Use demonstration data rather than personal or confidential tasks.

Tasks have title (1–120 characters), description (0–1,000 characters), priority
LOW/NORMAL/HIGH, and status OPEN/DONE. Whitespace-only titles are invalid.
The title and description are plain text. User-written content is not translated.

Guests can browse/search the board and read legal pages. Members can additionally
manage their own tasks, import tasks as themselves, export public tasks, edit their
display name, and change their own password. Administrators can additionally
manage all tasks and view/edit/delete users and assign MEMBER/ADMIN roles.
Registration always creates a MEMBER, regardless of submitted fields.

There are no games, scheduling, organizations, multiple boards, chat, avatars,
friends, file attachments, OAuth, external AI, microservices, or WebSockets in
this plan. Do not add them as improvements.

## Architecture and delivery

Planning stack: Node.js 24 LTS, Next.js 16 App Router with React/TypeScript,
Tailwind CSS 4, Prisma 7 with its SQLite adapter, SQLite, and Caddy. At execution
start, verify supported compatible patch versions, pin them and commit the lockfile.
A compatibility fix stays within this architecture rather than adding services.

Browser -> Caddy HTTPS -> one Next.js application -> SQLite persistent volume.
The app's backend is reachable only through the proxy from outside the container
network. Use parameterized queries and one shared service layer for all writes.

Two containers: app and proxy. No hosted deployment or external account is needed.
The deployment command is docker compose up --build -d after one-time setup.
A setup script creates the ignored .env with generated local credentials and API
key; .env.example contains only placeholders. Document the separate one-time
installation of Caddy's local CA in each evaluation browser. Never present an
untrusted certificate bypass as the finished browser setup.

The public task route uses SSR, real descriptive metadata, and no shared HTML
cache. Private routes also use no-store behavior. Direct database calls from
server components avoid an extra HTTP layer. Refresh after local writes and offer
ordinary refresh for changes made by another user. No real-time module is claimed.

## Data and shared contracts

Core tables:
- User: id, unique normalized email, displayName, passwordHash, MEMBER/ADMIN role,
  createdAt. Validate email and displayName (1–60 characters). Passwords are
  12–128 characters and are hashed using Argon2id.
- Session: SHA-256 hash of a random 32-byte token, userId, expiresAt. Raw tokens
  exist only in the secure cookie, never in the database or logs.
- Task: id, ownerId, title, description, priority, status, version, createdAt,
  updatedAt. Foreign keys and owner lookup indexes are explicit.
- RateLimitBucket: hashed scope key, windowStart, count, with atomic increments.

Buffer tables:
- ActivityEvent: actorId (nullable after user deletion), action, entityType,
  entityId, safe display metadata, createdAt.
- Notification: recipientId, eventId, readAt; unique recipient/event pair.

Task records use UUID identifiers. APIs expose TaskDTO containing id, title,
description, status, priority, owner {id, displayName}, version, createdAt, updatedAt.
Never serialize a complete User database record to public callers.

TaskInput is {title, description, status, priority}; TaskPatch permits those fields
only. Actor is {id, role}. All mutations check the current user's role and
ownership on the server, including API and import paths.

TaskQuery is {q?, status?, priority?, ownerId?, sort, page}. q has a 100-character
limit. Sort is created_desc, created_asc, updated_desc, or title_asc. Page size is
25, page starts at 1, and page is bounded to 100,000. PaginatedTasks is
{items: TaskDTO[], total, page, pageSize: 25}. Filtering precedes pagination.
Read queries have deterministic id tie-breaking.

Writes require the current version for update/delete. Stale writes return 409
and the browser offers refresh, rather than silently overwriting another action.
Use SQLite foreign keys, WAL, a busy timeout, and short transactions. Retry
transient lock conflicts a bounded number of times and return a retryable error
rather than leaking a stack trace.

## Routes and API behavior

Locale-prefixed pages, where locale is en, fr, or ar:
- /{locale}/tasks: public server-rendered board, search/filter controls, task
  creation and authorized inline actions; import/export entry for signed-in users.
- /{locale}/login and /{locale}/register.
- /{locale}/account: display-name and password changes.
- /{locale}/admin/users: administrator-only CRUD and role assignment.
- /{locale}/privacy and /{locale}/terms.
- Buffer: /{locale}/notifications and /{locale}/activity.
- / redirects to the remembered supported locale or en.

Browser API routes under /api/auth, /api/tasks, /api/account, /api/admin/users,
and /api/transfers use the same services as the pages. Reads of the public board
can be anonymous; all writes require an authorized current session.

The five secured external endpoints are:
- GET /api/public/v1/tasks
- GET /api/public/v1/tasks/{id}
- POST /api/public/v1/tasks
- PUT /api/public/v1/tasks/{id}
- DELETE /api/public/v1/tasks/{id}

Every external endpoint requires X-API-Key. The generated key is a server-side
environment credential, never exposed through NEXT_PUBLIC variables or browser
code. Bind it to the seeded API demonstration member using API_ACTOR_EMAIL; it
has ordinary member permissions. Deleting that account disables its API access.
Compare key hashes in constant time; validate credentials before processing input.
Provide OpenAPI documentation and executable examples covering all five endpoints.

External API limit: 60 requests/minute per valid key, shared across endpoints.
Return 429 and Retry-After. Invalid-key attempts have an additional per-client
limit. Login and registration are limited separately to resist password guessing.
Use a persistent atomic limiter so restarting the app does not clear all limits.

JSON success responses use {data: ...}, list responses use {data: PaginatedTasks}.
Errors use {error: {code, fields?}}, with 400 validation, 401 unauthenticated,
403 forbidden, 404 missing resource, 409 conflict, and 429 rate limited.
Error codes map to translated browser messages; API documentation explains them.

## Authentication and authorization

Sessions expire after 7 days. Cookies are HttpOnly, Secure, SameSite=Lax, and scoped
to /. Reject cross-origin browser mutations using the configured HTTPS origin and
require JSON bodies on JSON endpoints. Do not enable permissive CORS.

Normalize emails consistently. Use Argon2id with at least 19 MiB memory, 2
iterations, and parallelism 1. Use generic login failures and never return password
hashes or session tokens in JSON. Revoke all existing sessions after a password
change; the user signs in again. Read current role from the database for every
authorized request so role changes take effect immediately.

Prevent removing or demoting the final administrator, including concurrent
requests. Deleting a user deletes their sessions and owned tasks transactionally.
The admin interface explains that consequence and asks for destructive-action
confirmation. Existing private pages must not become available through SSR,
internal routes, or the external API.

## Import/export

Accept only UTF-8 JSON or CSV, at most 256 KiB and 200 task rows per import.
CSV columns are exactly title,description,status,priority. JSON is an array with
those same four fields. No imported id, owner, role, or timestamp is accepted.

Validate the entire file before writing. Show row/field errors; a single invalid
row rejects the entire batch. Valid rows are inserted in one transaction as the
current member's tasks. Identical rows create distinct tasks; importing is an
explicit append action, not an upsert. Warn users of that behavior.

Exports include all tasks matching the current public-board filters and sort,
not only the displayed page, using the same four portable fields. CSV handles
Unicode, quotes, commas, and newlines, and neutralizes spreadsheet formula
prefixes. Document that CSV safety can prefix such values with an apostrophe;
JSON preserves the original text exactly. No user email or other private field
is imported or exported. Use csv-parse/csv-stringify for format handling.

## Design, theme, localization, and accessibility

Use Impeccable for the implementation's Operate-mode UI. This plan defines
behavior rather than a finished visual direction. Establish DESIGN.md before
the first UI implementation; no images or marketing landing page are needed.

Use one restrained visual system, shared semantic color tokens, and consistent
type/spacing/icon rules. Define and actually use at least these 12 components:
Button, TextField, SelectField, CheckboxField, FormField, Alert, Badge,
Dialog, DataTable, Pagination, Tabs, and EmptyState. React wrappers around a
well-supported unstyled accessible primitive library are allowed; the visual
system and composed application components must be our own. Do not claim the
module merely for installing a component kit.

Provide light/dark themes everywhere. Default to light, expose a keyboard-operable
toggle, and remember the choice in a validated preference cookie so SSR uses the
same theme and avoids a flash. Use logical CSS properties and directional icons
so Arabic genuinely mirrors the interface. Keep emails and code examples LTR.

Use complete typed dictionaries for en/fr/ar. Localize navigation, legal content,
forms, errors, empty/loading states, admin text, both buffer features, and
accessible names. Locale selection changes the route and remembered preference.
Show dates consistently using Intl with explicit UTC and localized labels.
Public user-entered task text remains as entered.

Support keyboard focus and actions, dialogs returning focus, labeled controls,
readable contrast in both themes, and responsive behavior at 360px and 1280px.
Do not claim the 2-point WCAG module; ordinary accessibility remains mandatory.

## Buffer behavior

Implement the 14-point core first. Then add both buffer modules and update all
translations and browser checks. Stop at this 16-point scope.

Activity events cover successful task create/update/delete, user create/update/
delete (including role/password changes without storing sensitive values), and
login. Record whether a task update transitioned OPEN to DONE. Failed actions
never create success events. Domain mutations and their events are atomic.

Notifications cover domain CRUD, including batch imports, API actions, account
updates, and cascading task deletions when an admin deletes a user. Task changes
notify all remaining registered users; account changes notify the affected user
and administrators. Deleted recipients receive nothing. One event per changed
task, and unique event/recipient records, prevent duplicates. Operational database
records such as sessions, limiter buckets, notifications, and events do not
recursively generate notifications. Provide unread count and mark-one/all-read.

The activity dashboard shows the signed-in user's task creations, completions,
and deletions over the past 7 UTC calendar days, a seven-day trend, and the change
against the preceding seven days. Include a textual summary and accessible table
for the chart. Deleted tasks still contribute through immutable events.
Zero-activity users see a genuine empty state; never fabricate usage or insights.

## Verification and stop condition

Check mandatory requirements separately from module points. The final evidence
matrix records each requirement, its code paths, its automated/manual proof,
and demonstrated status. Do not mark a claim demonstrated until it has passed.

Use Vitest for service/integration tests against real disposable SQLite databases
and Playwright against actual Chrome, Firefox, and branded Microsoft Edge.
A Chromium engine alone is not evidence of testing all three products.
Test at least two simultaneous accounts, unauthorized direct requests, stale
updates, malformed imports, HTTPS and cookies, persistence after restart, SSR
HTML, complete translations, RTL, both themes, and console cleanliness.

The README must satisfy subject chapter VI, including real 42 logins, roles,
contributors, module ownership and justification, schema, startup, and AI use.
The owner confirmed Mahdi and Joseph as the two members. Confirm actual 42 logins
and verified Git identities before final attribution; placeholders are acceptable
in an explicitly unfinished draft, not in final evidence. Preserve both members'
actual feature commits and record their own demonstrations and reviews honestly.

Completion requires: mandatory checks passed, 16 points demonstrated or an
explicitly revised module decision, one-computer rehearsal, explainable code,
honest documentation, and no unresolved critical failures. Do not expand scope.
