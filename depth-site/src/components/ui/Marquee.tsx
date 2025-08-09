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

  const seamRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    const group = groupRef.current;
    if (!container || !track || !group) return;

    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let x = 0;
    let last = 0;

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const animate = (t: number) => {
      if (!last) last = t;
      const dt = (t - last) / 1000;
      last = t;

      x -= speed * dt;

      const seam = seamRef.current || 1;
      if (-x >= seam) {
        const cycles = Math.floor(-x / seam);
        x += cycles * seam; // التفاف دقيق بدون انجراف
      }

      track.style.transform = `translateX(${x}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const waitImages = async () => {
      const imgs = Array.from(group.querySelectorAll("img"));
      if (!imgs.length) return;

      await Promise.allSettled(
        imgs.map((img) => {
          // decode يعطي قياس أدق لو متاح
          const candidate = img as HTMLImageElement & {
            decode?: () => Promise<void>;
          };
          if (typeof candidate.decode === "function") return candidate.decode();
          if (img.complete) return Promise.resolve();
          return new Promise<void>((res) => {
            img.addEventListener("load", () => res(), { once: true });
            img.addEventListener("error", () => res(), { once: true });
          });
        })
      );
    };

    const build = async () => {
      stop();
      track.style.transform = "translateX(0px)";
      x = 0;
      last = 0;

      // إزالة الكلونات السابقة
      Array.from(track.querySelectorAll("[data-marquee-clone]")).forEach((n) =>
        n.remove()
      );

      await waitImages();

      // نضيف Clone واحد ونقيس المسافة بين بدايات النسختين
      const firstClone = group.cloneNode(true) as HTMLDivElement;
      firstClone.setAttribute("aria-hidden", "true");
      firstClone.setAttribute("data-marquee-clone", "true");
      track.appendChild(firstClone);

      // قياس seam فعلياً
      let seam =
        Math.abs(
          (track.children[1] as HTMLElement).offsetLeft -
            (track.children[0] as HTMLElement).offsetLeft
        ) || 0;

      if (!seam) {
        // خطة بديلة: عرض المجموعة + الـrowGap الحقيقي
        const cs = getComputedStyle(track);
        const rowGap =
          parseFloat(cs.rowGap || (cs.gap?.split?.(" ")?.[0] ?? "0")) || 0;
        seam = group.offsetWidth + rowGap;
      }
      seamRef.current = seam;

      // ضمان تغطية عرض >= 3x الكونتينر
      const needed = Math.max(2, Math.ceil((container.offsetWidth * 3) / seam));
      for (let i = 1; i < needed; i++) {
        const clone = group.cloneNode(true) as HTMLDivElement;
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("data-marquee-clone", "true");
        track.appendChild(clone);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const ro = new ResizeObserver(() => build());
    ro.observe(container);

    build();

    return () => {
      stop();
      ro.disconnect();
    };
  }, [speed]);

  return (
    <div ref={containerRef} className="overflow-hidden" dir="ltr">
      <div
        ref={trackRef}
        className="flex flex-nowrap gap-10 whitespace-nowrap will-change-transform motion-reduce:transform-none motion-reduce:transition-none"
      >
        <div ref={groupRef} className="flex gap-10">
          {children}
        </div>
      </div>
    </div>
  );
}
