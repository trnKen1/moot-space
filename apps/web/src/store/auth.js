import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

function mapUser(supabaseUser) {
  if (!supabaseUser) return null

  const meta = supabaseUser.user_metadata || {}
  const handle = meta.handle || supabaseUser.email?.split('@')[0] || supabaseUser.id

  return {
    id: supabaseUser.id,
    name: meta.name || handle,
    handle,
    email: supabaseUser.email,
    avatar: meta.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${handle}`,
    bio: meta.bio || '',
    followers: meta.followers || 0,
    following: meta.following || 0,
    postsCount: meta.postsCount || 0
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    initialized: false
  }),

  actions: {
    // Restores any existing session on app load. Must be awaited before the
    // router's auth guard runs, otherwise a refresh briefly looks logged out.
    async init() {
      if (this.initialized) return

      const { data: { session } } = await supabase.auth.getSession()
      this.user = mapUser(session?.user)
      this.isAuthenticated = !!session
      this.initialized = true

      supabase.auth.onAuthStateChange((_event, session) => {
        this.user = mapUser(session?.user)
        this.isAuthenticated = !!session
      })
    },

    async login(email, password) {
      this.isLoading = true
      this.error = null

      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error

        this.user = mapUser(data.user)
        this.isAuthenticated = true
        return true
      } catch (err) {
        this.error = err.message || 'Invalid email or password'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async signup(name, handle, email, password) {
      this.isLoading = true
      this.error = null

      try {
        const cleanHandle = handle.replace('@', '').toLowerCase()
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              handle: cleanHandle,
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanHandle}`
            }
          }
        })
        if (error) throw error

        // Email confirmation is on by default in new Supabase projects, in
        // which case signUp() succeeds but returns no session yet.
        if (!data.session) {
          this.error = 'Check your email to confirm your account, then sign in.'
          return false
        }

        this.user = mapUser(data.user)
        this.isAuthenticated = true
        return true
      } catch (err) {
        this.error = err.message || 'Signup failed, please try again.'
        return false
      } finally {
        this.isLoading = false
      }
    },

    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.isAuthenticated = false
    }
  }
})
