<template>
  <div class="auth-wrapper">
    <div class="glow-bg">
      <div class="glow-sphere sphere-1"></div>
      <div class="glow-sphere sphere-2"></div>
    </div>
    
    <div class="auth-card glass glass-glow">
      <div class="auth-header">
        <div class="logo-symbol">M</div>
        <h2>moot.space</h2>
        <p class="subtitle">Join the developer town square</p>
      </div>

      <!-- Tab Switcher -->
      <div class="tabs">
        <button 
          :class="['tab-btn', { active: currentTab === 'login' }]"
          @click="currentTab = 'login'"
        >
          Sign In
        </button>
        <button 
          :class="['tab-btn', { active: currentTab === 'signup' }]"
          @click="currentTab = 'signup'"
        >
          Register
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-banner">
        <span>{{ error }}</span>
      </div>

      <!-- Sign In Form -->
      <form v-if="currentTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            v-model="loginEmail" 
            placeholder="you@domain.com" 
            required 
            autocomplete="email"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="loginPassword" 
            placeholder="••••••••" 
            required
            autocomplete="current-password"
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Continue</span>
        </button>
        
        <div class="demo-creds">
          <strong>Demo credentials:</strong>
          <span>Any email / password works (defaults: kenji@moot.space / demo)</span>
        </div>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleSignup" class="auth-form">
        <div class="form-group">
          <label>Display Name</label>
          <input 
            type="text" 
            v-model="signupName" 
            placeholder="Jane Doe" 
            required 
            autocomplete="name"
          />
        </div>
        <div class="form-group">
          <label>Handle</label>
          <div class="handle-input-wrapper">
            <span class="handle-prefix">@</span>
            <input 
              type="text" 
              v-model="signupHandle" 
              placeholder="janedoe" 
              required
              autocomplete="username"
            />
          </div>
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            v-model="signupEmail" 
            placeholder="jane@domain.com" 
            required
            autocomplete="email"
          />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input 
            type="password" 
            v-model="signupPassword" 
            placeholder="••••••••" 
            required
            autocomplete="new-password"
          />
        </div>
        <button type="submit" class="submit-btn" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Create Account</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

export default {
  name: 'AuthPage',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()

    const currentTab = ref('login')
    
    // Login ref fields
    const loginEmail = ref('kenji@moot.space')
    const loginPassword = ref('password')
    
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

    return {
      currentTab,
      loginEmail,
      loginPassword,
      signupName,
      signupHandle,
      signupEmail,
      signupPassword,
      isLoading,
      error,
      handleLogin,
      handleSignup
    }
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1.5rem;
  overflow: hidden;
  background-color: var(--bg-base);
}

.glow-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.glow-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.25;
}

.sphere-1 {
  width: 350px;
  height: 350px;
  background-color: var(--primary);
  top: 15%;
  left: 20%;
  animation: float-slow 12s infinite alternate ease-in-out;
}

.sphere-2 {
  width: 400px;
  height: 400px;
  background-color: var(--accent);
  bottom: 10%;
  right: 15%;
  animation: float-slow 15s infinite alternate-reverse ease-in-out;
}

@keyframes float-slow {
  0% { transform: translateY(0px) scale(1); }
  100% { transform: translateY(-40px) scale(1.1); }
}

.auth-card {
  width: 100%;
  max-width: 440px;
  padding: 2.5rem;
  border-radius: var(--radius-lg);
  position: relative;
  z-index: 10;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-symbol {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.6rem;
  margin-bottom: 1rem;
  box-shadow: 0 0 20px var(--primary-glow);
}

.auth-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: var(--radius-md);
  margin-bottom: 1.75rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-btn {
  flex: 1;
  padding: 0.6rem 0;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border-radius: calc(var(--radius-md) - 2px);
  transition: var(--transition);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.07);
  color: var(--text-primary);
}

.error-banner {
  background-color: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
  padding: 0.75rem;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.95rem;
  outline: none;
  transition: var(--transition);
}

.form-group input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
}

.handle-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding-left: 1rem;
  transition: var(--transition);
}

.handle-input-wrapper:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.15);
}

.handle-prefix {
  color: var(--text-muted);
  user-select: none;
}

.handle-input-wrapper input {
  background: transparent;
  border: none;
  width: 100%;
  padding-left: 0.25rem;
}

.handle-input-wrapper input:focus {
  border: none;
  box-shadow: none;
}

.submit-btn {
  margin-top: 0.5rem;
  background: linear-gradient(135deg, var(--primary), var(--primary-hover));
  border: none;
  padding: 0.85rem;
  border-radius: var(--radius-md);
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 15px var(--primary-glow);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: var(--transition);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.demo-creds {
  margin-top: 1rem;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  color: var(--text-muted);
}

.demo-creds strong {
  color: var(--text-secondary);
}
</style>
