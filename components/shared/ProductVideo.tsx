"use client";
import { useEffect, useRef } from "react";

const MAX_SECONDS = 5;

export default function ProductVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const clip = () => {
      if (v.currentTime > MAX_SECONDS) v.currentTime = 0;
    };
    v.addEventListener("timeupdate", clip);
    return () => v.removeEventListener("timeupdate", clip);
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
    />
  );
}
