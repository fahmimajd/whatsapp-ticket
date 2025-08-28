import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { Role } from './Role'

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Index({ unique: true })
  @Column({ type: 'varchar' }) username!: string
  @Column({ type: 'varchar' }) passwordHash!: string
  @ManyToOne(() => Role, role => role.users, { eager: true })
  role!: Role
  @CreateDateColumn() createdAt!: Date
  @UpdateDateColumn() updatedAt!: Date
}
