<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRoute, useRouter } from 'vue-router'

const email = ref('')
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
    await auth.login(email.value, password.value)
    const to = (route.query.redirect as string) || '/tickets'
    router.replace(to)
  } catch (e: any) {
    err.value = e?.response?.data?.message || 'Login gagal'
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
          <label class="text-sm">Email</label>
          <input v-model="email" type="email" class="w-full border rounded-lg px-3 py-2" />
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

