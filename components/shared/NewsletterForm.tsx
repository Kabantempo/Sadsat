"use client";

import { useActionState } from "react";
import Link from "next/link";
import { newsletterSubscribeAction, type NewsletterState } from "@/app/actions/newsletter";

const ERRORS: Record<string, string> = {
  invalid: "Email invalide.",
  consent: "Merci de cocher la case pour vous inscrire.",
  rate: "Trop de tentatives, réessayez plus tard.",
  error: "L'email de confirmation n'a pas pu être envoyé. Réessayez plus tard.",
  disabled: "La newsletter est momentanément indisponible.",
};

export default function NewsletterForm() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    newsletterSubscribeAction,
    undefined
  );

  if (state?.status === "ok") {
    return (
      <p className="text-[0.72rem] tracking-wide text-neutral-500" role="status">
        Presque fini : un email de confirmation vient de vous être envoyé. Cliquez sur le lien qu&apos;il contient pour valider votre inscription.
      </p>
    );
  }

  const error = state ? ERRORS[state.status] : undefined;

  return (
    <form action={action} className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex gap-2">
        <input
          type="email"
          name="email"
          required
          aria-label="Votre adresse email"
          placeholder="votre@email.com"
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-[0.72rem] text-neutral-300 placeholder:text-neutral-700 outline-none focus:border-neutral-600 transition-colors min-w-0"
        />
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-3 border border-neutral-800 rounded-lg text-[0.6rem] tracking-[0.22em] uppercase text-neutral-500 hover:bg-neutral-900 hover:text-neutral-100 transition-colors duration-200 whitespace-nowrap disabled:opacity-50"
        >
          {pending ? "…" : "S'inscrire"}
        </button>
      </div>
      <label className="flex items-start gap-2 text-[0.62rem] leading-relaxed text-neutral-500">
        <input type="checkbox" name="consent" required className="mt-0.5 shrink-0" />
        <span>
          J&apos;accepte de recevoir la newsletter de SADSAT par email. Je peux me désinscrire à tout moment.{" "}
          <Link href="/politique-confidentialite" className="underline hover:text-neutral-300">Politique de confidentialité</Link>
        </span>
      </label>
      {error && <p className="text-[0.62rem] text-red-400" role="alert">{error}</p>}
    </form>
  );
}
