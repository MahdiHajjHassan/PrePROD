# Tic-tac-toe traceability

Candidate points are not awarded scores.
The two-member roster is accepted by the owner (2026-10-27).

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
| G09 | Extra browsers (unclaimed) | 0 | playwright.config.ts | Chrome/Edge verified; Firefox Windows SxS startup blocked |
| G10 | SSR | 1 | play and game server pages | Real saved board and metadata with JavaScript disabled |
| | Current core | 13 | | Mandatory requirements separate |
| G11 | Advanced permissions | 2 | auth/users/admin | Current-role CRUD, revocation, last-admin concurrency, deletion |
| | Current target | 15 | | No extra auth/theme points |

See ../evaluation/tic-tac-toe-evidence.md for executed results and limits.
Human contribution and understanding require
actual recorded demonstration, independently of automation.
