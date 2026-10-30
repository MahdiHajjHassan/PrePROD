# UI redesign integration handoff

Branch: `codex/ui-redesign`, based on `c3ff68d`.
Initial implementation commit: `98a84bc`; a follow-up fixes room-code form
alignment and records the final verification.
Worktree: `/workspace/Transcendence2/.worktrees/ui-redesign`.
The owner requested a separate branch for later synchronization with concurrent
feature work. Nothing was pushed or merged into main.

## Changes

The whole existing application shares a new paper/forest/lime design system,
locally hosted OFL Readex Pro for Latin and Arabic, active navigation, responsive
lobby and authentication compositions, and updated controls, tables, forms,
legal pages and browser icons. Existing React/Next.js/TypeScript/Tailwind remain
the stack; package dependencies are unchanged.

Confirmed X/O marks draw in SVG, player emphasis follows the saved turn, and a
line draws through a winning trio. The result and dialogs have bounded motion.
Reduced motion renders finished strokes immediately; old boards do not replay
their initial marks. Cell buttons and focus remain stable. Rematch navigation is
immediate rather than waiting for a clearing sequence.

## Verification observed on 2026-10-30

| Check | Result |
| --- | --- |
| `npm test` | 134 tests passed, 27 files |
| `npm run typecheck` | Passed |
| `npm run lint` | Passed, zero warnings |
| `npm run build` / isolated production image build | Passed |
| `npm run audit:source` | Passed; PDFs unchanged, private artifacts absent |
| Full Playwright suite | 29 tests passed in distro Chromium 154.0.8037.57 |
| Final rendered capture matrix | 19 captures, no document overflow or page errors |

Playwright used the `chrome` project with `/usr/bin/chromium`; this is not a
claim of actual Google Chrome, Firefox or Edge verification. HTTPS certificate
chain and hostname validation stayed enabled. The isolated test project was
`tictactoe-e2e-redesign`, port `8543`, credentials file `.env.redesign-e2e`.

The browser checks cover both themes, translations/RTL, keyboard focus, reduced
motion, winning geometry, initial-mark replay suppression, server rendering
without JavaScript, reconnect/stale snapshots, uncertain responses, secure
accounts, user administration and registration legal-link preservation. A fresh
code reviewer found French admin navigation overflow at 320px; the new regression
test observed 355px before restoring wrapping and passed after the fix.

The independent visual review matched the direction contract and requested one
room-code form grouping fix. Its regression test observed a 32.78px desktop
offset and a mobile action beside the hint before the fix. The final form aligns
the desktop action with the input and stacks the full field above its action on
phones. The fresh-image suite passed, and the reviewer scored that listed fix
resolved from recaptured desktop/mobile screenshots (`ship` at that scope).

Impeccable's detector ran once: 42 advisory entries for typography/radius/color
variants and no non-advisory findings. Those variations are described in the
design documentation; the detector does not replace rendered review.

Screenshots and capture metadata are preserved locally in the worktree's ignored
`.impeccable/review/`, including `desktop.png`, `mobile.png`,
`game-win-desktop.png`, `game-win-mobile.png` and `measurements.json`.
The actual-browser `motion-preview.gif` and `motion-preview.webm` show confirmed
moves, player emphasis and a diagonal win; no simulated game state was used.

## Synchronizing feature work

The highest overlap is `src/frontend/styles/index.css`, the locale layout and
play/login/register pages, `src/frontend/layout/preferences.tsx`, and the Board
and LiveGame presentation components. Header links now live in
`src/frontend/layout/Navigation.tsx`; integrate any new feature navigation there.
The shared component and translation contracts are retained. This branch changes
no backend service, API route, database schema or game rule.

`DESIGN.md`, `PRODUCT.md`'s Interface section, the tic-tac-toe surface brief and
`.impeccable/design.json` describe the finished visual system for future screens.
The local font is a licensed static asset, not another runtime technology.
