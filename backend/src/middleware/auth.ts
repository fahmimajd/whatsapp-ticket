import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function requireAuth (req: Request, res: Response, next: NextFunction) {
  const hdr = req.headers.authorization
  const token = hdr?.startsWith('Bearer ') ? hdr.slice(7) : undefined
  if (!token) return res.status(401).json({ error: 'Unauthorized' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    ;(req as any).user = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export function requireRole (...roles: Array<'admin' | 'operator'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user || !roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' })
    next()
  }
}