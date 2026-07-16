<template>
  <div 
    class="avatar-container" 
    :style="{ width: size + 'px', height: size + 'px' }"
  >
    <img 
      v-if="src" 
      :src="src" 
      :alt="alt || 'User avatar'" 
      class="avatar-img"
      @error="handleImageError"
    />
    <div 
      v-else 
      class="avatar-fallback"
      :style="{ fontSize: (size * 0.4) + 'px' }"
    >
      {{ initials }}
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Avatar',
  props: {
    src: {
      type: String,
      default: ''
    },
    alt: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 40
    },
    name: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const hasError = ref(false)

    const handleImageError = () => {
      hasError.value = true
    }

    const initials = computed(() => {
      if (!props.name) return '?'
      return props.name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    })

    return {
      hasError,
      handleImageError,
      initials
    }
  }
}
</script>

<style scoped>
.avatar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border: 2px solid var(--border-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  user-select: none;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  color: var(--text-primary);
  font-weight: 600;
  letter-spacing: -0.5px;
}
</style>
