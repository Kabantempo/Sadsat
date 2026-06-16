"use client";
import { useState } from "react";
import { toast } from "sonner";
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
    toast.success(`${item.name} ajouté au panier`, {
      duration: 2500,
      style: { background: '#171717', border: '1px solid #262626', color: '#e5e5e5', fontSize: '0.78rem', letterSpacing: '0.04em' },
    });
    setTimeout(() => setAdded(false), 1800);
  }

  if (disabled) {
    return (
      <div className="w-full py-4 bg-neutral-800 text-neutral-600 text-[0.62rem] tracking-[0.24em] uppercase text-center">
        Pièce vendue
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`w-full py-4 text-[0.62rem] tracking-[0.24em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
        added
          ? "bg-neutral-700 text-neutral-100"
          : "bg-neutral-100 text-neutral-900 hover:bg-white"
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
