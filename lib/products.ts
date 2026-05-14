import 'server-only'
import fs from 'fs'
import path from 'path'
import type { Product } from './definitions'

const DATA_DIR = path.join(process.cwd(), 'data')
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json')

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(PRODUCTS_FILE)) fs.writeFileSync(PRODUCTS_FILE, '[]', 'utf-8')
}

export function getProducts(): Product[] {
  ensureFile()
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8')) as Product[]
}

export function getProductById(id: string): Product | undefined {
  return getProducts().find((p) => p.id === id)
}

export function createProduct(product: Product): void {
  const products = getProducts()
  products.unshift(product)
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
}

export function updateProduct(id: string, data: Partial<Product>): boolean {
  const products = getProducts()
  const idx = products.findIndex((p) => p.id === id)
  if (idx === -1) return false
  products[idx] = { ...products[idx], ...data, updatedAt: new Date().toISOString() }
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
  return true
}

export function deleteProduct(id: string): boolean {
  const products = getProducts()
  const filtered = products.filter((p) => p.id !== id)
  if (filtered.length === products.length) return false
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8')
  return true
}
