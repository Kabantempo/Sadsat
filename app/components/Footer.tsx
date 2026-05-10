export default function Footer() {
  return (
    <footer className="w-full border-t border-black/[.08] dark:border-white/[.1] bg-white dark:bg-black">
      <div className="mx-auto max-w-3xl px-16 py-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
            My App
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} — Tous droits réservés
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {[
            { label: "Documentation", href: "https://nextjs.org/docs" },
            { label: "Templates", href: "https://vercel.com/templates" },
            { label: "GitHub", href: "https://github.com" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50 transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
