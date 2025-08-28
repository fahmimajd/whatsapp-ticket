<script setup lang="ts">
import type { Ticket } from '@/types/ticket'


const props = defineProps<{ ticket: Ticket | null }>()
</script>


<template>
<div class="h-12 border-b border-gray-200 px-4 flex items-center justify-between dark:border-gray-700">
  <div>
    <div class="font-medium">{{ props.ticket?.contactName || props.ticket?.phone || '—' }}</div>
    <div class="text-xs text-gray-500 dark:text-gray-400">Status: {{ props.ticket?.status }}</div>
  </div>
  <slot />
</div>
</template>
