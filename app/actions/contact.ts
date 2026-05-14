'use server'
import { z } from 'zod'
import { sendContactEmail } from '@/lib/email'

const ContactSchema = z.object({
  name: z.string().min(2, 'Le nom est requis.').trim(),
  email: z.string().email('Email invalide.').trim(),
  subject: z.string().min(2, 'Le sujet est requis.').trim(),
  message: z.string().min(10, 'Le message doit faire au moins 10 caractères.').trim(),
})

export type ContactState =
  | { errors?: { name?: string[]; email?: string[]; subject?: string[]; message?: string[] }; message?: string; success?: boolean }
  | undefined

export async function sendContactAction(
  _state: ContactState,
  formData: FormData
): Promise<ContactState> {
  const validated = ContactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { name, email, subject, message } = validated.data
  await sendContactEmail({ name, email, subject, message })

  return { success: true }
}
