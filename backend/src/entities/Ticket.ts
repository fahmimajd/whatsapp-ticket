import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm'
import { Message } from './Message.js'

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Index()
  @Column({ type: 'varchar', length: 255 }) customerWaId!: string // 628xxx@whatsapp.net
  @Column({ type: 'varchar', length: 255 }) subject!: string
  @Column({ type: 'varchar', length: 20, default: 'open' }) status!: TicketStatus
  @Column({ type: 'varchar', length: 36, nullable: true }) assignedToUserId?: string
  @OneToMany(() => Message, (message) => message.ticket)
  messages!: Message[]
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}
