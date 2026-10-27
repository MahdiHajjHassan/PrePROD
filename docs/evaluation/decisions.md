# Execution decisions and current limits

The original technical scope remains one shared task board, 14 core +2 buffer.
The owner's latest request changed execution ownership, not product scope.

- All packages are now implemented in staging by Mahdi/Codex for reuse by Claude.
  Original J/M labels organize delivery. Wrong attribution would misrepresent
  contribution history, so source authors are preserved and personal work is not
  claimed before it happens.
- The separate final history repository is called Final Trans Repo by the owner;
  its exact remote is not verified here. No push to it is authorized, including
  the earlier three batches. Only Transcendence2 receives staging checkpoints.
- The existing isolated linked worktree is retained as the active local Compose
  context, including ignored private environment and mounted proxy configuration.
  Removing it during deployment would break restart/configuration paths.
- Skill helper scripts are remote resources rather than local executables. The
  equivalent named-plan ledger, brief and review artifacts live under ignored
  .superpowers/sdd/2026-10-26-taskboard. Source commits and published evidence
  remain authoritative; incorrect helper formatting would affect bookkeeping.
- One frontend worker used disjoint UI files while the controller implemented
  backend/integration. Workers did not mutate Git/Docker. A fresh final reviewer
  checks the combined change; overlap risk is controlled by explicit file scopes.
- Core service tests preceded buffer hooks. Buffer services were integrated before
  the final browser gate because the full UI uses them; no module proof is relaxed.
- The API actor must remain MEMBER. Promoting it disables its key rather than
  turning it into an administrator credential. Restore MEMBER to re-enable it.
- Account operations remain in AuthService; administrative operations are in
  UserService. The shared HTTP/account contract is unchanged.
- Container startup force-recreates to reload mounted Caddy configuration and
  retains data/cert volumes. The cost is a local restart when nothing changed.
- robots/sitemap run at request time because private runtime environment values
  are intentionally unavailable to builds. No build credential was introduced.
- Route-level task loading was removed after a JS-disabled browser proved the
  streamed HTML stayed hidden. Mutation pending states remain; the tradeoff is
  waiting for the complete public SSR response before showing task content.
- The host is non-root. Actual official Chrome/Edge packages are locally extracted
  and Firefox is installed in user space. These are real products, not substituted
  Chromium. Config supports explicit executable paths for this environment.
- Browser automation explicitly permits the local CA, while setup and HTTPS
  scripts verify the real CA chain/hostname independently. Human trusted-browser
  setup is documented and is never claimed from an automated bypass.
- Managed Docker VFS duplicated layers until disk was full. Only unused builder
  cache/known superseded app images and idle test containers were reclaimed;
  normal database/certificate volumes were preserved. This costs rebuild time.
- Query/export ownership boundaries were replaced by the owner's full-staging
  request. Full query functionality is implemented once and reused by SSR/API/
  export; no consumer has to recreate it.
- Hosting and public certificates are outside the one-computer local scope.
  The consequence is a separate deployment task if public hosting is later wanted.

## Previously reviewed nonblocking limitations

M01: getDb caches a failed first initialization; repair the initial filesystem
configuration and restart. M02: logout accepts unused fields in bounded valid
JSON, while its client sends {}. M03: exceptional temporary-task cleanup failure
in smoke-tasks can skip its subsequent logout; the observed successful path
cleans up and logs out. These are recorded in their immutable batch manifests.

The final independent review and any accepted/fixed findings are appended to
the evidence record. Human counterpart review, personal understanding and final
history delivery are separate fields, never automatically marked complete.
