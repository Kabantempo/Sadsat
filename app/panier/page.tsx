export default function PanierPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-neutral-950 text-neutral-200">
      <div className="max-w-3xl mx-auto px-8 text-center">
        <h1 className="font-serif font-light text-5xl mb-6">Votre panier</h1>
        <p className="opacity-60 mb-12">Votre panier est vide.</p>
        <div className="font-mono text-xs tracking-widest uppercase opacity-40">
          La fonctionnalité d'achat sera disponible prochainement.
        </div>
      </div>
    </div>
  );
}
