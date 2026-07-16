import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useChatStore } from './chat'

describe('chat store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('activeConversation/activeMessages getters reflect activeConversationId', () => {
    const store = useChatStore()

    expect(store.activeConversation.id).toBe('conv_1')
    expect(store.activeMessages.length).toBeGreaterThan(0)
  })

  it('setActiveConversation() switches the active thread and marks it read', () => {
    const store = useChatStore()

    store.setActiveConversation('conv_2')

    expect(store.activeConversationId).toBe('conv_2')
    expect(store.activeConversation.id).toBe('conv_2')
    const conv2 = store.conversations.find(c => c.id === 'conv_2')
    expect(conv2.unread).toBe(false)
  })

  it('sendMessage() appends a message and updates the conversation preview', () => {
    const store = useChatStore()
    const before = store.activeMessages.length

    store.sendMessage('hello there')

    expect(store.activeMessages.length).toBe(before + 1)
    expect(store.activeMessages.at(-1).text).toBe('hello there')
    expect(store.activeConversation.lastMessage).toBe('hello there')
    expect(store.activeConversation.timestamp).toBe('Just now')
  })

  it('sendMessage() ignores blank/whitespace-only text', () => {
    const store = useChatStore()
    const before = store.activeMessages.length

    store.sendMessage('   ')

    expect(store.activeMessages.length).toBe(before)
  })
})
