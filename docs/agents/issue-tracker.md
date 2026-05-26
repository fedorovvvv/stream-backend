# Issue tracker

Repository: `github.com/fedorovvvv/stream-backend` (origin via SSH).

## Primary tracker

**GitHub Issues** — same repo. Use `gh issue` / `gh pr` for CLI operations.

No `.github/ISSUE_TEMPLATE/` or `.github/PULL_REQUEST_TEMPLATE.md` is checked in yet — when one is needed, scaffold it with `/repo-architect` (agents-github pack) and follow the conventions in the `agents-github:issue-manager` agent.

## MCP integrations available

The host Claude Code has these MCP servers wired globally (not project-local):

| MCP server | When to use |
|---|---|
| `claude.ai Linear` | If/when this project is mirrored into a Linear team. Not yet wired. |
| `claude.ai Sentry` | Production error triage — only after Sentry DSN is provisioned for this service. |
| `claude.ai Slack` | Cross-team announcements / on-call pings. Use sparingly. |
| `github` | All issue / PR / release / workflow operations. **Primary tracker.** |

## Naming convention

When an artifact ID exists in `.forgeplan/`, prefix the issue title:

```
[PRD-NNN] Add OAuth2 social login
[RFC-NNN] Migrate sessions from Redis to KeyDB
[BUG] WebSocket reconnect storms after Redis restart
```

For tasks not yet promoted to a forgeplan artifact, use plain titles with topic labels (`area:auth`, `area:stream`, `area:chat`, `area:sponsorship`, `type:bug`, `type:feat`).

## Workflow

1. New artifact created in `.forgeplan/` → matching GitHub issue (optional but recommended for cross-team visibility).
2. `forgeplan activate <id>` → close the tracker issue with `Refs: <ARTIFACT-ID>`.
3. PR merged → tracker auto-closes via PR body `Closes #NNN`.
4. Tracker offline → record what to sync in `TODO.md` and reconcile later.

## Offline fallback

If GitHub is unreachable: append a one-line entry to `TODO.md` (create at repo root if absent) and reconcile on next online run.
