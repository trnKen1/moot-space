import { nextTick, ref } from 'vue'

// Keyboard behaviour for an ARIA tablist (roving tabindex): only the selected tab is in
// the Tab order, and arrow keys select + focus the neighbouring tab, wrapping at the ends.
// Template wiring: :ref="setEl(id)", :tabindex="current === id ? 0 : -1",
// @keydown.left.prevent="move(-1)", @keydown.right.prevent="move(1)".
export function useRovingTabs(ids, initial = ids[0]) {
  const current = ref(initial)
  const els = {}

  const setEl = (id) => (el) => { els[id] = el }

  const move = async (step) => {
    const index = ids.indexOf(current.value)
    current.value = ids[(index + step + ids.length) % ids.length]
    await nextTick()
    els[current.value]?.focus()
  }

  return { current, setEl, move }
}
