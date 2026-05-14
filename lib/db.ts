import 'server-only'
import fs from 'fs'
import path from 'path'
import type { User } from './definitions'

const DATA_DIR = process.env.VERCEL
  ? '/tmp/sadsat-data'
  : path.join(process.cwd(), 'data')
const USERS_FILE = path.join(DATA_DIR, 'users.json')

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf-8')
  }
}

export function getUsers(): User[] {
  ensureDataDir()
  const content = fs.readFileSync(USERS_FILE, 'utf-8')
  return JSON.parse(content) as User[]
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id)
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
}

export function createUser(user: User): void {
  const users = getUsers()
  users.push(user)
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
}

export function adminExists(): boolean {
  return getUsers().some((u) => u.role === 'admin')
}

export function updateUserRole(id: string, role: 'admin' | 'client'): boolean {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  users[idx].role = role
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  return true
}

export function updateUser(id: string, data: Partial<Pick<User, 'name' | 'bio' | 'avatar'>>): boolean {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  users[idx] = { ...users[idx], ...data }
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  return true
}

export function updateUserPassword(id: string, passwordHash: string): boolean {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  users[idx].passwordHash = passwordHash
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  return true
}

export function deleteUser(id: string): boolean {
  const users = getUsers()
  const filtered = users.filter((u) => u.id !== id)
  if (filtered.length === users.length) return false
  fs.writeFileSync(USERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
  return true
}

export function getUserByPasswordToken(token: string): import('./definitions').User | undefined {
  return getUsers().find((u) => u.setPasswordToken === token)
}

export function savePasswordToken(id: string, token: string, expiry: string): boolean {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  users[idx].setPasswordToken = token
  users[idx].setPasswordTokenExpiry = expiry
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  return true
}

export function clearPasswordToken(id: string): boolean {
  const users = getUsers()
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return false
  delete users[idx].setPasswordToken
  delete users[idx].setPasswordTokenExpiry
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8')
  return true
}
