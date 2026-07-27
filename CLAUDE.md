# moot-space — Claude Code working memory

## What this is
A social/chat app. Turborepo monorepo, npm workspaces: `apps/*`, `services/*`, `packages/*`.

- `apps/web` — Vue 3 + Vite frontend (`@moot-space/web`). Pinia for state, vue-router for routing,
  Supabase (`@supabase/supabase-js`) as the backend-as-a-service. Routes: Feed (`/`), Profile
  (`/profile`), Chat (`/chat`), Auth (`/auth`) — all but Auth are route-guarded on
  `authStore.isAuthenticated`.
- `services/*` — custom backend services, one workspace per service, named
  `@moot-space/service-<name>` (e.g. `service-auth`, `service-chat`). Empty so far — everything
  currently runs through Supabase directly from the frontend. Only stand up a service here when
  something needs logic Supabase can't express.
- `packages/*` — shared code used by 2+ apps/services, named `@moot-space/<name>`. Don't
  pre-emptively split code out here before a second consumer exists.

## Commands
- `npm run dev` — runs the web app (`turbo run dev --filter=@moot-space/web`)
- `npm run build` / `npm run lint` / `npm run test:unit` — run across all workspaces via Turborepo

## Conventions
- Vue 3 `<script setup>` SFCs, no Options API for new components.
- State lives in Pinia stores (`apps/web/src/store/*.js`), not component-local state, once it's
  shared across views.
- Store data is currently mocked in-memory (see `store/chat.js`) — when wiring a feature to
  Supabase, replace the mock actions rather than layering real calls on top of them.

## Working memory files (`docs/`)
Read `docs/architecture.md`, `docs/plan.md`, and `docs/decisions.md` at the start of a session
touching more than a small fix. Keep `docs/todo.md` and `docs/plan.md` checkboxes in sync with
what actually got done — they're the persistent memory across sessions, not a one-time snapshot.
Log any non-obvious architectural choice in `docs/decisions.md` when you make it, not after.

## How to work on this repo
- **Plan before building.** For anything touching more than one file, a new feature, or an
  unclear bug — use Plan Mode (Shift+Tab twice) first. Don't go straight to edits.
- **Ask before assuming.** If a requirement is ambiguous (auth strategy, data shape, what
  "done" looks like for a feature), ask rather than picking a default silently.
- **Match reasoning effort to the problem**, not by default: quick bug fixes need `think`;
  data-model or cross-service changes need `think hard`; anything security-sensitive (auth,
  Supabase row-level security policies) or a genuinely stuck problem needs `think harder` /
  `ultrathink`.
- **Review the plan before it executes.** Don't let a plan run unattended across the whole
  monorepo — check in after each independently-verifiable step (e.g. after the store change,
  before the view change).
- **Design research lives in Obsidian**, not this repo: `01 Social App Design` in the
  `obsd-claude` vault has the layout prototypes and behavioral analysis (Orbit) that this app's
  Feed/Discover-style UI is drawing from. Check there before redesigning a layout from scratch.
