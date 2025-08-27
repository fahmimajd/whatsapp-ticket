import { makeWASocket, useMultiFileAuthState, DisconnectReason, proto, downloadContentFromMessage } from '@whiskeysockets/baileys'
import pino from 'pino'
import qrcode from 'qrcode-terminal'
import path from 'path'
import { promises as fs } from 'fs'
import { v4 as uuidv4 } from 'uuid'
import mime from 'mime-types'

import { TicketService } from './TicketService'
import { io } from '../ws'
import { AppDataSource } from '../database/data-source'
import { Attachment } from '../entities/Attachment'
import { Message as TicketMessage } from '../entities/Message'

export class WhatsAppService {
  private static sock: ReturnType<typeof makeWASocket> | null = null
  private static lastQR: string | null = null

  static async start () {
    const sessionDir = process.env.WA_SESSION_DIR || './wa-sessions'
      
      // Ensure directory exists
      await fs.mkdir(sessionDir, { recursive: true })
      
      const { state, saveCreds } = await useMultiFileAuthState(path.join(sessionDir, 'primary'))

      const sock = makeWASocket({
        printQRInTerminal: true,
        logger: pino({ level: 'info' }) as any,
        auth: state
      })

      sock.ev.on('creds.update', saveCreds)

      sock.ev.on('connection.update', (u) => {
        const { connection, lastDisconnect, qr } = u

        if (qr) {
          WhatsAppService.lastQR = qr
          try { 
            qrcode.generate(qr, { small: true }) 
            console.log('[wa] QR code generated, please scan with WhatsApp')
          } catch (e) {
            console.error('[wa] Error generating QR:', e)
          }
        } else {
          WhatsAppService.lastQR = null
        }

        io.emit('wa:connection', { connection, qr: qr || null })

        if (connection === 'close') {
          console.log('[wa] Connection closed:', lastDisconnect?.error)
          const shouldReconnect = (lastDisconnect?.error as any)?.output?.statusCode !== DisconnectReason.loggedOut
          if (shouldReconnect) {
            console.log('[wa] Reconnecting...')
            setTimeout(() => WhatsAppService.start().catch((err) => console.error('[wa] Reconnect error:', err)), 2_000)
          }
        } else if (connection === 'open') {
          console.log('[wa] Connected successfully')
        }
      })

      sock.ev.on('messages.upsert', async (m) => {
        try {
          const msg = m.messages?.[0]
          if (!msg || msg.key.fromMe) return
          
          const waId = msg.key.remoteJid!
          const text = extractText(msg)
          
          if (!TicketService || !AppDataSource) {
            console.log('[wa] Service not ready, skipping message processing')
            return
          }
          
          const ticket = await TicketService.getOrCreateByWaId(waId, 'Incoming WhatsApp')

        // Save text (and caption if any) as a message row
        const waMessageId = typeof msg.key.id === 'string' ? msg.key.id : undefined
                const saved: TicketMessage = await TicketService.addMessage(ticket.id, 'in', text, waMessageId)

        // Handle media: image/video/document/audio
        const content = msg.message || {}
        const attRepo = AppDataSource.getRepository(Attachment)

        async function saveMedia(contentPart: any, type: 'image'|'video'|'document'|'audio'|'sticker') {
          if (!contentPart) return;

          const mimeType: string =
            (typeof contentPart?.mimetype === 'string' && contentPart.mimetype) || 'application/octet-stream';

          const filenameFromMsg: string | undefined =
            (typeof contentPart?.fileName === 'string' && contentPart.fileName.trim() ? contentPart.fileName : undefined) ??
            (typeof contentPart?.filename === 'string' && contentPart.filename.trim() ? contentPart.filename : undefined);

          const stream = await downloadContentFromMessage(contentPart, type);
          const chunks: Buffer[] = [];
          for await (const chunk of stream) chunks.push(chunk as Buffer);
          const buffer = Buffer.concat(chunks);

          const ext = (mime.extension(mimeType) as string) || 'bin';
          const fileName = filenameFromMsg ?? `wa-${Date.now()}-${uuidv4().slice(0, 8)}.${ext}`;

          const uploadDir = process.env.UPLOAD_DIR || './uploads';
          await fs.mkdir(uploadDir, { recursive: true });
          const filePath = path.join(uploadDir, fileName);

          await fs.writeFile(filePath, buffer);

              const att = attRepo.create({
      message: saved,      // <-- relasi ke message
      mime: mimeType,
      filename: fileName,
      path: filePath
    });
          await attRepo.save(att);

          io.emit('ticket:updated', {
            ticketId: ticket.id,
            attachment: { id: att.id, filename: att.filename, mime: att.mime }
          });
        }

        await saveMedia(content.imageMessage, 'image')
        await saveMedia(content.videoMessage, 'video')
        await saveMedia(content.documentMessage, 'document')
        await saveMedia(content.audioMessage, 'audio')

        io.emit('ticket:updated', { ticketId: ticket.id, message: saved })
      } catch (err) {
        console.error('[wa] upsert error', err)
      }
    })

    WhatsAppService.sock = sock
    return sock
  }

  static async sendText (waId: string, text: string) {
    if (!WhatsAppService.sock) throw new Error('WhatsApp not connected')
    const res = await WhatsAppService.sock.sendMessage(waId, { text })
    return res
  }

  static getQR () {
    return WhatsAppService.lastQR
  }
}

function extractText (msg: proto.IWebMessageInfo): string {
  return (
    msg.message?.conversation ||
    msg.message?.extendedTextMessage?.text ||
    msg.message?.imageMessage?.caption ||
    msg.message?.videoMessage?.caption ||
    ''
  )
}
