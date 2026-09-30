/** @type {import('next').NextConfig} */

// CSP en mode « rapport seulement » : le navigateur signale dans sa console ce qu'il bloquerait, sans rien bloquer.
// Après quelques jours sans alerte, renommer l'en-tête en 'Content-Security-Policy' pour l'appliquer.
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://js.stripe.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://res.cloudinary.com https://picsum.photos https://www.googletagmanager.com https://*.google-analytics.com",
  "media-src 'self' blob: https://res.cloudinary.com",
  "connect-src 'self' https://api.cloudinary.com https://res.cloudinary.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com",
  "frame-src https://js.stripe.com https://checkout.stripe.com",
  "form-action 'self' https://checkout.stripe.com https://appleid.apple.com https://accounts.google.com",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Content-Security-Policy-Report-Only', value: csp },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
];

const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Photos produit (plusieurs images) ; les vidéos passent directement par Cloudinary.
      bodySizeLimit: '25mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  async redirects() {
    // L'univers bijoux (L0vers.cult) a été supprimé.
    return [
      { source: '/bijoux', destination: '/', permanent: true },
      { source: '/bijoux/:path*', destination: '/', permanent: true },
      // Doublon supprimé : une seule politique de confidentialité.
      { source: '/confidentialite', destination: '/politique-confidentialite', permanent: true },
    ];
  },
};

module.exports = nextConfig;
