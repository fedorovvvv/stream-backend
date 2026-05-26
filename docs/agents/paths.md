# Project paths

Repo root: `/Users/nikitafedorov/Desktop/Projects/stream-backend`.

## Source layout

```
src/
├── main.ts                     ← bootstrap (HTTP server + Nest factory)
├── bootstrap-paths.ts          ← tsconfig-paths registration
├── core/                       ← cross-cutting infra (per-module folders)
│   ├── config/                 ← @nestjs/config setup, schema validation
│   ├── graphql/                ← Apollo driver wiring, federation/code-first
│   ├── prisma/                 ← PrismaService, seed
│   ├── redis/                  ← Redis client, session store
│   └── core.module.ts          ← aggregates the above
├── modules/                    ← bounded contexts (one module per feature)
│   ├── auth/                   ← login / register / TOTP / session
│   ├── category/               ← stream categories
│   ├── channel/                ← channel CRUD, public profiles
│   ├── chat/                   ← realtime chat (GraphQL Subscriptions)
│   ├── cron/                   ← @nestjs/schedule jobs
│   ├── follow/                 ← follow / unfollow graph
│   ├── libs/                   ← in-tree shared libs scoped to modules/
│   ├── notification/           ← email / Telegram / in-app dispatch
│   ├── sponsorship/            ← Stripe sponsorship plans & subscriptions
│   ├── stream/                 ← LiveKit ingress, stream lifecycle
│   └── webhook/                ← Stripe / LiveKit webhook receivers
└── shared/                     ← project-wide helpers (no domain)
    ├── decorators/
    ├── guards/                 ← AuthGuard, RolesGuard, etc.
    ├── middlewares/
    ├── types/
    └── utils/

prisma/
├── schema.prisma               ← source of truth
├── migrations/                 ← committed migrations (immutable once applied)
└── generated/                  ← ❌ gitignored — Prisma client output

test/
└── jest-e2e.json               ← e2e test config

docs/
├── agents/                     ← this folder — auto-loaded by CLAUDE.md
│   ├── issue-tracker.md
│   ├── build-config.md
│   ├── paths.md (this file)
│   └── domain.md
└── ...                         ← project-specific docs (add as needed)

.forgeplan/                     ← managed by CLI/MCP (see CLAUDE.md → Storage layout)
.claude/                        ← Claude Code host config (settings.json + skills)
.cursor/                        ← Cursor IDE config (peer-tool)
.vscode/                        ← VS Code workspace config
```

## Module conventions

Every module under `src/modules/<name>/` follows the NestJS pattern:

```
<name>/
├── <name>.module.ts            ← @Module declaration (imports / providers / exports)
├── <name>.controller.ts        ← REST endpoints (if any)
├── <name>.resolver.ts          ← GraphQL resolvers
├── <name>.service.ts           ← business logic (no HTTP/GraphQL concerns)
├── dto/                        ← class-validator DTOs
├── entities/                   ← GraphQL types (code-first)
└── *.spec.ts                   ← unit tests
```

Cross-module imports must go through the exporting module's `exports:` array — no deep imports into another module's `service.ts`. If you need a piece in two modules, lift it to `src/shared/` or `src/core/`.

## TS path aliases

From `tsconfig.json`:

```
@/src/*               → src/*
@/prisma/generated/*  → prisma/generated/*
@/*                   → repo root / *
@prisma/generated     → prisma/generated
prisma/generated/*    → prisma/generated/*
```

Prefer `@/src/...` for module-internal imports. Bare relative paths (`./service`) inside the same module.

## Where things live

| Need | Location |
|---|---|
| Add a new feature (HTTP/GraphQL surface + DB) | new module under `src/modules/<name>/` |
| Add infra (a new DB, queue, external SDK) | `src/core/<name>/` + register in `core.module.ts` |
| Add a shared util / type | `src/shared/<utils\|types>/` |
| Add a Prisma model | `prisma/schema.prisma` → `prisma migrate dev --name <slug>` |
| Add an env var | `.env.example` + `src/core/config/` schema + this `paths.md` |
| Add an ADR / PRD / RFC | `forgeplan new <kind> "<title>"` (never edit files directly) |
| Add an issue template | `.github/ISSUE_TEMPLATE/` via `/repo-architect` |

## Generated / gitignored

- `dist/` — TypeScript build output
- `prisma/generated/` — Prisma client
- `node_modules/`
- `.env`, `.env.local`
- `.forgeplan/lance/`, `.forgeplan/.fastembed_cache/`, `.forgeplan/logs/`, `.forgeplan/trash/`, `.forgeplan/discovery/`, `.forgeplan/session.yaml`, `.forgeplan/.lock`

Never commit anything from these paths. If you see them in `git status` after a hook ran, something in `.gitignore` is wrong.
