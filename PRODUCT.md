# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Audience and goal

A small 42 ft_transcendence game, playable and explainable by the accepted
**two-person** team: Mahdi (mahajj-h) and Joseph (jboustan). The owner explicitly
accepted this roster on2026-10-27. The goal is a complete tic-tac-toe application
that satisfies mandatory requirements and at least14 demonstrated module points.
Official scoring and human explanation are separate from automated tests.

## Confirmed product

Tic-tac-toe with both friend play in separate signed-in browser sessions on one
computer and a local computer opponent. The owner authorized the game implementation and removal of superseded
product material.

Guests read rules and create accounts. Members create/join invitation rooms,
play alternately, resume committed matches, resign or play again. AI replies
server-side and intentionally permits imperfect choices. Administrators create,
list, edit and delete users and manage roles, with a final-administrator guard.
Deletion safely resolves/anonymizes games and revokes the removed user's access.

## Technical choices

Node24/npm, pinned Next/React/TypeScript, Prisma/SQLite, Tailwind/shared semantic
CSS tokens and Caddy local HTTPS. Server transactions own moves, turns and
results. Scoped SSE publishes canonical snapshots after commits; the client
filters stale versions and reads current state after reconnect. A lost response
never triggers an automatic move retry. Single application process is the target.

## Interface

The rounded modern game-club appearance uses burgundy/rose accents, ivory light
surfaces and wine-dark surfaces. Local OFL Readex Pro supplies display headings,
body text and Arabic. The tilted decorative board, bold round-ended X/O marks,
rounded controls and filled navigation states carry the identity. The serif and
fine-line revision is superseded. Runtime font requests remain local.

Guest entry introduces the game and account actions; signed-in play prioritizes
computer/friend choices. Live matches center the square board, player identities,
turn/result feedback and explicit recovery. Forms, tables and legal pages reuse
the shared controls. See DESIGN.md for extracted visual tokens.

English/French/Arabic, logical RTL layout, LTR room codes and board positions,
360px and desktop widths, both themes, stable keyboard focus and legal form
preservation remain required. SVG/CSS motion describes confirmed marks and
results, finishes promptly and respects reduced-motion preferences. Server state
continues to own moves and results. Legal links open separately, preserving the
original form without storing its password in browser storage.

## Modules and verification

Current candidate target:15points, including advanced permissions as buffer.
G09 is unclaimed because the recorded Windows verification could not launch the
bundled Firefox runner. Chrome and Edge are verified with certificate validation enabled.
Use README.md, docs/requirements/module-matrix.md and
 docs/evaluation/tic-tac-toe-evidence.md for exact behavior and observed checks.
Do not count auth/themes, public-API/notifications/statistics,
tournaments or remote-play as extra modules.

## Delivery constraints and authorship

The owner authorized staging commit/push on2026-10-27. No external deployment,
final-repository delivery, credential output or data-volume deletion.
Transcendence2 is staging; never touch or guess a separate final-history remote.
Preserve the private .env and Caddy volumes; use game-data for persisted matches. Tests reset only guarded isolated test databases.

Superpowers and vendored Impeccable are required; other skills need owner approval.
Current implementation is Mahdi/Codex-assisted work for staging delivery. Preserve actual
authorship; Joseph review/adaptation/delivery is recorded only when it happens.
Earlier implementation history remains available in Git.
