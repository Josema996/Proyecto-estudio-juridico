import express from 'express'
import cors from 'cors'
import { config } from './config'
import { db } from './db'

import authRouter       from './routes/auth'
import clientesRouter   from './routes/clientes'
import causasRouter     from './routes/causas'
import eventosRouter    from './routes/eventos'
import honorariosRouter from './routes/honorarios'
import documentosRouter from './routes/documentos'

const app = express()

// ── Middlewares globales ──────────────────────────────────────────────────────
app.use(cors({ origin: config.frontendUrl, credentials: true }))
app.use(express.json({ limit: '10mb' }))

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ ok: true, env: config.nodeEnv, timestamp: new Date().toISOString() })
})

// ── Rutas ─────────────────────────────────────────────────────────────────────
app.use('/api/auth',        authRouter)
app.use('/api/clientes',    clientesRouter)
app.use('/api/causas',      causasRouter)
app.use('/api/eventos',     eventosRouter)
app.use('/api/honorarios',  honorariosRouter)
app.use('/api/documentos',  documentosRouter)

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ ok: false, error: 'Ruta no encontrada' })
})

// ── Error handler global ─────────────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ ok: false, error: 'Error interno del servidor' })
})

// ── Start ─────────────────────────────────────────────────────────────────────
async function main() {
  await db.$connect()
  console.log('✅ Conectado a PostgreSQL')

  app.listen(config.port, () => {
    console.log(`🚀 API corriendo en http://localhost:${config.port}`)
  })
}

main().catch(err => {
  console.error('Error al iniciar:', err)
  process.exit(1)
})
