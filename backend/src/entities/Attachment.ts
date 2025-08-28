// src/entities/Attachment.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Message } from './Message'

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn('uuid') id!: string

  @ManyToOne(() => Message, m => m.attachments, { onDelete: 'CASCADE', nullable: true })
  @JoinColumn({ name: 'messageId' })   // kolom FK di DB tetap bernama messageId
  message?: Message

  @Column({ type: 'varchar', length: 255 }) mime!: string
  @Column({ type: 'varchar', length: 255 }) filename!: string
  @Column({ type: 'varchar', length: 1000 }) path!: string

  @CreateDateColumn() createdAt!: Date
}