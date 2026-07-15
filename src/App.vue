<template>
  <!-- Main layout for authenticated pages -->
  <div v-if="showSidebar" class="layout-container">
    <Sidebar />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
  
  <!-- Standalone layout for Auth pages -->
  <div v-else>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/navigation/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Sidebar
  },
  setup() {
    const route = useRoute()
    
    // Do not show sidebar on the Auth page
    const showSidebar = computed(() => route.name !== 'Auth' && route.name !== undefined)

    return {
      showSidebar
    }
  }
}
</script>

<style>
/* Page transition animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
