<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Ticket } from '@/types/ticket'

const props = defineProps<{ tickets: Ticket[]; activeId: number | null }>()
const emit = defineEmits<{ (e: 'open', id: number): void; (e: 'search', q: string): void }>()

const q = ref('')
let timer: any
watch(q, (val) => {
  clearTimeout(timer)
  timer = setTimeout(() => emit('search', val), 300)
})
</script>

<template>
  <div class="overflow-y-auto divide-y dark:divide-gray-700">
    <div class="p-2">
      <input
        v-model="q"
        type="text"
        placeholder="Search..."
        class="w-full px-2 py-1 text-sm border rounded dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
    <button
      v-for="t in props.tickets"
      :key="t.id"
      class="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800"
      :class="{ 'bg-gray-100 dark:bg-gray-800': t.id === props.activeId }"
      @click="emit('open', t.id)"
    >
      <div class="flex items-center justify-between">
        <div class="font-medium">{{ t.contactName || t.phone }}</div>
        <span
          v-if="t.unreadCount"
          class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full"
          >{{ t.unreadCount }}</span
        >
      </div>
      <div class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ t.lastMessage }}</div>
    </button>
  </div>
</template>

