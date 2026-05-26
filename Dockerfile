# syntax=docker/dockerfile:1.7

# ─── deps-dev: full deps (used by builder for nest build + prisma generate) ─
FROM node:24-bookworm-slim AS deps-dev
WORKDIR /app

# argon2 + sharp need python/make/g++ to compile native bindings.
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile && yarn cache clean

# ─── deps-prod: production deps only (used by runtime stage) ─────────────────
# Separate from deps-dev: avoids the slow + disk-hungry "install all, then
# re-install --production" sequence. Cleanly installs only what runtime needs.
FROM node:24-bookworm-slim AS deps-prod
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json yarn.lock ./
RUN corepack enable && yarn install --frozen-lockfile --production && yarn cache clean

# ─── builder stage: prisma generate + nest build ─────────────────────────────
FROM node:24-bookworm-slim AS builder
WORKDIR /app

# Prisma engine probes `openssl` CLI to pick the right binary variant.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=deps-dev /app/node_modules ./node_modules
COPY . .

# Prisma client must be generated before nest build (imported in core/prisma)
RUN npx prisma generate
RUN corepack enable && yarn build

# ─── runtime stage: minimal production image ────────────────────────────────
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

# openssl CLI for Prisma engine version detection.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd -r teastream && useradd -r -g teastream teastream

# node_modules comes from deps-prod (only runtime deps, no compilers).
COPY --from=deps-prod --chown=teastream:teastream /app/node_modules ./node_modules
COPY --from=builder --chown=teastream:teastream /app/dist ./dist
COPY --from=builder --chown=teastream:teastream /app/prisma ./prisma
COPY --from=builder --chown=teastream:teastream /app/package.json ./package.json
# Prisma 7 reads prisma.config.ts from CWD.
COPY --from=builder --chown=teastream:teastream /app/prisma.config.ts ./prisma.config.ts

# NestJS @Apollo code-first writes the auto-generated schema to
# `${cwd}/src/core/graphql/shema.gql` (path hardcoded in core/config/graphql.config.ts).
# This dir doesn't exist in the slim image — pre-create it writable to `teastream`.
RUN mkdir -p src/core/graphql && chown -R teastream:teastream src

USER teastream

EXPOSE 3000

# Schema sync strategy: this project uses `prisma db push` (no migration history
# for the base schema — only one standalone UUID-trigger patch lives in
# prisma/migrations/). On container start:
#   0. Drop orphan `_prisma_migrations` table from a previous failed migrate run
#      (db push otherwise prompts for confirmation in a TTY and aborts).
#   1. `db push` — non-destructive schema sync from schema.prisma.
#      No --accept-data-loss (CLAUDE.md red-line); refuses if destructive.
#   2. `db execute` — applies the UUID-trigger SQL (idempotent: CREATE OR
#      REPLACE FUNCTION + DROP TRIGGER IF EXISTS).
# When the project grows past `db push` and adopts a real migration baseline,
# swap all three steps for `prisma migrate deploy`.
CMD ["sh", "-c", "echo 'DROP TABLE IF EXISTS _prisma_migrations;' | npx prisma db execute --stdin && npx prisma db push && npx prisma db execute --file prisma/migrations/20260327160000_user_id_db_uuid_studio/migration.sql && node dist/src/main.js"]
