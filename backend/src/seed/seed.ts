import 'reflect-metadata'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import { AppDataSource } from '../database/data-source.js'
import { Role } from '../entities/Role.js'
import { User } from '../entities/User.js'

dotenv.config()

async function run () {
  await AppDataSource.initialize()

  const roleRepo = AppDataSource.getRepository(Role)
  const userRepo = AppDataSource.getRepository(User)

  let adminRole = await roleRepo.findOne({ where: { name: 'admin' as any } })
  if (!adminRole) {
    adminRole = roleRepo.create({ name: 'admin' as any })
    await roleRepo.save(adminRole)
    console.log('[seed] created role: admin')
  }

  let operatorRole = await roleRepo.findOne({ where: { name: 'operator' as any } })
  if (!operatorRole) {
    operatorRole = roleRepo.create({ name: 'operator' as any })
    await roleRepo.save(operatorRole)
    console.log('[seed] created role: operator')
  }

  const username = process.env.SEED_ADMIN_USERNAME || 'admin'
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123'

  let admin = await userRepo.findOne({ where: { username } })
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10)
    admin = userRepo.create({ username, passwordHash, role: adminRole! })
    await userRepo.save(admin)
    console.log(`[seed] created admin user: ${username}`)
  } else {
    console.log(`[seed] admin user already exists: ${username}`)
  }

  await AppDataSource.destroy()
}

run().catch((e) => {
  console.error('[seed] error:', e)
  process.exit(1)
})