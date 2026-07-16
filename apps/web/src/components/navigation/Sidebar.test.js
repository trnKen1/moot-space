import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import Sidebar from './Sidebar.vue'
import { useAuthStore } from '../../store/auth'
import { useChatStore } from '../../store/chat'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({ push })
}))

function mountSidebar() {
  return mount(Sidebar, {
    global: {
      stubs: { RouterLink: { template: '<a><slot /></a>' } }
    }
  })
}

describe('Sidebar', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
    push.mockClear()
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

    expect(authStore.isAuthenticated).toBe(false)
    expect(push).toHaveBeenCalledWith({ name: 'Auth' })
  })
})
