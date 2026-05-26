# Build & test configuration

Stack: **NestJS 11** · **TypeScript** (`nodenext`, `target: ES2023`) · **Yarn** · **Prisma 7** · **Apollo GraphQL** · **Redis** · **Jest**.

## Package manager

**Yarn** (lockfile: `yarn.lock`). Use `yarn` for all dependency operations — don't introduce `npm` or `pnpm` mid-stream; the lockfile will diverge.

```bash
yarn install              # install
yarn add <pkg>            # add dependency
yarn add -D <pkg>         # add dev dependency
yarn remove <pkg>         # remove
```

## Build

```bash
yarn build                # nest build → dist/
yarn start                # nest start (one-shot)
yarn start:dev            # nest start --watch (dev loop)
yarn start:debug          # nest start --debug --watch
yarn start:prod           # node dist/src/main.js (production-style)
```

NestJS uses SWC/tsc per `nest-cli.json`. Output goes to `dist/` (gitignored).

## Test

```bash
yarn test                 # jest (unit, default)
yarn test:watch           # jest --watch
yarn test:cov             # jest --coverage
yarn test:e2e             # jest --config ./test/jest-e2e.json
yarn test:debug           # node --inspect-brk + jest --runInBand
```

Unit tests live next to source as `*.spec.ts`. E2E tests live in `test/` with their own config.

## Lint / format

```bash
yarn lint                 # eslint --fix (mutating)
yarn lint:check           # eslint, no auto-fix (CI-safe, use this in smoke test)
yarn format               # prettier --write
yarn format:check         # prettier --check (CI-safe)
```

ESLint config: `eslint.config.mjs` (flat config). Prettier: `.prettierrc` + `.prettierignore`.

## Database (Prisma)

```bash
yarn db:seed                                      # ts-node + dotenv → seed
# Schema changes (local dev only):
npx prisma migrate dev --name <slug>              # creates migration + applies
npx prisma migrate reset                          # 🔴 destroys data
npx prisma generate                               # regenerate client (auto on install)
npx prisma studio                                 # GUI

# Production (red-line, requires explicit confirmation):
npx prisma migrate deploy
```

Generated client lives at `prisma/generated/` (gitignored). Schema source of truth: `prisma/schema.prisma`. Migrations: `prisma/migrations/`.

## Smoke test (full check before PR)

```bash
yarn build && yarn test && yarn lint:check && yarn format:check
forgeplan health
git status
```

All four `yarn` commands must exit 0. `forgeplan health` must not list new orphans/stubs.

## Pre-commit / CI

- No husky / lefthook detected — pre-commit hooks not configured locally.
- No `.github/workflows/` checked in — CI not configured yet. When added, mirror the smoke test above.

## Runtime

- **Node.js ≥ 20** (NestJS 11 requirement).
- **PostgreSQL** (Prisma datasource).
- **Redis** (sessions via `connect-redis`, GraphQL pub/sub).
- **SMTP** (NestJS mailer + react-email templates).

`docker-compose.yml` ships local Postgres + Redis. `.env.example` documents required env vars.
