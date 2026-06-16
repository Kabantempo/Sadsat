"use client";
import { createContext, useContext, useEffect, useState, useCallback, useTransition } from "react";
import { toast } from "sonner";
import { getFavoritesAction, toggleFavoriteAction } from "@/app/actions/favorites";

type FavoritesContext = {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  count: number;
  isLoggedIn: boolean;
};

const Ctx = createContext<FavoritesContext | null>(null);

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}

export default function FavoritesProvider({
  children,
  isLoggedIn = false,
}: {
  children: React.ReactNode;
  isLoggedIn?: boolean;
}) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [, startTransition] = useTransition();

  // Chargement initial
  useEffect(() => {
    if (isLoggedIn) {
      // Utilisateur connecté → charger depuis la DB
      getFavoritesAction().then(ids => {
        setFavorites(ids);
        // Synchronise aussi le localStorage local
        try { localStorage.setItem("sadsat-favorites", JSON.stringify(ids)); } catch {}
      }).catch(() => {
        // Fallback localStorage si erreur réseau
        try {
          const saved = localStorage.getItem("sadsat-favorites");
          if (saved) setFavorites(JSON.parse(saved));
        } catch {}
      });
    } else {
      // Non connecté → localStorage uniquement
      try {
        const saved = localStorage.getItem("sadsat-favorites");
        if (saved) setFavorites(JSON.parse(saved));
      } catch {}
    }
  }, [isLoggedIn]);

  const toggle = useCallback((id: string) => {
    const isAdding = !favorites.includes(id);

    // Mise à jour optimiste immédiate
    const next = isAdding ? [...favorites, id] : favorites.filter(f => f !== id);
    setFavorites(next);
    try { localStorage.setItem("sadsat-favorites", JSON.stringify(next)); } catch {}

    toast(isAdding ? "Ajouté aux favoris" : "Retiré des favoris", {
      duration: 2000,
      style: {
        background: "#171717",
        border: "1px solid #262626",
        color: "#a3a3a3",
        fontSize: "0.76rem",
        letterSpacing: "0.06em",
      },
    });

    if (isLoggedIn) {
      // Sync DB en arrière-plan
      startTransition(() => {
        toggleFavoriteAction(id).then(serverIds => {
          setFavorites(serverIds);
          try { localStorage.setItem("sadsat-favorites", JSON.stringify(serverIds)); } catch {}
        }).catch(() => {
          // Annuler l'optimistic update en cas d'erreur
          setFavorites(favorites);
        });
      });
    }
  }, [favorites, isLoggedIn]);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return (
    <Ctx.Provider value={{ favorites, toggle, isFavorite, count: favorites.length, isLoggedIn }}>
      {children}
    </Ctx.Provider>
  );
}
