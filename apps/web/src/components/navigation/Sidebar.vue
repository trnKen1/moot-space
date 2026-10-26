<template>
  <aside class="sidebar ms-surface ms-sidebar" :data-finish="ui.finishFor('frosted')" aria-label="Main">
    <div class="ms-sidebar__logo">
      <span class="ms-logo-mark ms-lit" aria-hidden="true">m</span>
      <span class="ms-wordmark">moot<b aria-hidden="true"></b><span class="sr-only">.</span>space</span>
    </div>

    <nav class="ms-nav" aria-label="Primary">
      <router-link to="/" class="ms-nav__item">
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="label">Feed</span>
      </router-link>
      <router-link to="/chat" class="ms-nav__item">
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="label">Messages</span>
        <span v-if="hasUnread" class="ms-dot"><span class="sr-only">Unread messages</span></span>
      </router-link>
      <router-link to="/profile" class="ms-nav__item">
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="label">Profile</span>
      </router-link>
    </nav>

    <div v-if="user" class="ms-user-card">
      <Avatar :src="user.avatar" :name="user.name" :size="40" ring />
      <div class="ms-user-card__meta">
        <span class="ms-user-card__name">{{ user.name }}</span>
        <span class="ms-user-card__handle">@{{ user.handle }}</span>
      </div>
      <button
        type="button"
        class="logout-btn ms-btn ms-btn--ghost ms-btn--icon"
        aria-label="Log out"
        title="Log out"
        @click="handleLogout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="ms-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useChatStore } from '../../store/chat'
import { useUiStore } from '../../store/ui'
import Avatar from '../common/Avatar.vue'

const authStore = useAuthStore()
const chatStore = useChatStore()
const ui = useUiStore()
const router = useRouter()

const user = computed(() => authStore.user)
const hasUnread = computed(() => chatStore.conversations.some(c => c.unread))

const handleLogout = () => {
  authStore.logout()
  router.push({ name: 'Auth' })
}
</script>

<style scoped>
/* Fills the layout's 280px column and stays put while the feed scrolls. */
.sidebar {
  position: sticky;
  top: var(--space-4);
  z-index: 50;
  width: auto;
  height: calc(100vh - 2 * var(--space-4));
  margin: var(--space-4);
}

/* Icons only */
@media (max-width: 900px) {
  .sidebar {
    align-items: center;
    padding: var(--space-6) var(--space-2);
    margin: var(--space-2);
    height: calc(100vh - 2 * var(--space-2));
  }
  .ms-wordmark,
  .label,
  .ms-user-card__meta,
  .logout-btn {
    display: none;
  }
  .ms-nav__item {
    justify-content: center;
    width: 48px;
    padding: 0;
  }
  .ms-nav__item .ms-dot {
    position: absolute;
    top: 8px;
    right: 8px;
  }
  .ms-user-card {
    padding: 0;
    background: transparent;
  }
}

/* Bottom bar */
@media (max-width: 600px) {
  .sidebar {
    position: fixed;
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    height: 70px;
    margin: 0;
    padding: 0 var(--space-4);
    flex-direction: row;
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  }
  .ms-sidebar__logo,
  .ms-user-card {
    display: none;
  }
  .ms-nav {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
  }
}
</style>
