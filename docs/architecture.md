# Architecture

## Current state (as of 2026-07-27)
moot-space is a Turborepo monorepo using npm workspaces across three namespaces:

```
apps/          # deployable applications
  web/          # @moot-space/web — Vue 3 + Vite frontend
services/      # backend services (empty — see below)
packages/      # shared code (empty — no second consumer yet)
```

### apps/web
- Vue 3 (`<script setup>`), Vite, Pinia, vue-router.
- Auth/data backend: Supabase (`@supabase/supabase-js`), called directly from the frontend —
  there is no custom backend service yet.
- Views: `HomeFeed`, `UserProfile`, `ChatRoom`, `AuthPage`. All but `AuthPage` require
  `authStore.isAuthenticated` (route guard in `src/router/index.js`).
- State: Pinia stores in `src/store/` (`chat.js`, `auth.js`). `chat.js` currently holds
  **hardcoded mock conversations/messages** and simulates replies with a `setTimeout` — this is
  a placeholder, not wired to Supabase yet.

### services/ and packages/
Both are scaffolded but empty. Convention (from their READMEs):
- A service becomes real when something needs logic Supabase's client-side API can't express
  (e.g. custom matching/ranking, webhooks, background jobs). Named `@moot-space/service-<name>`.
- Shared code only moves into `packages/` once two consumers need it — don't pre-split.

## Open architectural questions
Track unresolved ones here until they're answered, then move the answer + rationale to
`decisions.md`.

- [ ] Does chat go through Supabase Realtime, or does it need a dedicated `service-chat` for
      delivery guarantees / fan-out that Supabase Realtime can't give us?
- [ ] What's the Supabase schema for conversations/messages/users — is it designed yet, or does
      `store/chat.js`'s mock shape become the source of truth for the first migration?
- [ ] Auth: Supabase Auth directly, or a thin `service-auth` wrapper for anything custom
      (invite-only signup, extra profile fields, etc.)?

## Related
- Design research this app's UI draws from: `01 Social App Design` in the `obsd-claude`
  Obsidian vault (Orbit prototypes + behavioral analysis).
- `docs/plan.md` for what's being built next, `docs/decisions.md` for why past choices were made.
