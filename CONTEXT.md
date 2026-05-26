# CONTEXT.md — Teastream backend

Quick-reference glossary for AI agents. The authoritative version lives at `docs/agents/domain.md` — this file is the one-screen distillation auto-loaded by `CLAUDE.md`.

## What we build

**Teastream** — a Twitch-shaped live-streaming platform. This repo is the **backend** (NestJS + GraphQL + Prisma + Postgres + Redis + LiveKit + Stripe).

The frontend / mobile clients live in separate repos and are not in scope here.

## One-line definitions

- **User** — account record. Single email, single username. May have at most one Stream.
- **Channel** — a User's public profile (display name, bio, avatar, social links). **Not a separate model** — a channel is a User's projection.
- **Stream** — the live-broadcast entity per User. Carries LiveKit ingress credentials and an "is live" lifecycle.
- **Creator** — a User who broadcasts. (Don't say "streamer" in code.)
- **Sponsor** — a User paying another User recurringly via a SponsorshipPlan + Stripe.
- **Follow** — free, directed edge follower → creator. No money. No notifications by default.
- **Sponsorship** — recurring monetary support. Plan defined by the Creator, Subscription owned by the Sponsor, billing via Stripe.
- **Ingress** — LiveKit input pipeline (RTMP/WHIP → LiveKit room). Owned by `stream/`.
- **TOTP** — optional 2FA (RFC 6238). Per-User opt-in.
- **Deactivation** — soft delete. `isDeactivated = true`; login blocked; record retained.

## Architecture in one breath

NestJS app, code-first GraphQL (Apollo), Prisma → Postgres for state, Redis for sessions + pub/sub (chat subscriptions), LiveKit for streaming, Stripe for payments, SMTP + react-email for transactional mail, Telegram Bot API for opt-in push.

Modules under `src/modules/` are bounded contexts. Cross-context data flows via the exporting module's public services — no deep imports. Webhooks (`webhook/`) validate signatures, then delegate to the target context's service.

## What this codebase does NOT do

- VOD / recording (LiveKit Egress) — deferred.
- Multi-tenant / org accounts — single user per account.
- Public REST API — GraphQL only.
- Mobile / web client — separate repos.
- Payment methods other than Stripe.

When a feature request crosses one of these lines, surface this file and ask before expanding scope.

## When to look beyond this file

- Deeper domain rules → `docs/agents/domain.md`.
- File paths / module layout → `docs/agents/paths.md`.
- Build / test / lint commands → `docs/agents/build-config.md`.
- Issue tracker / labels → `docs/agents/issue-tracker.md`.
- Active product decisions → `.forgeplan/adrs/` (don't edit files; use `forgeplan get <ID>`).
