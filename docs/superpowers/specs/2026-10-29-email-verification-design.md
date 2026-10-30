# Email ownership verification

Status: the owner confirmed implementing signup email verification on 2026-10-30.
The owner approved the email-best-practices guidance and selected their college
Google Workspace mailbox as sender. SMTP authentication remains pending.
Application changes have not started.

## Intent and confirmed scope

The owner requires users to prove control of an email address before accessing
an account, whether or not this earns module points. Email verification is not
a separately listed module in the supplied subject. It adds zero to the current
16-point candidate total. Two-factor authentication is excluded from this request.
All development stays in Transcendence2 preprod; prod promotion requires a later
explicit request or approval. Preserve existing accounts, games, private files,
certificates, and database volumes.

The subject requires secure email/password authentication and validation. The
current application checks syntax and registered-account passwords, but has no
email ownership state, verification challenge, or mail delivery integration.
The current auth/session regression baseline passes 25/25 tests.

## Approaches and recommendation

1. **Email codes, recommended.** Keep the current signup and password-login model.
   Send a one-time code to the supplied address; deny account access until it is
   confirmed. The owner's examples refer to emailed verification codes. This is
   the proposed concrete mechanism, not a claim that its detailed rules have
   already been approved.
2. **Email links.** Prove the same ownership with a random, expiring link. This
   adds link handling and potentially opening a different browser/profile. It
   does not earn an extra module point either.
3. **OAuth.** A separate one-point module with an external identity provider.
   It is outside this fix and does not resolve an unverified parallel password
   signup flow by itself.

Implement code verification as a focused account feature, with no game changes,
OAuth, 2FA, passwordless login, or password-reset feature in this scope.

## User flow

- Signup still asks for name, email, password, and accepted terms.
- Validate syntax on client/server before attempting delivery. A valid-looking
  address is not proof that a mailbox exists or belongs to the person typing it.
- Successful signup submission goes to a verification page, with the target
  email, one code input, Verify, Resend, and a way to start again with a corrected
  address. It creates no authenticated session and no playable account yet.
- Email contains a six-digit, cryptographically random code valid for ten
  minutes, a short explanation, and an ignore-if-not-requested notice. English,
  French, and Arabic copies follow the selected locale.
- Verification succeeds once, atomically creates the account with the submitted
  password hash and verified timestamp, and directs the user to password login.
- Subsequent normal logins require the password; there is no recurring email
  challenge after ownership is verified.
- Wrong, expired, exhausted, superseded, or reused codes grant no access. Resend
  has a cooldown, invalidates the old code, and respects persistent quotas.
- Provider failures show a clear retry state; no code or verification bypass is
  exposed in UI, JSON, URLs, server logs, or public browser assets.

## Account and challenge model

New signups use a separate pending-registration record, not an active User.
Store normalized email, display name, password hash, locale, challenge hash,
code verifier, expiry, failed-attempt count, and delivery generation/status.
Expire and prune pending records. Rate limits also apply to resends and repeated
new attempts, so replacing a challenge does not reset an address's overall quota.

A random 32-byte verification-only cookie identifies the browser's pending
attempt. It is Secure, HttpOnly, SameSite=Lax, short-lived, and separate from the
normal session cookie. Store only its SHA-256 hash. Bind the six-digit code to
that attempt using HMAC keyed by the raw random cookie token; a database dump
alone must not allow enumerating the small code space. The raw cookie is supplied
only by the browser during verification, not returned in JSON or email. This
makes verification belong to the browser that began that signup. A different
browser can restart registration or complete the existing-account login flow.

A candidate maximum is five wrong guesses per challenge, a 60-second resend
cooldown, and five sends/hour per normalized email plus a client quota. Final
values are implementation choices to be documented and tested. Persist counters;
atomically check expiry, delivery generation, attempts, and single consumption.
Verified email remains unique. Pending attempts for another browser cannot
replace a verified account or reset its password. On successful creation, clear
other pending registrations for that address.

Commit a challenge before contacting the provider. Do not send inside a database
transaction. Bind provider idempotency and delivery status to the generation;
activate only the successfully submitted generation and reject stale callbacks
or overlapping resends. If sending fails or times out, stay unverified and make
resending possible without claiming that mail arrived.

## Existing accounts and administration

Add nullable emailVerifiedAt without automatically trusting legacy addresses.
Preserve all existing user and game rows. Existing accounts with the correct
password can begin a verification-only challenge for their stored address, then
return to normal login after success. Existing authenticated sessions must also
stop granting access until that account is verified: enforce the state in both
session resolution and current-actor checks inside writes, not just the login UI.

The default bootstrap admin address is admin@tictactoe.local, so real delivery
requires an operator-supplied deliverable admin email. Provide a server-console
migration/recovery operation that changes an explicitly selected account's email,
checks uniqueness, clears verification/challenges, and revokes its sessions,
without deleting the account or its games. Do not automatically rename accounts
when ADMIN_EMAIL changes or mark administrators verified by role. Log neither
passwords nor verification material. Never enable an HTTP verification bypass.

A legacy address conflict that the mailbox owner cannot authenticate must be
resolved through that operator path. Do not automatically give a newly submitted
password access to someone else's historical account or matches.

## Delivery and configuration

The owner selected their college Google Workspace mailbox as sender. Its address
belongs in private configuration, not this document. An unrelated domain found
in a connected account must not be reused. No runtime SMTP credentials are yet
configured. Use a project-approved
sender, restricted sending credentials, and a clear Tic Tac Toe From identity,
held server-side in a private environment. Never commit keys or print them.
Do not send real messages to arbitrary addresses during testing.

Use an injectable sender boundary and a Nodemailer SMTP adapter. Public SMTP
requires verified TLS (465 implicit TLS or 587 STARTTLS), ten-second connection,
greeting and socket timeouts, and no debug logging. SMTP provides no guaranteed
idempotency; use a stable Message-ID per generation and do not automatically
retry an ambiguous submission. Explicit resend issues a new generation instead.
Use no more than five sends/hour per address, one send/minute per address,
five wrong guesses per generation, and a one-hour overall pending lifetime.
The code expires after ten minutes or the pending lifetime, whichever is first.
No new service is publicly hosted
or deployed by this request. Provider delivery acceptance is not inbox delivery;
only entering the code proves ownership. Missing sender configuration fails
clearly and never silently disables verification. Update setup instructions,
placeholders, Compose configuration, auth contracts and privacy text in all
three languages to reflect the new delivery processor.

AGENTS.md requires explicit owner approval before adopting another project skill.
The owner approved the Resend plugin's email-best-practices guidance, which is
applied to SMTP verification messages and does not select Resend as a provider.

## Interface constraints

Reuse the current Operate design, form primitives, feedback, themes, and layout.
One normal code input uses inputmode=numeric and autocomplete=one-time-code;
keep the code and email LTR within Arabic layout. Associate errors with the
field, announce status accessibly, preserve keyboard focus, and prevent duplicate
submissions. Render useful delivery-failure, expired-code, wrong-code, and resend
cooldown states. Preserve legal links and form data behavior without storing
passwords or codes in browser storage. Support 360px and desktop in both themes.

## Verification and completion

- First demonstrate that an unverified existing/new address grants neither a
  login session nor private API/game access; demonstrate missing ownership
  enforcement before adding the gate.
- Test real disposable databases: signup/verification/login, malformed input,
  expiry, wrong-attempt limits, resend quotas across new attempts, one-time use,
  concurrent verification/resend, email uniqueness, provider failure/recovery,
  stale sessions, administrator and legacy-account migration, and revocation.
- Verify registration cannot let a different browser apply its own chosen
  password to a victim's account; possession of an email string is insufficient.
- Use a guarded isolated mail-delivery test double outside the production HTTP
  API to exercise complete browser flows; no testing endpoint exposes codes in
  the normal application. Real provider wiring still needs one authorized
  recipient/inbox check before claiming real delivery.
- Run types, lint, server tests, build/artifact audit, and every claimed feature
  in Chrome/Firefox/Edge. Inspect mobile Arabic and desktop light/dark renders.
  Keep the earlier browser-test persistence correction.
- Verify bootstrap/setup on a fresh isolated database and migration on a copy of
  existing test data, preserving rows and refusing inaccessible admin defaults.
- Update module evidence honestly: email verification adds no module points.

## Remaining setup decisions

- Authenticate the selected Google Workspace sender using an App Password if
  college policy permits it; otherwise choose a supported authenticated sender.
- Supply/select a real administrator email privately when configuring the
  runtime. Never ask for passwords or API keys to be pasted into chat.
