"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

type FavoritesContext = {
  favorites: string[];
  toggle: (id: string) => void;
  isFavorite: (id: string) => boolean;
  count: number;
};

const Ctx = createContext<FavoritesContext | null>(null);

export function useFavorites() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}

export default function FavoritesProvider({ children }: { children: React.ReactNode }) {
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
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  }, []);

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return (
    <Ctx.Provider value={{ favorites, toggle, isFavorite, count: favorites.length }}>
      {children}
    </Ctx.Provider>
  );
}
