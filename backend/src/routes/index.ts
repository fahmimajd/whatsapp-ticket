import { Express } from 'express'
import auth from './auth.js'
import tickets from './tickets.js'
import whatsapp from './whatsapp.js'
import attachments from './attachments.js'

export function registerRoutes (app: Express) {
  app.use('/api/auth', auth)
  app.use('/api/tickets', tickets)
  app.use('/api/whatsapp', whatsapp)
  app.use('/api/attachments', attachments)
  app.get('/api/health', (req, res) => res.json({ ok: true }))
}