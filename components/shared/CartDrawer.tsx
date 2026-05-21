"use client";
import { useCart } from "./CartProvider";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

const ease = [0.25, 0.46, 0.45, 0.94] as const;

export default function CartDrawer() {
  const { items, count, total, drawerOpen, closeDrawer, removeItem, setQty } = useCart();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[80] bg-black/50"
            onClick={closeDrawer}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.38, ease }}
            className="fixed top-0 right-0 bottom-0 z-[90] w-full max-w-[420px] bg-white dark:bg-neutral-950 flex flex-col shadow-2xl rounded-l-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <ShoppingBag size={16} strokeWidth={1.5} className="text-neutral-500" />
                <span className="font-mono text-[0.62rem] tracking-[0.22em] uppercase text-neutral-700 dark:text-neutral-300">
                  Panier
                </span>
                {count > 0 && (
                  <span className="text-[0.58rem] bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {count}
                  </span>
                )}
              </div>
              <button
                onClick={closeDrawer}
                className="text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors p-1"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Contenu */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
                <ShoppingBag size={40} strokeWidth={1} className="text-neutral-300 dark:text-neutral-700" />
                <p className="font-mono text-[0.62rem] tracking-[0.2em] uppercase text-neutral-400">
                  Votre panier est vide
                </p>
                <button
                  onClick={closeDrawer}
                  className="text-[0.6rem] tracking-[0.18em] uppercase border-b border-neutral-400 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-900 transition-colors pb-0.5 mt-2"
                >
                  Continuer mes achats →
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      {/* Image */}
                      <Link href={`/produits/${item.id}`} onClick={closeDrawer} className="shrink-0">
                        <div className="w-20 h-24 bg-neutral-100 dark:bg-neutral-900 overflow-hidden relative rounded-lg">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-400 text-xl">✦</div>
                          )}
                        </div>
                      </Link>

                      {/* Infos */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="font-serif italic text-[0.9rem] text-neutral-900 dark:text-neutral-100 leading-tight mb-0.5 truncate">
                            {item.name}
                          </p>
                          <p className="font-mono text-[0.55rem] tracking-[0.16em] uppercase text-neutral-500 mb-2">
                            {item.category}
                          </p>
                          <p className="text-[0.82rem] text-neutral-700 dark:text-neutral-300">
                            {(item.price / 100).toFixed(2)} €
                          </p>
                        </div>

                        {/* Quantité + supprimer */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
                            <button
                              onClick={() => setQty(item.id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                            >
                              <Minus size={12} strokeWidth={2} />
                            </button>
                            <span className="w-8 text-center font-mono text-[0.72rem] text-neutral-800 dark:text-neutral-200">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => setQty(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                            >
                              <Plus size={12} strokeWidth={2} />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-300 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 size={14} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="border-t border-neutral-200 dark:border-neutral-800 px-6 py-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[0.6rem] tracking-[0.2em] uppercase text-neutral-500">Total</span>
                    <span className="font-serif text-xl text-neutral-900 dark:text-neutral-100">
                      {(total / 100).toFixed(2)} €
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="block w-full text-center py-3.5 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[0.62rem] tracking-[0.22em] uppercase font-medium hover:bg-neutral-700 dark:hover:bg-white transition-colors rounded-lg"
                  >
                    Commander
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
