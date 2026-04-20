import type { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import type { AuthRequest } from '../types'
import type { Rol } from '@prisma/client'

interface JwtPayload {
  id: string
  orgId: string
  rol: Rol
  email: string
}

// Verifica el JWT y carga el usuario en req.user
export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ ok: false, error: 'Token requerido' })
    return
  }

  const token = header.slice(7)
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JwtPayload
    req.user = payload
    next()
  } catch {
    res.status(401).json({ ok: false, error: 'Token inválido o expirado' })
  }
}

// Verifica que el usuario tenga uno de los roles permitidos
export function authorize(...roles: Rol[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.rol)) {
      res.status(403).json({ ok: false, error: 'Sin permisos para esta acción' })
      return
    }
    next()
  }
}
