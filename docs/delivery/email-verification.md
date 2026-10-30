# Email ownership verification — 2026-10-30

Signup now requires a delivered six-digit code in the requesting browser before
the account exists. Existing unverified accounts prove ownership after a correct
password; confirmation revokes historical sessions. Both flows return to normal
password sign-in. There is no password-reset, OAuth or two-factor feature, and no
additional module points.

The original handoff checkpoint `60899d164754d9f3de9f8bf3660bd96ac6a78ffd`
was recovered from the verified archive and merged with staging `13c79e6`,
preserving both histories. The continuation completes the translated verification
screen, real rolling cooldown, resend/delivery-race handling, operator correction
coverage, browser helpers, smoke setup and privacy copy.

## Verification

- Final server suite: `npm test`, **173/173**, 33 files, on Windows/Node 24.
- Type checking passed in the runtime image with the final password-write fix.
- Final lint and Docker production build passed. A secret-safe scan of 650 final
  production artifacts found no sender/credential values, and development
  captures are excluded from the image.
- All 35 repository browser journeys passed in Chrome 156.0.8078.74, Edge
  156.0.4314.50 and Firefox 157.0 with strict certificate/hostname verification.
  The initial 105-case run finished 104/105: Firefox's native renderer ran out
  of memory in a game reconnection case. The complete Firefox suite then passed
  in three fresh-process shards (17 + 9 + 9), with no skips, test retries,
  application changes, relaxed assertions or TLS exceptions. The failed run
  remains recorded separately; it is not counted as a passing matrix.
- After a guarded isolated reset, `npm run smoke`, `npm run smoke:auth` and
  `npm run smoke:games` passed with the test CA and existing verified test users.
- SMTP acceptance and an actual matching message in the authorized owner's Gmail
  inbox were verified through a separate HTTPS 8843 instance. The sender and App
  Password remain only in ignored private configuration. No live inbox code was
  consumed: the connector withholds authentication codes, and that restriction
  was respected. Complete confirmation/login/play is covered by the isolated inbox.
- Fresh independent code review found one password-write race. Its disposable
  database regression failed before the fix, then focused auth/operator tests
  passed **21/21**. A transactional ownership check now prevents a stale actor
  changing a password after operator email correction; the final 173-test suite
  includes that regression.
- Impeccable's independent finish review returned **ship** for English desktop
  light and 360px Arabic dark captures. All 41 detector advisories belong to
  incumbent CSS; the email addition introduces no new system tokens or rasters.
  The documenter preserved existing design artifacts and recorded the narrow
  extension in `.impeccable/surfaces/email-verification.md`.
- Reference PDF SHA-256 checksums match the original baselines.

Tests reset only the explicitly guarded `tictactoe-e2e-email-verification-local`
database. The SMTP validation instance has its own separate database. Original
accounts, games, private environments and certificate/database volumes remain
preserved. This is local staging feature work; no production promotion or
external deployment is included.

The configured local instance is available at `https://localhost:8843/en/login`.
Its ignored `.env.smtp-validation` and `.env.smtp-validation.compose.yaml` hold
the private runtime setup. Final strict-HTTPS checks returned health 200,
anonymous account 401 and registration-page 200. The owned automated-test
containers were stopped after smoke checks; their volumes were retained.
The continuation used Codex assistance and does not establish human understanding.

Windows Firefox's existing automation installation could not launch. A fresh
isolated Firefox 157 installation launched and passed trusted HTTPS; the existing
cache was preserved. Browser execution uses `PLAYWRIGHT_BROWSERS_PATH` pointing
to the owner's separate `email-verification-browsers` cache, with normal Chrome
and Edge channels. This verifies the downloaded runner, without asserting a
repair of the pre-existing installation.

During low Windows commit-memory availability, the renderer and a separate
diagnostic shell failed with out-of-memory errors. Fresh browser batches completed
all cases, including reconnection; system/pagefile settings and other people's
processes were not changed. For this constrained machine, run the Firefox
project sequentially with `--shard=1/3`, `--shard=2/3`, `--shard=3/3`.

## Implementation decisions and limits

- The owner's later business Gmail choice supersedes the historical college
  sender selection. A connected inbox cannot supply the application's SMTP
  credential. Choosing the wrong sender would prevent authenticated delivery.
- Enforce the full 60-second address cooldown atomically in the existing rate
  table; fixed hourly quotas remain. Conditional generation activation prevents
  late SMTP results from changing a newer attempt. Incorrect ordering would
  allow excess mail or stale code activation.
- Include safe server time in verification metadata so countdown hydration is
  pure and uses the server's time base. Browser clock changes can affect only
  the display; server expiry and rate checks remain authoritative.
- Cache npm downloads, include optional dependencies, reduce fetch concurrency
  and fail immediately if native CSS packages are absent. This resolved an
  observed incomplete network install without changing pinned dependencies;
  builds still need working package-registry connectivity.
- The deliberately failed-SMTP browser case waits for its bounded response
  before checking navigation, avoiding a race between two ten-second timers.
  Application SMTP timeouts and explicit retry behavior remain unchanged.
- Roster, points and historical browser-status discrepancies inherited from
  other documentation are outside this feature. Email adds zero points; this
  evidence does not establish team understanding or an official assessment.

No minor code-review findings were deferred. The live Gmail confirmation limit
above is separate from verified SMTP acceptance, inbox receipt and isolated
end-to-end code confirmation.

## Integration for Git promotion — 2026-10-30

The owner subsequently authorized email delivery to both ppd and prod. This
preprod integration merges the completed feature with main `297abce`, retaining
the newer profiles, friends/presence, tournament and statistics package. Its
session token hashing and presence timestamps coexist with ownership gating;
all five isolated test accounts are explicitly verified.

The merged source passed 202/202 server tests, types, lint and its container
build. The focused integration suite passed 63/63 journeys: 21 each in Chrome,
Firefox and Edge, covering email verification, account/game flows, profiles,
avatars, friends, tournaments and statistics. This is scoped integration
coverage, separate from the earlier complete 35-case baseline per browser.
The final image scan checked 977 artifacts without finding private sender or
credential values. Desktop light and Arabic mobile dark verification captures
were inspected again after integration and preserve the approved auth surface.

A fresh independent merge/port review found no critical or important defects.
The prod test-header fidelity issue it identified was corrected and its four
HTTP tests passed. Production receives only the email feature, retaining its
existing runtime conventions and feature scope. Private SMTP settings were
configured in the two existing ignored local delivery environments while
preserving their original settings; no account/database data was changed.
