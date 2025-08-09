"use client";

import React, { useEffect, useRef } from "react";

type MarqueeProps = {
  children: React.ReactNode;
  speed?: number; // px/s
};

export function Marquee({ children, speed = 60 }: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!container || !track || !group) return;
    if (typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    // ضمّن ما يكفي من التكرارات لتغطية العرض بشكل مستمر بدون فراغات
    const ensureFill = () => {
      const containerWidth = container.clientWidth;
      const groupWidth = group.scrollWidth;
      // كرّر المجموعات لغاية ما يصير طول المسار > ضعفي عرض الحاوية (مع هامش أمان)
      while (track.scrollWidth < containerWidth * 2 + groupWidth) {
        const clone = group.cloneNode(true) as HTMLDivElement;
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
      }
      return groupWidth;
    };
    const seamWidth = ensureFill();
    let rafId = 0;
    let start: number | null = null;
    let x = 0;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const dt = (ts - start) / 1000;
      start = ts;
      x -= speed * dt;
      // ارجع إلى بداية المسار عند نهاية مجموعة واحدة
      if (-x >= seamWidth) x += seamWidth;
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
        <div ref={groupRef} className="flex gap-8">
          {children}
        </div>
      </div>
    </div>
  );
}


