import { PrismaClient } from '@prisma/client'

// Singleton del cliente Prisma
export const db = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})
