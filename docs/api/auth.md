# Authentication and Account Contract — M02

These routes and the J02 frontend forms are implemented in staging by Mahdi/Codex
for reuse by Claude. Use relative HTTPS URLs and normal same-origin fetch
credentials. Browser JavaScript never reads or stores the session token.

| Method and path | Request JSON | Success |
| --- | --- | --- |
| POST /api/auth/register | email, displayName, password | 201 with AccountDTO; then show login |
| POST /api/auth/login | email, password | 200 with AccountDTO plus secure cookie |
| POST /api/auth/logout | empty object | 204, cookie cleared and this session revoked |
| GET /api/account | no body | 200 with the signed-in user's AccountDTO |
| PATCH /api/account | displayName only | 200 with updated AccountDTO |
| PUT /api/account/password | currentPassword, newPassword | 204; all sessions revoked and cookie cleared |

AccountDTO is {id,email,displayName,role,createdAt}. Responses use {data: value}.
Password hashes and raw session tokens are never returned in JSON. Registration
does not log in automatically. Successful password change requires a new login.
All responses are private/no-store.

## Validation and errors

- Email is trimmed, normalized to lowercase, and validated.
- Display name is trimmed and must contain 1–60 characters.
- New passwords must contain 12–128 characters; login/current password 1–128.
- Extra fields are rejected, including client-supplied role/id/owner fields.
- JSON bodies are UTF-8, limited to 16 KiB, and require application/json.
- Every browser mutation requires the exact configured HTTPS Origin. GET account
  uses its secure cookie. No permissive CORS headers are enabled.
- Errors are {error:{code,fields?}}. Fields contain stable validation codes, not
  echoed input. Translate codes and labels in the UI; root errors use the _ key.
- 400 VALIDATION, 401 UNAUTHENTICATED, 403 FORBIDDEN, 409 CONFLICT, 429 RATE_LIMITED,
  and generic 500 INTERNAL. Duplicate normalized email produces CONFLICT.
- Wrong/missing users and wrong/corrupt passwords share the login failure code.
- On 429, respect Retry-After; do not automatically loop retries.

## Session and rate-limit behavior

__Host-taskboard_session is Secure, HttpOnly, SameSite=Lax, Path=/, with a seven-day
lifetime. The database stores only a SHA-256 hash of a random 32-byte token.
Roles are read from the current user row, so role changes apply on the next
request; account deletion invalidates access. Password changes atomically replace
the hash and revoke every existing session.

Login: 5 attempts per 15 minutes/email+client and 10 per 15 minutes/client.
Registration: 5 per 15 minutes/client. Password changes: 5 per 15 minutes/user.
Limits are persistent atomic SQLite counters. Stale buckets are pruned on use,
at most once per hour per limiter instance, after 24 hours.

Caddy overwrites X-Taskboard-Client-IP with the actual incoming peer; no app port
is published. The backend does not trust a client-supplied JSON identity or
X-Forwarded-For. Missing/invalid trusted IP metadata shares an unknown bucket.

## Verification and ownership

Server tests use real databases and native Request/Response objects. The HTTPS
smoke command exercises origin rejection, anonymous rejection, secure-cookie login,
account read, logout, and revoked access without printing credentials/tokens:

```sh
npm run smoke:auth
```

It uses the private local admin credentials and performs one real login/logout;
normal login quotas still apply. Use isolated fixture accounts for repeated
negative/rate-limit browser tests, not the ordinary demonstration database.

The guarded Playwright harness and real login/account UI are implemented.
Browser401/403 responses outside auth forms discard stale private documents and
router state by navigating to login/the public board. See current evaluation
evidence for executed browser checks; no human demonstration is inferred here.
