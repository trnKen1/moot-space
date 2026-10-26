import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './store/auth'
import { syncTheme } from './lib/theme'

syncTheme()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

// Restore any existing Supabase session before the router's auth guard runs.
await useAuthStore().init()

app.use(router)
app.mount('#app')
