export default function AProposPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-neutral-950 text-neutral-200">
      <div className="max-w-3xl mx-auto px-8">
        <div className="text-center mb-16">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 opacity-50">— L'ATELIER —</div>
          <h1 className="font-serif font-light text-5xl md:text-6xl mb-6">Qui sommes-nous</h1>
        </div>

        <div className="space-y-8 font-light text-neutral-300 leading-relaxed">
          <p className="text-lg">
            SADSAT est un atelier né de l'idée qu'une même main peut parler trois langues.
            Trois pratiques, trois matières, trois rythmes — et pourtant, une seule signature.
          </p>

          <div className="border-l border-neutral-700 pl-6 py-2">
            <h3 className="font-serif text-2xl italic mb-3 text-neutral-100">Taxidermie</h3>
            <p>
              Chaque pièce est issue de découvertes naturelles ou de filières éthiques contrôlées.
              Nous ne tuons pas pour l'art ; nous prolongeons. Le respect du vivant n'est pas
              négociable, et la conformité CITES est intégrale.
            </p>
          </div>

          <div className="border-l border-[#8b0000] pl-6 py-2">
            <h3 className="font-sans uppercase font-bold text-2xl tracking-wider mb-3 text-neutral-100">Bijoux</h3>
            <p>
              Mailles tissées au fil, métaux travaillés à la main, oxydations choisies. Chaque
              bracelet, chaque collier porte la trace d'une force et d'une fragilité — celle de
              ceux qui les portent.
            </p>
          </div>

          <div className="border-l border-[#00ff41] pl-6 py-2">
            <h3 className="font-mono text-2xl mb-3 text-neutral-100">{"> Bougies"}</h3>
            <p>
              Cires végétales, parfums sourcés en France, mèches en coton naturel. Une approche
              presque algorithmique de la lumière : précise, répétable, mais toujours vivante.
            </p>
          </div>

          <p className="pt-8 text-center font-serif italic text-xl text-neutral-100">
            Trois mondes, une seule matière première : l'attention.
          </p>
        </div>
      </div>
    </div>
  );
}
