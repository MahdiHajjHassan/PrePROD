# Email verification surface

Mode: Operate. Route: `/[locale]/verify-email`, joined from registration or an
unverified account's password sign-in.

Confirm ownership once in the requesting browser, then return to password
sign-in. This is required account functionality, not 2FA or a points-bearing
module. This brief records the finished local extension on 2026-10-30.

## Direction contract

**THESIS:** Make the next account step clear through one labelled six-digit
field, explicit feedback and deliberate recovery actions.

**OWN-WORLD:** Inherit DESIGN.md's Modern Game Club: burgundy/rose actions,
ivory or wine-dark surfaces, local Readex Pro and rounded shared native
controls. Reuse AuthLayout, its wine aside and existing SVG artwork.

**STORY:** Show the pending email address, explain the latest code and its
expiry, confirm it, then sign in with the password. Resend, refresh, restart
registration and sign-in remain explicit choices.

**FIRST VIEWPORT:** Desktop pairs a quiet heading and stacked form on the left
with the incumbent game aside on the right. Below 760px the aside hides and
the form becomes one column. Arabic follows RTL reading order while the
address and code remain LTR. Confirmation precedes secondary recovery actions.

**FORM:** Ordinary extension of existing authentication composition; no concept
roll, new visual world, tokens or raster assets. New-work section 3's local
extension exemption applies.

**FINISH:** unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

## States and interaction

- Sending, sent and delivery failure use the shared status/error alert. Refresh
  reads delivery status; it does not automatically repeat confirmation.
- One native LTR text input supports numeric entry, six ASCII digits, paste and
  one-time-code autofill. Shared label, hint, field-error and focus behavior stay
  intact; confirmation requires a sent, unexpired code.
- Resend observes the server countdown and any retry delay; its localized
  countdown is not announced every second. Actions are serialized while busy.
- Expired and invalid/used codes explain recovery. Missing browser-bound
  metadata replaces the form with a recovery message and restart/sign-in links.
- Success returns to sign-in with a translated verified notice. Wrong-address
  help distinguishes restarting signup from administrator correction of an
  existing account. English, French and Arabic supply the same recovery choices.

## Evidence and limits

Source comparison: `VerifyEmail.tsx`, `AuthForm.tsx`, the verification page,
`AuthLayout.tsx`, shared form/feedback components, all three locale dictionaries
and the existing stylesheet. The only email-specific styling wraps a long
address, makes it semibold, and gives code digits tabular spacing.

The reviewed `.impeccable/review/email-desktop.png` (1280px, English/light) and
`email-mobile-arabic.png` (360px, Arabic/dark) show the sent state and visible
input focus in the incumbent system. These captures and source inspection do
not certify all states, French rendering, 320px reflow or a three-browser matrix.
The finish review and executed checks belong to delivery evidence. Root design
artifacts are preserved; this local brief adds no system-wide rule.
