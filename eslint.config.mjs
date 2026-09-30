import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'devops-monitor.js', 'vitest.config.ts', 'next-env.d.ts', 'public/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Règles passées en avertissement pour ne pas bloquer : à durcir petit à petit.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Une variable ou un paramètre préfixé par _ est volontairement inutilisé.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'react/no-unescaped-entities': 'off',
    },
  },
  {
    // Espaces connectés (admin, créateur, grossiste) : miniatures Cloudinary déjà optimisées, pas de gain de LCP à attendre.
    files: ['app/admin/**', 'app/createur/**', 'app/grossiste/**', 'components/admin/**'],
    rules: { '@next/next/no-img-element': 'off' },
  },
]

export default config
