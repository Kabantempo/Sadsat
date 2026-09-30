"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const KEY = "sadsat_cookie_consent";
const OPEN_EVENT = "sadsat:cookie-settings";
// Le consentement est redemandé au bout de 6 mois (recommandation CNIL : 6 mois maximum).
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;

type Stored = { analytics: boolean; at: number };

function read(): Stored | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as Stored;
    if (typeof v.analytics !== "boolean" || typeof v.at !== "number") return null;
    return Date.now() - v.at > MAX_AGE_MS ? null : v;
  } catch {
    return null;
  }
}

function write(analytics: boolean) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ analytics, at: Date.now() } satisfies Stored));
  } catch {}
}

function loadAnalytics(gaId: string) {
  if (document.getElementById("ga-script")) {
    (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = false;
    return;
  }
  const s = document.createElement("script");
  s.id = "ga-script";
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
  document.head.appendChild(s);
  const w = window as unknown as { dataLayer: unknown[]; gtag: (...args: unknown[]) => void };
  w.dataLayer = w.dataLayer || [];
  // gtag exige l'objet arguments (pas un tableau) : ne pas remplacer par des paramètres rest.
  // eslint-disable-next-line prefer-rest-params
  w.gtag = function () { w.dataLayer.push(arguments); };
  w.gtag("js", new Date());
  w.gtag("config", gaId, { anonymize_ip: true });
}

function unloadAnalytics(gaId: string) {
  (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true;
  // Supprime les cookies de mesure déjà déposés (_ga, _ga_XXXX).
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (name === "_ga" || name.startsWith("_ga_") || name === "_gid") {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
    }
  });
}

export default function CookieConsent({ gaId }: { gaId?: string }) {
  const [visible, setVisible] = useState(false);

  const apply = useCallback((analytics: boolean) => {
    if (!gaId) return;
    if (analytics) loadAnalytics(gaId);
    else unloadAnalytics(gaId);
  }, [gaId]);

  useEffect(() => {
    const stored = read();
    if (!stored) setVisible(true);
    else apply(stored.analytics);
    const open = () => setVisible(true);
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, [apply]);

  function choose(analytics: boolean) {
    write(analytics);
    apply(analytics);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Choix des cookies" className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-[0.72rem] text-neutral-400 leading-relaxed flex-1">
          SADSAT utilise des cookies indispensables (session, panier) qui ne nécessitent pas votre accord.
          {gaId ? " Avec votre accord, nous utilisons aussi Google Analytics pour mesurer l'audience du site (statistiques anonymisées)." : ""}{" "}
          Vous pouvez changer d'avis à tout moment via « Gérer les cookies » en bas de page.{" "}
          <Link href="/politique-confidentialite" className="underline hover:text-neutral-200 transition-colors">
            Politique de confidentialité
          </Link>
        </p>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => choose(false)}
            className="text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2.5 border border-neutral-600 text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            Tout refuser
          </button>
          <button
            onClick={() => choose(true)}
            className="text-[0.6rem] tracking-[0.2em] uppercase px-5 py-2.5 border border-neutral-600 text-neutral-200 hover:bg-neutral-800 transition-colors"
          >
            Tout accepter
          </button>
        </div>
      </div>
    </div>
  );
}

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      Gérer les cookies
    </button>
  );
}
