import 'server-only'
import { PrismaClient } from '@prisma/client'

declare global {
  // eslint-disable-next-line no-var
  var _prisma: PrismaClient | undefined
}

export const prisma = global._prisma ?? new PrismaClient()

global._prisma = prisma
