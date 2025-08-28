<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { listUsers } from '@/api/users'
import type { User } from '@/types/user'

const items = ref<User[]>([])

onMounted(async () => {
  items.value = await listUsers()
})
</script>

<template>
  <div class="h-screen grid grid-cols-[16rem_1fr] dark:bg-gray-800 dark:text-gray-100">
    <AppSidebar />
    <div class="flex flex-col">
      <AppTopbar />
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Users</h2>
        <table class="min-w-[20rem] text-sm">
          <thead>
            <tr class="text-left border-b">
              <th class="py-1 pr-4">Username</th>
              <th class="py-1">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in items" :key="u.id" class="border-b border-gray-200 dark:border-gray-700">
              <td class="py-1 pr-4">{{ u.username }}</td>
              <td class="py-1">{{ u.role }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
