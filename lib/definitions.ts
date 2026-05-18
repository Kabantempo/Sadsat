import { z } from 'zod'

export const SignupFormSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit faire au moins 2 caractères.' }).trim(),
  email: z.string().email({ message: 'Veuillez entrer un email valide.' }).trim(),
  password: z
    .string()
    .min(8, { message: 'Au moins 8 caractères.' })
    .regex(/[a-zA-Z]/, { message: 'Au moins une lettre.' })
    .regex(/[0-9]/, { message: 'Au moins un chiffre.' })
    .trim(),
})

export const LoginFormSchema = z.object({
  email: z.string().email({ message: 'Email invalide.' }).trim(),
  password: z.string().min(1, { message: 'Mot de passe requis.' }),
})

export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export type SessionPayload = {
  userId: string
  role: 'admin' | 'client' | 'créateur' | 'grossiste'
  expiresAt: Date
}

export type User = {
  id: string
  email: string
  passwordHash: string
  name: string
  role: 'admin' | 'client' | 'créateur' | 'grossiste'
  bio?: string
  avatar?: string
  createdAt: string
  setPasswordToken?: string
  setPasswordTokenExpiry?: string
  emailVerified?: boolean
  verificationToken?: string
  verificationTokenExpiry?: string
}

export type SafeUser = Omit<User, 'passwordHash'>

// ── Produits ────────────────────────────────────────────────

export const UNIVERSES = ['taxidermie', 'bijoux', 'bougies', 'pieces-uniques'] as const
export type Universe = (typeof UNIVERSES)[number]

export const UNIVERSE_LABELS: Record<Universe, string> = {
  taxidermie: 'Taxidermie',
  bijoux: 'Bijoux',
  bougies: 'Bougies',
  'pieces-uniques': 'Pièces uniques',
}

export const CATEGORIES: Record<Universe, string[]> = {
  taxidermie: ['Oiseaux', 'Mammifères', 'Insectes', 'Crânes', 'Reptiles'],
  bijoux: ['Bagues', 'Colliers', 'Bracelets', "Boucles d'oreilles"],
  bougies: ['Cire de soja', "Cire d'abeille", 'Piliers', 'Fondants'],
  'pieces-uniques': ['Sculptures', 'Céramiques', 'Tableaux', 'Textiles', 'Mixed media', 'Autre'],
}

export const STATUS_LABELS = {
  disponible: 'Disponible',
  vendu: 'Vendu',
  masqué: 'Masqué',
} as const

export type ProductStatus = keyof typeof STATUS_LABELS

export type Dimensions = {
  hauteur?: number
  largeur?: number
  profondeur?: number
  diametre?: number
  longueur?: number
  poids?: number
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
  universe: Universe
  category: string
  images: string[]
  stock: number
  status: ProductStatus
  serialNumber?: string
  dimensions?: Dimensions
  materials?: string
  video?: string
  createdBy?: string
  createdAt: string
  updatedAt: string
}

export type ProductFormState =
  | {
      errors?: {
        name?: string[]
        description?: string[]
        price?: string[]
        universe?: string[]
        category?: string[]
        stock?: string[]
      }
      message?: string
    }
  | undefined
