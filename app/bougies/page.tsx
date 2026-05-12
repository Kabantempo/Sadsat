"use client";

import { useEffect, useState } from "react";
import MatrixRain from "@/components/shared/MatrixRain";

export default function BougiesPage() {
  const [text, setText] = useState("");
  const fullText = "> initializing.candle.system_";

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 60);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-black relative overflow-hidden" style={{ color: "#00ff41" }}>

      {/* Arrière-plan Matrix — z-0, opacité basse */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <MatrixRain />
      </div>

      {/* Contenu — z-10 pour passer devant */}
      <div className="max-w-6xl mx-auto px-8 relative z-10 font-mono">
        <div className="text-center mb-20">
          <div className="text-[0.7rem] tracking-[0.3em] mb-6" style={{ color: "#008f11" }}>
            &gt; SYS_03
          </div>
          <h1
            className="font-mono font-normal text-6xl md:text-7xl mb-6"
            style={{ textShadow: "0 0 16px #00ff41" }}
          >
            Bougies
          </h1>
          <p className="text-sm tracking-[0.15em] opacity-80">
            {text}<span className="animate-pulse">|</span>
          </p>
        </div>

        {/* En cours */}
        <div className="flex flex-col items-center justify-center py-24 gap-10">
          <div
            className="border px-16 py-12 flex flex-col items-center gap-6 max-w-md w-full"
            style={{ borderColor: "rgba(0, 255, 65, 0.25)" }}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41] animate-pulse" />
            <div className="text-4xl md:text-5xl font-mono" style={{ textShadow: "0 0 20px #00ff41" }}>
              En cours
            </div>
            <p className="text-[0.7rem] tracking-[0.2em] uppercase text-center opacity-60">
              &gt; collection.build :: in_progress
            </p>
          </div>
          <p className="font-mono text-[0.68rem] tracking-wide opacity-50 text-center max-w-sm leading-relaxed">
            La collection Bougies est en cours de création.<br />
            Elle sera disponible très prochainement.
          </p>
        </div>

        <div
          className="mt-8 text-center border-t pt-12"
          style={{ borderColor: "rgba(0, 255, 65, 0.15)" }}
        >
          <div className="text-[0.7rem] tracking-[0.2em] opacity-70">
            &gt; system.ready :: awaiting_collection
          </div>
        </div>
      </div>
    </div>
  );
}
