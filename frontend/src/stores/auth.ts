import { defineStore } from 'pinia'
import router from '@/router'
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
      } catch (err) {
        console.error('Auth bootstrap failed', err)
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      } finally {
        this.ready = true
      }
    },
    async login(username: string, password: string) {
      const { token, user } = await apiLogin({ username, password })
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
    },
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      if (router.currentRoute.value.name !== 'login') {
        router.replace({ name: 'login' })
      }
    },
  },
})

