import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center px-8 text-center">
      <div className="max-w-md">
        <p className="font-mono text-[0.6rem] tracking-[0.35em] uppercase text-neutral-700 mb-6">
          SADSAT
        </p>

        <h1 className="font-serif font-light text-[8rem] md:text-[12rem] leading-none italic text-neutral-800 select-none">
          404
        </h1>

        <p className="font-serif font-light text-2xl italic text-neutral-300 mt-2 mb-4">
          Cette page n'existe pas
        </p>

        <p className="font-mono text-[0.62rem] tracking-[0.2em] text-neutral-600 mb-12 leading-relaxed">
          La page que vous cherchez a peut-être été déplacée,<br />
          supprimée, ou n'a jamais existé.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="text-[0.6rem] tracking-[0.25em] uppercase text-neutral-300 border border-neutral-700 hover:border-neutral-400 hover:text-neutral-100 px-8 py-3.5 transition-colors"
          >
            ← Retour à l'accueil
          </Link>
          <Link
            href="/pieces-uniques"
            className="text-[0.6rem] tracking-[0.25em] uppercase text-neutral-600 hover:text-neutral-300 transition-colors"
          >
            Voir nos créations →
          </Link>
        </div>
      </div>
    </div>
  );
}
