import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('renders an <img> and no fallback when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/avatar.png', name: 'Kenji Thorne' }
    })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('.avatar-fallback').exists()).toBe(false)
  })

  it('falls back to initials from name when no src is given', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Kenji Thorne' }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.avatar-fallback').text()).toBe('KT')
  })

  it('falls back to "?" when neither src nor name is given', () => {
    const wrapper = mount(Avatar)

    expect(wrapper.find('.avatar-fallback').text()).toBe('?')
  })

  it('applies the size prop to width/height', () => {
    const wrapper = mount(Avatar, { props: { size: 64 } })

    const style = wrapper.find('.avatar-container').attributes('style')
    expect(style).toContain('width: 64px')
    expect(style).toContain('height: 64px')
  })
})
