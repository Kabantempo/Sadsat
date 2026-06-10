import { getProducts } from "@/lib/products";
import RandomPieceButtonInner from "./RandomPieceButtonInner";

export default async function RandomPieceButton() {
  try {
    const items = (await getProducts())
      .filter((p) => p.status === "disponible")
      .map((p) => ({ href: `/produits/${p.id}`, label: p.name }));

    if (items.length === 0) return null;

    return <RandomPieceButtonInner items={items} />;
  } catch {
    return null;
  }
}
