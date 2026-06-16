"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("sadsat_cookie_consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("sadsat_cookie_consent", "accepted");
    setVisible(false);
  }

  function refuse() {
    localStorage.setItem("sadsat_cookie_consent", "refused");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-[0.72rem] text-neutral-400 leading-relaxed flex-1">
          Ce site utilise des cookies strictement nécessaires à son fonctionnement (session, panier).{" "}
          <Link href="/politique-confidentialite" className="underline hover:text-neutral-200 transition-colors">
            Politique de confidentialité
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={refuse}
            className="text-[0.6rem] tracking-[0.2em] uppercase text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2.5 bg-neutral-100 text-neutral-900 hover:bg-white transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
