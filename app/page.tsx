import Link from "next/link";
import { getUsers } from "@/lib/db";
import { getProducts } from "@/lib/products";
import HeroSection from "@/components/shared/HeroSection";
import CreateurCarousel, { type CreateurCard } from "@/components/shared/CreateurCarousel";
import { UNIVERSES, UNIVERSE_LABELS } from "@/lib/definitions";

export default async function Home() {
  const users = await getUsers();
  const products = await getProducts();

  const createurs: CreateurCard[] = users
    .filter((u) => u.role === "créateur")
    .map((u) => {
      const myProducts = products.filter(
        (p) => p.createdBy === u.id && p.status !== "masqué"
      );
      const universes = UNIVERSES.filter((uv) =>
        myProducts.some((p) => p.universe === uv)
      ).map((uv) => UNIVERSE_LABELS[uv]);
      return {
        id: u.id,
        name: u.name,
        bio: u.bio,
        avatar: u.avatar,
        universes,
      };
    });

  return (
    <>
      <HeroSection />

      {/* QUI SOMMES NOUS */}
      <section className="py-32 px-8 max-w-5xl mx-auto text-center">
        <h3 className="font-serif font-light text-4xl md:text-5xl mb-8 text-neutral-100">
          Qui sommes-nous
        </h3>
        <p className="text-neutral-400 leading-relaxed font-light mb-6 max-w-2xl mx-auto">
          SADSAT est né d'un dialogue entre trois langages : la délicatesse du vivant figé,
          la brutalité du métal travaillé, et la chaleur silencieuse de la cire. Chaque pièce
          est faite main, en série limitée, dans un même atelier — par les mêmes mains.
        </p>
        <p className="text-neutral-400 leading-relaxed font-light mb-10">
          Trois mondes, mais une seule signature.
        </p>
        <Link
          href="/a-propos"
          className="inline-block text-xs tracking-[0.3em] uppercase pb-1 border-b border-neutral-600 hover:border-neutral-200 transition"
        >
          Lire l'histoire complète
        </Link>

        {/* Carousel créateurs */}
        <CreateurCarousel createurs={createurs} />
      </section>
    </>
  );
}
