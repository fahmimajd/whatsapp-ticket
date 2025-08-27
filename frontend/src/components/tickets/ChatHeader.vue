<script setup lang="ts">
import type { Ticket } from '@/types/ticket'


const props = defineProps<{ ticket: Ticket | null }>()
</script>


<template>
<div class="h-12 border-b border-gray-200 px-4 flex items-center justify-between">
<div>
<div class="font-medium">{{ props.ticket?.contactName || props.ticket?.phone || '—' }}</div>
<div class="text-xs text-gray-500">Status: {{ props.ticket?.status }}</div>
</div>
<slot />
</div>
</template>