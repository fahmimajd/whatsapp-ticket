import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { AppDataSource } from '../database/data-source.js'
import { Ticket } from '../entities/Ticket.js'
import { TicketService } from '../services/TicketService.js'
import { WhatsAppService } from '../services/WhatsAppService.js'

const r = Router()

r.use(requireAuth)

r.get('/', async (req, res) => {
  const repo = AppDataSource.getRepository(Ticket)
  const items = await repo.find({ order: { updatedAt: 'DESC' }, take: 100 })
  res.json(items)
})

r.post('/:id/reply', requireRole('admin', 'operator'), async (req, res) => {
  try {
    const id = req.params.id
    const { text, waId } = req.body
    const sent = await WhatsAppService.sendText(waId, text)
    const saved = await TicketService.addMessage(id, 'out', text, sent?.key?.id ?? undefined)
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