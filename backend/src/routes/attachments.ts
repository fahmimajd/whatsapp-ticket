import { Router } from 'express'
import { requireAuth } from '../middleware/auth'
import { AppDataSource } from '../database/data-source'
import { Attachment } from '../entities/Attachment'
import path from 'path'
import multer from 'multer'
import fs from 'fs'

const r = Router()

r.use(requireAuth)

const uploadDir = 'uploads'
fs.mkdirSync(uploadDir, { recursive: true })
const upload = multer({ dest: uploadDir })

r.post('/', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  const repo = AppDataSource.getRepository(Attachment)
  const att = repo.create({
    mime: req.file.mimetype,
    filename: req.file.originalname,
    path: req.file.path,
  })
  await repo.save(att)
  res.json(att)
})

r.get('/:id', async (req, res) => {
  const repo = AppDataSource.getRepository(Attachment)
  const att = await repo.findOne({ where: { id: req.params.id } })
  if (!att) return res.status(404).json({ error: 'Not found' })
  res.type(att.mime)
  res.sendFile(path.resolve(att.path))
})

export default r