import 'server-only'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadFile(file: File, folder = 'sadsat/products'): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer())
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'auto' }, (err, result) => {
        if (err || !result) reject(err ?? new Error('Upload failed'))
        else resolve(result.secure_url)
      })
      .end(buffer)
  })
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const match = url.match(/\/sadsat\/products\/([^.]+)/)
    if (!match) return
    await cloudinary.uploader.destroy(`sadsat/products/${match[1]}`, { resource_type: 'image' })
  } catch {}
}
