import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth'
import { AppDataSource } from '../database/data-source'
import { User } from '../entities/User'

import { Role } from '../entities/Role'
import bcrypt from 'bcryptjs'

const r = Router()

r.use(requireAuth, requireRole('admin'))

r.get('/', async (req, res) => {
  const repo = AppDataSource.getRepository(User)
  const users = await repo.find({ relations: { role: true } })
  res.json(users.map(u => ({ id: u.id, username: u.username, role: u.role.name })))
})


r.post('/', async (req, res) => {
  const { username, password, role } = req.body as { username: string; password: string; role?: string }
  if (!username || !password) return res.status(400).json({ error: 'username and password required' })

  const userRepo = AppDataSource.getRepository(User)
  const roleRepo = AppDataSource.getRepository(Role)

  const exists = await userRepo.findOne({ where: { username } })
  if (exists) return res.status(400).json({ error: 'username exists' })

  const roleEnt = await roleRepo.findOne({ where: { name: (role as any) || 'operator' } })
  if (!roleEnt) return res.status(400).json({ error: 'invalid role' })

  const passwordHash = await bcrypt.hash(password, 10)
  const user = userRepo.create({ username, passwordHash, role: roleEnt })
  await userRepo.save(user)
  res.json({ id: user.id, username: user.username, role: user.role.name })
})

export default r
