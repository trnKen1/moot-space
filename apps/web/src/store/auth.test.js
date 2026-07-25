import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: {
    getSession: vi.fn(),
    signInWithPassword: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn()
  }
}))

vi.mock('../lib/supabase', () => ({
  supabase: { auth: mockAuth }
}))

const { useAuthStore } = await import('./auth')

describe('auth store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockAuth.getSession.mockResolvedValue({ data: { session: null } })
    mockAuth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
  })

  it('starts unauthenticated until init() resolves', () => {
    const store = useAuthStore()
    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })

  it('init() restores an existing session', async () => {
    mockAuth.getSession.mockResolvedValue({
      data: {
        session: {
          user: {
            id: 'usr_1',
            email: 'kenji@moot.space',
            user_metadata: { name: 'Kenji Thorne', handle: 'kenji_thorne' }
          }
        }
      }
    })

    const store = useAuthStore()
    await store.init()

    expect(store.isAuthenticated).toBe(true)
    expect(store.user.name).toBe('Kenji Thorne')
    expect(store.user.handle).toBe('kenji_thorne')
  })

  it('login() sets the user and marks authenticated on success', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'usr_2', email: 'someone@example.com', user_metadata: {} } },
      error: null
    })

    const store = useAuthStore()
    const result = await store.login('someone@example.com', 'secret')

    expect(result).toBe(true)
    expect(store.isAuthenticated).toBe(true)
    expect(store.user.email).toBe('someone@example.com')
    expect(store.isLoading).toBe(false)
  })

  it('login() surfaces the error message on failure', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: {},
      error: { message: 'Invalid login credentials' }
    })

    const store = useAuthStore()
    const result = await store.login('someone@example.com', 'wrong')

    expect(result).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toBe('Invalid login credentials')
  })

  it('signup() strips "@" and lowercases the handle', async () => {
    mockAuth.signUp.mockResolvedValue({
      data: {
        user: { id: 'usr_3', email: 'new@example.com', user_metadata: { name: 'New Person', handle: 'new_person' } },
        session: { user: { id: 'usr_3' } }
      },
      error: null
    })

    const store = useAuthStore()
    const result = await store.signup('New Person', '@New_Person', 'new@example.com', 'secret')

    expect(result).toBe(true)
    expect(mockAuth.signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new@example.com',
        password: 'secret',
        options: expect.objectContaining({
          data: expect.objectContaining({ handle: 'new_person' })
        })
      })
    )
    expect(store.user.handle).toBe('new_person')
    expect(store.isAuthenticated).toBe(true)
  })

  it('signup() reports pending email confirmation when no session is returned', async () => {
    mockAuth.signUp.mockResolvedValue({
      data: { user: { id: 'usr_4' }, session: null },
      error: null
    })

    const store = useAuthStore()
    const result = await store.signup('New Person', 'new_person', 'new@example.com', 'secret')

    expect(result).toBe(false)
    expect(store.isAuthenticated).toBe(false)
    expect(store.error).toMatch(/confirm/i)
  })

  it('logout() clears user state', async () => {
    mockAuth.signInWithPassword.mockResolvedValue({
      data: { user: { id: 'usr_5', email: 'someone@example.com', user_metadata: {} } },
      error: null
    })
    mockAuth.signOut.mockResolvedValue({ error: null })

    const store = useAuthStore()
    await store.login('someone@example.com', 'secret')

    await store.logout()

    expect(store.user).toBeNull()
    expect(store.isAuthenticated).toBe(false)
  })
})
