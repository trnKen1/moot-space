# Architecture & Risk Audit — 2026-08-14

Structured audit of moot-space as it stands today: layers, request flow, and failure points.
Written to complement `architecture.md` (current-state snapshot) and `decisions.md` (why), not
replace them — this file is a point-in-time analysis, not living working memory.

## 1. Architectural layers

### Frontend — `apps/web` (`@moot-space/web`)
**What:** Vue 3 (`<script setup>`/Composition API) SPA, Vite build, Pinia for shared state,
vue-router for client-side routing, deployed as a static bundle.
**Why this shape:** Turborepo/npm-workspaces monorepo lets `services/*` and `packages/*` grow in
later without restructuring; Vite gives a fast local dev loop; Pinia keeps cross-view state (auth
session, chat) out of components once it's shared, per the project convention.
**Depends on:** `@supabase/supabase-js` (only external runtime dependency of substance), Vercel
for hosting/CDN.

### Backend-as-a-service — Supabase
**What:** Currently the *entire* backend. `@supabase/supabase-js` is called directly from the
browser (`apps/web/src/lib/supabase.js`) for auth; nothing else is wired to it yet.
**Why:** Deliberate choice (`decisions.md`, 2026-07-27) to avoid building custom services before
it's proven Supabase's client SDK + Realtime + RLS can't cover the need.
**Depends on:** A live Supabase project, reachable from the browser, with `VITE_SUPABASE_URL` and
`VITE_SUPABASE_PUBLISHABLE_KEY` supplied at build/runtime.

### Backend services — `services/*`
**What:** Empty. Scaffolded workspace namespace only (`services/README.md`).
**Why:** Stood up only when something needs logic Supabase's client API can't express — no such
need has been hit yet.
**Depends on:** N/A (nothing deployed).

### Shared packages — `packages/*`
**What:** Empty. Scaffolded namespace only, per the "don't pre-split before a second consumer
exists" convention.

### CI/CD
**What:** GitHub Actions (`main-ci.yml` → `reusable-ci.yml`), matrix-tested on Node 22.x/24.x,
running `npm ci`, lint, and unit tests on every push/PR to `main`/`develop`. No deploy step is
defined in CI — `vercel.json` (SPA rewrite config) implies Vercel handles build+deploy on push,
outside this repo's CI.
**Why:** Standard two-workflow split (caller + reusable) so CI logic is defined once; the
`fetch-depth: 0` checkout is pre-positioned for future Turborepo affected-package filtering but
unused today (single-package repo, not worth the base-ref complexity yet — noted directly in the
workflow comment).

## 2. Critical path: a typical request

**Cold load → authenticated Feed view:**
1. Browser requests `/` → Vercel serves the static SPA shell (`vercel.json` rewrites all paths to
   `index.html`, so this works for any deep link too).
2. `main.js` boots: creates the Vue app + Pinia, then **awaits** `authStore.init()` before
   mounting the router. This is a blocking call to `supabase.auth.getSession()` — a network
   round-trip to Supabase Auth on every cold load, before the app becomes interactive.
3. `authStore.init()` also registers `onAuthStateChange` for live session updates (token refresh,
   sign-out in another tab, etc.).
4. Router mounts; `router.beforeEach` guard checks `authStore.isAuthenticated`. Unauthenticated →
   redirected to `/auth`. Authenticated → proceeds to the requested route (Feed/Profile/Chat).
5. View components render. **Feed and Chat data do not come from Supabase at all** — `HomeFeed.vue`
   has its own local `ref([...])` of hardcoded posts, and `store/chat.js` (Pinia) holds hardcoded
   conversations/messages. Nothing here issues a second network call; the "critical path" for
   content is currently just static in-memory data.

**Sending a chat message (current, mocked, implementation):**
1. `ChatRoom.vue` calls `chatStore.sendMessage(text)`.
2. Store pushes the message into `messagesByConversation` synchronously (no network I/O).
3. Store calls `simulateReply()`, which schedules a `setTimeout(2000ms)` that picks a random
   canned string and pushes it as if the other party replied.
4. Nothing is persisted — a page reload loses all chat state, and two browser tabs / two users
   never see each other's messages. This is a UI prototype loop, not a working chat feature.

**Login/signup (real path, already live):**
1. `AuthPage.vue` → `authStore.login()`/`signup()` → `supabase.auth.signInWithPassword` /
   `signUp()`.
2. On signup, if the Supabase project has email confirmation on (the default for new projects),
   `signUp()` returns no session — the store surfaces "check your email" rather than logging in.
3. On success, `onAuthStateChange` (registered in step 3 above) and the direct state update in
   the action both fire — session state is set twice on the happy path, harmlessly redundant.

## 3. Risk areas / potential breaking points

| # | Risk | Where | Why it matters |
|---|------|-------|-----------------|
| 1 | **Single point of failure: Supabase.** All auth goes through one external SaaS with no fallback. If Supabase Auth is down or unreachable, nobody can log in — there's no cached/offline session bootstrap path beyond whatever `getSession()` returns from local storage. | `apps/web/src/store/auth.js`, `lib/supabase.js` | Total auth outage = total app outage for any new session; existing sessions may still work client-side until token refresh fails. |
| 2 | **Hard crash on missing config, with no example file to fix it.** `lib/supabase.js` throws synchronously at import time if `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` are unset — this blanks the entire app (white screen, app never mounts). The thrown message tells the developer to "copy `.env.example`", but **no `.env.example` file exists in the repo** (verified: no `*.env*` file present anywhere in the tree). | `apps/web/src/lib/supabase.js:6-10` | Any fresh clone or misconfigured deploy fails hard with a misleading self-reference; there's no documented list of the two required var names anywhere else in the repo. |
| 3 | **No error handling around `getSession()` on boot.** `authStore.init()` awaits `supabase.auth.getSession()` with no try/catch. A network failure, DNS issue, or Supabase outage during this call throws unhandled inside `main.js`'s top-level `await`, which can prevent the app from mounting at all rather than degrading to "logged out". | `apps/web/src/store/auth.js:35-47`, `main.js:14` | Turns a transient network blip into a full app-boot failure instead of a graceful "you're logged out, try again" state. |
| 4 | **Chat has zero persistence and zero real-time delivery.** All conversation/message data lives in a Pinia store initialized from a hardcoded literal, mutated in memory, with replies faked via `setTimeout` + `Math.random()`. Nothing survives a reload; nothing is shared between two logged-in users. This is flagged as a known placeholder in `architecture.md`/`plan.md`, not a surprise — but it means **the Chat feature does not functionally exist yet** despite the UI being fully built. | `apps/web/src/store/chat.js` | Anyone testing/demoing chat cross-session or cross-device will see it silently fail to sync — no error, just divergent local state. |
| 5 | **Feed content is also mocked, and inconsistently — not even in a store.** Unlike chat (mocked but at least centralized in Pinia), `HomeFeed.vue` keeps its post list as a component-local `ref([...])`. This is fine while nothing else consumes it, but it diverges from the project's own stated convention ("state lives in Pinia stores... once it's shared across views") and will need to move if e.g. a post-detail view or profile page needs to reference the same posts. | `apps/web/src/views/HomeFeed.vue:122` | Low risk today (single consumer), but a latent inconsistency that will need cleanup before Feed is wired to real data — worth fixing at that point rather than extending the local-ref pattern further. |
| 6 | **No RLS/schema visible in-repo.** Supabase Row-Level Security policies and schema (if any exist) live outside this repository, in the Supabase project itself. There's no migration file, schema definition, or policy-as-code checked in anywhere. | N/A — external to repo | Auth/data-access rules aren't reviewable or version-controlled from the codebase; a misconfigured RLS policy on the live project would be invisible to code review. This is an open architectural question already tracked in `architecture.md`. |
| 7 | **CI has no deploy gate.** GitHub Actions runs lint + unit tests only; there's no CI step that runs a production build (`vite build`) or type-checks before merge. `vercel.json` implies Vercel builds independently on push, meaning a build-breaking change could pass CI (lint/tests) and only fail at Vercel's own build step, post-merge. | `.github/workflows/reusable-ci.yml` | A red Vercel deploy is currently the first signal of a build failure, not CI — later in the pipeline than ideal. |
| 8 | **Anonymous/single external avatar dependency.** Both mock data and real signup flow (`store/auth.js:15`, `HomeFeed.vue`, `store/chat.js`) hardcode `api.dicebear.com` URLs for avatars, with no fallback if that third-party service is unreachable. | Multiple files | Low-severity but pervasive — broken avatar images app-wide if DiceBear is down, no local placeholder. |

## 4. Framework/dependency notes

- **Vue 3 + Vite + Pinia + vue-router**: mainstream, low-risk choice; no unusual version pinning
  beyond caret ranges (`vue ^3.5.39`, `vite ^8.1.1` — Vite 8 is comparatively new).
- **Vitest + jsdom** for unit tests; only `Avatar`, `Sidebar`, and the two stores currently have
  tests (`*.test.js` files found: `Avatar.test.js`, `Sidebar.test.js`, `auth.test.js`,
  `chat.test.js`) — no tests exist for the four view components (`HomeFeed`, `UserProfile`,
  `ChatRoom`, `AuthPage`), which carry most of the current UI logic.
- **Deployment model**: static SPA on Vercel, SPA-rewrite-only routing config
  (`apps/web/vercel.json`) — no server-side rendering, no edge functions in use.
- **npm workspaces + Turborepo**: `turbo.json` defines `build`/`lint`/`test:unit`/`dev` tasks;
  with only one real package (`@moot-space/web`) today, Turborepo's caching/parallelism benefit
  is currently latent, not yet exercised — it's infrastructure for the monorepo's future, not a
  present necessity.

## 5. Open questions (unclear / needs confirmation)

- Whether a Supabase schema for conversations/messages exists yet in the live project (can't be
  determined from this repo — no migrations checked in). Tracked in `architecture.md`/`todo.md`.
- Whether Vercel's build configuration (env vars, build command/root directory for the monorepo)
  is set up to inject `VITE_SUPABASE_URL`/`VITE_SUPABASE_PUBLISHABLE_KEY` — not visible from the
  repo; risk #2 above is only survivable in production if Vercel's dashboard has these set.
