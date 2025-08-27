import { defineStore } from 'pinia'
import { login as apiLogin, me } from '@/api/auth'
import type { User } from '@/types/auth'

interface State {
  token: string | null
  user: User | null
  ready: boolean
}

export const useAuthStore = defineStore('auth', {
  state: (): State => ({ token: localStorage.getItem('token'), user: null, ready: false }),
  getters: {
    isAuthenticated: (s) => !!s.token,
    isAdmin: (s) => s.user?.role === 'admin',
  },
  actions: {
    async bootstrap() {
      if (!this.token) {
        this.ready = true
        return
      }
      try {
        this.user = await me()
      } finally {
        this.ready = true
      }
    },
    async login(email: string, password: string) {
      const { token, user } = await apiLogin({ email, password })
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    },
  },
})

