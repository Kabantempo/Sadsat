'use server'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { SignupFormSchema, LoginFormSchema, type FormState } from '@/lib/definitions'
import { createUser, getUserByEmail, getUserById, adminExists, updateUserPassword, getUserByPasswordToken, clearPasswordToken } from '@/lib/db'
import { verifySession } from '@/lib/dal'
import { createSession, deleteSession } from '@/lib/session'

export async function signup(state: FormState, formData: FormData): Promise<FormState> {
  const validated = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { name, email, password } = validated.data
  const existing = getUserByEmail(email)
  if (existing) {
    return { message: 'Cet email est déjà utilisé.' }
  }

  const passwordHash = await bcrypt.hash(password, 12)
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    name,
    role: 'client' as const,
    createdAt: new Date().toISOString(),
  }
  createUser(user)
  await createSession(user.id, 'client')
  redirect('/compte')
}

export async function login(state: FormState, formData: FormData): Promise<FormState> {
  const validated = LoginFormSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { email, password } = validated.data
  const user = getUserByEmail(email)
  if (!user || !user.passwordHash) {
    return { message: 'Email ou mot de passe incorrect.' }
  }

  const match = await bcrypt.compare(password, user.passwordHash)
  if (!match) {
    return { message: 'Email ou mot de passe incorrect.' }
  }

  await createSession(user.id, user.role)
  const dest = user.role === 'admin' ? '/admin' : user.role === 'créateur' ? '/createur' : '/compte'
  redirect(dest)
}

export async function logout(): Promise<void> {
  await deleteSession()
  redirect('/')
}

export type ChangePasswordState = { message?: string; success?: boolean } | undefined

export async function changePasswordAction(
  _state: ChangePasswordState,
  formData: FormData
): Promise<ChangePasswordState> {
  const session = await verifySession()
  const user = getUserById(session.userId)
  if (!user) return { message: 'Utilisateur introuvable.' }

  const current = String(formData.get('currentPassword') ?? '')
  const next = String(formData.get('newPassword') ?? '')
  const confirm = String(formData.get('confirmPassword') ?? '')

  const match = await bcrypt.compare(current, user.passwordHash)
  if (!match) return { message: 'Mot de passe actuel incorrect.' }

  if (next.length < 8) return { message: 'Le nouveau mot de passe doit faire au moins 8 caractères.' }
  if (next !== confirm) return { message: 'Les mots de passe ne correspondent pas.' }

  const passwordHash = await bcrypt.hash(next, 12)
  updateUserPassword(user.id, passwordHash)

  return { success: true, message: 'Mot de passe mis à jour.' }
}

export type SetPasswordState = { message?: string; success?: boolean } | undefined

export async function setPasswordAction(
  _state: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const token = String(formData.get('token') ?? '')
  const password = String(formData.get('password') ?? '')
  const confirm = String(formData.get('confirmPassword') ?? '')

  const user = getUserByPasswordToken(token)
  if (!user || !user.setPasswordTokenExpiry || new Date(user.setPasswordTokenExpiry) < new Date()) {
    return { message: 'Lien invalide ou expiré.' }
  }

  if (password.length < 8) return { message: 'Au moins 8 caractères requis.' }
  if (!/[a-zA-Z]/.test(password)) return { message: 'Au moins une lettre requise.' }
  if (!/[0-9]/.test(password)) return { message: 'Au moins un chiffre requis.' }
  if (password !== confirm) return { message: 'Les mots de passe ne correspondent pas.' }

  const passwordHash = await bcrypt.hash(password, 12)
  updateUserPassword(user.id, passwordHash)
  clearPasswordToken(user.id)

  await createSession(user.id, user.role)
  redirect(user.role === 'admin' ? '/admin' : '/createur')
}

export async function setupAdmin(state: FormState, formData: FormData): Promise<FormState> {
  if (adminExists()) {
    return { message: 'Un administrateur existe déjà.' }
  }

  const validated = SignupFormSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors }
  }

  const { name, email, password } = validated.data
  const passwordHash = await bcrypt.hash(password, 12)
  const user = {
    id: crypto.randomUUID(),
    email,
    passwordHash,
    name,
    role: 'admin' as const,
    createdAt: new Date().toISOString(),
  }
  createUser(user)
  await createSession(user.id, 'admin')
  redirect('/admin')
}
