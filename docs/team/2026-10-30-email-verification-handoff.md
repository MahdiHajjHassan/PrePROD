# Laptop handoff — email verification — 2026-10-30

Historical cloud checkpoint. The laptop continuation and its current evidence
are recorded in [the delivery note](../delivery/email-verification.md).

## Read this first

This is an **unfinished preprod feature checkpoint**, not a deployable completed
email-verification feature. The owner paused cloud work to continue on their
laptop. Do not re-brainstorm or restart the implemented backend. Finish the
remaining work below, verify it, and preserve the user's private runtime data.

Repository: https://github.com/MahdiHajjHassan/Transcendence2 (preprod).
Production: MahdiHajjHassan/Final-Trans-Repo. Do not develop on, push to, or deploy
prod without a later explicit owner request/approval.
Branch: `codex/email-verification`.
Cloud feature worktree: `/workspace/Transcendence2/.worktrees/email-verification`.
The managed root checkout `/workspace/Transcendence2` still contains the earlier
baseline/document changes; the feature implementation is in the worktree/branch.

The portable Git bundle includes the checkpoint branch and its reachable history.
The source ZIP includes its current tracked files. Private `.env` files,
databases, certificates, node_modules, build outputs, browser traces, and logs
are excluded. Nothing was pushed to GitHub for this handoff.

## Owner decisions and project state

- Team: Mahdi (mahajj-h), Joseph (jboustan), and Khalid. Khalid's campus/GitHub
  identities remain unconfirmed. Preserve actual authorship; never relabel code
  or manufacture commits/reviews. Future Khalid delivery must use his actual
  authenticated identity and contribution.
- Previous baseline had 16 candidate module points after G09 additional browsers
  was verified on Linux: 72/72 checks across actual Chrome, Firefox, Edge. That
  browser evidence applies to the baseline, **not this unfinished feature**.
- Overall target is 20 candidate points. Tournament (+1), spectator (+1), and
  complete statistics/history (+1) were discussed, not implemented. The fourth
  extra minor module is undecided. The owner rejected application 2FA.
- The owner explicitly wants email ownership verification even though it earns
  zero standalone module points. The subject requires secure email/password
  authentication but does not explicitly mandate mailbox verification.
- Signup verification is one-time: emailed expiring code, then ordinary password
  login afterward. This is not 2FA, OAuth, or passwordless login.
- The owner approved the Resend plugin's **email-best-practices guidance only**.
  Resend was not selected as the delivery provider. An unrelated connected-account
  domain was suggested in error and removed; never reuse unrelated mail domains.
- The owner selected their **college Google Workspace mailbox** as sender. Keep
  its actual address and credentials in private configuration. The private setup
  note in the transfer package records the address supplied in chat.
- The connected ChatGPT Gmail mailbox was different. Its connection/token is not
  the application's SMTP credential and must not be substituted.
- No Gmail account was created, no real email was sent, and no sender credential
  was supplied. The owner was checking whether Google offers an App Password.

## Design, plan and progress

Read `AGENTS.md`, then:

- `docs/superpowers/specs/2026-10-29-email-verification-design.md`
- `docs/superpowers/plans/2026-10-30-email-verification.md`

Use the approved Superpowers implementation workflow, approved email guidance,
and vendored Impeccable for UI work. The design passed a fresh builder check
before implementation. No whole-branch implementation review has run yet.
The cloud's private execution ledger was excluded from the transfer; this file
is the portable progress record. Key decisions from it are preserved below.

Implemented backend and HTTP:

- Nodemailer 10.3.1, @types/nodemailer 8.0.2; exact versions locked.
- Optional all-or-none SMTP configuration. Public SMTP ports 465/587 use verified
  TLS/authentication, bounded timeouts, and no message/credential logging.
  Only the guarded isolated Mailpit sidecar permits internal plaintext SMTP.
- Additive migration `202610300001_email_verification`: nullable User.emailVerifiedAt
  and separate EmailChallenge table. No legacy row is automatically trusted.
- Pending signup holds a salted password hash but creates no active User until
  code confirmation. Six-digit codes, ten-minute validity, one-hour pending
  lifetime, five wrong attempts, persistent send quotas, browser-bound HMAC code
  verifier and hashed random cookie token.
- Legacy correct-password login starts verification; session resolution and
  transactional actor checks enforce ownership. Legacy confirmation revokes old
  sessions so stale cookies do not become valid again.
- Signup/unverified login returns 202 and only a Secure/HttpOnly/SameSite=Lax
  verification cookie. Confirm/resend/read routes are implemented; JSON exposes
  no token/code/password. Confirmation does not create a full login session.
- SMTP acceptance is distinct from delivery. Ambiguous sends are not retried
  automatically; failed generations remain unusable and explicit resend rotates
  the code. A failed send can still return a pending attempt with status FAILED;
  the unfinished UI must display that state honestly.
- Operator-only `npm run account:email -- --current-email <old> --new-email <new>`
  is implemented/tested. It preserves ID/role/password/games and clears ownership,
  sessions, and challenges. Never run it against normal data without the owner's
  intended account/address selection.

Drafted/in progress:

- Isolated Mailpit Compose service (pinned digest), SMTP environment overrides,
  inbox helper, verified seeded test fixtures, and the first browser test.
- Firefox executable override for the same temporary-profile CA trust used by
  prior Linux verification.
- README/auth setup documentation. Privacy translations remain outdated.

## Important: unfinished work and known issue

1. **Fix and test the strict 60-second cooldown first.** Current send quotas use
   the existing fixed-window limiter, and resend does not enforce persisted
   `resendAt`. Crossing a clock-minute boundary may permit another send in less
   than 60 seconds, including through a new browser attempt. Add a real-database
   boundary/concurrency regression and implement an atomic per-address cooldown;
   keep hourly/client limits. Do not claim the advertised cooldown is complete.
2. `AuthForm.tsx` still follows the OLD registration-success navigation to login.
   There is no `/[locale]/verify-email` screen/component. Add it and route 202
   responses there. Keep password login unchanged after confirmation.
3. Add accessible verification input, safe metadata load, expiry/wrong/failed-send
   states, resend countdown, corrected-address restart, and verified login notice.
   Read Impeccable craft-floor before UI edits; preserve existing appearance,
   native POST behavior, legal links, keyboard focus, English/French/Arabic/RTL,
   and light/dark at 360px and desktop. Do not store passwords/codes in browser
   storage or put them in URLs.
4. Add all new translations/error messages and update privacy text for email
   delivery and pending attempts. Current dictionaries still say no email delivery.
5. Adapt existing registration browser journeys and smoke scripts: registration
   no longer immediately creates a playable user. Use the isolated inbox helper
   for browser verification; never expose codes through a production HTTP route
   or introduce an authentication bypass to make tests pass.
6. Cover overlapping resend/delivery completion, overall pending lifetime, operator
   challenge cleanup, and the boundary issue above. The existing service tests
   cover expiry, wrong guesses, quotas, failed delivery, browser binding,
   concurrent confirmation, uniqueness, legacy password changes and revocation.
7. Run full server/types/lint/build/artifact checks, then all claimed browsers.
   Perform the required visual checks and Impeccable detector; obtain one fresh
   whole-branch review and fix material findings with regression evidence.
8. Finish sender authentication and one authorized real-inbox delivery check.
   Preserve normal database/credentials/certificates. Do not deploy this checkpoint.

## Verification at handoff

Fresh commands against this checkpoint's source:

- `npm test`: **142/142 passed, 30 files**.
- `npm run typecheck`: passed.
- `npm run lint`: passed, zero-warning configuration.
- `git diff --check`: passed before checkpoint creation.

No successful full production build or browser run for this feature is claimed.
The first browser attempts failed in setup: one Docker snapshot captured a new
RED backend test before its implementation file; another VFS build/export ran
out of the cloud workspace's 32 GiB disk. Unused build cache was reclaimed.
The last retry was interrupted for this handoff at the owner's request.
**These are not observed application-level browser RED results.** The next
session should first get the new browser case to run against the existing UI
and observe its missing-verification navigation before implementing the screen.

Initial service tests were observed RED, then GREEN; HTTP tests likewise.
The operator migration tests were observed RED, then 2/2 GREEN.

## Laptop restore

Use a fresh folder to preserve an existing checkout's private environment/data:

```sh
git clone --branch codex/email-verification transcendence-email-verification.bundle Transcendence2-email
cd Transcendence2-email
git remote set-url origin https://github.com/MahdiHajjHassan/Transcendence2.git
npm ci
npm test
npm run typecheck
npm run lint
```

Use Node.js **24** and npm. The bundle includes the feature source and history;
`origin` must be reset to GitHub because cloning a bundle initially uses its file
path. It has not been pushed to the remote. Do not overwrite another checkout's
`.env`, databases, certificate stores, or volumes. A source-only ZIP is supplied
as an alternative, but the bundle preserves the actual Git history.

Use only a fresh isolated test database while finishing this branch. Do not apply
its migration to a normal laptop database and attempt a demonstration yet: the
ownership gate exists but its verification screen is unfinished.

### Isolated browser setup

The cloud run used project `tictactoe-e2e-email-verification`, HTTPS 8743, Mailpit
HTTP 8744, and private `.env.e2e.email-verification`. It reused only the already
trusted **test** CA volume from the earlier browser test. Those private files and
volumes are not in the transfer. On the laptop, use a fresh test CA volume and
trust its public root normally; do not copy private CA keys or bypass TLS.

For Bash, after installing actual Chrome, Firefox and Edge and arranging local
CA trust, use the equivalent of:

```sh
TICTACTOE_E2E_PROJECT=tictactoe-e2e-email-verification \
TICTACTOE_E2E_PORT=8743 \
TICTACTOE_E2E_MAIL_PORT=8744 \
TICTACTOE_E2E_ENV_FILE=.env.e2e.email-verification \
TICTACTOE_E2E_LOG_DIR=.superpowers/sdd/2026-10-30-email-verification \
npx playwright test tests/browser/email-verification.spec.ts --project=chrome
```

Set equivalent environment variables in PowerShell if using Windows. The helper
creates its own private test environment. Mailpit is strictly local test mail;
it does not prove real college-mail delivery. `TICTACTOE_FIREFOX_EXECUTABLE` can
select a launcher that imports only the isolated public CA into the temporary
Firefox profile; the cloud's local launcher and browser installations are not
part of the transfer. Use the platform's actual installed browser paths.

### Real sender setup

The college domain's MX records identify Google Workspace. The owner must check
App Password availability in that college account at:
https://myaccount.google.com/apppasswords

College policy may restrict it; do not assume a normal Google password works.
Keep any App Password out of chat, Git, reports, and screenshots. Put it directly
in the laptop's private configuration when the implementation is complete:

```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=<owner-selected-college-mailbox>
SMTP_PASSWORD=<app-password>
SMTP_FROM_EMAIL=<same-owner-selected-mailbox>
```

The site can remain on localhost; real delivery requires internet and outbound
SMTP. The cloud environment reported no outbound TCP grants, another reason a
local laptop may make the live SMTP check easier. Do not reuse another connected
account's SMTP/API/OAuth credentials. Do not send mail to arbitrary recipients;
use the owner's authorized inbox for the initial live check.

## Continuation prompt

Continue the email-verification work on preprod Transcendence2, branch
codex/email-verification. Read AGENTS.md and this handoff, then its linked spec
and plan. The backend/HTTP gates and operator migration are implemented;
142 server tests, types and lint pass. The verification UI/translations,
registration browser/smoke adaptations, full browser/build verification and live
SMTP configuration are incomplete. Fix the documented strict cooldown boundary
issue with a failing test first. Preserve current work, private data and actual
authorship. Email guidance is approved, 2FA is excluded, and prod is out of scope.
Do not re-implement completed backend tasks or treat this checkpoint as deployable.
