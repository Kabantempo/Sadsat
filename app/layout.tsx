import type { Metadata } from "next";
import { Cormorant_Garamond, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import RandomPieceButton from "@/components/shared/RandomPieceButton";
import CartProvider from "@/components/shared/CartProvider";
import CartDrawer from "@/components/shared/CartDrawer";
import FavoritesProvider from "@/components/shared/FavoritesProvider";
import { getSession } from "@/lib/session";
import { isNewsletterEnabled } from "@/lib/settings";
import PageLoader from "@/components/shared/PageLoader";

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
  title: "SADSAT — Taxidermie · Bijoux · Bougies",
  description:
    "Trois univers, une vision. Pièces uniques de taxidermie éthique, bijoux en mailles métalliques et bougies artisanales.",
  openGraph: {
    title: "SADSAT — Taxidermie · Bijoux · Bougies",
    description:
      "Trois univers, une vision. Créations artisanales en édition limitée.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  const user = session ? { name: session.name ?? '', role: session.role } : null;
  const newsletterEnabled = await isNewsletterEnabled().catch(() => false);

  return (
    <html lang="fr" className={`${cormorant.variable} ${spaceGrotesk.variable} ${jetbrains.variable}`}>
      <body
        className="font-sans antialiased bg-black text-neutral-200"
      >
        <PageLoader />
        <FavoritesProvider isLoggedIn={!!user}>
        <CartProvider>
          <Header user={user ? { name: user.name, role: user.role } : null} />
          <main className="min-h-screen">{children}</main>
          <Footer newsletterEnabled={newsletterEnabled} />
          <RandomPieceButton />
          <CartDrawer />
        </CartProvider>
        </FavoritesProvider>
      </body>
    </html>
  );
}
