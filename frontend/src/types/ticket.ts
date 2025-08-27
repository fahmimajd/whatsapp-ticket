export type TicketStatus = 'open' | 'pending' | 'closed'


export interface Message {
id: string
ticketId: number
body: string
from: string
to: string
direction: 'in' | 'out'
timestamp: string
}


export interface Ticket {
id: number
contactName: string
phone: string
lastMessage?: string
status: TicketStatus
unreadCount: number
createdAt: string
updatedAt: string
messages?: Message[]
}