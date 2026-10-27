# Taskboard — Development Checkpoint

This is the staging repository for a small 42 ft_transcendence project. The final
contribution-history repository has not been created/provided. This README is a
development checkpoint, not the completed evaluation README.

Implemented in M01: the application scaffold, shared contracts, SQLite/Prisma
migrations, private credential setup, safe first-run seeding, health endpoint,
and local HTTPS/container configuration. M02 adds the registration/login/session
and account backend, origin/body protection, and persistent authentication limits.
The actual task-board interface and other feature modules are still pending their
assigned batches; Joseph owns the auth/account forms.

## Local prerequisites

Use Node.js 24, npm, Docker with Compose v2, and a free local HTTPS port. No hosted
account is needed. Exact package versions are locked; container images are pinned
by digest. Keep generated credentials and data private.

## Development checks

```sh
npm ci
./scripts/setup.sh
npm run db:migrate
npm run db:seed
npm test
npm run typecheck
npm run lint
npm run build
```

Setup creates a Git-ignored, owner-readable .env with random admin credentials
and API key. Read those credentials privately from your local file. Setup refuses
to overwrite an existing file. Edit ADMIN_EMAIL/API_ACTOR_EMAIL before the first
database bootstrap if needed. Restarting never resets existing account credentials.

## One-command container startup

After the initial environment setup:

```sh
docker compose up --build -d --force-recreate
./scripts/verify-tls.sh
```

The app is at https://localhost/en/tasks. Only the proxy's HTTPS port is published;
the database is on a persistent volume. For a different port, create a new local
env file using ./scripts/setup.sh --env-file .env --port 8443 before first setup,
or update HTTPS_PORT and APP_ORIGIN consistently in your existing private .env.

The TLS verifier copies the local development CA to local-certs/root.crt and
verifies the certificate chain, hostname, health response, and database readiness.
For normal manual use, import that public root certificate into your browser's
trusted authorities. Firefox may need its own import. Never distribute the CA's
private key or use certificate-warning bypass as the finished browser setup.

In a managed cloud whose builds require the session proxy CA, keep TLS verification
enabled and use the provided build-only override:

```sh
COMPOSE_FILE=compose.yaml:compose.cloud.yaml docker compose up --build -d --force-recreate
```

CODEX_PROXY_CERT must point to the environment-provided public proxy certificate.
It is mounted only during networked build steps and is not copied into image layers.
Normal local builds use compose.yaml alone.

Recreation reloads mounted proxy configuration and retains named data/certificate
volumes. After M02, npm run smoke:auth verifies the real HTTPS authentication flow;
see docs/api/auth.md for the exact interface Joseph's forms consume.

Stopping containers preserves data. Do not use docker compose down -v on data you
want to keep. Automated browser verification will use a separate test project.

## Ownership and delivery

- docs/superpowers/plans/2026-10-26-taskboard.md: technical implementation steps.
- docs/superpowers/plans/2026-10-26-team-contributions.md: Mahdi/Codex and Joseph/Claude split.
- docs/team/JOSEPH-CLAUDE-HANDOFF.md: Joseph's entry instructions.
- docs/delivery/PUSH-MAP.md: exact staging bundles and later final-repo delivery.

Use Superpowers and Impeccable; additional skills require owner confirmation.
Record actual implementation, tests, commits, reviews, and AI assistance. Planned
module points and personal understanding are not marked complete by scaffolding.
