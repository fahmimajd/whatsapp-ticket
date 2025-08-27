<script setup lang="ts">
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import { useAuthStore } from '@/stores/auth'


const auth = useAuthStore()
</script>


<template>
<div class="h-screen grid grid-cols-[16rem_1fr]">
<AppSidebar />
<div class="flex flex-col">
<AppTopbar />
<div class="p-6 space-y-4">
<h2 class="text-xl font-semibold">Settings</h2>
<div class="space-y-2">
<div class="text-sm">User: <b>{{ auth.user?.name }}</b> ({{ auth.user?.role }})</div>
<button class="px-3 py-1.5 rounded-lg border" @click="auth.logout()">Logout</button>
</div>
</div>
</div>
</div>
</template>