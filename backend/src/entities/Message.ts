// src/entities/Message.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Index, OneToMany, JoinColumn } from 'typeorm'
import { Ticket } from './Ticket'
import { Attachment } from './Attachment'

@Entity({ name: 'messages' })
export class Message {
  @PrimaryGeneratedColumn('uuid') id!: string

  @ManyToOne(() => Ticket, t => t.messages, { eager: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ticketId' })   // kolom FK di DB tetap bernama ticketId
  ticket!: Ticket

  @Column({ type: 'varchar', length: 20 })  // tulis tipe eksplisit, hindari ColumnTypeUndefinedError
  direction!: 'in' | 'out'

  @Column({ type: 'text' })
  body!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  waMessageId?: string

  @OneToMany(() => Attachment, a => a.message)
  attachments!: Attachment[]

  @CreateDateColumn() createdAt!: Date
}
