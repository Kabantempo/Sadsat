"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

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

export default function FavoritesProvider({ children, isLoggedIn = false }: { children: React.ReactNode; isLoggedIn?: boolean }) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("sadsat-favorites");
      if (saved) setFavorites(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("sadsat-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const isAdding = !prev.includes(id);
      toast(isAdding ? 'Ajouté aux favoris' : 'Retiré des favoris', {
        duration: 2000,
        style: { background: '#171717', border: '1px solid #262626', color: '#a3a3a3', fontSize: '0.76rem', letterSpacing: '0.06em' },
      });
      return isAdding ? [...prev, id] : prev.filter((f) => f !== id);
    });
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return (
    <Ctx.Provider value={{ favorites, toggle, isFavorite, count: favorites.length, isLoggedIn }}>
      {children}
    </Ctx.Provider>
  );
}
