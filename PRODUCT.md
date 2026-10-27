# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Product Purpose

Build the smallest understandable ft_transcendence application that completely
satisfies the mandatory requirements and earns the selected module points.
The target proposal is 14 core points plus 2 buffer points. Stop adding features
when that scope is complete and demonstrated.

## Confirmed Constraints

- Use the subject and evaluation PDFs in docs/reference as the governing sources.
- Use Superpowers and Impeccable. Ask for explicit confirmation before adding
  or adopting another project skill.
- Support light and dark mode with a remembered preference.
- Keep the entire demonstration possible on one computer with separate browser
  sessions for simultaneous users.
- Favor small, explainable implementations and a modest points buffer.
- Theme switching has no standalone points allocation in the supplied subject.
- The team is Mahdi and Joseph. Codex assists Mahdi; Claude assists Joseph.
  Each side implements and pushes its assigned substantive packages using its
  own identity, following the contribution schedule.

## Implementation Baseline

The implementation plan specifies one shared public task board. Visitors can read
tasks; registered members manage their own tasks; administrators manage tasks,
users, and role assignments. There are no separate workspaces or boards.

The product name Taskboard is a working label, not an approved brand. This is an
evaluation-focused application; no existing customer base or usage is claimed.
The people using it during development and evaluation will create demonstration
accounts and clearly labeled sample tasks.

## Stack

The implementation uses Next.js App Router, React, TypeScript, Tailwind CSS,
Prisma, SQLite, and Caddy for local HTTPS. Exact dependencies and image digests
are pinned in the source. M01 implements the application/database/deployment
foundation; the functional feature and UI modules remain in their assigned batches.

## Operating Context

The application must support simultaneous users, persist across container
restarts, and run through one documented container startup command after
one-time environment and local certificate setup. No external service is
required by the planned modules.

## Accessibility & Inclusion

The subject requires a responsive and accessible frontend. The proposal includes
complete English, French, and Arabic UI translations, true Arabic RTL layout,
keyboard operation, and usable contrast in both themes. Full WCAG compliance is
not claimed as a separate module.

## Open Facts

The owner has confirmed the two members, Mahdi and Joseph. The proposed technical
responsibilities and push order are in
docs/superpowers/plans/2026-10-26-team-contributions.md.

Actual 42 logins, Joseph's GitHub identity, and any campus-specific clarifications
still require confirmation. Do not infer identities from old repository labels
or treat planned responsibilities as completed contributions.

The complete proposed behavior, module allocation, and acceptance criteria are
in docs/superpowers/specs/2026-10-26-taskboard-design.md.
