import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'
import { User } from './User.js'

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid') id!: string
  @Column({ type: 'enum', enum: ['admin', 'operator'], unique: true })
  name!: 'admin' | 'operator'
  @OneToMany(() => User, u => u.role)
  users!: User[]
}