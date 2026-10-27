> Historical Taskboard contract. Superseded by games.md; these routes are removed.

> Historical Taskboard contract. Superseded by games.md; these routes are removed.

# Internal task backend — current contract

Implemented on Mahdi's side. These are same-origin browser endpoints, separate
from the later key-authenticated public API. All connections use HTTPS.

| Method and path | Input | Success |
| --- | --- | --- |
| GET /api/tasks | Validated combined query/filter/sort/page parameters | 200, 25-row page and full filtered total |
| GET /api/tasks/{id} | UUID task ID | 200, TaskDTO |
| POST /api/tasks | title; optional description, status, priority | 201, TaskDTO |
| PUT /api/tasks/{id} | At least one task field plus current numeric version | 200, updated TaskDTO |
| DELETE /api/tasks/{id} | Current numeric version | 204, empty body |

Success JSON is `{ "data": ... }`. List data is
`{ "items": [...], "total": number, "page": number, "pageSize": 25 }`.
TaskDTO is defined in src/shared/tasks.ts: id, title, description, status,
priority, version, ISO createdAt/updatedAt, and owner `{id, displayName}` only.
Owner email, role, password hash, and sessions are never projected into tasks.
Responses use Cache-Control private, no-store.

## Writes and errors

POST/PUT/DELETE require the HttpOnly session from docs/api/auth.md, an exact
APP_ORIGIN Origin header, and application/json. The body limit is 16 KiB. Extra
keys are rejected; ownerId/role cannot be supplied. Task fields are:

- title: trimmed, 1–120 characters.
- description: 0–1,000 characters; default empty string on create.
- status: OPEN or DONE; default OPEN on create.
- priority: LOW, NORMAL, or HIGH; default NORMAL on create.
- version: positive integer; starts at 1 and increments once per successful edit.

Title/description must also be well-formed Unicode, including after JSON escape
decoding; lone surrogates are rejected before any write.

Omitted PUT fields keep stored values. Create assigns the current member as
owner. Members may edit/delete their own tasks; current administrators may
edit/delete any task. The current database role is read inside each write
transaction, so a stale or forged Actor role does not grant access.

Errors use `{ "error": { "code": "...", "fields": { ... } } }`; fields is
optional. Codes/statuses: VALIDATION 400, UNAUTHENTICATED 401, FORBIDDEN 403,
NOT_FOUND 404, CONFLICT 409. An unknown failure returns generic INTERNAL 500.
Both update and delete require version in the JSON body. A stale version
returns 409 and leaves the newer task untouched. Reload current data before
retrying; do not silently resubmit an edit against a newer revision. SQLite
contention is retried at most three times; exhaustion returns 409 with
fields.database `["busy"]` and Retry-After 1.

Example update body: `{ "status": "DONE", "version": 1 }`.
Example delete body: `{ "version": 2 }`.

## Implemented queries and UI reuse

src/server/tasks/query.ts exports parseTaskQuery, queryTasks and readAllTasks.
TaskService.list delegates to it; internal/external HTTP and SSR share the same
parser. Parameters are q (trimmed, max100), status, priority, ownerId UUID,
sort (created_desc/created_asc/updated_desc/title_asc), and page1..100000. Defaults
are created_desc/page1. Empty optional form values are omitted. Unknown/repeated
parameters, arrays and invalid values are rejected. Each sort has an id tie-break.
Filtering precedes counting/pagination; readAllTasks ignores pagination for export.

tasks.owners returns only id/displayName for users with existing public tasks.
taskSelect/toTaskDTO centralize public projection. The 60-row combined query and
page tests replace the old M03-only basic read scaffold. The SSR board, frontend
validation, pending/errors/conflict recovery and no-JS public content are built;
Claude reuses them instead of recreating this originally J03-assigned feature.

The external key API constructs TaskService with an immutable memberOnly policy,
rechecked inside each write transaction. Concurrent promotion of that account
cannot turn an already-authenticated request into an admin write. Cookie-auth
administrators retain their intended current-role permissions.

Run npm run smoke:tasks after normal startup and TLS CA setup for a real HTTPS
lifecycle; it deletes its temporary task and revokes its session. Read current
evaluation evidence for executed checks and known diagnostic-script limitations.
