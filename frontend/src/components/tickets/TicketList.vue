<script setup lang="ts">
import type { Ticket } from '@/types/ticket'


const props = defineProps<{ tickets: Ticket[]; activeId: number | null }>()
const emit = defineEmits<{ (e: 'open', id: number): void }>()
</script>


<template>
<div class="overflow-y-auto divide-y">
<button
v-for="t in props.tickets"
:key="t.id"
class="w-full text-left p-3 hover:bg-gray-50"
:class="{ 'bg-gray-100': t.id === props.activeId }"
@click="emit('open', t.id)"
>
<div class="flex items-center justify-between">
<div class="font-medium">{{ t.contactName || t.phone }}</div>
<span v-if="t.unreadCount" class="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">{{ t.unreadCount }}</span>
</div>
<div class="text-sm text-gray-500 truncate">{{ t.lastMessage }}</div>
</button>
</div>
</template>