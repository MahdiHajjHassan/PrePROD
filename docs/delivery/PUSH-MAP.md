# Final-Repository Delivery Map

## Repositories

- Staging/development: https://github.com/MahdiHajjHassan/Transcendence2.
- Final contribution-history repository: NOT CREATED / NOT PROVIDED YET.
- Current authorization: implement and push staging checkpoints to Transcendence2.
- No final-repository delivery is authorized or recorded by a staging push.

The owner clarified this distinction after the initial split was written.
Keep actual source authors, delivery actors, review/adaptation, and destination
commits separate. A future Joseph-side push does not reattribute Mahdi's source
commits. Joseph/Claude implements or meaningfully adapts and verifies Joseph's
assigned work in his own session, preserving actual provenance.

## Status meanings

- PLANNED: no completed implementation bundle.
- IMPLEMENTING: changes exist locally; required checks are not all complete.
- STAGED: exact source commits are pushed here with verification evidence.
- READY: owner has reviewed the immutable bundle and the final destination/base
  and its dependencies are known; it is safe to perform the recorded delivery.
- DELIVERED: actual destination commit/PR and acting account have been recorded.

Never infer READY or DELIVERED from STAGED. An agent must not mark personal
understanding, account identity, or a human review complete automatically.

## Queue

| Batch | Owner/session | Status | Staging source commits | Depends on | Final commit/PR |
| --- | --- | --- | --- | --- | --- |
| M01 | Mahdi / Codex | STAGED | 651f259, c54d2d9 | Setup | — |
| J01 | Joseph / Claude | PLANNED | — | M01 | — |
| M02 | Mahdi / Codex | PLANNED | — | M01 | — |
| J02 | Joseph / Claude | PLANNED | — | J01, M02 | — |
| M03 | Mahdi / Codex | PLANNED | — | M02 | — |
| J03 | Joseph / Claude | PLANNED | — | J02, M03 | — |
| M04 | Mahdi / Codex | PLANNED | — | J03 | — |
| M05 | Mahdi / Codex | PLANNED | — | M04 | — |
| M06 | Mahdi / Codex | PLANNED | — | M05 | — |
| J04 | Joseph / Claude | PLANNED | — | M06 | — |
| J05 | Joseph / Claude | PLANNED | — | J04 | — |
| M07 | Mahdi / Codex | PLANNED | — | J05 | — |
| M08 | Mahdi / Codex | PLANNED | — | M07 | — |
| J06 | Joseph / Claude | PLANNED | — | M08 | — |
| J07 | Joseph / Claude | PLANNED | — | J06 | — |
| M09 | Mahdi / Codex | PLANNED | — | J07 | — |
| J08 | Joseph / Claude | PLANNED | — | M09 | — |

## Required record for each staged bundle

Create docs/delivery/batches/BATCH.md containing: owner, actual source author,
source branch, exact ordered immutable commit SHAs, parent/base SHA, file changes,
dependency bundles, request/data contracts, commands and observed outcomes,
known limitations, and the owner-side review/adaptation state. After real final
delivery, append the verified destination repository, commit/PR, and acting user.

Use commit-sized bundles rather than copying arbitrary files: schema migrations,
types, tests, and dependent implementation must stay together. Do not include
secrets, local data, build output, or unrelated owner packages.

## Later one-command handoff

Mahdi says: "Deliver my next READY batch. Read docs/delivery/PUSH-MAP.md."

Joseph says to Claude: "Deliver my next READY Joseph batch. Read CLAUDE.md,
docs/team/JOSEPH-CLAUDE-HANDOFF.md, and docs/delivery/PUSH-MAP.md."

The receiving agent verifies its actor, reads the exact bundle, checks that all
destination dependencies exist, runs the recorded checks, preserves real source
authorship, and records the result. If the final repo is unset, nothing is READY,
or its baseline conflicts, report that fact instead of guessing or overwriting.

The first final-repository setup must establish its clean base and delivery
method. A compatible cherry-pick with provenance can preserve source authors;
an independent implementation/adaptation is committed by its actual author.
Never rewrite dates/authors or add empty contribution commits to alter appearances.

## Owner scopes

The full per-batch file scopes, suggested commit slices, and handoffs are in
docs/superpowers/plans/2026-10-26-team-contributions.md. That split is unchanged.
Staging may be pushed whenever useful; final-history delivery is a separate step.
