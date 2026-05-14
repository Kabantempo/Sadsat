"use client";
import { useState } from "react";
import Link from "next/link";
import Accordion, { type AccordionItem } from "@/components/shared/Accordion";
import MaterialTabs from "@/components/shared/MaterialTabs";
import { ChevronDown } from "lucide-react";

type Props = { faq: AccordionItem[] };

export default function BijouxDetails({ faq }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto mb-24">
      {/* Bouton toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-3 text-left"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.24em] uppercase text-neutral-600 group-hover:text-neutral-200 transition-colors">
          En savoir plus
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`text-neutral-600 group-hover:text-neutral-300 transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Contenu repliable */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          open ? "max-h-[2000px] opacity-100 mt-10" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        {/* Matériaux */}
        <div className="mb-12">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-600 mb-6">
            Les matériaux
          </p>
          <MaterialTabs />
        </div>

        {/* FAQ */}
        <div id="faq">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-600 mb-6">
            Questions fréquentes
          </p>
          <Accordion items={faq} theme="dark" />
          <div className="mt-10 flex items-center gap-6">
            <Link
              href="/contact"
              className="inline-block text-[0.62rem] tracking-[0.22em] uppercase px-7 py-3.5 border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              Poser une question
            </Link>
            <Link
              href="/a-propos"
              className="text-[0.62rem] tracking-[0.16em] uppercase text-neutral-600 hover:text-neutral-200 transition-colors underline underline-offset-4"
            >
              En savoir plus sur SADSAT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
