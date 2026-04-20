import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { auth, qs } from '../types'

const router = Router()
router.use(authenticate as any)

const causaSchema = z.object({
  numeroExpediente: z.string().min(1),
  caratula:         z.string().min(1),
  fuero:            z.string().optional().nullable(),
  juzgado:          z.string().optional().nullable(),
  estado:           z.enum(['ACTIVA', 'SUSPENDIDA', 'ARCHIVADA', 'RESUELTA']).default('ACTIVA'),
  descripcion:      z.string().optional().nullable(),
  fechaInicio:      z.string().optional().nullable().transform(v => v ? new Date(v) : null),
  clienteId:        z.string().optional().nullable(),
  abogadoId:        z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const { orgId } = auth(req).user
  const estado = qs(req.query.estado as string | undefined)
  const q      = qs(req.query.q as string | undefined)

  const causas = await db.causa.findMany({
    where: {
      orgId,
      ...(estado ? { estado: estado as any } : {}),
      ...(q ? {
        OR: [
          { numeroExpediente: { contains: q, mode: 'insensitive' } },
          { caratula:         { contains: q, mode: 'insensitive' } },
          { fuero:            { contains: q, mode: 'insensitive' } },
        ],
      } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      cliente: { select: { id: true, nombre: true, apellido: true } },
      abogado: { select: { id: true, nombreCompleto: true } },
    },
  })
  res.json({ ok: true, data: causas })
})

router.get('/:id', async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const causa = await db.causa.findFirst({
    where: { id, orgId },
    include: {
      cliente:    true,
      abogado:    { select: { id: true, nombreCompleto: true, email: true } },
      eventos:    { orderBy: { fechaHora: 'asc' } },
      honorarios: true,
      documentos: { orderBy: { createdAt: 'desc' } },
    },
  })
  if (!causa) { res.status(404).json({ ok: false, error: 'Causa no encontrada' }); return }
  res.json({ ok: true, data: causa })
})

router.post('/', validate(causaSchema), async (req, res) => {
  const { orgId } = auth(req).user
  const existe = await db.causa.findUnique({
    where: { numeroExpediente_orgId: { numeroExpediente: req.body.numeroExpediente, orgId } },
  })
  if (existe) { res.status(409).json({ ok: false, error: 'Número de expediente ya registrado' }); return }
  const causa = await db.causa.create({ data: { ...req.body, orgId } })
  res.status(201).json({ ok: true, data: causa })
})

router.put('/:id', validate(causaSchema.partial()), async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const existe = await db.causa.findFirst({ where: { id, orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Causa no encontrada' }); return }
  const causa = await db.causa.update({ where: { id }, data: req.body })
  res.json({ ok: true, data: causa })
})

router.delete('/:id', async (req, res) => {
  const { user } = auth(req)
  const id = req.params.id as string
  if (user.rol !== 'TITULAR') {
    res.status(403).json({ ok: false, error: 'Solo el titular puede eliminar causas' }); return
  }
  const existe = await db.causa.findFirst({ where: { id, orgId: user.orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Causa no encontrada' }); return }
  await db.causa.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
