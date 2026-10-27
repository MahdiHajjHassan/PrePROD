# Joseph / Claude — Start Here

## Paste this into Joseph's Claude session

~~~text
You are helping Joseph implement his assigned contributions to
MahdiHajjHassan/Transcendence2. Use Joseph's own GitHub connection and normal
verified Git author identity. Codex is working with Mahdi on the other packages.

First read CLAUDE.md, AGENTS.md, PRODUCT.md,
docs/delivery/PUSH-MAP.md,
docs/superpowers/specs/2026-10-26-taskboard-design.md,
docs/superpowers/plans/2026-10-26-taskboard.md, and
docs/superpowers/plans/2026-10-26-team-contributions.md.

Use the approved Superpowers skills and Impeccable. Ask the owner before adding
any other project skill. Check that Superpowers is actually available in this
Claude environment; it is not installed here merely because Codex has it.
The pinned Impeccable instructions and references are in
.agents/skills/impeccable/. Read SKILL.md and follow its relevant task playbook.

Inspect origin/main and the existing open branches/PRs. Determine the first
uncompleted unlocked Joseph batch from the contribution schedule. Initially
that is J01 after M01 is merged. If M01 is not merged, review the documents and
setup requirements and report that dependency; do not recreate Mahdi's foundation.

For the assigned Joseph batch, write its meaningful tests, implement the actual
feature, verify it, commit coherent passing slices, and push them from Joseph's
authenticated session to the listed joseph/jXX branch. Open/update the batch PR
and hand back exact commits, test outcomes, and the next owner/dependency.

Do not implement Mahdi's future packages, fake Joseph authorship on his existing
commits, mark human reviews/understanding complete yourself, or build the whole
project in one Claude run. Help Joseph run and explain the real features he owns.
The handoff file's remaining instructions define file boundaries and Git steps.
~~~

## Before the first commit or push

- Confirm the repository is MahdiHajjHassan/Transcendence2, not the older project.
- Ask Joseph/the owner for his actual GitHub username if not confirmed. The old
  42 login jboustan must not be assumed to identify his GitHub account.
- Inspect the authenticated account through the connected GitHub tool, or
  gh api user --jq .login. Verify write access to this private repository.
- Inspect local git user.name/user.email. Joseph sets his own verified email or
  GitHub-provided noreply address in his own environment. Never use Mahdi's identity.
- If authentication is Mahdi's, stop the commit/push path and have Joseph connect
  his account through the supported environment setup. Do not reuse Mahdi's token.
- Use a separate clone/worktree. Do not share an index, ignored .env, database,
  port, certificate volume, or test Compose project with a simultaneously running
  Mahdi checkout. Coordinate the temporary local test project name/port if sharing
  a Docker host; keep the normal application commands unchanged.
- Verify approved Superpowers skills are enabled for Claude. Use the shipped
  Impeccable instructions, or the equivalent official Claude-compatible provider
  from the same pinned source if the runtime needs it. Installing/enabling these
  already approved two collections is allowed; extra collections require approval.
  Do not copy Codex-only runtime plugin paths as Claude setup instructions.

## Your implementation packages

| Batch | Main responsibility | Wait for |
| --- | --- | --- |
| J01 | Reusable design system, application shell, light/dark themes | M01 |
| J02 | Auth/account forms and relevant legal pages | J01 + M02 |
| J03 | Task query backend, search/filter/sort/pagination, task-board UI, SSR | J02 + M03 |
| J04 | Complete en/fr/ar translations and true Arabic RTL | M06 |
| J05 | Actual Chrome/Firefox/Edge and multi-user browser tests | J04 |
| J06 | Personal activity aggregation backend, dashboard, accessible chart/table | M08 |
| J07 | Finished-product UI, themes/locales/RTL/browser verification | J06 |
| J08 | Independent fresh-clone setup and evaluation rehearsal | M09 |

Follow the schedule's branches, concrete deliverables, and intended commit
checkpoints. Your code responsibilities are substantial: J03 and J06 include
backend behavior as well as UI. Do not reduce them to a cosmetic adoption pass
over code Mahdi has already written.

## Boundaries you must preserve

- Mahdi owns infrastructure, schema/migrations, auth/security, task mutation rules,
  admin, public API, transfers, event writes, and notifications.
- You own UI foundations, src/server/tasks/query.ts, task-board pages, SSR,
  localization/RTL, browser configuration/checks, and activity aggregation/UI.
- In J03, coordinate the narrow change delegating TaskService.list to your
  queryTasks(db,query). Do not replace the task write/permission service.
- In J06, consume the merged event writer/schema. Do not build another event
  store or redo notification delivery to complete the dashboard.
- Reuse the shared DTOs, error codes, validation limits, and service interfaces.
  Propose any necessary change explicitly with the exact old/new contract.
- Do not mass-reformat unrelated files or regenerate the lockfile without a
  dependency change. Add feature message keys in the established dictionaries.
- Keep the product at the planned 14+2 modules. Themes have no separate point.
  Do not add games, chat, organizations, external services, or another skill.

## Each finished slice

1. Read the exact technical task and its acceptance checks. Make sure all required
   upstream batches are merged, then branch from the current main.
2. Work through the relevant Superpowers test/implementation/verification cycle.
   Use Impeccable's context and applicable references for UI work.
3. Run the meaningful checks and inspect the rendered result. Report actual
   failures; do not mark scripts passing merely because they were added.
4. Review/stage only your intended files. Commit a coherent passing change using
   Joseph's actual configured identity. Push that commit from Joseph's session.
5. Continue on the same branch for a second real slice if needed. Push each
   finished checkpoint; keep unfinished/red test states local.
6. Open/update a PR with batch ID, feature behavior, exact verification outcomes,
   screenshots where useful, and any changed shared-file contract.
7. Update docs/team/contributions/joseph.md with your real commits/PR and results.
   Leave personal understanding/demo fields pending until Joseph actually does them.
8. Request Mahdi's review through the agreed collaboration channel. Do not send
   unsolicited email/chat messages or claim his review happened.
9. Preserve your commits when integrating. After merge, stop and report the next
   unlocked owner/batch instead of continuing into Mahdi's packages.

Read actual package scripts on each checkout and report missing setup rather
than claiming tests ran. M01 provides server/db checks and deployment; J01 owns
the first guarded, isolated Playwright harness and actual UI tests, and J05
extends that harness to the complete browser matrix.

## When Joseph asks to push his parts to the final repository

Transcendence2 is staging. The final contribution-history repository has not been
created/provided. Read docs/delivery/PUSH-MAP.md and the exact READY Joseph bundle;
verify the destination and actor before any final push. Preserve actual source
authorship and record meaningful Joseph-side implementation/adaptation separately.
A staging push does not mark a batch DELIVERED. Do not copy a whole staging tree
over another person's final work or guess that the older Transcendence repo is
the destination.

## Explain the feature with Joseph

For each meaningful batch, help Joseph do a short practical walkthrough:
- Find the entry route/component/service and describe its request/data flow.
- Run the feature and its focused tests.
- Demonstrate one invalid or unauthorized case.
- Explain the important design decision and one tradeoff.
- Explain how his feature calls Mahdi's code and vice versa.

Joseph records what he actually ran/explained in his own contribution file.
AI assistance is documented honestly. No artificial commit quota or empty commit
is required.

## End-of-batch handoff format

~~~text
Batch:
Branch and tested commit:
PR:
Implemented behavior:
Shared files/contracts changed:
Checks executed and observed results:
Rendered/manual checks actually performed:
Joseph's own walkthrough status:
Known issues:
Next owner/batch and what is now unlocked:
~~~

Initially, no Joseph feature contribution is marked complete. Fetch current main
and read the real history/PRs rather than relying on a stale status statement.
