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

    // تحسين للموبايل وSafari - تقليل الحركة
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const isSafari = typeof window !== "undefined" && /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // تقليل السرعة للموبايل وSafari لتحسين الأداء
    const adjustedSpeed = isMobile || isSafari ? speed * 0.7 : speed;

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

      x -= adjustedSpeed * dt;

      const seam = seamRef.current || 1;
      if (-x >= seam) {
        const cycles = Math.floor(-x / seam);
        x += cycles * seam; // التفاف دقيق
      }

      track.style.transform = `translateX(${x}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    const waitImages = async () => {
      const imgs = Array.from(group.querySelectorAll("img"));
      if (!imgs.length) return;

      await Promise.allSettled(
        imgs.map((img) => {
          const candidate = img as HTMLImageElement & { decode?: () => Promise<void> };
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

      // Clone واحد للقياس
      const firstClone = group.cloneNode(true) as HTMLDivElement;
      firstClone.setAttribute("aria-hidden", "true");
      firstClone.setAttribute("data-marquee-clone", "true");
      track.appendChild(firstClone);

      // قياس seam فعلياً (يشمل gap الحقيقي)
      let seam =
        Math.abs(
          (track.children[1] as HTMLElement).offsetLeft -
            (track.children[0] as HTMLElement).offsetLeft
        ) || 0;

      if (!seam) {
        const cs = getComputedStyle(track);
        const colGap =
          parseFloat(cs.columnGap || (cs.gap?.split?.(" ")?.[0] ?? "0")) || 0;
        seam = group.offsetWidth + colGap;
      }
      seamRef.current = seam;

      // نسخ كافية لتغطية ≥ 3x من العرض
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
      {/* فجوة بين نسخ المجموعة: مضغوطة جداً على الموبايل وتكبر تدريجياً */}
      <div
        ref={trackRef}
        className="
          flex flex-nowrap whitespace-nowrap will-change-transform
          gap-x-[1px] sm:gap-x-3 md:gap-x-6 lg:gap-x-8 xl:gap-x-10
          motion-reduce:transform-none motion-reduce:transition-none
        "
      >
        {/* داخل المجموعة: شعار جنب شعار جداً على الموبايل */}
        <div
          ref={groupRef}
          className="
            flex items-center flex-nowrap
            gap-x-[1px] sm:gap-x-2 md:gap-x-4 lg:gap-x-6 xl:gap-x-8
            [&>*]:shrink-0
            [&_*]:m-0 [&_*]:gap-0
            ![&_*]:p-0 sm:[&_*]:px-1 md:[&_*]:px-2 lg:[&_*]:px-4
            [&_img]:block
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}
