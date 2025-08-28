<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <aside class="w-64 bg-gray-100 h-full border-r border-gray-200 flex flex-col dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100">
    <div class="p-4 text-xl font-semibold">watiket</div>
    <nav class="px-2 space-y-1">
      <RouterLink to="/tickets" class="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800">Tickets</RouterLink>
      <RouterLink
        v-if="auth.user?.role === 'admin'"
        to="/users"
        class="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >Users</RouterLink
      >
      <RouterLink
        v-if="auth.user?.role === 'admin'"
        to="/settings"
        class="block px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-800"
        >Settings</RouterLink
      >
    </nav>
    <div class="mt-auto p-4 text-sm text-gray-500 dark:text-gray-400">v0.1.0</div>
  </aside>
</template>
