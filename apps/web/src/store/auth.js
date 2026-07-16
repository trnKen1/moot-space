import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('moot_user')) || {
      id: 'usr_1',
      name: 'Kenji Thorne',
      handle: 'kenji_thorne',
      email: 'kenji@moot.space',
      avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kenji',
      bio: 'Fullstack explorer | Building moot.space 🚀',
      followers: 1240,
      following: 482,
      postsCount: 15
    },
    isAuthenticated: !!localStorage.getItem('moot_user_token') || true, // default to logged in for immediate demo experience
    isLoading: false,
    error: null
  }),
  
  actions: {
    async login(email, _password) {
      this.isLoading = true
      this.error = null
      
      try {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const mockUser = {
          id: 'usr_1',
          name: 'Kenji Thorne',
          handle: 'kenji_thorne',
          email: email,
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=kenji',
          bio: 'Fullstack explorer | Building moot.space 🚀',
          followers: 1240,
          following: 482,
          postsCount: 15
        }
        
        this.user = mockUser
        this.isAuthenticated = true
        localStorage.setItem('moot_user', JSON.stringify(mockUser))
        localStorage.setItem('moot_user_token', 'mock-token-xyz')
        return true
      } catch (_err) {
        this.error = 'Invalid email or password'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    async signup(name, handle, email, _password) {
      this.isLoading = true
      this.error = null
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const cleanHandle = handle.replace('@', '').toLowerCase()
        const mockUser = {
          id: 'usr_' + Date.now(),
          name,
          handle: cleanHandle,
          email,
          avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cleanHandle}`,
          bio: 'New member of Moot Space! 🎉',
          followers: 0,
          following: 0,
          postsCount: 0
        }
        
        this.user = mockUser
        this.isAuthenticated = true
        localStorage.setItem('moot_user', JSON.stringify(mockUser))
        localStorage.setItem('moot_user_token', 'mock-token-xyz')
        return true
      } catch (_err) {
        this.error = 'Signup failed, please try again.'
        return false
      } finally {
        this.isLoading = false
      }
    },
    
    logout() {
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('moot_user')
      localStorage.removeItem('moot_user_token')
    }
  }
})
