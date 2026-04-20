import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { auth, qs } from '../types'

const router = Router()
router.use(authenticate as any)

const eventoSchema = z.object({
  titulo:      z.string().min(1),
  descripcion: z.string().optional().nullable(),
  tipo:        z.enum(['AUDIENCIA', 'VENCIMIENTO', 'REUNION', 'OTRO']).default('OTRO'),
  fechaHora:   z.string().transform(v => new Date(v)),
  causaId:     z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const { orgId } = auth(req).user
  const causaId = qs(req.query.causaId as string | undefined)
  const desde   = qs(req.query.desde as string | undefined)
  const hasta   = qs(req.query.hasta as string | undefined)

  const eventos = await db.evento.findMany({
    where: {
      orgId,
      ...(causaId ? { causaId } : {}),
      ...(desde || hasta ? {
        fechaHora: {
          ...(desde ? { gte: new Date(desde) } : {}),
          ...(hasta ? { lte: new Date(hasta) } : {}),
        },
      } : {}),
    },
    orderBy: { fechaHora: 'asc' },
    include: { causa: { select: { id: true, numeroExpediente: true, caratula: true } } },
  })
  res.json({ ok: true, data: eventos })
})

router.post('/', validate(eventoSchema), async (req, res) => {
  const { orgId, id: creadoPorId } = auth(req).user
  const evento = await db.evento.create({
    data: { ...req.body, orgId, creadoPorId },
    include: { causa: { select: { id: true, numeroExpediente: true, caratula: true } } },
  })
  res.status(201).json({ ok: true, data: evento })
})

router.put('/:id', validate(eventoSchema.partial()), async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const existe = await db.evento.findFirst({ where: { id, orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Evento no encontrado' }); return }
  const evento = await db.evento.update({ where: { id }, data: req.body })
  res.json({ ok: true, data: evento })
})

router.delete('/:id', async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const existe = await db.evento.findFirst({ where: { id, orgId } })
  if (!existe) { res.status(404).json({ ok: false, error: 'Evento no encontrado' }); return }
  await db.evento.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
