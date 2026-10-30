# Administrator-created accounts: mailbox proof before creation

2026-10-30 correctness fix. Administrator creation now returns 202 and the
private verification cookie instead of immediately inserting a User. The
requested role, creator and password hash stay in EmailChallenge. Only the
correct single-use email code, confirmed by the same current verified
administrator, creates the account and grants its requested role. Public signup
still creates MEMBER accounts. Existing account verification remains compatible.

The original premature insertion was reproduced for both roles and by the
browser receiving 201. Regression checks now prove there is no User before
proof, on wrong/expired codes, on failed SMTP, or after creator authority is
lost. Unauthorized resend neither sends mail nor changes the generation.

Verified evidence:

- Complete staging server suite: 210 tests, 49 files, passed.
- Production-compatible image: 34 focused auth/admin server tests passed.
- Types, lint, Linux production build and source/artifact audit passed.
- Six targeted flows passed in each of Chrome, Firefox, Edge and Brave:
  pending administrator creation, SMTP failure, signup, legacy verification,
  wrong-code recovery and existing administrator CRUD: 24 browser checks.
- Headed Chrome rendering: English desktop/light, French 320px/light,
  Arabic 360px/dark; visible focus, RTL and no horizontal page overflow.
- New image public artifacts: 33 scanned, zero configured credential matches.
- Additive migration on the populated local demo preserved User, Game,
  GameMove, Tournament, TournamentEntry, TournamentMatch, UserAvatar and
  Friendship rows; database integrity was ok with zero foreign-key violations.
- The exact accidental demo user was removed. Submitting a replacement ADMIN
  request left all five original accounts unchanged and opened the code form.

The running localhost:9443 demo uses image
`sha256:cd6e24ae98d00448a542dbca4c9bda1cb96b4c11b20639e02b2e526abd435123`.
Its dependency inputs match the previously verified running production image;
the local image reuses that pinned dependency layer and rebuilds the changed
source. Private configurations, certificates and database volumes are retained.

The owner subsequently authorized Git delivery to both repositories on
2026-10-30. The verified functional fix was pushed to Transcendence2 main as
`f8ab1d3fc0928e35c446ec4c674d38246b4e791f` and Final-Trans-Repo main as
`5e10a1b1a04a0bbea03569483a0b1aab2c247383`, preserving each repository's
history and runtime conventions. Both normal main checkouts were fast-forwarded
and verified clean and equal to their own origin/main. The source branches
`codex/admin-email-verification` and `codex/admin-email-verification-demo` are
retained. No external deployment was requested.
