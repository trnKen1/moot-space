# Todo (current working checklist)

Short-lived, working-session scope. Longer-term items belong in `plan.md`; the reasoning behind
a choice belongs in `decisions.md`. Clear out finished items rather than letting this grow
forever.

- [x] Confirm whether `store/auth.js` already talks to Supabase or is still mocked like
      `store/chat.js` — confirmed real: `login`/`signup`/`logout`/`init` all call
      `supabase.auth.*`, with session restore + `onAuthStateChange` wired on boot. Only
      `store/chat.js` (and `HomeFeed.vue`'s local post list) are still mocked. See
      `docs/architecture-audit.md` for the full pass.
- [ ] Design the Supabase schema for conversations/messages (or confirm one already exists in
      the Supabase project)
- [ ] Add a `.env.example` to `apps/web` — `lib/supabase.js` tells developers to copy one but it
      doesn't exist in the repo (see architecture-audit.md, risk #2)
- [ ] Wire `chat.js` actions (`setActiveConversation`, `sendMessage`) to real Supabase calls,
      replacing the `simulateReply` stub
