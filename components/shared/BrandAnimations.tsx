"use client";
import { useEffect, useRef } from "react";

// ── Crystal Pets — bulles de liquide de conservation, teintures turquoise / violet / corail ──────────────────────────────────────────
export function TaxidermieAnim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Particle = { x: number; y: number; r: number; vx: number; vy: number; opacity: number; phase: number; rgb: string };
    let particles: Particle[] = [];
    let raf: number;

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.offsetWidth;
      canvas.height = p.offsetHeight;
      const TEINTES = ["25, 189, 184", "25, 189, 184", "107, 47, 160", "176, 42, 114", "239, 91, 58"];
      particles = Array.from({ length: 48 }, () => ({
        rgb: TEINTES[Math.floor(Math.random() * TEINTES.length)],
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.15),
        opacity: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() / 1000;
      particles.forEach((p) => {
        p.x += p.vx + Math.sin(t + p.phase) * 0.18;
        p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.rgb}, ${p.opacity})`;
        ctx.fill();
        ctx.lineWidth = 0.6;
        ctx.strokeStyle = `rgba(${p.rgb}, ${Math.min(p.opacity + 0.15, 0.6)})`;
        ctx.stroke();
      });
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
// ── HACKCYCLE — fils de tissu ─────────────────────────────────────────────────
export function HackcycleAnim() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Thread = { x: number; y: number; cp1x: number; cp1y: number; cp2x: number; cp2y: number; ex: number; ey: number; speed: number; offset: number; opacity: number; width: number };
    let threads: Thread[] = [];
    let raf: number;

    const makeThread = (w: number, h: number): Thread => {
      const y = Math.random() * h;
      return {
        x: -60,
        y,
        cp1x: w * 0.25 + (Math.random() - 0.5) * 80,
        cp1y: y + (Math.random() - 0.5) * 120,
        cp2x: w * 0.65 + (Math.random() - 0.5) * 80,
        cp2y: y + (Math.random() - 0.5) * 120,
        ex: w + 60,
        ey: y + (Math.random() - 0.5) * 60,
        speed: Math.random() * 0.003 + 0.001,
        offset: Math.random(),
        opacity: Math.random() * 0.18 + 0.05,
        width: Math.random() * 1.2 + 0.3,
      };
    };

    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.offsetWidth;
      canvas.height = p.offsetHeight;
      threads = Array.from({ length: 18 }, () => makeThread(canvas.width, canvas.height));
    };

    const ro = new ResizeObserver(resize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() / 1000;

      threads.forEach((th) => {
        const wave = Math.sin(t * th.speed * 60 + th.offset * Math.PI * 2) * 30;
        ctx.beginPath();
        ctx.moveTo(th.x, th.y + wave);
        ctx.bezierCurveTo(
          th.cp1x, th.cp1y + wave * 0.7,
          th.cp2x, th.cp2y + wave * 0.5,
          th.ex, th.ey + wave * 0.3
        );
        ctx.strokeStyle = `rgba(184, 168, 130, ${th.opacity})`;
        ctx.lineWidth = th.width;
        ctx.stroke();
      });

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}
