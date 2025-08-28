<script setup lang="ts">
import { ref } from 'vue'
import { uploadAttachment } from '@/api/attachments'
const emit = defineEmits<{ (e: 'send', payload: { body: string; attachments: string[] }): void }>()
const text = ref('')
const attachments = ref<string[]>([])
const fileInput = ref<HTMLInputElement | null>(null)

async function onFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files
  if (!files || !files.length) return
  for (const f of Array.from(files)) {
    const up = await uploadAttachment(f)
    attachments.value.push(up.id)
  }
  ;(e.target as HTMLInputElement).value = ''
}

function submit() {
  if (!text.value.trim() && attachments.value.length === 0) return
  emit('send', { body: text.value.trim(), attachments: attachments.value })
  text.value = ''
  attachments.value = []
}
</script>


<template>
<div class="border-t border-gray-200 p-3 flex items-center gap-2 dark:border-gray-700">
  <input type="file" class="hidden" ref="fileInput" @change="onFileChange" />
  <button
    class="px-3 py-2 border rounded bg-white text-sm dark:bg-gray-800 dark:border-gray-600"
    @click="(fileInput as any).click()"
  >
    📎
  </button>
  <textarea
    v-model="text"
    rows="2"
    placeholder="Tulis pesan…"
    class="flex-1 resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring dark:bg-gray-800 dark:border-gray-600"
  ></textarea>
  <button @click="submit" class="px-4 py-2 rounded-lg bg-emerald-600 text-white">Kirim</button>
</div>
</template>
