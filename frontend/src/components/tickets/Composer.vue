<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits<{ (e: 'send', body: string): void }>()
const text = ref('')
function submit() {
if (!text.value.trim()) return
emit('send', text.value.trim())
text.value = ''
}
</script>


<template>
<div class="border-t border-gray-200 p-3 flex items-center gap-2">
<textarea v-model="text" rows="2" placeholder="Tulis pesan…" class="flex-1 resize-none rounded-lg border px-3 py-2 focus:outline-none focus:ring"></textarea>
<button @click="submit" class="px-4 py-2 rounded-lg bg-emerald-600 text-white">Kirim</button>
</div>
</template>
