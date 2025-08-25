import { promises as fs } from 'fs'
import path from 'path'

export async function ensureDirs (dirs: string[]) {
  for (const d of dirs) {
    await fs.mkdir(path.resolve(d), { recursive: true })
  }
}