import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { AppDataSource } from '../database/data-source.js'
import { User } from '../entities/User.js'

export class AuthService {
  static async login (username: string, password: string) {
    const repo = AppDataSource.getRepository(User)
    const user = await repo.findOne({ where: { username } })
    if (!user) throw new Error('Invalid credentials')
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) throw new Error('Invalid credentials')
    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new Error('JWT_SECRET environment variable is not set')
    }
    const signOptions: jwt.SignOptions = {
      expiresIn: 604800 // 7 days in seconds
    }
    const token = jwt.sign(
      { sub: user.id, role: user.role.name },
      secret,
      signOptions
    )
    return { token, user: { id: user.id, username: user.username, role: user.role.name } }
  }
}
