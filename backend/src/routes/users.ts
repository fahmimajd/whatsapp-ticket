import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { AppDataSource } from '../database/data-source'
import { User } from '../entities/User'

const r = Router()

r.use(requireAuth, requireRole('admin'))

r.get('/', async (req, res) => {
  const repo = AppDataSource.getRepository(User)
  const users = await repo.find({ relations: { role: true } })
  res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role.name })))
})

export default r
