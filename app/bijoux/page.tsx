export default function BijouxPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#0a0a0a] text-neutral-200 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "repeating-linear-gradient(45deg, transparent 0 6px, rgba(139,0,0,0.04) 6px 7px), radial-gradient(circle at 30% 70%, rgba(139,0,0,0.15), transparent 60%)"
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

        <div className="max-w-2xl mx-auto text-center mb-24">
          <p className="font-sans text-lg md:text-xl leading-relaxed uppercase tracking-wider opacity-90">
            Forgé pour ceux qui n'ont pas peur du poids.
          </p>
        </div>

        {/* Grille produits placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="group cursor-pointer border border-neutral-800 p-4 hover:border-[#8b0000] transition-colors">
              <div className="aspect-square bg-gradient-to-br from-neutral-900 to-black mb-4 overflow-hidden border border-neutral-900">
                <div className="w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="text-center">
                <div className="font-sans uppercase text-sm tracking-wider mb-1">Pièce {String(i).padStart(2, "0")}</div>
                <div className="text-[0.65rem] font-mono tracking-widest uppercase opacity-50 text-[#8b0000]">// soon</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 text-center border-t border-neutral-900 pt-12">
          <div className="font-sans text-sm uppercase tracking-[0.2em] mb-4 opacity-80">Commande sur mesure</div>
          <div className="font-mono text-[0.7rem] tracking-widest uppercase opacity-50">
            // contact pour devis personnalisé
          </div>
        </div>
      </div>
    </div>
  );
}
