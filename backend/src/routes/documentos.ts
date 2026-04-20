import { Router } from 'express'
import { z } from 'zod'
import { db } from '../db'
import { authenticate } from '../middleware/auth'
import { validate } from '../middleware/validate'
import { auth, qs } from '../types'

const router = Router()
router.use(authenticate as any)

const documentoSchema = z.object({
  nombre:      z.string().min(1),
  descripcion: z.string().optional().nullable(),
  storagePath: z.string().min(1),
  mimeType:    z.string().optional().nullable(),
  sizeBytes:   z.number().optional().nullable(),
  causaId:     z.string().optional().nullable(),
  clienteId:   z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const { orgId } = auth(req).user
  const causaId   = qs(req.query.causaId as string | undefined)
  const clienteId = qs(req.query.clienteId as string | undefined)

  const documentos = await db.documento.findMany({
    where: {
      orgId,
      ...(causaId   ? { causaId }   : {}),
      ...(clienteId ? { clienteId } : {}),
    },
    orderBy: { createdAt: 'desc' },
    include: {
      causa:   { select: { id: true, numeroExpediente: true } },
      cliente: { select: { id: true, nombre: true, apellido: true } },
    },
  })

  res.json({ ok: true, data: documentos })
})

router.post('/', validate(documentoSchema), async (req, res) => {
  const { orgId, id: subidoPorId } = auth(req).user
  const documento = await db.documento.create({
    data: { ...req.body, orgId, subidoPorId },
  })
  res.status(201).json({ ok: true, data: documento })
})

router.delete('/:id', async (req, res) => {
  const { orgId } = auth(req).user
  const id = req.params.id as string
  const doc = await db.documento.findFirst({ where: { id, orgId } })
  if (!doc) { res.status(404).json({ ok: false, error: 'Documento no encontrado' }); return }
  await db.documento.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
