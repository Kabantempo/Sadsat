"use client";
import Link from "next/link";
import { Eye } from "lucide-react";
import { publishProductAction } from "@/app/actions/createur";

export default function PreviewBanner({ productId }: { productId: string }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-400 text-neutral-900 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Eye size={13} strokeWidth={2} />
        <span className="text-[0.62rem] tracking-[0.18em] uppercase font-semibold">
          Prévisualisation — pièce non publiée
        </span>
      </div>
      <div className="flex items-center gap-4">
        <Link
          href={`/createur/produits/${productId}/modifier`}
          className="text-[0.6rem] tracking-[0.16em] uppercase underline underline-offset-2 hover:no-underline"
        >
          ← Modifier
        </Link>
        <form action={publishProductAction}>
          <input type="hidden" name="productId" value={productId} />
          <button
            type="submit"
            className="text-[0.62rem] tracking-[0.18em] uppercase bg-neutral-900 text-amber-300 px-4 py-1.5 hover:bg-black transition-colors font-medium"
          >
            Publier →
          </button>
        </form>
      </div>
    </div>
  );
}
