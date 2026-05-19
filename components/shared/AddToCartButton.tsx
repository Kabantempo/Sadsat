"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { ShoppingBag, Check } from "lucide-react";
import type { CartItem } from "./CartProvider";

type Props = Omit<CartItem, "quantity"> & { disabled?: boolean };

export default function AddToCartButton({ disabled, ...item }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleClick() {
    addItem(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (disabled) {
    return (
      <div className="w-full py-4 bg-neutral-200 text-neutral-500 text-[0.62rem] tracking-[0.24em] uppercase text-center rounded-lg">
        Pièce vendue
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 text-[0.62rem] tracking-[0.24em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 rounded-lg ${
        added
          ? "bg-neutral-700 text-neutral-100"
          : "bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-white"
      }`}
    >
      {added ? (
        <>
          <Check size={14} strokeWidth={2} />
          Ajouté au panier
        </>
      ) : (
        <>
          <ShoppingBag size={14} strokeWidth={1.5} />
          Ajouter au panier
        </>
      )}
    </button>
  );
}
