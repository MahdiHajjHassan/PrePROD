# Administrator Email Verification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep administrator-created accounts pending until mailbox proof succeeds.

**Architecture:** Extend EmailChallenge with a requested role and creator relation.
Share the current verification service between auth and user management. The same
code screen confirms signup or administrator creation using server-owned metadata.

**Tech Stack:** Node 24, TypeScript, Next.js, Prisma/SQLite, Vitest and Playwright.

**Spec:** ../specs/2026-10-30-admin-email-verification-design.md

## Global Constraints

- No User or privileges before code confirmation; public signup remains MEMBER.
- Recheck the original verified administrator in the activation transaction.
- Preserve the current SMTP, cookie, database and rate-limit conventions.
- English/French/Arabic RTL, both themes, 320/360-pixel and desktop views.
- Preserve private runtime state and repository histories; no production push.

## Review Focus

- Missing, different, demoted or deleted administrator at confirmation.
- Wrong/expired/replayed code and failed SMTP must leave no User.
- Public requests cannot choose a privileged role or creator.
- Pending metadata must survive reload/resend without exposing secrets.
- Confirmation must retain the administrator session and not log in the new user.

### Task 1: Pending backend creation and atomic activation

- [x] Add regression tests in tests/server/admin-email-verification.test.ts and observe the current premature insertion fail.
- [x] Add the additive creator/role migration and Prisma relation.
- [x] Implement pending creation in verification.service.ts and users.service.ts; share the service in services.ts.
- [x] Return 202 plus the verification cookie from the admin POST route; pass the current optional actor to confirmation/resend.
- [x] Update existing creation tests to complete real verification; run the complete server suite.

### Task 2: Existing verification UI and local delivery

- [x] Route Create user to verification; add translated pending/admin-success copy using the existing controls.
- [x] Add browser regressions proving no listed account before proof, privileged activation only after proof, and sender failure remaining pending.
- [x] Run types, lint, build and artifact checks, plus the changed flows in three browsers.
- [x] Obtain a fresh review, validate the production-compatible port, rebuild the local demo and show pending creation to the owner.
