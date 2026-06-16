import Link from "next/link";

const UNIVERS = [
  { label: "Pièces uniques", href: "/pieces-uniques", accent: "#8b0000" },
  { label: "Crystal Pets", href: "/taxidermie", accent: "#c9b896" },
  { label: "L0vers.cult", href: "/bijoux", accent: "#8b0000" },
  { label: "Spectrum N°3", href: "/bougies", accent: "#00ff41", comingSoon: true },
  { label: "Hackcycle", href: "/habillement", accent: "#a0a0a0" },
];

const BOUTIQUE = [
  { label: "Créateurs", href: "/createurs" },
  { label: "Nouveautés", href: "/nouveautes" },
  { label: "Contact", href: "/contact" },
  { label: "À propos", href: "/a-propos" },
  { label: "Mon compte", href: "/compte" },
];

const LEGAL = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "CGV", href: "/cgv" },
  { label: "Confidentialité", href: "/politique-confidentialite" },
];

function InstagramIcon() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer({
  newsletterEnabled = false,
  instagrams = [],
}: {
  newsletterEnabled?: boolean;
  instagrams?: Array<{ name: string; handle: string }>;
}) {
  return (
    <footer className="relative bg-neutral-950 border-t border-white/[0.06] overflow-hidden">

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#8b0000]/8 blur-[120px]" />
        <div className="absolute -top-20 right-1/4 w-80 h-80 rounded-full bg-neutral-700/10 blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 pt-20 pb-10">

        {/* ── Logo centré ── */}
        <div className="text-center mb-16">
          <Link
            href="/"
            className="inline-block font-serif text-5xl md:text-6xl tracking-[0.18em] uppercase bg-gradient-to-r from-neutral-400 via-neutral-100 to-neutral-400 bg-clip-text text-transparent hover:from-amber-200 hover:via-neutral-100 hover:to-amber-200 transition-all duration-500"
          >
            SADSAT
          </Link>
          <p className="mt-3 font-mono text-[0.55rem] tracking-[0.35em] uppercase text-neutral-600">
            Taxidermie · Bijoux · Bougies · Mode
          </p>
        </div>

        {/* ── Séparateur gradient ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.12] to-transparent mb-16" />

        {/* ── Grille principale ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">

          {/* Univers */}
          <div>
            <p className="font-mono text-[0.55rem] tracking-[0.32em] uppercase text-neutral-600 mb-5">
              Univers
            </p>
            <ul className="space-y-3">
              {UNIVERS.map((l) =>
                l.comingSoon ? (
                  <li key={l.href} className="flex items-center gap-2">
                    <span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ background: l.accent }}
                    />
                    <span className="text-[0.62rem] tracking-[0.14em] uppercase text-neutral-700 cursor-default select-none">
                      {l.label}
                    </span>
                  </li>
                ) : (
                  <li key={l.href} className="flex items-center gap-2 group">
                    <span
                      className="w-1 h-1 rounded-full shrink-0 transition-transform group-hover:scale-150"
                      style={{ background: l.accent }}
                    />
                    <Link
                      href={l.href}
                      className="text-[0.62rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
                    >
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <p className="font-mono text-[0.55rem] tracking-[0.32em] uppercase text-neutral-600 mb-5">
              Boutique
            </p>
            <ul className="space-y-3">
              {BOUTIQUE.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[0.62rem] tracking-[0.14em] uppercase text-neutral-500 hover:text-neutral-100 transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Créateurs Instagram */}
          <div className="col-span-2">
            <p className="font-mono text-[0.55rem] tracking-[0.32em] uppercase text-neutral-600 mb-5">
              Nous suivre
            </p>
            {instagrams.length > 0 ? (
              <ul className="space-y-3">
                {instagrams.map(({ name, handle }) => (
                  <li key={handle}>
                    <a
                      href={`https://instagram.com/${handle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 group w-fit"
                    >
                      <span className="text-neutral-600 group-hover:text-neutral-200 transition-colors duration-200 shrink-0">
                        <InstagramIcon />
                      </span>
                      <span className="text-[0.68rem] tracking-[0.1em] text-neutral-400 group-hover:text-neutral-100 transition-colors duration-200">
                        @{handle}
                      </span>
                      <span className="font-mono text-[0.48rem] tracking-[0.18em] uppercase text-neutral-700 group-hover:text-neutral-500 transition-colors duration-200">
                        — {name}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[0.62rem] text-neutral-700">
                Pièces uniques · Fait main · France
              </p>
            )}
          </div>
        </div>

        {/* ── Barre de bas ── */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="font-mono text-[0.5rem] tracking-[0.22em] uppercase text-neutral-700">
            © 2026 SADSAT — France · Fait main
          </p>

          {/* Légal */}
          <div className="flex items-center gap-6">
            {LEGAL.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-mono text-[0.5rem] tracking-[0.18em] uppercase text-neutral-700 hover:text-neutral-400 transition-colors duration-200"
              >
                {l.label}
              </Link>
            ))}
          </div>

        </div>

      </div>
    </footer>
  );
}
