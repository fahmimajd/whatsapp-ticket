<script setup lang="ts">
import { ref, watch } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useAuthStore } from '@/stores/auth'
import { useSocket } from '@/composables/useSocket'
import { startWhatsApp } from '@/api/whatsapp'

const auth = useAuthStore()
const { waState } = useSocket()
const qrUrl = ref('')
const loading = ref(false)

async function start() {
  loading.value = true
  try {
    await startWhatsApp()
  } finally {
    loading.value = false
  }
}

watch(
  () => waState.value?.qr,
  (qr) => {
    qrUrl.value = qr ? `/api/whatsapp/qr-image?ts=${Date.now()}` : ''
  }
)
</script>


<template>
  <div class="h-screen grid grid-cols-[16rem_1fr] dark:bg-gray-800 dark:text-gray-100">
    <AppSidebar />
    <div class="flex flex-col">
      <AppTopbar />

      <div class="p-6 space-y-4">

        <h2 class="text-xl font-semibold">Settings</h2>
        <div class="space-y-2">
          <div class="text-sm">User: <b>{{ auth.user?.username }}</b> ({{ auth.user?.role }})</div>
          <button class="px-3 py-1.5 rounded-lg border" @click="auth.logout()">Logout</button>
        </div>

        <div class="space-y-2">
          <h3 class="font-medium">WhatsApp</h3>
          <div class="text-sm">Status: <b>{{ waState?.connection || 'unknown' }}</b></div>
          <button class="px-3 py-1.5 rounded-lg border" @click="start" :disabled="loading">
            Start
          </button>
          <div v-if="qrUrl" class="pt-2">
            <img :src="qrUrl" alt="WhatsApp QR" class="mx-auto" />
          </div>
        </div>

      </div>
    </div>
  </div>
</template>
