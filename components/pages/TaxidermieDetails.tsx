"use client";
import { useState } from "react";
import Link from "next/link";
import Accordion, { type AccordionItem } from "@/components/shared/Accordion";
import { ChevronDown } from "lucide-react";

type Props = {
  process: AccordionItem[];
  faq: AccordionItem[];
};

export default function TaxidermieDetails({ process, faq }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-8 mb-24">
      {/* Bouton toggle */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="group flex items-center gap-3 text-left"
      >
        <span className="font-mono text-[0.62rem] tracking-[0.24em] uppercase text-neutral-500 group-hover:text-neutral-900 transition-colors">
          En savoir plus
        </span>
        <ChevronDown
          size={14}
          strokeWidth={1.5}
          className={`text-neutral-400 group-hover:text-neutral-700 transition-all duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Contenu repliable */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] ${
          open ? "max-h-[2000px] opacity-100 mt-10" : "max-h-0 opacity-0 mt-0"
        }`}
      >
        {/* Notre processus */}
        <div className="mb-12">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-400 mb-6">
            Notre processus
          </p>
          <Accordion items={process} theme="light" />
        </div>

        {/* FAQ */}
        <div id="faq">
          <p className="font-mono text-[0.62rem] tracking-[0.28em] uppercase text-neutral-400 mb-6">
            Questions fréquentes
          </p>
          <Accordion items={faq} theme="light" />
          <div className="mt-10 flex items-center gap-6">
            <Link
              href="/contact"
              className="inline-block text-[0.62rem] tracking-[0.22em] uppercase px-7 py-3.5 bg-neutral-900 text-white hover:bg-neutral-700 transition-colors"
            >
              Poser une question
            </Link>
            <Link
              href="/a-propos"
              className="text-[0.62rem] tracking-[0.16em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors underline underline-offset-4"
            >
              En savoir plus sur SADSAT →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
