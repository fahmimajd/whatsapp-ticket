import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { User } from '../entities/User'
import { Role } from '../entities/Role'
import { Ticket } from '../entities/Ticket'
import { Message } from '../entities/Message'
import { WhatsAppSession } from '../entities/WhatsAppSession'
import { Attachment } from '../entities/Attachment'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export let AppDataSource: DataSource

export function createDataSource() {
  AppDataSource = new DataSource({
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
  return AppDataSource
}
