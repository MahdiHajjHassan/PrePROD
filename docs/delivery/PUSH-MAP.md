# Staging Source and Final Delivery Map

Transcendence2 is the staging repository. The owner requested every planned
package completed here so Claude can reuse the source without redevelopment.
The separate final history repository is called **Final Trans Repo**; its exact
remote/base is unverified. **NO FINAL-REPOSITORY PUSH IS AUTHORIZED**, including
M01–M03. Only MahdiHajjHassan/Transcendence2 staging may receive pushes.

All current implementation source is Mahdi/Codex-authored. Original M/J ownership
labels below identify requested handoff tracks, not invented authorship. Joseph's
real review/adaptation/understanding/pushes are recorded only when they happen.
An unchanged source commit keeps its author regardless of who later pushes it.

## Current source

Application source tip: cc05a2c0b27c456f37ed253a8aed677389e4f881.
Branch: staging/complete-taskboard, integrated into staging main only after checks.
Every planned implementation bundle is staged. Full verification passed103
server tests and33 actual-browser scenarios; a fresh clone additionally passed
installation/bootstrap/checks/build and11 Chrome flows. Read
[verification evidence](../evaluation/evidence.md), [review resolutions](../evaluation/review.md),
and the [machine manifest](STAGING-MANIFEST.json) for exact immutable sources.

## Queue

| Batch | Requested delivery track | State | Application source commits |
| --- | --- | --- | --- |
| [M00](batches/M00.md) | Mahdi | STAGED | bd7ba87, 4e5c9fc, 0959e97, 2a6a96b |
| [M01](batches/M01.md) | Mahdi | STAGED | 651f259, c54d2d9, cc05a2c |
| [J01](batches/J01.md) | Joseph | STAGED | 9b19355, 6cad511, 8cecd5b |
| [M02](batches/M02.md) | Mahdi | STAGED | bb803d4 |
| [J02](batches/J02.md) | Joseph | STAGED | bbae134, efc86be |
| [M03](batches/M03.md) | Mahdi | STAGED | f183029, efc86be |
| [J03](batches/J03.md) | Joseph | STAGED | 6688b58, d33bb0c, 8cecd5b, efc86be |
| [M04](batches/M04.md) | Mahdi | STAGED | 27c5b43, 048db79, efc86be |
| [M05](batches/M05.md) | Mahdi | STAGED | 791a858, 3e807f7, efc86be |
| [M06](batches/M06.md) | Mahdi | STAGED | 3967cec, 3a035a2, efc86be |
| [J04](batches/J04.md) | Joseph | STAGED | 9b19355 |
| [J05](batches/J05.md) | Joseph | STAGED | 60fb320, 4f553df, efc86be, 8a54f85 |
| [M07](batches/M07.md) | Mahdi | STAGED | 4f553df, efc86be |
| [M08](batches/M08.md) | Mahdi | STAGED | 3bdd1d3, a483127, efc86be |
| [J06](batches/J06.md) | Joseph | STAGED | 3bdd1d3, a483127 |
| [J07](batches/J07.md) | Joseph | STAGED | 8cecd5b, efc86be |
| [M09](batches/M09.md) | Mahdi | STAGED | 4f553df, efc86be, cc05a2c |
| [J08](batches/J08.md) | Joseph | STAGED | 4f553df, efc86be, cc05a2c |

## Safe reuse and delivery

1. Fetch the tested staging source. Read the exact per-batch manifest and machine
   globalSourceOrder; full commit/file lists include schema, shared types, tests
   and service composition. Some commits serve several labels and apply once.
2. Use the whole dependency prefix, not arbitrary file copying. Actual code order
   supersedes the old owner chronology: complete backend services precede the
   shared UI and feature interfaces. Clone and verify; do not recreate features.
3. Source authors are preserved. A person's actual later review/adaptation and
   authenticated delivery are separate records; no author overrides, empty
   contribution commits, changed dates or invented verified signatures.
4. No final operation occurs until the owner explicitly authorizes it and the
   exact destination/base/dependencies and acting account are checked. The older
   Transcendence repository is not automatically a destination.
5. Record actual destination SHA/PR and account after a real authorized delivery.
   Staging pushes never imply final delivery or personal understanding.

## State meanings

- IMPLEMENTING: code exists; the full required verification/publication gate is
  not recorded complete yet.
- STAGED: exact source is pushed to Transcendence2 with observed verification.
- READY: final destination/base/dependencies and actual owner review are known,
  and final delivery has been explicitly authorized.
- DELIVERED: actual authorized destination commit/PR/account is recorded.

Nothing is READY or DELIVERED to the final history repository now. All final
commit/PR fields are empty. Later say “prepare my next authorized delivery from
the manifest”; the receiving agent verifies the concrete bundle before writing.

## Team entry points

Mahdi: MahdiHajjHassan /42 mahajj-h. Joseph's supplied GitHub profile shows
josephboustany /42 jboustan. Reverify his actual connected account and repository
permission before a Joseph-side push; an earlier read-only staging check returned
permission none. No invitation/access mutation was sent.

Read [Claude handoff](../team/JOSEPH-CLAUDE-HANDOFF.md), current AGENTS.md and
[decisions/limits](../evaluation/decisions.md). Human walkthrough/counterpart review
and Joseph's actual contributions remain explicit, independent fields.
