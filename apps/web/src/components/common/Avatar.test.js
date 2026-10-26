import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from './Avatar.vue'

describe('Avatar', () => {
  it('renders an <img> and no fallback when src is provided', () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/avatar.png', name: 'Kenji Thorne' }
    })

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('.ms-avatar__initials').exists()).toBe(false)
  })

  it('falls back to initials from name when no src is given', () => {
    const wrapper = mount(Avatar, {
      props: { name: 'Kenji Thorne' }
    })

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.ms-avatar__initials').text()).toBe('KT')
  })

  it('falls back to "?" when neither src nor name is given', () => {
    const wrapper = mount(Avatar)

    expect(wrapper.find('.ms-avatar__initials').text()).toBe('?')
  })

  it('falls back to initials when the image fails to load', async () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/broken.png', name: 'Kenji Thorne' }
    })

    await wrapper.find('img').trigger('error')

    expect(wrapper.find('img').exists()).toBe(false)
    expect(wrapper.find('.ms-avatar__initials').text()).toBe('KT')
  })

  it('retries the image when src changes after an error', async () => {
    const wrapper = mount(Avatar, {
      props: { src: 'https://example.com/broken.png', name: 'Kenji Thorne' }
    })
    await wrapper.find('img').trigger('error')

    await wrapper.setProps({ src: 'https://example.com/new.png' })

    expect(wrapper.find('img').attributes('src')).toBe('https://example.com/new.png')
  })

  it('applies the size prop as the --size custom property', () => {
    const wrapper = mount(Avatar, { props: { size: 64 } })

    expect(wrapper.find('.ms-avatar').attributes('style')).toContain('--size: 64px')
  })

  it('adds the prism ring only when ring is set', () => {
    expect(mount(Avatar).classes()).not.toContain('ms-avatar--ring')
    expect(mount(Avatar, { props: { ring: true } }).classes()).toContain('ms-avatar--ring')
  })
})
