import { io, type Socket } from 'socket.io-client'
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { WaConnectionPayload } from '@/types/socket'
import type { Message } from '@/types/ticket'

export function useSocket() {
  const auth = useAuthStore()
  const socket = ref<Socket | null>(null)
  const waState = ref<WaConnectionPayload | null>(null)

  const connect = () => {
    if (!auth.token) return
    socket.value = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: auth.token },
    })

    socket.value.on('connect', () => {
      // console.debug('socket connected', socket.value?.id)
    })

    socket.value.on('wa:connection', (payload: WaConnectionPayload) => {
      waState.value = payload
    })

    socket.value.on('ticket:updated', (msg: Message) => {
      // defer handling di halaman Tickets via prop/callback atau store
      const ev = new CustomEvent<Message>('ticket-updated', { detail: msg })
      window.dispatchEvent(ev)
    })
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
  }

  onMounted(connect)
  onUnmounted(disconnect)

  return { socket, waState }
}

