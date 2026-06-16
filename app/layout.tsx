import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import RandomPieceButton from "@/components/shared/RandomPieceButton";
import NewArrivalsButton from "@/components/shared/NewArrivalsButton";
import CartProvider from "@/components/shared/CartProvider";
import CartDrawer from "@/components/shared/CartDrawer";
import FavoritesProvider from "@/components/shared/FavoritesProvider";
import PageLoader from "@/components/shared/PageLoader";
import JsonLd from "@/components/shared/JsonLd";
import { getSession } from "@/lib/session";
import { isNewsletterEnabled } from "@/lib/settings";
import { getBrandCategories } from "@/lib/brand";
import { getUsers } from "@/lib/db";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sadsat.com'

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SADSAT — Taxidermie · Bijoux · Bougies · Mode",
    template: "%s | SADSAT",
  },
  description:
    "Trois univers, une vision. Pièces uniques de taxidermie éthique, bijoux en maille métallique, bougies artisanales et mode upcycling. Créations en édition limitée, faites main en France.",
  keywords: [
    "taxidermie éthique",
    "bijoux artisanaux",
    "bougies artisanales",
    "pièces uniques",
    "Crystal Pets",
    "L0vers.cult",
    "Spectrum N°3",
    "Hackcycle",
    "SADSAT",
    "création française",
    "édition limitée",
    "maille métallique",
    "upcycling",
    "artisanat",
  ],
  authors: [{ name: "SADSAT", url: BASE_URL }],
  creator: "SADSAT",
  publisher: "SADSAT",
  category: "e-commerce",
  openGraph: {
    title: "SADSAT — Taxidermie · Bijoux · Bougies · Mode",
    description:
      "Pièces uniques de taxidermie éthique, bijoux en maille métallique, bougies artisanales et mode upcycling. Édition limitée, fait main.",
    type: "website",
    url: BASE_URL,
    siteName: "SADSAT",
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SADSAT — Créations artisanales en édition limitée",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SADSAT — Taxidermie · Bijoux · Bougies · Mode",
    description:
      "Pièces uniques de taxidermie éthique, bijoux en maille métallique, bougies artisanales et mode upcycling. Édition limitée, fait main.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "SADSAT",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/og-image.jpg`,
  },
  description:
    "Créations artisanales en édition limitée : taxidermie éthique, bijoux en maille métallique, bougies artisanales et mode upcycling.",
  sameAs: [],
  brand: [
    { "@type": "Brand", name: "Crystal Pets" },
    { "@type": "Brand", name: "L0vers.cult" },
    { "@type": "Brand", name: "Spectrum N°3" },
    { "@type": "Brand", name: "Hackcycle" },
  ],
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "SADSAT",
  description: "Créations artisanales en édition limitée",
  publisher: { "@id": `${BASE_URL}/#organization` },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/recherche?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
  inLanguage: "fr-FR",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [session, taxCats, bijouxCats, bougiesCats, habCats, newsletterEnabled] = await Promise.all([
    getSession().catch(() => null),
    getBrandCategories('taxidermie'),
    getBrandCategories('bijoux'),
    getBrandCategories('bougies'),
    getBrandCategories('habillement'),
    isNewsletterEnabled(),
  ]);

  const user = session ? { name: session.name ?? '', role: session.role } : null;
  const footerInstagrams: any[] = [];
  const navCategories = {
    taxidermie:  taxCats.map(c => ({ label: c.label, slug: c.slug })),
    bijoux:      bijouxCats.map(c => ({ label: c.label, slug: c.slug })),
    bougies:     bougiesCats.map(c => ({ label: c.label, slug: c.slug })),
    habillement: habCats.map(c => ({ label: c.label, slug: c.slug })),
  };

  return (
    <html lang="fr" className={`${cormorant.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body className="font-sans antialiased bg-black text-neutral-200">
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        <Toaster
          position="bottom-right"
          theme="dark"
          toastOptions={{ style: { fontFamily: 'var(--font-jetbrains, monospace)' } }}
        />
        <PageLoader />
        <FavoritesProvider isLoggedIn={!!session}>
          <CartProvider>
            <Header user={user} navCategories={navCategories} />
            <main className="min-h-screen">{children}</main>
            <Footer newsletterEnabled={newsletterEnabled} instagrams={footerInstagrams} />
            <RandomPieceButton />
            <NewArrivalsButton />
            <CartDrawer />
          </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
