export default function TaxidermiePage() {
  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">
        <div className="text-center mb-20">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-neutral-500">— 01 —</div>
          <h1 className="font-serif font-light text-6xl md:text-7xl italic mb-6">Taxidermie</h1>
          <p className="text-sm tracking-[0.2em] uppercase opacity-60">
            Pièces uniques · Provenance éthique
          </p>
        </div>

        <div className="max-w-2xl mx-auto text-center mb-24">
          <p className="font-serif text-xl md:text-2xl leading-relaxed font-light italic">
            « Figer le vivant n'est pas le retenir.<br />
            C'est lui offrir un autre temps. »
          </p>
        </div>

        {/* Grille produits placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-neutral-200 mb-4 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-neutral-200 to-neutral-300 group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="text-center">
                <div className="font-serif text-lg italic mb-1">Pièce {i}</div>
                <div className="text-xs tracking-widest uppercase opacity-50">Bientôt disponible</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase opacity-50">
            Toutes nos pièces sont conformes à la réglementation CITES
          </div>
        </div>
      </div>
    </div>
  );
}
