import { AppDataSource } from '../database/data-source'
import { Ticket } from '../entities/Ticket'
import { Message } from '../entities/Message'
import { Attachment } from '../entities/Attachment'
import { In } from 'typeorm'

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
    waMessageId?: string,
    attachmentIds: string[] = []
  ): Promise<Message> {
    const repo = AppDataSource.getRepository(Message)
    const attRepo = AppDataSource.getRepository(Attachment)

    if (direction === 'in') {
      await repo.update({ ticket: { id: ticketId }, direction: 'out', status: 'sent' }, { status: 'read' })
    }

    const m = repo.create({
      ticket: { id: ticketId } as Ticket,
      direction,
      body,
      waMessageId
    })
    const saved: Message = await repo.save(m)

    if (attachmentIds.length) {
      await attRepo.update({ id: In(attachmentIds) }, { message: { id: saved.id } as Message })
    }

    return await repo.findOne({ where: { id: saved.id }, relations: { attachments: true } }) as Message
  }
}
