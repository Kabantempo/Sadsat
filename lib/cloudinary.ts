import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(file: File, folder?: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  const isVideo = file.type.startsWith('video/')

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder || 'sadsat',
        resource_type: isVideo ? 'video' : 'auto',
      },
      (error, result) => {
        if (error) reject(new Error(`Cloudinary upload failed: ${error.message}`))
        else resolve(result?.secure_url || '')
      }
    )
    uploadStream.end(buffer)
  })
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const match = url.match(/upload\/(?:v\d+\/)?([^?]+)$/)
    if (!match) return
    const publicId = match[1]
    const isVideo = url.includes('sadsat/products/videos')
    await cloudinary.uploader.destroy(publicId, {
      resource_type: isVideo ? 'video' : 'image',
    }).catch(() => null)
  } catch (err) {
    console.error('[deleteFile]', err)
  }
}
