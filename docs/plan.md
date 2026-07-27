# Plan

Master plan, checked off as work lands. Keep this in sync with reality — if something here is
stale or wrong, fix it in the same session rather than leaving it to drift.

## Phase 0 — Scaffold (done)
- [x] Turborepo + npm workspaces structure (`apps/`, `services/`, `packages/`)
- [x] `apps/web` scaffolded: Vue 3 + Vite + Pinia + vue-router, ESLint, Vitest
- [x] Supabase client dependency added

## Phase 1 — Frontend demo (in progress)
- [x] Feed / Profile / Chat / Auth routes with auth guard
- [x] Chat UI backed by mock Pinia store data
- [ ] Replace `store/chat.js` mock data with real Supabase queries/subscriptions
- [ ] Replace `store/auth.js` with real Supabase Auth session handling (if not already real —
      verify before assuming)

## Phase 2 — Backend decisions
- [ ] Resolve the open questions in `architecture.md` (chat delivery, schema, auth ownership)
- [ ] Stand up `services/service-*` only if a question above concludes Supabase alone isn't enough

## Phase 3 — Not yet scoped
- [ ] Feed content model (what "Feed" actually shows, ranking/discovery — see Orbit research in
      the Obsidian vault for prior design thinking on this)

## How to use this file
- Before starting a feature, check here first — if it's not listed, add it (in Plan Mode,
  before writing code) so the plan stays the actual source of truth.
- When a phase item is genuinely done (tested, not just written), check it off in the same
  session.
