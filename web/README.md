# Teastream Web

Frontend для `stream-backend`. React 19 + Vite + TanStack Query + Mantine v7 + React Router v7 + GraphQL.

Архитектура — **Feature-Sliced Design**: `app → pages → widgets → features → entities → shared`.

## Quickstart

```bash
pnpm install
pnpm dev          # http://localhost:3001 (proxies /graphql → backend на :3000)
pnpm build
pnpm typecheck
pnpm lint:check
```

Backend должен крутиться на `http://localhost:3000` (см. `../docker-compose.yml`, `../.env`). CORS уже разрешает `http://localhost:3001`, session cookies проходят через Vite proxy.

## Структура

```
src/
├── app/          composition root, providers, router, layouts
├── pages/        route-bound compositions
├── widgets/      reusable page blocks (Header, Sidebar, ChatBox, etc.)
├── features/     interactive units that mutate state
├── entities/     domain primitives (User, Stream, Category, …)
└── shared/       framework-agnostic helpers, API client, theme, types
```

Cross-layer imports — только сверху вниз. Внутри слоя — через slice's `index.ts` barrel.

## Stack rationale

- **Mantine v7** — design system + accessible primitives, no Tailwind config drift.
- **TanStack Query** — cache + server-state, replaces Redux/Zustand for API data.
- **graphql-request** — тонкий GraphQL fetcher (без Apollo bundle).
- **graphql-ws** — для `chatMessageAdded` subscription.
- **Remeda** — type-safe lodash-replacement, tree-shakeable.
- **Zod** — runtime validation для форм + parsed env.
- **React Router v7** — routing + nested layouts.
