import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { Message } from './Message.js'

@Entity({ name: 'attachments' })
export class Attachment {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column() messageId!: string
  @ManyToOne('Message', (message: Message) => message.attachments)
  message!: Message
  @Column() mime!: string
  @Column() filename!: string
  @Column() path!: string
  @CreateDateColumn() createdAt!: Date
}
