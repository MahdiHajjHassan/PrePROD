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
  The owner's latest instruction is to finish every package now in Transcendence2
  staging with Codex. Original owner labels organize later handoff bundles;
  actual source authorship is preserved. Claude can reuse the completed code.
  Nothing is pushed to the separate final history repository yet.

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
are pinned in the source. The full planned feature/UI scope is implemented in
staging; actual verification and human gates are recorded in delivery/evaluation
documents rather than inferred from the implementation plan.

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

The supplied Joseph profile shows josephboustany; verify his actual connected
account and author email in his own session. The owner confirmed 42 logins
mahajj-h and jboustan. Campus-specific clarifications and actual human review/
understanding remain personal records. Planned delivery tracks are not source
authorship or completed personal contributions.

The complete proposed behavior, module allocation, and acceptance criteria are
in docs/superpowers/specs/2026-10-26-taskboard-design.md.
