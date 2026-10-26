<template>
  <article class="post-card ms-surface ms-post">
    <header class="ms-post__head">
      <Avatar :src="author.avatar" :name="author.name" :size="40" />
      <div class="ms-post__who">
        <span class="ms-post__name">{{ author.name }}</span>
        <span class="ms-post__meta">@{{ author.handle }} · {{ post.timestamp }}</span>
      </div>
    </header>

    <p class="ms-post__text">{{ post.text }}</p>

    <footer class="ms-post__actions">
      <button
        type="button"
        class="ms-action"
        :aria-pressed="post.isLiked"
        @click="emit('toggle-like')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
        <span class="sr-only">Like</span>
        <span>{{ post.likes }}</span>
      </button>
      <button type="button" class="ms-action">
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="sr-only">Comments</span>
        <span>{{ post.comments }}</span>
      </button>
      <button v-if="shareable" type="button" class="ms-action" aria-label="Share">
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 10.742l4.636-2.318a3 3 0 11.836 1.672l-4.636 2.318a3 3 0 11-.836-1.672zM12 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
        </svg>
      </button>
    </footer>
  </article>
</template>

<script setup>
import Avatar from '../common/Avatar.vue'

defineProps({
  // { text, timestamp, likes, isLiked, comments }
  post: { type: Object, required: true },
  // { name, handle, avatar }
  author: { type: Object, required: true },
  shareable: { type: Boolean, default: true }
})

// The parent owns the post data, so it decides what a like does.
const emit = defineEmits(['toggle-like'])
</script>

<style scoped>
.post-card {
  transition: transform 0.2s ease;
}

.post-card:hover {
  transform: translateY(-1px);
}
</style>
