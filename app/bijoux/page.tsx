import ProductCarousel, { type CarouselItem } from "@/components/shared/ProductCarousel";

const ITEMS: CarouselItem[] = [1, 2, 3, 4, 5, 6].map((i) => ({
  id: i,
  title: `Pièce ${String(i).padStart(2, "0")}`,
  subtitle: "// bientôt disponible",
}));

export default function BijouxPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#0a0a0a] text-neutral-200 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent 0 6px, rgba(139,0,0,0.04) 6px 7px), radial-gradient(circle at 30% 70%, rgba(139,0,0,0.15), transparent 60%)",
        }}
      />
      <div className="max-w-6xl mx-auto px-8 relative">
        <div className="text-center mb-20">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-[#8b0000]">— 02 —</div>
          <h1
            className="font-sans font-bold uppercase text-6xl md:text-7xl tracking-wider mb-6"
            style={{ textShadow: "3px 0 #8b0000, -3px 0 #1a1a1a" }}
          >
            Bijoux
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase opacity-60">
            Mailles · Métal · Sur mesure
          </p>
        </div>

        <ProductCarousel items={ITEMS} theme="dark" aspectRatio="square" />

        <div className="mt-24 text-center border-t border-neutral-900 pt-12">
          <div className="font-sans text-sm uppercase tracking-[0.2em] mb-4 opacity-80">Commande sur mesure</div>
          <div className="font-mono text-[0.7rem] tracking-widest uppercase opacity-50">
            // contact pour devis personnalisé
          </div>
        </div>
      </div>
    </div>
  );
}
