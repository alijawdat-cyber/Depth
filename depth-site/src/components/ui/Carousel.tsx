"use client";

import React, { useCallback, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";

type CarouselProps = {
  options?: EmblaOptionsType;
  children: React.ReactNode;
  className?: string;
};

export function Carousel({ options, children, className }: CarouselProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
    ...options,
  });
  const setRefs = useCallback((node: HTMLDivElement | null) => {
    viewportRef.current = node;
    emblaRef(node);
  }, [emblaRef]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) return emblaApi.scrollPrev();
    viewportRef.current?.scrollBy({ left: -((viewportRef.current?.clientWidth ?? 320) * 0.9), behavior: "smooth" });
  }, [emblaApi]);
  const scrollNext = useCallback(() => {
    if (emblaApi) return emblaApi.scrollNext();
    viewportRef.current?.scrollBy({ left: ((viewportRef.current?.clientWidth ?? 320) * 0.9), behavior: "smooth" });
  }, [emblaApi]);

  return (
    <div className={className} role="region" aria-roledescription="carousel">
      <div className="overflow-hidden" ref={setRefs} style={{ touchAction: "pan-y" }}>
        <div className="flex gap-6" aria-live="polite">
          {children}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button type="button" aria-label="السابق" onClick={scrollPrev} className="h-9 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)]">◀</button>
        <button type="button" aria-label="التالي" onClick={scrollNext} className="h-9 px-3 rounded-[var(--radius-sm)] border border-[var(--elev)]">▶</button>
      </div>
    </div>
  );
}


