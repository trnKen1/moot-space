import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useUiStore } from './ui'

describe('ui store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('uses each region\'s default finish when nothing is overridden', () => {
    const ui = useUiStore()

    expect(ui.finishFor('frosted')).toBe('frosted')
    expect(ui.finishFor('satin')).toBe('satin')
  })

  it('applies an override to every region', () => {
    const ui = useUiStore()
    ui.setFinishOverride('glossy')

    expect(ui.finishFor('frosted')).toBe('glossy')
    expect(ui.finishFor('satin')).toBe('glossy')
  })

  it('ignores unknown finishes and clears back to defaults', () => {
    const ui = useUiStore()
    ui.setFinishOverride('glossy')
    ui.setFinishOverride('sparkly')

    expect(ui.finishOverride).toBe(null)
    expect(ui.finishFor('frosted')).toBe('frosted')
  })
})
