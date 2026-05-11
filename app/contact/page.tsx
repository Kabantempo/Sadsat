export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-24 bg-neutral-950 text-neutral-200">
      <div className="max-w-2xl mx-auto px-8 text-center">
        <h1 className="font-serif font-light text-5xl mb-6">Contact</h1>
        <p className="opacity-70 mb-12 leading-relaxed">
          Pour toute question, commande sur mesure ou demande de collaboration,
          écrivez-nous à l'adresse suivante :
        </p>
        <a href="mailto:contact@sadsat.com" className="font-mono text-lg tracking-wider border-b border-neutral-600 hover:border-neutral-200 transition pb-1">
          contact@sadsat.com
        </a>
      </div>
    </div>
  );
}
