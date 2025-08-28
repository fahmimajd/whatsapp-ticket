import { Express } from 'express'
import auth from './auth'
import tickets from './tickets'
import whatsapp from './whatsapp'
import attachments from './attachments'
import users from './users'

export function registerRoutes (app: Express) {
  app.use('/api/auth', auth)
  app.use('/api/tickets', tickets)
  app.use('/api/whatsapp', whatsapp)
  app.use('/api/attachments', attachments)
  app.use('/api/users', users)
  app.get('/api/health', (req, res) => res.json({ ok: true }))
}