import { AppDataSource } from '../database/data-source.js'
import { Ticket } from '../entities/Ticket.js'
import { Message } from '../entities/Message.js'

export class TicketService {
  static async getOrCreateByWaId (waId: string, subject?: string): Promise<Ticket> {
    const repo = AppDataSource.getRepository(Ticket)
    let ticket = await repo.findOne({ where: { customerWaId: waId, status: 'open' } })
    if (!ticket) {
      ticket = repo.create({ customerWaId: waId, subject: subject || 'New Conversation', status: 'open' })
      await repo.save(ticket)
    }
    return ticket
  }

  static async addMessage (
    ticketId: string,
    direction: 'in' | 'out',
    body: string,
    waMessageId?: string
  ): Promise<Message> {
    const repo = AppDataSource.getRepository(Message)
    const m = repo.create({
      ticket: { id: ticketId } as Ticket,
      direction,
      body,
      waMessageId
    })
    const saved: Message = await repo.save(m)
    return saved
  }
}
