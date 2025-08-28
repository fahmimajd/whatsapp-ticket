import http from './http'
import type { User } from '@/types/user'

export async function listUsers() {
  const { data } = await http.get<User[]>('users')
  return data
}
