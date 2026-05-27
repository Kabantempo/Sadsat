'use server'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail, deleteUser, clearUsersExcept, updateUserUniverse, updateUser } from '@/lib/db'
import { prisma } from '@/lib/prisma'
import { clearAllProducts } from '@/lib/products'
import { verifyAdmin } from '@/lib/dal'
import { sendSetPasswordEmail } from '@/lib/email'

const CreateAdminSchema = z.object({
  prenom: z.string().min(2, { message: 'Le prénom doit faire au moins 2 caractères.' }).trim(),
  nom: z.string().min(2, { message: 'Le nom doit faire au moins 2 caractères.' }).trim(),
  email: z.string().email({ message: 'Email invalide.' }).trim(),
})

export type AdminFormState =
  | {
      errors?: { prenom?: string[]; nom?: string[]; email?: string[]; password?: string[] }
      message?: string
      success?: boolean
      setupLink?: string
      recipientEmail?: string
    }
  | undefined

async function createAccountAction(
  formData: FormData,
  role: 'admin' | 'créateur' | 'grossiste'
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

  if (await getUserByEmail(email)) {
    return { message: 'Cet email est déjà utilisé.' }
  }

  const rawPassword = String(formData.get('password') ?? '').trim()

  if (rawPassword) {
    if (rawPassword.length < 8) return { errors: { password: ['Au moins 8 caractères.'] } }
    if (!/[a-zA-Z]/.test(rawPassword)) return { errors: { password: ['Au moins une lettre.'] } }
    if (!/[0-9]/.test(rawPassword)) return { errors: { password: ['Au moins un chiffre.'] } }

    const passwordHash = await bcrypt.hash(rawPassword, 12)
    await createUser({
      id: crypto.randomUUID(),
      email,
      passwordHash,
      name,
      role,
      createdAt: new Date().toISOString(),
    })
    return { success: true, recipientEmail: email }
  }

  const token = crypto.randomUUID() + '-' + crypto.randomUUID()
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const setupLink = `${baseUrl}/set-password?token=${token}`

  await createUser({
    id: crypto.randomUUID(),
    email,
    passwordHash: '',
    name,
    role,
    setPasswordToken: token,
    setPasswordTokenExpiry: expiry,
    createdAt: new Date().toISOString(),
  })

  const emailSent = await sendSetPasswordEmail(email, name, token, role)

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

export async function createGrossisteAccountAction(
  state: AdminFormState,
  formData: FormData
): Promise<AdminFormState> {
  return createAccountAction(formData, 'grossiste')
}

export async function deleteUserAction(formData: FormData): Promise<void> {
  const session = await verifyAdmin()
  const id = String(formData.get('userId') ?? '')

  if (session.userId === id) {
    throw new Error('Vous ne pouvez pas supprimer votre propre compte.')
  }

  await deleteUser(id)
  redirect('/admin/comptes')
}

export async function updateUserInfoAction(formData: FormData): Promise<void> {
  await verifyAdmin()
  const id = String(formData.get('userId') ?? '')
  const name = String(formData.get('name') ?? '').trim()
  const role = String(formData.get('role') ?? '') as 'admin' | 'client' | 'créateur' | 'grossiste'

  if (!id || !name) return

  await updateUser(id, { name })
  await prisma.user.update({ where: { id }, data: { role } })
  redirect('/admin/comptes')
}

export async function setUserUniverseAction(formData: FormData): Promise<void> {
  await verifyAdmin()
  const userId = String(formData.get('userId') ?? '')
  const universe = String(formData.get('universe') ?? '') || null
  await updateUserUniverse(userId, universe)
  redirect('/admin/comptes')
}

export async function clearUsersAction(): Promise<void> {
  const session = await verifyAdmin()
  await clearUsersExcept(session.userId)
  redirect('/admin/comptes')
}

export async function clearProductsAction(): Promise<void> {
  await verifyAdmin()
  await clearAllProducts()
  redirect('/admin/comptes')
}

export async function clearAllDataAction(): Promise<void> {
  const session = await verifyAdmin()
  await clearUsersExcept(session.userId)
  await clearAllProducts()
  redirect('/admin/comptes')
}
