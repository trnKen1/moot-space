import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import PostCard from './PostCard.vue'

const author = { name: 'Moss Fielding', handle: 'moss', avatar: '' }
const post = { text: 'Ferns unfurling by the creek.', timestamp: '2h ago', likes: 3, isLiked: false, comments: 1 }

function mountCard(props = {}) {
  return mount(PostCard, { props: { post, author, ...props } })
}

describe('PostCard', () => {
  it('shows the author, handle, time and text', () => {
    const wrapper = mountCard()

    expect(wrapper.find('.ms-post__name').text()).toBe('Moss Fielding')
    expect(wrapper.find('.ms-post__meta').text()).toBe('@moss · 2h ago')
    expect(wrapper.find('.ms-post__text').text()).toBe('Ferns unfurling by the creek.')
  })

  it('reflects the liked state on the like button', () => {
    expect(mountCard().find('.ms-action').attributes('aria-pressed')).toBe('false')
    expect(mountCard({ post: { ...post, isLiked: true } }).find('.ms-action').attributes('aria-pressed')).toBe('true')
  })

  it('asks the parent to toggle the like instead of changing the post itself', async () => {
    const wrapper = mountCard()

    await wrapper.find('.ms-action').trigger('click')

    expect(wrapper.emitted('toggle-like')).toHaveLength(1)
    expect(post.likes).toBe(3)
  })

  it('hides the share action when not shareable', () => {
    expect(mountCard().find('[aria-label="Share"]').exists()).toBe(true)
    expect(mountCard({ shareable: false }).find('[aria-label="Share"]').exists()).toBe(false)
  })
})
