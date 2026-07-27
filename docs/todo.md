# Todo (current working checklist)

Short-lived, working-session scope. Longer-term items belong in `plan.md`; the reasoning behind
a choice belongs in `decisions.md`. Clear out finished items rather than letting this grow
forever.

- [ ] Confirm whether `store/auth.js` already talks to Supabase or is still mocked like
      `store/chat.js`
- [ ] Design the Supabase schema for conversations/messages (or confirm one already exists in
      the Supabase project)
- [ ] Wire `chat.js` actions (`setActiveConversation`, `sendMessage`) to real Supabase calls,
      replacing the `simulateReply` stub
