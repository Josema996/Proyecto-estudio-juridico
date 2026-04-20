import type { Request } from 'express'
import type { Rol } from '@prisma/client'

// Extiende Request con el usuario autenticado inyectado por el middleware JWT
export interface AuthRequest extends Request {
  user: {
    id: string
    orgId: string
    rol: Rol
    email: string
  }
}

// Helper para castear req en rutas autenticadas sin doble cast
export function auth(req: Request): AuthRequest {
  return req as unknown as AuthRequest
}

// Helper para obtener un query param como string simple
export function qs(val: string | string[] | undefined): string | undefined {
  if (Array.isArray(val)) return val[0]
  return val
}

export interface ApiResponse<T = unknown> {
  ok: boolean
  data?: T
  error?: string
}
