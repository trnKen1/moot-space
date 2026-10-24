<template>
  <details class="finish-dock ms-surface" data-finish="satin">
    <summary class="finish-dock__title">Finish: {{ ui.finishOverride || 'default' }} (dev only)</summary>
    <div class="ms-finish-switch" role="group" aria-label="Surface finish">
      <button
        type="button"
        :aria-pressed="ui.finishOverride === null"
        @click="ui.setFinishOverride(null)"
      >
        Default
      </button>
      <button
        v-for="finish in FINISHES"
        :key="finish"
        type="button"
        :aria-pressed="ui.finishOverride === finish"
        @click="ui.setFinishOverride(finish)"
      >
        <i></i>{{ finish }}
      </button>
    </div>
  </details>
</template>

<script setup>
import { FINISHES, useUiStore } from '../../store/ui'

const ui = useUiStore()
</script>

<style scoped>
.finish-dock {
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  z-index: 100;
  max-width: min(420px, calc(100vw - 2 * var(--space-4)));
  padding: var(--space-2) var(--space-3);
}

.finish-dock[open] .ms-finish-switch {
  margin-top: var(--space-2);
}

.finish-dock__title {
  font: 600 12px/16px var(--font-sans);
  color: var(--ink-muted);
  cursor: pointer;
}

.ms-finish-switch button {
  text-transform: capitalize;
}

@media (max-width: 600px) {
  .finish-dock {
    bottom: calc(70px + var(--space-4));
  }
}
</style>
