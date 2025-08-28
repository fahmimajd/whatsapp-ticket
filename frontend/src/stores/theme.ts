import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({ dark: false }),
  actions: {
    init() {
      this.dark = localStorage.getItem('dark') === '1'
      this.apply()
    },
    toggle() {
      this.dark = !this.dark
      localStorage.setItem('dark', this.dark ? '1' : '0')
      this.apply()
    },
    apply() {
      const cls = document.documentElement.classList
      if (this.dark) cls.add('dark')
      else cls.remove('dark')
    }
  }
})
