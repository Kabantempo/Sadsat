"use client";
import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";

// Arrière-plan du haut de l'accueil : des « veines » organiques dessinées en caractères ASCII tramés (dither),
// sur les bords de l'écran, centre laissé sombre pour le titre. Décoratif (aria-hidden), très lent, figé si
// l'utilisateur demande moins d'animations. En noir et blanc. Inspiré des effets « ASCII art » de 21st.dev.

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const RAMP = [".", "·", ":", "+", "x", "#"];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export default function AsciiField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noise = createNoise3D(mulberry32(42));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = 0;
    let W = 0, H = 0, cell = 11, cols = 0, rows = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = parent.clientWidth; H = parent.clientHeight;
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cell = W < 640 ? 12 : 9; // plus gros (donc moins de cases à calculer) sur téléphone
      cols = Math.ceil(W / cell); rows = Math.ceil(H / (cell * 1.25));
      draw(performance.now());
    };

    const draw = (now: number) => {
      ctx.clearRect(0, 0, W, H);
      ctx.font = `${cell}px ui-monospace, "JetBrains Mono", monospace`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      const t = reduced ? 3 : now * 0.00004;
      const strengthScale = W < 640 ? 0.55 : 1;
      for (let j = 0; j < rows; j++) {
        const ny = j / rows;
        const my = 0.4 + 0.6 * (1 - smooth(0.55, 1.05, Math.abs(ny - 0.5) * 2));
        for (let i = 0; i < cols; i++) {
          const nx = i / cols;
          const edge = smooth(0.34, 0.9, Math.abs(nx - 0.5) * 2); // 0 au centre, 1 sur les bords
          if (edge <= 0.02) continue;
          const f = 3.1;
          const v = noise(nx * f * 1.6, ny * f, t) + 0.5 * noise(nx * f * 3.4 + 7, ny * f * 2.2, t * 1.4);
          const ridge = 1 - Math.abs(v);
          const s = smooth(0.72, 0.99, ridge) * edge * my;
          if (s <= 0.03) continue;
          // trame ordonnée (Bayer) : donne l'aspect « dither »
          if (s < (BAYER[(i & 3) + ((j & 3) << 2)] / 16) * 0.85) continue;
          const ch = RAMP[Math.min(RAMP.length - 1, Math.floor(s * RAMP.length * 1.15))];
          const alpha = (0.12 + s * 0.55) * strengthScale;
          ctx.fillStyle = `rgba(236,236,236,${alpha.toFixed(3)})`;
          ctx.fillText(ch, i * cell + cell / 2, j * cell * 1.25 + cell / 2);
        }
      }
    };

    const loop = (now: number) => {
      if (now - last > (W < 640 ? 160 : 90)) { last = now; draw(now); } // 6 à 11 images par seconde : lent et léger
      raf = requestAnimationFrame(loop);
    };

    // Démarrage différé : seulement quand la page est chargée et le navigateur inactif, pour ne rien
    // retarder l'affichage du titre (LCP) ni bloquer le fil principal.
    const ro = new ResizeObserver(resize);
    let timer = 0;
    let idle = 0;
    const start = () => {
      ro.observe(parent);
      resize();
      if (!reduced) raf = requestAnimationFrame(loop);
    };
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(start, { timeout: 2500 });
      else timer = window.setTimeout(start, 400);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      if (idle && typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="hero-ascii" />;
}
