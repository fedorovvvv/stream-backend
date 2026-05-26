# Domain glossary — Teastream

Live-streaming platform. The backend exposes a GraphQL API (queries / mutations / subscriptions) plus webhook receivers for Stripe and LiveKit.

## Bounded contexts (per `src/modules/`)

| Module | Owns | External deps |
|---|---|---|
| `auth` | User credentials, sessions, TOTP, social linking, account deactivation/verification | Redis (sessions), Argon2 (hashing) |
| `channel` | Channel public profile (display name, bio, avatar, banner) | — |
| `category` | Stream categories taxonomy | — |
| `stream` | Stream entity, lifecycle (live/offline), thumbnail, ingress credentials | LiveKit (ingress create/revoke) |
| `chat` | Realtime chat messages tied to a live stream | GraphQL Subscriptions (pub/sub) |
| `follow` | follower ↔ following graph | — |
| `notification` | Email / Telegram / in-app notification dispatch + user preferences | Mailer (SMTP + react-email), Telegram Bot API |
| `sponsorship` | Sponsorship plans (creator-defined) + subscriptions (sponsor → creator) | Stripe (subscription products) |
| `webhook` | Inbound webhook receivers for external services | Stripe webhook signing, LiveKit webhook signing |
| `cron` | Scheduled jobs (cleanup, periodic notifications) | `@nestjs/schedule` |

## Core entities (from `prisma/schema.prisma`)

| Entity | Role | Notes |
|---|---|---|
| `User` | Account owner. One per email, one per username. | Has at most one `Stream`. Soft-deactivation via `isDeactivated`. TOTP optional. |
| `Token` | One-time / short-lived tokens (email verification, password reset, etc.) | Linked to a User. |
| `SocialLink` | External links rendered on the channel page | Ordered by `position`. |
| `Stream` | A user's live-stream entity. | One per User. `ingressId` / `serverUrl` / `streamKey` issued by LiveKit. |
| `ChatMessage` | A message in a stream's chat. | Linked to User + Stream. |
| `Follow` | Directed edge `follower → following`. | Self-follow disallowed at the service layer. |
| `Notification` | In-app notification record. | Per-User. |
| `NotificationSettings` | Per-User dispatch preferences. | Email / Telegram / in-app toggles. |
| `Transaction` | Stripe payment record (one per Stripe event). | Linked to User. |
| `SponsorshipPlan` | Creator-defined sponsorship tier (price, perks). | One creator → many plans. |
| `SponsorshipSubscription` | Active sponsor → creator subscription. | Both endpoints are Users. |
| `Category` | Stream category (e.g. "Gaming → Just Chatting"). | Referenced by Stream. |

## Ubiquitous language

| Term | Meaning in this codebase | Don't confuse with |
|---|---|---|
| **User** | An account record. Always has an email + username. | "viewer" — not a separate entity; a viewer is just a User watching a Stream. |
| **Channel** | The public-facing surface of a User (profile, social links, recent streams). Not a separate Prisma model — channels ARE Users with stream metadata. | "Stream" — the live broadcast object, owned by a User. |
| **Stream** | The live-broadcast entity, with LiveKit ingress credentials and a lifecycle (live / offline). | "Channel" (the static page) or "ChatMessage" (chat content during a stream). |
| **Sponsor / Sponsorship** | Recurring monetary support, sponsor → creator. NOT a one-time tip. | Stripe one-shot payments (use `Transaction` directly, not `SponsorshipSubscription`). |
| **Sponsor** (verb / role) | The User paying. | "Creator" — the User being paid. |
| **Creator** | A User who has set up a Stream and accepts sponsorships. | "Streamer" — same thing colloquially, but **always** prefer "Creator" in code/identifiers. |
| **Follow** | Directed, non-monetary. Free, instant, no notifications by default. | Sponsorship (monetary, recurring, generates notifications). |
| **Ingress** | A LiveKit concept — the input pipeline that accepts RTMP/WHIP and forwards to the LiveKit room. | "Egress" (LiveKit's output / recording — not implemented yet). |
| **Webhook** | Inbound from Stripe or LiveKit. Always signed; verify before processing. | Outbound webhooks (not implemented). |
| **TOTP** | RFC 6238 time-based one-time password (Google Authenticator / 1Password). Optional 2FA on login. | SMS OTP (not implemented). |
| **Deactivation** | Soft-delete — `isDeactivated = true`, `deactivatedAt` set. User can still be referenced; logins blocked. | Hard delete — not exposed via the API. |

## Cross-context rules

- **No deep imports** between modules. Cross-module data goes through the exporting module's `exports:` array, or through a service in `src/core/`.
- **Webhook receivers never mutate other modules' state directly** — they emit an event or invoke a service from the target module via DI.
- **Sponsorship subscriptions** are owned by `sponsorship/`. Stripe webhook → `webhook/` parses + validates → calls `sponsorship.service` to update state.
- **Stream lifecycle**: `stream.service` is the sole owner of `Stream.ingressId` / `streamKey`. LiveKit webhook only flips `isLive` flags via the same service.
- **Notifications** are the only module allowed to fan out to external channels (email / Telegram). Other modules emit a domain event and let `notification/` decide whether to dispatch.

## Out of scope

- VOD / recording (LiveKit Egress) — deferred.
- Multi-tenant / org accounts — single user per account by design.
- Public-facing REST API — GraphQL only. Webhook receivers are HTTP but not "public REST".
- Mobile clients — backend is platform-agnostic; mobile lives in another repo.
- Payment methods other than Stripe — not planned.

When a request lands that falls into "out of scope", surface this file and ask for explicit confirmation before expanding the domain.
