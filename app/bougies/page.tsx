export const revalidate = 30;

import { getProducts } from "@/lib/products";
import BougiesContent from "@/components/pages/BougiesContent";
import type { CarouselItem } from "@/components/shared/ProductCarousel";

export default async function BougiesPage() {
  const products = (await getProducts()).filter(
    (p) => p.universe === "bougies" && p.status !== "masqué"
  );
  const carouselItems: CarouselItem[] =
    products.length > 0
      ? products.map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: p.category,
          price: `${(p.price / 100).toFixed(2)} €`,
          image: p.images[0],
          href: `/produits/${p.id}`,
        }))
      : [1, 2, 3, 4, 5, 6].map((i) => ({
          id: i,
          title: `> bougie_${String(i).padStart(2, "0")}`,
          subtitle: "// bientôt disponible",
        }));

  return <BougiesContent carouselItems={carouselItems} />;
}
