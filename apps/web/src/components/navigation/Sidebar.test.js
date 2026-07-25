import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Sidebar from './Sidebar.vue'
import { useChatStore } from '../../store/chat'

const { push, mockAuth } = vi.hoisted(() => ({
  push: vi.fn(),
  mockAuth: {
    getSession: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn()
  }
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

vi.mock('../../lib/supabase', () => ({
  supabase: { auth: mockAuth }
}))

const { useAuthStore } = await import('../../store/auth')

function mountSidebar() {
  return mount(Sidebar, {
    global: {
      stubs: { RouterLink: { template: '<a><slot /></a>' } }
    }
  })
}

describe('Sidebar', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    push.mockClear()

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
    mockAuth.onAuthStateChange.mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } })
    mockAuth.signOut.mockResolvedValue({ error: null })

    await useAuthStore().init()
  })

  it('renders the current user name and handle', () => {
    const wrapper = mountSidebar()

    expect(wrapper.find('.user-info .name').text()).toBe('Kenji Thorne')
    expect(wrapper.find('.user-info .handle').text()).toBe('@kenji_thorne')
  })

  it('shows the unread badge when a conversation is unread', () => {
    const wrapper = mountSidebar()

    expect(wrapper.find('.badge').exists()).toBe(true)
  })

  it('hides the unread badge when nothing is unread', () => {
    const chatStore = useChatStore()
    chatStore.conversations.forEach(c => { c.unread = false })

    const wrapper = mountSidebar()

    expect(wrapper.find('.badge').exists()).toBe(false)
  })

  it('logs out and navigates to Auth when the logout button is clicked', async () => {
    const authStore = useAuthStore()
    const wrapper = mountSidebar()

    await wrapper.find('.logout-btn').trigger('click')
    await flushPromises()

    expect(authStore.isAuthenticated).toBe(false)
    expect(push).toHaveBeenCalledWith({ name: 'Auth' })
  })
})
