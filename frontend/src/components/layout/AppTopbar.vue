<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'
const theme = useThemeStore()
</script>

<template>

  <header
    class="h-12 border-b border-gray-200 flex items-center justify-between px-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
  >
    <div class="font-medium">Tickets</div>
    <div class="flex items-center gap-3">

  <header class="h-12 border-b border-gray-200 flex items-center justify-between px-4 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100">
    <div class="font-medium">Tickets</div>
    <div class="flex items-center gap-3">

      <button class="p-2 border rounded" @click="theme.toggle()" aria-label="Toggle theme">
        <svg v-if="theme.dark" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zM10 14a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.22 4.22a1 1 0 011.42 0l.7.7a1 1 0 01-1.42 1.42l-.7-.7a1 1 0 010-1.42zM14.36 14.36a1 1 0 011.41 0l.7.7a1 1 0 01-1.41 1.41l-.7-.7a1 1 0 010-1.41zM3 10a1 1 0 011-1H4a1 1 0 110 2H4a1 1 0 01-1-1zm12-1a1 1 0 100 2h1a1 1 0 100-2h-1zM5.22 14.78a1 1 0 011.42 0l.7-.7a1 1 0 10-1.42-1.42l-.7.7a1 1 0 000 1.42zM14.36 5.64a1 1 0 011.41 1.41l-.7.7a1 1 0 11-1.41-1.41l.7-.7zM10 6a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8 8 0 1010.586 10.586z" />
        </svg>

      <button class="text-sm px-2 py-1 border rounded" @click="theme.toggle()">
        {{ theme.dark ? 'Light' : 'Dark' }}


      </button>
      <slot />
    </div>
  </header>
</template>
