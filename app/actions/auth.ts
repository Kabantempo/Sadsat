'use server'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { SignupFormSchema, LoginFormSchema, type FormState } from '@/lib/definitions'
import { createUser, getUserByEmail, adminExists } from '@/lib/db'
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
  if (!user) {
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
