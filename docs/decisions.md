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
