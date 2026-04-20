import dotenv from 'dotenv'
dotenv.config()

function required(key: string): string {
  const val = process.env[key]
  if (!val) throw new Error(`Variable de entorno requerida: ${key}`)
  return val
}

export const config = {
  port:        parseInt(process.env.PORT ?? '3001'),
  jwtSecret:   required('JWT_SECRET'),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  nodeEnv:     process.env.NODE_ENV ?? 'development',
}
