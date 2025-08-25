import { DataSource } from 'typeorm'
import { User } from '../entities/User.js'
import { Role } from '../entities/Role.js'
import { Ticket } from '../entities/Ticket.js'
import { Message } from '../entities/Message.js'
import { WhatsAppSession } from '../entities/WhatsAppSession.js'
import { Attachment } from '../entities/Attachment.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // use migrations in production
  logging: false,
  entities: [User, Role, Ticket, Message, WhatsAppSession, Attachment],
  migrations: [__dirname + '/../migrations/*.js']
})