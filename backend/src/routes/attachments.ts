import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { AppDataSource } from '../database/data-source.js'
import { Attachment } from '../entities/Attachment.js'
import path from 'path'

const r = Router()

r.use(requireAuth)

r.get('/:id', async (req, res) => {
  const repo = AppDataSource.getRepository(Attachment)
  const att = await repo.findOne({ where: { id: req.params.id } })
  if (!att) return res.status(404).json({ error: 'Not found' })
  res.type(att.mime)
  res.sendFile(path.resolve(att.path))
})

export default r