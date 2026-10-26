<template>
  <!-- Main layout for authenticated pages -->
  <div v-if="showSidebar" class="layout-container">
    <Sidebar />
    <main class="main-content" :data-finish="ui.finishFor('satin')">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>

  <!-- Standalone layout for Auth pages -->
  <div v-else :data-finish="ui.finishFor('satin')">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>

  <DevFinishSwitcher v-if="DevFinishSwitcher" />
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/navigation/Sidebar.vue'
import { useUiStore } from './store/ui'

// import.meta.env.DEV is replaced with `false` in production builds, so this branch
// and the switcher's code are dropped from the bundle entirely.
const DevFinishSwitcher = import.meta.env.DEV
  ? defineAsyncComponent(() => import('./components/dev/FinishSwitcher.vue'))
  : null

const route = useRoute()
const ui = useUiStore()

// Do not show sidebar on the Auth page
const showSidebar = computed(() => route.name !== 'Auth' && route.name !== undefined)
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
