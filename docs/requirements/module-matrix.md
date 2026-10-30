# Tic-tac-toe traceability

Candidate points are not awarded scores.
The owner added Khalid to Mahdi/Joseph on 2026-10-29; new module work is under discussion.

| ID | Module | Points | Source | Proof |
| --- | --- | ---: | --- | --- |
| G01 | Frameworks | 2 | src/app, features, server | Build, HTTP and full browser flows |
| G02 | Web game | 2 | server/games/rules,service; features/games | Eight lines/draw, actual human win/draw/replay/resign |
| G03 | AI | 2 | server/games/ai | Literal competence/imperfect-policy tests, browser game |
| G04 | Real-time | 2 | games/events,stream; live-game | Scoped/revoked/aborted streams, friend/reconnect browser checks |
| G05 | ORM | 1 | prisma/schema.prisma, migrations | Real SQLite, uniqueness, join/move/resign races |
| G06 | Design system | 1 | components/ui.tsx, DESIGN.md | Eleven composed shared primitives, rendered appearance checks |
| G07 | Three languages | 1 | i18n/dictionaries | Key parity, en/fr/ar UI/legal flows |
| G08 | RTL | 1 | locale layout, logical CSS, bdi | Arabic 360px, code direction, no overflow |
| G09 | Extra browsers | 1 | playwright.config.ts | 2026-10-29 Linux Chrome/Firefox/Edge: 72/72 checks; local public CA trusted |
| G10 | SSR | 1 | play and game server pages | Real saved board and metadata with JavaScript disabled |
| | Current core | 14 | | Mandatory requirements separate |
| G11 | Advanced permissions | 2 | auth/users/admin | Current-role CRUD, revocation, last-admin concurrency, deletion |
| | Current target | 16 | | No extra auth/theme points |

See ../evaluation/tic-tac-toe-evidence.md for executed results and limits.
Human contribution and understanding require
actual recorded demonstration, independently of automation.
