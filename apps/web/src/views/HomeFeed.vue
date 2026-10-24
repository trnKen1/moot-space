<template>
  <div class="feed-layout">
    <div class="feed-main ms-stack">
      <header class="ms-feed-head">
        <h1>Feed</h1>
        <span class="ms-badge">Dev Square</span>
      </header>

      <section class="ms-surface ms-composer" aria-label="New post">
        <Avatar :src="user.avatar" :name="user.name" :size="48" ring />
        <form class="ms-composer__body" @submit.prevent="submitPost">
          <label for="composer-text" class="sr-only">New post</label>
          <textarea
            id="composer-text"
            v-model="newPostText"
            class="ms-textarea"
            placeholder="What's growing in your space today?"
            rows="3"
            :maxlength="MAX_POST_LENGTH"
            required
          ></textarea>
          <div class="ms-composer__actions">
            <span :class="['ms-count', { 'ms-count--limit': remaining < 30 }]">
              {{ remaining }}<span class="sr-only"> characters left</span>
            </span>
            <button type="submit" class="ms-btn ms-btn--primary ms-lit">Post</button>
          </div>
        </form>
      </section>

      <transition-group name="post-list" tag="div" class="ms-stack">
        <PostCard
          v-for="post in posts"
          :key="post.id"
          :post="post"
          :author="post.author"
          @toggle-like="toggleLike(post)"
        />
      </transition-group>
    </div>

    <aside class="feed-widgets ms-stack" aria-label="Discover">
      <section class="ms-surface ms-widget" aria-labelledby="trending-title">
        <h2 id="trending-title">Trending topics</h2>
        <div v-for="tag in trends" :key="tag.topic" class="ms-widget__row">
          <div class="ms-widget__grow">
            <span class="ms-topic">#{{ tag.topic }}</span>
            <span class="ms-count">{{ tag.count }} posts</span>
          </div>
        </div>
      </section>

      <section class="ms-surface ms-widget" aria-labelledby="follow-title">
        <h2 id="follow-title">Moots to follow</h2>
        <div v-for="dev in recommendedDevs" :key="dev.handle" class="ms-widget__row">
          <Avatar :src="dev.avatar" :name="dev.name" :size="36" />
          <div class="ms-widget__grow">
            <span class="ms-post__name">{{ dev.name }}</span>
            <span class="ms-post__meta">@{{ dev.handle }}</span>
          </div>
          <button type="button" class="ms-btn ms-btn--secondary ms-btn--sm">Follow</button>
        </div>
      </section>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import Avatar from '../components/common/Avatar.vue'
import PostCard from '../components/feed/PostCard.vue'

const MAX_POST_LENGTH = 280

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const newPostText = ref('')
const remaining = computed(() => MAX_POST_LENGTH - newPostText.value.length)

const posts = ref([
  {
    id: 1,
    author: {
      name: 'Sarah Chen',
      handle: 'sarah_c',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=sarah'
    },
    text: 'Scaffolded the new web-app with Vite. The dev server boots up in less than 200ms. If you are still using legacy Webpack setups, this is your sign to migrate! ⚡ #webdev #vue',
    timestamp: '2h ago',
    likes: 42,
    isLiked: false,
    comments: 12
  },
  {
    id: 2,
    author: {
      name: 'Alex Martinez',
      handle: 'alex_m',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=alex'
    },
    text: 'Creating custom CSS utility tokens. Glassmorphic cards coupled with CSS variables make modifying themes and transitions absolute bliss. ✨',
    timestamp: '5h ago',
    likes: 18,
    isLiked: true,
    comments: 4
  },
  {
    id: 3,
    author: {
      name: 'Elena Rostova',
      handle: 'elena_r',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=elena'
    },
    text: 'Designing a real-time message payload structure for WebSocket integration. What are your thoughts on storing conversation logs locally in IndexedDB as a fallback sync cache?',
    timestamp: '1d ago',
    likes: 64,
    isLiked: false,
    comments: 21
  }
])

const trends = ref([
  { topic: 'vuejs', count: '1.2k' },
  { topic: 'vite', count: '890' },
  { topic: 'webdev', count: '740' },
  { topic: 'firebase', count: '520' }
])

const recommendedDevs = ref([
  { name: 'Mikael Sund', handle: 'mikael_s', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=mikael' },
  { name: 'Chloe Wu', handle: 'chloe_w', avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=chloe' }
])

const submitPost = () => {
  if (!newPostText.value.trim()) return

  const newPost = {
    id: Date.now(),
    author: {
      name: user.value.name,
      handle: user.value.handle,
      avatar: user.value.avatar
    },
    text: newPostText.value,
    timestamp: 'Just now',
    likes: 0,
    isLiked: false,
    comments: 0
  }

  posts.value.unshift(newPost)
  newPostText.value = ''
}

const toggleLike = (post) => {
  post.isLiked = !post.isLiked
  post.likes = post.isLiked ? post.likes + 1 : post.likes - 1
}

</script>

<style scoped>
.feed-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: var(--space-8);
  max-width: 1100px;
  margin: 0 auto;
  align-items: start;
}

.feed-widgets {
  position: sticky;
  top: 0;
}

/* New posts drop in from above */
.post-list-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.post-list-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1100px) {
  .feed-layout {
    grid-template-columns: minmax(0, 1fr);
  }
  .feed-widgets {
    display: none;
  }
}
</style>
