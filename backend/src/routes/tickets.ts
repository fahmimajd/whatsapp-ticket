import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { AppDataSource } from '../database/data-source'
import { Ticket } from '../entities/Ticket'
import { TicketService } from '../services/TicketService'
import { WhatsAppService } from '../services/WhatsAppService'

const r = Router()

r.use(requireAuth)

r.get('/', async (req, res) => {
  const repo = AppDataSource.getRepository(Ticket)
  const qb = repo.createQueryBuilder('t').orderBy('t.updatedAt', 'DESC').take(100)
  const { q, status } = req.query as any
  if (status) qb.andWhere('t.status = :status', { status })
  if (q) qb.andWhere('(t.subject LIKE :q OR t.customerWaId LIKE :q)', { q: `%${q}%` })
  const items = await qb.getMany()
  res.json(items)
})

r.get('/:id', async (req, res) => {
  const repo = AppDataSource.getRepository(Ticket)
  const t = await repo.findOne({
    where: { id: req.params.id },
    relations: { messages: { attachments: true } }
  })
  if (!t) return res.status(404).json({ error: 'Not found' })
  res.json(t)
})

r.post('/:id/reply', requireRole('admin', 'operator'), async (req, res) => {
  try {
    const id = req.params.id
    const { body, waId, attachments = [] } = req.body
    const sent = await WhatsAppService.sendText(waId, body)
    const saved = await TicketService.addMessage(id, 'out', body, sent?.key?.id ?? undefined, attachments)
    res.json(saved)
  } catch (e: any) {
    res.status(400).json({ error: e.message })
  }
})

r.patch('/:id/status', requireRole('admin', 'operator'), async (req, res) => {
  const repo = AppDataSource.getRepository(Ticket)
  const t = await repo.findOneBy({ id: req.params.id })
  if (!t) return res.status(404).json({ error: 'Not found' })
  t.status = req.body.status
  await repo.save(t)
  res.json(t)
})

export default r