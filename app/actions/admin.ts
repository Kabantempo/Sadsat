'use server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createUser, getUserByEmail, deleteUser } from '@/lib/db'
import { verifyAdmin } from '@/lib/dal'
import { sendSetPasswordEmail } from '@/lib/email'

const CreateAdminSchema = z.object({
  prenom: z.string().min(2, { message: 'Le prénom doit faire au moins 2 caractères.' }).trim(),
  nom: z.string().min(2, { message: 'Le nom doit faire au moins 2 caractères.' }).trim(),
  email: z.string().email({ message: 'Email invalide.' }).trim(),
})

export type AdminFormState =
  | {
      errors?: { prenom?: string[]; nom?: string[]; email?: string[] }
      message?: string
      success?: boolean
      setupLink?: string
      recipientEmail?: string
    }
  | undefined

async function createAccountAction(
  formData: FormData,
  role: 'admin' | 'créateur'
): Promise<AdminFormState> {
  await verifyAdmin()

  const validated = CreateAdminSchema.safeParse({
    prenom: formData.get('prenom'),
    nom: formData.get('nom'),
    email: formData.get('email'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { prenom, nom, email } = validated.data
  const name = `${prenom} ${nom}`

  if (getUserByEmail(email)) {
    return { message: 'Cet email est déjà utilisé.' }
  }

  const token = crypto.randomUUID() + '-' + crypto.randomUUID()
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const setupLink = `${baseUrl}/set-password?token=${token}`

  createUser({
    id: crypto.randomUUID(),
    email,
    passwordHash: '',
    name,
    role,
    setPasswordToken: token,
    setPasswordTokenExpiry: expiry,
    createdAt: new Date().toISOString(),
  })

  const emailSent = await sendSetPasswordEmail(email, name, token)

  return {
    success: true,
    recipientEmail: email,
    setupLink: emailSent ? undefined : setupLink,
  }
}

export async function createAdminAction(
  state: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  return createAccountAction(formData, 'admin')
}

export async function createCreateurAccountAction(
  state: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  return createAccountAction(formData, 'créateur')
}

export async function deleteUserAction(id: string): Promise<void> {
  const session = await verifyAdmin()

  if (session.userId === id) {
    throw new Error('Vous ne pouvez pas supprimer votre propre compte.')
  }

  deleteUser(id)
  redirect('/admin/comptes')
}
