import http from './http'
import type { LoginPayload, TokenPayload, User } from '@/types/auth'

export async function login(
  payload: LoginPayload,
): Promise<{ token: string; user: User }> {
  console.log('API Login request:', payload)
  try {
    const { data } = await http.post<TokenPayload & { user: User }>(
      '/auth/login',
      payload,
    )
    console.log('API Login success:', data)
    return data
  } catch (error) {
    console.error('API Login failed:', error)
    throw error
  }
}

export async function me(): Promise<User> {
  const { data } = await http.get<User>('/auth/me')
  return data
}
