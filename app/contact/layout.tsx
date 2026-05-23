import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — SADSAT",
  description:
    "Contactez SADSAT pour toute question, commande sur mesure, collaboration créateur ou information produit. Nous vous répondons personnellement.",
  openGraph: {
    title: "Contact — SADSAT",
    description:
      "Contactez SADSAT pour toute question, commande sur mesure ou collaboration. Nous vous répondons personnellement.",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
