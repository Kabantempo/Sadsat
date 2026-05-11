import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 px-8 text-center border-t border-white/5 bg-black text-neutral-500">
      <div className="font-serif text-lg tracking-[0.2em] mb-4 text-neutral-300">SADSAT</div>
      <div className="flex justify-center gap-6 text-[0.7rem] tracking-[0.2em] uppercase mb-6">
        <Link href="/contact" className="hover:text-neutral-200 transition">Contact</Link>
        <Link href="/cgv" className="hover:text-neutral-200 transition">CGV</Link>
        <Link href="/mentions-legales" className="hover:text-neutral-200 transition">Mentions légales</Link>
      </div>
      <div className="text-[0.65rem] tracking-[0.25em] uppercase opacity-60">
        © {new Date().getFullYear()} SADSAT — Tous droits réservés
      </div>
    </footer>
  );
}
