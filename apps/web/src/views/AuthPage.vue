<template>
  <div class="auth-wrapper">
    <div class="auth-stage" :data-finish="ui.finishFor('prism')">
      <div class="ms-surface ms-auth">
        <div class="ms-auth__head">
          <span class="ms-logo-mark ms-lit" aria-hidden="true">m</span>
          <h1 class="ms-wordmark auth-title">moot<b aria-hidden="true"></b><span class="sr-only">.</span>space</h1>
          <p>Your moots await in the clearing.</p>
        </div>

        <!-- Tab Switcher: arrow keys move between tabs (roving tabindex) -->
        <div class="ms-tabs ms-tabs--block" role="tablist" aria-label="Account">
          <button
            v-for="tab in tabs"
            :id="`tab-${tab.id}`"
            :key="tab.id"
            :ref="el => { tabEls[tab.id] = el }"
            type="button"
            role="tab"
            class="ms-tab"
            :aria-selected="currentTab === tab.id"
            :aria-controls="`panel-${tab.id}`"
            :tabindex="currentTab === tab.id ? 0 : -1"
            @click="currentTab = tab.id"
            @keydown.left.prevent="moveTab(-1)"
            @keydown.right.prevent="moveTab(1)"
          >
            {{ tab.label }}
          </button>
        </div>

        <div v-if="error" class="ms-banner ms-banner--danger" role="alert">
          <span>{{ error }}</span>
        </div>

        <!-- Sign In Form -->
        <form
          v-if="currentTab === 'login'"
          id="panel-login"
          role="tabpanel"
          aria-labelledby="tab-login"
          class="ms-stack"
          @submit.prevent="handleLogin"
        >
          <div class="ms-field">
            <label for="login-email">Email address</label>
            <input
              id="login-email"
              v-model="loginEmail"
              class="ms-input"
              type="email"
              placeholder="you@domain.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="ms-field">
            <label for="login-password">Password</label>
            <input
              id="login-password"
              v-model="loginPassword"
              class="ms-input"
              type="password"
              placeholder="••••••••"
              required
              autocomplete="current-password"
            />
          </div>
          <button type="submit" class="ms-btn ms-btn--primary ms-lit ms-btn--block" :disabled="isLoading">
            {{ isLoading ? 'Signing in…' : 'Continue' }}
          </button>
        </form>

        <!-- Register Form -->
        <form
          v-else
          id="panel-signup"
          role="tabpanel"
          aria-labelledby="tab-signup"
          class="ms-stack"
          @submit.prevent="handleSignup"
        >
          <div class="ms-field">
            <label for="signup-name">Display name</label>
            <input
              id="signup-name"
              v-model="signupName"
              class="ms-input"
              type="text"
              placeholder="Wren Alder"
              required
              autocomplete="name"
            />
          </div>
          <div class="ms-field">
            <label for="signup-handle">Handle</label>
            <div class="ms-input-group">
              <span aria-hidden="true">@</span>
              <input
                id="signup-handle"
                v-model="signupHandle"
                class="ms-input"
                type="text"
                placeholder="wren"
                required
                autocomplete="username"
              />
            </div>
          </div>
          <div class="ms-field">
            <label for="signup-email">Email address</label>
            <input
              id="signup-email"
              v-model="signupEmail"
              class="ms-input"
              type="email"
              placeholder="you@domain.com"
              required
              autocomplete="email"
            />
          </div>
          <div class="ms-field">
            <label for="signup-password">Password</label>
            <input
              id="signup-password"
              v-model="signupPassword"
              class="ms-input"
              type="password"
              placeholder="••••••••"
              required
              autocomplete="new-password"
            />
          </div>
          <button type="submit" class="ms-btn ms-btn--primary ms-lit ms-btn--block" :disabled="isLoading">
            {{ isLoading ? 'Creating account…' : 'Create account' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { useUiStore } from '../store/ui'

const authStore = useAuthStore()
const ui = useUiStore()
const router = useRouter()

const tabs = [
  { id: 'login', label: 'Sign in' },
  { id: 'signup', label: 'Register' }
]
const currentTab = ref('login')
const tabEls = {}

// Arrow keys select the neighbouring tab and move focus to it, wrapping at the ends.
const moveTab = async (step) => {
  const index = tabs.findIndex(t => t.id === currentTab.value)
  currentTab.value = tabs[(index + step + tabs.length) % tabs.length].id
  await nextTick()
  tabEls[currentTab.value]?.focus()
}

// Login ref fields
const loginEmail = ref('')
const loginPassword = ref('')

// Signup ref fields
const signupName = ref('')
const signupHandle = ref('')
const signupEmail = ref('')
const signupPassword = ref('')

const isLoading = computed(() => authStore.isLoading)
const error = computed(() => authStore.error)

const handleLogin = async () => {
  const success = await authStore.login(loginEmail.value, loginPassword.value)
  if (success) {
    router.push({ name: 'Feed' })
  }
}

const handleSignup = async () => {
  const success = await authStore.signup(
    signupName.value,
    signupHandle.value,
    signupEmail.value,
    signupPassword.value
  )
  if (success) {
    router.push({ name: 'Feed' })
  }
}
</script>

<style scoped>
/* A clearing: leaf, sun and dew shapes behind the card, so the prism finish has light to catch. */
.auth-wrapper {
  min-height: 100vh;
  display: grid;
  /* minmax(0, 1fr): the column may shrink below the card's 400px on small screens */
  grid-template-columns: minmax(0, 1fr);
  place-items: center;
  padding: var(--space-6) var(--space-4);
  background:
    radial-gradient(circle at 10% 88%, var(--fern-300) 0 180px, transparent 181px),
    radial-gradient(circle at 90% 80%, var(--pollen) 0 96px, transparent 97px),
    radial-gradient(ellipse 320px 180px at 74% 10%, var(--prism-dew) 0 98%, transparent 100%),
    var(--brand-soft);
}

.auth-stage {
  width: 100%;
  display: flex;
  justify-content: center;
}

.auth-title {
  margin-top: var(--space-2);
  font-size: 36px;
  line-height: 42px;
}

@media (max-width: 600px) {
  .ms-auth {
    padding: var(--space-6);
  }
}
</style>
