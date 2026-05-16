import 'server-only'
import type { User } from './definitions'
import { prisma } from './prisma'

function rowToUser(row: {
  id: string
  email: string
  passwordHash: string
  name: string
  role: string
  bio: string | null
  avatar: string | null
  createdAt: string
  setPasswordToken: string | null
  setPasswordTokenExpiry: string | null
}): User {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.passwordHash,
    name: row.name,
    role: row.role as User['role'],
    bio: row.bio ?? undefined,
    avatar: row.avatar ?? undefined,
    createdAt: row.createdAt,
    setPasswordToken: row.setPasswordToken ?? undefined,
    setPasswordTokenExpiry: row.setPasswordTokenExpiry ?? undefined,
  }
}

export async function getUsers(): Promise<User[]> {
  const rows = await prisma.user.findMany()
  return rows.map(rowToUser)
}

export async function getUserById(id: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { id } })
  return row ? rowToUser(row) : undefined
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const row = await prisma.user.findUnique({ where: { email: email.toLowerCase() } })
  return row ? rowToUser(row) : undefined
}

export async function createUser(user: User): Promise<void> {
  await prisma.user.create({
    data: {
      id: user.id,
      email: user.email.toLowerCase(),
      passwordHash: user.passwordHash,
      name: user.name,
      role: user.role,
      bio: user.bio ?? null,
      avatar: user.avatar ?? null,
      createdAt: user.createdAt,
      setPasswordToken: user.setPasswordToken ?? null,
      setPasswordTokenExpiry: user.setPasswordTokenExpiry ?? null,
    },
  })
}

export async function adminExists(): Promise<boolean> {
  const count = await prisma.user.count({ where: { role: 'admin' } })
  return count > 0
}

export async function updateUserRole(id: string, role: 'admin' | 'client'): Promise<boolean> {
  try {
    await prisma.user.update({ where: { id }, data: { role } })
    return true
  } catch {
    return false
  }
}

export async function updateUser(
  id: string,
  data: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>
): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio ?? null }),
        ...(data.avatar !== undefined && { avatar: data.avatar ?? null }),
      },
    })
    return true
  } catch {
    return false
  }
}

export async function updateUserPassword(id: string, passwordHash: string): Promise<boolean> {
  try {
    await prisma.user.update({ where: { id }, data: { passwordHash } })
    return true
  } catch {
    return false
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  try {
    await prisma.user.delete({ where: { id } })
    return true
  } catch {
    return false
  }
}

export async function clearUsersExcept(keepId: string): Promise<void> {
  await prisma.user.deleteMany({ where: { id: { not: keepId } } })
}

export async function getUserByPasswordToken(token: string): Promise<User | undefined> {
  const row = await prisma.user.findFirst({ where: { setPasswordToken: token } })
  return row ? rowToUser(row) : undefined
}

export async function savePasswordToken(id: string, token: string, expiry: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id },
      data: { setPasswordToken: token, setPasswordTokenExpiry: expiry },
    })
    return true
  } catch {
    return false
  }
}

export async function clearPasswordToken(id: string): Promise<boolean> {
  try {
    await prisma.user.update({
      where: { id },
      data: { setPasswordToken: null, setPasswordTokenExpiry: null },
    })
    return true
  } catch {
    return false
  }
}
