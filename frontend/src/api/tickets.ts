import http from './http'
import type { Ticket, Message } from '@/types/ticket'

export async function listTickets(params?: { status?: string; q?: string }) {
  const { data } = await http.get<Ticket[]>('tickets', { params })
  return data
}

export async function getTicket(id: number) {
  const { data } = await http.get<Ticket>(`tickets/${id}`)
  return data
}

export async function replyTicket(id: number, body: string, attachments: string[] = []) {
  const { data } = await http.post<Message>(`tickets/${id}/reply`, { body, attachments })
  return data
}

export async function updateTicketStatus(
  id: number,
  status: 'open' | 'pending' | 'closed',
) {
  const { data } = await http.patch<Ticket>(`tickets/${id}`, { status })
  return data
}

