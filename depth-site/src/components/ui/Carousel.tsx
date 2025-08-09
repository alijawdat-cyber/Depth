"use client";

import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

type CarouselProps = {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  className?: string;
};

export function Carousel({ options, children, className }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
    ...options,
  });
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className={className} role="region" aria-roledescription="carousel">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-6" aria-live="polite">
          {children}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button aria-label="السابق" onClick={scrollPrev} className="h-9 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)]">◀</button>
        <button aria-label="التالي" onClick={scrollNext} className="h-9 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)]">▶</button>
      </div>
    </div>
  );
}


