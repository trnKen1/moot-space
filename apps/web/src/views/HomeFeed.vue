<template>
  <div class="feed-layout">
    <!-- Main Feed Area -->
    <main class="feed-main">
      <header class="feed-header">
        <h1>Feed</h1>
        <div class="trending-badge glass">✨ Dev Square</div>
      </header>

      <!-- Composer Card -->
      <div class="composer glass glass-glow">
        <Avatar :src="user.avatar" :name="user.name" :size="46" />
        <form @submit.prevent="submitPost" class="composer-form">
          <textarea 
            v-model="newPostText" 
            placeholder="What's happening in your dev environment today?" 
            rows="3"
            maxlength="280"
            required
          ></textarea>
          <div class="composer-actions">
            <span class="char-count" :class="{ limit: newPostText.length > 250 }">
              {{ 280 - newPostText.length }}
            </span>
            <button type="submit" class="post-btn">
              Post Space
            </button>
          </div>
        </form>
      </div>

      <!-- Posts List -->
      <transition-group name="post-list" tag="div" class="posts-container">
        <div 
          v-for="post in posts" 
          :key="post.id" 
          class="post-card glass"
        >
          <div class="post-header">
            <Avatar :src="post.author.avatar" :name="post.author.name" :size="42" />
            <div class="author-details">
              <span class="name">{{ post.author.name }}</span>
              <span class="handle">@{{ post.author.handle }}</span>
              <span class="dot">·</span>
              <span class="time">{{ post.timestamp }}</span>
            </div>
          </div>
          <div class="post-content">
            <p>{{ post.text }}</p>
          </div>
          <div class="post-footer">
            <button 
              :class="['action-btn', 'like-btn', { liked: post.isLiked }]"
              @click="toggleLike(post)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" :fill="post.isLiked ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{{ post.likes }}</span>
            </button>
            <button class="action-btn comment-btn">
              <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{{ post.comments }}</span>
            </button>
            <button class="action-btn share-btn">
              <svg xmlns="http://www.w3.org/2000/svg" class="action-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 10.742l4.636-2.318a3 3 0 11.836 1.672l-4.636 2.318a3 3 0 11-.836-1.672zM12 5.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </main>

    <!-- Sidebar Widgets -->
    <aside class="feed-widgets">
      <div class="widget glass">
        <h3>Trending Topics</h3>
        <ul class="trending-list">
          <li v-for="tag in trends" :key="tag.topic">
            <span class="topic">#{{ tag.topic }}</span>
            <span class="posts-count">{{ tag.count }} posts</span>
          </li>
        </ul>
      </div>

      <div class="widget glass">
        <h3>Devs to Follow</h3>
        <div class="follow-recommendations">
          <div v-for="dev in recommendedDevs" :key="dev.handle" class="dev-item">
            <Avatar :src="dev.avatar" :name="dev.name" :size="38" />
            <div class="dev-info">
              <div class="dev-name">{{ dev.name }}</div>
              <div class="dev-handle">@{{ dev.handle }}</div>
            </div>
            <button class="follow-btn">Follow</button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import Avatar from '../components/common/Avatar.vue'

export default {
  name: 'HomeFeed',
  components: {
    Avatar
  },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    
    const newPostText = ref('')
    
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

    return {
      user,
      newPostText,
      posts,
      trends,
      recommendedDevs,
      submitPost,
      toggleLike
    }
  }
}
</script>

<style scoped>
.feed-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2rem;
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 1100px) {
  .feed-layout {
    grid-template-columns: 1fr;
  }
  .feed-widgets {
    display: none;
  }
}

.feed-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.feed-header h1 {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.trending-badge {
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-lg);
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--primary-hover);
}

/* Composer Styles */
.composer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
}

.composer-form {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.composer-form textarea {
  width: 100%;
  background: transparent;
  border: none;
  resize: none;
  outline: none;
  color: var(--text-primary);
  font-size: 1.05rem;
  padding: 0.25rem 0;
}

.composer-form textarea::placeholder {
  color: var(--text-muted);
}

.composer-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 0.75rem;
}

.char-count {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.char-count.limit {
  color: var(--error);
}

.post-btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.25rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.post-btn:hover {
  background: var(--primary-hover);
  box-shadow: 0 4px 12px var(--primary-glow);
}

/* Post Card Styles */
.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post-card {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  transition: var(--transition);
}

.post-card:hover {
  border-color: rgba(255, 255, 255, 0.12);
  transform: translateY(-1px);
}

.post-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.author-details {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.author-details .name {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
}

.author-details .handle {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.author-details .dot {
  color: var(--text-muted);
}

.author-details .time {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.post-content {
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
  white-space: pre-line;
}

.post-footer {
  display: flex;
  gap: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 0.75rem;
}

.action-btn {
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  cursor: pointer;
  font-size: 0.88rem;
  transition: var(--transition);
  padding: 0.4rem 0.6rem;
  border-radius: var(--radius-sm);
}

.action-icon {
  width: 18px;
  height: 18px;
}

.like-btn:hover {
  color: var(--accent);
  background: rgba(217, 70, 239, 0.08);
}

.like-btn.liked {
  color: var(--accent);
}

.comment-btn:hover {
  color: var(--primary-hover);
  background: rgba(139, 92, 246, 0.08);
}

.share-btn:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

/* Sidebar Widgets Styles */
.feed-widgets {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
  height: fit-content;
}

.widget {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
}

.widget h3 {
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  color: var(--text-primary);
}

.trending-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.trending-list li {
  display: flex;
  flex-direction: column;
}

.trending-list .topic {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
  cursor: pointer;
}

.trending-list .topic:hover {
  color: var(--primary-hover);
}

.trending-list .posts-count {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.follow-recommendations {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.dev-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dev-info {
  flex-grow: 1;
  overflow: hidden;
}

.dev-name {
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dev-handle {
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.follow-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-primary);
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
}

.follow-btn:hover {
  background: var(--text-primary);
  color: var(--bg-base);
}

/* Animations */
.post-list-enter-active, .post-list-leave-active {
  transition: all 0.4s ease;
}
.post-list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.post-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
