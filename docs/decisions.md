# Decisions

Log of architectural/product choices, in the order made. One entry per decision — don't edit
past entries when a decision is later reversed, add a new entry that supersedes it and link back.

Format:
```
## YYYY-MM-DD — <short title>
**Decision:** what was chosen
**Why:** the reasoning / what alternative was rejected and why
**Supersedes:** (optional) link to an earlier entry this replaces
```

---

## 2026-07-27 — Monorepo layout: apps/services/packages
**Decision:** Turborepo + npm workspaces split into `apps/*` (deployables), `services/*`
(backend services, one workspace each), `packages/*` (shared code, only once 2+ consumers exist).
**Why:** Keeps each backend concern independently deployable/scalable and lets each service pick
its own stack, without forcing premature shared abstractions. (Documented pre-existing convention
in `services/README.md` / `packages/README.md`; recorded here so the reasoning isn't only
implicit in those files.)

## 2026-07-27 — Supabase as initial backend
**Decision:** `apps/web` calls Supabase directly (`@supabase/supabase-js`) rather than starting
with a custom `service-auth`/`service-chat`.
**Why:** Avoids building backend services before it's clear Supabase's client-side API + Realtime
+ RLS can't handle the need. Revisit per the open questions in `architecture.md` as real features
replace the mocked `store/chat.js` data.

## 2026-08-16 — Stay on Vue for `apps/web`; don't rebuild in React for future mobile
**Decision:** Keep `apps/web` on Vue 3 rather than rewriting it in React in anticipation of a
future mobile app. When mobile is actually scoped, evaluate Capacitor (wraps the existing Vue web
app for iOS/Android) against React Native as a separate decision at that time.
**Why:** React Native's code-sharing benefit is with a React Native app, not a React *web* app —
mobile UI would be written separately either way, so switching the web framework doesn't buy
mobile reuse. Meanwhile Phase 1 work (routes, auth guard, Supabase Auth session handling, chat UI
— see `plan.md`) is real, working code, not scaffolding; rewriting it for a Phase 3 need that
isn't even scoped yet is a large cost for a speculative benefit.

## 2026-09-02 — Trigger for standing up the first backend service
**Decision:** `apps/web` keeps calling Supabase directly. We create the first
`services/service-*` workspace only when one of these is *observed* — not on a schedule, and
not on general "will this scale" concern:
  1. A query the client API can't express efficiently (e.g. feed ranking needing a per-request
     join+score across tables that can't be a Postgres view or an RPC).
  2. Work that must run with no client present — scheduled jobs, notification fan-out, digests.
  3. A credential that cannot ship to the browser (a third-party key needing server-side use).
  4. An authorization rule RLS genuinely cannot express.
  5. A measured performance floor — p95 feed load past <N>ms at realistic row counts, traced to
     the client query pattern rather than to a missing index.

  <N> is deliberately unset: pick a number you would actually be unhappy with. A threshold
  quietly rigged never to fire is worse than no threshold, because it feels like rigor.

**Why:** Without a written condition, "should we move to a real backend?" gets relitigated
whenever something is annoying, and gets answered on mood rather than evidence. Supabase is
Postgres: if a trigger fires, a Django (or any) service points at the same database and the
schema survives — only client-side query code is rewritten. So the cost of waiting is bounded,
while the cost of moving early is the whole Phase 1 timeline.

Corollary: the `moot-club` Django repo is this decision made ahead of its trigger. It should not
remain a separate repository — when a trigger fires, that work lands here as
`services/service-api` per the `services/README.md` convention, so it inherits this repo's
history, docs and CI.
**Supersedes:** clarifies 2026-07-27 — Supabase as initial backend (does not reverse it).

## 2026-09-04 — Fold moot-club in as services/service-api, ahead of the trigger
**Decision:** Stood up `services/service-api` (Django) now, rather than waiting for one of the
five triggers above to fire. `apps/web` still talks to Supabase directly for everything real —
`service-api` currently has no endpoints wired to the product, just the scaffold (`config/`
settings, one placeholder app `service_api/core`, a `package.json` so Turborepo treats it like
any other workspace).

**Why:** None of the five product triggers had fired — this isn't a reversal of the 2026-09-02
decision on product-necessity grounds. The actual reason is a separate, legitimate one: wanting
to learn Django hands-on, against a real (if not-yet-product-critical) codebase, rather than a
disposable tutorial project. Treating "want to learn X" as its own explicit trigger, distinct
from the five product triggers, keeps that reasoning honest instead of dressing a learning
project up as a scaling necessity. The corollary in the 2026-09-02 entry already said this work
belongs here as `services/service-api` once it exists — this entry is that happening, on a
different trigger than the one originally anticipated.

**Consequence:** the standalone `moot-club` repo is superseded by `services/service-api` and is
not being maintained further — it was intentionally left as-is (not deleted or archived) rather
than folded via git history, since the actual code was re-scaffolded fresh here rather than
migrated file-for-file.

**Naming note:** Django's app-grouping folder here is `service_api/`, not `apps/` — this repo's
top-level `apps/` already means "deployable frontends," so nesting another `apps/` one level
down inside `service-api/` would read as a collision in docs/greps/chat out of context.

**Environment note:** `service-api`'s `package.json` scripts (`dev`/`build`/`lint`/`test:unit`)
call `.venv\Scripts\python.exe` directly rather than a bare `python`. On this Windows setup, a
bare `python` inside an npm-spawned subshell resolves to the App-execution-alias/`pymanager`
stub, not the workspace's own venv — pointing at the venv's interpreter directly sidesteps that
without needing the venv activated in every task invocation.
**Supersedes:** fulfills the corollary in 2026-09-02 — Trigger for standing up the first backend
service (does not reverse the five-trigger policy for any *other* future service).

## 2026-10-05 — service-api scripts go through a Node launcher; CI splits by toolchain
**Decision:** `service-api`'s `package.json` scripts no longer name an interpreter
(`.venv\Scripts\python.exe`). They call `node scripts/py.mjs <args>`, which prefers the workspace
venv for the current platform (`.venv/Scripts/python.exe` on Windows, `.venv/bin/python`
elsewhere) and falls back to `PATH` when no venv exists. `ruff` is pinned in a new
`requirements-dev.txt` (which includes `requirements.txt`) rather than in `requirements.txt`
itself. CI (`reusable-ci.yml`) now has two jobs: the existing Node matrix, filtered with
`--filter='!@moot-space/service-api'`, and a new `python` job that installs Python +
`requirements-dev.txt` and runs `lint`/`test:unit` for that one workspace.

**Why:** The 2026-09-04 environment note below was right about the cause (a bare `python` in an
npm-spawned shell on this Windows setup resolves to the App-execution-alias/`pymanager` stub) but
its fix only held on this machine. A literal `.venv\Scripts\python.exe` is unrunnable on Linux —
the shell strips the backslashes — and `.venv/` is gitignored, so adding the workspace to
Turborepo's task graph meant `npm run lint` could never pass on a runner. That, plus a
`package-lock.json` that was never regenerated when the workspace was added (`npm ci` refuses the
mismatch), is why CI on `main` was red from 2026-09-04 to today. A launcher keeps the venv-first
behavior the note wanted while making one script work on both platforms; CI drives it through
Turborepo rather than calling `ruff`/`manage.py` directly, so the `PATH` fallback is actually
exercised and a Windows-only regression can't pass unnoticed.

**Why two jobs rather than one:** installing a Python toolchain into each leg of a Node version
matrix tests nothing about Python (the matrix axis is irrelevant to it) and slows both legs. Split
jobs also mean a Django failure reads as a Django failure in the run summary.

**Consequence:** a fresh clone needs `python -m venv .venv` + `pip install -r requirements-dev.txt`
in `services/service-api` before `npm run lint` passes at the repo root. The four
`service_api/core` placeholder files (`admin.py`, `models.py`, `views.py`, `tests.py`) lost their
unused `startapp` imports, which ruff's default F401 rule flags; the imports come back when
something is actually registered.
**Supersedes:** the Environment note in 2026-09-04 — Fold moot-club in as services/service-api
(the diagnosis stands, the `.venv\Scripts\python.exe` remedy does not).

## 2026-10-24 — moot.space design system: tokens + global `ms-*` classes
**Decision:** `apps/web` adopts the moot.space design system (nature-green identity, prism light
model). Its source of truth is the Design System artifact
(https://claude.ai/artifact/ANJ5xn1qUzkpfmwHYJtsr9): `project/tokens.json` is compiled into
`apps/web/src/styles/tokens.css`, and its component stylesheet is copied to
`apps/web/src/styles/moot.css`. Components use those global `ms-*` classes; per-component scoped
CSS is kept only for layout glue (grids, breakpoints, sticky positioning). Theme is
`<html data-theme="daylight|canopy">`, set from `prefers-color-scheme` by `src/lib/theme.js`.
Surface finishes are `data-finish` attributes with one default per region (satin app, frosted
sidebar, prism auth card and profile header, matte chat, dappled empty states), overridable only
by a dev-only switcher (`components/dev/FinishSwitcher.vue`, loaded under `import.meta.env.DEV`).

**Why:** The previous UI kept ~1,500 lines of near-duplicate scoped CSS across four views on a
handful of hard-coded variables, so re-theming meant editing every view. Global classes + tokens
mean a colour, radius or finish change is one edit, and the same markup is documented and
previewed in the design system. Copying files rather than creating `packages/design-system`
follows the 2026-07-27 rule: there is one consumer. Tokens are copied, not fetched at build time,
so builds don't depend on the artifact being reachable.

**Consequence:** a token or `ms-*` change is made in the design system first, then copied into
`src/styles/` (both files say so in their header). The views were migrated behind a temporary
alias block that mapped the old variable names onto the new tokens, removed once no view used it.
