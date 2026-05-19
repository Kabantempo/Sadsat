"use client";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFavorites } from "./FavoritesProvider";

type Props = {
  productId: string;
  className?: string;
  size?: number;
};

export default function FavoriteButton({ productId, className = "", size = 16 }: Props) {
  const { toggle, isFavorite, isLoggedIn } = useFavorites();
  const router = useRouter();
  const active = isFavorite(productId);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoggedIn) {
      router.push("/connexion");
      return;
    }
    toggle(productId);
  }

  return (
    <button
      onClick={handleClick}
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
