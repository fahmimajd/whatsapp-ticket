<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits(['close'])
</script>


<template>
<div v-if="props.open" class="fixed inset-0 z-50 flex items-center justify-center">
<div class="absolute inset-0 bg-black/40" @click="emit('close')"></div>
<div class="relative bg-white rounded-2xl shadow-xl w-[32rem] max-w-[95vw] p-4">
<slot />
</div>
</div>
</template>
