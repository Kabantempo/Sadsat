import 'server-only'
import { prisma } from './prisma'

export async function uploadFile(file: File, _folder?: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const id = crypto.randomUUID()
  const mimeType = file.type || 'application/octet-stream'
  await prisma.productImage.create({ data: { id, data: buffer, mimeType } })
  return `/api/images/${id}`
}

export async function deleteFile(url: string): Promise<void> {
  const match = url.match(/\/api\/images\/([^/?#]+)/)
  if (!match) return
  await prisma.productImage.delete({ where: { id: match[1] } }).catch(() => null)
}
