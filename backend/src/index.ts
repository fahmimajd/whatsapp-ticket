import { config } from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
console.log('Current working directory:', process.cwd())
const result = config()
if (result.error) {
  console.error('Failed to load .env file:', result.error)
} else {
  console.log('Environment variables loaded successfully')
  console.log('DB_USERNAME:', process.env.DB_USERNAME)
}

import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import http from 'http'
import { Server as IOServer } from 'socket.io'
import { createDataSource } from './database/data-source.js'
import { registerRoutes } from './routes/index.js'
import { initWS } from './ws.js'
import { ensureDirs } from './utils/fs.js' 

// Create DataSource after environment variables are loaded
const AppDataSource = createDataSource()

const app = express()

app.use(helmet())
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(rateLimit({ windowMs: 60_000, max: 120 }))

const server = http.createServer(app)
const io = new IOServer(server, { cors: { origin: process.env.CORS_ORIGIN?.split(',') || true } })

initWS(io)

registerRoutes(app)

const PORT = Number(process.env.PORT || 8080)

async function start () {
  try {
    await ensureDirs([process.env.UPLOAD_DIR || './uploads', process.env.WA_SESSION_DIR || './wa-sessions'])
    await AppDataSource.initialize()
    server.listen(PORT, () => console.log(`[server] listening on :${PORT}`))
  } catch (err) {
    console.error('[server] failed to start:', err)
    process.exit(1)
  }
}

start().catch(err => {
  console.error('[server] unexpected error:', err)
  process.exit(1)
})
