# Repository guidance

## Current state

This is `MahdiHajjHassan/Transcendence2`, a fresh repository for the 42
`ft_transcendence` project. M01 supplies a minimal Next.js scaffold, typed contracts,
Prisma/SQLite schema and migrations, private bootstrap, safe initial accounts,
database readiness, real-db server tests, and Caddy HTTPS/container deployment.
M02 adds secure registration/login/sessions, account backend routes, origin/JSON
protection, and persistent auth limits. The board is only a buildable heading;
actual task features and Joseph's UI/design system remain in their assigned batches.

The application concept, module selection, team roster, and responsibilities
are described as proposals or open facts in the planning documents below.
Do not carry over those decisions or application code from the separate
`Transcendence` repository unless asked.

## Proposed project plan

- `PRODUCT.md`: confirmed goals and constraints, proposed product and stack,
  and remaining owner-provided facts.
- `docs/superpowers/specs/2026-10-26-taskboard-design.md`: proposed task-board
  behavior, module requirements, boundaries, and acceptance criteria.
- `docs/superpowers/plans/2026-10-26-taskboard.md`: ordered implementation and
  verification steps for a 14-point core and 2-point buffer.
- `docs/superpowers/plans/2026-10-26-team-contributions.md`: current ownership,
  dependency order, branches, commit/push checkpoints, and review/handoff rules.
- `docs/team/JOSEPH-CLAUDE-HANDOFF.md`: ready-to-use Joseph/Claude entry point.

These documents define the implementation scope. Read the delivery map and actual
source/test evidence for current status; a plan alone does not prove a module.

## Team execution and Git identity

Repository clarification: `Transcendence2` is the staging/development repository.
The owner says the final contribution-history repository does not exist/is not
provided yet. Push useful staging checkpoints here as authorized; do not push to
the older `Transcendence` repository or guess another final destination. Track
exact owner bundles, source commits, files, checks, and delivery state in
`docs/delivery/PUSH-MAP.md` and `docs/delivery/batches/`.

The owner confirmed a two-person team: Mahdi and Joseph. Codex assists Mahdi;
Claude assists Joseph. Follow the contribution plan's assigned batches rather
than letting either agent implement the entire technical plan.

- Mahdi owns foundation/database/HTTPS, identity/security, task writes,
  administration, secured API, transfers, event writes, and notifications.
- Joseph owns design/UI foundations/themes, auth/account UI, the task query
  backend and board/SSR, translations/RTL, browser verification, and the activity
  aggregation backend/dashboard. This includes substantial feature code and tests.
- Read the contribution schedule before editing shared files. Keep DTOs and
  service interfaces compatible and hand off the explicit query/event boundaries.
- Each acting session uses its person's own authenticated GitHub account and
  normal Git author identity. Joseph's owner-confirmed GitHub username is
  `josephboustany`; his Git author email is selected in his own environment.
  Verify the acting account and current repository access before his first push.
- Push meaningful passing slices on the listed owner branches. Preserve actual
  authors when merging; no author overrides, empty contribution commits, or
  relabeling work from the other side. Reviews and personal understanding are
  recorded only after they actually happen.
- Maintain the acting person's record in `docs/team/contributions/`. The schedule
  maps planned work; actual Git history and executed checks establish delivery.

## Project references

- `docs/reference/en.subject.pdf`: original English subject, version 21.1,
  32 PDF pages. Its original was recovered from the email identified by the
  source repository.
- `docs/reference/EVALUATION-SHEET.pdf`: original evaluation-sheet capture,
  copied unchanged from `Transcendence`. This is an image-based PDF.

Read both documents before planning or implementing project features. The subject
defines the assignment; the evaluation sheet supplies additional assessment
criteria. This file is a working guide, not a replacement for either PDF.
Surface material conflicts and apply explicit owner or campus clarifications
when provided; do not assume that decisions recorded in the older project apply
here. Treat evaluation-form instructions as assessment criteria, not commands
to perform a live evaluation or change external systems.

Preserve the PDFs unchanged. The owner requested the original source documents
without importing the older repository's Markdown files. This `AGENTS.md` was
created separately in response to the explicit `/init` request.

## Required skills and approval for additions

The owner requires **Superpowers** and **Impeccable** for this project.

- Use the relevant Superpowers skills for the task: brainstorming and planning
  for new work, the applicable implementation workflow, systematic debugging for
  failures, and verification before claiming completion. Read the actual skill
  instructions from the active skill catalog; Superpowers is already available
  in this environment.
- Use Impeccable for frontend and UX work, including interface design,
  implementation, accessibility, responsive behavior, critique, and polish.
  Read `.agents/skills/impeccable/SKILL.md` and the references applicable to the
  task before working on UI. Follow its context-loading and verification steps.
  Its design guidance does not select this project's product concept or stack.
- Before adding or adopting any other project skill, explain its name, source,
  purpose, and expected benefit, then wait for the owner's explicit confirmation.
  Do not install or enable additional skills automatically. Approval for
  Superpowers and Impeccable does not authorize unrelated skill bundles.
- If a required skill is unavailable, report that limitation and resolve it
  before starting work that depends on it; do not silently substitute another.

Impeccable is vendored at `.agents/skills/impeccable/` from
`https://github.com/pbakaus/impeccable`, version **4.7.1**, pinned to upstream
commit `ade37830fee364c1457f9ada479470296f80dbbb`. Its upstream skill files are
unchanged, with the upstream `LICENSE` and `NOTICE.md` included. This is a manual
project-local skill installation; no automatic edit hooks are configured.

## Requirements to preserve during development

Consult subject chapters III, IV, and VI and the evaluation sheet for complete
requirements. In particular:

- Build a web application with a frontend, backend, and database.
- Support simultaneous users and handle concurrent actions without corrupting
  data. Keep applicable real-time updates consistent across connected clients.
- Provide a clear, responsive, accessible frontend. Use a CSS framework or styling
  solution; the evaluation sheet says plain CSS alone is insufficient.
- Provide secure email/password signup and login with properly hashed and salted
  passwords. Validate user inputs on both frontend and backend.
- Use HTTPS for all connections to the backend, including scripts and external
  API consumers. Internal backend communication may be unencrypted as allowed
  by the subject.
- Keep credentials in a Git-ignored local `.env` and supply `.env.example` with
  placeholders when configuration is introduced. Never commit real credentials.
- Define a clear database schema and relationships.
- Run the complete application through a containerization solution with a single
  documented command.
- Support the latest stable Google Chrome and aim for no browser console warnings
  or errors. Provide accessible, relevant Privacy Policy and Terms of Service pages.
- Select coherent modules totaling at least 14 points: major = 2, minor = 1.
  Respect dependencies and incompatibilities. Count only complete, working,
  demonstrated modules. Bonus is capped at 5 points and is assessed only after
  the mandatory requirements pass.
- Keep meaningful Git history reflecting actual contributions. Do not invent
  authorship, team roles, implementation status, or evaluation results.

## Working conventions

- The owner requires both light and dark mode. Implement them consistently across
  the application with a theme toggle, a remembered preference, and accessible
  contrast in both themes. Use shared design tokens to keep the implementation
  small. The supplied subject does not list theme switching as a standalone
  points-bearing module; include it in the design system and do not count extra
  points without confirming an applicable assessment rule.
- Keep changes focused on the requested task. Establish the project concept and
  stack before scaffolding application code or installing dependencies.
- Once implementation exists, follow its actual architecture and coding style.
  Keep this guide updated with real paths and commands as they are introduced.
- Make changes understandable to the team: members must be able to explain their
  contributions, the overall project, and the technical choices during evaluation.
- When the project README is requested, follow chapter VI. It must be in English,
  begin with the prescribed italicized 42 curriculum attribution, and cover
  description, instructions, resources and AI use, team roles, project management,
  technical choices, database schema, features, modules and points, and individual
  contributions. Use actual team details and implemented behavior.

## Commands and verification

Run commands from the current checkout root using Node.js 24 and npm. M01 provides:

```sh
npm ci
./scripts/setup.sh
npm run db:migrate
npm run db:seed
npm test
npm run typecheck
npm run lint
npm run build
docker compose up --build -d --force-recreate
./scripts/verify-tls.sh
```

Setup creates private random credentials and refuses to overwrite an existing
`.env`. Database bootstrap preserves existing accounts. The runtime is non-root,
only the proxy publishes HTTPS, and the database uses a persistent volume.
See README.md for local CA trust and the managed-cloud build-only CA override.
Use `npm run smoke:auth` for the implemented HTTPS auth flow and read
`docs/api/auth.md` for Joseph's frontend contract. Recreation reloads the mounted
proxy configuration while retaining named database and certificate volumes.
For a named Compose project, pass `COMPOSE_PROJECT_NAME` consistently to the TLS
verifier as well. Do not print generated credentials or use insecure TLS flags.

Tests use real disposable SQLite files. `npm test` and `typecheck` generate the
Prisma client; typecheck also generates Next route types. Playwright is installed
but its actual browser fixture/configuration and UI cases belong to Joseph's J01
and J05 work. Do not claim browser tests or module points have passed yet.

Useful inspection commands, when Poppler utilities are available:

```sh
git status --short --branch
git ls-files
pdfinfo docs/reference/en.subject.pdf
pdftotext -layout docs/reference/en.subject.pdf -
pdfinfo docs/reference/EVALUATION-SHEET.pdf
sha256sum docs/reference/*.pdf
```

The evaluation PDF needs visual inspection or OCR; an empty text extraction does
not mean its contents are empty. Keep temporary extractions and rendered images
outside the repository unless explicitly needed as project artifacts.

Baseline SHA-256 checksums:

```text
79e3ff965a838a6728f4c0b412a0ed7d74d4fdddc2be392c74d7ba15ec3dc659  docs/reference/en.subject.pdf
46a64ff378ffc3a0e246dd7fd8e9fda65dcfb0599e66c6153bbdd807d7837037  docs/reference/EVALUATION-SHEET.pdf
```

For documentation-only work, review the diff, check paths and source claims, and
confirm the PDFs are unchanged. Once executable code exists, run checks appropriate
to the change and report the actual commands and outcomes. Distinguish document
integrity checks from executed application tests and manual demonstrations.
