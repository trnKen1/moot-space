# moot-space — Claude Code working memory

## What this is
A social/chat app. Turborepo monorepo, npm workspaces: `apps/*`, `services/*`, `packages/*`.

- `apps/web` — Vue 3 + Vite frontend (`@moot-space/web`). Pinia for state, vue-router for routing,
  Supabase (`@supabase/supabase-js`) as the backend-as-a-service. Routes: Feed (`/`), Profile
  (`/profile`), Chat (`/chat`), Auth (`/auth`) — all but Auth are route-guarded on
  `authStore.isAuthenticated`.
- `services/*` — custom backend services, one workspace per service, named
  `@moot-space/service-<name>` (e.g. `service-auth`, `service-chat`).
  - `service-api` (Django) — added 2026-09-04, ahead of the usual "stand up a service only when
    Supabase can't express the need" trigger (see `docs/decisions.md`), as a deliberate
    Django-learning project. It has no real endpoints yet; `apps/web` still talks to Supabase
    directly for everything. Django's app-grouping folder inside it is named `service_api/`, not
    `apps/` — the top-level `apps/` here already means "deployable frontends," so reusing it one
    level down would read as a collision. Its `package.json` scripts go through
    `node scripts/py.mjs` rather than naming an interpreter — the launcher prefers the workspace
    venv (`.venv/Scripts/python.exe` on Windows, `.venv/bin/python` elsewhere) and falls back to
    `PATH` when there's no venv, as on CI. Don't "simplify" those scripts back to a bare `python`:
    Windows resolves it inside an npm-spawned shell to the App-execution-alias/`pymanager` stub,
    not the venv. Dev setup is `python -m venv .venv` in the service dir, then
    `pip install -r requirements-dev.txt` (that file pulls in `requirements.txt` and adds `ruff`,
    which `npm run lint` needs).
  - Everything else here should still only get stood up when something needs logic Supabase
    can't express — `service-api` is the deliberate exception, not a new default.
- `packages/*` — shared code used by 2+ apps/services, named `@moot-space/<name>`. Don't
  pre-emptively split code out here before a second consumer exists.

## Commands
- `npm run dev` — runs the web app (`turbo run dev --filter=@moot-space/web`)
- `npm run build` / `npm run lint` / `npm run test:unit` — run across all workspaces via Turborepo
- `npx turbo run dev --filter=@moot-space/service-api` — runs the Django dev server standalone
  (not wired into the default `npm run dev` yet — add `--filter` or a combined script when you
  want both running together)
- CI (`.github/workflows/main-ci.yml` → `reusable-ci.yml`) splits by toolchain: a Node matrix job
  (22.x/24.x) runs `npx turbo run lint|test:unit --filter='!@moot-space/service-api'`, and a
  separate Python job sets up Python + `requirements-dev.txt` and runs those same tasks for
  `service-api`. It calls `npx turbo` directly rather than the root npm scripts because the root
  `test:unit` script ends in `--`, so anything npm appends goes to vitest instead of turbo.

## Conventions
- Vue 3 `<script setup>` SFCs, no Options API for new components.
- Styling: use the global `ms-*` classes from `apps/web/src/styles/moot.css` and tokens from
  `src/styles/tokens.css` (`var(--brand)`, `var(--space-4)`…); scoped CSS only for layout glue.
  Never hard-code colours. Token/class changes start in the Design System artifact
  (https://claude.ai/artifact/ANJ5xn1qUzkpfmwHYJtsr9), then get copied in — see `docs/decisions.md`.
- State lives in Pinia stores (`apps/web/src/store/*.js`), not component-local state, once it's
  shared across views.
- Store data is currently mocked in-memory (see `store/chat.js`) — when wiring a feature to
  Supabase, replace the mock actions rather than layering real calls on top of them.

## Working memory files
Split between the repo and Obsidian (as of 2026-09-04):
- `docs/architecture.md` and `docs/decisions.md` **stay in this repo** — they're the "show your
  work" artifacts (current system state, and why past choices were made), and ship with the repo
  so anyone who clones it has them, not just this machine. Read both at the start of a session
  touching more than a small fix. Log any non-obvious architectural choice in `docs/decisions.md`
  when you make it, not after.
- `docs/architecture-audit.md` also stays in this repo — a dated (2026-08-14) architecture/risk
  pass, not living memory like the two above. Useful background, not something to keep updated.
- `plan.md` and `todo.md` **moved to the Obsidian vault** — day-to-day planning, in
  `20 Software/Social App Design/` in the `obsd-claude` vault, alongside this project's design
  research. Keep their checkboxes in sync with what actually got done; they're persistent memory
  across sessions, not a one-time snapshot. Note: only resolvable on this machine, since the
  vault isn't part of this git repo.

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
- **Design research, plan.md, and todo.md all live in Obsidian**, not this repo:
  `20 Software/Social App Design` in the `obsd-claude` vault has the layout prototypes and
  behavioral analysis (Orbit) that this app's Feed/Discover-style UI is drawing from, plus the
  current plan/todo checklists (see "Working memory files" above). Check there before
  redesigning a layout from scratch or starting a new work session.
