import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import AuthPage from './AuthPage.vue'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() })
}))

vi.mock('../lib/supabase', () => ({
  supabase: { auth: {} }
}))

const { useAuthStore } = await import('../store/auth')

describe('AuthPage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('links every label to its input', () => {
    const wrapper = mount(AuthPage)

    for (const label of wrapper.findAll('label')) {
      expect(wrapper.find(`#${label.attributes('for')}`).exists()).toBe(true)
    }
  })

  it('switches tabs with the arrow keys and keeps one tab focusable', async () => {
    const wrapper = mount(AuthPage, { attachTo: document.body })
    const signIn = wrapper.find('#tab-login')

    await signIn.trigger('keydown', { key: 'ArrowRight' })

    const register = wrapper.find('#tab-signup')
    expect(register.attributes('aria-selected')).toBe('true')
    expect(register.attributes('tabindex')).toBe('0')
    expect(wrapper.find('#tab-login').attributes('tabindex')).toBe('-1')
    expect(wrapper.find('#panel-signup').exists()).toBe(true)
    expect(document.activeElement).toBe(register.element)

    wrapper.unmount()
  })

  it('wraps from the first tab to the last with ArrowLeft', async () => {
    const wrapper = mount(AuthPage)

    await wrapper.find('#tab-login').trigger('keydown', { key: 'ArrowLeft' })

    expect(wrapper.find('#tab-signup').attributes('aria-selected')).toBe('true')
  })

  it('announces auth errors in an alert banner', async () => {
    const wrapper = mount(AuthPage)
    useAuthStore().error = 'Invalid login credentials'
    await wrapper.vm.$nextTick()

    const banner = wrapper.find('[role="alert"]')
    expect(banner.text()).toBe('Invalid login credentials')
  })
})
