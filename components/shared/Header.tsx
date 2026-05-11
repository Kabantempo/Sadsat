"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Adapte le style du header selon l'univers visité
  const universe = pathname.startsWith("/taxidermie")
    ? "taxidermie"
    : pathname.startsWith("/bijoux")
    ? "bijoux"
    : pathname.startsWith("/bougies")
    ? "bougies"
    : "default";

  const styles = {
    default: "bg-black/55 text-neutral-200 border-white/5",
    taxidermie: "bg-white/85 text-neutral-900 border-neutral-200",
    bijoux: "bg-black/80 text-neutral-100 border-red-900/30",
    bougies: "bg-black/90 text-[#00ff41] border-[#00ff41]/20 font-mono",
  } as const;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 md:px-10 py-5 backdrop-blur-md border-b transition-colors duration-500 ${styles[universe]}`}
    >
      <Link href="/" className="font-serif text-xl tracking-[0.2em]">
        SADSAT
      </Link>
      <nav className="flex items-center gap-4 md:gap-8 text-[0.7rem] md:text-[0.75rem] tracking-[0.15em] uppercase">
        <Link href="/taxidermie" className="hover:opacity-60 transition">Taxidermie</Link>
        <Link href="/bijoux" className="hover:opacity-60 transition hidden sm:inline">Bijoux</Link>
        <Link href="/bougies" className="hover:opacity-60 transition hidden sm:inline">Bougies</Link>
        <Link href="/a-propos" className="hover:opacity-60 transition hidden md:inline">À propos</Link>
        <Link href="/panier" className="hover:opacity-60 transition">Panier (0)</Link>
      </nav>
    </header>
  );
}
