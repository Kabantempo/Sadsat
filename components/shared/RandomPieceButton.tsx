import { getProducts } from "@/lib/products";
import RandomPieceButtonInner from "./RandomPieceButtonInner";

export default function RandomPieceButton() {
  const items = getProducts()
    .filter((p) => p.status === "disponible")
    .map((p) => ({ href: `/produits/${p.id}`, label: p.name }));

  if (items.length === 0) return null;

  return <RandomPieceButtonInner items={items} />;
}
