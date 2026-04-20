import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { auth, qs } from '../types'

const router = Router()
router.use(authenticate as any)

const clienteSchema = z.object({
  nombre:    z.string().min(1),
  apellido:  z.string().min(1),
  dni:       z.string().optional().nullable(),
  email:     z.string().email().optional().nullable(),
  telefono:  z.string().optional().nullable(),
  direccion: z.string().optional().nullable(),
  notas:     z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const { orgId } = auth(req).user
  const q = qs(req.query.q as string | undefined)

  const clientes = await db.cliente.findMany({
    where: {
      orgId,
      ...(q ? {
        OR: [
          { nombre:   { contains: q, mode: 'insensitive' } },
          { apellido: { contains: q, mode: 'insensitive' } },
          { dni:      { contains: q, mode: 'insensitive' } },
          { email:    { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    orderBy: { apellido: 'asc' },
    include: { _count: { select: { causas: true } } },
  })
  res.json({ ok: true, data: clientes })
})

router.get('/:id', async (req, res) => {
  const { orgId } = auth(req).user
  const cliente = await db.cliente.findFirst({
    where: { id: req.params.id, orgId },
    include: {
      causas:     { orderBy: { createdAt: 'desc' } },
      honorarios: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!cliente) { res.status(404).json({ ok: false, error: 'Cliente no encontrado' }); return }
  res.json({ ok: true, data: cliente })
})

router.post('/', validate(clienteSchema), async (req, res) => {
  const { orgId } = auth(req).user
  const cliente = await db.cliente.create({ data: { ...req.body, orgId } })
  res.status(201).json({ ok: true, data: cliente })
})

router.put('/:id', validate(clienteSchema.partial()), async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const existe = await db.cliente.findFirst({ where: { id, orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Cliente no encontrado' }); return }
  const cliente = await db.cliente.update({ where: { id }, data: req.body })
  res.json({ ok: true, data: cliente })
})

router.delete('/:id', async (req, res) => {
  const { user } = auth(req)
  const id = req.params.id as string
  if (!['TITULAR', 'ADMINISTRATIVO'].includes(user.rol)) {
    res.status(403).json({ ok: false, error: 'Sin permisos' }); return
  }
  const existe = await db.cliente.findFirst({ where: { id, orgId: user.orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Cliente no encontrado' }); return }
  await db.cliente.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
