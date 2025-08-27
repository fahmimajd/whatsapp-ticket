import http from './http'
import type { LoginPayload, TokenPayload, User } from '@/types/auth'

export async function login(
  payload: LoginPayload,
): Promise<{ token: string; user: User }> {
  const { data } = await http.post<TokenPayload & { user: User }>(
    'auth/login',
    payload,
  )
  return data
}

export async function me(): Promise<User> {
  const { data } = await http.get<User>('auth/me')
  return data
}

