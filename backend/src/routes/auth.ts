import { Router } from 'express'
import { AuthService } from '../services/AuthService.js'

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

export default r