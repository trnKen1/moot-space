import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from './auth'

describe('auth store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('seeds a default demo user when nothing is in localStorage', () => {
    const store = useAuthStore()
    expect(store.user.name).toBe('Kenji Thorne')
    expect(store.user.handle).toBe('kenji_thorne')
  })

  it('login() sets the user, marks authenticated, and persists to localStorage', async () => {
    const store = useAuthStore()

    const result = await store.login('someone@example.com', 'secret')

    expect(result).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user.email).toBe('someone@example.com')
    expect(store.isLoading).toBe(false)
    expect(JSON.parse(localStorage.getItem('moot_user')).email).toBe('someone@example.com')
    expect(localStorage.getItem('moot_user_token')).toBe('mock-token-xyz')
  })

  it('signup() strips "@" and lowercases the handle, and zeroes out counts', async () => {
    const store = useAuthStore()

    const result = await store.signup('New Person', '@New_Person', 'new@example.com', 'secret')

    expect(result).toBe(true)
    expect(store.user.handle).toBe('new_person')
    expect(store.user.followers).toBe(0)
    expect(store.user.following).toBe(0)
    expect(store.user.postsCount).toBe(0)
    expect(store.isAuthenticated).toBe(true)
  })

  it('logout() clears user state and localStorage', async () => {
    const store = useAuthStore()
    await store.login('someone@example.com', 'secret')

    store.logout()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
    expect(localStorage.getItem('moot_user')).toBeNull()
    expect(localStorage.getItem('moot_user_token')).toBeNull()
  })
})
