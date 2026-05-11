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

        <div className="max-w-2xl mx-auto text-center mb-24">
          <p className="text-base md:text-lg leading-relaxed opacity-80">
            <span style={{ color: "#008f11" }}>$</span> echo &quot;la lumière comme un protocole&quot;
          </p>
        </div>

        {/* Grille produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="group cursor-pointer border p-4 hover:bg-[#00ff41]/5 transition-colors"
              style={{ borderColor: "rgba(0, 255, 65, 0.2)" }}
            >
              <div
                className="aspect-square bg-black mb-4 overflow-hidden border"
                style={{ borderColor: "rgba(0, 255, 65, 0.1)" }}
              >
                <div className="w-full h-full group-hover:opacity-80 transition-opacity duration-500 flex items-center justify-center">
                  <span className="text-[#008f11] text-4xl opacity-30">[ ]</span>
                </div>
              </div>
              <div>
                <div className="text-sm mb-1">
                  candle_{String(i).padStart(3, "0")}.exe
                </div>
                <div className="text-[0.65rem] tracking-widest opacity-50" style={{ color: "#008f11" }}>
                  status: standby
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-32 text-center border-t pt-12"
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
