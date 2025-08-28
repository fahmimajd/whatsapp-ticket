<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
const theme = useThemeStore()
</script>

<template>
  <header class="h-12 border-b border-gray-200 flex items-center justify-between px-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
    <div class="font-medium">Tickets</div>
    <div class="flex items-center gap-3">
      <button class="text-sm px-2 py-1 border rounded" @click="theme.toggle()">
        {{ theme.dark ? 'Light' : 'Dark' }}
      </button>
      <slot />
    </div>
  </header>
</template>
