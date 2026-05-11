import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-black text-neutral-200">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
