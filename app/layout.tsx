import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import RandomPieceButton from "@/components/shared/RandomPieceButton";
import CartProvider from "@/components/shared/CartProvider";
import CartDrawer from "@/components/shared/CartDrawer";
import { getCurrentUser } from "@/lib/dal";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
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
  const user = await getCurrentUser();

  return (
    <html lang="fr">
      <body
        className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} antialiased bg-black text-neutral-200`}
      >
        <CartProvider>
          <Header user={user ? { name: user.name, role: user.role } : null} />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <RandomPieceButton />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
