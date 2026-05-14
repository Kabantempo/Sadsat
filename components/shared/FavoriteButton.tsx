"use client";
import { Heart } from "lucide-react";
import { useFavorites } from "./FavoritesProvider";

type Props = {
  productId: string;
  className?: string;
  size?: number;
};

export default function FavoriteButton({ productId, className = "", size = 16 }: Props) {
  const { toggle, isFavorite } = useFavorites();
  const active = isFavorite(productId);

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      className={`transition-all duration-200 ${
        active
          ? "text-red-500 scale-110"
          : "text-neutral-400 hover:text-red-400 hover:scale-110"
      } ${className}`}
    >
      <Heart
        size={size}
        strokeWidth={1.5}
        className={active ? "fill-red-500" : "fill-transparent"}
      />
    </button>
  );
}
