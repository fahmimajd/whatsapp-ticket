import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity({ name: 'wa_sessions' })
export class WhatsAppSession {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column({ unique: true }) name!: string // e.g., "primary"
  @Column({ type: 'longtext', nullable: true }) stateJson?: string // serialized auth state
  @Column({ default: true }) isActive!: boolean
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}