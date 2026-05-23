"use client";

import { useActionState } from "react";
import { newsletterSubscribeAction, type NewsletterState } from "@/app/actions/newsletter";

export default function NewsletterForm() {
  const [state, action, pending] = useActionState<NewsletterState, FormData>(
    newsletterSubscribeAction,
    undefined
  );

  if (state?.status === "ok" || state?.status === "already") {
    return (
      <p className="text-[0.72rem] tracking-wide text-neutral-500">
        {state.status === "already"
          ? "Vous êtes déjà inscrit(e) à notre newsletter."
          : "Merci — vous recevrez nos actualités en avant-première."}
      </p>
    );
  }

  return (
    <form action={action} className="flex gap-2 w-full max-w-sm">
      <input
        type="email"
        name="email"
        required
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
      {state?.status === "invalid" && (
        <p className="absolute mt-12 text-[0.62rem] text-red-400">Email invalide.</p>
      )}
    </form>
  );
}
