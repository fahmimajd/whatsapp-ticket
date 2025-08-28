<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'

import { listUsers, createUser } from '@/api/users'
import type { User } from '@/types/user'

const items = ref<User[]>([])
const showForm = ref(false)
const form = ref({ username: '', password: '', role: 'operator' })


onMounted(async () => {
  items.value = await listUsers()
})

async function add() {
  const user = await createUser(form.value)
  items.value.push(user)
  form.value = { username: '', password: '', role: 'operator' }
  showForm.value = false
}

</script>

<template>
  <div class="h-screen grid grid-cols-[16rem_1fr] dark:bg-gray-800 dark:text-gray-100">
    <AppSidebar />
    <div class="flex flex-col">
      <AppTopbar />
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Users</h2>

        <button class="mb-4 px-3 py-1.5 border rounded" @click="showForm = !showForm">
          {{ showForm ? 'Cancel' : 'Add User' }}
        </button>
        <div v-if="showForm" class="mb-4 flex gap-2 items-end flex-wrap">
          <input v-model="form.username" class="border rounded px-2 py-1 text-sm" placeholder="Username" />
          <input v-model="form.password" type="password" class="border rounded px-2 py-1 text-sm" placeholder="Password" />
          <select v-model="form.role" class="border rounded px-2 py-1 text-sm">
            <option value="operator">operator</option>
            <option value="admin">admin</option>
          </select>
          <button class="px-3 py-1.5 border rounded" @click="add">Save</button>
        </div>

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
