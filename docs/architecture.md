# Architecture

## Current state (as of 2026-07-27, services/ updated 2026-09-04)
moot-space is a Turborepo monorepo using npm workspaces across three namespaces:

```
apps/          # deployable applications
  web/          # @moot-space/web — Vue 3 + Vite frontend
services/      # backend services
  service-api/  # @moot-space/service-api — Django, scaffold only, see below
packages/      # shared code (empty — no second consumer yet)
```

### apps/web
- Vue 3 (`<script setup>`), Vite, Pinia, vue-router.
- Auth/data backend: Supabase (`@supabase/supabase-js`), called directly from the frontend —
  there is no custom backend service yet.
- Views: `HomeFeed`, `UserProfile`, `ChatRoom`, `AuthPage`. All but `AuthPage` require
  `authStore.isAuthenticated` (route guard in `src/router/index.js`).
- State: Pinia stores in `src/store/` (`chat.js`, `auth.js`). `auth.js` **is fully wired to
  Supabase Auth** (session restore on boot, `onAuthStateChange`, `login`/`signup`/`logout` all
  call `supabase.auth.*`) — confirmed 2026-08-14, resolving the open question that used to be
  here. `chat.js` currently holds **hardcoded mock conversations/messages** and simulates replies
  with a `setTimeout` — this is a placeholder, not wired to Supabase yet. `HomeFeed.vue` similarly
  keeps its post list as a component-local mock `ref`, not yet in a store.
  See `docs/architecture-audit.md` for a full architecture/risk pass.

### services/ and packages/
`packages/` is scaffolded but empty. `services/` has one workspace so far:

- **`service-api`** (`@moot-space/service-api`) — Django 6.1, added 2026-09-04. Scaffold only:
  `config/` (settings/urls/wsgi), one placeholder app `service_api/core`, SQLite locally. Not
  wired to `apps/web` or Supabase yet — no real endpoints, no shared schema/auth decision made.
  Stood up ahead of the usual trigger, as a deliberate Django-learning project rather than a
  product necessity; see the 2026-09-04 entry in `decisions.md` for the full reasoning and its
  relationship to the superseded standalone `moot-club` repo. Runs via Turborepo like any other
  workspace (`npx turbo run dev --filter=@moot-space/service-api`), not containerized.

Convention for anything added here going forward (from the READMEs):
- A service becomes real when something needs logic Supabase's client-side API can't express
  (e.g. custom matching/ranking, webhooks, background jobs) — `service-api` is the deliberate
  exception to this, not a new default. Named `@moot-space/service-<name>`.
- Shared code only moves into `packages/` once two consumers need it — don't pre-split.

## Open architectural questions
Track unresolved ones here until they're answered, then move the answer + rationale to
`decisions.md`.

- [ ] Does chat go through Supabase Realtime, or does it need a dedicated `service-chat` for
      delivery guarantees / fan-out that Supabase Realtime can't give us?
- [ ] What's the Supabase schema for conversations/messages/users — is it designed yet, or does
      `store/chat.js`'s mock shape become the source of truth for the first migration?
- [ ] Auth: Supabase Auth directly, or a thin `service-auth` wrapper for anything custom
      (invite-only signup, extra profile fields, etc.)? (Note: `store/auth.js` already calls
      Supabase Auth directly today — this question is about whether that stays sufficient, not
      whether it's wired up.)

## Related
- Design research this app's UI draws from, plus the current plan/todo: `20 Software/Social App
  Design` in the `obsd-claude` Obsidian vault (Orbit prototypes + behavioral analysis, and
  `plan.md`/`todo.md` as of the 2026-09-04 docs split — see `CLAUDE.md`).
- `docs/decisions.md` (this repo) for why past choices were made.
- `docs/architecture-audit.md` (this repo) for a point-in-time (2026-08-14) architecture/risk
  pass — layers, request-flow trace, and a risk table. Complements this file rather than
  replacing it; this file is the living snapshot, the audit is a dated analysis.
