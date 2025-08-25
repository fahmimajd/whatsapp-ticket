import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm'
import { Message } from './Message.js'

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Index()
  @Column({ type: 'varchar' }) customerWaId!: string // 628xxx@whatsapp.net
  @Column() subject!: string
  @Column({ default: 'open' }) status!: TicketStatus
  @Column({ nullable: true }) assignedToUserId?: string
  @OneToMany('Message', (message: Message) => message.ticket)
  messages!: Message[]
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}