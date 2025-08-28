<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppTopbar from '@/components/layout/AppTopbar.vue'
import TicketList from '@/components/tickets/TicketList.vue'
import ChatHeader from '@/components/tickets/ChatHeader.vue'
import MessageBubble from '@/components/tickets/MessageBubble.vue'
import Composer from '@/components/tickets/Composer.vue'
import Modal from '@/components/common/Modal.vue'
import { useAuthStore } from '@/stores/auth'
import { useTicketStore } from '@/stores/ticket'
import { useSocket } from '@/composables/useSocket'
import type { Message } from '@/types/ticket'
import QRCode from 'qrcode'

const auth = useAuthStore()
const ticket = useTicketStore()
const { waState } = useSocket()
const showQr = ref(false)
const qrCanvas = ref<HTMLCanvasElement | null>(null)

function onTicketUpdated(e: Event) {
  const msg = (e as CustomEvent<Message>).detail
  ticket.upsertIncoming(msg)
}

onMounted(async () => {
  await auth.bootstrap()
  await ticket.fetchTickets()
  window.addEventListener('ticket-updated', onTicketUpdated as any)
})

onBeforeUnmount(() =>
  window.removeEventListener('ticket-updated', onTicketUpdated as any),
)

function openTicket(id: number) {
  ticket.open(id)
}

async function send(payload: { body: string; attachments: string[] }) {
  await ticket.send(payload.body, payload.attachments)
}

function onSearch(q: string) {
  ticket.filter.q = q
  ticket.fetchTickets()
}

watch(
  () => waState.value?.qr,
  (qr) => {
    if (waState.value?.state === 'qr' && qrCanvas.value && qr) {
      QRCode.toCanvas(qrCanvas.value, qr as string)
    }
  },
)
</script>

<template>
  <div class="h-screen grid grid-cols-[16rem_1fr] dark:bg-gray-800 dark:text-gray-100">
    <AppSidebar />
    <div class="flex flex-col">
      <AppTopbar>
        <button
          class="px-3 py-1.5 rounded-lg border"
          @click="showQr = true"
        >
          WA Connection
        </button>
      </AppTopbar>

      <div class="flex-1 grid grid-cols-[22rem_1fr]">
        <div class="border-r border-gray-200 dark:border-gray-700">
          <TicketList
            :tickets="ticket.tickets"
            :active-id="ticket.activeId"
            @open="openTicket"
            @search="onSearch"
          />
        </div>
        <div class="flex flex-col">
          <ChatHeader :ticket="ticket.active">
            <div class="flex items-center gap-2">
              <select
                class="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700"
                v-model="ticket.filter.status"
                @change="ticket.fetchTickets()"
              >
                <option :value="undefined">All</option>
                <option value="open">Open</option>
                <option value="pending">Pending</option>
                <option value="closed">Closed</option>
              </select>
              <button
                class="text-sm border rounded px-2 py-1 dark:border-gray-700"
                @click="ticket.setStatus('closed')"
                :disabled="!ticket.active"
              >
                Close
              </button>
            </div>
          </ChatHeader>

          <div class="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div class="max-w-3xl mx-auto py-2">
              <MessageBubble
                v-for="m in ticket.messages"
                :key="m.id"
                :msg="m"
              />
            </div>
          </div>
          <Composer @send="send" />
        </div>
      </div>

      <Modal :open="showQr" @close="showQr = false">
        <h2 class="text-lg font-semibold mb-2">WhatsApp Connection</h2>
        <p class="text-sm text-gray-600 mb-3">
          State: <b>{{ waState?.state || 'unknown' }}</b>
        </p>
        <div v-if="waState?.state === 'qr'">
          <p class="text-sm text-gray-600 mb-2">Scan QR berikut di WhatsApp:</p>
          <canvas ref="qrCanvas" class="mx-auto"></canvas>
        </div>
        <div v-else class="text-sm text-gray-600">
          Tidak ada QR tersedia saat ini.
        </div>
      </Modal>
    </div>
  </div>
</template>

