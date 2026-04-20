import type { Response, NextFunction, Request } from 'express'
import { type ZodSchema, ZodError } from 'zod'

// Valida req.body con un schema Zod. Si falla, devuelve 400 con los errores.
export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body)
      next()
    } catch (e) {
      if (e instanceof ZodError) {
        res.status(400).json({
          ok: false,
          error: 'Datos inválidos',
          detalles: e.errors.map(err => ({
            campo: err.path.join('.'),
            mensaje: err.message,
          })),
        })
        return
      }
      next(e)
    }
  }
}
