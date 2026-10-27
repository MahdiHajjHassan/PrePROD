# Internal task backend — M03 contract

Implemented on Mahdi's side. These are same-origin browser endpoints, separate
from the later key-authenticated public API. All connections use HTTPS.

| Method and path | Input | Success |
| --- | --- | --- |
| GET /api/tasks | No query parameters yet | 200, first 25 newest tasks and total |
| GET /api/tasks/{id} | UUID task ID | 200, TaskDTO |
| POST /api/tasks | title; optional description, status, priority | 201, TaskDTO |
| PUT /api/tasks/{id} | At least one task field plus current numeric version | 200, updated TaskDTO |
| DELETE /api/tasks/{id} | Current numeric version | 204, empty body |

Success JSON is `{ "data": ... }`. List data is
`{ "items": [...], "total": number, "page": 1, "pageSize": 25 }`.
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

## Joseph J03 handoff

The read implementation is deliberately a basic first-page scaffold. Search,
filtering, alternative sorts, and pagination are not implemented or demonstrated.
GET query parameters are rejected rather than ignored.

Implement src/server/tasks/query.ts with queryTasks(db, query), strict query
parsing and the agreed TaskQuery/PaginatedTasks contract. Delegate TaskService.list
to it and connect the HTTP query parser and server-rendered board. Keep writes
unchanged. Reuse taskSelect/toTaskDTO from src/server/tasks/dto.ts for public
projection. Follow the spec's q/status/priority/ownerId, four sorts, page bounds,
25-row size, stable tie-breaking, and full-result total. Validate unsupported
or repeated query parameters explicitly.

Replace the two deliberately limited read-scaffold tests in tasks.test.ts and
task-http.test.ts with the J03 query contract cases, and add the planned 60-row
combined-query tests. Those two tests currently document unavailable behavior;
they are not acceptance tests for the completed search module.

J01/J02/J03 also own the UI, frontend validation, pending/error/conflict states,
SSR and browser cases. No browser result or module point is claimed by M03.
Run npm run smoke:tasks after normal container startup and TLS CA setup for a
real HTTPS lifecycle; it deletes its temporary task and revokes its session.
