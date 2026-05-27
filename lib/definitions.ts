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
  name?: string
  email?: string
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
  instagram?: string
  pseudo?: string
  universe?: string
}

export type SafeUser = Omit<User, 'passwordHash'>

// ── Produits ────────────────────────────────────────────────

// ── Pour ajouter un nouvel univers/marque : ──────────────────────────────────
// 1. Ajoute le slug dans UNIVERSES ci-dessous
// 2. Ajoute le label dans UNIVERSE_LABELS
// 3. Ajoute les catégories dans CATEGORIES
// 4. Crée app/[slug]/page.tsx  →  tout le reste (admin, filtres) se met à jour seul

export const UNIVERSES = [
  'taxidermie',
  'bijoux',
  'bougies',
  'pieces-uniques',
  'habillement',
] as const
export type Universe = (typeof UNIVERSES)[number]

export const UNIVERSE_LABELS: Record<Universe, string> = {
  taxidermie: 'Crystal Pets',
  bijoux: 'L0vers.cult',
  bougies: 'Spectrum N°3',
  'pieces-uniques': 'Pièces uniques',
  habillement: 'Hackcycle',
}

export const CATEGORIES: Record<Universe, string[]> = {
  taxidermie: ['Oiseaux', 'Mammifères', 'Insectes', 'Crânes', 'Reptiles'],
  bijoux: ['Bagues', 'Colliers', 'Bracelets', "Boucles d'oreilles"],
  bougies: ['Cire de soja', "Cire d'abeille", 'Piliers', 'Fondants'],
  'pieces-uniques': ['Sculptures', 'Céramiques', 'Tableaux', 'Textiles', 'Mixed media', 'Autre'],
  habillement: ['Hauts', 'Bas', 'Robes', 'Vestes', 'Accessoires', 'Autre'],
}

// ── Portails marques — accueil ───────────────────────────────────────────────
// Pour ajouter une nouvelle marque sur la homepage :
// 1. Ajoute un objet dans BRAND_PORTALS ci-dessous (copie-colle un existant)
// 2. Ajoute le slug dans UNIVERSES + UNIVERSE_LABELS + CATEGORIES (plus haut)
// 3. Crée app/[slug]/page.tsx
// → le panneau apparaît automatiquement sur la page d'accueil

export type BrandPortal = {
  slug: string
  label: string
  subtitle: string
  cta: string
  index: string
  bg: string
  color: string
  accent: string
  font: 'serif' | 'sans' | 'mono'
  special?: 'matrix' | 'comingSoon'
}

export const BRAND_PORTALS: BrandPortal[] = [
  {
    slug: 'taxidermie',
    label: 'Crystal Pets',
    subtitle: 'Pièces uniques · Éthique',
    cta: 'Entrer dans la galerie',
    index: '01',
    bg: 'linear-gradient(180deg, #fafaf7 0%, #ebebe6 100%)',
    color: '#1a1a1a',
    accent: '#c9b896',
    font: 'serif',
  },
  {
    slug: 'bijoux',
    label: 'L0vers.cult',
    subtitle: 'Mailles · Métal · Contre-culture',
    cta: 'Pénétrer la collection',
    index: '02',
    bg: '#0a0a0a',
    color: '#e8e8e8',
    accent: '#8b0000',
    font: 'sans',
  },
  {
    slug: 'bougies',
    label: 'Spectrum N°3',
    subtitle: '> system.boot',
    cta: '',
    index: '03',
    bg: '#000000',
    color: '#00ff41',
    accent: '#008f11',
    font: 'mono',
    special: 'matrix',
  },
  {
    slug: 'habillement',
    label: 'HACKCYCLE',
    subtitle: 'Upcycling · Textile · Liberté',
    cta: 'Explorer la collection',
    index: '04',
    bg: 'linear-gradient(135deg, #1c1a16 0%, #0f0d0a 100%)',
    color: '#d4cfc5',
    accent: '#b8a882',
    font: 'serif',
  },
]

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
