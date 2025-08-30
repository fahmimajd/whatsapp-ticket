import { Router } from 'express'
import { AuthService } from '../services/AuthService'
import { requireAuth } from '../middleware/auth'
import { AppDataSource } from '../database/data-source'
import { User } from '../entities/User'

const r = Router()

r.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    const out = await AuthService.login(username, password)
    res.json(out)
  } catch (e: any) {
    res.status(401).json({ error: e.message })
  }
})

r.get('/me', requireAuth, async (req, res) => {
  const repo = AppDataSource.getRepository(User)
  const user = await repo.findOne({
    where: { id: (req as any).user.sub },
    relations: { role: true },
  })
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ id: user.id, username: user.username, role: user.role.name })
})

export default r
