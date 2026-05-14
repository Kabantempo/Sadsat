"use client";
import { useActionState } from "react";
import { sendContactAction, type ContactState } from "@/app/actions/contact";
import { CheckCircle, Send } from "lucide-react";

const SUBJECTS = [
  "Demande d'acquisition",
  "Commande sur mesure",
  "Collaboration créateur",
  "Information produit",
  "Autre",
];

export default function ContactPage() {
  const [state, action, pending] = useActionState<ContactState, FormData>(
    sendContactAction,
    undefined
  );

  if (state?.success) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <CheckCircle size={40} strokeWidth={1} className="text-green-500 mx-auto mb-6" />
          <h1 className="font-serif font-light text-3xl italic text-neutral-100 mb-3">
            Message envoyé
          </h1>
          <p className="text-[0.82rem] text-neutral-500 leading-relaxed mb-8">
            Nous avons bien reçu votre message et vous répondrons dans les plus brefs délais.
          </p>
          <a
            href="/"
            className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-400 hover:text-neutral-100 transition-colors border-b border-neutral-700 hover:border-neutral-400 pb-0.5"
          >
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 pt-32 pb-24">
      <div className="max-w-2xl mx-auto px-8">

        {/* En-tête */}
        <div className="mb-14">
          <p className="font-mono text-[0.55rem] tracking-[0.28em] uppercase text-neutral-600 mb-3">
            SADSAT
          </p>
          <h1 className="font-serif font-light text-5xl italic text-neutral-100 mb-4">
            Contact
          </h1>
          <p className="text-[0.85rem] text-neutral-500 leading-relaxed">
            Pour toute question, commande sur mesure ou collaboration, nous vous répondons personnellement.
          </p>
        </div>

        <form action={action} className="space-y-6">
          {state?.message && (
            <p className="text-[0.72rem] text-red-400 tracking-wide">{state.message}</p>
          )}

          {/* Nom + Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-2">
                Nom
              </label>
              <input
                name="name"
                type="text"
                required
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
                placeholder="Votre nom"
              />
              {state?.errors?.name && (
                <p className="mt-1 text-[0.62rem] text-red-400">{state.errors.name[0]}</p>
              )}
            </div>
            <div>
              <label className="block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-2">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-500 transition-colors"
                placeholder="votre@email.com"
              />
              {state?.errors?.email && (
                <p className="mt-1 text-[0.62rem] text-red-400">{state.errors.email[0]}</p>
              )}
            </div>
          </div>

          {/* Sujet */}
          <div>
            <label className="block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-2">
              Sujet
            </label>
            <select
              name="subject"
              required
              className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-500 transition-colors appearance-none"
            >
              <option value="">Choisir un sujet…</option>
              {SUBJECTS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {state?.errors?.subject && (
              <p className="mt-1 text-[0.62rem] text-red-400">{state.errors.subject[0]}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <label className="block font-mono text-[0.55rem] tracking-[0.22em] uppercase text-neutral-600 mb-2">
              Message
            </label>
            <textarea
              name="message"
              required
              rows={6}
              className="w-full bg-neutral-900 border border-neutral-800 px-4 py-3 text-[0.85rem] text-neutral-100 outline-none focus:border-neutral-500 transition-colors resize-none"
              placeholder="Décrivez votre demande…"
            />
            {state?.errors?.message && (
              <p className="mt-1 text-[0.62rem] text-red-400">{state.errors.message[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-neutral-100 text-neutral-900 text-[0.62rem] tracking-[0.24em] uppercase font-medium hover:bg-white transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Send size={13} strokeWidth={1.5} />
            {pending ? "Envoi en cours…" : "Envoyer le message"}
          </button>

          <p className="text-center text-[0.58rem] text-neutral-700 tracking-wider">
            Ou directement à{" "}
            <a href="mailto:contact@sadsat.fr" className="text-neutral-500 hover:text-neutral-300 transition-colors">
              contact@sadsat.fr
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
