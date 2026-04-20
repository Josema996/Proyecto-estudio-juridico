import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { db } from '../db'
import { config } from '../config'
import { validate } from '../middleware/validate'
import { authenticate } from '../middleware/auth'
import { auth } from '../types'

const router = Router()

function signToken(payload: object): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

// ── POST /auth/register ── Crea org + primer usuario titular ────────────────
const registerSchema = z.object({
  orgNombre:      z.string().min(2),
  orgSlug:        z.string().min(2).regex(/^[a-z0-9-]+$/, 'Solo minúsculas, números y guiones'),
  email:          z.string().email(),
  password:       z.string().min(8),
  nombreCompleto: z.string().min(2),
})

router.post('/register', validate(registerSchema), async (req, res) => {
  const { orgNombre, orgSlug, email, password, nombreCompleto } = req.body

  const slugExistente = await db.organizacion.findUnique({ where: { slug: orgSlug } })
  if (slugExistente) {
    res.status(409).json({ ok: false, error: 'El slug de organización ya está en uso' })
    return
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const org = await db.organizacion.create({
    data: {
      nombre: orgNombre,
      slug: orgSlug,
      usuarios: { create: { email, passwordHash, nombreCompleto, rol: 'TITULAR' } },
    },
    include: { usuarios: true },
  })

  const usuario = org.usuarios[0]
  const token = signToken({ id: usuario.id, orgId: org.id, rol: usuario.rol, email: usuario.email })

  res.status(201).json({
    ok: true,
    data: {
      token,
      usuario: { id: usuario.id, email: usuario.email, nombreCompleto: usuario.nombreCompleto, rol: usuario.rol },
      org:     { id: org.id, nombre: org.nombre, slug: org.slug },
    },
  })
})

// ── POST /auth/login ─────────────────────────────────────────────────────────
const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
  orgSlug:  z.string().min(1),
})

router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password, orgSlug } = req.body

  const org = await db.organizacion.findUnique({ where: { slug: orgSlug } })
  if (!org) { res.status(401).json({ ok: false, error: 'Credenciales incorrectas' }); return }

  const usuario = await db.usuario.findUnique({ where: { email_orgId: { email, orgId: org.id } } })
  if (!usuario || !usuario.activo) { res.status(401).json({ ok: false, error: 'Credenciales incorrectas' }); return }

  const passwordOk = await bcrypt.compare(password, usuario.passwordHash)
  if (!passwordOk) { res.status(401).json({ ok: false, error: 'Credenciales incorrectas' }); return }

  const token = signToken({ id: usuario.id, orgId: org.id, rol: usuario.rol, email: usuario.email })

  res.json({
    ok: true,
    data: {
      token,
      usuario: { id: usuario.id, email: usuario.email, nombreCompleto: usuario.nombreCompleto, rol: usuario.rol },
      org:     { id: org.id, nombre: org.nombre, slug: org.slug },
    },
  })
})

// ── GET /auth/me ─────────────────────────────────────────────────────────────
router.get('/me', authenticate as any, async (req, res) => {
  const { id, orgId } = auth(req).user
  const usuario = await db.usuario.findUnique({
    where: { id },
    select: { id: true, email: true, nombreCompleto: true, rol: true, telefono: true },
  })
  const org = await db.organizacion.findUnique({
    where: { id: orgId },
    select: { id: true, nombre: true, slug: true },
  })
  res.json({ ok: true, data: { usuario, org } })
})

// ── POST /auth/usuarios ── Titular agrega usuarios al estudio ────────────────
const crearUsuarioSchema = z.object({
  email:          z.string().email(),
  password:       z.string().min(8),
  nombreCompleto: z.string().min(2),
  rol:            z.enum(['TITULAR', 'ASOCIADO', 'ADMINISTRATIVO', 'CLIENTE']),
  telefono:       z.string().optional(),
})

router.post('/usuarios', authenticate as any, validate(crearUsuarioSchema), async (req, res) => {
  const { user } = auth(req)
  if (user.rol !== 'TITULAR') {
    res.status(403).json({ ok: false, error: 'Solo el titular puede crear usuarios' }); return
  }
  const { email, password, nombreCompleto, rol, telefono } = req.body
  const passwordHash = await bcrypt.hash(password, 12)
  const usuario = await db.usuario.create({
    data: { email, passwordHash, nombreCompleto, rol, telefono, orgId: user.orgId },
    select: { id: true, email: true, nombreCompleto: true, rol: true },
  })
  res.status(201).json({ ok: true, data: usuario })
})

export default router
