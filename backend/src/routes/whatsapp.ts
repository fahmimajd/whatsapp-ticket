import { Router } from 'express'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { WhatsAppService } from '../services/WhatsAppService.js'
import { promises as fs } from 'fs'
import path from 'path'

const r = Router()

r.use(requireAuth)

r.post('/start', requireRole('admin'), async (req, res) => {
  try {
    await WhatsAppService.start()

    // wait for QR to be generated
    let qr: string | null = null
    for (let i = 0; i < 20; i++) {
      qr = WhatsAppService.getQR()
      if (qr) break
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    res.json({ ok: true, qr })
  } catch (error) {
    console.error('[api] Error starting WhatsApp:', error)
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to start WhatsApp service' })
  }
})

r.get('/qr', requireRole('admin'), async (_req, res) => {
  const qr = WhatsAppService.getQR()
  res.json({ qr })
})

r.get('/qr-image', requireRole('admin'), async (_req, res) => {
  try {
    const qr = WhatsAppService.getQR()
    if (!qr) {
      return res.status(404).json({ error: 'QR code not available' })
    }

    const QRCode = await import('qrcode')
    const png = await QRCode.toBuffer(qr, {
      width: 256,
      margin: 2,
      color: { dark: '#000000ff', light: '#ffffffff' }
    })

    res.type('png').send(png)
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate QR image' })
  }
})

r.post('/reset', requireRole('admin'), async (_req, res) => {
  const dir = path.resolve(process.env.WA_SESSION_DIR || './wa-sessions', 'primary')
  await fs.rm(dir, { recursive: true, force: true })
  res.json({ ok: true, message: 'Session cleared. Call /api/whatsapp/start to get new QR.' })
})

r.post('/send', requireRole('admin', 'operator'), async (req, res) => {
  const { waId, text } = req.body
  const out = await WhatsAppService.sendText(waId, text)
  res.json({ ok: true, id: out?.key?.id })
})

export default r