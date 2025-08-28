import http from './http'
import type { User } from '@/types/user'

export async function listUsers() {
  const { data } = await http.get<User[]>('users')
  return data
}


export async function createUser(payload: { username: string; password: string; role: string }) {
  const { data } = await http.post<User>('users', payload)
  return data
}
