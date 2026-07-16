<template>
  <aside class="sidebar glass">
    <!-- App Logo / Name -->
    <div class="logo-area">
      <div class="logo-symbol">M</div>
      <span class="logo-text">moot<span class="dot">.</span>space</span>
    </div>

    <!-- Navigation Menu -->
    <nav class="nav-menu">
      <router-link to="/" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span class="label">Feed</span>
      </router-link>

      <router-link to="/chat" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span class="label">Messages</span>
        <span v-if="hasUnread" class="badge"></span>
      </router-link>

      <router-link to="/profile" class="nav-item" active-class="active">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span class="label">Profile</span>
      </router-link>
    </nav>

    <!-- User Profile Quick Card -->
    <div class="user-card" v-if="user">
      <Avatar :src="user.avatar" :name="user.name" :size="42" />
      <div class="user-info">
        <div class="name">{{ user.name }}</div>
        <div class="handle">@{{ user.handle }}</div>
      </div>
      <button class="logout-btn" @click="handleLogout" title="Logout">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../store/auth'
import { useChatStore } from '../../store/chat'
import Avatar from '../common/Avatar.vue'

export default {
  name: 'Sidebar',
  components: {
    Avatar
  },
  setup() {
    const authStore = useAuthStore()
    const chatStore = useChatStore()
    const router = useRouter()

    const user = computed(() => authStore.user)
    const hasUnread = computed(() => chatStore.conversations.some(c => c.unread))

    const handleLogout = () => {
      authStore.logout()
      router.push({ name: 'Auth' })
    }

    return {
      user,
      hasUnread,
      handleLogout
    }
  }
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 2rem 1.5rem;
  border-right: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 50;
  border-radius: 0;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 3.5rem;
}

.logo-symbol {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  box-shadow: 0 0 15px var(--primary-glow);
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--text-primary);
}

.logo-text .dot {
  color: var(--accent);
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex-grow: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1.25rem;
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 1.05rem;
  font-weight: 500;
  transition: var(--transition);
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-primary);
  transform: translateX(3px);
}

.nav-item.active {
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.2);
  color: var(--primary-hover);
}

.icon {
  width: 22px;
  height: 22px;
  stroke-width: 2;
}

.badge {
  position: absolute;
  top: 15px;
  right: 20px;
  width: 8px;
  height: 8px;
  background-color: var(--accent);
  border-radius: 50%;
  box-shadow: 0 0 10px var(--accent);
}

.user-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: var(--radius-lg);
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.user-info {
  flex-grow: 1;
  overflow: hidden;
}

.user-info .name {
  font-size: 0.95rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-info .handle {
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.logout-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.4rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--error);
}

@media (max-width: 900px) {
  .sidebar {
    padding: 2rem 0.75rem;
    align-items: center;
  }
  .logo-text, .label, .user-info, .logout-btn {
    display: none;
  }
  .logo-area {
    margin-bottom: 2rem;
  }
  .nav-item {
    justify-content: center;
    padding: 0.85rem;
    border-radius: 50%;
  }
  .nav-item:hover {
    transform: none;
  }
  .badge {
    top: 6px;
    right: 6px;
  }
  .user-card {
    background: transparent;
    border: none;
    padding: 0;
  }
}

@media (max-width: 600px) {
  .sidebar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 70px;
    flex-direction: row;
    padding: 0;
    border-right: none;
    border-top: 1px solid var(--border-color);
    justify-content: space-around;
  }
  .logo-area, .user-card {
    display: none;
  }
  .nav-menu {
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    margin: 0;
  }
  .nav-item {
    padding: 0.75rem;
  }
}
</style>
