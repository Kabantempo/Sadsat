import { v2 as cloudinary } from 'cloudinary'
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  const session = await getSession()
  if (!session?.userId || (session.role !== 'admin' && session.role !== 'créateur')) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = 'sadsat/products/videos'
  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    folder,
  })
}
