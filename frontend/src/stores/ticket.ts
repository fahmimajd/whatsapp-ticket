import { defineStore } from 'pinia'
import {
  listTickets,
  getTicket,
  replyTicket,
  updateTicketStatus,
} from '@/api/tickets'
import type { Ticket, Message, TicketStatus } from '@/types/ticket'

interface State {
  tickets: Ticket[]
  activeId: number | null
  messages: Message[]
  loading: boolean
  filter: { status?: TicketStatus; q?: string }
}

export const useTicketStore = defineStore('ticket', {
  state: (): State => ({ tickets: [], activeId: null, messages: [], loading: false, filter: {} }),
  getters: {
    active: (s) => s.tickets.find((t) => t.id === s.activeId) || null,
  },
  actions: {
    async fetchTickets() {
      this.loading = true
      try {
        this.tickets = await listTickets(this.filter)
        if (this.activeId && !this.tickets.find((t) => t.id === this.activeId)) {
          this.activeId = this.tickets[0]?.id ?? null
        }
      } finally {
        this.loading = false
      }
    },
    async open(id: number) {
      this.activeId = id
      const t = await getTicket(id)
      this.messages = t.messages || []
    },
    async send(body: string) {
      if (!this.activeId) return
      const msg = await replyTicket(this.activeId, body)
      this.messages.push(msg)
    },
    async setStatus(status: TicketStatus) {
      if (!this.activeId) return
      const t = await updateTicketStatus(this.activeId, status)
      const idx = this.tickets.findIndex((tt) => tt.id === t.id)
      if (idx >= 0) this.tickets[idx] = t
    },
    upsertIncoming(msg: Message) {
      // dipanggil dari socket event `ticket:updated`
      if (this.activeId === msg.ticketId) this.messages.push(msg)
      const t = this.tickets.find((tt) => tt.id === msg.ticketId)
      if (t) {
        t.lastMessage = msg.body
        if (msg.direction === 'in') t.unreadCount += 1
      }
    },
  },
})

