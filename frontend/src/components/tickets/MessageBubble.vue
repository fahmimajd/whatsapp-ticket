<script setup lang="ts">
import type { Message } from '@/types/ticket'
const props = defineProps<{ msg: Message }>()
</script>


<template>
  <div class="px-4 py-1">
    <div
      class="inline-block max-w-[80%] px-3 py-2 rounded-2xl shadow"
      :class="props.msg.direction === 'out'
        ? 'bg-emerald-600 text-white rounded-br-sm ml-auto'
        : 'bg-white dark:bg-gray-700 rounded-bl-sm'"
    >
      <div class="whitespace-pre-wrap">{{ props.msg.body }}</div>
      <div v-if="props.msg.attachments?.length" class="mt-2 space-y-1">
        <div v-for="a in props.msg.attachments" :key="a.id">
          <img v-if="a.mime.startsWith('image/')" :src="`/api/attachments/${a.id}`" class="max-w-full rounded" />
          <a v-else :href="`/api/attachments/${a.id}`" target="_blank" class="underline">{{ a.filename }}</a>
        </div>
      </div>
      <div class="text-[10px] opacity-70 text-right mt-1 flex items-center gap-1 justify-end">
        {{ new Date(props.msg.timestamp).toLocaleString() }}
        <span v-if="props.msg.direction === 'out'">
          <span v-if="props.msg.status === 'read'">✓✓</span>
          <span v-else>✓</span>
        </span>
      </div>
    </div>
  </div>
</template>
