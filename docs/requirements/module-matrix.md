# Requirement and module traceability

The selected target is 14 core points and two buffer points. This document maps
implementation to repeatable checks; official evaluation and genuine personal
contribution/understanding are separate from automated evidence. Read the latest
docs/evaluation/evidence.md and browser-matrix.md for observed results.

| ID | Module | Points | Main implementation | Repeatable proof |
| --- | --- | ---: | --- | --- |
| M01 | Frontend/backend frameworks | 2 | src/app/, src/features/, src/server/ | Production build, browser flows and HTTPS smoke |
| M02 | Advanced permissions | 2 | auth/policy.ts, users/service.ts, admin routes/UI | admin-users.test.ts, admin.spec.ts, multiuser.spec.ts |
| M03 | Secured public API | 2 | server/api/{api-key,public}.ts, api/public/v1/tasks/ | public-api.test.ts, OpenAPI, ./docs/api/examples.sh |
| M04 | ORM | 1 | prisma/schema.prisma, both migrations, server/db.ts | Real SQLite suites, migration/rerun/persistence checks |
| M05 | Advanced search | 1 | tasks/query.ts, SSR filters and Pagination | task-query.test.ts: 60 combined records; tasks.spec.ts |
| M06 | Design system | 1 | components/ui.tsx, DESIGN.md, globals.css | Twelve components composed in auth/tasks/admin/transfers/activity; components.spec.ts |
| M07 | Three languages | 1 | i18n/dictionaries.ts, locale routes/preferences | dictionaries.test.ts parity, appearance.spec.ts en/fr/ar |
| M08 | RTL | 1 | html lang/dir, logical styles, bdi/LTR fields | Arabic 360/1280 appearance checks and rendered review |
| M09 | Additional browsers | 1 | playwright.config.ts branded projects | Actual Chrome/Firefox/Edge full flows, recorded product versions |
| M10 | SSR | 1 | server task page and metadata; no loading boundary around task rows | ssr.spec.ts with JS disabled; native filter/pagination links |
| M11 | Import/export | 1 | transfers/schema/service/http, import/export UI | transfers.test.ts, transfers.spec.ts: both formats, rejected batch, full filtered output |
| | Core | 14 | Mandatory requirements assessed separately | npm run verify |
| B01 | Notifications | 1 | transactional activity/writer + notification service/routes/UI | events.test.ts, notifications.test.ts, notifications.spec.ts |
| B02 | Personal activity | 1 | activity/service.ts, metrics/chart/table | activity.test.ts UTC boundaries/isolation/deleted history; notifications.spec.ts |
| | Target | 16 | No extra theme points | Full evidence and actual defense required |

## Mandatory requirements

| Requirement | Evidence path |
| --- | --- |
| Frontend, backend, database | React/Next pages and handlers, Prisma SQLite migrations |
| Simultaneous users and conflict safety | Two independent DB connections and browser contexts; version/last-admin races |
| Secure registration/login and validation | Argon2id, hash-only sessions, auth/origin/HTTP suites |
| HTTPS and private credentials | Caddy/Compose, verified local CA/hostname smoke, ignored .env and artifact audit |
| Database schema/relationships/persistence | Prisma schema/migrations, bootstrap/rerun tests and recreated-container evidence |
| One-command containers | docker compose up --build -d --force-recreate after private setup/local CA trust |
| Current stable Chrome, no unexpected console issues | Actual branded Chrome suite with strict console/page-error fixture |
| Responsive accessible styled UI | Tailwind/custom semantic tokens, labeled keyboard controls/dialogs/tables; 360/1280 review |
| Relevant legal pages | Full localized Privacy/Terms, public data and account-removal disclosure |
| README chapter VI | Confirmed mahajj-h/jboustan, instructions, choices/schema/modules, management/contributions/resources/AI use |
| Real team contributions and understanding | Individual records and actual final Git history; never inferred from source generation |

Themes, ordinary login and baseline accessibility are included requirements,
not separately counted modules. No real-time, game, OAuth, organization or
external-service feature is claimed. The final history repository has not been
written by this staging execution.
