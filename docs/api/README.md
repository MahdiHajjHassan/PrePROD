# Secured task API

OpenAPI 3.1 is in openapi.yaml (JSON syntax, valid YAML). It documents all five
operations, exact query/body/DTO schemas, authentication, quota and error states.

Use X-API-Key from your own ignored .env over HTTPS. It is tied to the configured
API member; deleting that account or promoting it away from MEMBER disables the
key. It never grants administrator permissions. There are no cookie credentials
or permissive cross-origin browser headers on this API.

All endpoints share 60 requests per minute per valid key, persisted in SQLite.
Invalid-key requests have a separate 20/minute/client quota. A rejected quota
returns 429 and Retry-After seconds. Honor that header before retrying. Version
conflicts return 409; read the latest task and resolve the edit explicitly.

After setup, startup and ./scripts/verify-tls.sh, run ./docs/api/examples.sh for
the complete lifecycle. It prints no key/password/session and removes its sample
task. Equivalent individual curl calls, with privately supplied environment:

```sh
curl --fail-with-body --cacert local-certs/root.crt \
  -H "X-API-Key: $PUBLIC_API_KEY" "$APP_ORIGIN/api/public/v1/tasks?status=OPEN&page=1"
curl --fail-with-body --cacert local-certs/root.crt \
  -H "X-API-Key: $PUBLIC_API_KEY" -H 'Content-Type: application/json' \
  -d '{"title":"API demonstration"}' "$APP_ORIGIN/api/public/v1/tasks"
```

PUT /tasks/{id} accepts at least one title/description/status/priority field plus
numeric version. DELETE /tasks/{id} accepts only numeric version. Create cannot
choose an owner. Read responses include only public owner id/displayName.
See OpenAPI for request examples and every response status.

Internal cookie-authenticated browser contracts are in auth.md and tasks.md;
they are separate from this key-authenticated external interface.
