import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, OneToMany } from 'typeorm'
import { Ticket } from './Ticket.js'
import { Attachment } from './Attachment.js'

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Index()
  @Column({ type: 'uuid' }) ticketId!: string
  @ManyToOne('Ticket', (t: Ticket) => t.messages, { eager: true })
  ticket!: Ticket
  @Column({ length: 20 }) direction!: 'in' | 'out'
  @Column({ type: 'text' }) body!: string
  @Column({ nullable: true }) waMessageId?: string
  @OneToMany('Attachment', (a: Attachment) => a.message)
  attachments!: Attachment[]
  @CreateDateColumn() createdAt!: Date
}