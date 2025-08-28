export type TicketStatus = 'open' | 'pending' | 'closed'


export interface Message {
  id: string
  ticketId: number
  body: string
  from: string
  to: string
  direction: 'in' | 'out'
  timestamp: string
  status: 'sent' | 'read'
  attachments?: Attachment[]
}

export interface Attachment {
  id: string
  mime: string
  filename: string
  path: string
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

