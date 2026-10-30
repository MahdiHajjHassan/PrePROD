# Email Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require proof of email ownership before account access, using one-time signup codes and the owner's selected Google Workspace SMTP sender.

**Architecture:** Pending registrations hold password hashes without creating active users. A dedicated challenge service owns bounded, browser-bound codes, email delivery, and atomic consumption. Existing accounts require verification at password login; all private access checks enforce the verified timestamp. SMTP is injectable and tested against an isolated mail inbox.

**Tech Stack:** Node 24, existing Next/React/Prisma/SQLite/Caddy, Nodemailer, Vitest, Playwright, an isolated Mailpit test service.

**Spec:** `docs/superpowers/specs/2026-10-29-email-verification-design.md`

## Global Constraints

- Preprod only; no prod promotion, external deployment, unrelated senders, or fabricated authorship.
- Preserve existing accounts/games, private environments, certificate/database volumes, and reference PDFs.
- English/French/Arabic, RTL, both themes, 360px/desktop; all Chrome/Firefox/Edge checks must pass.
- Email verification adds zero module points. No OAuth, 2FA, passwordless login, or password-reset feature.
- Six-digit random codes; ten-minute validity, one-hour pending lifetime, five wrong attempts, 60-second send cooldown and five sends/hour/address.
- Verification cookie: separate Secure/HttpOnly/SameSite=Lax token; database keeps only its hash, and the code verifier is HMAC-bound to the raw token and generation.
- TLS verification stays on for public SMTP; ambiguous SMTP submissions are not automatically retried.
- The sender identity and credentials belong only in private configuration. Real delivery cannot be claimed until authentication and an authorized inbox check succeed.

## Review Focus

- Existing sessions must not become usable again after legacy verification; confirmation revokes them (Task 2).
- Expired codes should be resendable while their one-hour pending attempt remains alive (Task 2).
- Timeout after SMTP acceptance must not yield a usable unknown/stale generation or an automatic duplicate retry (Tasks 1–2).
- Another browser's signup must not apply its password to an existing account; unique email wins only after successful proof (Task 2).
- Administrative email correction must preserve games, revoke sessions/challenges, and never assert verification (Task 4).

---

### Task 1: SMTP delivery boundary and safe configuration

**Files:** create `src/backend/modules/auth/email/verification-mail.ts`; modify `src/backend/config/env.ts`, `package.json`, lockfile, `.env.example`, `compose.yaml`; test `tests/server/verification-mail.test.ts` and configuration tests.

**Interfaces:** `VerificationMessage = {email:string; code:string; locale:Locale; generation:string}`; `VerificationSender = (message:VerificationMessage)=>Promise<void>`; `createVerificationSender(config:MailConfig|undefined):VerificationSender`. MailConfig has host, port, user/password, from, and isolatedTest. `loadConfig` returns optional `mail` configuration; partially supplied settings are rejected. Public ports 465/587 require authentication and verified TLS. Only the guarded E2E mailpit/1025 combination allows internal plaintext SMTP.

- [ ] Write failing tests for missing/partial configuration, unsafe public plaintext SMTP, authenticated TLS, localized copy, and no automatic retry on a rejected/ambiguous send.
- [ ] Run `npx vitest run tests/server/verification-mail.test.ts tests/server/config.test.ts --maxWorkers=1`; observe the missing transport/config behavior.
- [ ] Implement the sender with Nodemailer, ten-second connection/greeting/socket timeouts, stable generation-specific Message-ID, no logging, and generic sanitized delivery errors.
- [ ] Rerun the focused tests. Keep real mailbox credentials out of tests and tracked files.

### Task 2: Pending verification and enforced ownership

**Files:** modify `prisma/schema.prisma`, create an additive migration and `src/backend/modules/auth/email/verification.service.ts`; modify auth service/session/current-actor checks; test `tests/server/email-verification.test.ts`, update auth and fixture tests.

**Interfaces:** `createVerificationService(db,{send,now?})` returns `startSignup(input,clientKey)`, `startExisting(input,clientKey)`, `read(raw)`, `resend(raw,clientKey)`, and `confirm(raw,code,clientKey)`. Start returns `{token:string; expiresAt:Date}`; read exposes only `{email,expiresAt,resendAt,status}`; confirm creates or verifies the user and returns no session. The auth service keeps verified password login's current success shape and rejects unverified login with EMAIL_UNVERIFIED.

- [ ] Write failing database tests for absent verified-only access, create-after-confirm, HMAC storage, independent browser tokens, five failed attempts, expiry, resend/new-attempt quotas, consumed/superseded codes, concurrent confirmation/resend, uniqueness, failed delivery/recovery, and stale legacy sessions.
- [ ] Observe RED before implementing. Add nullable User.emailVerifiedAt and a separate EmailChallenge table; preserve old rows without backfilling ownership.
- [ ] Implement atomic attempts/consumption under existing write retry. Send outside transactions; activate only the submitted generation. Return invalid-attempt outcomes before throwing so counters commit.
- [ ] Gate login, session resolution and transactional currentActor. Bind legacy challenges to unchanged user/email/password digest. Revoke all old sessions at legacy confirmation.
- [ ] Mark only trusted isolated test fixtures verified. Update old successful-registration tests to actually confirm their captured messages before asserting account/login behavior. Run all server tests.

### Task 3: HTTP and accessible verification flow

**Files:** modify auth controller, service wiring, shared error/status and account validation; create `/api/auth/verification` and confirm/resend routes, `src/frontend/features/auth/components/VerifyEmail.tsx`, `src/app/[locale]/verify-email/page.tsx`; modify AuthForm/login notices and dictionaries. Test HTTP/origin/cookie behavior.

**Interfaces:** signup success is 202 `{data:{verificationRequired:true}}` plus the verification-only cookie; unverified correct-password login also returns that shape. Verified login keeps its current 200 cookie contract. GET verification returns safe metadata. Same-origin JSON POST confirm accepts `{code}`; resend accepts `{}`. Confirmation clears the verification cookie and routes to normal password login with a verified notice.

- [ ] Write failing route tests for no full session before proof, cookie flags, JSON secrecy, CSRF/content/body validation, malformed codes, duplicate cookies, and no authenticated API access from a pending cookie.
- [ ] Implement the thin handlers and routes. Keep pending tokens/codes/passwords out of JSON, URLs, logs and browser storage.
- [ ] Read Impeccable context/brief and craft-floor before UI edits. Reuse current primitives; one LTR numeric/autocomplete=one-time-code field; translated errors, resend countdown, expiry/retry and corrected-address restart.
- [ ] Verify types/lint and focused server tests. Preserve native POST form behavior and legal document links.

### Task 4: Safe setup and legacy-account recovery

**Files:** create `scripts/set-account-email.ts`; modify setup/config documentation, package command, auth contract, privacy/terms text and dictionaries; test `tests/server/account-email-migration.test.ts` and readiness/setup tests.

**Interfaces:** `npm run account:email -- --current-email <old> --new-email <new>` is an operator-only console action. It checks uniqueness, changes only the selected user's email, clears verification/challenges and sessions, and preserves account ID, role, password and game rows. It never prints credentials or silently trusts the new address.

- [ ] Write a failing preservation/revocation/uniqueness test against a real SQLite database, including an account with a saved game.
- [ ] Implement the console action and document real ADMIN_EMAIL plus private SMTP settings. Keep setup's no-overwrite behavior; do not modify the owner's normal database or environment automatically.
- [ ] Update privacy copy to describe verification metadata and the configured mail processor. Reverify dictionary parity and references.

### Task 5: Isolated inbox and complete browser verification

**Files:** modify `compose.e2e.yaml`, E2E setup/environment/reset helpers and browser fixtures/specs, `playwright.config.ts`; add `tests/browser/email-verification.spec.ts`.

**Interfaces:** isolated SMTP uses mailpit:1025, while its HTTP inbox API is published only to 127.0.0.1 on the selected test mail port. A helper reads verification messages for isolated .test recipients. No production app endpoint exposes codes. Default seeded demonstration fixtures are explicitly verified inside the guarded reset script; registration browser tests must complete real SMTP-to-inbox code entry.

- [ ] Add a failing browser case: register, prove private account access is denied, retrieve the isolated delivered code, verify, log in, play; then prove reuse/bad code are rejected. Add legacy verification and delivery error/resend coverage.
- [ ] Pin the Mailpit image, configure only the isolated Compose override, and adapt existing registration journeys to use that inbox. Smoke commands must no longer assume registration immediately creates a playable user.
- [ ] Run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run audit:source`, and the full Chrome/Firefox/Edge suite with strict local-CA trust.
- [ ] Inspect desktop light and 360px Arabic dark renders; run the required Impeccable detector once and resolve relevant findings.
- [ ] Request a final independent review of the complete diff, fix material findings, and rerun affected checks. Stop only the owned test containers; preserve volumes and private files.
- [ ] Record actual evidence. Sender authentication and real external delivery remain incomplete until the owner configures an authorized credential and an inbox check succeeds; never substitute a connected ChatGPT mailbox's identity or token.
