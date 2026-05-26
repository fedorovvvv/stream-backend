# CLAUDE.md — stream-backend

<!-- Sections marked {{IF_*}} ... {{/IF_*}} are filled or removed by /bootstrap
     based on project stack detection. Single-line {{VAR}} placeholders are
     filled directly. Edit freely after generation.

     Structure follows U-curve attention: primacy zone (red lines, project,
     session start) in lines 1-80, reference zone (rules, tables) in 80-280,
     recency zone (smoke test, non-goals) in 280-400. Keep total ≤400 lines.
     See plugins/fpl-skills/skills/bootstrap/resources/guides/CLAUDE-MD-GUIDE.ru.md
     for the full rationale. -->

<!-- /fpl-init: could not detect — fill manually -->
<One or two sentences: what this project is and what problem it solves. NestJS backend for the "teastream" service (Apollo GraphQL + Prisma + Redis sessions + mail).>

Language: code/identifiers/commits in **English** (Conventional Commits).
Russian acceptable in commit body and this file when it adds clarity.

---

## 🔴 Red lines

<!-- Cap at 7. Each line is an irreversible operation that needs explicit
     "yes" in the current session. Don't dilute with non-critical rules. -->

- **Destructive git** (`push --force`, `reset --hard`, branch/tag deletion, `rebase -i` on shared history) — only after explicit confirmation in the current session.
- **No secrets in git** — `.env`, tokens, API keys, certificates. Run `git status` before `git add` and confirm no sensitive files staged. Specifically: `.forgeplan/config.yaml` is tracked but must use `api_key_env: VAR_NAME`, never literal `api_key: "sk-..."`. If a literal key landed in any commit: rewrite, **revoke the leaked key**, force-push only the fix commit (with confirmation).
- **No bypass of branch protection** — `main` (and `dev` if used) merges only via PR. No direct push.
- **No `forgeplan` artifact direct edits** — `.forgeplan/{prds,rfcs,adrs,specs,epics,evidence,problems,solutions,refresh,notes,memory}/*.md` and `.forgeplan/state/*.yaml` are managed by the CLI/MCP only. Direct `Edit`/`Write`/`sed` desyncs the LanceDB index, the state machine, and the canonical body. Use `forgeplan update`/`new`/`link`/`activate`/`deprecate` (or `mcp__forgeplan__forgeplan_*` MCP tools). Recovery: `forgeplan_update id=<ID> body=<full new body>` (idempotent) or `forgeplan scan-import` rebuilds LanceDB from markdown. Direct edit is OK only for non-forgeplan markdown (READMEs, this CLAUDE.md, src code).
- **No long/expensive operations** (deploy, DB migrations, mass network/LLM calls, package publish) without explicit confirmation. Specifically: `prisma migrate deploy`, `prisma db push --accept-data-loss`, anything touching the production Postgres.
- **No rewriting other people's history** — if `git log` shows commits not yours in a range, no `rebase`/`amend`/`reset` over it.

---

## What this project is

- **Type**: NestJS backend service (HTTP + GraphQL).
- **Stack**: TypeScript · yarn · jest.
- **Runtime**: Node.js ≥ 20 (NestJS 11 requirement).
- **Status**: <!-- /fpl-init: could not detect — fill manually -->
  draft / alpha / beta / GA — current state and what's next.

For deeper architecture context see `docs/` and `.forgeplan/adrs/` (auto-loaded relevant ADRs through `@imports` below).

---

## Session start

Run in parallel at the start of a session — three sources of truth, never one:

```bash
forgeplan health                       # active artifacts, blind spots, stubs
git status && git log --oneline -5     # local state and recent direction
ls .forgeplan/adrs/                    # decisions in force
```

**Don't read at start** (open only when relevant):
- Lockfiles (yarn.lock) — only during dependency debugging.
- Generated artifacts (`dist/`, `prisma/generated/`).
- Full `CHANGELOG` / git history beyond the last 10–15 commits.
- `guides/*.md` — open by topic, not "just in case".

**Re-warm triggers** (mid-session top-ups):
- Switching to a new module under `src/modules/` → read its module file + nearby README.
- Touching the Prisma schema → re-read `prisma/schema.prisma` + latest migration in `prisma/migrations/`.
- Touching release/CI flow → read `.github/workflows/` and any `guides/GIT-FLOW*.md`.
- Touching forgeplan artifacts → read the latest `forgeplan get <ID>` output, not the file.

**Sufficiency criterion**: you can name (a) the active feature/PRD in flight, (b) the build/test command for the area you're touching, (c) the most recent ADR that applies. If you can't — re-warm before acting.

`MEMORY.md` is auto-loaded every turn — no explicit `memory_recall` needed for the index. Call `memory_recall` only for records beyond what's already in scope.

---

## Forgeplan — single source of truth for decisions

`.forgeplan/` holds artifacts (PRD/RFC/ADR/Spec/Evidence/Note) with lifecycle (`draft → active → superseded/deprecated/stale`) and R_eff scoring. CLI: `forgeplan`. MCP: declared in `.mcp.json`.

```
OBSERVE → ROUTE → SHAPE → BUILD → PROVE → SHIP
```

| Phase | Action | Command |
|---|---|---|
| Observe | restore context, find blind spots | `forgeplan health` |
| Route | decide depth | `forgeplan route "<task>"` |
| Shape | create + validate artifacts | `forgeplan new <kind> "<title>"`; `forgeplan validate <id>` |
| Reason | ADI hypotheses (Standard+, mandatory Deep+) | `forgeplan reason <id>` |
| Build | code + tests | (per stack — see below) |
| Prove | evidence + R_eff | `forgeplan new evidence "<desc>"`; `forgeplan link`; `forgeplan score` |
| Ship | activate + PR + merge | `forgeplan activate <id>`; `gh pr create` |

**Depth**: Tactical (no artifact) / Standard (PRD+RFC) / Deep (PRD+Spec+RFC+ADR) / Critical (Epic + adversarial review).

**Hint protocol** — every `forgeplan` output ends with one marker. Execute verbatim, don't paraphrase:

| Marker | Meaning |
|---|---|
| `Next: <command>` | Run as-is for the next step. |
| `Or: <command>` | Use only if `Next:` blocks. |
| `Wait: <condition>` | Retry after condition holds. |
| `Done.` | Step complete; move on. |
| `Fix: <command>` | Error remediation, paired with `Error:`. |

JSON consumers read `_next_action`. List/tree `--json` puts the hint on stderr (bare array on stdout for jq compat).

**R_eff math**: `R_eff = min(evidence_scores)` — weakest link, **never** average. Each evidence gets `verdict_score - CL_penalty`, where Congruence Level (CL3 same-context = 0.0; CL2 related = 0.1; CL1 external = 0.4; CL0 opposed = 0.9). Active artifact with no evidence linked → R_eff = 0.0 by definition.

### Routing — depth decision

| Complexity | Depth | Artifacts | ADI required |
|---|---|---|:---:|
| Trivial, reversible within a day | Tactical | nothing or Note | — |
| Feature 1–3 days, has a choice | Standard | PRD → RFC | recommended |
| Irreversible, 1–2 weeks | Deep | PRD → Spec → RFC → ADR | **yes** |
| Cross-team, strategy | Critical | Epic → PRD[] → Spec[] → RFC[] → ADR[] | **yes + adversarial review** |

Pipeline is a guideline, not bureaucracy — don't create all 5 artifact kinds for every task. The "5 questions" filter:

| Question | Artifact | Skip if |
|---|---|---|
| WHAT and why? | PRD / Brief | bug-fix, refactor |
| HOW EXACTLY does it work? | Spec | no API / data model changes |
| HOW DO WE BUILD IT? | RFC | architecture is obvious, < 1 day |
| WHY exactly this? | ADR | decision is trivial and reversible |
| GROUPING? | Epic | task is a single PRD |

### Artifact IDs (slug + assigned number)

Two-layer identity. **slug** (`prd-auth-system`) is canonical, immutable, written by `forgeplan new`. **Display number** (`PRD-074`) is assigned by CI on merge to the default branch. Until then the artifact shows as `PRD-74?` (the `?` marker = "predicted, not final").

Three rules for commits and refs:

1. **Before merge — slug only in `Refs:`**. Predicted/displayed numbers must not appear in commit messages.
   - ✅ `Refs: prd-auth-system, FR-001..003`
   - ❌ `Refs: PRD-74?, FR-001..003`
   - ❌ `Refs: PRD-074, FR-001..003` (broken pointer — number isn't assigned yet)
2. **After merge — both formats work**: `Refs: PRD-074` or `Refs: prd-auth-system`. The resolver maps both to the same artifact.
3. **`assigned_number` is write-once**, set only by the CI bot. Manual edits to `assigned_number` in frontmatter violate the contract — the same red-line as direct artifact edits.

`forgeplan new` warns if a slug already exists in the default branch and proposes an alt-slug.

### EvidencePack — structured fields (mandatory for R_eff)

Without these fields the parser sets CL0 (penalty 0.9) and score = 0:

```markdown
## Structured Fields

verdict: supports            # supports / weakens / refutes
congruence_level: 3          # CL3 = same context (best) … CL0 = opposed (worst)
evidence_type: measurement   # measurement / test / benchmark / audit
```

### Lifecycle commands

```bash
forgeplan review <id>                   # pre-activation readiness check
forgeplan activate <id>                 # draft → active (validation gate)
forgeplan supersede <id> --by <new-id>  # active → superseded (terminal)
forgeplan deprecate <id> --reason "..." # → deprecated (terminal)
forgeplan renew <id> --reason --until   # stale → active (extend valid_until)
forgeplan reopen <id> --reason          # stale/active → deprecated + new draft
```

State machine: `draft → active → {superseded | deprecated | stale}`; `stale → {active via renew | deprecated + new draft via reopen}`. `superseded` and `deprecated` are terminal.

### Standard flow (Standard depth, end-to-end)

```bash
forgeplan health                                   # observe
forgeplan route "implement <feature description>"  # decide depth
forgeplan new prd "<title>"                        # shape
$EDITOR .forgeplan/prds/PRD-NNN-*.md               # fill MUST sections
forgeplan validate PRD-NNN                         # 0 MUST errors
forgeplan reason PRD-NNN                           # ADI (Standard+)
# ...write code + tests...
forgeplan new evidence "PRD-NNN: <verification>"
$EDITOR .forgeplan/evidence/EVID-MMM-*.md          # fill ## Structured Fields!
forgeplan link EVID-MMM PRD-NNN --relation informs
forgeplan score PRD-NNN                            # R_eff > 0?
forgeplan activate PRD-NNN                         # draft → active
gh pr create --base main                           # PR body: "Refs: prd-<slug>"
```

### Multi-agent (`dispatch → claim → release`)

When 2–5 sub-agents work in the same workspace:

```bash
forgeplan dispatch --agents N --json   # planner: conflict-free buckets
forgeplan claim <id> --agent <name> --ttl-minutes 30
# ...work...
forgeplan release <id>
forgeplan claims                       # who's holding what right now
```

`dispatch` returns a plan; the **main thread / orchestrator** spawns workers via `Agent({subagent_type, prompt})` (multiple `Agent` blocks in one message run in parallel). `SendMessage` is **not** a spawner — it only addresses already-running processes.

### Validator section aliases

The validator accepts these synonyms when checking MUST sections:

- `## Problem` = `## Motivation` = `## Problem Statement` = `## Background`
- `## Goals` = `## Success Criteria` = `## Objectives`
- `## Non-Goals` = `## Out of Scope` = `## Product Scope`
- `## Related` = `## Related Artifacts` = `## Dependencies`
- `## Target Users` = `## Target Audience` = `## Users`

---

## Permission zones (Forge Mode)

| Zone | What | Mode | Examples |
|---|---|---|---|
| 🟢 Green | read-only, build, test, `forgeplan` | auto-allow | `yarn test`, `forgeplan health`, `git status` |
| 🟡 Yellow | files, `git add`/`commit` | acceptEdits | `Write`, `Edit`, `git commit` |
| 🔴 Red | irreversible | **block via hook** | `git push --force`, `rm -rf /`, `prisma migrate deploy`, `DROP TABLE` |

Wire a `.claude/hooks/safety-hook.sh` that returns exit code 2 on 🔴 patterns. Whitelist exceptions in `.claude/settings.local.json`. `/fpl-init` offers to add a default safety hook on bootstrap.

---

## Agent teams (when to delegate)

Spawn sub-agents instead of doing the work in the main thread when:

- **Independent investigations**: research, code search, log analysis. Multiple `Agent` calls in one message run in parallel.
- **Wave-based execution** (`/sprint`): each wave's tasks are claimed by separate agents with `addBlockedBy` declaring inter-wave deps.
- **Adversarial review** (`/audit`): minimum 4 reviewers (logic, architecture, types, security) — must find issues, 0 findings = re-review.
- **Long-running work** with checkpoints — `/do` (interactive) or `/autorun` (overnight).

Agent packs ship subagent types ready to use:

| Pack | What it gives |
|---|---|
| `agents-core` | 11 baseline subagents — debugger, code-reviewer, planner, tester, researcher… |
| `agents-domain` | 11 stack specialists — typescript-pro, golang-pro, nextjs, fullstack… |
| `agents-pro` | 21 expert agents — security, architecture, prompt engineering, ML… |
| `agents-github` | 7 GitHub agents — PR/issue/release/workflow management |
| `agents-sparc` | 5 SPARC-methodology agents — Specification → Pseudocode → Architecture → Refinement → Completion |

Install only the packs you actually use. `/audit`, `/sprint`, `/research` will pick up whichever packs are present.

---

## fpl-skills — workflow commands

| Command | Use case |
|---|---|
| `/restore` | Start of a new session — recover context from git + memory. |
| `/briefing` | Daily — open tasks, mentions, today's focus from your tracker. |
| `/research <topic>` | Unfamiliar area, gap analysis, "what do we already have on X". |
| `/refine <plan>` | Plan is rough — sharpen terminology, surface contradictions, lazy-create CONTEXT.md/ADRs. |
| `/rfc create` | Formalise a refined plan into a structured RFC. |
| `/sprint <feature>` | Multi-wave implementation with strict file ownership. |
| `/audit` | Multi-expert review (≥4 reviewers — logic, architecture, types, security). |
| `/diagnose <bug>` | Hard / non-deterministic / performance bug — 6-phase debug loop. |
| `/autorun <task>` | Overnight or unattended runs (no approval pauses). |
| `/do <task>` | Interactive variant of /autorun (pauses at checkpoints). |
| `/setup` | (Re-)run the docs/agents/ wizard when project structure changes. |

`/fpl-init` already ran on this project — that's why you're seeing this CLAUDE.md.

---

## Project context (auto-loaded)

@docs/agents/issue-tracker.md
@docs/agents/build-config.md
@docs/agents/paths.md
@docs/agents/domain.md
@CONTEXT.md

These files are written by `/setup`. Edit them when project structure changes — fpl-skills picks up the changes automatically.

---

## Build & test

```bash
yarn install            # install
yarn build              # build (nest build → dist/)
yarn test               # unit tests (jest)
yarn test:e2e           # e2e tests (jest --config test/jest-e2e.json)
yarn lint:check         # lint (read-only); yarn lint to auto-fix
yarn format:check       # prettier (read-only); yarn format to auto-fix
yarn db:seed            # Prisma seed (loads .env via dotenv/config)
```

Run the **full** check (build + test + lint) before commit, not the happy path only.

---

## Git workflow

- **Branches**: `feat/*` / `fix/*` / `chore/*` / `docs/*` → `dev` (or default branch) → `main`. No direct commits to `main`.
- **Commits** — Conventional Commits (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`). Body in imperative present tense, _why_ over _what_. Reference artifact IDs: `Refs: PRD-NNN, ADR-NNN`.
- **PR titles**: include artifact ID where applicable: `feat(scope): add OAuth2 (PRD-042)`.
- **Merge strategy**: merge commit (preserves history). Squash only when explicitly requested for noisy WIP branches.
- **No `git add .` / `git add -A`** — stage specific files. Prevents accidentally committing `.env`, lockfile changes, or stray editor files.
- **Sync after release**: when `release/v* → main` merges, open `chore/sync-main-to-dev` to keep `dev` current.

---

## Code conventions

- **Naming**: files `kebab-case`, identifiers `camelCase`, types/classes `PascalCase`.
- **Comments**: only where _why_ isn't obvious from the code. Don't restate _what_ — well-named identifiers do that. No comments on tasks/PRs ("added for #123") — that belongs in the commit message. **Project override**: always leave `TODO(...)`/`FIXME(...)` markers for cut corners, mocks, suppressed errors, deferred edge cases.
- **Tests**: every public function gets at least a happy-path test plus the edge cases that matter for callers.
- **Errors**: validate at boundaries (user input, external APIs, NestJS controllers/resolvers). Trust internal code — don't add defensive checks for impossible states. Use `class-validator` decorators on DTOs.
- **No premature abstraction**: three similar lines beat a wrong abstraction. Wait until you have three real call sites before extracting.

### TypeScript

- Strict mode partial (`strictNullChecks: true`, `noImplicitAny: false` per current `tsconfig.json` — be explicit about types anyway).
- No `any` — use `unknown` + narrowing. If `any` is unavoidable, comment why.
- No `as` casts unless verified at a system boundary.
- `!` non-null assertions only after a guard expression.
- ESM via `nodenext`: file extensions in relative imports may be required — follow the existing pattern in `src/`.

### NestJS / Prisma / GraphQL

- One module per bounded context under `src/modules/<name>/` (controller / resolver / service / dto / module).
- Cross-cutting concerns under `src/core/` (Prisma, mailer, redis, config). `src/shared/` for utilities reused by ≥2 modules.
- DTOs use `class-validator` + `class-transformer`. Apply `ValidationPipe` globally (already wired in `main.ts`).
- Prisma schema is the source of truth. Schema change → `prisma migrate dev --name <slug>` locally → commit the migration. **Never** edit a checked-in migration file after it has been applied to any shared environment.
- GraphQL: code-first via `@nestjs/graphql`. Resolvers return entities, not DTOs.
- Long-running work: `@nestjs/schedule` for cron, BullMQ (or similar) for queues if added — never block the request loop.

---

## AI-agent rules

> Rules for AI agents working on this codebase non-interactively (`/autorun`, hooks).

- Default to **non-destructive** operations. When unsure, list intended changes and ask once.
- For each red-line action above (`git push --force`, `forgeplan` artifact direct-edit, `prisma migrate deploy` etc.) — refuse and surface the rule.
- When `forgeplan health` reports stubs/orphans/duplicates — note them, don't auto-fix unless that's the explicit task.
- Match scope to request: a bug fix doesn't need surrounding cleanup; one-shot operations don't need helpers.
- Don't write feature flags, backwards-compat shims, or "for future use" abstractions unless asked.
- **Terminology precision**: don't sprinkle specialised terms ("hexagonal", "monadic", "idempotent", "bounded context") unless you can map the technical meaning to the current context. Buzzword-matching sounds smart but misleads. Name the pattern in plain words first; cross-reference the official term only if you're sure.
- **Forgeplan non-interactive hygiene**: always invoke `forgeplan init -y` (no interactive prompt). After every spawned `Agent({…})`, the orchestrator owns the writeback to `forgeplan` (claim/release, evidence linking) — sub-agents should not call `forgeplan activate` directly unless the orchestrator explicitly delegated it.
- **Auto-loaded files**: `MEMORY.md` is loaded every turn — don't waste tokens on `memory_recall` for facts already in the index. The auto-loaded `@docs/agents/*.md` imports below mean those files are also already in scope.

---

## Unified workflow (Forgeplan × Tracker × Memory)

Three systems, three concerns:

- **Forgeplan** = WHAT to do and WHY (artifacts, quality, evidence).
- **Tracker** (Orchestra / GitHub Issues / Linear / Jira / local TODO) = WHO does it and WHEN.
- **Memory** (Hindsight MCP / `MEMORY.md`) = context between sessions.

Synchronisation rules:

1. New artifact created → matching task in your tracker (if available).
2. `forgeplan activate <id>` → mark the tracker task Done.
3. PR merged → update tracker + retain non-obvious decisions in long-term memory (`memory_retain` for Hindsight, or append to `MEMORY.md`).
4. Tracker offline → record what to sync in `TODO.md` and reconcile later.

Task naming convention in the tracker: `[ARTIFACT-ID] description` when an artifact exists; plain description + tags otherwise.

---

## Smoke test (before PR)

1. `yarn build` — clean build, no warnings.
2. `yarn test` — all unit tests pass.
3. `yarn test:e2e` — e2e tests pass (when relevant to the change).
4. `yarn lint:check` — no lint errors.
5. `forgeplan health` — no new orphans/stubs/duplicates introduced.
6. `git status` — only intended files staged; no `.env`, no editor files, no lockfile drift, no `prisma/generated/`.
7. `git diff --stat origin/main..HEAD` — diff size matches the PR's scope claim.

If any step fails, fix it. Don't `--no-verify` the pre-commit hook.

---

## Storage layout

`.forgeplan/` mixes tracked artifacts (the source of truth) with derived /
runtime state. Get this right or risk leaking API keys / generating merge
conflicts on every PR. Full setup contract:
[`guides/FORGEPLAN-SETUP.md`](../bootstrap/resources/guides/FORGEPLAN-SETUP.md)
(in the plugin source — open via `Read` for the complete reference).

```
.forgeplan/                      ← managed by CLI/MCP, mostly tracked
├── prds/                        ← TRACKED — product requirements
├── rfcs/                        ← TRACKED — architecture proposals
├── adrs/                        ← TRACKED — decisions (with valid_until TTL)
├── specs/                       ← TRACKED — API / data-model contracts
├── epics/                       ← TRACKED — groupings of PRD[]/RFC[]
├── evidence/                    ← TRACKED — measurements / tests / audits
├── problems/                    ← TRACKED — problem cards
├── solutions/                   ← TRACKED — solution portfolios
├── refresh/                     ← TRACKED — re-evaluation of stale ADRs
├── notes/                       ← TRACKED — micro-decisions (90-day TTL)
├── memory/                      ← TRACKED — typed memory (fact/convention/constraint/observation/procedure) — NOT Hindsight!
├── state/                       ← TRACKED — lifecycle state machine YAML (one per artifact)
├── config.yaml                  ← TRACKED — project config (uses api_key_env, never literal keys)
├── .gitignore                   ← TRACKED — lists what NOT to track
│
├── lance/                       ← ❌ gitignored — LanceDB vector index (rebuild via `forgeplan scan-import`)
├── .fastembed_cache/            ← ❌ gitignored — bge-m3 model cache (~600 MB)
├── logs/                        ← ❌ gitignored — local audit/ops logs
├── .lock                        ← ❌ gitignored — runtime mutex
├── session.yaml                 ← ❌ gitignored — per-machine focus / claim TTLs (NOT shared)
├── trash/                       ← ❌ gitignored — soft-deleted artifacts
└── discovery/                   ← ❌ gitignored — ephemeral research findings

docs/
├── agents/                      ← per-project metadata read by fpl-skills
│   ├── issue-tracker.md
│   ├── build-config.md
│   ├── paths.md
│   └── domain.md
└── ...                          ← project-specific docs

CONTEXT.md                       ← ubiquitous language / domain glossary
.env                             ← ❌ gitignored — actual secrets (loaded via direnv or manual `source`)
CLAUDE.md                        ← this file
```

### Secrets — 12-factor pattern

`config.yaml` is **tracked** but contains only the **name** of the env var holding the API key, never the key itself:

```yaml
llm:
  provider: gemini
  model: gemini-2.0-flash-thinking-exp-01-21
  api_key_env: GEMINI_API_KEY    # ← env var NAME, not the key
  max_tokens: 8192

embedding:
  model: bge-m3
```

The actual key (`GEMINI_API_KEY=AIza...`) lives in `.env` (gitignored), `~/.zshrc`, or CI secrets. Forgeplan reads it from process env at runtime.

**Pre-commit check** — confirm no literal key slipped into `config.yaml`:

```bash
! grep -qE 'api_key:\s*["'"'"']?(sk-|AIza|ant-)[A-Za-z0-9_-]{20,}' .forgeplan/config.yaml \
  && echo "✅ clean" || echo "❌ literal API key — revoke + rewrite to api_key_env"
```

If a literal key was committed: `git rm --cached`, rewrite to `api_key_env`, **revoke the leaked key** (it's already in git history), commit the fix.

### Env var overrides

Forgeplan accepts overrides without editing `config.yaml`:

`FORGEPLAN_LLM_PROVIDER`, `FORGEPLAN_LLM_MODEL`, `FORGEPLAN_LLM_BASE_URL`, `FORGEPLAN_LLM_MAX_TOKENS`, `FORGEPLAN_LLM_API_KEY_ENV`, `FORGEPLAN_EMBEDDING_MODEL`, `FORGEPLAN_STORAGE_DRIVER`, `FORGEPLAN_STORAGE_PATH`, `FORGEPLAN_MEMORY_DRIVER`.

Priority: env > config.yaml > built-in default.

### Fresh clone protocol

```bash
git clone <repo>
cd <repo>
yarn install                         # node deps
forgeplan init -y                    # creates lance/, .fastembed_cache/, etc.
forgeplan scan-import                # rebuilds vector index from markdown
# load .env if you have one:
set -a && source .env && set +a      # or `direnv allow` if direnv is configured
forgeplan health                     # verify clean state
```

---

## Non-goals

<!-- Recency zone — last thing the model reads. Use it as a filter against
     scope creep. Each entry is a hard "no", not a "maybe later". -->

<!-- /fpl-init: could not detect — fill manually -->
- <example: "Doesn't ship a public SDK — internal HTTP/GraphQL API only.">
- <example: "Doesn't support Node < 20 — drop polyfills.">
- <example: "Doesn't own the frontend — that's a separate repo.">
- <example: "Doesn't persist anything outside Postgres + Redis.">

Replace these with the real constraints of *this* project. The whole point of this section is to stop the agent from proposing features that fall outside scope.

---

## References

- `forgeplan` CLI — `brew install ForgePlan/tap/forgeplan` or `cargo install --git https://github.com/ForgePlan/forgeplan forgeplan-cli`.
- `fpl-skills` plugin — installed via `/plugin install fpl-skills@ForgePlan-marketplace`.
- Project decisions — `.forgeplan/adrs/` (open `*.md` directly for context; mutate via CLI/MCP only).
- Authored guides — `guides/` if present (project-specific authoring conventions).
- CLAUDE.md best practices — `plugins/fpl-skills/skills/bootstrap/resources/guides/CLAUDE-MD-GUIDE.ru.md` — explains why this file is structured the way it is (U-curve attention, ≤7 red lines, primacy/reference/recency zones).
- Forgeplan setup contract — `plugins/fpl-skills/skills/bootstrap/resources/guides/FORGEPLAN-SETUP.md` — canonical `.gitignore`, secrets layout, env var overrides, anti-patterns. Read before committing anything in `.forgeplan/`.

<!-- forgeplan-operating-contract:v3 -->
## Forgeplan operating contract (this project)

Forgeplan is the source of truth for artifacts in this project. On every non-trivial task you MUST follow this workflow.

**Tool selection** — if Claude Code's deferred-tools list contains `mcp__forgeplan__*` tools (forgeplan MCP server wired in `.mcp.json` and reachable), **prefer the MCP path** over shell. MCP returns typed dicts and includes a `_next_action` field on every response — relay that to your reports. If MCP tools are absent, fall back to shell `forgeplan` CLI. If neither works (`command -v forgeplan` fails), warn once at session start and proceed without artifact ops.

**Before** — `forgeplan_search` (or shell `forgeplan search`) then `forgeplan_list status=draft`. Find related artifacts before creating new ones.
**During** (multi-agent / artifact-driven) — `forgeplan_claim id=<ID> agent=<name>` per teammate before they start; `forgeplan_dispatch agents=N` for parallel-safe wave grouping.
**After** — `forgeplan_new kind=evidence title=...` + `forgeplan_link source=EVID-MMM target=<ARTIFACT-ID> relation=informs` + `forgeplan_score id=<ARTIFACT-ID>` + `forgeplan_activate id=<ARTIFACT-ID>` if R_eff > 0.

**Agent dispatch** — for artifact lifecycle operations, prefer dispatching the right canonical agent (PRD-026, B2 paradigm with `disallowedTools` denylist) over doing the work yourself. Profile A creators (artifact-author, adr-architect, specification, architecture, brief-intake, goal-planner, evidence-recorder) for CREATE; Profile B reviewers (artifact-reviewer, code-reviewer, security-expert, architect-reviewer, tester, system-dev, guardian-gate) for REVIEW+EVID; Profile C-coder (coder) for source-file mutations only; Profile D maintainer (artifact-maintainer) for in-place artifact metadata fixes. See `plugins/fpl-skills/AGENT-AUTHORING-GUIDE.md` for the full CRUD-R-A matrix.

**Skill awareness** — 16 of 22 fpl-skills are MCP-first with CLI fallback (audit, autorun, briefing, build, c4-diagram, ddd-decompose, diagnose, fpl-init, gh-project, refine, research, restore, rfc, riper, shape, sprint). 6 are explicitly classified as no-forgeplan (do, team, bootstrap, setup, forge-report, migrate-from-dev-toolkit) — they delegate or operate on local files only.

This is enforcement, not recommendation. Skipping leaves the artifact graph empty — `forgeplan_health` will flag orphans / missing evidence / stale stubs.
