export interface LoginPayload { username: string; password: string }
export interface TokenPayload { token: string }
export interface User { id: string; username: string; role: 'admin' | 'operator' }
