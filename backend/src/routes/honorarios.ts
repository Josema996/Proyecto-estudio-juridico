import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { auth, qs } from '../types'

const router = Router()
router.use(authenticate as any)

const honorarioSchema = z.object({
  concepto:     z.string().min(1),
  montoTotal:   z.number().positive(),
  montoPagado:  z.number().min(0).default(0),
  estado:       z.enum(['PENDIENTE', 'PARCIAL', 'CANCELADO']).default('PENDIENTE'),
  fechaAcuerdo: z.string().optional().nullable().transform(v => v ? new Date(v) : null),
  notas:        z.string().optional().nullable(),
  causaId:      z.string().optional().nullable(),
  clienteId:    z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const { orgId } = auth(req).user
  const estado = qs(req.query.estado as string | undefined)

  const honorarios = await db.honorario.findMany({
    where: { orgId, ...(estado ? { estado: estado as any } : {}) },
    orderBy: { createdAt: 'desc' },
    include: {
      causa:   { select: { id: true, numeroExpediente: true, caratula: true } },
      cliente: { select: { id: true, nombre: true, apellido: true } },
    },
  })

  const totales = honorarios.reduce(
    (acc, h) => ({ total: acc.total + Number(h.montoTotal), pagado: acc.pagado + Number(h.montoPagado) }),
    { total: 0, pagado: 0 }
  )

  res.json({ ok: true, data: honorarios, meta: { ...totales, pendiente: totales.total - totales.pagado } })
})

router.post('/', validate(honorarioSchema), async (req, res) => {
  const { orgId, rol } = auth(req).user
  if (!['TITULAR', 'ADMINISTRATIVO'].includes(rol)) {
    res.status(403).json({ ok: false, error: 'Sin permisos' }); return
  }
  const honorario = await db.honorario.create({
    data: { ...req.body, orgId },
    include: {
      causa:   { select: { id: true, numeroExpediente: true } },
      cliente: { select: { id: true, nombre: true, apellido: true } },
    },
  })
  res.status(201).json({ ok: true, data: honorario })
})

router.put('/:id', validate(honorarioSchema.partial()), async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const existe = await db.honorario.findFirst({ where: { id, orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Honorario no encontrado' }); return }
  const honorario = await db.honorario.update({ where: { id }, data: req.body })
  res.json({ ok: true, data: honorario })
})

router.delete('/:id', async (req, res) => {
  const { user } = auth(req)
  const id = req.params.id as string
  if (user.rol !== 'TITULAR') {
    res.status(403).json({ ok: false, error: 'Solo el titular puede eliminar honorarios' }); return
  }
  const existe = await db.honorario.findFirst({ where: { id, orgId: user.orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Honorario no encontrado' }); return }
  await db.honorario.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
