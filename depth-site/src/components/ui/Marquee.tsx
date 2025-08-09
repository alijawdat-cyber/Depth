"use client";

import React, { useEffect, useRef } from "react";

type MarqueeProps = {
  children: React.ReactNode;
  speed?: number; // px/s
};

export function Marquee({ children, speed = 60 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    let rafId = 0;
    let start: number | null = null;
    let x = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const dt = (ts - start) / 1000;
      start = ts;
      x -= speed * dt;
      const w = track.scrollWidth / 2;
      if (-x >= w) x += w;
      track.style.transform = `translateX(${x}px)`;
      rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [speed]);

  return (
    <div ref={containerRef} className="overflow-hidden group">
      <div
        ref={trackRef}
        className="flex gap-8 whitespace-nowrap will-change-transform motion-reduce:transform-none motion-reduce:transition-none group-hover:[animation-play-state:paused]"
      >
        {children}
        {children}
      </div>
    </div>
  );
}


