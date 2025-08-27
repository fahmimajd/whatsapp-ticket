export interface LoginPayload { email: string; password: string }
export interface TokenPayload { token: string }
export interface User { id: number; name: string; role: 'admin' | 'operator' }
