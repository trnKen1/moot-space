import { defineStore } from 'pinia'

// Surface finishes from the design system's light model (see src/styles/moot.css).
export const FINISHES = ['matte', 'satin', 'glossy', 'frosted', 'prism', 'dappled']

export const useUiStore = defineStore('ui', {
  state: () => ({
    // Set only by the dev finish switcher; null means every region uses its own default.
    finishOverride: null
  }),

  getters: {
    finishFor: (state) => (defaultFinish) => state.finishOverride || defaultFinish
  },

  actions: {
    setFinishOverride(finish) {
      this.finishOverride = FINISHES.includes(finish) ? finish : null
    }
  }
})
