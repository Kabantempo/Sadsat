'use server'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { createUser, getUserByEmail, deleteUser, getUsers } from '@/lib/db'
import { verifyAdmin } from '@/lib/dal'

const CreateAdminSchema = z.object({
  prenom: z.string().min(2, { message: 'Le prénom doit faire au moins 2 caractères.' }).trim(),
  nom: z.string().min(2, { message: 'Le nom doit faire au moins 2 caractères.' }).trim(),
  email: z.string().email({ message: 'Email invalide.' }).trim(),
  password: z.string().min(6, { message: 'Au moins 6 caractères.' }),
})

export type AdminFormState =
  | { errors?: { prenom?: string[]; nom?: string[]; email?: string[]; password?: string[] }; message?: string }
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
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { prenom, nom, email, password } = validated.data
  const name = `${prenom} ${nom}`

  if (getUserByEmail(email)) {
    return { message: 'Cet email est déjà utilisé.' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  createUser({
    id: crypto.randomUUID(),
    email,
    passwordHash,
    name,
    role,
    createdAt: new Date().toISOString(),
  })

  redirect(`/admin/comptes?ok=${role}`)
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
