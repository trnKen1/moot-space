<template>
  <span
    :class="['ms-avatar', 'ms-lit', { 'ms-rim ms-avatar--ring': ring }]"
    :style="{ '--size': size + 'px' }"
  >
    <img
      v-if="src && !hasError"
      :src="src"
      :alt="alt || name || 'User avatar'"
      @error="hasError = true"
    />
    <span v-else class="ms-avatar__initials">{{ initials }}</span>
  </span>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  size: { type: Number, default: 40 },
  name: { type: String, default: '' },
  // Prism ring: use for the signed-in user and for people shown as online.
  ring: { type: Boolean, default: false }
})

// A broken image URL falls back to initials; a new URL gets another try.
const hasError = ref(false)
watch(() => props.src, () => { hasError.value = false })

const initials = computed(() => {
  if (!props.name) return '?'
  return props.name
    .split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})
</script>
