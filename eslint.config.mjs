import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'devops-monitor.js', 'vitest.config.ts', 'next-env.d.ts', 'public/**'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Règles passées en avertissement pour ne pas bloquer : à durcir petit à petit.
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      'react/no-unescaped-entities': 'off',
    },
  },
]
