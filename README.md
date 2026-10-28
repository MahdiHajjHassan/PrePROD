*This project has been created as part of the 42 curriculum by mahajj-h, jboustan.*

# Tic Tac Toe

A complete web game for two signed-in friends using separate browser sessions on
one computer, or one player against the computer. X starts; three in a line wins.
Accounts and committed matches survive restarts. The server owns every move.

This is **MahdiHajjHassan/Transcendence2 staging**. No delivery to the separate final history repository is authorized.
The owner explicitly accepted two members, Mahdi and Joseph, on 2026-10-27.

## Instructions

Use Git, Node.js **24**, npm and Docker with Compose. On Windows, native npm
installation needs Python and Visual Studio C++ Build Tools for better-sqlite3.
Dependencies, including the container base images, are pinned. Use normal GitHub
authentication; no token belongs in this repository or a chat.

```sh
npm ci
npm run setup
docker compose up --build -d --force-recreate
```

Open **https://localhost/en/play**. Setup generates a Git-ignored `.env` with
this computer's random administrator password. Read **ADMIN_EMAIL** and
**ADMIN_PASSWORD** privately there. Setup refuses to replace an existing file;
startup does not reset an existing administrator's password. Register additional
players in the interface. Email must have valid syntax; mailbox ownership is not
verified and no email is sent. Use distinct demonstration addresses privately.

Only Caddy publishes a port, bound to loopback HTTPS. The Node process runs as
non-root. Startup deploys migrations and seeds the administrator. Named volumes
retain game data and certificates across recreation. Do not delete volumes.
The `game-data` volume stores `file:/data/tictactoe.db`.

Verify the real certificate chain and hostname:

```sh
./scripts/verify-tls.sh
```

Run that POSIX script from Git Bash on Windows. Or from PowerShell:

```powershell
docker compose cp proxy:/data/caddy/pki/authorities/local/root.crt local-certs/root.crt
npm run smoke
```

Create `local-certs` first if needed. Trust only the public `root.crt`:
Windows Current User > Trusted Root Certification Authorities for Chrome/Edge;
Firefox Settings > Privacy & Security > Certificates > Authorities may need a
separate import, or enterprise root trust. Then reload without a certificate
warning. Never copy Caddy's private CA key. The verifier uses explicit CA trust
and hostname verification; no insecure TLS flags are needed.

For a different port, generate an environment with
`npm run setup -- --port 8443`. With an existing `.env`, keep `HTTPS_PORT` and
`APP_ORIGIN` consistent. Keep `COMPOSE_PROJECT_NAME` consistent for all runtime
and TLS commands, so recreation reuses the same certificates and data.
In a managed cloud needing its public network proxy CA, set `CODEX_PROXY_CERT`
and include `compose.cloud.yaml` using the OS-specific COMPOSE_FILE separator.
That CA is a build secret, never an application credential.

## Play and demonstrate

1. Register and sign in. Choose **Play computer**, place a mark and finish a game.
   **Play again** creates a separate saved match; **Resign** confirms a loss.
2. For a friend, use two separate browser profiles or one private window. Sign in
   with different accounts. First player chooses **Create friend game**, shares
   the displayed code; second enters it under **Join with code**. Play alternately.
3. Show a win or draw in both sessions. Reload, briefly disconnect/reconnect,
   or recreate containers: the committed board returns. An uncertain move is
   never retried automatically. Refresh after a conflict before trying again.
4. Switch English/French/Arabic, theme and phone width. Cells work with Tab and
   Enter/Space, preserve focus and announce turns/results. X/O differ by shape.
5. Administrator > **Users** demonstrates user creation, editing, roles and
   deletion. Members cannot administer users. The final administrator cannot
   be deleted or demoted. Deleting a player ends active games and anonymizes
   their historical references.
6. Registration Privacy/Terms links open a separate tab and preserve the form,
   including the typed password, in the original tab. Passwords are not saved
   to browser storage.

## Architecture and technical choices

Next.js App Router provides frontend React/TypeScript and backend route handlers;
Tailwind plus semantic CSS tokens provide styling. Prisma with SQLite keeps this
single-computer delivery small and transactional. Caddy provides local HTTPS.
Zod validates client inputs and backend bodies independently. The backend reloads
current session/role and checks Origin, membership, turn, cell and version.

Passwords use Argon2id. Sessions are random, stored only as hashes server-side,
and sent in Secure, HttpOnly, SameSite=Lax cookies. Password changes revoke all
sessions. Auth and game actions are rate-limited. Private game projections contain
player display names, never email, passwords or tokens. Cookies use the `__Host-tictactoe_` namespace. After the namespace change,
existing users sign in again and reselect their language/theme; saved accounts
and games are unaffected.

Game state is committed before publication. Scoped HTTPS server-sent events send
full snapshots, with monotonic versions and 15-second authorization heartbeats.
On reconnection the client reads canonical state before enabling moves. A
process-wide bus supports this **single application process**; a multi-instance
service would require a shared broker and is outside this delivery.

The computer plays O. It takes an immediate win; otherwise it usually blocks a
threat, then prefers center/corners. A 15% imperfect branch permits legal weaker
choices. It can beat weak play and can lose; it is not perfect minimax. The human
move and computer reply commit in one transaction, with no external AI service.

## Source layout

| Path | Responsibility |
| --- | --- |
| `src/app` | URL routes, server-rendered pages, and API entry points. |
| `src/frontend/components/ui` | Shared controls, one component per file. |
| `src/frontend/features` | Account, auth, games and user-management components. |
| `src/frontend/layout`, `lib`, `styles` | Preferences, browser requests/form validation and shared styles. |
| `src/backend/modules` | Auth, games, users and realtime modules. |
| `src/backend/common` | HTTP responses, errors, validation and request security. |
| `src/backend/config`, `database` | Environment validation, database connections, write retries and seeding. |
| `src/shared` | Data contracts and small helpers shared across application layers. |
| `src/shared/i18n` | Locale selection, text direction and separate English/French/Arabic dictionaries. |
| `prisma` | The database schema and published migrations. |
| `scripts` | Setup, startup, HTTPS smoke checks, verification, and rehearsal. |
| `tests/server`, `tests/browser` | Database-backed service tests and real browser journeys. |

The layout follows the frontend/features and backend/modules grouping in
[tawbinho/ft_transcendence](https://github.com/tawbinho/ft_transcendence), using
Next.js for this application's routes and server rendering.

A move starts in `src/frontend/features/games/components/Board.tsx`. `LiveGame.tsx`
sends it to `src/app/api/games/[id]/moves/route.ts`. Under `src/backend/modules/games`,
`games.controller.ts` reads the request, `games.service.ts` saves the move and
`engine/game.engine.ts` checks the board. The realtime module sends the saved state
to connected players.

## Database schema

| Model | Purpose and relationships |
| --- | --- |
| User | Unique email, public name, password hash, MEMBER/ADMIN role; sessions and X/O game seats |
| Session | Hash-only token, expiry, User foreign key; revoked on password change/deletion |
| RateLimitBucket | Persistent per-action quotas and reset times |
| Game | Mode, nine-cell board, seats, turn, status/result, unique invitation, version/times |
| GameMove | Game foreign key, mark/cell/ply; unique game+cell and game+ply |

Game seats become null when an account is deleted, after the game is safely
resolved. Moves/results remain. Transactions and version predicates ensure two
concurrent joins or conflicting actions cannot both claim the same state.

## Features and candidate modules

Mandatory frontend/backend/database, secure accounts, concurrent use, HTTPS,
responsive access, legal pages and one-command container startup apply separately.

| ID | Candidate module | Points |
| --- | --- | ---: |
| G01 | Frontend/backend frameworks | 2 |
| G02 | Complete web game | 2 |
| G03 | Computer opponent | 2 |
| G04 | Real-time updates | 2 |
| G05 | ORM | 1 |
| G06 | Shared design system | 1 |
| G07 | English, French, Arabic | 1 |
| G08 | RTL support | 1 |
| G09 | Additional browsers (unclaimed: Firefox runner blocked) | 0 |
| G10 | Meaningful server rendering | 1 |
| | Core currently demonstrated target | **13** |
| G11 | Advanced permissions | 2 |
| | Current target with permissions buffer | **15** |

These are candidate mappings, not official awarded points. Theme switching and
basic authentication do not add points. No remote-player, public API, tournament,
statistics or notification module is claimed. See
[traceability](docs/requirements/module-matrix.md) and
[current evidence](docs/evaluation/tic-tac-toe-evidence.md).

## Verification and fresh setup

Run `npm run format` to apply the shared code style and `npm run format:check` to
check it. Formatting excludes generated code, private files, vendored skills,
documentation, lockfiles, and published migrations.

```sh
npm test
npm run typecheck
npm run lint
npm run build
npm run audit:source
npm run smoke:auth
npm run smoke:games
npm run test:e2e
npm run verify
npm run rehearse
```

Smoke checks use validated local HTTPS, temporary demonstration accounts and
normal game actions; game records remain on the administrator account.
`verify` runs sequential checks including Chrome and Edge. Firefox remains an
explicit optional project (`npx playwright test --project=firefox`); the recorded Windows
verification could not start its SxS loader. G09 is unclaimed. Install
actual Chrome, Firefox and Edge; `npx playwright install chrome firefox` installs
the managed versions where available. Edge uses the installed Microsoft product.
Browser tests use project `tictactoe-e2e-mahdi`, port 8443 and own ignored
`.env.e2e`. Their guarded reset affects only that isolated database. Normal
runtime data and certificates are never reset. The test public CA must also be
trusted. Certificate validation remains enabled in both browsers and Node API
requests. Override `TICTACTOE_E2E_PROJECT`, `TICTACTOE_E2E_PORT` and
`TICTACTOE_E2E_ENV_FILE` consistently if needed.

`rehearse` exports the exact uncommitted working source (including new files,
excluding ignored credentials/builds/databases), hashes it and performs a fresh
npm install/setup/migration/seed/check/build plus isolated HTTPS Chrome flows on
9443. It makes no commit. Only the already trusted test certificate volume is
reused; rehearsal game data is separate. Ignored logs, traces and screenshots
may contain private test inputs and must never be shared unredacted.

## Team, project management and AI use

Mahdi (`mahajj-h`) and Joseph (`jboustan`) are the accepted two-member roster.
The owner authorized Mahdi/Codex to complete staging implementation. Current game work is a Mahdi/Codex-assisted implementation authorized for
staging delivery; it must not be relabeled as Joseph's original implementation. Record Joseph's actual review, adaptation and
explanation only after they occur. No human understanding is inferred from tests.

The design/spec and ordered implementation plan are in `docs/superpowers/`.
Superpowers supplied the planning/TDD/debugging/review workflow; the vendored
Impeccable 4.7.1 guided the UI. Codex assisted architecture, implementation, tests
and documentation. Both students must understand the code and honestly explain
AI assistance during evaluation. See [contributions](docs/team/contributions/mahdi.md)
and [delivery map](docs/delivery/PUSH-MAP.md). After local verification, the owner
authorized committing and pushing this replacement to Transcendence2 staging.

## Resources

- [Original subject](docs/reference/en.subject.pdf) and [evaluation sheet](docs/reference/EVALUATION-SHEET.pdf), unchanged.
- [Next.js documentation](https://nextjs.org/docs), [Prisma documentation](https://www.prisma.io/docs), [Caddy documentation](https://caddyserver.com/docs/).
- [Game API](docs/api/games.md), [auth contract](docs/api/auth.md), [design system](DESIGN.md).
