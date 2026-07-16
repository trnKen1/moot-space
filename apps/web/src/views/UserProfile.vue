<template>
  <div class="profile-layout" v-if="user">
    <!-- Cover Banner -->
    <div class="profile-banner">
      <div class="banner-gradient"></div>
    </div>

    <!-- Header Details -->
    <div class="profile-header-card glass">
      <div class="header-main">
        <Avatar :src="user.avatar" :name="user.name" :size="96" class="profile-avatar" />
        <div class="header-actions">
          <button class="edit-profile-btn">Edit Profile</button>
        </div>
      </div>

      <div class="profile-meta">
        <h2>{{ user.name }}</h2>
        <span class="handle">@{{ user.handle }}</span>
        <p class="bio">{{ user.bio }}</p>
        
        <!-- Stats Row -->
        <div class="stats-row">
          <div class="stat-item">
            <span class="count">{{ user.following }}</span>
            <span class="label">Following</span>
          </div>
          <div class="stat-item">
            <span class="count">{{ user.followers }}</span>
            <span class="label">Followers</span>
          </div>
          <div class="stat-item">
            <span class="count">{{ posts.length }}</span>
            <span class="label">Posts</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="profile-tabs glass">
      <button 
        v-for="tab in ['Posts', 'Likes']" 
        :key="tab"
        :class="['tab-btn', { active: currentTab === tab }]"
        @click="currentTab = tab"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Content Area -->
    <div class="profile-content">
      <div v-if="currentTab === 'Posts'" class="posts-list">
        <div v-if="posts.length === 0" class="empty-state">
          <p>No posts published yet. Share your thoughts on the feed!</p>
        </div>
        <div v-else v-for="post in posts" :key="post.id" class="post-card glass">
          <div class="post-header">
            <Avatar :src="user.avatar" :name="user.name" :size="42" />
            <div class="author-details">
              <span class="name">{{ user.name }}</span>
              <span class="handle">@{{ user.handle }}</span>
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
          </div>
        </div>
      </div>
      <div v-else class="likes-list">
        <div class="empty-state">
          <p>No liked posts to show.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '../store/auth'
import Avatar from '../components/common/Avatar.vue'

export default {
  name: 'UserProfile',
  components: {
    Avatar
  },
  setup() {
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    
    const currentTab = ref('Posts')

    const posts = ref([
      {
        id: 101,
        text: 'Just scaffolded the codebase for moot-space. Moving from legacy Webpack setups to Vite + Vue 3 makes hot module replacement (HMR) insanely fast. Highly recommend checking it out! 🚀',
        timestamp: '1 day ago',
        likes: 12,
        isLiked: true,
        comments: 2
      },
      {
        id: 102,
        text: 'Designing glassmorphism card variations using CSS custom variables. It allows quick toggling of background blur depths and alpha transparency ranges on dark mode layouts. 🎨',
        timestamp: '3 days ago',
        likes: 24,
        isLiked: false,
        comments: 5
      }
    ])

    const toggleLike = (post) => {
      post.isLiked = !post.isLiked
      post.likes = post.isLiked ? post.likes + 1 : post.likes - 1
    }

    return {
      user,
      currentTab,
      posts,
      toggleLike
    }
  }
}
</script>

<style scoped>
.profile-layout {
  max-width: 800px;
  margin: 0 auto;
}

.profile-banner {
  height: 180px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
  position: relative;
}

.banner-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  opacity: 0.85;
}

.profile-header-card {
  padding: 1.5rem 2rem 2rem;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
  margin-bottom: 1.5rem;
  border-top: none;
  position: relative;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: -4.5rem;
  margin-bottom: 1.25rem;
}

.profile-avatar {
  border: 4px solid var(--bg-surface);
  box-shadow: var(--shadow-lg);
}

.edit-profile-btn {
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  padding: 0.5rem 1.2rem;
  border-radius: var(--radius-md);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: var(--transition);
}

.edit-profile-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--text-secondary);
}

.profile-meta h2 {
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 0.2rem;
}

.profile-meta .handle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 1rem;
}

.profile-meta .bio {
  font-size: 1.05rem;
  line-height: 1.5;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.stats-row {
  display: flex;
  gap: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 1.25rem;
}

.stat-item {
  display: flex;
  gap: 0.4rem;
  font-size: 0.95rem;
}

.stat-item .count {
  font-weight: 700;
  color: var(--text-primary);
}

.stat-item .label {
  color: var(--text-secondary);
}

.profile-tabs {
  display: flex;
  padding: 4px;
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 0;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border-radius: calc(var(--radius-md) - 2px);
  transition: var(--transition);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.post-card {
  padding: 1.5rem;
  border-radius: var(--radius-lg);
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
}

.author-details .handle {
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.author-details .dot, .author-details .time {
  color: var(--text-muted);
}

.author-details .time {
  font-size: 0.85rem;
}

.post-content {
  font-size: 1.05rem;
  line-height: 1.5;
  margin-bottom: 1.25rem;
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

.like-btn:hover, .like-btn.liked {
  color: var(--accent);
}

.like-btn:hover {
  background: rgba(217, 70, 239, 0.08);
}

.comment-btn:hover {
  color: var(--primary-hover);
  background: rgba(139, 92, 246, 0.08);
}

.empty-state {
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--text-muted);
}
</style>
