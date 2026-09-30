import coreWebVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'scripts/**', 'devops-monitor.js', 'vitest.config.ts', 'next-env.d.ts', 'public/**'] },
  ...coreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Règles passées en avertissement pour ne pas bloquer : à durcir petit à petit.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Une variable ou un paramètre préfixé par _ est volontairement inutilisé.
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrors: 'none' }],
      'react/no-unescaped-entities': 'off',
      // Règles « React Compiler » de Next 16 : signalent du code à revoir (état mis à jour dans un effet, mutations…), sans bug avéré.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  {
    // Espaces connectés (admin, créateur, grossiste) : miniatures Cloudinary déjà optimisées, pas de gain de LCP à attendre.
    files: ['app/admin/**', 'app/createur/**', 'app/grossiste/**', 'components/admin/**'],
    rules: { '@next/next/no-img-element': 'off' },
  },
]

export default config
