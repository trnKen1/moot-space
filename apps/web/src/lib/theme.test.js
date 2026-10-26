import { describe, expect, it } from 'vitest'
import { syncTheme, themeFor } from './theme'

function fakeMedia(matches) {
  const listeners = new Set()
  return {
    matches,
    addEventListener: (_type, fn) => listeners.add(fn),
    removeEventListener: (_type, fn) => listeners.delete(fn),
    flip() {
      this.matches = !this.matches
      listeners.forEach(fn => fn())
    },
    listeners
  }
}

describe('theme', () => {
  it('maps the OS preference to a theme id', () => {
    expect(themeFor(false)).toBe('daylight')
    expect(themeFor(true)).toBe('canopy')
  })

  it('sets data-theme now and follows OS changes', () => {
    const root = document.createElement('html')
    const media = fakeMedia(false)

    syncTheme(root, media)
    expect(root.dataset.theme).toBe('daylight')

    media.flip()
    expect(root.dataset.theme).toBe('canopy')
  })

  it('stops following once cleaned up', () => {
    const root = document.createElement('html')
    const media = fakeMedia(true)

    const stop = syncTheme(root, media)
    stop()

    expect(media.listeners.size).toBe(0)
  })
})
