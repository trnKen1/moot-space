<template>
  <div v-if="user" class="profile-layout ms-stack">
    <section class="ms-surface ms-profile" :data-finish="ui.finishFor('prism')">
      <div class="ms-profile__banner"></div>
      <div class="ms-profile__body">
        <div class="ms-profile__top">
          <Avatar :src="user.avatar" :name="user.name" :size="96" />
          <button type="button" class="ms-btn ms-btn--secondary">Edit profile</button>
        </div>
        <div>
          <h1 class="ms-profile__name">{{ user.name }}</h1>
          <span class="ms-muted">@{{ user.handle }}</span>
        </div>
        <p v-if="user.bio" class="bio">{{ user.bio }}</p>
        <div class="ms-stats">
          <div class="ms-stat"><b>{{ user.following }}</b><span>Following</span></div>
          <div class="ms-stat"><b>{{ user.followers }}</b><span>Followers</span></div>
          <div class="ms-stat"><b>{{ posts.length }}</b><span>Posts</span></div>
        </div>
      </div>
    </section>

    <div class="ms-tabs" role="tablist" aria-label="Profile content">
      <button
        v-for="tab in tabs"
        :id="`profile-tab-${tab}`"
        :key="tab"
        :ref="setEl(tab)"
        type="button"
        role="tab"
        class="ms-tab"
        :aria-selected="currentTab === tab"
        :aria-controls="`profile-panel-${tab}`"
        :tabindex="currentTab === tab ? 0 : -1"
        @click="currentTab = tab"
        @keydown.left.prevent="moveTab(-1)"
        @keydown.right.prevent="moveTab(1)"
      >
        {{ tab }}
      </button>
    </div>

    <div
      :id="`profile-panel-${currentTab}`"
      role="tabpanel"
      :aria-labelledby="`profile-tab-${currentTab}`"
      class="ms-stack"
    >
      <template v-if="currentTab === 'Posts'">
        <EmptyState
          v-if="posts.length === 0"
          title="No posts yet"
          text="Share your first thought from the feed."
        />
        <PostCard
          v-for="post in posts"
          v-else
          :key="post.id"
          :post="post"
          :author="user"
          :shareable="false"
          @toggle-like="toggleLike(post)"
        />
      </template>
      <EmptyState
        v-else
        title="No liked posts yet"
        text="Posts you like will gather here."
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRovingTabs } from '../composables/useRovingTabs'
import { useAuthStore } from '../store/auth'
import { useUiStore } from '../store/ui'
import Avatar from '../components/common/Avatar.vue'
import EmptyState from '../components/common/EmptyState.vue'
import PostCard from '../components/feed/PostCard.vue'

const authStore = useAuthStore()
const ui = useUiStore()
const user = computed(() => authStore.user)

const tabs = ['Posts', 'Likes']
const { current: currentTab, setEl, move: moveTab } = useRovingTabs(tabs)

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

</script>

<style scoped>
.profile-layout {
  max-width: 800px;
  margin: 0 auto;
}

.ms-tabs {
  align-self: flex-start;
}

.bio {
  margin: 0;
  color: var(--ink-muted);
}
</style>
