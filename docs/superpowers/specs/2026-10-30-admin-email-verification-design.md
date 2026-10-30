# Verify administrator-created accounts before inserting users

The owner's reported defect is that Create user immediately inserts an account,
including its chosen administrator role, for a mailbox that has never been proved.
Valid email syntax does not establish mailbox existence or ownership.

Reuse the existing browser-bound email-code flow. Administrator creation returns
202, keeps the hashed password, requested role and creator in EmailChallenge, and
sets the private verification cookie. Create user opens the existing verification
page with explicit administrator copy. No User exists until confirmation.

Confirmation requires both the correct unexpired code and the same still-verified
administrator session. Recheck that administrator inside the activation transaction.
Deleting the creator removes its pending requests. Public signup always creates a
MEMBER; arbitrary role/creator fields remain rejected. Existing account verification
keeps its existing behavior. Reuse the current lifetime, guess limits, resend
quotas, SMTP failure state and single-use transaction.

The administrator enters the code delivered to the requested mailbox in the
requesting browser. Success returns to Users, retaining the administrator's session.
The new user signs in separately with the password chosen in the create form.

Alternatives: merely showing an Unverified badge leaves the reported unwanted
account in the database. A separate invitation/link system adds a new onboarding
contract. Reusing the existing code step is the bounded fix requested here.

Preserve all existing users, games, private configuration and certificate volumes.
Remove only the exact accidental account identified in the local demo. Develop
in the managed staging worktree; validate a production-compatible local demo port
without treating this request as authorization to push new work to production.
