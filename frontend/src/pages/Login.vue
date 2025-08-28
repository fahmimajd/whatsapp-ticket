<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const err = ref('')
const loading = ref(false)
const auth = useAuthStore()
const route = useRoute()
const router = useRouter()

async function onSubmit() {
  loading.value = true
  err.value = ''
  try {
    console.log('Attempting login with:', username.value)
    const result = await auth.login(username.value, password.value)
    console.log('Login successful:', result)
    const to = (route.query.redirect as string) || '/tickets'
    router.replace(to)
  } catch (e: any) {
    console.error('Login error:', e)
    console.error('Error response:', e?.response)
    console.error('Error status:', e?.response?.status)
    console.error('Error data:', e?.response?.data)
    err.value = e?.response?.data?.error || 'Login gagal'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen grid place-items-center bg-gray-50">
    <form
      @submit.prevent="onSubmit"
      class="w-full max-w-sm bg-white p-6 rounded-2xl shadow"
    >
      <h1 class="text-2xl font-semibold mb-4">Masuk ke watiket</h1>
      <div class="space-y-3">
        <div>
          <label class="text-sm">Username</label>
          <input v-model="username" type="text" class="w-full border rounded-lg px-3 py-2" />
        </div>
        <div>
          <label class="text-sm">Password</label>
          <input v-model="password" type="password" class="w-full border rounded-lg px-3 py-2" />
        </div>
        <p v-if="err" class="text-sm text-red-600">{{ err }}</p>
        <button :disabled="loading" class="w-full py-2 rounded-lg bg-emerald-600 text-white">
          {{ loading ? 'Memproses…' : 'Masuk' }}
        </button>
      </div>
    </form>
  </div>
</template>
