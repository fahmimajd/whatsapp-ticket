<script setup lang="ts">
import type { Message } from '@/types/ticket'
const props = defineProps<{ msg: Message }>()
</script>


<template>
<div class="px-4 py-1">
<div
class="inline-block max-w-[80%] px-3 py-2 rounded-2xl shadow"
:class="props.msg.direction === 'out' ? 'bg-emerald-600 text-white rounded-br-sm ml-auto' : 'bg-white rounded-bl-sm'"
>
<div class="whitespace-pre-wrap">{{ props.msg.body }}</div>
<div class="text-[10px] opacity-70 text-right mt-1">{{ new Date(props.msg.timestamp).toLocaleString() }}</div>
</div>
</div>
</template>
