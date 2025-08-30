import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './assets/index.css'
import { useThemeStore } from './stores/theme'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
useThemeStore(pinia).init()
await useAuthStore(pinia).bootstrap().catch((err) => {
  console.error('Failed to bootstrap auth', err)
})
app.use(router)
app.mount('#app')
