import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    slug: "oiseaux",
    label: "Oiseaux",
    latin: "Aves",
    description: "Passereaux, rapaces, exotiques",
    // Remplace ces chemins par tes vraies photos dans /public/images/taxidermie/
    primaryImage: "/images/taxidermie/oiseaux-1.jpg",
    hoverImage:   "/images/taxidermie/oiseaux-2.jpg",
  },
  {
    slug: "mammiferes",
    label: "Mammifères",
    latin: "Mammalia",
    description: "Petits et grands mammifères",
    primaryImage: "/images/taxidermie/mammiferes-1.jpg",
    hoverImage:   "/images/taxidermie/mammiferes-2.jpg",
  },
  {
    slug: "insectes",
    label: "Insectes",
    latin: "Insecta",
    description: "Entomologie & sous verre",
    primaryImage: "/images/taxidermie/insectes-1.jpg",
    hoverImage:   "/images/taxidermie/insectes-2.jpg",
  },
  {
    slug: "cranes",
    label: "Crânes",
    latin: "Crania",
    description: "Crânes préparés & blanchis",
    primaryImage: "/images/taxidermie/cranes-1.jpg",
    hoverImage:   "/images/taxidermie/cranes-2.jpg",
  },
  {
    slug: "reptiles",
    label: "Reptiles",
    latin: "Reptilia",
    description: "Serpents, lézards, tortues",
    primaryImage: "/images/taxidermie/reptiles-1.jpg",
    hoverImage:   "/images/taxidermie/reptiles-2.jpg",
  },
];

export default function TaxidermiePage() {
  return (
    <div style={{ background: "#fafaf7", color: "#1a1a1a" }} className="min-h-screen pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-8">

        {/* En-tête */}
        <div className="text-center mb-20">
          <div className="font-mono text-[0.7rem] tracking-[0.3em] mb-6 text-neutral-500">— 01 —</div>
          <h1 className="font-serif font-light text-6xl md:text-7xl italic mb-6">Taxidermie</h1>
          <p className="text-sm tracking-[0.2em] uppercase opacity-60">
            Pièces uniques · Provenance éthique
          </p>
        </div>

        {/* Grille catégories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/taxidermie/${cat.slug}`}
              className="group block"
            >
              {/* Bloc image avec effet hover */}
              <div className="relative aspect-[3/4] overflow-hidden mb-5 bg-neutral-200">

                {/* Image principale */}
                <Image
                  src={cat.primaryImage}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                />

                {/* Image hover — glisse depuis le bas */}
                <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                  <Image
                    src={cat.hoverImage}
                    alt={`${cat.label} — vue alternative`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                  />
                </div>

                {/* Overlay texte en bas */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/50 to-transparent px-6 py-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
                  <p className="font-mono text-[0.58rem] tracking-[0.25em] uppercase text-white/70">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Texte sous la photo */}
              <div className="flex items-end justify-between">
                <div>
                  <div className="font-mono text-[0.58rem] tracking-[0.2em] uppercase text-neutral-400 mb-1">
                    {cat.latin}
                  </div>
                  <h2 className="font-serif text-2xl font-light italic group-hover:opacity-60 transition-opacity duration-300">
                    {cat.label}
                  </h2>
                </div>
                <span className="text-neutral-400 text-sm mb-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-24 text-center">
          <div className="font-mono text-[0.65rem] tracking-[0.3em] uppercase opacity-50">
            Toutes nos pièces sont conformes à la réglementation CITES
          </div>
        </div>
      </div>
    </div>
  );
}
